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
      responseMimeType: "application/json", // ¡Clave para obtener JSON!
      temperature: 0.8,
      topP: 0.9,
      maxOutputTokens: 2048,
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

function buildJsonSystemPrompt() {
  const getNames = (data) => {
    if (Array.isArray(data)) {
      return data.map((i) => i.name); // Ya es un array
    }
    if (typeof data === "object" && data !== null) {
      return Object.values(data).map((i) => i.name); // Es un objeto, lo convertimos
    }
    return []; // No es un formato esperado
  };

  return `
    Eres "Prompt-Architect", un director de fotografía de élite y experto en IA generativa. Tu única misión es traducir las ideas de un usuario en un objeto JSON estructurado y ultra-detallado que servirá como la base para generar una fotografía hiperrealista.

    REGLAS ESTRICTAS:
    1.  **SALIDA JSON VÁLIDA:** Tu respuesta DEBE ser un objeto JSON válido, sin texto adicional, explicaciones o markdown.
    2.  **ESTRUCTURA JSON OBLIGATORIA:** El JSON debe seguir esta estructura exacta. Rellena cada campo con un detalle exquisito y profesional.
        {
          "narrative": "Un resumen cinematográfico de una línea que captura la esencia de la imagen.",
          "subject": {
            "face_preservation": "Using the exact face from the provided selfie — no editing, no retouching, no smoothing.",
            "description": "Descripción detallada del sujeto (género, edad aparente, etnia, características clave).",
            "accessories": { "eyewear": "...", "jewelry": ["...", "..."] },
            "body": { "build": "...", "visible_tattoos": "..." },
            "wardrobe": { "top_layer": "...", "inner_layer": "...", "bottom": "...", "footwear": "...", "style_tags": ["...", "..."] }
          },
          "pose_and_expression": {
            "body_orientation": "...", "head_orientation": "...", "gaze": "...", "hands": "...", "expression": "...", "overall_vibe": "..."
          },
          "environment": {
            "location_type": "...", "description": "...", "background_elements": ["...", "..."], "depth_of_field": "...", "weather": "...", "time_of_day": "..."
          },
          "lighting": {
            "type": "...", "quality": "...", "direction": "...", "contrast": "...", "highlights_and_shadows": { "highlights": "...", "shadows": "..." }, "extras": ["...", "..."], "white_balance": "..."
          },
          "camera": {
            "format": "full-frame digital camera",
            "lens": { "focal_length_mm": 85, "type": "..." },
            "settings": { "aperture": "f/1.8", "shutter_speed": "1/250 s", "iso": 200 },
            "perspective": { "camera_angle": "...", "distance_to_subject": "...", "field_of_view": "..." },
            "focus": { "focus_point": "...", "bokeh_description": "..." },
            "framing": { "orientation": "vertical", "aspect_ratio": "2:3", "cropping": "..." }
          },
          "composition": {
            "framing_style": "...", "leading_lines": "...", "balance": "...", "negative_space": "...", "rule_of_thirds": "...", "depth": "..."
          },
          "color_grading": {
            "palette": "...", "tones": { "shadows": "...", "midtones": "...", "highlights": "..." }, "contrast": "...", "saturation": "...", "look": ["...", "..."]
          },
          "postproduction": {
            "sharpness": "...", "texture": "...", "grain": "...", "vignette": "...", "skin_retouching": "minimal, keep natural texture", "cleanup": ["...", "..."]
          },
          "parameters": {
            "style": "ultra-realistic cinematic street portrait photography",
            "quality": "very high",
            "render_detail": "high frequency details",
            "negative_prompt": ["cartoonish", "over-smoothed skin", "distorted features", "low-resolution"]
          }
        }
    3.  **LÓGICA "AUTOMÁTICO":** Si el usuario elige "automatico", es tu deber como experto tomar la mejor decisión creativa y técnica para ese campo, basándote en la "Idea Inicial" y las otras selecciones.
    4.  **COHERENCIA TOTAL:** Todos los campos deben estar interconectados. Un "Retrato melancólico" debe reflejarse en la pose, la iluminación, el color y el entorno.
    5.  **FACE PRESERVATION:** El campo "face_preservation" en "subject" es INALTERABLE. Siempre debe contener "Using the exact face from the provided selfie — no editing, no retouching, no smoothing.".
    6.  **NARRATIVE CONCATENADA:** El campo "narrative" debe ser un string que resuma la escena de forma atractiva y cinematográfica.

    CONOCIMIENTO DE DATOS (Para tus decisiones en modo "Automático"):
    - Estilos Fotográficos: ${JSON.stringify(PHOTO_STYLES.map((i) => i.name))}
    - Iluminación: ${JSON.stringify(LIGHTING_SETUPS.map((i) => i.name))}
    - Tipos de Plano: ${JSON.stringify(SHOT_TYPES.map((i) => i.name))}
    - Entornos: ${JSON.stringify(ENVIRONMENTS.map((i) => i.name))}
    - Cámaras: ${JSON.stringify(cameras.map((i) => i.name))}
    - Lentes: ${JSON.stringify(lenses.map((i) => i.name))}
    - Poses (por género): ${JSON.stringify(POSES)}
    - Vestuarios (por género): ${JSON.stringify({
      men: Outfits_men.map((i) => i.name),
      women: Outfits_women.map((i) => i.name),
    })}
  `;
}

function buildJsonUserPrompt(selections) {
  return `
    Genera el objeto JSON ultra-detallado para una fotografía profesional basado en estas especificaciones de alto nivel. Rellena todos los campos como un experto director de fotografía.

    ESPECIFICACIONES DEL USUARIO:
    - Idea Inicial: "${selections.idea}"
    - Tipo de Sujeto: ${selections.subjectType}
    - Estilo de Fotografía: ${selections.photoStyle}
    - Tipo de Plano: ${selections.shotType}
    - Entorno: ${selections.environment}
    - Pose/Acción: ${selections.pose}
    - Estilo de Vestuario: ${selections.outfit}
    - Estilo de Iluminación: ${selections.lightingStyle}
    - Cámara: ${selections.camera}
    - Lente: ${selections.lens}
  `;
}

async function generateJsonPromptAction(body) {
  const systemPrompt = buildJsonSystemPrompt();
  const userPrompt = buildJsonUserPrompt(body);

  const result = await callGoogleAI(
    "gemini-2.5-flash-lite", // Modelo correcto para la generación de JSON
    systemPrompt,
    userPrompt
  );

  if (result.candidates && result.candidates[0]?.content?.parts[0]?.text) {
    // La API devuelve el JSON como un string, lo parseamos.
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
    // El cuerpo de la solicitud ahora contiene directamente las selecciones.
    const body = await req.json();

    // La única acción es generar el prompt JSON.
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
