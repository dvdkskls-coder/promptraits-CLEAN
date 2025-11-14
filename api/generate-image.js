import { GoogleGenAI } from "@google/genai";
import { createClient } from "@supabase/supabase-js";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || process.env.VITE_GOOGLE_API_KEY,
});
const MODEL_NAME = "gemini-2.5-flash-image";

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

// --- FUNCIÓN DE REINTENTO ROBUSTA ---
async function generateWithRetry(params, retries = 3) {
  try {
    return await ai.models.generateContent(params);
  } catch (error) {
    const isOverloaded =
      error.status === 503 ||
      (error.error && error.error.code === 503) ||
      (error.message && error.message.includes("503"));

    if (isOverloaded && retries > 0) {
      console.log(`⚠️ Modelo Imagen 503. Reintentando en 5s... (${retries})`);
      await new Promise((resolve) => setTimeout(resolve, 5000));
      return generateWithRetry(params, retries - 1);
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

    const result = await generateWithRetry({
      model: MODEL_NAME,
      contents: [{ role: "user", parts: parts }],
      config: {},
    });

    // Extracción manual segura
    const candidates = result.candidates;
    const responsePart =
      candidates &&
      candidates[0] &&
      candidates[0].content &&
      candidates[0].content.parts
        ? candidates[0].content.parts.find((p) => p.inlineData)
        : null;

    if (!responsePart) {
      console.log("Respuesta completa:", JSON.stringify(result, null, 2));
      throw new Error(
        "La IA no devolvió una imagen. Puede ser un bloqueo de seguridad."
      );
    }

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
