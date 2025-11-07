// ============================================================================
// 🍌 ENDPOINT: Generar Imagen con Nano Banana (Google Gemini Imagen 3)
// ============================================================================
// Ruta: /api/generate-image.js (Vercel)

import formidable from 'formidable';
import fs from 'fs';

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
      error: "Método no permitido. Usa POST" 
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
    const prompt = Array.isArray(fields.prompt) ? fields.prompt[0] : fields.prompt;
    const aspectRatio = Array.isArray(fields.aspectRatio) ? fields.aspectRatio[0] : fields.aspectRatio || "1:1";
    const userId = Array.isArray(fields.userId) ? fields.userId[0] : fields.userId;
    
    const selfieFile = Array.isArray(files.selfieImage) ? files.selfieImage[0] : files.selfieImage;

    console.log("🍌 Nano Banana - Datos recibidos:");
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
        error: "La imagen selfie es requerida",
      });
    }

    // ✅ Verificar API Key
    const GEMINI_API_KEY = process.env.GEMINI_API_KEY || process.env.GOOGLE_AI_API_KEY;
    
    if (!GEMINI_API_KEY) {
      console.error("❌ No se encontró GEMINI_API_KEY en las variables de entorno");
      return res.status(500).json({
        success: false,
        error: "Configuración del servidor incompleta. Contacta al administrador.",
      });
    }

    // ✅ Leer archivo selfie y convertir a base64
    const selfieBuffer = fs.readFileSync(selfieFile.filepath);
    const selfieBase64 = selfieBuffer.toString('base64');

    console.log("✅ Selfie convertida a base64:", selfieBase64.substring(0, 50) + "...");

    // ✅ Mapear aspect ratio
    const aspectRatioMap = {
      "1:1": "1:1",
      "3:4": "3:4",
      "4:3": "4:3",
      "9:16": "9:16",
      "16:9": "16:9",
    };

    const geminiAspectRatio = aspectRatioMap[aspectRatio] || "1:1";

    // ✅ Construir el request body para Google Gemini Imagen 3
    const requestBody = {
      prompt: prompt,
      numberOfImages: 1,
      aspectRatio: geminiAspectRatio,
      referenceImages: [
        {
          imageBytes: selfieBase64
        }
      ],
      personGeneration: "allow_all",
      safetyFilterLevel: "block_some",
    };

    console.log("🍌 Llamando a Google Gemini Imagen 3...");
    console.log("📏 Aspect Ratio:", geminiAspectRatio);

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
      
      let errorMessage = "Error al generar la imagen";
      try {
        const errorJson = JSON.parse(errorText);
        errorMessage = errorJson.error?.message || errorJson.error || errorMessage;
      } catch (e) {
        errorMessage = errorText.substring(0, 200);
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

    // ✅ Limpiar archivo temporal
    try {
      fs.unlinkSync(selfieFile.filepath);
    } catch (e) {
      console.warn("⚠️ No se pudo eliminar archivo temporal:", e.message);
    }

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
