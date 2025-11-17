// ---------------------------------------------------------------------------
// FUNCIÓN AUXILIAR PARA COMUNICARSE CON TU BACKEND (SERVERLESS)
// ---------------------------------------------------------------------------
async function callServer(endpoint, body) {
  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorJson = await response
        .json()
        .catch(() => ({ error: "Server error with no JSON response" }));
      throw new Error(errorJson.error || `Server error (${response.status})`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Error calling endpoint ${endpoint}:`, error);
    throw error;
  }
}

// ---------------------------------------------------------------------------
// 1. GENERACIÓN DE PROMPTS JSON ESTRUCTURADOS
// ---------------------------------------------------------------------------
export const generateProfessionalPrompt = async (options) => {
  // Llama al endpoint que ahora solo genera JSON.
  return await callServer("/api/gemini-processor", options);
};

// ---------------------------------------------------------------------------
// 2. ANÁLISIS DE IMAGEN (Image-to-Prompt)
// ---------------------------------------------------------------------------
export const analyzeImage = async (fileBase64, mimeType) => {
  // Llama a un endpoint específico para el análisis de imagen.
  // Asumimos que la lógica se moverá a su propio archivo/endpoint.
  return await callServer("/api/gemini-analyzer", {
    model: "gemini-2.5-flash",
    imageBase64: fileBase64,
    mimeType,
  });
};

// ---------------------------------------------------------------------------
// 3. GENERACIÓN DE IMAGEN
// ---------------------------------------------------------------------------
export const generateImageNano = async (prompt, faceImages) => {
  // Este endpoint maneja Form-Data, por lo que necesita su propio fetch.
  const formData = new FormData();
  formData.append("prompt", prompt);
  if (faceImages) {
    faceImages.forEach((img) => {
      formData.append("faceImages", img);
    });
  }

  const response = await fetch("/api/generate-image", {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const errorJson = await response
      .json()
      .catch(() => ({ error: "Server error with no JSON response" }));
    throw new Error(errorJson.error || `Server error (${response.status})`);
  }

  return await response.json();
};

// Funciones que antes estaban aquí (summarize, edit, etc.) se eliminan por claridad
// ya que no son parte del flujo principal actual.
