import { SHOT_TYPES, CAMERA_ANGLES } from "../data/shotTypesData";
import { ENVIRONMENTS_ARRAY } from "../data/environmentsData";
import { LIGHTING_SETUPS } from "../data/lightingData";
import { COLOR_GRADING_FILTERS } from "../data/colorGradingData";
import { POSES } from "../data/posesData";
import Outfits_women from "../data/Outfits_women";
import Outfits_men from "../data/Outfits_men";

// ---------------------------------------------------------------------------
// FUNCIÓN AUXILIAR PARA COMUNICARSE CON TU BACKEND (SERVERLESS)
// ---------------------------------------------------------------------------
async function callServer(action, body) {
  try {
    const response = await fetch("/api/gemini-processor", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action, ...body }),
    });

    if (!response.ok) {
      const errorJson = await response
        .json()
        .catch(() => ({ error: "Server error with no JSON response" }));
      throw new Error(errorJson.error || `Server error (${response.status})`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Error in Gemini Service [${action}]:`, error);
    throw error;
  }
}

// ---------------------------------------------------------------------------
// 1. GENERACIÓN DE PROMPTS DE TEXTO
// ---------------------------------------------------------------------------
export const generateProfessionalPrompt = async (options) => {
  // La lógica compleja ahora está en el backend.
  // El frontend solo pasa las opciones.
  return await callServer("generateText", {
    model: "gemini-2.5-flash-lite", // El backend podría incluso decidir el modelo
    ...options,
  });
};

export const summarizePromptForPlatforms = async (detailedPrompt) => {
  const systemInstruction = `You are an expert prompt engineer specializing in AI image generation platforms. Your task is to convert the following detailed, photographic brief into a compact, single-paragraph, comma-separated prompt in English. Synthesize all key creative elements. Crucially, if you see references like "@img1" or "@img2", you must preserve them exactly as they are at the beginning of the prompt. The final output must be a single block of text, without any headings or introductory phrases.`;

  const response = await callServer("generateText", {
    model: "gemini-2.5-flash",
    prompt: `Here is the detailed brief to convert:\n\n${detailedPrompt}`,
    systemInstruction,
  });
  return response.text;
};

// ---------------------------------------------------------------------------
// 2. ANÁLISIS DE IMAGEN
// ---------------------------------------------------------------------------
export const analyzeImage = async (fileBase64, mimeType) => {
  return await callServer("analyzeImage", {
    model: "gemini-2.5-flash",
    imageBase64: fileBase64,
    mimeType,
  });
};

// ---------------------------------------------------------------------------
// 3. GENERACIÓN DE IMAGEN
// ---------------------------------------------------------------------------
export const generateImageNano = async (prompt, faceImages) => {
  return await callServer("generateImageNano", {
    model: "gemini-2.5-flash-image",
    prompt,
    faceImages,
  });
};

// ============================================================================
// 4. NUEVAS FUNCIONES (AÚN NO IMPLEMENTADAS EN BACKEND)
// ============================================================================

export const editImage = async (base64ImageData, mimeType, prompt) => {
  // Esta función llamará a una nueva acción 'editImage' en el backend.
  // Implementaremos la lógica del backend en el siguiente paso.
  return await callServer("editImage", {
    model: "gemini-2.5-flash-image",
    base64ImageData,
    mimeType,
    prompt,
  });
};

export const generateImageImagen = async (prompt, aspectRatio) => {
  // Esta función llamará a una nueva acción 'generateImageImagen' en el backend.
  // Implementaremos la lógica del backend en el siguiente paso.
  return await callServer("generateImageImagen", {
    model: "imagen-4.0-generate-001",
    prompt,
    aspectRatio,
  });
};
