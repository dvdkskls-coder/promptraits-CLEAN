import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";

export const config = {
  runtime: "edge",
};

// CONFIGURACIÓN DE MODELOS
const MODEL_PRIMARY = "gemini-2.5-flash"; // El que tú quieres
const MODEL_BACKUP = "gemini-1.5-flash"; // El salvavidas

const KNOWLEDGE_BASE = `
  [STYLES]: Cinematic, Editorial, Vogue, Film Noir, Cyberpunk, High-Fashion, Corporate Headshot, Street Photography, Baroque, Renaissance, Wes Anderson style.
  [LIGHTING]: Rembrandt (45° + reflector), Butterfly (Paramount), Split Lighting (Dramático), Loop Lighting, Clam Shell (Beauty), Rim Light (Contraluz), Softbox, Octabox, Golden Hour, Blue Hour, Neon Practical.
  [CAMERAS]: Sony A7R IV, Canon EOS R5, Hasselblad, Leica M11, Arri Alexa (Cine).
  [LENSES]: 85mm f/1.2 (Retrato ideal), 50mm f/1.4 (Natural), 35mm f/1.4 (Contexto), 24-70mm, 135mm (Compresión), Anamorphic (Cine).
  [FILTERS]: Pro-Mist (1/8, 1/4 for halation), Polarizer (Cut glare), ND Graduated, Star Filter, Streak Filter (Anamorphic flare), Prism.
`;

const SYSTEM_INSTRUCTION = `
Eres **Promptraits**, el mejor Prompt Engineer del mundo. 
Tu objetivo es convertir ideas simples en PROMPTS MAESTROS de 8 líneas.

TU TAREA:
Genera un objeto JSON. El campo "prompt_text" debe seguir OBLIGATORIAMENTE este formato de 8 líneas:

Línea 1: Escena/ambiente/género visual (1–2 frases).
Línea 2: "Using the exact face from the provided selfie — no editing, no retouching, no smoothing." (SIEMPRE INCLUIR).
Línea 3: Pose y expresión.
Línea 4: Ropa y accesorios.
Línea 5: Iluminación técnica (Ratios, tipos de luz).
Línea 6: Composición de cámara (Cámara, focal, f/, ISO).
Línea 7: Estilo y mood final (Color grading, texturas).
Línea 8: Keywords (10–18, separadas por comas).

BASE DE DATOS INTERNA:
${KNOWLEDGE_BASE}
`;

const responseSchema = {
  description: "Respuesta estructurada Promptraits",
  type: SchemaType.OBJECT,
  properties: {
    prompt_text: {
      type: SchemaType.STRING,
      description: "El prompt final formateado estrictamente en 8 líneas.",
    },
    technical_settings: {
      type: SchemaType.OBJECT,
      properties: {
        aspect_ratio: { type: SchemaType.STRING },
        negative_prompt: { type: SchemaType.STRING },
      },
    },
  },
  required: ["prompt_text"],
};

const cache = new Map();

// FUNCIÓN AUXILIAR PARA LLAMAR A GEMINI
async function callGemini(modelName, apiKey, userMessage) {
  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({
    model: modelName,
    generationConfig: {
      responseMimeType: "application/json",
      responseSchema: responseSchema,
      temperature: 0.75,
    },
  });

  return await model.generateContent({
    contents: [
      {
        role: "user",
        parts: [{ text: SYSTEM_INSTRUCTION + "\n\n" + userMessage }],
      },
    ],
  });
}

export default async function handler(req) {
  if (req.method !== "POST")
    return new Response("Method not allowed", { status: 405 });

  try {
    const body = await req.json();
    const apiKey = process.env.GEMINI_API_KEY;

    // 1. CACHÉ: Si ya lo preguntaste, te lo damos gratis
    const cacheKey = `${body.idea}-${body.photoStyle}-${body.camera}`;
    if (cache.has(cacheKey)) {
      return new Response(JSON.stringify(cache.get(cacheKey)), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    const userMessage = `
      IDEA: "${body.idea || "Retrato profesional"}"
      ESTILO: ${body.photoStyle || "Cinemático"}
      CÁMARA/PLANO: ${body.camera || "Automático"}
      Genera el prompt experto en JSON.
    `;

    let result;
    let usedModel = MODEL_PRIMARY;

    try {
      // 2. INTENTO PRINCIPAL: GEMINI 2.5
      console.log(`Intentando con ${MODEL_PRIMARY}...`);
      result = await callGemini(MODEL_PRIMARY, apiKey, userMessage);
    } catch (primaryError) {
      // 3. SI FALLA POR LÍMITE (429), ACTIVAMOS EL PLAN B
      if (
        primaryError.message.includes("429") ||
        primaryError.message.includes("Too Many Requests")
      ) {
        console.warn(
          `⚠️ ${MODEL_PRIMARY} saturado. Activando PLAN B: ${MODEL_BACKUP}`
        );
        usedModel = MODEL_BACKUP;
        result = await callGemini(MODEL_BACKUP, apiKey, userMessage);
      } else {
        throw primaryError; // Si es otro error, que falle normal
      }
    }

    const responseText = result.response.text();
    const data = JSON.parse(responseText);

    // Añadimos info extra para que sepas qué modelo se usó (solo para debug)
    data.debug_model_used = usedModel;

    // 4. Guardamos en caché
    cache.set(cacheKey, data);

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("❌ Error Fatal:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Error generando prompt" }),
      { status: 500 }
    );
  }
}
