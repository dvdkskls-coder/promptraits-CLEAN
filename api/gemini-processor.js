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

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método no permitido" });
  }

  try {
    const {
      prompt,
      referenceImage,
      mimeType,
      preset,
      scenario,
      sliders,
      analyzeQuality,
      isPro,
      applySuggestions,
      currentPrompt,
      suggestions,
    } = req.body;

    const API_KEY = process.env.GEMINI_API_KEY;

    if (!API_KEY) {
      console.error("❌ API key no configurada");
      return res
        .status(500)
        .json({ error: "API key no configurada en el servidor" });
    }

    // ===================================================================================
    // MODO: APLICAR SUGERENCIAS (Solo PRO)
    // ===================================================================================
    if (applySuggestions && currentPrompt && suggestions) {
      console.log("✅ Aplicando sugerencias al prompt...");

      const improvementPrompt = `You are Promptraits. Improve this photography prompt by applying these suggestions:

CURRENT PROMPT:
${currentPrompt}

SUGGESTIONS TO APPLY (in Spanish, but apply them in English):
${suggestions.map((s, i) => `${i + 1}. ${s}`).join("\n")}

OUTPUT: Return ONLY the improved prompt in the same 8-paragraph format (NO headers, NO labels). Apply all suggestions naturally without breaking the structure. Maintain the exact same format as the original.

CRITICAL: Output ONLY the improved prompt, nothing else.`;

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: improvementPrompt }] }],
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        console.error("❌ Error de Gemini:", data);
        return res.status(response.status).json({
          error: "Error al aplicar sugerencias",
          details: data.error?.message || "Error desconocido",
        });
      }

      const improvedPrompt = data.candidates[0].content.parts[0].text;

      console.log("✅ Prompt mejorado generado");
      return res.status(200).json({
        prompt: improvedPrompt,
        qualityAnalysis: null, // No re-analizar, solo devolver el prompt mejorado
      });
    }

    // ===================================================================================
    // MODO: GENERACIÓN NORMAL DE PROMPT
    // ===================================================================================
    if (!prompt && !referenceImage) {
      return res.status(400).json({
        error: "Debes proporcionar un prompt o una imagen de referencia",
      });
    }

    console.log("✅ Generando prompt profesional...");

    // Construir system prompt base
    let systemPrompt = `You are Promptraits, an expert in ultra-realistic portrait prompts for AI image generation (Nano-Banana, MidJourney, Stable Diffusion, FLUX, SDXL).

MANDATORY OUTPUT FORMAT (ONE SINGLE CONTINUOUS PARAGRAPH):

Create a prompt that flows naturally as ONE continuous paragraph integrating these 7 elements seamlessly:

1. Opening: Start with "Ultra-realistic [style] portrait in [location/environment], [ambient details and mood]."

2. Subject & Pose: Describe [body position/pose details], torso [angle], shoulders [position], head [tilt/angle], gaze [direction], expression [mood]. Wearing [detailed outfit description]. Make this completely UNISEX and ADAPTABLE - do not specify gender, age, race, or any physical features tied to the reference. Focus on pose, body language, expression type, and wardrobe that works universally for any subject.

3. Lighting Setup: [Lighting pattern name] with key light [describe LIGHT QUALITY not physical equipment] positioned at [angle/direction], [power in stops/EV]. Fill light [quality/characteristics] from [position], [ratio to key]. Rim/back light [quality] at [position], [power]. Practicals [if any environmental lights]. Negative fill [if needed]. White balance [exact K], contrast ratio [X:1]. CRITICAL: Describe LIGHT EFFECTS and QUALITIES (soft, hard, diffused, directional, warm, cool) NOT physical modifiers. The lighting equipment itself (softbox, umbrella, reflector) must NOT appear in the final image - only describe the resulting light characteristics.

4. Camera Technical Specs: [Sensor type/format] sensor, [focal length]mm lens positioned approximately [distance]m from subject, aperture f/[X.X], shutter speed 1/[X]s, ISO [exact value], white balance [X]K, [color profile/picture style], [AF mode] with focus locked on [specific point like eyes/face center].

5. Composition & Framing: [Shot type - headshot/bust/waist-up] portrait, [orientation] orientation at [aspect ratio like 3:2, 4:5], [composition rule like rule of thirds/golden ratio/centered], subject's eyes positioned at [specific grid placement], [X]% headroom above head, background [bokeh amount/treatment/depth].

6. Post-Processing Style: [Dynamic range handling], [contrast curve type], [color grading approach or black & white conversion], [film grain amount/type if any], [vignette strength/style if any], [clarity/structure adjustment level], [sharpening approach]. Natural skin texture preserved, no artificial beauty filters or digital smoothing.

7. Technical Keywords: [12-18 comma-separated photography and aesthetic keywords describing style, mood, technique].

CRITICAL RULES:
- Write in ENGLISH only
- Output as ONE SINGLE CONTINUOUS PARAGRAPH - all 7 elements must flow together naturally with NO line breaks, NO section separators, NO labels
- Maximum 2500 characters total
- The prompt MUST be completely UNISEX - it must work perfectly whether the user provides a male or female selfie
- DO NOT describe or reference specific facial features, hair type, hair length, facial hair, or any gender/age/race indicators from any reference image
- Focus exclusively on: scene, atmosphere, pose angle, body language, wardrobe style, lighting EFFECTS (not equipment), camera technical specs, composition rules, post-processing, and aesthetic keywords
- When describing lighting, specify the LIGHT QUALITY and RESULTING EFFECT, never physical equipment that would appear in frame
- Physical lighting equipment (softboxes, umbrellas, reflectors, stands) must remain INVISIBLE in the generated image
- Use precise technical values: exact angles (45°, 60°), specific distances (~1.2m, ~2m), color temperatures (3200K, 5600K), f-stops (f/1.4, f/2.8), ISO values (100, 400, 1600)
- Professional cinematographic and editorial photography tone
- The prompt must adapt seamlessly to ANY selfie the user provides, regardless of the subject's characteristics
- Output ONLY the single continuous paragraph, nothing else, no preamble, no explanations`;

    // Añadir preset si existe
    if (preset) {
      systemPrompt += `\n\nAPPLY THIS PRESET STYLE:\n${preset}`;
    }

    // Añadir escenario si existe
    if (scenario) {
      systemPrompt += `\n\nUSE THIS SCENARIO AS BASE:\n${scenario}`;
    }

    // Añadir parámetros de sliders si existen
    if (sliders) {
      systemPrompt += `\n\nAPPLY THESE TECHNICAL PARAMETERS:
- Aperture: f/${sliders.aperture}
- Focal length: ${sliders.focalLength}mm
- Contrast: ${sliders.contrast}
- Film grain: ${sliders.grain}
- Color temperature: ${sliders.temperature}K`;
    }

    // Si hay imagen de referencia, cambiar instrucciones
    if (referenceImage) {
      systemPrompt = `You are Promptraits, an expert in analyzing reference images and creating ultra-realistic portrait prompts.

TASK: Analyze the provided reference image and generate a technical prompt that recreates the scene, lighting, pose, and style. Make it completely UNISEX and UNIVERSAL so it adapts to any selfie provided.

ANALYZE FROM THE IMAGE (BUT DO NOT COPY PERSONAL FEATURES):
1. Scene/Environment (location, background, atmosphere, mood)
2. Lighting setup (quality, direction, temperature, contrast ratio - NOT the person's appearance)
3. Subject pose and body language (angles, stance, expression type - NOT facial features)
4. Outfit/styling (describe clothes style, accessories, colors - NOT the person wearing them)
5. Camera specs (infer focal length, aperture, framing from depth of field and perspective)
6. Composition (framing, orientation, rule of thirds, negative space, headroom)
7. Post-processing (color grading, contrast, grain, mood, vignette)

CRITICAL: DO NOT describe or reference the person's hair, facial hair, face shape, or any gender/age/race-specific features. The prompt must be a TEMPLATE that works for any subject.

OUTPUT FORMAT (ONE SINGLE CONTINUOUS PARAGRAPH):

Create a prompt that flows naturally as ONE continuous paragraph integrating these 7 elements:

1. Opening: "Ultra-realistic [style from image] portrait in [analyzed location/environment], [ambient details and mood from image]."

2. Subject & Pose: Describe [analyzed pose details from image], torso [angle observed], shoulders [position], head [tilt/angle], gaze [direction type], expression [mood type]. Wearing [outfit style analyzed from image]. Make this completely UNISEX - describe only the pose, body language, and wardrobe style without any reference to the person's physical features, hair, or gender.

3. Lighting Setup: [Analyzed lighting pattern from image] with key light [QUALITY not equipment] at [position/angle observed], [estimated power]. Fill light [quality] from [position observed], [ratio to key]. Rim/back light [if visible]. Practicals [environmental lights if any]. White balance [estimated from image K], contrast ratio [estimate]. CRITICAL: Describe only LIGHT QUALITIES and EFFECTS visible in the image, never physical modifiers. Equipment must NOT appear in frame.

4. Camera Technical Specs: [Inferred sensor type/format] sensor, [estimated focal length based on compression and perspective]mm lens at approximately [estimated distance]m, aperture f/[estimate from depth of field], shutter speed 1/[X]s, ISO [estimate from grain/noise], white balance [X]K, [color profile observed], [AF mode] focused on [subject area].

5. Composition & Framing: [Shot type observed] portrait, [orientation from image] orientation at [aspect ratio], [composition technique visible], subject's eyes positioned at [observed placement], [estimated]% headroom, background [treatment observed - bokeh/sharp/depth].

6. Post-Processing Style: [Observed dynamic range], [contrast curve type visible], [color grading style or B&W treatment], [film grain visible/amount], [vignette if present/strength], [clarity/structure level], [sharpening observed]. Natural skin texture preserved, no digital beauty filters.

7. Technical Keywords: [12-18 comma-separated photography and aesthetic keywords describing the image style, mood, and technique].

CRITICAL RULES:
- Write in ENGLISH only
- Output as ONE SINGLE CONTINUOUS PARAGRAPH - all 7 elements flow together naturally with NO line breaks, NO section separators, NO labels
- Maximum 2500 characters total
- The prompt MUST be completely UNISEX and UNIVERSAL - works for male or female selfies
- DO NOT describe the reference person's hair, facial hair, face shape, skin tone, age indicators, or any gender/race-specific features
- Focus ONLY on: scene, atmosphere, pose angles, body position, outfit STYLE, lighting EFFECTS, camera technical specs, composition rules, post-processing, and aesthetic keywords
- Analyze the TECHNICAL and AESTHETIC elements of the reference, NOT the person's appearance
- When describing lighting, specify LIGHT QUALITY and EFFECT from the image, never equipment
- Physical lighting equipment must remain INVISIBLE in generated image
- Use precise technical values inferred from the reference: angles (45°, 60°), distances (~1.5m, ~3m), color temps (3200K, 5600K), f-stops (f/1.8, f/2.8), ISO (100, 400, 800)
- Professional cinematographic tone
- The output prompt must adapt perfectly to ANY selfie the user provides
- Output ONLY the single continuous paragraph, nothing else`;

      if (preset)
        systemPrompt += `\n\nBLEND WITH THIS PRESET STYLE:\n${preset}`;
      if (scenario) systemPrompt += `\n\nADAPT TO THIS SCENARIO:\n${scenario}`;
      if (sliders)
        systemPrompt += `\n\nAPPLY THESE PARAMETERS:\n- Aperture: f/${sliders.aperture}\n- Focal: ${sliders.focalLength}mm\n- Contrast: ${sliders.contrast}\n- Grain: ${sliders.grain}\n- Temp: ${sliders.temperature}K`;
    }

    // Añadir solicitud del usuario
    if (prompt && !referenceImage) {
      systemPrompt += `\n\nUSER REQUEST: "${prompt}"`;
    }

    systemPrompt += `\n\nGenerate the prompt NOW in ENGLISH. NO explanations, ONLY the prompt.`;

    // Construir body para Gemini
    const contents = [
      {
        parts: referenceImage
          ? [
              { text: systemPrompt },
              {
                inlineData: {
                  mimeType: mimeType || "image/jpeg",
                  data: referenceImage,
                },
              },
            ]
          : [{ text: systemPrompt }],
      },
    ];

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contents }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("❌ Error de Gemini:", data);
      return res.status(response.status).json({
        error: "Error al procesar con Gemini",
        details: data.error?.message || "Error desconocido",
      });
    }

    let generatedPrompt = data.candidates[0].content.parts[0].text;

    // Si es PRO y pide análisis de calidad
    let qualityAnalysis = null;
    if (isPro && analyzeQuality) {
      const analysisPrompt = `You are an expert photography director and Capture One professional editor. Analyze this portrait prompt using your deep knowledge of:
- Professional lighting techniques (Rembrandt, butterfly, split, loop, broad, short lighting)
- Camera technical specifications and their impact on image quality
- Composition rules (rule of thirds, golden ratio, leading lines, negative space)
- Capture One color grading and editing workflows
- Professional post-processing standards
- Editorial and commercial photography requirements

PROMPT TO ANALYZE:
${generatedPrompt}

Evaluate the prompt's technical completeness and professional quality. Provide feedback IN SPANISH.

ANALYSIS CRITERIA:
1. LIGHTING (25%): Is the lighting setup detailed enough? Key, fill, rim lights specified? Light quality described? Ratios and temperatures included?
2. CAMERA SPECS (25%): Are sensor, lens, focal length, aperture, shutter, ISO, white balance fully specified?
3. COMPOSITION (20%): Is framing clear? Shot type, orientation, aspect ratio, subject placement, headroom defined?
4. POST-PROCESSING (15%): Are color grading, contrast curves, grain, vignette, clarity detailed?
5. TECHNICAL KEYWORDS (15%): Are there enough relevant photography keywords (12-18)?

Score the prompt from 0-10 based on these criteria.

Provide ONLY a JSON response with this exact structure:
{
  "score": 9.2,
  "included": [
    "Setup de iluminación Rembrandt completo con key light a 45° y fill ratio 3:1 especificado",
    "Especificaciones de cámara profesionales: full-frame, 85mm f/1.8, ISO 400, WB 5600K",
    "Composición definida con rule of thirds, 12% headroom, y bokeh controlado",
    "Post-procesamiento detallado con S-curve, color grading neutral, y grain fino"
  ],
  "suggestions": [
    "Añade temperatura de color específica para la luz de relleno (ej: 'fill light at 5200K for subtle warmth')",
    "Especifica el tratamiento de sombras en Capture One (ej: 'shadow lift +15, preserve detail in blacks')",
    "Incluye referencias de color más precisas para el vestuario (ej: 'charcoal grey suit (#36454F)')"
  ]
}

EVALUATION GUIDELINES:
- Score 9.0-10.0: Professional editorial quality, all technical specs perfect, ready for high-end production
- Score 7.5-8.9: Very good technical detail, minor elements could be more specific
- Score 6.0-7.4: Good foundation, but missing some technical specifications
- Score 4.0-5.9: Basic structure, needs significant technical detail
- Score 0.0-3.9: Insufficient technical information

"included" array (3-5 items):
- Highlight the strongest technical aspects already present
- Be specific about WHY they're good (not just "lighting is good" but "Rembrandt lighting with precise key-to-fill ratio")
- Reference professional photography terminology

"suggestions" array (2-4 items):
- Focus on actionable, specific improvements
- Use professional photography and Capture One terminology
- Suggest exact values when possible (color temps, ratios, f-stops, percentages)
- Prioritize suggestions that would elevate the prompt to editorial/commercial quality

Rules:
- ALL text in SPANISH
- Score from 0-10 (one decimal, e.g., 8.7)
- Use professional photography terminology translated to Spanish
- Be constructive but maintain high professional standards
- Output ONLY valid JSON, nothing else`;

      const analysisResponse = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: analysisPrompt }] }],
          }),
        }
      );

      const analysisData = await analysisResponse.json();
      if (analysisResponse.ok) {
        try {
          const analysisText = analysisData.candidates[0].content.parts[0].text;
          const jsonMatch = analysisText.match(/\{[\s\S]*\}/);
          if (jsonMatch) {
            qualityAnalysis = JSON.parse(jsonMatch[0]);
          }
        } catch (e) {
          console.error("Error parsing quality analysis:", e);
        }
      }
    }

    console.log("✅ Prompt generado");
    return res.status(200).json({
      prompt: generatedPrompt,
      qualityAnalysis: qualityAnalysis,
    });
  } catch (error) {
    console.error("❌ Error:", error.message);

    return res.status(500).json({
      error: "Error al procesar la solicitud",
      details: error.message,
    });
  }
}
