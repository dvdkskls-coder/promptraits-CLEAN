// ============================================================================
// PROMPTRAITS V2.3 - GEMINI PROCESSOR SIMPLIFICADO
// ============================================================================
// Maneja configuraciones OPCIONALES - nada da error si está vacío
// Herramientas PRO simplificadas a 7 elementos
// ============================================================================

import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// ============================================================================
// MAPEO DE DATOS SIMPLIFICADO
// ============================================================================

const LIGHTING_MAP = {
  rembrandt: "Rembrandt lighting (45° key light, triangle on cheek, 3:1 ratio)",
  butterfly: "Butterfly lighting (overhead frontal, shadow under nose, glamorous)",
  loop: "Loop lighting (45° elevated, loop shadow, versatile)",
  split: "Split lighting (90° side, half face shadow, dramatic)",
  broad: "Broad lighting (camera-facing side lit, widening effect)",
  short: "Short lighting (away-facing side lit, slimming effect)"
};

const LENS_MAP = {
  "24-35mm": "24-35mm wide angle lens (environmental context, distortion)",
  "50mm": "50mm standard lens (natural perspective, versatile)",
  "85mm": "85mm f/1.2 portrait lens (shallow DOF, beautiful bokeh, compression)",
  "135-200mm": "135-200mm telephoto lens (strong compression, isolated subject)"
};

const COLOR_GRADING_MAP = {
  "teal-orange": "teal and orange color grading (Hollywood blockbuster look)",
  "vintage": "vintage film color grading (faded pastels, low contrast, nostalgic)",
  "high-key": "high-key lighting (bright, optimistic, minimal shadows)",
  "low-key": "low-key lighting (dark, moody, dramatic shadows)",
  "warm": "warm color tones (golden, orange, inviting)",
  "cool": "cool color tones (blue, cyan, clinical)"
};

const FILTER_MAP = {
  "black-pro-mist": "Black Pro-Mist filter (soft glow, halation, cinematic)",
  "nd": "ND filter (motion blur, wide aperture in bright light)",
  "polarizer": "polarizing filter (reduced reflections, saturated colors)",
  "anamorphic": "anamorphic lens flare (horizontal blue streaks, cinematic)"
};

const ASPECT_RATIO_MAP = {
  "1:1": "1:1 square format (Instagram)",
  "3:4": "3:4 vertical portrait format",
  "4:5": "4:5 vertical Instagram format",
  "9:16": "9:16 vertical stories format",
  "16:9": "16:9 wide horizontal cinematic format",
  "4:3": "4:3 classic horizontal format"
};

// ============================================================================
// HANDLER PRINCIPAL
// ============================================================================

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método no permitido" });
  }

  try {
    const {
      prompt,
      referenceImage,
      mimeType,
      analyzeQuality,
      isPro,
      platform = 'nano-banana',
      proSettings,
      applySuggestions,
      currentPrompt,
      suggestions
    } = req.body;

    // FLUJO 1: Aplicar sugerencias
    if (applySuggestions) {
      const improvedPrompt = await applySuggestionsFlow(currentPrompt, suggestions, platform);
      return res.status(200).json({ prompt: improvedPrompt });
    }

    // FLUJO 2: Generar prompt
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });

    // Construir instrucciones
    const systemInstructions = buildSystemInstructions(platform, referenceImage, proSettings);
    
    // Construir partes del mensaje
    const parts = [];
    
    if (referenceImage) {
      parts.push({
        inlineData: {
          data: referenceImage,
          mimeType: mimeType || "image/jpeg"
        }
      });
    }

    parts.push({
      text: buildUserPrompt(prompt, proSettings, referenceImage, platform)
    });

    // Generar prompt
    const result = await model.generateContent({
      contents: [{ role: "user", parts }],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 2048,
      },
      systemInstruction: systemInstructions
    });

    let generatedPrompt = result.response.text().trim();

    // Análisis de calidad (solo PRO)
    let qualityAnalysis = null;
    if (isPro && analyzeQuality) {
      qualityAnalysis = await analyzePromptQuality(generatedPrompt, model);
    }

    // Validación de longitud
    const validation = validatePromptLength(generatedPrompt, platform);

    return res.status(200).json({
      prompt: generatedPrompt,
      qualityAnalysis,
      validation
    });

  } catch (error) {
    console.error("Error en gemini-processor:", error);
    return res.status(500).json({
      error: error.message || "Error al procesar la solicitud"
    });
  }
}

// ============================================================================
// CONSTRUCCIÓN DE INSTRUCCIONES
// ============================================================================

function buildSystemInstructions(platform, hasImage, proSettings) {
  const platformRules = getPlatformRules(platform);
  const imageRules = hasImage ? getImageReferenceRules() : '';
  const proRules = proSettings ? getProSettingsRules(proSettings) : '';

  return `You are a professional photography prompt engineer specialized in AI image generation.

${platformRules}

${imageRules}

${proRules}

CRITICAL RULES:
1. Output ONLY the final prompt - no explanations, no meta-commentary
2. Use professional photography terminology
3. Be specific and detailed
4. Create a natural, flowing description
5. Maintain photorealistic quality

Your goal: Create a professional prompt that generates stunning, photorealistic portraits.`;
}

function getPlatformRules(platform) {
  if (platform === 'midjourney') {
    return `TARGET PLATFORM: Midjourney V7

STRUCTURE: [Subject] [Style] [Lighting] [Composition] [Technical] [Parameters]

FORMAT RULES:
- Descriptive phrases separated by commas
- Parameters at the END separated by spaces
- No periods within the prompt
- Use photography terms

PARAMETERS (add at end):
- --ar for aspect ratio (e.g., --ar 3:4)
- --s 50-100 for photorealism (lower = more literal)
- --v 7 (version)
- --q 2 for max quality
- --no for negative prompts

EXAMPLE:
Professional portrait, confident expression, direct gaze, elegant navy suit, shot with Canon 85mm f/1.2, Rembrandt lighting, shallow depth of field, studio environment, teal and orange color grading --ar 3:4 --v 7 --s 75 --q 2`;
  }

  // nano-banana (default)
  return `TARGET PLATFORM: Nano-Banana (Google Gemini / Imagen.ia)

STRUCTURE: One continuous, flowing paragraph describing the scene naturally.

FORMAT RULES:
- 1200-1600 characters optimal (max 2500)
- Conversational, natural language
- Complete sentences in a paragraph
- NO parameters (--ar, --s, etc.)
- NO negative prompts
- Specify orientation explicitly ("vertical portrait format" or "wide horizontal composition")

COMPONENTS TO INCLUDE:
1. Subject and pose
2. Expression and emotion
3. Outfit and styling
4. Camera and lens details
5. Lighting setup
6. Composition and framing
7. Background and environment
8. Mood and atmosphere
9. Orientation specification

DEFAULT: Generates square (1:1). Always specify orientation if vertical/horizontal desired.

EXAMPLE:
Professional corporate portrait of a person in elegant navy business suit with confident, warm smile and direct eye contact, shot with Canon EOS R5 and 85mm f/1.2 lens creating beautiful background bokeh. Rembrandt lighting setup from 45-degree angle creates flattering shadow pattern and depth. Medium close-up framing at eye level captures from chest upward. Modern minimalist studio background with soft gray tones. Teal and orange color grading adds cinematic polish. Vertical portrait format for professional use.`;
}

function getImageReferenceRules() {
  return `🚨 CRITICAL: REFERENCE IMAGE PROVIDED 🚨

ABSOLUTE RULES WHEN IMAGE IS PRESENT:
🚫 NEVER MENTION:
- Age (30 years old, young, mature, elderly)
- Gender (man, woman, male, female)
- Ethnicity or skin tone
- Hair (blonde, brunette, long, short, curly, straight)
- Facial hair (beard, mustache, goatee, stubble)
- Eye color or facial features
- Body type or physique

✅ ONLY DESCRIBE:
- Body pose and position (standing, sitting, leaning)
- Facial expression (confident, serene, joyful, contemplative)
- Gaze direction (direct eye contact, looking away, downward gaze)
- Outfit and clothing (elegant suit, casual wear, specific colors)
- Accessories (watch, jewelry, glasses - if visible)
- Technical camera setup
- Lighting and atmosphere
- Environment and composition

PERFECT EXAMPLE WITH IMAGE:
"Professional portrait with confident expression and warm genuine smile, maintaining direct eye contact with camera. Subject wearing elegant navy business suit with subtle patterns. Standing pose with slight lean forward showing engagement. Shot with Canon EOS R5 and 85mm f/1.2 lens at f/1.4 for creamy background bokeh. Rembrandt lighting from 45-degree angle creates flattering shadow patterns and dimensional depth. Medium close-up framing from chest upward. Modern urban coffee shop interior with warm wood tones and soft ambient lighting in background, beautifully blurred. Teal and orange color grading adds cinematic polish. Vertical portrait format."

The reference image provides the person's physical appearance - your job is describing HOW they're photographed, not WHO they are.`;
}

function getProSettingsRules(proSettings) {
  if (!proSettings) return '';

  const rules = [];

  // Género (interno - guía outfit)
  if (proSettings.gender && proSettings.gender !== 'neutral') {
    rules.push(`GENDER CONTEXT: ${proSettings.gender} (use this to inform outfit/makeup style, but don't mention gender in prompt)`);
  }

  // Iluminación
  if (proSettings.lighting) {
    const lighting = LIGHTING_MAP[proSettings.lighting];
    if (lighting) {
      rules.push(`LIGHTING: ${lighting}`);
    }
  }

  // Lente
  if (proSettings.lens) {
    const lens = LENS_MAP[proSettings.lens];
    if (lens) {
      rules.push(`LENS: ${lens}`);
    }
  }

  // Color Grading
  if (proSettings.colorGrading) {
    const grading = COLOR_GRADING_MAP[proSettings.colorGrading];
    if (grading) {
      rules.push(`COLOR: ${grading}`);
    }
  }

  // Filtro
  if (proSettings.filter) {
    const filter = FILTER_MAP[proSettings.filter];
    if (filter) {
      rules.push(`FILTER: ${filter}`);
    }
  }

  // Aspect Ratio
  if (proSettings.aspectRatio) {
    const ratio = ASPECT_RATIO_MAP[proSettings.aspectRatio];
    if (ratio) {
      rules.push(`FORMAT: ${ratio}`);
    }
  }

  // Outfit - Si no se seleccionó, que Gemini elija según contexto
  if (proSettings.outfit) {
    rules.push(`OUTFIT: Use "${proSettings.outfit}" style from your outfit knowledge`);
  } else {
    rules.push(`OUTFIT: Choose appropriate outfit that matches the environment and mood`);
  }

  if (rules.length === 0) return '';

  return `PRO SETTINGS SELECTED:
${rules.join('\n')}

Apply these settings naturally in the prompt.`;
}

// ============================================================================
// CONSTRUCCIÓN DEL PROMPT DEL USUARIO
// ============================================================================

function buildUserPrompt(userPrompt, proSettings, hasImage, platform) {
  let instruction = `Create a professional ${platform === 'midjourney' ? 'Midjourney' : 'Nano-Banana'} prompt based on this description:\n\n"${userPrompt}"\n\n`;

  if (hasImage) {
    instruction += `IMPORTANT: Reference image attached. Describe ONLY pose, expression, and outfit. Never mention age, gender, hair, or physical features.\n\n`;
  }

  if (proSettings) {
    const selections = [];
    
    if (proSettings.lighting) selections.push(`Lighting: ${proSettings.lighting}`);
    if (proSettings.lens) selections.push(`Lens: ${proSettings.lens}`);
    if (proSettings.colorGrading) selections.push(`Color: ${proSettings.colorGrading}`);
    if (proSettings.filter) selections.push(`Filter: ${proSettings.filter}`);
    if (proSettings.aspectRatio) selections.push(`Aspect Ratio: ${proSettings.aspectRatio}`);
    if (proSettings.outfit) selections.push(`Outfit: ${proSettings.outfit}`);

    if (selections.length > 0) {
      instruction += `User selected these PRO settings:\n${selections.join('\n')}\n\nIncorporate them naturally.\n\n`;
    }
  }

  instruction += `Generate the complete ${platform === 'midjourney' ? 'Midjourney prompt with parameters' : 'Nano-Banana paragraph'} now:`;

  return instruction;
}

// ============================================================================
// ANÁLISIS DE CALIDAD
// ============================================================================

async function analyzePromptQuality(prompt, model) {
  try {
    const analysisPrompt = `Analyze this AI image generation prompt and provide ONLY a JSON object (no markdown, no code blocks):

Prompt: "${prompt}"

Return JSON with this exact structure:
{
  "score": <number 1-100>,
  "strengths": ["strength1", "strength2"],
  "weaknesses": ["weakness1", "weakness2"],
  "suggestions": ["suggestion1", "suggestion2"]
}

Focus on: technical details, lighting specificity, composition clarity, photorealism elements.`;

    const result = await model.generateContent(analysisPrompt);
    let response = result.response.text().trim();

    // Limpiar markdown si existe
    response = response.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();

    const analysis = JSON.parse(response);
    return analysis;
  } catch (error) {
    console.error("Error en análisis:", error);
    return null;
  }
}

// ============================================================================
// APLICAR SUGERENCIAS
// ============================================================================

async function applySuggestionsFlow(currentPrompt, suggestions, platform) {
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });

  const improvePrompt = `Improve this ${platform} prompt by applying these suggestions:

CURRENT PROMPT:
"${currentPrompt}"

SUGGESTIONS TO APPLY:
${suggestions.map((s, i) => `${i + 1}. ${s}`).join('\n')}

RULES:
- Maintain the core concept
- Apply ALL suggestions
- Keep ${platform === 'midjourney' ? 'Midjourney format with parameters' : 'Nano-Banana paragraph format'}
- Return ONLY the improved prompt

Generate improved prompt:`;

  const result = await model.generateContent(improvePrompt);
  return result.response.text().trim();
}

// ============================================================================
// VALIDACIÓN
// ============================================================================

function validatePromptLength(prompt, platform) {
  const length = prompt.length;

  if (platform === 'nano-banana') {
    if (length >= 1200 && length <= 1600) {
      return { length, optimal: true, message: 'Longitud óptima' };
    } else if (length >= 800 && length < 2500) {
      return { length, acceptable: true, message: 'Longitud aceptable' };
    } else {
      return { length, warning: true, message: length < 800 ? 'Muy corto' : 'Muy largo' };
    }
  }

  // Midjourney - más flexible
  if (length >= 100 && length <= 1000) {
    return { length, optimal: true, message: 'Longitud adecuada' };
  }
  return { length, acceptable: true, message: 'OK' };
}
