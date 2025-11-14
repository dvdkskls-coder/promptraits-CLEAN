import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(
  process.env.GEMINI_API_KEY || process.env.VITE_GOOGLE_API_KEY
);
const MODEL_NAME = "gemini-2.5-flash";

// Función de reintento para evitar el error 503 (Overloaded)
async function generateWithRetry(model, content, retries = 3) {
  try {
    return await model.generateContent(content);
  } catch (error) {
    if (
      (error.message.includes("503") || error.message.includes("overloaded")) &&
      retries > 0
    ) {
      console.log(`⚠️ Modelo saturado. Reintentando... (${retries})`);
      await new Promise((resolve) => setTimeout(resolve, 3000)); // Esperar 3s
      return generateWithRetry(model, content, retries - 1);
    }
    throw error;
  }
}

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
      prompt: userIdea,
      referenceImage,
      mimeType,
      gender,
      proSettings,
    } = req.body;

    // Configuración para JSON (para separar Detailed y Compact)
    const model = genAI.getGenerativeModel({
      model: MODEL_NAME,
      generationConfig: { responseMimeType: "application/json" },
    });

    // 1. LIMPIEZA DE IMAGEN (CRÍTICO)
    let imagePart = null;
    if (referenceImage) {
      // Eliminamos cualquier prefijo data:image... para dejar solo el base64 puro
      const cleanBase64 = referenceImage.replace(
        /^data:image\/\w+;base64,/,
        ""
      );
      imagePart = {
        inlineData: { data: cleanBase64, mimeType: mimeType || "image/jpeg" },
      };
    }

    // 2. DEFINICIÓN DE REFERENCIA (Lógica exacta de geminiService.ts)
    let subjectRef =
      "The subject's face and appearance should be based on the reference photo @img1.";
    if (gender === "couple")
      subjectRef =
        "The subjects' faces and appearance should be based on their corresponding reference photos, @img1 and @img2.";
    if (gender === "animal")
      subjectRef =
        "If a person is present, their face is @img1. The animal is @img2.";

    // 3. CONSTRUCCIÓN DEL PROMPT (Lógica de generateProfessionalPrompt)
    // Inyectamos las instrucciones AQUÍ para evitar el Error 400 "Unknown field systemInstruction"
    const systemText = `
    You are a world-class prompt engineer and virtual director of photography.
    
    YOUR TASK: Analyze the input and return a JSON object with two fields: "detailed" and "compact".

    --- FIELD 1: "detailed" ---
    Format: Structured analysis with these exact headings (Markdown):
    *Subject Description*, *Composition & Framing*, *Environment & Background*, *Lighting*, *Color & Mood*, *Technical Details & Style*.
    
    **CRITICAL RULE:** In "Subject Description", describe clothing/pose but ${
      referenceImage
        ? "DO NOT describe physical appearance (face/age/hair). Instead, END with: '" +
          subjectRef +
          "'."
        : "describe the person fully."
    }

    --- FIELD 2: "compact" ---
    A single, comma-separated paragraph optimized for AI generators.
    ${referenceImage ? "Start with '@img1' references." : ""}
    `;

    // 4. EJECUCIÓN
    let result;

    if (imagePart) {
      // MODO ANÁLISIS DE IMAGEN
      // Hacemos una sola llamada inteligente que detecta y genera a la vez (Evita error 503 por múltiples llamadas)
      const analysisPrompt = `
        ${systemText}
        
        CONTEXT: Analyze the provided image.
        1. Detect if it's a single person, couple, or animal.
        2. Generate the prompts based on the image style and pose.
        3. Include a field "detectedGender" in the JSON with value: "masculine", "feminine", "couple", or "animal".
        
        Output ONLY valid JSON.
        `;

      result = await generateWithRetry(model, [analysisPrompt, imagePart]);
    } else {
      // MODO TEXTO + SETTINGS (Replicando generateProfessionalPrompt de la App)
      const settingsText = proSettings
        ? `
        Additional Constraints:
        - Shot Type: ${proSettings.shotType}
        - Angle: ${proSettings.cameraAngle}
        - Environment: ${proSettings.environment}
        - Lighting: ${proSettings.lighting}
        - Outfit: ${proSettings.outfit}
        `
        : "";

      const fullTextPrompt = `${systemText}\n\nUser Idea: "${userIdea}"\n${settingsText}`;
      result = await generateWithRetry(model, fullTextPrompt);
    }

    const responseText = result.response.text();
    const jsonResponse = JSON.parse(responseText);

    return res.status(200).json({
      detailed: jsonResponse.detailed,
      compact: jsonResponse.compact,
      detectedGender: jsonResponse.detectedGender || null,
      analysis: { score: 9.5 },
    });
  } catch (error) {
    console.error("Gemini Processor Error:", error);
    return res
      .status(500)
      .json({ error: error.message || "Error generating prompt" });
  }
}
