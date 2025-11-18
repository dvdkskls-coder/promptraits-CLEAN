export const config = {
  runtime: "edge",
};

// =================================================================
// 📚 IMPORTACIÓN DE CONOCIMIENTO (DATA)
// =================================================================
import { PHOTO_STYLES } from "../src/data/photoStylesData";
import { LIGHTING_SETUPS } from "../src/data/lightingData";
import { SHOT_TYPES } from "../src/data/shotTypesData";
import { ENVIRONMENTS } from "../src/data/environmentsData";
import { cameras } from "../src/data/camerasData";
import { lenses } from "../src/data/lensesData";
import { POSES } from "../src/data/posesData";
import { Outfits_men } from "../src/data/Outfits_men";
import { Outfits_women } from "../src/data/Outfits_women";

// =================================================================
// ⚙️ CONFIGURACIÓN Y LLAMADA A LA API DE GOOGLE
// =================================================================
const API_KEY = process.env.GEMINI_API_KEY;
const BASE_URL = "https://generativelanguage.googleapis.com/v1beta";

async function callGoogleAI(model, systemPrompt, userPrompt) {
  const url = `${BASE_URL}/models/${model}:generateContent?key=${API_KEY}`;
  const payload = {
    systemInstruction: { parts: [{ text: systemPrompt }] },
    contents: [{ role: "user", parts: [{ text: userPrompt }] }],
    generationConfig: {
      responseMimeType: "application/json",
      temperature: 0.8,
      topP: 0.9,
      maxOutputTokens: 4096, // Aumentado para el JSON detallado
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
// 🧠 LÓGICA DE IA: GENERACIÓN DE PROMPT JSON
// =================================================================

// -------- INICIO DE LA CORRECCIÓN "s.map is not a function" --------
const getNames = (data) => {
  if (Array.isArray(data)) {
    return data.map((i) => i.name);
  }
  if (typeof data === "object" && data !== null) {
    return Object.values(data).map((i) => i.name);
  }
  return [];
};
// -------- FIN DE LA CORRECCIÓN --------

// -------- INICIO DE LA CORRECCIÓN "System Prompt" --------
// Reemplazado con tu estructura JSON de ejemplo e instrucciones de privacidad
function buildJsonSystemPrompt() {
  const dataKnowledge = `
    DATA KNOWLEDGE (Use for 'automatico' mode):
    - Photographic Styles: ${JSON.stringify(getNames(PHOTO_STYLES))}
    - Lighting Setups: ${JSON.stringify(getNames(LIGHTING_SETUPS))}
    - Shot Types: ${JSON.stringify(getNames(SHOT_TYPES))}
    - Environments: ${JSON.stringify(getNames(ENVIRONMENTS))}
    - Cameras: ${JSON.stringify(getNames(cameras))}
    - Lenses: ${JSON.stringify(getNames(lenses))}
    - Poses (by gender): ${JSON.stringify(POSES)}
    - Outfits (by gender): ${JSON.stringify({
      men: getNames(Outfits_men),
      women: getNames(Outfits_women),
    })}
  `;

  return `
    You are "Prompt-Architect", an elite AI photography director. Your sole mission is to translate a user's idea into an ultra-detailed JSON object to generate a hyper-realistic photograph.
    You MUST respond ONLY in English.

    STRICT RULES:
    1.  **VALID JSON OUTPUT:** Your response MUST be a valid JSON object, with no additional text, explanations, or markdown.
    2.  **JSON STRUCTURE:** You must follow this exact JSON structure:
        {
          "narrative": "A one-line cinematic summary that captures the essence of the image.",
          "subject": {
            "face_preservation": "Using the exact face from the provided selfie — no editing, no retouching, no smoothing.",
            "description": "A description of the subject's outfit, pose, and facial expression. **DO NOT describe the person's physical appearance (age, gender, ethnicity, hair, features).**",
            "accessories": { "eyewear": "...", "jewelry": ["...", "..."] },
            "body": { "build": "...", "visible_tattoos": "..." },
            "wardrobe": { "top_layer": "...", "inner_layer": "...", "bottom": "...", "footwear": "...", "style_tags": ["...", "..."] }
          },
          "pose_and_expression": { "body_orientation": "...", "head_orientation": "...", "gaze": "...", "hands": "...", "expression": "...", "overall_vibe": "..." },
          "environment": { "location_type": "...", "description": "...", "background_elements": ["...", "..."], "depth_of_field": "...", "weather": "...", "time_of_day": "..." },
          "lighting": { "type": "...", "quality": "...", "direction": "...", "contrast": "...", "highlights_and_shadows": { "highlights": "...", "shadows": "..." }, "extras": ["...", "..."], "white_balance": "..." },
          "camera": { "format": "full-frame digital camera", "lens": { "focal_length_mm": 85, "type": "..." }, "settings": { "aperture": "f/1.8", "shutter_speed": "1/250 s", "iso": 200 }, "perspective": { ... }, "focus": { ... }, "framing": { ... } },
          "composition": { "framing_style": "...", "leading_lines": "...", "balance": "...", "negative_space": "...", "rule_of_thirds": "...", "depth": "..." },
          "color_grading": { "palette": "...", "tones": { ... }, "contrast": "...", "saturation": "...", "look": ["...", "..."] },
          "postproduction": { "sharpness": "...", "texture": "...", "grain": "...", "vignette": "...", "skin_retouching": "minimal, keep natural texture", "cleanup": ["...", "..."] },
          "parameters": { "style": "ultra-realistic cinematic street portrait photography", "quality": "very high", "render_detail": "high frequency details", "negative_prompt": ["cartoonish", "over-smoothed skin", "distorted features", "low-resolution"] }
        }
    3.  **PRIVACY:** In the "subject.description" field, describe ONLY the outfit, pose, and expression. **DO NOT mention gender, age, ethnicity, or physical features.**
    4.  **FACE PRESERVATION:** The "face_preservation" field is NON-NEGOTIABLE.
    5.  **AUTOMATICO LOGIC:** If a user selection is "automatico", you must expertly fill that field based on the "Initial Idea" and other selections. Use your Data Knowledge.
    6.  **DATA KNOWLEDGE:** ${dataKnowledge}
  `;
}
// -------- FIN DE LA CORRECCIÓN "System Prompt" --------

function buildJsonUserPrompt(selections) {
  return `
    Generate the ultra-detailed JSON object based on these user specifications. Fill in all fields expertly.

    USER SPECIFICATIONS:
    - Initial Idea: "${selections.idea}"
    - Subject Type: ${selections.subjectType}
    - Photographic Style: ${selections.photoStyle}
    - Shot Type: ${selections.shotType}
    - Environment: ${selections.environment}
    - Pose/Action: ${selections.pose}
    - Outfit Style: ${selections.outfit}
    - Lighting Style: ${selections.lightingStyle}
    - Camera: ${selections.camera}
    - Lens: ${selections.lens}
  `;
}

async function generateJsonPromptAction(body) {
  const systemPrompt = buildJsonSystemPrompt();
  const userPrompt = buildJsonUserPrompt(body);

  const result = await callGoogleAI(
    "gemini-2.5-flash-lite",
    systemPrompt,
    userPrompt
  );

  if (result.candidates && result.candidates[0]?.content?.parts[0]?.text) {
    const jsonText = result.candidates[0].content.parts[0].text;
    try {
      const parsedJson = JSON.parse(jsonText);
      return parsedJson; // Devolvemos el objeto JSON parseado
    } catch {
      console.error("Error parsing JSON from AI response:", jsonText);
      throw new Error("La IA no devolvió un JSON válido.");
    }
  } else {
    console.error(
      "Unexpected response structure from generateJsonPromptAction:",
      JSON.stringify(result, null, 2)
    );
    throw new Error("Respuesta inesperada de la API de IA.");
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
    const body = await req.json();
    const result = await generateJsonPromptAction(body);

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
