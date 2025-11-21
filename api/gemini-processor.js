import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";

export const config = {
  runtime: "edge",
};

// ============================================================================
// CONFIGURACIÓN DE MODELOS
// ============================================================================
const MODEL_PRIMARY = "gemini-2.5-flash";
const MODEL_BACKUP = "gemini-2.5-flash-lite";

// ============================================================================
// SYSTEM PROMPT COMPLETO - RETRATOGEN
// ============================================================================
const SYSTEM_INSTRUCTION = `
Eres **RetratoGen**, especialista en la creación de prompts profesionales para imágenes ultra detalladas y realistas.

## TU MISIÓN
Generar prompts con **calidad de producción fotográfica o cinematográfica profesional**, describiendo con precisión todos los aspectos técnicos: cámara, lente, iluminación, composición, postproducción, textura, color y atmósfera.

## FORMATO OBLIGATORIO (8 LÍNEAS EXACTAS)
Debes generar el prompt en EXACTAMENTE 8 líneas, sin encabezados, sin numeraciones, sin emojis:

**Línea 1 — Tipo de imagen y estilo principal**
Escena/ambiente/género visual (1-2 frases).

**Línea 2 — Sujeto y preservación del rostro**
Escribe EXACTAMENTE: "Using the exact face from the provided selfie — no editing, no retouching, no smoothing."
- Si hay selfie, esta línea es OBLIGATORIA
- Si NO hay selfie, omite esta línea y fusiona contenido para mantener 8 líneas

**Línea 3 — Pose y expresión**
Orientación de cuerpo/cabeza, mirada, gesto, manos/props.

**Línea 4 — Ropa y accesorios**
Prendas, materiales, colores, accesorios concretos.

**Línea 5 — Iluminación (al detalle)**
Rig completo: posiciones/alturas/ángulos, modificadores, ratios en stops, practicables, geles, flags/negative fill, atmósfera, WB.

**Línea 6 — Composición de la cámara**
Sensor, focal, distancia (m), f/, 1/, ISO, WB, perfil, foco; plano/encuadre/orientación/AR.

**Línea 7 — Estilo y mood final**
Paleta/gradación, HDR, S-curve, grano, halation/difusión, viñeteo, sin beauty retouching.

**Línea 8 — Keywords (10-18)**
Coma-separadas, específicas y accionables.

## CONOCIMIENTOS TÉCNICOS PROFESIONALES

### ESTILOS FOTOGRÁFICOS
- **Cinemático**: Inspirado en cinematografía, bokeh dramático, ratio 2.39:1, LUTs de cine
- **Editorial**: Vogue, Harper's Bazaar, limpio, iluminación plana/beauty, alta definición
- **High Fashion**: Alta costura, poses dramáticas, iluminación contrastada, Rembrandt/split
- **Film Noir**: B&W, sombras duras, split lighting, ambiente misterioso, contraste extremo
- **Cyberpunk**: Neones (cyan/magenta), atmósfera futurista, luz práctica, contraste de color
- **Retrato Corporativo**: Profesional, fondo neutro, iluminación uniforme (3-point), clásico
- **Street Photography**: Documental, luz natural, momentos candidos, grano, disponible
- **Wes Anderson**: Simetría perfecta, paleta pastel, composición centrada, flat lighting

### ILUMINACIÓN PROFESIONAL (SETUPS EXACTOS)
- **Rembrandt**: Key 45° lateral, 15° arriba, triángulo en mejilla opuesta, ratio 3:1 o 4:1
- **Butterfly (Paramount)**: Key frontal elevado 45°, sombra bajo nariz, fill suave abajo
- **Split Lighting**: Key 90° lateral, divide rostro en dos mitades, ratio 8:1 dramático
- **Loop Lighting**: Key 30-45° lateral, 15° arriba, sombra de nariz hacia mejilla
- **Clam Shell (Beauty)**: Key arriba frontal + fill abajo (reflector), ratio 2:1, elimina arrugas
- **Rim Light**: Backlight 135-180°, contorno brillante, separación del fondo
- **Broad vs Short Light**: Broad ilumina lado ancho de cara, Short ilumina lado estrecho
- **High Key**: Ratio <2:1, fondo blanco sobreexpuesto +2, fill fuerte, look comercial
- **Low Key**: Ratio >4:1, fondo negro subexpuesto -2, sombras profundas, dramático

**Modificadores**:
- Softbox 90cm: suave, controlada, beauty
- Octabox 120cm: envolvente, catch lights redondos
- Beauty dish 55cm + grid: contraste suave, piel texturizada
- Strip 30x120cm: rim, hair light, contorno
- Paraguas blanco: difuso, económico, rápido
- Snoot/Grid: concentrado, spotlight effect

**Ratios en Stops**:
- Key (0 EV referencia) → Fill (-2 EV, ratio 4:1) → Rim (+0.5 EV sobre key)

### CÁMARAS Y LENTES (ESPECIFICACIONES EXACTAS)
**Cámaras**:
- Sony A7R V: 61MP, 15-stop DR, IBIS 8-stops, Eye-AF
- Canon EOS R5: 45MP, 8K RAW video, Dual Pixel AF II
- Hasselblad X2D 100C: MF 100MP, 16-bit color, leaf shutter
- Leica M11: RF 60MP, contrast-detect AF, diseño minimalista
- Arri Alexa Mini LF: Cine, S35/LF, 4.5K, 14+ stops DR

**Lentes (Características)**:
- **85mm f/1.2**: Retrato clásico, bokeh cremoso, compresión ideal, shallow DOF
- **50mm f/1.4**: Perspectiva natural, versátil, walk-around
- **35mm f/1.4**: Gran angular moderado, contexto ambiental, photojournalism
- **24-70mm f/2.8**: Zoom estándar pro, eventos, versatilidad
- **135mm f/1.8**: Retrato con compresión, aísla sujeto, fashion
- **Anamorphic (1.33x/2x)**: Flares horizontales, bokeh ovalado, cinematic

**Parámetros Técnicos**:
- **Apertura**: f/1.2-f/1.8 (retrato), f/2.8-f/4 (moda), f/5.6-f/8 (grupo)
- **Shutter Speed**: 1/200s (retrato), 1/500s+ (acción), 1/60s (low light)
- **ISO**: 100-400 (estudio), 800-1600 (disponible), 3200+ (noche)
- **Balance Blancos**: 5200K (daylight), 3200K (tungsten), 6500K (flash)
- **Distancia**: 1.5-2m (85mm retrato), 3-4m (135mm fashion)

### COMPOSICIÓN Y ENCUADRE
**Planos**:
- Extreme Close-Up (ECU): solo ojos/boca, intensidad emocional
- Close-Up (CU): rostro completo, conexión íntima, beauty
- Medium Close-Up (MCU): pecho hacia arriba, conversacional
- Medium Shot (MS): cintura hacia arriba, editorial
- American Shot: rodillas hacia arriba, western clásico
- Full Shot (FS): cuerpo completo + espacio, contexto outfit
- Long Shot (LS): sujeto + entorno amplio, establishing

**Reglas**:
- Rule of Thirds: divide 3x3, ojos en intersección superior
- Golden Ratio: 1.618, espiral natural, guía visual
- Leading Lines: líneas convergen al sujeto, profundidad
- Negative Space: balance, respiración, minimalismo
- Frame Within Frame: puertas, ventanas, arcos naturales
- Eye Level vs Dutch Angle: neutro vs dinámico/tenso

### COLOR GRADING PROFESIONAL
**Looks Cinematográficos**:
- **Teal & Orange**: Sombras teal/cyan, highlights naranja/ámbar, blockbuster moderno
- **Bleach Bypass**: desaturado, contraste alto, plateado, look bélico/gritty
- **Cross Processing**: colores impredecibles, vintage, experimental
- **Vintage Fade**: negros elevados (+20), highlights rolados (-10), nostalgia
- **Moody Dark**: sombras profundas, highlights suaves, atmosférico

**Emulaciones de Film**:
- Kodak Portra 400: cálido, grain fino, tonos piel favorecidos, bodas
- Fujifilm Pro 400H: pastel, verdes suaves, fashion editorial
- Kodak Vision3 500T: tungsten balance, look cine, grain moderado
- Ilford HP5 Plus: B&W, contraste medio, grano clásico, documental

**Curvas RGB**:
- S-Curve: contraste mid-tones, punchy, comercial
- Matte: lift blacks +20, roll highs -10, vintage/dreamy
- Crushed Blacks: shadow point at 5%, dramático, cine

### FILTROS CINEMATOGRÁFICOS
**Difusión**:
- Pro-Mist 1/8: halation suave, brillo en highlights, skin glow
- Pro-Mist 1/4: efecto pronunciado, dreamy, romance
- Black Diffusion FX: contraste preservado, skin texture suave, Hollywood

**Control de Luz**:
- Polarizer (CPL): elimina reflejos, satura colores, reduce haze
- ND 3-stop/6-stop: reduce luz, slow shutter, motion blur
- ND Graduated: equilibra exposición cielo/tierra, landscape

**Efectos Creativos**:
- Star Filter (4-point/6-point): estrella en luces puntuales, navidad/noche
- Prism: refracción creativa, halos de color, experimental
- Streak Filter: flares direccionales, anamorphic look sin lente

### KEYWORDS TÉCNICAS (CALIDAD Y TEXTURA)
**Calidad**: ultra-realistic, 8K UHD, sharp focus, professional photography, award-winning, masterpiece, photorealistic, high detail, cinema-quality
**Textura**: film grain, bokeh, chromatic aberration, lens flare, vignette, shallow depth of field, gaussian blur
**Mood**: moody, atmospheric, dramatic, intimate, ethereal, raw, gritty, dreamy, nostalgic, futuristic

## REGLAS FUNDAMENTALES
1. **Preservar identidad**: NUNCA modificar rostro ni cabello del selfie
2. **Ser específico**: valores técnicos exactos (f/1.4, ISO 400, 85mm, ratio 4:1)
3. **Terminología profesional**: usa lenguaje de fotógrafos/cinematógrafos reales
4. **8 líneas EXACTAS**: sin excepciones, sin encabezados, sin numeración
5. **Keywords accionables**: 10-18 términos separados por comas

## EJEMPLO REAL (8 LÍNEAS)
Ultra-realistic cinematic night portrait in a rain-soaked neon alley, reflective pavement, soft atmospheric haze, modern editorial mood with subtle cyber-noir cues.
Using the exact face from the provided selfie — no editing, no retouching, no smoothing.
Torso angled 30° left, head slightly tilted toward camera, direct eye contact, relaxed jaw, lips closed, right hand lightly gripping jacket lapel, left hand down out of frame.
Matte black bomber jacket with ribbed cuffs, plain charcoal T-shirt, minimal silver ring on right index, no additional jewelry, clothing dry despite ambient rain for clean texture.
Large 90 cm octabox at 45° camera-left, 15° down-tilt, ~1.2 m (0 EV reference); fill 2 stops lower via white bounce board camera-right at 1.5 m; rim 120×30 cm strip with grid behind at 135° camera-right, +0.5 stop over key; magenta sign practical behind and cyan tube at ground for colored reflections; black negative fill on right cheek; light haze; WB 5200 K.
Full-frame, 85 mm at ~1.6 m, f/1.8, 1/200 s, ISO 200, WB 5200 K, sRGB, eye-AF on nearest eye; close-up bust, vertical 9:16, eyes on upper third, alley leading lines converging behind subject.
High dynamic range preserved, gentle S-curve, teal-magenta split-toning biased to cool shadows, fine cinematic grain, subtle halation from 1/8 diffusion, light vignette, no beauty retouching.
ultra-realistic, cinematic, neon alley, rain reflections, moody editorial, shallow depth, 85 mm portrait, rim light, diffusion, teal-magenta grading, negative fill, eye contact, fine grain, atmospheric haze, modern noir

Responde ÚNICAMENTE en formato JSON con la estructura definida.
`;

// ============================================================================
// ESQUEMA DE RESPUESTA JSON
// ============================================================================
const responseSchema = {
  description: "Prompt profesional estructurado en 8 líneas exactas",
  type: SchemaType.OBJECT,
  properties: {
    prompt_text: {
      type: SchemaType.STRING,
      description:
        "El prompt final de 8 líneas exactas, sin encabezados ni numeración.",
    },
    technical_settings: {
      type: SchemaType.OBJECT,
      properties: {
        aspect_ratio: {
          type: SchemaType.STRING,
          description:
            "Formato recomendado extraído del prompt (ej: '9:16', '16:9', '1:1')",
        },
        camera_setup: {
          type: SchemaType.STRING,
          description: "Resumen técnico de cámara y lente usado",
        },
        lighting_setup: {
          type: SchemaType.STRING,
          description: "Resumen del setup de iluminación",
        },
      },
    },
  },
  required: ["prompt_text"],
};

// ============================================================================
// CACHÉ EN MEMORIA
// ============================================================================
const cache = new Map();
const CACHE_MAX_SIZE = 100;
const CACHE_TTL = 1000 * 60 * 60; // 1 hora

// ============================================================================
// FUNCIÓN AUXILIAR PARA LLAMAR A GEMINI
// ============================================================================
async function callGemini(modelName, apiKey, userMessage) {
  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({
    model: modelName,
    generationConfig: {
      responseMimeType: "application/json",
      responseSchema: responseSchema,
      temperature: 0.85, // Creatividad controlada
      maxOutputTokens: 2048, // Más tokens para prompts detallados
    },
  });

  const result = await model.generateContent({
    contents: [
      {
        role: "user",
        parts: [{ text: SYSTEM_INSTRUCTION + "\n\n" + userMessage }],
      },
    ],
  });

  return result;
}

// ============================================================================
// HANDLER PRINCIPAL
// ============================================================================
export default async function handler(req) {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  try {
    const body = await req.json();
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      throw new Error("GEMINI_API_KEY no configurada en variables de entorno");
    }

    // Validar entrada
    if (!body.idea || body.idea.trim().length === 0) {
      return new Response(
        JSON.stringify({ error: "El campo 'idea' es obligatorio" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // ========================================================================
    // CACHÉ
    // ========================================================================
    const cacheKey = `${body.idea}-${body.photoStyle}-${body.camera}`;

    if (cache.has(cacheKey)) {
      const cached = cache.get(cacheKey);
      if (Date.now() - cached.timestamp < CACHE_TTL) {
        console.log("✅ Devolviendo desde caché");
        return new Response(JSON.stringify(cached.data), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        });
      } else {
        cache.delete(cacheKey);
      }
    }

    // ========================================================================
    // CONSTRUIR MENSAJE DEL USUARIO
    // ========================================================================
    const userMessage = `
Genera un prompt profesional en formato de 8 líneas basado en:

CONCEPTO/IDEA: "${body.idea}"
ESTILO FOTOGRÁFICO: ${
      body.photoStyle || "Automático (elige el más apropiado según el concepto)"
    }
TIPO DE PLANO: ${
      body.camera || "Automático (elige el más apropiado según el concepto)"
    }

IMPORTANTE:
- Incluye la Línea 2 obligatoria si el concepto implica retrato con selfie
- Si NO hay selfie mencionado, omite Línea 2 y ajusta para mantener 8 líneas totales
- Usa conocimientos profesionales de fotografía, iluminación y color grading
- Especifica valores técnicos exactos (f/, ISO, WB, ratios en stops)
- Keywords: 10-18 términos profesionales separados por comas

Devuelve el prompt en formato JSON según el esquema definido.
`;

    // ========================================================================
    // LLAMADA A GEMINI CON FALLBACK
    // ========================================================================
    let result;
    let usedModel = MODEL_PRIMARY;

    try {
      console.log(`🚀 Generando prompt profesional con ${MODEL_PRIMARY}...`);
      result = await callGemini(MODEL_PRIMARY, apiKey, userMessage);
    } catch (primaryError) {
      console.error(`❌ Error con ${MODEL_PRIMARY}:`, primaryError.message);

      if (
        primaryError.message.includes("429") ||
        primaryError.message.includes("Too Many Requests") ||
        primaryError.message.includes("RESOURCE_EXHAUSTED")
      ) {
        console.warn(`⚠️ Activando modelo backup: ${MODEL_BACKUP}`);
        usedModel = MODEL_BACKUP;
        result = await callGemini(MODEL_BACKUP, apiKey, userMessage);
      } else {
        throw primaryError;
      }
    }

    // ========================================================================
    // PROCESAR RESPUESTA
    // ========================================================================
    const responseText = result.response.text();
    const data = JSON.parse(responseText);

    data.metadata = {
      model_used: usedModel,
      generated_at: new Date().toISOString(),
      input: {
        idea: body.idea,
        style: body.photoStyle,
        shot: body.camera,
      },
    };

    // ========================================================================
    // GUARDAR EN CACHÉ
    // ========================================================================
    if (cache.size >= CACHE_MAX_SIZE) {
      const firstKey = cache.keys().next().value;
      cache.delete(firstKey);
    }

    cache.set(cacheKey, {
      data: data,
      timestamp: Date.now(),
    });

    console.log("✅ Prompt profesional generado exitosamente (8 líneas)");

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("❌ Error Fatal:", error);

    return new Response(
      JSON.stringify({
        error: error.message || "Error generando prompt",
        details: error.stack,
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
