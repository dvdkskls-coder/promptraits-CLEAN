// ============================================================================
// 🍌 ENDPOINT: Generar Imagen con Nano Banana (Google Gemini)
// ============================================================================
// Ruta: /api/generate-image.js (Vercel) o netlify/functions/generate-image.js (Netlify)

export default async function handler(req, res) {
  // ✅ Solo permitir POST
  if (req.method !== "POST") {
    return res.status(405).json({ 
      success: false, 
      error: "Método no permitido. Usa POST" 
    });
  }

  try {
    const { prompt, aspectRatio = "1:1", selfieImage } = req.body;

    // ✅ Validaciones
    if (!prompt || prompt.trim() === "") {
      return res.status(400).json({
        success: false,
        error: "El prompt es requerido",
      });
    }

    if (!selfieImage) {
      return res.status(400).json({
        success: false,
        error: "La imagen selfie es requerida",
      });
    }

    // ✅ Verificar API Key
    const GEMINI_API_KEY = process.env.GEMINI_API_KEY || process.env.GOOGLE_AI_API_KEY;
    
    if (!GEMINI_API_KEY) {
      console.error("❌ No se encontró GEMINI_API_KEY en las variables de entorno");
      return res.status(500).json({
        success: false,
        error: "Configuración del servidor incompleta. Falta GEMINI_API_KEY",
      });
    }

    // ✅ Mapear aspect ratio al formato que espera Gemini
    const aspectRatioMap = {
      "1:1": "1:1",
      "3:4": "3:4",
      "4:3": "4:3",
      "9:16": "9:16",
      "16:9": "16:9",
    };

    const geminiAspectRatio = aspectRatioMap[aspectRatio] || "1:1";

    // ✅ Construir el request body para Google Gemini
    const requestBody = {
      prompt: prompt,
      numberOfImages: 1,
      aspectRatio: geminiAspectRatio,
      // Si el selfieImage incluye el prefijo data:image, lo quitamos
      referenceImages: [
        {
          imageBytes: selfieImage.split(',')[1] || selfieImage // Quitar prefijo si existe
        }
      ],
      personGeneration: "allow_all", // Permitir generación de personas
      safetyFilterLevel: "block_some", // Nivel de seguridad moderado
    };

    console.log("🍌 Generando imagen con Nano Banana...");
    console.log("📏 Aspect Ratio:", geminiAspectRatio);
    console.log("📝 Prompt length:", prompt.length);

    // ✅ Llamar a la API de Google Gemini (Imagen 3)
    const geminiResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/imagen-3.0-generate-001:predict?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      }
    );

    // ✅ Verificar respuesta
    if (!geminiResponse.ok) {
      const errorText = await geminiResponse.text();
      console.error("❌ Error de Gemini API:", errorText);
      
      // Intentar parsear como JSON
      let errorMessage = "Error al generar la imagen";
      try {
        const errorJson = JSON.parse(errorText);
        errorMessage = errorJson.error?.message || errorMessage;
      } catch (e) {
        errorMessage = errorText.substring(0, 200); // Primeros 200 caracteres
      }

      return res.status(geminiResponse.status).json({
        success: false,
        error: errorMessage,
      });
    }

    const geminiData = await geminiResponse.json();

    // ✅ Verificar que hay imágenes generadas
    if (!geminiData.predictions || geminiData.predictions.length === 0) {
      console.error("❌ No se generaron imágenes");
      return res.status(500).json({
        success: false,
        error: "No se pudo generar la imagen. Intenta de nuevo.",
      });
    }

    // ✅ Extraer imágenes
    const images = geminiData.predictions.map((prediction) => ({
      base64: prediction.bytesBase64Encoded || prediction.imageBytes,
      mimeType: prediction.mimeType || "image/png",
    }));

    console.log("✅ Imagen generada exitosamente");

    // ✅ Retornar respuesta exitosa
    return res.status(200).json({
      success: true,
      images: images,
    });

  } catch (error) {
    console.error("❌ Error al generar imagen:", error);
    
    return res.status(500).json({
      success: false,
      error: error.message || "Error interno del servidor",
    });
  }
}
