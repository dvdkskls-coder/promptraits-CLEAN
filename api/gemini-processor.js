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

    const systemPrompt = `Eres un experto en fotografía cinematográfica profesional.

Usuario solicita: ${prompt}

Genera un prompt cinematográfico profesional siguiendo EXACTAMENTE esta estructura técnica:

**1. ESCENA Y SUJETO (Obligatorio)**
- Descripción del entorno (ubicación específica, hora del día, condiciones meteorológicas)
- Pose y lenguaje corporal (ángulo del torso, posición de manos, inclinación de cabeza)
- Expresión facial (mirada, tensión en mandíbula, emoción proyectada)
- Vestuario detallado (materiales, cortes, capas, accesorios)
- Frase clave: "using the exact face from the provided selfie — no editing, no retouching, no smoothing"

**2. LIGHTING RIG (Setup completo de iluminación)**
- **Key Light**: Tipo (softbox/beauty dish/natural), posición exacta (ej: 45° camera-left, elevated 20°), potencia (ej: +0 EV)
- **Fill Light**: Fuente (reflector/segundo softbox), posición, potencia relativa al key (ej: -1.5 stops)
- **Rim/Backlight**: Posición (ej: behind camera-right), función (separación/contorno), potencia (ej: -2 stops vs key)
- **Practicals**: Luces ambientales/decorativas en la escena
- **Negative Fill**: Flags/banderas para profundizar sombras si aplica
- **White Balance**: Temperatura exacta (ej: 5200K, 3400K) y geles de color si aplica
- **Contrast Ratio**: Relación entre luces y sombras (ej: 3:1, 8:1)
- Especificar si es Rembrandt, butterfly, split, loop lighting, etc.

**3. CAMERA TECHNICAL SPECS**
- **Sensor**: Full-frame, APS-C, medium format
- **Focal length**: Valor exacto (ej: 85mm, 50mm, 35mm) y distancia al sujeto (ej: ~1.2m, ~2.5m)
- **Aperture**: f-stop preciso (ej: f/1.4, f/2.8, f/5.6) y efecto en DOF
- **Shutter speed**: Valor específico (ej: 1/125s, 1/200s)
- **ISO**: Valor exacto (ej: 100, 200, 400)
- **White Balance**: Temperatura si difiere del lighting (ej: WB 5600K)
- **Color Profile**: sRGB, Rec.709, Log, etc.
- **Focus**: Eye-AF, manual focus point, distancia hiperfocal
- **Filters**: CPL, ND, Black Pro-Mist, diffusion (especificar si aplica)

**4. FRAMING AND COMPOSITION**
- **Shot type**: Extreme close-up, close-up, medium close-up, medium shot, medium-long, long shot, extreme long shot
- **Orientation**: Vertical (9:16, 4:5, 3:4) o Horizontal (16:9, 3:2)
- **Aspect ratio**: Especificar exactamente
- **Camera height**: Eye level, high angle, low angle, específico (ej: ~15° above eye level)
- **Rule of thirds**: Posición de ojos, línea de horizonte
- **Headroom**: Espacio sobre la cabeza (ej: 7% headroom)
- **Negative space**: Uso de espacio vacío para composición
- **Leading lines**: Líneas arquitectónicas, perspectiva
- **Depth of field**: Shallow (desenfoque cremoso), medium, deep; especificar qué está nítido

**5. POST-PROCESSING AND GRADING**
- **Dynamic Range**: HDR preserved, crushed blacks, lifted shadows
- **Contrast**: S-curve específica, low contrast, high contrast
- **Color grading**: Teal-orange, neutral-cool, warm-amber, desaturated, cinematic LUT
- **Split toning**: Sombras (hue, saturación), highlights (hue, saturación)
- **Grain**: Film grain texture, digital grain, especificar cantidad
- **Halation**: Diffusion glow en highlights (ej: 1/8 Black Pro-Mist effect)
- **Vignette**: Natural darkening, especificar intensidad
- **Clarity/Structure**: Micro-contrast adjustments
- **Sharpening**: Amount y método
- **Beauty retouching**: "no beauty retouching, natural skin texture preserved" (siempre incluir)

**6. TECHNICAL KEYWORDS (Final del prompt)**
Incluir entre 8-15 keywords técnicos separados por comas:
ultra-realistic, cinematic portrait, professional photography, high-dynamic-range, editorial style, natural skin texture, film grain, shallow depth of field, bokeh, 85mm lens, Rembrandt lighting, studio photography, magazine quality, photorealistic, 4K resolution, etc.

**7. ESTILO DE ESCRITURA**
- Usar lenguaje técnico preciso de fotografía profesional
- Incluir valores numéricos exactos (grados, stops, milímetros, Kelvin)
- Estructura en párrafos fluidos, NO en lista de bullets
- Longitud: 200-400 palabras para retratos complejos
- Tono: Profesional, técnico, directo

**EJEMPLO DE OUTPUT ESPERADO:**
EJEMPLO 1:
"Black-and-white portrait of a confident man wearing a mustard-yellow hoodie with the hood up under a black leather biker jacket, black sunglasses, and facial piercings, standing against a neutral gray studio backdrop, posed at a 45-degree angle to the camera, gaze off-frame with a serious and introspective expression, using the exact face from the provided selfie — no editing, no retouching, no smoothing, moody soft side lighting at 5000K enhancing facial texture and shadow depth, emphasizing beard, earrings, and jacket details, framed vertically in 9:16, resolution 4K, shot with an 85mm f/1.8 lens on full-frame sensor, ultra-realistic, high-dynamic-range, editorial studio photography in monochrome, cinematic lighting."

EJEMPLO 2:
"Ultra-realistic cinematic street portrait taken in a bustling downtown avenue at sunset, golden urban glow with amber reflections from car headlights and building facades, editorial travel aesthetic blending warmth and grit. Using the exact face from the provided selfie — no editing, no retouching, no smoothing. Standing mid-crosswalk holding suitcase handle in right hand, left hand relaxed by side, torso slightly leaned forward, head tilted subtly right, gaze direct and confident through sunglasses, calm yet intense presence. Long beige teddy-fleece coat open over off-white hoodie with drawstrings, dark fitted jeans cuffed at ankle, cream sneakers with gum soles, brown cap and round sunglasses, black hard-shell suitcase beside, modern traveler mood. Key light from setting sun behind buildings camera-left (~15° elevation) casting warm rim; fill from reflective asphalt +1.5 stops under key; ambient tungsten and car lights add orange speculars; WB 4200 K; subtle urban haze; low-level mist diffusion. Full-frame sensor, 85 mm lens at ~3 m, f/2.0, 1/200 s, ISO 250, eye-AF locked, Rec.709 profile, vertical 4:5 framing full body, background compressed with shallow depth, leading lines from crosswalk guiding perspective. Cinematic orange-teal grading with golden highlights and rich blacks, low contrast, lifted shadows for film softness, halation on light sources, diffusion 1/8, fine film grain, mild vignette enhancing subject isolation, no beauty retouching. cinematic street portrait, golden hour, travel aesthetic, teddy coat, urban sunset, warm tones, orange teal, reflective asphalt, 85mm lens, shallow depth, rim light, fine grain, editorial realism, city background, confident pose, soft diffusion, cinematic glow"

EJEMPLO 3:
"Ultra-realistic cinematic street portrait in a narrow European city street, tall stone buildings and colorful storefronts blurred into painterly bokeh, pedestrians rendered as indistinct silhouettes for depth. Atmosphere urban, modern editorial, fashion-driven. Subject centered, torso slightly angled left, shoulders relaxed, head straight, intense direct gaze into lens, lips closed with a serious neutral expression. Subject wearing a tailored black wool overcoat with wide lapels, layered with a black scarf, entire outfit in deep matte black tones, emphasizing sleek minimalist styling. Hair naturally styled, soft lift from ambient breeze. using the exact face from the provided selfie — no editing, no retouching, no smoothing. diffuse natural daylight from overcast sky, acting as a broad frontal-cenital softbox, even illumination with smooth shadow transitions, no harsh highlights. Ambient reflections from nearby buildings add subtle fill, ensuring balanced contrast. soft desaturation of background colors, subtle teal shift in shadows and gentle warm lift in midtones, skin tones natural and realistic, overall moody editorial palette. Fine diffusion filter effect applied for slight halation in highlights and softened microcontrast. full-frame sensor, 85 mm portrait lens, distance ~1.5 m, aperture f/1.8, shutter 1/200 s, ISO 200, WB 5600 K, sRGB profile, eye autofocus locked on nearest eye. close-up bust portrait (head and upper torso), vertical 9:16 orientation, centered framing with eyes aligned to upper third, background compressed into creamy blur with perspective lines receding down the street. high dynamic range preserved, soft S-curve contrast, muted saturation with teal/orange tonal balance, fine cinematic grain, slight vignette for subject isolation, no beauty retouching. ultra-realistic, cinematic editorial, urban street fashion, overcast daylight, diffusion filter, teal-orange grading, muted tones, black outfit, confident gaze, natural skin texture, stylish, authentic, timeless, immersive atmosphere."

REGLAS DE ESCRITURA:
- Escribe en PÁRRAFOS FLUIDOS, nunca en lista o bullets
- Usa lenguaje técnico exacto: ángulos en grados, distancias en metros, temperatura en Kelvin, exposure en stops
- Incluye valores numéricos precisos (85mm, f/1.8, 1/200s, ISO 200, WB 5600K, etc.)
- Longitud: 250-450 palabras
- Siempre incluir "using the exact face from the provided selfie — no editing, no retouching, no smoothing"
- Siempre terminar con "no beauty retouching"
- Keywords técnicos al final separados por comas (10-20 keywords)
- Tono: Profesional, cinematográfico, técnico, detallado`;

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