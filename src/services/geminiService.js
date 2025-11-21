// src/services/geminiService.js

/**
 * Llama al backend (api/gemini-processor) para generar el texto del prompt.
 * Este archivo es solo un "mensajero", no tiene lógica de IA.
 */
export const generatePrompt = async (params) => {
  try {
    console.log("🚀 Enviando petición al backend...");

    const response = await fetch("/api/gemini-processor", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      // Enviamos solo los datos limpios de texto
      body: JSON.stringify({
        idea: params.idea,
        photoStyle: params.style,
        lightingStyle: params.lighting,
        camera: params.camera,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.error || `Error ${response.status}: Fallo al generar prompt`
      );
    }

    return data; // Devuelve el JSON limpio al componente
  } catch (error) {
    console.error("❌ Error en geminiService:", error);
    throw error;
  }
};
