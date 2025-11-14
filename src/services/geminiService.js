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

    const responseText = await response.text();

    if (!response.ok) {
      let errorMessage = responseText;
      try {
        const errorJson = JSON.parse(responseText);
        if (errorJson.error) errorMessage = errorJson.error;
      } catch (e) {}
      throw new Error(
        `Error del servidor (${response.status}): ${errorMessage}`
      );
    }

    return JSON.parse(responseText);
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
    gender,
    shotType,
    cameraAngle,
    outfitId,
    poseId,
    environmentId,
    lightingId,
    colorGradingId,
  } = options;

  let subjectReference = `The subject's face and appearance should be based on the reference photo @img1.`;
  if (gender === "couple") {
    subjectReference = `The subjects' faces based on references @img1 and @img2.`;
  } else if (gender === "animal") {
    subjectReference = `Person based on @img1, animal based on @img2.`;
  }

  let outfitList =
    gender === "feminine"
      ? Outfits_women
      : gender === "masculine"
      ? Outfits_men
      : [...Outfits_women, ...Outfits_men];
  const poseList = Array.isArray(POSES) ? POSES : [];

  const systemInstruction = `You are a world-class prompt engineer. Expand the user's simple idea into a structured photography prompt.
    **Instructions:**
    1. Analyze: "${simpleIdea}".
    2. Incorporate selected options.
    3. Format: Subject Description, Composition, Environment, Lighting, Color.
    4. **CRITICAL:** In "Subject Description", describe clothing and pose. **DO NOT** describe face/age/hair. End section with: "${subjectReference}".
    5. Output: Start directly with "Subject Description".`;

  const textSections = [
    `**User Idea:** "${simpleIdea}"`,
    `**Shot:** ${
      shotType === "auto" || !shotType
        ? `(Automatic)`
        : `(User: ${
            SHOT_TYPES.find((s) => s.id === shotType)?.nameES || shotType
          })`
    }`,
    `**Angle:** ${
      cameraAngle === "auto" || !cameraAngle
        ? `(Automatic)`
        : `(User: ${
            CAMERA_ANGLES.find((a) => a.id === cameraAngle)?.nameES ||
            cameraAngle
          })`
    }`,
    `**Environment:** ${
      environmentId === "auto" || !environmentId
        ? `(Automatic)`
        : `(User: ${
            ENVIRONMENTS_ARRAY.find((e) => e.id === environmentId)?.name ||
            environmentId
          })`
    }`,
    `**Lighting:** ${
      lightingId === "auto" || !lightingId
        ? `(Automatic)`
        : `(User: ${
            LIGHTING_SETUPS.find((l) => l.id === lightingId)?.name || lightingId
          })`
    }`,
    `**Color:** ${
      colorGradingId === "auto" || !colorGradingId
        ? `(Automatic)`
        : `(User: ${
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
          ? `(Automatic)`
          : `(User: ${
              outfitList.find((o) => o.id === outfitId)?.name || outfitId
            })`
      }`
    );
    textSections.splice(
      3,
      0,
      `**Pose:** ${
        poseId === "auto" || !poseId
          ? `(Automatic)`
          : `(User: ${poseList.find((p) => p.id === poseId)?.name || poseId})`
      }`
    );
  }

  const response = await callServer("generateText", {
    model: "gemini-2.5-flash-lite",
    prompt: textSections.join("\n"),
    systemInstruction,
  });

  return response.text;
};

// ---------------------------------------------------------------------------
// 2. ANÁLISIS DE IMAGEN
// ---------------------------------------------------------------------------
export const analyzeImage = async (fileBase64, mimeType) => {
  return await callServer("analyzeImage", {
    model: "gemini-2.5-flash-lite",
    imageBase64: fileBase64,
    mimeType,
  });
};

// ---------------------------------------------------------------------------
// 3. GENERACIÓN DE IMAGEN (¡ESTA ES LA QUE FALTABA!)
// ---------------------------------------------------------------------------
export const generateImageNano = async (prompt, faceImages) => {
  return await callServer("generateImageNano", {
    model: "gemini-2.5-flash-image",
    prompt,
    faceImages,
  });
};
