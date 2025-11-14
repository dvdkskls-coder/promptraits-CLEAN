import { GoogleGenerativeAI } from "@google/generative-ai";
import { createClient } from "@supabase/supabase-js";

const genAI = new GoogleGenerativeAI(
  process.env.GEMINI_API_KEY || process.env.VITE_GOOGLE_API_KEY
);
// MODELO EXACTO DE TU APP AI STUDIO
const MODEL_NAME = "gemini-2.5-flash-image";

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

// Retry Logic
async function generateWithRetry(model, contentsConfig, retries = 3) {
  try {
    return await model.generateContent(contentsConfig);
  } catch (error) {
    if (
      (error.message.includes("503") || error.message.includes("overloaded")) &&
      retries > 0
    ) {
      console.log(`⚠️ Modelo Imagen saturado. Reintentando... (${retries})`);
      await new Promise((r) => setTimeout(r, 3000));
      return generateWithRetry(model, contentsConfig, retries - 1);
    }
    throw error;
  }
}

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Credentials", true);
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Authorization, Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST")
    return res.status(405).json({ error: "Method not allowed" });

  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) throw new Error("No autorizado");
    const token = authHeader.replace("Bearer ", "");
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser(token);
    if (error || !user) throw new Error("Usuario no autenticado");

    const { prompt, faceImages } = req.body;
    if (!prompt) throw new Error("Falta el prompt");

    const parts = [];

    // Procesar imágenes (Array)
    if (faceImages && Array.isArray(faceImages)) {
      faceImages.forEach((img) => {
        if (img && img.base64) {
          const cleanBase64 = img.base64.includes("base64,")
            ? img.base64.split("base64,")[1]
            : img.base64;

          parts.push({
            inlineData: {
              data: cleanBase64,
              mimeType: img.mimeType || "image/jpeg",
            },
          });
        }
      });
    }

    parts.push({ text: prompt });

    const model = genAI.getGenerativeModel({ model: MODEL_NAME });

    // Llamada con Retry
    const result = await generateWithRetry(model, {
      contents: [{ role: "user", parts: parts }],
    });

    const responsePart = result.response.candidates?.[0]?.content?.parts?.find(
      (p) => p.inlineData
    );

    if (!responsePart) throw new Error("La IA no devolvió una imagen.");

    return res.status(200).json({
      images: [
        {
          base64: responsePart.inlineData.data,
          mimeType: responsePart.inlineData.mimeType || "image/png",
        },
      ],
    });
  } catch (error) {
    console.error("Image Gen Error:", error);
    return res.status(500).json({ error: error.message });
  }
}
