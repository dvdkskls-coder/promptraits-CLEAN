import { SHOT_TYPES, CAMERA_ANGLES } from "../data/shotTypesData";
import { ENVIRONMENTS_ARRAY } from "../data/environmentsData";
import { LIGHTING_SETUPS } from "../data/lightingData";
import { COLOR_GRADING_FILTERS } from "../data/colorGradingData";
// Importamos POSES directamente si es un array, o la función si lo prefieres.
// Para asegurar compatibilidad usamos POSES. Si tu archivo posesData exporta por defecto, ajusta aquí.
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
      // Intentamos leer el error como JSON, si falla, texto plano
      const errorData = await response.json().catch(() => null);
      const errorMessage = errorData?.error || (await response.text());
      throw new Error(
        `Error del servidor (${response.status}): ${errorMessage}`
      );
    }

    return await response.json();
  } catch (error) {
    console.error(`Error en servicio Gemini [${action}]:`, error);
    throw error;
  }
}

// ---------------------------------------------------------------------------
// 1. GENERACIÓN DE PROMPTS DE TEXTO
// ---------------------------------------------------------------------------

export const generateProfessionalPrompt = async (options) => {
  const {
    simpleIdea,
    gender, // 'masculine', 'feminine', 'couple'
    shotType,
    cameraAngle,
    outfitId,
    poseId,
    environmentId,
    lightingId,
    colorGradingId,
  } = options;

  // 1. Definir referencia de sujeto (Crucial para Nano Banana)
  let subjectReference = `The subject's face and appearance should be based on the reference photo @img1.`;
  if (gender === "couple") {
    subjectReference = `The subjects' faces and appearance should be based on their corresponding reference photos, @img1 and @img2.`;
  } else if (gender === "animal") {
    subjectReference = `If a person is present, face based on @img1. The animal based on @img2.`;
  }

  // 2. Resolver listas de datos según género
  let outfitList = [];
  if (gender === "feminine") outfitList = Outfits_women;
  else if (gender === "masculine") outfitList = Outfits_men;
  else outfitList = [...Outfits_women, ...Outfits_men]; // Couple o default

  // 3. Resolver lista de poses
  // Asumimos que POSES es un array importado. Si usas getPosesByGender, úsalo aquí.
  const poseList = Array.isArray(POSES) ? POSES : [];

  // 4. Construir System Instruction
  const systemInstruction = `You are a world-class prompt engineer and virtual director of photography. Your task is to expand a user's simple idea into a structured, professional, point-by-point photography prompt in English.

    **Instructions:**
    1. Analyze the user's core idea: "${simpleIdea}". This is the main theme.
    2. For each photographic category below, if the user selected a specific option, you MUST incorporate its essence.
    3. If a category is 'Automatic', you MUST CHOOSE the single BEST option from the provided list to creatively and professionally enhance the user's idea.
    4. Format the final output as a detailed, structured analysis. Headings: Subject Description, Composition & Framing, Environment & Background, Lighting, Color & Mood, and Technical Details & Style.
    5. **CRITICAL RULE FOR SUBJECT:** In "Subject Description", describe clothing, pose, and expression. **DO NOT** describe physical appearance, face, age, or hair. Instead, conclude with: "${subjectReference}".
    6. **Output Format:** Start directly with "Subject Description". No preambles.`;

  // 5. Construir el contexto de opciones
  const textSections = [
    `**User's Core Idea:** "${simpleIdea}"`,
    `**Shot Type:** ${
      shotType === "auto" || !shotType
        ? `(Automatic - Choose from: ${SHOT_TYPES.map((s) => s.nameES).join(
            ", "
          )})`
        : `(User Selected: ${
            SHOT_TYPES.find((s) => s.id === shotType)?.nameES || shotType
          })`
    }`,
    `**Camera Angle:** ${
      cameraAngle === "auto" || !cameraAngle
        ? `(Automatic - Choose from: ${CAMERA_ANGLES.map((a) => a.nameES).join(
            ", "
          )})`
        : `(User Selected: ${
            CAMERA_ANGLES.find((a) => a.id === cameraAngle)?.nameES ||
            cameraAngle
          })`
    }`,
    `**Environment:** ${
      environmentId === "auto" || !environmentId
        ? `(Automatic - Choose appropriate)`
        : `(User Selected: ${
            ENVIRONMENTS_ARRAY.find((e) => e.id === environmentId)?.name ||
            environmentId
          })`
    }`,
    `**Lighting:** ${
      lightingId === "auto" || !lightingId
        ? `(Automatic - Choose from: ${LIGHTING_SETUPS.map((l) => l.name).join(
            ", "
          )})`
        : `(User Selected: ${
            LIGHTING_SETUPS.find((l) => l.id === lightingId)?.name || lightingId
          })`
    }`,
    `**Color Grading:** ${
      colorGradingId === "auto" || !colorGradingId
        ? `(Automatic - Choose from: ${COLOR_GRADING_FILTERS.map(
            (c) => c.name
          ).join(", ")})`
        : `(User Selected: ${
            COLOR_GRADING_FILTERS.find((c) => c.id === colorGradingId)?.name ||
            colorGradingId
          })`
    }`,
  ];

  if (gender !== "animal") {
    textSections.splice(
      2,
      0,
      `**Outfit:** ${
        outfitId === "auto" || !outfitId
          ? `(Automatic - Choose suitable)`
          : `(User Selected: ${
              outfitList.find((o) => o.id === outfitId)?.name || outfitId
            })`
      }`
    );
    textSections.splice(
      3,
      0,
      `**Pose:** ${
        poseId === "auto" || !poseId
          ? `(Automatic - Choose suitable)`
          : `(User Selected: ${
              poseList.find((p) => p.id === poseId)?.name || poseId
            })`
      }`
    );
  }

  const fullPrompt = textSections.join("\n");

  // 6. Llamada al Backend
  const response = await callServer("generateText", {
    model: "gemini-2.5-flash-lite",
    prompt: fullPrompt,
    systemInstruction,
  });

  return response.text;
};

// ---------------------------------------------------------------------------
// 2. ANÁLISIS DE IMAGEN (¡Aquí estaba el error antes!)
// ---------------------------------------------------------------------------

/**
 * Analiza una imagen subida para extraer un prompt.
 * @param {string} fileBase64 - La imagen en formato base64
 * @param {string} mimeType - Tipo MIME (image/jpeg, etc.)
 */
export const analyzeImage = async (fileBase64, mimeType) => {
  return await callServer("analyzeImage", {
    model: "gemini-2.5-flash-lite",
    imageBase64: fileBase64,
    mimeType,
  });
};
