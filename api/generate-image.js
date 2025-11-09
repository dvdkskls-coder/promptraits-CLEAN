// api/generate-image.js (VERSIÓN CORREGIDA CON MODELO GEMINI 2.5 FLASH IMAGE)

import formidable from "formidable";
import fs from "fs";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  console.log("🚀 Iniciando handler de /api/generate-image...");

  if (req.method !== "POST") {
    return res
      .status(405)
      .json({ success: false, error: "Método no permitido. Usa POST" });
  }

  try {
    console.log("📤 Parseando FormData...");
    const form = formidable({ multiples: false, maxFileSize: 5 * 1024 * 1024 });

    const [fields, files] = await new Promise((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) {
          console.error("❌ Error al parsear FormData:", err);
          reject(err);
        } else {
          console.log("✅ FormData parseado correctamente.");
          resolve([fields, files]);
        }
      });
    });

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

    console.log("🌍 Datos recibidos:");
    console.log("- Prompt:", prompt ? `${prompt.substring(0, 50)}...` : "NO");
    console.log("- Aspect Ratio:", aspectRatio);
    console.log("- User ID:", userId);
    console.log("- Selfie file path:", selfieFile?.filepath);

    if (!prompt || prompt.trim() === "") {
      return res
        .status(400)
        .json({ success: false, error: "El prompt es requerido" });
    }

    if (!selfieFile) {
      return res
        .status(400)
        .json({ success: false, error: "La imagen selfie es requerida" });
    }

    const API_KEY = process.env.GEMINI_API_KEY;
    if (!API_KEY) {
      console.error("❌ GEMINI_API_KEY no configurada en Vercel");
      return res.status(500).json({
        success: false,
        error: "Error de configuración del servidor (API Key no encontrada)",
      });
    }
    console.log("✅ API Key encontrada.");

    let selfieBuffer;
    try {
      console.log("📖 Leyendo archivo temporal...");
      selfieBuffer = fs.readFileSync(selfieFile.filepath);
      console.log("✅ Archivo temporal leído.");
    } catch (readError) {
      console.error("❌ Error CRÍTICO al leer el archivo temporal:", readError);
      return res.status(500).json({
        success: false,
        error: "Error al leer la imagen subida en el servidor.",
      });
    }

    const selfieBase64 = selfieBuffer.toString("base64");
    const selfieMimeType = selfieFile.mimetype || "image/jpeg";

    // ✅ MAPA DE DIMENSIONES PARA DIFERENTES ASPECT RATIOS
    const dimensionsMap = {
      "1:1": { width: 1024, height: 1024 },
      "3:4": { width: 768, height: 1024 },
      "4:3": { width: 1024, height: 768 },
      "9:16": { width: 720, height: 1280 },
      "16:9": { width: 1280, height: 720 },
    };
    const dimensions = dimensionsMap[aspectRatio] || dimensionsMap["1:1"];

    // ✅ PROMPT MEJORADO PARA PRESERVAR EL ROSTRO DEL SELFIE
    const enhancedPrompt = `A photorealistic portrait using the exact face from the provided selfie image. ${prompt}. 
    
    CRITICAL INSTRUCTIONS:
    - Use the EXACT face from the provided selfie - no modifications to facial features
    - Preserve all unique facial characteristics, skin tone, and features exactly as shown
    - The face must be recognizable as the same person from the selfie
    - Only change pose, environment, clothing, and styling as described
    - Maintain photorealistic quality throughout
    - Generate in ${dimensions.width}x${dimensions.height} resolution`;

    // 🔥 ESTRUCTURA CORRECTA PARA GEMINI 2.5 FLASH IMAGE
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
      generationConfig: {
        temperature: 0.8,
        topP: 0.95,
        topK: 40,
        maxOutputTokens: 2000,
        // ✅ CONFIGURACIÓN ESPECÍFICA PARA IMAGEN
        response_modalities: ["IMAGE"],
        image_config: {
          aspect_ratio: aspectRatio,
          // Gemini 2.5 Flash Image genera a 1024px por defecto
        },
      },
      safetySettings: [
        {
          category: "HARM_CATEGORY_HATE_SPEECH",
          threshold: "BLOCK_MEDIUM_AND_ABOVE",
        },
        {
          category: "HARM_CATEGORY_DANGEROUS_CONTENT",
          threshold: "BLOCK_MEDIUM_AND_ABOVE",
        },
        {
          category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
          threshold: "BLOCK_MEDIUM_AND_ABOVE",
        },
        {
          category: "HARM_CATEGORY_HARASSMENT",
          threshold: "BLOCK_MEDIUM_AND_ABOVE",
        },
      ],
    };

    // 🔥 MODELO CORRECTO: gemini-2.5-flash-image (nano-banana)
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image:generateContent?key=${API_KEY}`;

    console.log("🔗 Llamando a Gemini 2.5 Flash Image (nano-banana)...");
    console.log("📊 Aspect Ratio:", aspectRatio);
    console.log("📐 Dimensiones objetivo:", dimensions);

    const geminiResponse = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-client": "genai-js",
      },
      body: JSON.stringify(requestBody),
    });

    const responseData = await geminiResponse.json();

    if (!geminiResponse.ok) {
      console.error(
        "❌ Error de la API de Gemini (Status:",
        geminiResponse.status,
        "):"
      );
      console.error(JSON.stringify(responseData, null, 2));

      // Manejo específico de errores comunes
      if (responseData.error?.message?.includes("safety")) {
        return res.status(400).json({
          success: false,
          error:
            "La imagen fue bloqueada por filtros de seguridad. Por favor, ajusta el contenido del prompt.",
        });
      }

      if (responseData.error?.message?.includes("quota")) {
        return res.status(429).json({
          success: false,
          error: "Límite de API excedido. Por favor, intenta más tarde.",
        });
      }

      return res.status(500).json({
        success: false,
        error: `Error de la API de Gemini: ${
          responseData.error?.message || "Error desconocido"
        }`,
      });
    }

    // ✅ VERIFICAR SI HAY CANDIDATOS
    if (!responseData.candidates || !responseData.candidates[0]) {
      console.error("❌ La API de Gemini no devolvió candidatos.");
      console.error(
        "Respuesta completa:",
        JSON.stringify(responseData, null, 2)
      );
      return res.status(500).json({
        success: false,
        error:
          "La API no generó ninguna imagen. Intenta con un prompt diferente.",
      });
    }

    const candidate = responseData.candidates[0];

    // ✅ VERIFICAR SI FUE BLOQUEADO POR SEGURIDAD
    if (candidate.finishReason === "SAFETY") {
      console.warn("⚠️ Imagen bloqueada por filtros de seguridad");
      return res.status(400).json({
        success: false,
        error:
          "El contenido fue bloqueado por filtros de seguridad. Por favor, modifica tu prompt.",
      });
    }

    // ==================================================================
    // ✅ EXTRAER LA IMAGEN DEL CANDIDATO - ¡ESTA ES LA CORRECCIÓN!
    // ==================================================================
    let imageBase64 = null;
    let imageMimeType = "image/png";

    if (candidate.content?.parts) {
      for (const part of candidate.content.parts) {
        // CORREGIDO: La respuesta usa camelCase (inlineData), no snake_case (inline_data)
        if (part.inlineData?.data) {
          imageBase64 = part.inlineData.data;
          imageMimeType = part.inlineData.mimeType || "image/png";
          console.log("✅ Imagen extraída exitosamente");
          break;
        }
        // También puede venir como texto en algunos casos
        if (part.text && part.text.includes("base66,")) {
          const base64Match = part.text.match(/base64,(.+)/);
          if (base64Match) {
            imageBase64 = base64Match[1];
            console.log("✅ Imagen extraída del texto");
            break;
          }
        }
      }
    }

    if (!imageBase64) {
      console.error("❌ No se pudo extraer la imagen de la respuesta.");
      console.error(
        "Estructura del candidato:",
        JSON.stringify(candidate, null, 2)
      );
      return res.status(500).json({
        success: false,
        error:
          "No se pudo extraer la imagen de la respuesta. Por favor, intenta de nuevo.",
      });
    }

    // ✅ LIMPIAR ARCHIVO TEMPORAL
    try {
      fs.unlinkSync(selfieFile.filepath);
      console.log("🗑️ Archivo temporal eliminado");
    } catch (e) {
      console.warn("⚠️ No se pudo eliminar archivo temporal:", e.message);
    }

    // 🔥 INFORMACIÓN ADICIONAL SOBRE LA GENERACIÓN
    const generationInfo = {
      model: "gemini-2.5-flash-image",
      aspectRatio: aspectRatio,
      dimensions: dimensions,
      promptTokens: candidate.tokenCount?.promptTokens || "N/A",
      candidateTokens: candidate.tokenCount?.candidateTokens || "N/A",
      totalTokens: candidate.tokenCount?.totalTokens || "N/A",
      finishReason: candidate.finishReason || "COMPLETE",
      cost: 0.039, // $0.039 por imagen según documentación
    };

    console.log("📊 Información de generación:", generationInfo);

    // ✅ RETORNAR LA IMAGEN GENERADA
    return res.status(200).json({
      success: true,
      images: [
        {
          base64: imageBase64,
          mimeType: imageMimeType,
        },
      ],
      generationInfo: generationInfo,
      message:
        "Imagen generada exitosamente con Gemini 2.5 Flash Image (nano-banana) 🍌",
    });
  } catch (error) {
    console.error("❌ ERROR GENERAL EN EL SERVIDOR (catch block):");
    console.error("Mensaje:", error.message);
    console.error("Stack:", error.stack);

    // Verificar si es un error de red
    if (error.message?.includes("fetch")) {
      return res.status(503).json({
        success: false,
        error:
          "Error de conexión con la API de Google. Por favor, intenta más tarde.",
      });
    }

    return res.status(500).json({
      success: false,
      error: `Error interno del servidor: ${error.message}`,
    });
  }
}
