export const config = {
  runtime: "edge",
};

// =================================================================
// 📚 IMPORTACIÓN DE CONOCIMIENTO (DATA)
// =================================================================
// Estos son los datos que el generador usará para el modo "Automático".
import { Outfits_men } from "../src/data/Outfits_men.js";
import { Outfits_women } from "../src/data/Outfits_women.js";
import { POSES } from "../src/data/posesData.js";
import { OUTFIT_STYLES } from "../src/data/outfitStylesData.js";
import { LIGHTING_SETUPS } from "../src/data/lightingData.js";
import {
  SHOT_TYPES,
  CAMERA_ANGLES,
  SPECIAL_COMPOSITIONS,
  DEPTH_OF_FIELD,
} from "../src/data/shotTypesData.js";
import { ENVIRONMENTS } from "../src/data/environmentsData.js";
import { COLOR_GRADING_FILTERS } from "../src/data/colorGradingData.js";
import { cameras } from "../src/data/camerasData.js";
import { lenses } from "../src/data/lensesData.js";
import { filmEmulations } from "../src/data/filmEmulationsData.js";

// =================================================================
// ⚙️ CONFIGURACIÓN Y LLAMADA A LA API DE GOOGLE
// =================================================================
const API_KEY = process.env.GEMINI_API_KEY;
const BASE_URL = "https://generativelanguage.googleapis.com/v1beta";

async function callGoogleAI(model, systemPrompt, userPrompt) {
  const url = `${BASE_URL}/models/${model}:generateContent?key=${API_KEY}`;

  const payload = {
    systemInstruction: {
      parts: [{ text: systemPrompt }],
    },
    contents: [
      {
        role: "user",
        parts: [{ text: userPrompt }],
      },
    ],
    generationConfig: {
      // temperature: 0.8, // Un poco más creativo
      // topP: 0.9,
      // maxOutputTokens: 1024,
    },
  };

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
 * Construye el "System Prompt" maestro para el generador de prompts de fotografía.
 * Este prompt instruye a la IA sobre su rol, el formato de salida y el conocimiento experto que debe usar.
 */
function buildSystemPrompt() {
  // Aquí se condensa todo el conocimiento de los 4 documentos.
  return `
    Eres "Prompt-Genius", un director de fotografía y fotógrafo experto de renombre mundial. Tu única misión es generar un prompt de fotografía hiperrealista y profesional basado en las especificaciones del usuario.

    REGLAS ESTRICTAS:
    1.  **FORMATO OBLIGATORIO DE 8 LÍNEAS:** Tu respuesta DEBE seguir esta estructura exacta, sin excepciones, sin explicaciones adicionales, solo el prompt.
        (1) Scene: [Tipo de Fotografía], [Entorno/Localización], [Concepto General]
        (2) Camera: [Modelo de Cámara], [Ajustes: Lente, Apertura, Velocidad, ISO]
        (3) Composition: [Tipo de Plano], [Ángulo de Cámara], [Regla de Composición]
        (4) Subject: [Descripción del Sujeto], [Pose/Acción], [Estilo de Vestuario]
        (5) Filters & Effects: [Filtro Físico y su efecto], [Efectos de Post-producción]
        (6) Lighting: [Esquema de Iluminación], [Calidad de la Luz], [Modificadores]
        (7) Style & Mood: [Estilo Visual], [Paleta de Colores], [Emoción/Sentimiento]
        (8) Film Emulation: [Emulación de Película], [Nivel de Grano]

    2.  **TERMINOLOGÍA PROFESIONAL:** DEBES usar la terminología técnica y artística de los documentos de conocimiento. Sé específico. No digas "luz suave", di "Luz suave y difusa de un softbox octogonal grande". No digas "fondo desenfocado", di "Profundidad de campo reducida (f/1.4) creando un bokeh cremoso".

    3.  **LÓGICA "AUTOMÁTICO":** Si el usuario especifica "Automático" para un campo, DEBES elegir una opción apropiada y coherente del CONOCIMIENTO DE DATOS JSON proporcionado. Tus elecciones deben funcionar en armonía para crear una imagen cohesiva y de alta calidad.

    4.  **COHERENCIA TOTAL:** Todas las líneas deben estar interconectadas. Si la escena es "Retrato de moda edgy", la iluminación podría ser "Split lighting con luz dura", la composición un "Plano Americano en ángulo contrapicado" y el estilo "Alto contraste vibrante".

    CONOCIMIENTO CLAVE (Extraído de tus guías expertas):

    *   **Iluminación:** Usa esquemas como Rembrandt, Butterfly, Loop, Split. Describe la calidad (dura, suave) y la dirección (lateral, contraluz). Menciona modificadores (softbox, beauty dish, reflector). La luz crea emoción: la luz suave es calma, la luz dura es drama.
    *   **Composición:** Usa planos (Close-up, Full Body), ángulos (High Angle, Low Angle, Dutch Angle) y reglas (Regla de Tercios, Espacio Negativo).
    *   **Filtros:** Son cruciales. Menciona filtros físicos y su efecto.
        *   **Tiffen Black Pro-Mist (1/8, 1/4):** Para un look cinematográfico, crea un halo suave (halation/bloom) en las luces altas y reduce la nitidez digital. ESENCIAL para el look "de película".
        *   **Polarizador (CPL):** Para intensificar cielos azules, reducir reflejos en agua/cristal y saturar vegetación.
        *   **ND (ND8, ND1000):** Para usar aperturas amplias a pleno sol (f/1.8) o para largas exposiciones diurnas (efecto seda en agua).
        *   **GND (Graduado):** Para equilibrar cielos brillantes con paisajes oscuros.
    *   **Color y Estilo (Grading):** Describe la paleta de colores. Usa estilos como "Teal & Orange", "Vintage Film Look con negros desvanecidos (matte)", "Alto contraste con colores vibrantes", "Blanco y negro con grano de película".
    *   **Cámara y Lente:** Sé específico. Un "Sony FE 85mm f/1.4 GM" es ideal para retratos con bokeh. Un "Canon RF 24-70mm f/2.8L" es versátil.
    *   **Emulación de Película:** Menciona stocks específicos como "Kodak Portra 400" (tonos de piel suaves), "CineStill 800T" (look cinematográfico nocturno con halos rojos), o "Fujifilm Velvia 50" (paisajes saturados).

    Tu objetivo es la excelencia. Cada prompt debe ser una receta precisa para una fotografía galardonada.
    `;
}

/**
 * Construye el prompt para el usuario que se enviará a la IA.
 * @param {object} selections - Las selecciones del usuario desde el frontend.
 * @param {object} dataKnowledge - El conocimiento de los archivos de datos.
 * @returns {string}
 */
function buildUserPrompt(selections, dataKnowledge) {
  return `
    Genera un prompt de fotografía profesional basado en las siguientes especificaciones del usuario y tu conocimiento experto.

    ---
    ESPECIFICACIONES DEL USUARIO:
    - Género Fotográfico: ${selections.photoGenre}
    - Entorno: ${selections.environment}
    - Tipo de Plano: ${selections.shotType}
    - Ángulo de Cámara: ${selections.cameraAngle}
    - Composición: ${selections.composition}
    - Pose/Acción: ${selections.pose}
    - Estilo de Vestuario: ${selections.outfitStyle}
    - Vestuario Específico: ${selections.outfit}
    - Cámara: ${selections.camera}
    - Lente: ${selections.lens}
    - Profundidad de Campo: ${selections.dof}
    - Esquema de Iluminación: ${selections.lighting}
    - Filtros y Efectos: ${selections.filters}
    - Estilo de Color: ${selections.colorGrading}
    - Emulación de Película: ${selections.filmEmulation}
    ---

    ---
    CONOCIMIENTO DE DATOS JSON (Para usar en modo "Automático"):
    - Entornos Disponibles: ${JSON.stringify(dataKnowledge.environments)}
    - Tipos de Plano Disponibles: ${JSON.stringify(dataKnowledge.shotTypes)}
    - Ángulos de Cámara Disponibles: ${JSON.stringify(
      dataKnowledge.cameraAngles
    )}
    - Composiciones Disponibles: ${JSON.stringify(dataKnowledge.compositions)}
    - Poses Masculinas: ${JSON.stringify(dataKnowledge.poses.masculine)}
    - Poses Femeninas: ${JSON.stringify(dataKnowledge.poses.feminine)}
    - Poses de Pareja: ${JSON.stringify(dataKnowledge.poses.couple)}
    - Estilos de Vestuario Disponibles: ${JSON.stringify(
      dataKnowledge.outfitStyles
    )}
    - Ropa Masculina Específica: ${JSON.stringify(dataKnowledge.outfits_men)}
    - Ropa Femenina Específica: ${JSON.stringify(dataKnowledge.outfits_women)}
    - Cámaras Disponibles: ${JSON.stringify(dataKnowledge.cameras)}
    - Lentes Disponibles: ${JSON.stringify(dataKnowledge.lenses)}
    - Profundidades de Campo: ${JSON.stringify(dataKnowledge.dof)}
    - Esquemas de Iluminación: ${JSON.stringify(dataKnowledge.lightingSetups)}
    - Filtros y Estilos de Color: ${JSON.stringify(dataKnowledge.colorGrading)}
    - Emulaciones de Película: ${JSON.stringify(dataKnowledge.filmEmulations)}
    ---

    Ahora, genera el prompt de 8 líneas.
  `;
}

/**
 * Genera un prompt de fotografía experto basado en las selecciones del usuario.
 * @param {object} body - Las selecciones del usuario.
 * @returns {Promise<{ text: string }>}
 */
async function generateExpertPromptAction(body) {
  const systemPrompt = buildSystemPrompt();

  const dataKnowledge = {
    environments: ENVIRONMENTS,
    shotTypes: SHOT_TYPES,
    cameraAngles: CAMERA_ANGLES,
    compositions: SPECIAL_COMPOSITIONS,
    poses: POSES,
    outfitStyles: OUTFIT_STYLES,
    outfits_men: Outfits_men,
    outfits_women: Outfits_women,
    cameras: cameras,
    lenses: lenses,
    dof: DEPTH_OF_FIELD,
    lightingSetups: LIGHTING_SETUPS,
    colorGrading: COLOR_GRADING_FILTERS,
    filmEmulations: filmEmulations,
  };

  const userPrompt = buildUserPrompt(body, dataKnowledge);

  const result = await callGoogleAI(
    "gemini-2.5-flash", // Usamos el modelo más reciente
    systemPrompt,
    userPrompt
  );

  if (
    result.candidates &&
    result.candidates[0] &&
    result.candidates[0].content &&
    result.candidates[0].content.parts &&
    result.candidates[0].content.parts[0]
  ) {
    // Limpieza final para asegurar que solo devolvemos el prompt
    const rawText = result.candidates[0].content.parts[0].text;
    // A veces la IA puede añadir ``` o markdown, lo limpiamos.
    const cleanText = rawText.replace(/```/g, "").trim();
    return { text: cleanText };
  } else {
    console.error(
      "Unexpected response structure from generateExpertPromptAction:",
      JSON.stringify(result, null, 2)
    );
    throw new Error(
      "No se pudo generar el prompt. La respuesta de la API no tiene el formato esperado."
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
      // La acción 'generate-text' ahora usa el generador experto.
      case "generate-text":
        result = await generateExpertPromptAction(body);
        break;
      // Mantenemos analyze-image por si se usa en otro lado, aunque no es parte del lab.
      case "analyze-image":
        const { imageBase64, mimeType } = body;
        const analysisPrompt = `
          Analiza esta imagen y genera un prompt de fotografía hiperrealista y profesional en el formato de 8 líneas que conoces. Extrae todos los detalles técnicos y artísticos posibles.

          REGLAS:
          1.  **FORMATO OBLIGATORIO DE 8 LÍNEAS:** Tu respuesta DEBE seguir esta estructura exacta.
              (1) Scene:
              (2) Camera:
              (3) Composition:
              (4) Subject:
              (5) Filters & Effects:
              (6) Lighting:
              (7) Style & Mood:
              (8) Film Emulation:
          2.  **INFIERE LOS DETALLES:** Si un detalle no es obvio (ej. modelo de cámara exacto), infiere una opción profesional y coherente.
          3.  **SÉ TÉCNICO:** Usa terminología fotográfica precisa.
        `;

        const visionPayload = {
          contents: [
            {
              parts: [
                { text: analysisPrompt },
                { inline_data: { mime_type: mimeType, data: imageBase64 } },
              ],
            },
          ],
        };
        const visionModel = "gemini-pro-vision"; // El modelo correcto para análisis de imagen
        const visionUrl = `${BASE_URL}/models/${visionModel}:generateContent?key=${API_KEY}`;

        const visionResponse = await fetch(visionUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(visionPayload),
        });

        if (!visionResponse.ok) {
          const errorText = await visionResponse.text();
          console.error(
            `Google Vision API Error (${visionResponse.status}): ${errorText}`
          );
          throw new Error(`Error de la API de Google Vision: ${errorText}`);
        }

        const visionResult = await visionResponse.json();

        if (
          visionResult.candidates &&
          visionResult.candidates[0].content.parts[0]
        ) {
          const rawText = visionResult.candidates[0].content.parts[0].text;
          const cleanText = rawText.replace(/```/g, "").trim();
          result = { text: cleanText };
        } else {
          console.error(
            "Invalid response structure from vision API:",
            JSON.stringify(visionResult, null, 2)
          );
          throw new Error("Respuesta inválida de la API de Vision.");
        }
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
