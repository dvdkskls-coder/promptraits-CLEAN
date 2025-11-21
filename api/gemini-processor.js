// api/gemini-processor.js
import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";

export const config = {
  runtime: "edge",
};

const MODEL_NAME = "gemini-2.5-flash";

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

export default async function handler(req) {
  if (req.method !== "POST")
    return new Response("Method not allowed", { status: 405 });

  try {
    const body = await req.json();
    const apiKey = process.env.GEMINI_API_KEY;

    const genAI = new GoogleGenerativeAI(apiKey);

    const model = genAI.getGenerativeModel({
      model: MODEL_NAME,
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        temperature: 0.75,
      },
    });

    // AQUÍ ESTÁ LA CLAVE DEL AHORRO DE CRÉDITOS:
    // Solo enviamos texto. NO enviamos la imagen base64 aquí.
    const userMessage = `
      IDEA: "${body.idea || "Retrato profesional"}"
      ESTILO: ${body.photoStyle || "Cinemático"}
      Genera el prompt experto en JSON.
    `;

    const result = await model.generateContent({
      contents: [
        {
          role: "user",
          parts: [{ text: SYSTEM_INSTRUCTION + "\n\n" + userMessage }],
        },
      ],
    });

    const responseText = result.response.text();
    const data = JSON.parse(responseText);

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("❌ Error Promptraits:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
}
