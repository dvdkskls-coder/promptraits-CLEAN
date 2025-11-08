// ============================================================================
// 🌟 ENDPOINT: Generar Imagen con Gemini 2.5 Flash Image (Nano Banana)
// ============================================================================
// Ruta: /api/generate-image.js (Vercel)

import formidable from 'formidable';
import fs from 'fs';
import { GoogleGenerativeAI } from '@google/generative-ai';

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

    console.log("🍌 Nano Banana (Gemini 2.5 Flash Image) - Datos recibidos:");
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
        error: "La imagen selfie es requerida para generar una imagen personalizada",
      });
    }

    // ✅ Leer archivo selfie y convertir a base64
    const selfieBuffer = fs.readFileSync(selfieFile.filepath);
    const selfieBase64 = selfieBuffer.toString('base64');
    const selfieMimeType = selfieFile.mimetype || 'image/jpeg';

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

    // ✅ Construir prompt con instrucciones específicas para preservación facial
    // IMPORTANTE: Según la documentación, usar descripciones NARRATIVAS, no keywords
    const enhancedPrompt = `A photo of this person (referring to the provided reference image). ${prompt}

CRITICAL INSTRUCTIONS FOR CHARACTER CONSISTENCY:
- Use the EXACT facial features, structure, and identity from the reference image
- Maintain the same face, eyes, nose, mouth, skin tone, and facial proportions
- DO NOT alter or modify facial characteristics in any way
- The person from the reference image must be clearly recognizable
- Preserve the person's unique identity and appearance
- Only modify the elements described in the main prompt (clothing, background, pose, etc.)

Technical specifications:
- Resolution: ${dimensions.width}x${dimensions.height}px
- Aspect ratio: ${aspectRatio}
- Style: Professional photography, hyper-realistic, cinematic quality
- Quality: 8K resolution, ultra-detailed, sharp focus
- Lighting: Professional studio lighting with proper skin tones`;

    console.log("🎨 Generando imagen con Nano Banana...");
    console.log("📐 Dimensiones:", `${dimensions.width}x${dimensions.height}`);
    console.log("🔑 Modelo: gemini-2.5-flash-image");

    try {
      // ✅ Usar el modelo CORRECTO: gemini-2.5-flash-image (Nano Banana)
      const model = genAI.getGenerativeModel({ 
        model: 'gemini-2.5-flash-image'  // ← ESTE ES EL MODELO CORRECTO
      });

      // ✅ Preparar contenido multimodal: imagen de referencia + prompt
      // Según la documentación, pasar [imagen, texto] en un array
      const result = await model.generateContent([
        {
          inlineData: {
            mimeType: selfieMimeType,
            data: selfieBase64
          }
        },
        {
          text: enhancedPrompt
        }
      ]);

      const response = await result.response;
      
      console.log("📝 Respuesta de Nano Banana recibida");
      
      // ✅ Verificar si hay imagen en la respuesta
      if (!response.candidates || !response.candidates[0]) {
        console.error("❌ No hay candidates en la respuesta");
        throw new Error('No se generó ninguna imagen. El contenido puede haber sido bloqueado por filtros de seguridad.');
      }

      const candidate = response.candidates[0];
      
      // ✅ Extraer la imagen base64 de la respuesta
      let imageBase64 = null;
      let imageMimeType = 'image/png';
      
      if (candidate.content && candidate.content.parts) {
        for (const part of candidate.content.parts) {
          if (part.inlineData && part.inlineData.data) {
            imageBase64 = part.inlineData.data;
            imageMimeType = part.inlineData.mimeType || 'image/png';
            console.log("✅ Imagen encontrada en respuesta");
            console.log("📦 MIME Type de imagen generada:", imageMimeType);
            break;
          }
        }
      }

      if (!imageBase64) {
        console.error("❌ No se pudo extraer imagen de la respuesta");
        console.error("📋 Estructura de respuesta completa:");
        console.error(JSON.stringify(response, null, 2));
        throw new Error('No se pudo extraer la imagen de la respuesta de Gemini. Verifica que el modelo soporte generación de imágenes.');
      }

      console.log("✅ Imagen generada exitosamente con Nano Banana");
      console.log("📊 Tamaño de imagen base64:", imageBase64.length, "caracteres");

      // ✅ Limpiar archivo temporal
      try {
        fs.unlinkSync(selfieFile.filepath);
        console.log("🗑️ Archivo temporal eliminado");
      } catch (e) {
        console.warn("⚠️ No se pudo eliminar archivo temporal:", e.message);
      }

      // ✅ Retornar respuesta en el mismo formato que Vertex AI
      // (para mantener compatibilidad con el frontend)
      return res.status(200).json({
        success: true,
        images: [{
          base64: imageBase64,
          mimeType: imageMimeType,
        }]
      });

    } catch (geminiError) {
      console.error("❌ Error de Gemini:", geminiError);
      console.error("📋 Error completo:", geminiError.stack);
      
      // Errores específicos de Gemini
      if (geminiError.message && geminiError.message.includes('API key')) {
        return res.status(500).json({
          success: false,
          error: 'Error de configuración de API. Verifica que GEMINI_API_KEY esté configurada correctamente en Vercel.',
        });
      }

      if (geminiError.message && geminiError.message.includes('quota')) {
        return res.status(429).json({
          success: false,
          error: 'Límite de uso alcanzado. Intenta de nuevo más tarde o verifica tu cuenta de Google AI Studio.',
        });
      }

      if (geminiError.message && geminiError.message.includes('safety') || geminiError.message && geminiError.message.includes('blocked')) {
        return res.status(400).json({
          success: false,
          error: 'El contenido fue bloqueado por razones de seguridad. Intenta con un prompt diferente o una imagen diferente.',
        });
      }

      if (geminiError.message && geminiError.message.includes('not found')) {
        return res.status(404).json({
          success: false,
          error: 'Modelo no encontrado. Verifica que tu API key tenga acceso a gemini-2.5-flash-image.',
        });
      }

      throw geminiError;
    }

  } catch (error) {
    console.error("❌ Error general al generar imagen:", error);
    console.error("📋 Stack trace:", error.stack);
    
    return res.status(500).json({
      success: false,
      error: error.message || "Error interno del servidor al generar la imagen",
    });
  }
}
