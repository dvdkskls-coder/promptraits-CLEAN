// ============================================================================
// 🌟 ENDPOINT: Generar Imagen con Gemini 2.5 Flash Preview Image
// ============================================================================
// Ruta: /api/generate-image.js (Vercel)

import formidable from "formidable";
import fs from "fs";
import { GoogleGenerativeAI } from "@google/generative-ai";

// ✅ Configuración para Vercel - desactivar bodyParser
export const config = {
  api: {
    bodyParser: false,
  },
};

// ✅ Inicializar Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

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

    console.log("🌟 Gemini Image Gen - Datos recibidos:");
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

    // ✅ Construir prompt mejorado con instrucciones de referencia
    const enhancedPrompt = `${prompt}

CRITICAL INSTRUCTIONS FOR FACE REFERENCE:
- Use the EXACT facial features from the reference image provided
- Maintain the person's face structure, eyes, nose, mouth, and overall appearance
- DO NOT alter or modify facial characteristics
- Keep the same skin tone and facial proportions
- The person in the reference image must be recognizable in the generated image

Technical specifications:
- Resolution: ${dimensions.width}x${dimensions.height}px
- Aspect ratio: ${aspectRatio}
- Style: Professional photography, hyper-realistic
- Quality: 8K, ultra-detailed, sharp focus`;

    console.log("🎨 Generando imagen con Gemini...");
    console.log("📐 Dimensiones:", `${dimensions.width}x${dimensions.height}`);

    try {
      // ✅ Usar el modelo de Gemini para generar imágenes
      const model = genAI.getGenerativeModel({
        model: "gemini-2.5-flash-image",
      });

      // ✅ Preparar contenido con imagen de referencia
      const result = await model.generateContent([
        {
          inlineData: {
            mimeType: selfieMimeType,
            data: selfieBase64,
          },
        },
        {
          text: enhancedPrompt,
        },
      ]);

      const response = await result.response;

      console.log("📝 Respuesta de Gemini recibida");

      // ✅ Verificar si hay imagen en la respuesta
      if (!response.candidates || !response.candidates[0]) {
        console.error("❌ No hay candidates en la respuesta");
        throw new Error(
          "No se generó ninguna imagen. Intenta con un prompt diferente."
        );
      }

      const candidate = response.candidates[0];

      // ✅ Extraer la imagen base64 de la respuesta
      let imageBase64 = null;
      let imageMimeType = "image/png";

      if (candidate.content && candidate.content.parts) {
        for (const part of candidate.content.parts) {
          if (part.inlineData && part.inlineData.data) {
            imageBase64 = part.inlineData.data;
            imageMimeType = part.inlineData.mimeType || "image/png";
            console.log("✅ Imagen encontrada en respuesta");
            break;
          }
        }
      }

      if (!imageBase64) {
        console.error("❌ No se pudo extraer imagen de la respuesta");
        console.error(
          "Estructura de respuesta:",
          JSON.stringify(response, null, 2)
        );
        throw new Error(
          "No se pudo extraer la imagen de la respuesta de Gemini"
        );
      }

      console.log("✅ Imagen generada exitosamente con Gemini");

      // ✅ Limpiar archivo temporal
      try {
        fs.unlinkSync(selfieFile.filepath);
        console.log("🗑️ Archivo temporal eliminado");
      } catch (e) {
        console.warn("⚠️ No se pudo eliminar archivo temporal:", e.message);
      }

      // ✅ Retornar respuesta en el mismo formato que Vertex AI
      return res.status(200).json({
        success: true,
        images: [
          {
            base64: imageBase64,
            mimeType: imageMimeType,
          },
        ],
      });
    } catch (geminiError) {
      console.error("❌ Error de Gemini:", geminiError);

      // Errores específicos de Gemini
      if (geminiError.message && geminiError.message.includes("API key")) {
        return res.status(500).json({
          success: false,
          error:
            "Error de configuración. Verifica que GEMINI_API_KEY esté configurada correctamente.",
        });
      }

      if (geminiError.message && geminiError.message.includes("quota")) {
        return res.status(429).json({
          success: false,
          error: "Límite de uso alcanzado. Intenta de nuevo más tarde.",
        });
      }

      if (geminiError.message && geminiError.message.includes("safety")) {
        return res.status(400).json({
          success: false,
          error:
            "El contenido fue bloqueado por razones de seguridad. Intenta con un prompt diferente.",
        });
      }

      throw geminiError;
    }
  } catch (error) {
    console.error("❌ Error general al generar imagen:", error);

    return res.status(500).json({
      success: false,
      error: error.message || "Error interno del servidor al generar la imagen",
    });
  }
}
