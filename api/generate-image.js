// ============================================================================
// 🌟 ENDPOINT: Generar Imagen con Vertex AI Imagen 3 (Google Cloud)
// ============================================================================
// Ruta: /api/generate-image.js (Vercel)

import formidable from 'formidable';
import fs from 'fs';
import { GoogleAuth } from 'google-auth-library';

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

    console.log("🌟 Vertex AI Imagen 3 - Datos recibidos:");
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

    // ✅ Verificar configuración de Google Cloud
    const PROJECT_ID = process.env.GOOGLE_CLOUD_PROJECT_ID;
    const LOCATION = process.env.GOOGLE_CLOUD_LOCATION || 'us-central1';
    
    if (!PROJECT_ID) {
      console.error("❌ Falta GOOGLE_CLOUD_PROJECT_ID en variables de entorno");
      return res.status(500).json({
        success: false,
        error: "Configuración del servidor incompleta. Contacta al administrador.",
      });
    }

    // ✅ Leer archivo selfie y convertir a base64
    const selfieBuffer = fs.readFileSync(selfieFile.filepath);
    const selfieBase64 = selfieBuffer.toString('base64');

    console.log("✅ Selfie convertida a base64");

    // ✅ Mapear aspect ratio a formato Vertex AI
    const aspectRatioMap = {
      "1:1": "1:1",
      "3:4": "3:4",
      "4:3": "4:3",
      "9:16": "9:16",
      "16:9": "16:9",
    };

    const vertexAspectRatio = aspectRatioMap[aspectRatio] || "1:1";

    // ✅ Construir el request body para Vertex AI Imagen 3
    const requestBody = {
      instances: [
        {
          prompt: prompt,
        }
      ],
      parameters: {
        sampleCount: 1,
        aspectRatio: vertexAspectRatio,
        referenceImages: [
          {
            imageBytes: {
              bytesBase64Encoded: selfieBase64
            },
            referenceType: "REFERENCE_TYPE_FACE", // Para que use la cara de referencia
            referenceId: 1
          }
        ],
        personGeneration: "allow_all",
        safetySetting: "block_some",
        addWatermark: false,
      }
    };

    console.log("🌟 Llamando a Vertex AI Imagen 3...");
    console.log("📐 Aspect Ratio:", vertexAspectRatio);
    console.log("🆔 Project ID:", PROJECT_ID);
    console.log("📍 Location:", LOCATION);

    // ✅ Obtener token de autenticación
    let accessToken;
    try {
      // Intenta usar Google Auth Library
      const auth = new GoogleAuth({
        scopes: ['https://www.googleapis.com/auth/cloud-platform'],
      });
      const client = await auth.getClient();
      const tokenResponse = await client.getAccessToken();
      accessToken = tokenResponse.token;
      console.log("✅ Token de autenticación obtenido");
    } catch (authError) {
      console.error("❌ Error al obtener token:", authError);
      return res.status(500).json({
        success: false,
        error: "No se pudo autenticar con Google Cloud. Verifica las credenciales.",
      });
    }

    // ✅ Endpoint de Vertex AI
    const endpoint = `https://${LOCATION}-aiplatform.googleapis.com/v1/projects/${PROJECT_ID}/locations/${LOCATION}/publishers/google/models/imagen-3.0-generate-001:predict`;

    // ✅ Llamar a la API de Vertex AI
    const vertexResponse = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    // ✅ Verificar respuesta
    if (!vertexResponse.ok) {
      const errorText = await vertexResponse.text();
      console.error("❌ Error de Vertex AI:", errorText);
      
      let errorMessage = "Error al generar la imagen";
      try {
        const errorJson = JSON.parse(errorText);
        errorMessage = errorJson.error?.message || errorJson.error || errorMessage;
      } catch (e) {
        errorMessage = errorText.substring(0, 200);
      }

      return res.status(vertexResponse.status).json({
        success: false,
        error: errorMessage,
      });
    }

    const vertexData = await vertexResponse.json();

    // ✅ Verificar que hay imágenes generadas
    if (!vertexData.predictions || vertexData.predictions.length === 0) {
      console.error("❌ No se generaron imágenes");
      return res.status(500).json({
        success: false,
        error: "No se pudo generar la imagen. Intenta de nuevo.",
      });
    }

    // ✅ Extraer imágenes (Vertex AI devuelve en formato diferente)
    const images = vertexData.predictions.map((prediction) => ({
      base64: prediction.bytesBase64Encoded,
      mimeType: prediction.mimeType || "image/png",
    }));

    console.log("✅ Imagen generada exitosamente con Vertex AI");

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
