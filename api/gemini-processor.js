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

    // 2. GENERAR IMAGEN (NANO BANANA) - Añadido por si acaso lo usas aquí
    if (action === "generateImageNano") {
      const { model, prompt, faceImages } = body;
      const parts = [];
      if (faceImages?.length) {
        faceImages.forEach((img) => {
          // Limpiar base64 si viene con prefijo
          const cleanData = img.base64.includes(",")
            ? img.base64.split(",")[1]
            : img.base64;
          parts.push({
            inlineData: { mimeType: img.mimeType, data: cleanData },
          });
        });
      }
      parts.push({ text: prompt });

      const payload = {
        contents: [{ parts }],
        generationConfig: { responseModalities: ["IMAGE"] },
      };
      const data = await callGemini(model, "generateContent", payload);

      const imagePart = data.candidates?.[0]?.content?.parts?.find(
        (p) => p.inlineData
      );
      if (!imagePart) throw new Error("No image generated");

      return new Response(
        JSON.stringify({
          base64: `data:${imagePart.inlineData.mimeType};base64,${imagePart.inlineData.data}`,
          mimeType: imagePart.inlineData.mimeType,
        }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    }

    // 3. ANÁLISIS DE IMAGEN
    if (action === "analyzeImage") {
      const { model, imageBase64, mimeType } = body;
      const cleanBase64 = imageBase64.includes(",")
        ? imageBase64.split(",")[1]
        : imageBase64;
      const imagePart = { inlineData: { mimeType, data: cleanBase64 } };

      // Count humans
      const countData = await callGemini(model, "generateContent", {
        contents: {
          parts: [
            imagePart,
            { text: "How many prominent human subjects? Return number only." },
          ],
        },
      });
      const humanCount =
        parseInt(
          (countData.candidates?.[0]?.content?.parts?.[0]?.text || "0").trim()
        ) || 0;

      // Check animals
      const animalData = await callGemini(model, "generateContent", {
        contents: { parts: [imagePart, { text: "Prominent animal? yes/no" }] },
      });
      const hasAnimal = (
        animalData.candidates?.[0]?.content?.parts?.[0]?.text || ""
      )
        .toLowerCase()
        .includes("yes");

      let detectedSubjectType = "masculine";
      let analysisPromptText =
        'Analyze image for photography prompt. Start with "Subject Description".';

      if (humanCount === 1 && hasAnimal) {
        detectedSubjectType = "animal";
        analysisPromptText = `Analyze image with 1 person and 1 animal. Describe Person (@img1) and Animal (@img2). Do NOT describe faces. Structure: Subject, Composition, Lighting, Color.`;
      } else if (humanCount >= 2) {
        detectedSubjectType = "couple";
        analysisPromptText = `Analyze image with 2 people (@img1, @img2). Do NOT describe faces. Structure: Subject, Composition, Lighting, Color.`;
      }

      const finalData = await callGemini(model, "generateContent", {
        contents: { parts: [imagePart, { text: analysisPromptText }] },
      });
      const promptResult =
        finalData.candidates?.[0]?.content?.parts?.[0]?.text || "";

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
