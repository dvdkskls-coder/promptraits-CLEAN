import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(
  process.env.GEMINI_API_KEY || process.env.VITE_GOOGLE_API_KEY
);
// Usamos 1.5 Flash porque es el modelo multimodal estable actual de la API.
// (El 2.5 experimental a veces rechaza peticiones de API fuera de AI Studio).
const MODEL_NAME = "gemini-1.5-flash";

export default async function handler(req, res) {
  // CORS Headers
  res.setHeader("Access-Control-Allow-Credentials", true);
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET,OPTIONS,PATCH,DELETE,POST,PUT"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version"
  );

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST")
    return res.status(405).json({ error: "Method not allowed" });

  try {
    const { prompt: userIdea, referenceImage, mimeType } = req.body;

    // Configuración para JSON (para separar detallado/compacto)
    const model = genAI.getGenerativeModel({
      model: MODEL_NAME,
      generationConfig: { responseMimeType: "application/json" },
    });

    // ========================================================================
    // 1. LIMPIEZA DE IMAGEN (CRÍTICO PARA EVITAR ERROR 400)
    // ========================================================================
    let imagePart = null;
    if (referenceImage) {
      // Esta Regex elimina cualquier prefijo tipo "data:image/jpeg;base64," o similar
      const cleanBase64 = referenceImage.replace(
        /^data:image\/\w+;base64,/,
        ""
      );

      imagePart = {
        inlineData: {
          data: cleanBase64,
          mimeType: mimeType || "image/jpeg",
        },
      };
    }

    // ========================================================================
    // 2. LÓGICA DE ANÁLISIS (COPIADA DE geminiService.ts)
    // ========================================================================
    let detectedGender = null;
    let analysisContext = "";

    if (imagePart) {
      try {
        // Modelo auxiliar estándar para conteo (texto plano para rapidez)
        const detectionModel = genAI.getGenerativeModel({ model: MODEL_NAME });

        // Preguntamos cuántas personas y animales hay (Lógica PromptLab)
        const countResult = await detectionModel.generateContent([
          'Analyze this image. Return ONLY a JSON object: { "people": number, "animal": boolean }',
          imagePart,
        ]);

        const countText = countResult.response
          .text()
          .replace(/```json|```/g, "")
          .trim();
        const counts = JSON.parse(countText);

        if (counts.people === 1 && counts.animal) {
          detectedGender = "animal";
          analysisContext =
            "The image contains 1 person and 1 animal. Describe the Person as @img1 (clothing/pose only, NO FACE) and the Animal as @img2.";
        } else if (counts.people >= 2) {
          detectedGender = "couple";
          analysisContext =
            "The image contains 2+ people. Describe Subject 1 as @img1 and Subject 2 as @img2 (clothing/pose only, NO FACES).";
        } else {
          detectedGender = "masculine"; // Default single
          analysisContext =
            "The image contains 1 person. Describe clothing/pose/expression but NOT the face. Refer to face as @img1.";
        }
      } catch (e) {
        console.warn("Error en detección automática, usando default:", e);
        analysisContext = "Analyze the reference image style and pose.";
      }
    }

    // ========================================================================
    // 3. CONSTRUCCIÓN DEL PROMPT FINAL (Tus instrucciones de 8 líneas)
    // ========================================================================

    const subjectRefText =
      detectedGender === "couple"
        ? "Using the exact faces from the provided selfies — no editing, no retouching, no smoothing; preserve each subject’s identity exactly."
        : detectedGender === "animal"
        ? "Using the exact animal face from the provided selfie — no editing, no retouching."
        : "Using the exact face from the provided selfie — no editing, no retouching, no smoothing.";

    const systemPrompt = `
    You are a world-class Photography Director.
    
    YOUR TASK: Generate a JSON object with two fields: "detailed" and "compact".
    
    CONTEXT: ${userIdea ? `User Idea: "${userIdea}".` : ""} ${analysisContext}

    ---------------------------------------------------------
    FIELD 1: "detailed" (The main prompt)
    Structure (EXACTLY 8 LINES, no markdown bolding in the final text):
    Line 1: Image type & Main Style.
    Line 2: Subject Identity. WRITE EXACTLY: "${
      referenceImage ? subjectRefText : "Detailed subject description."
    }"
    Line 3: Pose & Expression.
    Line 4: Wardrobe & Accessories.
    Line 5: Lighting (Detailed rig, ratios, WB).
    Line 6: Camera Specs (Sensor, focal length, f-stop).
    Line 7: Style & Mood (Grading, film stock).
    Line 8: Keywords (10-18 tags).
    ---------------------------------------------------------
    FIELD 2: "compact"
    A single dense paragraph for Midjourney/Flux.
    Format: "Ultra-realistic portrait of [Subject]... --v 6.0"
    ---------------------------------------------------------
    `;

    // 4. EJECUCIÓN
    let result;
    if (imagePart) {
      result = await model.generateContent([systemPrompt, imagePart]);
    } else {
      result = await model.generateContent(systemPrompt);
    }

    const responseText = result.response.text();
    const jsonResponse = JSON.parse(responseText);

    return res.status(200).json({
      detailed: jsonResponse.detailed,
      compact: jsonResponse.compact,
      detectedGender: detectedGender,
      analysis: { score: 9.5 },
    });
  } catch (error) {
    console.error("Gemini Processor Error:", error);
    return res
      .status(500)
      .json({ error: error.message || "Error generating prompt" });
  }
}
