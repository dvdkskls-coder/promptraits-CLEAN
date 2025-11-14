export const config = {
  runtime: "edge",
};

const API_KEY = process.env.GEMINI_API_KEY;
const BASE_URL = "https://generativelanguage.googleapis.com/v1beta";

async function callGemini(model, method, payload) {
  const url = `${BASE_URL}/models/${model}:${method}?key=${API_KEY}`;

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Google API Error (${response.status}): ${errorText}`);
  }

  return await response.json();
}

export default async function handler(req) {
  try {
    if (req.method !== "POST") {
      return new Response(JSON.stringify({ error: "Method not allowed" }), {
        status: 405,
        headers: { "Content-Type": "application/json" },
      });
    }

    const body = await req.json();
    const { action } = body;

    // 1. GENERAR TEXTO
    if (action === "generateText") {
      const { model, prompt, systemInstruction } = body;

      const payload = {
        contents: [{ parts: [{ text: prompt }] }],
        systemInstruction: systemInstruction
          ? { parts: [{ text: systemInstruction }] }
          : undefined,
      };

      const data = await callGemini(model, "generateContent", payload);
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "";

      return new Response(JSON.stringify({ text }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    // 2. GENERAR IMAGEN (NANO BANANA) - CORREGIDO AQUI
    if (action === "generateImageNano") {
      const { model, prompt, faceImages } = body;
      if (!prompt) {
        return new Response(JSON.stringify({ error: "Prompt is required" }), {
          status: 400,
          headers: { "Content-Type": "application/json" },
        });
      }

      const parts = [];
      if (faceImages?.length) {
        faceImages.forEach((img) => {
          // Limpiar base64 de entrada
          const cleanData = img.base64.includes(",")
            ? img.base64.split(",")[1]
            : img.base64;
          parts.push({
            inlineData: { mimeType: img.mimeType, data: cleanData },
          });
        });
      }
      // Prompt + Instrucción de realismo
      parts.push({
        text: prompt + " . Photorealistic, 8k, highly detailed portrait.",
      });

      const payload = {
        contents: [{ parts }],
        generationConfig: { responseModalities: ["IMAGE"] },
      };
      const data = await callGemini(model, "generateContent", payload);

      const imagePart = data.candidates?.[0]?.content?.parts?.find(
        (p) => p.inlineData
      );
      if (!imagePart)
        throw new Error(
          "Google AI no devolvió ninguna imagen. Intenta simplificar el prompt."
        );

      // ✅ CORRECCIÓN: Enviamos SOLO la data cruda, sin el prefijo 'data:image...'
      return new Response(
        JSON.stringify({
          base64: imagePart.inlineData.data,
          mimeType: imagePart.inlineData.mimeType,
        }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    }

    // 3. ANÁLISIS DE IMAGEN (MEJORADO)
    if (action === "analyzeImage") {
      const { model, imageBase64, mimeType } = body;
      const cleanBase64 = imageBase64.includes(",")
        ? imageBase64.split(",")[1]
        : imageBase64;
      const imagePart = { inlineData: { mimeType, data: cleanBase64 } };

      const analysisPromptText = `Act as a professional Director of Photography. Analyze this image to create a high-end prompt for AI image generation.
      
      Focus on these technical aspects:
      1. **Subject Description:** Describe the pose, action, clothing texture, and expression. IMPORTANT: Use the placeholder @img1 for the person. DO NOT describe specific facial features.
      2. **Lighting:** Identify the lighting setup (e.g., Rembrandt, Soft Butterfly), direction, and color temperature.
      3. **Camera & Angle:** Estimate the lens focal length, aperture, and camera angle.
      4. **Environment:** Describe the background and atmosphere.
      5. **Style:** Cinematic tone, color grading.

      Format the output as a single, cohesive, detailed paragraph starting directly with "Subject Description:".`;

      const finalData = await callGemini(model, "generateContent", {
        contents: { parts: [imagePart, { text: analysisPromptText }] },
      });
      const promptResult =
        finalData.candidates?.[0]?.content?.parts?.[0]?.text || "";
      const detectedSubjectType = "masculine"; // Default

      return new Response(
        JSON.stringify({ prompt: promptResult, detectedSubjectType }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    }

    return new Response(JSON.stringify({ error: "Action not found" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("API Handler Error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
