import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || process.env.VITE_GOOGLE_API_KEY);
const MODEL_NAME = 'gemini-2.5-flash';

export default async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { prompt: userIdea, referenceImage, mimeType } = req.body;
    const model = genAI.getGenerativeModel({ model: MODEL_NAME });

    // ========================================================================
    // 1. INSTRUCCIONES DEL SISTEMA (Copiadas de tu App AI Studio)
    // ========================================================================
    const baseSystemInstruction = `You are a world-class prompt engineer and virtual director of photography. Your task is to expand a user's simple idea into a structured, professional, point-by-point photography prompt in English.

    **Instructions:**
    1. Analyze the user's core idea.
    2. Format the final output as a detailed, structured analysis. Use the following headings: Subject Description, Composition & Framing, Environment & Background, Lighting, Color & Mood, and Technical Details & Style.
    3. **CRITICAL RULE FOR SUBJECT:** Describe the clothing, pose, and expression. However, you MUST NOT describe the subject's physical appearance, face, age, hair, or facial hair if a reference image is provided.
    4. **Output Format:** Your response must start *directly* with the "Subject Description" heading. Do not include any preambles.`;

    // ========================================================================
    // 2. MODO CON IMAGEN DE REFERENCIA (Análisis)
    // ========================================================================
    if (referenceImage) {
      // Limpieza del Base64 asegurada
      const cleanBase64 = referenceImage.includes(',') ? referenceImage.split(',')[1] : referenceImage;
      
      const imagePart = {
        inlineData: { data: cleanBase64, mimeType: mimeType || 'image/jpeg' }
      };

      // Detectar sujetos para ajustar el prompt (Lógica AI Studio)
      const countPrompt = 'How many prominent human subjects are in this image? Respond with a single number only.';
      const animalPrompt = 'Is there a prominent animal in this image? Respond with "yes" or "no" only.';

      const [countResult, animalResult] = await Promise.all([
        model.generateContent([countPrompt, imagePart]),
        model.generateContent([animalPrompt, imagePart])
      ]);

      const humanCount = parseInt(countResult.response.text().trim(), 10) || 0;
      const hasAnimal = animalResult.response.text().trim().toLowerCase().includes('yes');

      let specificInstruction = `Analyze the provided image to create a structured professional photography prompt.
      **CRITICAL:** Describe pose/clothing but NOT the face. End Subject Description with: "The subject's face and appearance should be based on the reference photo @img1."`;

      let detectedGender = 'masculine';

      if (humanCount === 1 && hasAnimal) {
         detectedGender = 'animal';
         specificInstruction = `Analyze image with 1 person and 1 animal. Describe Person (@img1) clothing/pose (NO FACE). Describe Animal (@img2).`;
      } else if (humanCount >= 2) {
         detectedGender = 'couple';
         specificInstruction = `Analyze image with 2+ people. Describe Subject 1 (@img1) and Subject 2 (@img2). Clothing/Pose only. NO FACES.`;
      }

      const result = await model.generateContent([
        { text: baseSystemInstruction + "\n\n" + specificInstruction },
        imagePart
      ]);

      return res.status(200).json({ 
        prompt: result.response.text().trim(),
        detectedGender,
        analysis: { score: 9.5 } // Dummy analysis para velocidad
      });
    }

    // ========================================================================
    // 3. MODO SOLO TEXTO
    // ========================================================================
    else {
      const textPrompt = `User's Core Idea: "${userIdea}". Expand this into a full professional prompt following the system instructions.`;
      
      const result = await model.generateContent({
        contents: [{ role: 'user', parts: [{ text: textPrompt }] }],
        systemInstruction: { role: 'system', parts: [{ text: baseSystemInstruction }] }
      });

      return res.status(200).json({ 
        prompt: result.response.text().trim(),
        analysis: { score: 9.0 }
      });
    }

  } catch (error) {
    console.error('Gemini Error:', error);
    return res.status(500).json({ error: error.message || 'Error processing with Gemini' });
  }
}