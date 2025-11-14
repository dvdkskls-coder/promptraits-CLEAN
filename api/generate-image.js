// ============================================================================
// 🌟 ENDPOINT: Generar Imagen con Gemini 2.5 Flash Image (API REST)
// ============================================================================
// Ruta: /api/generate-image.js (Vercel)

import formidable from "formidable";
import fs from "fs";

// ✅ Configuración para Vercel - desactivar bodyParser
export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  // ✅ Solo permitir POST
  if (req.method !== "POST") {
    return res.status(405).json({
      success: false,
      error: "Método no permitido. Usa POST",
    });
  }

  try {
    // ✅ Parsear FormData con formidable
    const form = formidable({ multiples: false, maxFileSize: 5 * 1024 * 1024 }); // Max 5MB

    const [fields, files] = await new Promise((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) reject(err);
        else resolve([fields, files]);
      });
    });

    // ✅ Extraer datos
    const prompt = Array.isArray(fields.prompt)
      ? fields.prompt[0]
      : fields.prompt;
    const aspectRatio = Array.isArray(fields.aspectRatio)
      ? fields.aspectRatio[0]
      : fields.aspectRatio || "1:1";
    const userId = Array.isArray(fields.userId)
      ? fields.userId[0]
      : fields.userId;

    const selfieFile = Array.isArray(files.selfieImage)
      ? files.selfieImage[0]
      : files.selfieImage;

    console.log("🍌 Nano Banana (API REST) - Datos recibidos:");
    console.log("- Prompt:", prompt ? `${prompt.substring(0, 50)}...` : "NO");
    console.log("- Aspect Ratio:", aspectRatio);
    console.log("- User ID:", userId);
    console.log("- Selfie file:", selfieFile ? "✅" : "❌");

    // ✅ Validaciones
    if (!prompt || prompt.trim() === "") {
      return res.status(400).json({
        success: false,
        error: "El prompt es requerido",
      });
    }

    if (!selfieFile) {
      return res.status(400).json({
        success: false,
        error:
          "La imagen selfie es requerida para generar una imagen personalizada",
      });
    }

    // ✅ Verificar API key
    const API_KEY = process.env.GEMINI_API_KEY;
    if (!API_KEY) {
      console.error("❌ GEMINI_API_KEY no configurada");
      return res.status(500).json({
        success: false,
        error: "Error de configuración del servidor",
      });
    }

    // ✅ Leer archivo selfie y convertir a base64
    const selfieBuffer = fs.readFileSync(selfieFile.filepath);
    const selfieBase64 = selfieBuffer.toString("base64");
    const selfieMimeType = selfieFile.mimetype || "image/jpeg";

    console.log("✅ Selfie convertida a base64");
    console.log("📷 MIME Type:", selfieMimeType);

    // ✅ Mapear aspect ratio a dimensiones
    const dimensionsMap = {
      "1:1": { width: 1024, height: 1024 },
      "3:4": { width: 768, height: 1024 },
      "4:3": { width: 1024, height: 768 },
      "9:16": { width: 720, height: 1280 },
      "16:9": { width: 1280, height: 720 },
    };

    const dimensions = dimensionsMap[aspectRatio] || dimensionsMap["1:1"];

    // ✅ Construir prompt mejorado (según documentación oficial de Google)
    const enhancedPrompt = `A photo of this person (referring to the reference image). ${prompt}

CRITICAL INSTRUCTIONS FOR CHARACTER CONSISTENCY:
- Use the EXACT facial features from the reference image
- Maintain the same face, eyes, nose, mouth, skin tone, and facial proportions
- DO NOT alter or modify facial characteristics
- The person from the reference image must be recognizable

Technical specifications:
- Resolution: ${dimensions.width}x${dimensions.height}px
- Aspect ratio: ${aspectRatio}
- Style: Professional photography, hyper-realistic, cinematic quality
- Quality: 8K resolution, ultra-detailed, sharp focus`;

    console.log("🎨 Generando imagen con Gemini API REST...");
    console.log("📐 Dimensiones:", `${dimensions.width}x${dimensions.height}`);

    // ✅ Construir request body según documentación oficial
    const requestBody = {
      contents: [
        {
          parts: [
            {
              text: enhancedPrompt,
            },
            {
              inline_data: {
                mime_type: selfieMimeType,
                data: selfieBase64,
              },
            },
          ],
        },
      ],
    };

    // ✅ Llamar a la API REST de Gemini
    // Usar v1beta según la documentación
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image:generateContent?key=${API_KEY}`;

    console.log("🔗 Endpoint:", apiUrl.replace(API_KEY, "***"));

    const geminiResponse = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    const responseData = await geminiResponse.json();

    console.log("📝 Respuesta recibida, status:", geminiResponse.status);

    if (!geminiResponse.ok) {
      console.error("❌ Error de Gemini API:");
      console.error(JSON.stringify(responseData, null, 2));

      return res.status(geminiResponse.status).json({
        success: false,
        error: responseData.error?.message || "Error al generar la imagen",
        details: responseData,
      });
    }

    // ✅ Verificar respuesta
    if (!responseData.candidates || !responseData.candidates[0]) {
      console.error("❌ No hay candidates en la respuesta");
      console.error(
        "Respuesta completa:",
        JSON.stringify(responseData, null, 2)
      );
      return res.status(500).json({
        success: false,
        error:
          "No se generó ninguna imagen. El contenido puede haber sido bloqueado.",
      });
    }

    const candidate = responseData.candidates[0];

    // ✅ Extraer la imagen base64
    let imageBase64 = null;
    let imageMimeType = "image/png";

    if (candidate.content && candidate.content.parts) {
      for (const part of candidate.content.parts) {
        if (part.inline_data && part.inline_data.data) {
          imageBase64 = part.inline_data.data;
          imageMimeType = part.inline_data.mime_type || "image/png";
          console.log("✅ Imagen encontrada en respuesta");
          console.log("📦 MIME Type:", imageMimeType);
          break;
        }
      }
    }

    if (!imageBase64) {
      console.error("❌ No se pudo extraer imagen de la respuesta");
      console.error(
        "Estructura de candidate:",
        JSON.stringify(candidate, null, 2)
      );
      return res.status(500).json({
        success: false,
        error: "No se pudo extraer la imagen de la respuesta",
      });
    }

    console.log("✅ Imagen generada exitosamente");
    console.log("📊 Tamaño base64:", imageBase64.length, "caracteres");

    // ✅ Limpiar archivo temporal
    try {
      fs.unlinkSync(selfieFile.filepath);
      console.log("🗑️ Archivo temporal eliminado");
    } catch (e) {
      console.warn("⚠️ No se pudo eliminar archivo temporal:", e.message);
    }

    // ✅ Retornar respuesta
    return res.status(200).json({
      success: true,
      images: [
        {
          base64: imageBase64,
          mimeType: imageMimeType,
        },
      ],
    });
  } catch (error) {
    console.error("❌ Error general al generar imagen:", error);
    console.error("Stack:", error.stack);

    return res.status(500).json({
      success: false,
      error: error.message || "Error interno del servidor al generar la imagen",
    });
  }
}
