import { GoogleGenerativeAI } from "@google/generative-ai";

export const config = {
  runtime: "edge",
};

// =================================================================
// ⚙️ CONFIGURACIÓN Y LLAMADA A LA API
// =================================================================
const API_KEY = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(API_KEY);
const BASE_URL = "https://generativelanguage.googleapis.com/v1beta";

async function callGoogleAI(model, method, payload) {
  const url = `${BASE_URL}/models/${model}:${method}?key=${API_KEY}`;
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error(`Google API Error (${response.status}): ${errorText}`);
    throw new Error(`Error de la API de Google: ${errorText}`);
  }
  return response.json();
}

// =================================================================
// 🧠 ACCIONES DE LA IA (LÓGICA DE NEGOCIO)
// =================================================================

/**
 * Acción para generar texto.
 */
async function generateTextAction(body) {
  const { model, prompt, systemInstruction } = body;
  const payload = {
    contents: [{ parts: [{ text: prompt }] }],
    systemInstruction: systemInstruction
      ? { parts: [{ text: systemInstruction }] }
      : undefined,
  };
  const data = await callGoogleAI(model, "generateContent", payload);
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
  return { text };
}

/**
 * Acción para generar una imagen con el modelo Nano (referencia facial).
 */
async function generateImageNanoAction(body) {
  const { model, prompt, faceImages } = body;
  if (!prompt) {
    throw new Error("Prompt is required for generateImageNano");
  }

  const parts = [];
  if (faceImages?.length) {
    faceImages.forEach((img) => {
      const cleanData = img.base64.includes(",")
        ? img.base64.split(",")[1]
        : img.base64;
      parts.push({ inlineData: { mimeType: img.mimeType, data: cleanData } });
    });
  }
  parts.push({
    text: prompt + " . Photorealistic, 8k, highly detailed portrait.",
  });

  const payload = {
    contents: [{ parts }],
    generationConfig: { responseModalities: ["IMAGE"] },
  };
  const data = await callGoogleAI(model, "generateContent", payload);
  const imagePart = data.candidates?.[0]?.content?.parts?.find(
    (p) => p.inlineData
  );

  if (!imagePart) {
    throw new Error(
      "La IA no devolvió una imagen. Intenta simplificar el prompt."
    );
  }

  return {
    base64: imagePart.inlineData.data,
    mimeType: imagePart.inlineData.mimeType,
  };
}

/**
 * Acción para analizar una imagen.
 */
async function analyzeImageAction(body) {
  const { model, imageBase64, mimeType } = body;
  const cleanBase64 = imageBase64.includes(",")
    ? imageBase64.split(",")[1]
    : imageBase64;
  const imagePart = { inlineData: { mimeType, data: cleanBase64 } };

  const analysisPromptText = `Act as a professional Director of Photography. Analyze this image to create a high-end prompt for AI image generation.
  
  Focus on these technical aspects:
  1. **Subject Description:** Describe the pose, action, clothing texture, and expression. IMPORTANT: Use the placeholder @img1 for the person. DO NOT describe specific facial features.
  2. **Lighting:** Identify the lighting setup (e.g., Rembrandt, Butterfly), direction, and color temperature.
  3. **Camera & Angle:** Estimate the lens focal length, aperture, and camera angle.
  4. **Environment:** Describe the background and atmosphere.
  5. **Style:** Cinematic tone, color grading.

  Format the output as a single, cohesive, detailed paragraph starting directly with "Subject Description:".`;

  const finalData = await callGoogleAI(model, "generateContent", {
    contents: { parts: [imagePart, { text: analysisPromptText }] },
  });
  const promptResult =
    finalData.candidates?.[0]?.content?.parts?.[0]?.text || "";

  // TODO: Implementar lógica de detección de sujeto real (masculino, femenino, pareja)
  const detectedSubjectType = "masculine"; // Default por ahora

  return { prompt: promptResult, detectedSubjectType };
}

// Mapeo de acciones a funciones
const ACTIONS = {
  /**
   * Analiza una imagen y devuelve un prompt detallado y el tipo de sujeto.
   */
  analyzeImage: async (params) => {
    const { image, mimeType } = params;
    if (!image || !mimeType) {
      throw new Error("Se requiere una imagen y su tipo MIME para el análisis.");
    }

    // Limpiar el prefijo 'data:image/jpeg;base64,' si existe
    const base64Data = image.includes(',') ? image.split(',')[1] : image;

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const imagePart = {
      inlineData: {
        data: base64Data, // Usar los datos limpios
        mimeType,
      },
    };

    const systemPrompt = `Eres un director de fotografía experto y un asistente de IA especializado en generar prompts para modelos de imagen fotorrealistas. Tu tarea es analizar una imagen y devolver un objeto JSON con dos claves: "subject" y "prompt".

1.  **Clave "subject"**: Identifica el sujeto principal en la imagen. Los valores posibles son: "male", "female", "couple" (dos personas), "animal", "person_and_animal". Si no encaja en ninguna, usa "other".

2.  **Clave "prompt"**: Crea un prompt ultra detallado basado en la imagen, siguiendo esta estructura estricta. No inventes detalles que no estén en la imagen. Sé descriptivo y técnico.

    **Subject:** A realistic photo of [DESCRIBE EL SUJETO, p. ej., "a man", "a woman and a dog"]. The face will be replaced, so use "[TARGET_FACE]" for the main person, or "[TARGET_FACE_1]" and "[TARGET_FACE_2]" for a couple.
    **Environment:** [Describe el entorno/fondo de la imagen de forma detallada].
    **Pose:** [Describe la pose del sujeto o sujetos].
    **Outfit:** [Describe la ropa y accesorios que lleva el sujeto].
    **Shot Type:** [Describe el tipo de plano, p. ej., "Medium shot", "Full body shot", "Close-up portrait"].
    **Lighting:** [Describe el esquema de iluminación, p. ej., "Soft, diffused window light coming from the left", "Golden hour backlight", "Dramatic Rembrandt lighting"].
    **Color Grading:** Cinematic, [Describe la paleta de colores o el ambiente, p. ej., "warm and vibrant tones", "moody and desaturated colors"].
    **Camera & Lens:** Shot on Sony A7R IV, [Sugiere una lente apropiada, p. ej., "Zeiss Planar T* 50mm f/1.4"], f/1.8, 1/200s, ISO 100.
    **Film Stock:** Emulating [Sugiere un tipo de película, p. ej., "Kodak Portra 400"] film stock.
    **Details:** Ultra-detailed, 8K, photorealistic, sharp focus, high quality.`;

    const result = await model.generateContent([systemPrompt, imagePart]);
    const response = result.response;
    const text = response.text();

    // Limpiar y parsear la respuesta JSON
    try {
      const cleanedText = text
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();
      const jsonResponse = JSON.parse(cleanedText);
      return jsonResponse; // Devuelve { subject: "...", prompt: "..." }
    } catch (e) {
      console.error("Error al parsear la respuesta de Gemini:", e);
      console.error("Respuesta recibida:", text);
      throw new Error("La IA no devolvió un formato JSON válido.");
    }
  },

  /**
   * Genera una imagen usando el modelo Imagen 4.0 (placeholder).
   * @param {Object} params - Parámetros para la generación de la imagen.
   * @param {string} prompt - El prompt para generar la imagen.
   * @returns {Promise<object>} - La imagen generada.
   */
  generateImageImagen: async (params) => {
    const { prompt } = params;
    if (!prompt) {
      throw new Error("Se requiere un prompt para generar la imagen.");
    }

    const model = genAI.getGenerativeModel({ model: "imagen-4.0" });
    const result = await model.generateContent([prompt]);
    const file = result.response.candidates[0].content.parts[0].fileData;
    return { base64: file.data, mimeType: file.mimeType };
  },

  /**
   * Edita una imagen (placeholder).
   * @param {Object} params - Parámetros para la edición de la imagen.
   * @param {string} prompt - La instrucción de edición.
   * @returns {Promise<object>} - La imagen editada.
   */
  editImage: async (params) => {
    const { prompt } = params;
    if (!prompt) {
      throw new Error("Se requiere un prompt para editar la imagen.");
    }

    // Lógica de edición de imagen (placeholder)
    return {
      base64: "data:image/png;base64,EDITED_IMAGE_DATA",
      mimeType: "image/png",
    };
  },

  /**
   * Genera una imagen con Nano, aplicando una cara.
   * @param {Object} params - Parámetros para la generación de la imagen.
   * @param {string} prompt - El prompt para generar la imagen.
   * @returns {Promise<object>} - La imagen generada.
   */
  generateImageNano: async (params) => {
    const { prompt, faceImages } = params;
    if (!prompt || !faceImages || !faceImages.length) {
      throw new Error("Se requiere un prompt y al menos una imagen de cara.");
    }

    const model = genAI.getGenerativeModel({ model: "nano-1.0" });

    // Limpiar el base64 de las imágenes de cara
    const cleanedFaceImages = faceImages.map(img => ({
      ...img,
      base64: img.base64.includes(',') ? img.base64.split(',')[1] : img.base64,
    }));

    const result = await model.generateContent([
      prompt,
      ...cleanedFaceImages.map((img) => ({
        inlineData: { data: img.base64, mimeType: img.mimeType },
      })),
    ]);
    const file = result.response.candidates[0].content.parts[0].fileData;
    return { base64: file.data, mimeType: file.mimeType };
  },
};

// =================================================================
// 🚪 HANDLER PRINCIPAL (PUNTO DE ENTRADA)
// =================================================================
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const body = await req.json();
    const { action, ...params } = body; // Separar la acción de los parámetros

    const actionFn = ACTIONS[action];

    if
