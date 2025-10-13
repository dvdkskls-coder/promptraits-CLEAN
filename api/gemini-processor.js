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
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: 'Debes proporcionar un prompt' });
    }

    const API_KEY = process.env.GEMINI_API_KEY;
    
    if (!API_KEY) {
      console.error('❌ API key no configurada');
      return res.status(500).json({ error: 'API key no configurada' });
    }

    console.log('✅ Generando prompt...');

    const systemPrompt = `You are Promptraits, an expert in ultra-realistic portrait prompts for AI image generation (Nano-Banana, MidJourney, Stable Diffusion, FLUX, SDXL). You deliver consistent, repeatable prompts with brief narrative and professional technical pack (camera/optics/lighting/composition/post). You preserve selfie identity at 100%.

USER REQUEST: "${prompt}"

MANDATORY OUTPUT FORMAT (8-line structure, NO headers):

Line 1: SCENE & ATMOSPHERE — Ultra-realistic [style] portrait in [location/environment], [ambient details and mood].

Line 2: SUBJECT & POSE — Subject [position/pose details], torso [angle], shoulders [position], head [tilt/angle], gaze [direction], expression [mood]. Wearing [detailed outfit description]. Hair [natural styling]. using the exact face from the provided selfie — no editing, no retouching, no smoothing.

Line 3: LIGHTING RIG — [Lighting pattern name if applicable]. Key light: [modifier] at [position/angle], [power in stops/EV]. Fill: [source] at [position], [ratio to key]. Rim/back: [modifier] at [position], [power]. Practicals: [if any]. Negative fill: [if any]. WB [exact K], contrast ratio [X:1].

Line 4: CAMERA TECHNICAL SPECS — [Sensor type] sensor, [focal length]mm lens at ~[distance]m, aperture f/[X], shutter 1/[X]s, ISO [X], WB [X]K, [color profile], [AF mode] locked on [focus point].

Line 5: FRAMING & COMPOSITION — [Shot type] portrait, [orientation] [aspect ratio] orientation, [composition technique], eyes aligned to [position], [headroom]% headroom, background [treatment].

Line 6: POST-PROCESSING — [Dynamic range approach], [contrast curve], [color grading/B&W treatment], [grain/texture], [vignette], [clarity/structure], [sharpening], no beauty retouching.

Line 7: TECHNICAL KEYWORDS — [10-18 comma-separated technical photography keywords].

Line 8: PRESERVATION REMINDER — Preserves natural skin texture, authentic facial features, real hair styling from selfie reference.

CRITICAL RULES:
- Write in ENGLISH only
- ONE continuous paragraph per line (no bullet points)
- ALWAYS include: "using the exact face from the provided selfie — no editing, no retouching, no smoothing"
- ALWAYS end Line 6 with: "no beauty retouching"
- Use exact technical values: angles (45°), distance (~1.5m), temperature (5600K), f-stops, ISO
- Total length: 250-350 words
- Professional cinematographic tone

EXAMPLE OUTPUT:
Ultra-realistic cinematic street portrait in a narrow European city street, tall stone buildings and colorful storefronts blurred into painterly bokeh, pedestrians rendered as indistinct silhouettes for depth, atmosphere urban modern editorial fashion-driven. Subject centered, torso slightly angled left, shoulders relaxed, head straight, intense direct gaze into lens, lips closed with serious neutral expression, wearing tailored black wool overcoat with wide lapels layered with black scarf entire outfit in deep matte black tones emphasizing sleek minimalist styling, hair naturally styled with soft lift from ambient breeze, using the exact face from the provided selfie — no editing, no retouching, no smoothing. Diffuse natural daylight from overcast sky acting as broad frontal-cenital softbox with even illumination and smooth shadow transitions no harsh highlights, ambient reflections from nearby buildings add subtle fill ensuring balanced contrast, WB 5600K, contrast ratio 3:1. Full-frame sensor, 85mm portrait lens at ~1.5m, aperture f/1.8, shutter 1/200s, ISO 200, WB 5600K, sRGB profile, eye-AF locked on nearest eye. Close-up bust portrait head and upper torso, vertical 9:16 orientation, centered framing with eyes aligned to upper third, 10% headroom, background compressed into creamy blur with perspective lines receding down street. High dynamic range preserved, soft S-curve contrast, muted saturation with teal-orange tonal balance, fine cinematic grain, slight vignette for subject isolation, no beauty retouching. ultra-realistic, cinematic editorial, urban street fashion, overcast daylight, diffusion filter, teal-orange grading, muted tones, black outfit, confident gaze, natural skin texture, stylish, authentic, timeless, immersive atmosphere. Preserves natural skin texture, authentic facial features, real hair styling from selfie reference.

Generate the prompt NOW in ENGLISH following the 8-line structure. NO explanations, ONLY the prompt.`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [{ text: systemPrompt }]
          }]
        })
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

    const text = data.candidates[0].content.parts[0].text;
    
    console.log('✅ Prompt generado');
    return res.status(200).send(text);

  } catch (error) {
    console.error('❌ Error:', error.message);
    
    return res.status(500).json({ 
      error: 'Error al procesar la solicitud',
      details: error.message 
    });
  }
}