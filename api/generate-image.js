// ============================================================================
// GENERADOR DE IMÁGENES CON IMAGEN 3 (Google)
// ============================================================================
// Endpoint: /api/generate-image
// Modelo: imagen-3.0-generate-001 (último modelo de Google)
// ============================================================================

export default async function handler(req, res) {
  // CORS
  res.setHeader("Content-Type", "application/json");
  res.setHeader("Access-Control-Allow-Credentials", true);
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET,OPTIONS,PATCH,DELETE,POST,PUT"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version"
  );

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método no permitido" });
  }

  try {
    const {
      prompt,
      referenceImage,
      aspectRatio = "1:1",
      numberOfImages = 1,
      negativePrompt,
    } = req.body;

    const API_KEY = process.env.GEMINI_API_KEY;

    if (!API_KEY) {
      console.error("❌ API key no configurada");
      return res
        .status(500)
        .json({ error: "API key no configurada en el servidor" });
    }

    if (!prompt) {
      return res.status(400).json({ error: "El prompt es requerido" });
    }

    console.log("🎨 Generando imagen con Imagen 3...");
    console.log("📝 Prompt:", prompt);
    console.log("📐 Aspect Ratio:", aspectRatio);

    // ============================================================================
    // LLAMADA A IMAGEN 3 VÍA GENERATIVE LANGUAGE API
    // ============================================================================
    
    // Construir el body de la petición según la documentación oficial
    const requestBody = {
      instances: [
        {
          prompt: prompt,
        },
      ],
      parameters: {
        sampleCount: Math.min(numberOfImages, 4), // Máximo 4 imágenes
        aspectRatio: aspectRatio, // "1:1", "3:4", "4:3", "9:16", "16:9"
        negativePrompt: negativePrompt || "",
        safetySetting: "block_some",
        personGeneration: "allow_adult",
      },
    };

    // Si hay imagen de referencia, añadir configuración
    if (referenceImage) {
      requestBody.instances[0].referenceImage = {
        bytesBase64Encoded: referenceImage,
      };
    }

    // Usar el endpoint correcto con :predict
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/imagen-3.0-generate-002:predict`;
    
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "x-goog-api-key": API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("❌ Error de Imagen 3:", errorData);
      throw new Error(errorData.error?.message || "Error al generar imagen");
    }

    const data = await response.json();

    // Extraer las imágenes generadas
    const images = data.predictions.map((prediction) => ({
      base64: prediction.bytesBase64Encoded,
      mimeType: prediction.mimeType || "image/png",
    }));

    console.log(`✅ ${images.length} imagen(es) generada(s) exitosamente`);

    return res.status(200).json({
      success: true,
      images,
      prompt,
      aspectRatio,
    });
  } catch (error) {
    console.error("❌ Error en generate-image:", error);
    return res.status(500).json({
      error: error.message || "Error al generar imagen",
      details: error.toString(),
    });
  }
}
