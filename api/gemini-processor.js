import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";

export const config = {
  runtime: "edge",
};

// =================================================================
// 1. EL CEREBRO FOTOGRÁFICO (Extracción de tus manuales)
// =================================================================
// Esto reemplaza a tus archivos físicos. Gemini consultará esto instantáneamente.
const KNOWLEDGE_BASE = `
  [STYLES]: Cinematic, Editorial, Vogue, Film Noir, Cyberpunk, High-Fashion, Corporate Headshot, Street Photography, Baroque, Renaissance, Wes Anderson style.
  [LIGHTING]: Rembrandt (45° + reflector), Butterfly (Paramount), Split Lighting (Dramático), Loop Lighting, Clam Shell (Beauty), Rim Light (Contraluz), Softbox, Octabox, Golden Hour, Blue Hour, Neon Practical.
  [CAMERAS]: Sony A7R IV, Canon EOS R5, Hasselblad, Leica M11, Arri Alexa (Cine).
  [LENSES]: 85mm f/1.2 (Retrato ideal), 50mm f/1.4 (Natural), 35mm f/1.4 (Contexto), 24-70mm, 135mm (Compresión), Anamorphic (Cine).
  [FILTERS]: Pro-Mist (1/8, 1/4 for halation), Polarizer (Cut glare), ND Graduated, Star Filter, Streak Filter (Anamorphic flare), Prism.
  [FILM STOCKS]: Kodak Portra 400, Cinestill 800T, Ilford HP5 (B&W), Fujifilm Pro 400H.
  [COMPOSITION]: Rule of Thirds, Center, Negative Space, Leading Lines, Dutch Angle, Low Angle (Power), High Angle (Vulnerability).
`;

// =================================================================
// 2. SYSTEM PROMPT MAESTRO (Tu GPT replicado)
// =================================================================
const SYSTEM_INSTRUCTION = `
Eres **Promptraits**, especialista en la creación de prompts profesionales para imágenes ultra detalladas y realistas.
Has incorporado los conocimientos técnicos de Capture One Pro, iluminación de estudio y filtros cinematográficos.

TU OBJETIVO:
Generar un objeto JSON donde el campo "prompt_text" siga ESTRICTAMENTE el siguiente formato de 8 líneas para máxima calidad.

FORMATO OBLIGATORIO DEL CAMPO 'prompt_text' (8 líneas exactas):
Línea 1: Escena/ambiente/género visual (1–2 frases).
Línea 2: "Using the exact face from the provided selfie — no editing, no retouching, no smoothing." (SIEMPRE INCLUIR ESTO SI HAY SUJETO HUMANO).
Línea 3: Pose y expresión (Orientación, mirada, manos).
Línea 4: Ropa y accesorios (Prendas, materiales, colores).
Línea 5: Iluminación al detalle (Rig, posiciones, ratios, geles, atmósfera).
Línea 6: Composición de cámara (Cámara, focal, f/, ISO, obturación, perfil color).
Línea 7: Estilo y mood final (Gradación, grano, filtros, SIN beauty retouching).
Línea 8: Keywords (10–18, separadas por comas).

REGLAS TÉCNICAS:
- No improvises. Usa la [BASE DE CONOCIMIENTO] para elegir cámaras y luces reales.
- Si el usuario pide "JSON Mode" explícitamente, estructura la respuesta técnica. Si pide "Retrato", prioriza la estética en el prompt.
- DETALLE: Toda descripción debe transmitir profundidad visual, textura y atmósfera cinematográfica.
- FACE PRESERVATION: La línea 2 es sagrada. No la traduzcas.

BASE DE CONOCIMIENTO INTERNA:
${KNOWLEDGE_BASE}
`;

// =================================================================
// 3. SCHEMA (La estructura JSON que recibe tu App)
// =================================================================
const responseSchema = {
  description: "Respuesta estructurada de Promptraits",
  type: SchemaType.OBJECT,
  properties: {
    // Análisis de la idea (Chain of Thought interno)
    analysis: {
      type: SchemaType.OBJECT,
      properties: {
        style_detected: { type: SchemaType.STRING },
        lighting_strategy: { type: SchemaType.STRING },
        lens_choice: { type: SchemaType.STRING },
      },
    },
    // El prompt final formateado en 8 líneas
    prompt_text: {
      type: SchemaType.STRING,
      description:
        "El prompt final siguiendo el formato obligatorio de 8 líneas.",
    },
    // Parámetros técnicos separados (para uso en UI si se necesita)
    technical_params: {
      type: SchemaType.OBJECT,
      properties: {
        aspect_ratio: { type: SchemaType.STRING },
        negative_prompt: { type: SchemaType.STRING },
      },
    },
  },
  required: ["prompt_text", "technical_params"],
};

// =================================================================
// 4. HANDLER PRINCIPAL
// =================================================================
export default async function handler(req) {
  if (req.method !== "POST")
    return new Response("Method not allowed", { status: 405 });

  try {
    const body = await req.json();
    const apiKey = process.env.GEMINI_API_KEY;

    const genAI = new GoogleGenerativeAI(apiKey);

    // Usamos Gemini 2.5 Flash (el modelo rápido y potente)
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        temperature: 0.75, // Un toque de creatividad para el estilo
      },
    });

    // Construimos el mensaje del usuario
    const userMessage = `
      USUARIO: "${body.idea || "Retrato profesional"}"
      CONTEXTO ADICIONAL:
      - Estilo: ${body.photoStyle || "Cinemático"}
      - Iluminación: ${body.lightingStyle || "Auto"}
      - Cámara preferida: ${body.camera || "Auto"}
      
      INSTRUCCIÓN: Genera el JSON. Asegúrate de que 'prompt_text' siga el formato de 8 líneas con la frase de preservación facial.
    `;

    const result = await model.generateContent({
      contents: [
        {
          role: "user",
          parts: [{ text: SYSTEM_INSTRUCTION + "\n\n" + userMessage }],
        },
      ],
    });

    const data = JSON.parse(result.response.text());

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
