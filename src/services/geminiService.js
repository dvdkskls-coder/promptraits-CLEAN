// ============================================================================
// GEMINI SERVICE - Frontend API Client
// ============================================================================

const API_BASE = import.meta.env.PROD ? "" : "http://localhost:3000";

/**
 * 1. GENERADOR DE PROMPTS (Text-to-Text)
 * Usa: Gemini 2.5 Flash
 */
export const generatePrompt = async (params) => {
  try {
    const response = await fetch(`${API_BASE}/api/gemini-processor`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        idea: params.idea,
        photoStyle: params.style,
        camera: params.camera,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.error || `Error ${response.status}: ${response.statusText}`
      );
    }

    return data;
  } catch (error) {
    console.error("❌ Error generatePrompt:", error);
    throw error;
  }
};

/**
 * 2. ANALIZADOR DE IMÁGENES (Image-to-Text)
 * Usa: Gemini 2.5 Flash (Vision)
 */
export const analyzeImage = async (file) => {
  try {
    // Validar tipo de archivo
    if (!file.type.startsWith("image/")) {
      throw new Error("El archivo debe ser una imagen (JPEG, PNG, WEBP)");
    }

    // Validar tamaño (máx 4MB para Gemini)
    const maxSize = 4 * 1024 * 1024; // 4MB
    if (file.size > maxSize) {
      throw new Error("La imagen no puede superar 4MB");
    }

    // Convertir a Base64
    const base64Data = await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });

    const response = await fetch(`${API_BASE}/api/gemini-analyzer`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        imageBase64: base64Data,
        mimeType: file.type,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || `Error ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error("❌ Error analyzeImage:", error);
    throw error;
  }
};

/**
 * 3. GENERADOR DE IMÁGENES (Prompt-to-Image)
 * Usa: Gemini 2.5 Flash Image (con soporte para selfie)
 */
export const generateImage = async (
  prompt,
  aspectRatio = "1:1",
  selfieFile = null
) => {
  try {
    const body = {
      prompt: prompt,
      aspectRatio: aspectRatio,
    };

    // Si hay selfie, convertir a base64
    if (selfieFile) {
      const selfieBase64 = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(selfieFile);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
      });

      body.selfieBase64 = selfieBase64;
    }

    const response = await fetch(`${API_BASE}/api/generate-image`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || `Error ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error("❌ Error generateImage:", error);
    throw error;
  }
};

/**
 * 4. VERIFICAR CRÉDITOS DEL USUARIO
 */
export const checkCredits = async (userId, actionType) => {
  try {
    const response = await fetch(`${API_BASE}/api/check-credits`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: userId,
        actionType: actionType,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Error verificando créditos");
    }

    return data;
  } catch (error) {
    console.error("❌ Error checkCredits:", error);
    throw error;
  }
};
