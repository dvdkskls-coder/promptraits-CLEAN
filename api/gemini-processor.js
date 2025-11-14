import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(
  process.env.GEMINI_API_KEY || process.env.VITE_GOOGLE_API_KEY
);
const MODEL_NAME = "gemini-2.5-flash";

export default async function handler(req, res) {
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
    const {
      prompt: simpleIdea,
      referenceImage,
      mimeType,
      // Settings
      gender,
      shotType,
      cameraAngle,
      environment,
      lighting,
      colorGrading,
      outfit,
      pose,
      platform = "nano-banana",
    } = req.body;

    const model = genAI.getGenerativeModel({ model: MODEL_NAME });

    // ========================================================================
    // MODO A: ANÁLISIS DE IMAGEN (Reverse Prompting Inteligente)
    // ========================================================================
    if (referenceImage && (!simpleIdea || simpleIdea.trim() === "")) {
      const imagePart = {
        inlineData: {
          data: referenceImage,
          mimeType: mimeType || "image/jpeg",
        },
      };

      // 1. DETECCIÓN DE SUJETOS (Lógica de AI Studio)
      const [countResult, animalResult] = await Promise.all([
        model.generateContent([
          "How many prominent human subjects are in this image? Respond with a single number only.",
          imagePart,
        ]),
        model.generateContent([
          'Is there a prominent animal in this image? Respond with "yes" or "no" only.',
          imagePart,
        ]),
      ]);

      const humanCount = parseInt(countResult.response.text().trim(), 10) || 0;
      const hasAnimal = animalResult.response
        .text()
        .trim()
        .toLowerCase()
        .includes("yes");

      // 2. Determinamos el tipo de sujeto para el Frontend
      let detectedGender = "masculine"; // Default
      let analysisInstruction = "";

      if (humanCount === 1 && hasAnimal) {
        detectedGender = "animal";
        analysisInstruction = `Analyze image with 1 person and 1 animal. Describe Person (@img1) clothing/pose (NO FACE). Describe Animal (@img2).`;
      } else if (humanCount >= 2) {
        detectedGender = "couple";
        analysisInstruction = `Analyze image with 2+ people. Describe Subject 1 (@img1) and Subject 2 (@img2). Clothing/Pose only. NO FACES.`;
      } else {
        // Intentamos detectar si es hombre o mujer para el default (opcional, simple heurística)
        detectedGender = "masculine";
        analysisInstruction = `Analyze the provided image to create a structured professional photography prompt.
         **CRITICAL RULE:** Describe clothing, pose, expression but **DO NOT** describe the face, age, or hair. 
         Instead, end Subject Description with: "The subject's face and appearance should be based on the reference photo @img1."
         Format: Start directly with "Subject Description".`;
      }

      const result = await model.generateContent([
        analysisInstruction,
        imagePart,
      ]);
      const generatedPrompt = result.response.text().trim();

      // Análisis de Calidad (Para la UI)
      const analysis = await generateQualityAnalysis(model, generatedPrompt);

      return res.status(200).json({
        prompt: generatedPrompt,
        analysis,
        platform,
        detectedGender, // <--- ¡IMPORTANTE! Esto le dice al frontend qué inputs mostrar
      });
    }

    // ========================================================================
    // MODO B: TEXTO A PROMPT
    // ========================================================================
    else {
      const safeGet = (val) => (val === "auto" || !val ? "Automatic" : val);

      let subjectReference = referenceImage
        ? `The subject's face and appearance should be based on the reference photo @img1.`
        : `Describe the subject's appearance in detail based on the context.`;

      // Ajuste de referencia según género seleccionado manualmente
      if (gender === "couple" && referenceImage)
        subjectReference = `The subjects' faces should be based on @img1 and @img2.`;
      if (gender === "animal" && referenceImage)
        subjectReference = `The person is @img1 and the animal is @img2.`;

      const systemInstruction = `You are a world-class prompt engineer. Expand the user's idea into a professional photography prompt.
      
      **User Idea:** "${simpleIdea || "Portrait"}"
      **Settings:** Shot: ${safeGet(shotType)}, Angle: ${safeGet(
        cameraAngle
      )}, Light: ${safeGet(lighting)}, Style: ${safeGet(colorGrading)}.
      
      **CRITICAL:** Describe the scene in detail.
      ${
        referenceImage
          ? '**IMPORTANT:** Do NOT describe physical facial features. Use placeholder: "' +
            subjectReference +
            '"'
          : ""
      }
      
      Output format: A single, rich, professional paragraph.`;

      const contents = referenceImage
        ? [
            {
              role: "user",
              parts: [
                { text: systemInstruction },
                {
                  inlineData: { data: referenceImage, mimeType: "image/jpeg" },
                },
              ],
            },
          ]
        : [{ role: "user", parts: [{ text: systemInstruction }] }];

      const result = await model.generateContent({ contents });
      const generatedPrompt = result.response.text().trim();
      const analysis = await generateQualityAnalysis(model, generatedPrompt);

      return res
        .status(200)
        .json({ prompt: generatedPrompt, analysis, platform });
    }
  } catch (error) {
    console.error("Gemini Error:", error);
    return res
      .status(500)
      .json({ error: error.message || "Error generating prompt" });
  }
}

async function generateQualityAnalysis(model, promptText) {
  try {
    const prompt = `Analyze quality (0-10). Respond JSON: { "score": number, "included": ["point1"], "suggestions": ["suggestion1"] }. Prompt: ${promptText}`;
    const res = await model.generateContent(prompt);
    const text = res.response
      .text()
      .replace(/```json|```/g, "")
      .trim();
    return JSON.parse(text);
  } catch (e) {
    return {
      score: 8.5,
      included: ["Professional structure"],
      suggestions: [],
    };
  }
}
