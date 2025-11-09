// api/generate-image.js (Versión con Debugging Mejorado)

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

    console.log("🍌 Datos recibidos:");
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
      return res
        .status(500)
        .json({
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
      return res
        .status(500)
        .json({
          success: false,
          error: "Error al leer la imagen subida en el servidor.",
        });
    }

    const selfieBase64 = selfieBuffer.toString("base64");
    const selfieMimeType = selfieFile.mimetype || "image/jpeg";

    const dimensionsMap = {
      "1:1": { width: 1024, height: 1024 },
      "3:4": { width: 768, height: 1024 },
      "4:3": { width: 1024, height: 768 },
      "9:16": { width: 720, height: 1280 },
      "16:9": { width: 1280, height: 720 },
    };
    const dimensions = dimensionsMap[aspectRatio] || dimensionsMap["1:1"];

    const enhancedPrompt = `A photo of this person (referring to the reference image). ${prompt}...`; // (Prompt acortado para brevedad)

    const requestBody = {
      contents: [
        {
          parts: [
            { text: enhancedPrompt },
            { inline_data: { mime_type: selfieMimeType, data: selfieBase64 } },
          ],
        },
      ],
    };

    // ✅ MODELO CONFIRMADO POR EL USUARIO
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image:generateContent?key=${API_KEY}`;
    console.log(
      "🔗 Llamando a la API de Gemini con el modelo gemini-2.5-flash-image..."
    );

    const geminiResponse = await fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
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
      return res
        .status(500)
        .json({
          success: false,
          error: `Error de la API de Gemini: ${
            responseData.error?.message || "Error desconocido"
          }`,
        });
    }

    if (!responseData.candidates || !responseData.candidates[0]) {
      console.error("❌ La API de Gemini no devolvió candidatos.");
      return res
        .status(500)
        .json({ success: false, error: "La API no generó ninguna imagen." });
    }

    const candidate = responseData.candidates[0];
    let imageBase64 = null;
    if (candidate.content?.parts) {
      for (const part of candidate.content.parts) {
        if (part.inline_data?.data) {
          imageBase64 = part.inline_data.data;
          break;
        }
      }
    }

    if (!imageBase64) {
      console.error("❌ No se pudo extraer la imagen de la respuesta.");
      return res
        .status(500)
        .json({
          success: false,
          error: "No se pudo extraer la imagen de la respuesta.",
        });
    }

    try {
      fs.unlinkSync(selfieFile.filepath);
    } catch (e) {
      console.warn("⚠️ No se pudo eliminar archivo temporal:", e.message);
    }

    return res
      .status(200)
      .json({
        success: true,
        images: [{ base64: imageBase64, mimeType: "image/png" }],
      });
  } catch (error) {
    // ✅ MEJORA: Log del error completo y del stack para depuración
    console.error("❌ ERROR GENERAL EN EL SERVIDOR (catch block):");
    console.error("Mensaje:", error.message);
    console.error("Stack:", error.stack);

    return res
      .status(500)
      .json({
        success: false,
        error: `Error interno del servidor: ${error.message}`,
      });
  }
}
