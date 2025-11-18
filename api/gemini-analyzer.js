export const config = {
  runtime: "edge",
};

// =================================================================
// ⚙️ CONFIGURACIÓN Y LLAMADA A LA API DE GOOGLE
// =================================================================
const API_KEY = process.env.GEMINI_API_KEY;
const BASE_URL = "https://generativelanguage.googleapis.com/v1beta";

async function callGoogleVisionAPI(systemPrompt, imageBase64, mimeType) {
  const model = "gemini-1.5-flash-latest"; // Usamos el último modelo flash
  const url = `${BASE_URL}/models/${model}:generateContent?key=${API_KEY}`;

  const pureBase64 = imageBase64.replace(/^data:image\/[a-zA-Z]+;base64,/, "");

  const payload = {
    systemInstruction: { parts: [{ text: systemPrompt }] },
    contents: [
      {
        role: "user",
        parts: [
          {
            // --- CORRECCIÓN DE IDIOMA ---
            text: "Analyze this image and generate the structured JSON object based on your system prompt.",
          },
          { inline_data: { mime_type: mimeType, data: pureBase64 } },
        ],
      },
    ],
    generationConfig: {
      responseMimeType: "application/json",
      // --- CORRECCIÓN DE ESTABILIDAD ---
      temperature: 0.3, // Reducido para un análisis más objetivo y menos propenso a errores
      maxOutputTokens: 4096,
    },
  };

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error(`Google Vision API Error (${response.status}): ${errorText}`);
    throw new Error(`Error de la API de Google Vision: ${errorText}`);
  }
  return response.json();
}

// =================================================================
// 🧠 LÓGICA DE IA: ANÁLISIS DE IMAGEN A JSON (CORREGIDO)
// =================================================================

function buildAnalyzerSystemPrompt() {
  // --- CORRECCIÓN DE IDIOMA Y PRIVACIDAD ---
  return `
    You are "Prompt-Analyzer", an expert director of photography with an eagle eye for detail. Your mission is to analyze a provided image and DECONSTRUCT it into an ultra-detailed, structured JSON object. You must infer all technical and artistic parameters as if you had taken the photo yourself.

    STRICT RULES:
    1.  **VALID JSON OUTPUT:** Your response MUST be a valid JSON object, with no additional text, explanations, or markdown.
    2.  **MANDATORY JSON STRUCTURE:** The JSON MUST follow this exact structure. Analyze the image and fill in every field with as much detail as possible.
        \`\`\`json
        {
          "narrative": "A one-line cinematic summary that captures the essence of the analyzed image.",
          "subject": {
            "face_preservation": "Using the exact face from the provided selfie — no editing, no retouching, no smoothing.",
            
            "description": "A description of the subject's outfit, pose, and facial expression. **DO NOT describe the person's physical appearance (age, gender, ethnicity, hair, features).**",
            
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
        \`\`\`
    3.  **EXPERT INFERENCE:** If a detail is not visible (e.g., the exact camera model), infer a professional and coherent option that fits the rest of the image.
    4.  **FACE PRESERVATION:** The "face_preservation" field is NON-NEGOTIABLE. It must always contain "Using the exact face from the provided selfie — no editing, no retouching, no smoothing.".
  `;
}

async function analyzeImageAction(body) {
  const { imageBase64, mimeType } = body;
  if (!imageBase64 || !mimeType) {
    throw new Error("La imagen en base64 y el mimeType son requeridos.");
  }

  const systemPrompt = buildAnalyzerSystemPrompt();

  const result = await callGoogleVisionAPI(systemPrompt, imageBase64, mimeType);

  if (result.candidates && result.candidates[0]?.content?.parts[0]?.text) {
    const jsonText = result.candidates[0].content.parts[0].text;
    try {
      const parsedJson = JSON.parse(jsonText);
      return parsedJson;
    } catch (error) {
      console.error(
        "Error al parsear el JSON de la respuesta de la IA:",
        jsonText,
        error
      );
      throw new Error("La IA de análisis no devolvió un JSON válido.");
    }
  } else {
    console.error(
      "Estructura de respuesta inesperada de analyzeImageAction:",
      JSON.stringify(result, null, 2)
    );
    throw new Error("Respuesta inesperada de la API de Vision.");
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
    const result = await analyzeImageAction(body);

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error en el handler de gemini-analyzer:", error);
    const errorMessage =
      error.message || "Ocurrió un error interno en el servidor.";
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
