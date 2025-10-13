export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  try {
    const { prompt, referenceImage, mimeType, preset, scenario, sliders, analyzeQuality, isPro } = req.body;

    if (!prompt && !referenceImage) {
      return res.status(400).json({ error: 'Debes proporcionar un prompt o una imagen de referencia' });
    }

    const API_KEY = process.env.GEMINI_API_KEY;
    
    if (!API_KEY) {
      console.error('❌ API key no configurada');
      return res.status(500).json({ error: 'API key no configurada' });
    }

    console.log('✅ Generando prompt profesional...');

    // Construir system prompt base
let systemPrompt = `You are Promptraits, an expert in ultra-realistic portrait prompts for AI image generation (Nano-Banana, MidJourney, Stable Diffusion, FLUX, SDXL).

MANDATORY OUTPUT FORMAT (8 paragraphs separated by blank lines, NO headers, NO labels):

Paragraph 1: Ultra-realistic [style] portrait in [location/environment], [ambient details and mood].

Paragraph 2: Subject [position/pose details], torso [angle], shoulders [position], head [tilt/angle], gaze [direction], expression [mood]. Wearing [detailed outfit description]. Hair [natural styling]. using the exact face from the provided selfie — no editing, no retouching, no smoothing.

Paragraph 3: [Lighting pattern name if applicable] with key light [modifier] at [position/angle], [power in stops/EV]. Fill [source] at [position], [ratio to key]. Rim/back [modifier] at [position], [power]. Practicals [if any]. Negative fill [if any]. WB [exact K], contrast ratio [X:1].

Paragraph 4: [Sensor type] sensor, [focal length]mm lens at ~[distance]m, aperture f/[X], shutter 1/[X]s, ISO [X], WB [X]K, [color profile], [AF mode] locked on [focus point].

Paragraph 5: [Shot type] portrait, [orientation] [aspect ratio] orientation, [composition technique], eyes aligned to [position], [headroom]% headroom, background [treatment].

Paragraph 6: [Dynamic range approach], [contrast curve], [color grading/B&W treatment], [grain/texture], [vignette], [clarity/structure], [sharpening], no beauty retouching.

Paragraph 7: [10-18 comma-separated technical photography keywords without categories].

Paragraph 8: Preserves natural skin texture, authentic facial features, real hair styling from selfie reference.

CRITICAL RULES:
- Write in ENGLISH only
- NO line labels (no "Line 1:", no "SCENE & ATMOSPHERE —", etc.)
- Each paragraph is ONE continuous block of text
- Separate paragraphs with ONE blank line
- ALWAYS include in Paragraph 2: "using the exact face from the provided selfie — no editing, no retouching, no smoothing"
- ALWAYS end Paragraph 6 with: "no beauty retouching"
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
5. Camera specs (infer focal length, aperture, framing from depth of field and perspective)
6. Composition (framing, orientation, rule of thirds, negative space)
7. Post-processing (color grading, contrast, grain, mood)

OUTPUT FORMAT (8 paragraphs separated by blank lines, NO headers, NO labels):

Paragraph 1: Ultra-realistic [style] portrait in [analyzed location/environment], [ambient details and mood from image].

Paragraph 2: Subject [analyzed pose details], torso [angle], shoulders [position], head [tilt/angle], gaze [direction from image], expression [mood]. Wearing [analyzed outfit from image]. Hair [natural styling from image]. using the exact face from the provided selfie — no editing, no retouching, no smoothing.

Paragraph 3: [Analyzed lighting pattern] with key light [inferred modifier] at [position/angle], [power estimate]. Fill [source] at [position], [ratio to key]. Rim/back [if visible], practicals [if any]. WB [estimate from image], contrast ratio [estimate].

Paragraph 4: [Inferred sensor type] sensor, [estimated focal length]mm lens at ~[distance]m, aperture f/[estimate from DOF], shutter 1/[X]s, ISO [estimate], WB [X]K, [color profile], [AF mode] locked on [focus point].

Paragraph 5: [Analyzed shot type] portrait, [orientation from image] [aspect ratio], [composition technique observed], eyes aligned to [position], [headroom estimate]% headroom, background [treatment observed].

Paragraph 6: [Observed dynamic range], [analyzed contrast curve], [color grading observed], [grain/texture visible], [vignette if any], [clarity level], [sharpening], no beauty retouching.

Paragraph 7: [10-18 comma-separated technical photography keywords describing the image style].

Paragraph 8: Preserves natural skin texture, authentic facial features, real hair styling from selfie reference.

CRITICAL RULES:
- Write in ENGLISH only
- NO line labels (no "Paragraph 1:", no "SCENE & ATMOSPHERE:", etc.)
- Each paragraph is ONE continuous block of text
- Separate paragraphs with ONE blank line
- Make the prompt SHAREABLE (no specific gender/age/race mentions)
- Focus on TECHNICAL recreation (lighting, camera, composition)
- Length: 250-350 words
- Professional cinematographic tone
- Output ONLY the 8 paragraphs, nothing else`;

  if (preset) systemPrompt += `\n\nBLEND WITH THIS PRESET STYLE:\n${preset}`;
  if (scenario) systemPrompt += `\n\nADAPT TO THIS SCENARIO:\n${scenario}`;
  if (sliders) systemPrompt += `\n\nAPPLY THESE PARAMETERS:\n- Aperture: f/${sliders.aperture}\n- Focal: ${sliders.focalLength}mm\n- Contrast: ${sliders.contrast}\n- Grain: ${sliders.grain}\n- Temp: ${sliders.temperature}K`;
}${sliders.aperture}\n- Focal: ${sliders.focalLength}mm\n- Contrast: ${sliders.contrast}\n- Grain: ${sliders.grain}\n- Temp: ${sliders.temperature}K`;
}
${sliders.aperture}\n- Focal: ${sliders.focalLength}mm\n- Contrast: ${sliders.contrast}\n- Grain: ${sliders.grain}\n- Temp: ${sliders.temperature}K`;
    }

    // Añadir solicitud del usuario
    if (prompt && !referenceImage) {
      systemPrompt += `\n\nUSER REQUEST: "${prompt}"`;
    }

    systemPrompt += `\n\nGenerate the prompt NOW in ENGLISH following the 8-line structure. NO explanations, ONLY the prompt.`;

    // Construir body para Gemini
    const contents = [{
      parts: referenceImage 
        ? [
            { text: systemPrompt },
            { 
              inlineData: {
                mimeType: mimeType || 'image/jpeg',
                data: referenceImage
              }
            }
          ]
        : [{ text: systemPrompt }]
    }];

    const response = await fetch(
  `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`,
  {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ contents })
  }
);

    const data = await response.json();
    
    if (!response.ok) {
      console.error('❌ Error de Gemini:', data);
      return res.status(response.status).json({ 
        error: 'Error al procesar con Gemini',
        details: data.error?.message || 'Error desconocido'
      });
    }

    let generatedPrompt = data.candidates[0].content.parts[0].text;

    // Si es PRO y pide análisis de calidad
    let qualityAnalysis = null;
    if (isPro && analyzeQuality) {
      const analysisPrompt = `Analyze this photography prompt and provide a quality score:

PROMPT TO ANALYZE:
${generatedPrompt}

Provide ONLY a JSON response with this exact structure:
{
  "score": 9.2,
  "included": [
    "Detailed lighting setup (key, fill, rim)",
    "Complete camera specifications (lens, aperture, ISO, WB)",
    "Clear composition guidelines (framing, orientation, aspect ratio)",
    "Post-processing details (grading, grain, contrast)"
  ],
  "suggestions": [
    "Consider adding more specific background details",
    "Could benefit from mentioning practical lights or ambient sources",
    "Specify exact outfit colors for better consistency"
  ]
}

Rules:
- Score from 0-10 (one decimal)
- 3-5 items in "included" array
- 2-4 items in "suggestions" array
- Be constructive and specific
- Output ONLY valid JSON, nothing else`;

      const analysisResponse = await fetch(
  `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`,
  {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: analysisPrompt }] }]
    })
  }
);

      const analysisData = await analysisResponse.json();
      if (analysisResponse.ok) {
        try {
          const analysisText = analysisData.candidates[0].content.parts[0].text;
          // Extraer JSON del texto (por si Gemini añade markdown)
          const jsonMatch = analysisText.match(/\{[\s\S]*\}/);
          if (jsonMatch) {
            qualityAnalysis = JSON.parse(jsonMatch[0]);
          }
        } catch (e) {
          console.error('Error parsing quality analysis:', e);
        }
      }
    }
    
    console.log('✅ Prompt generado');
    return res.status(200).json({
      prompt: generatedPrompt,
      qualityAnalysis: qualityAnalysis
    });

  } catch (error) {
    console.error('❌ Error:', error.message);
    
    return res.status(500).json({ 
      error: 'Error al procesar la solicitud',
      details: error.message 
    });
  }
}