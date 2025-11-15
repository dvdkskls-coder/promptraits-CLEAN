export const config = {
  runtime: "edge",
};

// =================================================================
// ⚙️ CONFIGURACIÓN Y LLAMADA A LA API
// =================================================================
const API_KEY = process.env.GEMINI_API_KEY;
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
// 🧠 ACCIONES DE IA (LÓGICA DE NEGOCIO)
// =================================================================

/**
 * Genera texto a partir de un prompt.
 * @param {{ prompt: string }} body
 * @returns {Promise<{ text: string }>}
 */
async function generateTextAction({ prompt }) {
  const payload = {
    contents: [{ parts: [{ text: prompt }] }],
    // generationConfig, safetySettings, etc. can be added here
  };

  const result = await callGoogleAI(
    "gemini-1.5-flash",
    "generateContent",
    payload
  );
  // NOTE: The response structure for the REST API is different from the SDK.
  // We need to access the text from the correct path.
  if (
    result.candidates &&
    result.candidates[0] &&
    result.candidates[0].content &&
    result.candidates[0].content.parts &&
    result.candidates[0].content.parts[0]
  ) {
    return { text: result.candidates[0].content.parts[0].text };
  } else {
    console.error(
      "Unexpected response structure from generateTextAction:",
      JSON.stringify(result, null, 2)
    );
    throw new Error(
      "No se pudo generar el texto. La respuesta de la API no tiene el formato esperado."
    );
  }
}

/**
 * Analiza una imagen y devuelve un prompt de texto.
 * @param {{ imageBase64: string, prompt: string }} params
 * @returns {Promise<{ text: string }>}
 */
async function analyzeImageAction({ imageBase64, prompt }) {
  const payload = {
    contents: [
      {
        parts: [
          { text: prompt },
          {
            inline_data: {
              mime_type: "image/jpeg",
              data: imageBase64,
            },
          },
        ],
      },
    ],
  };

  const result = await callGoogleAI(
    "gemini-pro-vision",
    "generateContent",
    payload
  );
  // NOTE: The response structure for the REST API is different from the SDK.
  // We need to access the text from the correct path.
  if (
    result.candidates &&
    result.candidates[0] &&
    result.candidates[0].content &&
    result.candidates[0].content.parts &&
    result.candidates[0].content.parts[0]
  ) {
    return { text: result.candidates[0].content.parts[0].text };
  } else {
    console.error(
      "Unexpected response structure from analyzeImageAction:",
      JSON.stringify(result, null, 2)
    );
    throw new Error(
      "No se pudo analizar la imagen. La respuesta de la API no tiene el formato esperado."
    );
  }
}

// =================================================================
// 🚀 PUNTO DE ENTRADA PRINCIPAL (HANDLER)
// =================================================================

export default async function handler(req) {
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const { action, ...body } = await req.json();

    if (!action) {
      return new Response(JSON.stringify({ error: "Action is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    let result;
    switch (action) {
      case "generate-text":
        result = await generateTextAction(body);
        break;
      case "analyze-image":
        result = await analyzeImageAction(body);
        break;
      default:
        return new Response(JSON.stringify({ error: "Invalid action" }), {
          status: 400,
          headers: { "Content-Type": "application/json" },
        });
    }

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in handler:", error);
    const errorMessage = error.message || "An internal server error occurred.";
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
