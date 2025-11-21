// src/services/geminiService.js

/**
 * 1. GENERADOR DE PROMPTS (Texto)
 * Llama a api/gemini-processor.js
 */
export const generatePrompt = async (params) => {
  try {
    const response = await fetch("/api/gemini-processor", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        idea: params.idea,
        photoStyle: params.style,
        lightingStyle: params.lighting,
        camera: params.camera,
      }),
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Error generando prompt");
    return data;
  } catch (error) {
    console.error("❌ Error generatePrompt:", error);
    throw error;
  }
};

/**
 * 2. ANALIZADOR DE IMÁGENES (Visión)
 * Llama a api/gemini-analyzer.js (Tu archivo existente)
 */
export const analyzeImage = async (file) => {
  try {
    // Convertimos el archivo File a Base64
    const base64Data = await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file); // Esto genera "data:image/png;base64,..."
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });

    // Llamamos a tu backend existente
    const response = await fetch("/api/gemini-analyzer", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        // Tu backend espera exactamente estas claves:
        imageBase64: base64Data,
        mimeType: file.type,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Error analizando imagen");
    }

    return data; // Devuelve el JSON del análisis
  } catch (error) {
    console.error("❌ Error analyzeImage:", error);
    throw error;
  }
};
