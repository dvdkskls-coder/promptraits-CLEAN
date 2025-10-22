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

MANDATORY OUTPUT FORMAT (8 paragraphs separated by blank lines, NO headers, NO labels):

Paragraph 1: Ultra-realistic [style] portrait in [location/environment], [ambient details and mood].

Paragraph 2: Subject [position/pose details], torso [angle], shoulders [position], head [tilt/angle], gaze [direction], expression [mood]. Wearing [detailed outfit description]. Hair [natural styling from reference]. Facial hair [exact style from reference if present]. using the exact face from the provided selfie — no editing, no retouching, no smoothing, preserve natural haircut and facial hair exactly as shown.

Paragraph 3: [Lighting pattern name if applicable] with key light [modifier] at [position/angle], [power in stops/EV]. Fill [source] at [position], [ratio to key]. Rim/back [modifier] at [position], [power]. Practicals [if any]. Negative fill [if any]. WB [exact K], contrast ratio [X:1].

Paragraph 4: [Sensor type] sensor, [focal length]mm lens at ~[distance]m, aperture f/[X], shutter 1/[X]s, ISO [X], WB [X]K, [color profile], [AF mode] locked on [focus point].

Paragraph 5: [Shot type] portrait, [orientation] [aspect ratio] orientation, [composition technique], eyes aligned to [position], [headroom]% headroom, background [treatment].

Paragraph 6: [Dynamic range approach], [contrast curve], [color grading/B&W treatment], [grain/texture], [vignette], [clarity/structure], [sharpening], no beauty retouching, maintain authentic haircut and facial hair.

Paragraph 7: [10-18 comma-separated technical photography keywords without categories].

Paragraph 8: Preserves natural skin texture, authentic facial features, exact haircut style, natural facial hair (beard/mustache/stubble) as shown in selfie reference, no grooming modifications.

CRITICAL RULES:
- Write in ENGLISH only
- NO line labels (no "Line 1:", no "SCENE & ATMOSPHERE —", etc.)
- Each paragraph is ONE continuous block of text
- Separate paragraphs with ONE blank line
- ALWAYS include in Paragraph 2: "using the exact face from the provided selfie — no editing, no retouching, no smoothing, preserve natural haircut and facial hair exactly as shown"
- ALWAYS include in Paragraph 6: "no beauty retouching, maintain authentic haircut and facial hair"
- ALWAYS include in Paragraph 8: specific mention of haircut and facial hair preservation
- DO NOT modify, trim, shave, or alter facial hair unless user explicitly requests it
- DO NOT change hairstyle, length, or cut unless user explicitly requests it
- Use exact technical values: angles (45°), distance (~1.5m), temperature (5600K), f-stops, ISO
- Total length: 250-350 words
- Professional cinematographic tone
- Output ONLY the 8 paragraphs, nothing else`;

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

TASK: Analyze the provided reference image and generate a technical prompt that recreates the EXACT scene, but make it UNISEX/SHAREABLE (no specific facial features).

ANALYZE FROM THE IMAGE:
1. Scene/Environment (location, background, atmosphere)
2. Lighting setup (key, fill, rim, practicals, direction, quality, temperature)
3. Subject pose and body language (angle, stance, expression type)
4. Outfit/styling (describe clothes, accessories, colors)
5. Haircut style and facial hair (exact description: length, style, grooming)
6. Camera specs (infer focal length, aperture, framing from depth of field and perspective)
7. Composition (framing, orientation, rule of thirds, negative space)
8. Post-processing (color grading, contrast, grain, mood)

OUTPUT FORMAT (8 paragraphs separated by blank lines, NO headers, NO labels):

Paragraph 1: Ultra-realistic [style] portrait in [analyzed location/environment], [ambient details and mood from image].

Paragraph 2: Subject [analyzed pose details], torso [angle], shoulders [position], head [tilt/angle], gaze [direction from image], expression [mood]. Wearing [analyzed outfit from image]. Hair [exact natural styling from image: length, cut, texture]. Facial hair [exact style from image if present: beard type, length, grooming]. using the exact face from the provided selfie — no editing, no retouching, no smoothing, preserve natural haircut and facial hair exactly as shown.

Paragraph 3: [Analyzed lighting pattern] with key light [inferred modifier] at [position/angle], [power estimate]. Fill [source] at [position], [ratio to key]. Rim/back [if visible], practicals [if any]. WB [estimate from image], contrast ratio [estimate].

Paragraph 4: [Inferred sensor type] sensor, [estimated focal length]mm lens at ~[distance]m, aperture f/[estimate from DOF], shutter 1/[X]s, ISO [estimate], WB [X]K, [color profile], [AF mode] locked on [focus point].

Paragraph 5: [Analyzed shot type] portrait, [orientation from image] [aspect ratio], [composition technique observed], eyes aligned to [position], [headroom estimate]% headroom, background [treatment observed].

Paragraph 6: [Observed dynamic range], [analyzed contrast curve], [color grading observed], [grain/texture visible], [vignette if any], [clarity level], [sharpening], no beauty retouching, maintain authentic haircut and facial hair.

Paragraph 7: [10-18 comma-separated technical photography keywords describing the image style].

Paragraph 8: Preserves natural skin texture, authentic facial features, exact haircut style from reference (length, layers, texture), natural facial hair exactly as shown (beard/mustache/stubble style and length), no grooming modifications.

CRITICAL RULES:
- Write in ENGLISH only
- NO line labels (no "Paragraph 1:", no "SCENE & ATMOSPHERE:", etc.)
- Each paragraph is ONE continuous block of text
- Separate paragraphs with ONE blank line
- Make the prompt SHAREABLE (no specific gender/age/race mentions)
- PRESERVE EXACT haircut and facial hair from reference image
- DO NOT suggest trimming, shaving, or altering hair/facial hair unless user requests it
- Focus on TECHNICAL recreation (lighting, camera, composition)
- Length: 250-350 words
- Professional cinematographic tone
- Output ONLY the 8 paragraphs, nothing else`;

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
      const analysisPrompt = `Analyze this photography prompt and provide quality feedback IN SPANISH.

PROMPT TO ANALYZE:
${generatedPrompt}

Provide ONLY a JSON response with this exact structure:
{
  "score": 9.2,
  "included": [
    "Iluminación detallada con key, fill y rim especificados",
    "Especificaciones completas de cámara (lente, apertura, ISO, WB)",
    "Composición clara con framing y orientación definidos",
    "Post-procesamiento detallado con grading y grain"
  ],
  "suggestions": [
    "Considera añadir más detalles específicos del fondo o escenario",
    "Podrías mencionar luces prácticas o fuentes ambientales adicionales",
    "Especifica colores exactos del vestuario para mayor consistencia"
  ]
}

Rules:
- ALL text in SPANISH (score labels, included items, suggestions)
- Score from 0-10 (one decimal)
- 3-5 items in "included" array (what's already good)
- 2-4 items in "suggestions" array (how to improve)
- Be constructive and specific
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
