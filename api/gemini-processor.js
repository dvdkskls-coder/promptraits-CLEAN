import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || process.env.VITE_GOOGLE_API_KEY,
});
const MODEL_NAME = "gemini-2.5-flash";

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Credentials", true);
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version"
  );

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST")
    return res.status(405).json({ error: "Method not allowed" });

  try {
    const { prompt: userIdea, referenceImage, mimeType, gender } = req.body;

    // 1. Preparar Imagen (Limpieza Base64)
    let imagePart = null;
    if (referenceImage) {
      const cleanBase64 = referenceImage.includes("base64,")
        ? referenceImage.split("base64,")[1]
        : referenceImage;

      // Sintaxis nueva librería: objeto inlineData directo
      imagePart = {
        inlineData: { data: cleanBase64, mimeType: mimeType || "image/jpeg" },
      };
    }

    // 2. Definir Referencia de Sujeto
    let subjectRef =
      "The subject's face and appearance should be based on the reference photo @img1.";
    if (gender === "couple")
      subjectRef =
        "The subjects' faces should be based on reference photos @img1 and @img2.";
    if (gender === "animal")
      subjectRef = "The person is @img1 and the animal is @img2.";

    // 3. Instrucciones del Sistema (Incrustadas para evitar errores)
    const systemPrompt = `
    You are a world-class Photography Director.
    YOUR TASK: Analyze the input and return a JSON object with exactly two fields: "detailed" and "compact".
    
    Structure:
    - FIELD "detailed": 8 lines strict. Headings: Image type, Subject Identity, Pose, Wardrobe, Lighting, Camera Specs, Style, Keywords.
    - CRITICAL: In Subject Identity, WRITE EXACTLY: "${
      referenceImage ? subjectRef : "Detailed subject description."
    }"
    - FIELD "compact": Single paragraph for Midjourney.
    
    Output ONLY valid JSON.
    `;

    // 4. Ejecución con la NUEVA librería (@google/genai)
    let contents = [];

    if (imagePart) {
      const promptText = userIdea
        ? `User Idea: ${userIdea}. Analyze image.`
        : `Analyze this image.`;
      // En la nueva librería pasamos un array plano de partes
      contents = [{ text: systemPrompt }, { text: promptText }, imagePart];
    } else {
      contents = [{ text: systemPrompt }, { text: `User Idea: ${userIdea}` }];
    }

    // Llamada a la API nueva
    const result = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: contents,
      config: {
        responseMimeType: "application/json",
        temperature: 0.7,
      },
    });

    // En la nueva librería se obtiene el texto así:
    const responseText = result.text();
    const jsonResponse = JSON.parse(responseText);

    return res.status(200).json({
      detailed: jsonResponse.detailed,
      compact: jsonResponse.compact,
      detectedGender: null,
      analysis: { score: 9.8 },
    });
  } catch (error) {
    console.error("Gemini Processor Error:", error);
    return res.status(500).json({ error: error.message });
  }
}
