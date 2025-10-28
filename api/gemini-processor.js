// ============================================================================
// PROMPTRAITS V2.0 - GEMINI PROCESSOR CON CONOCIMIENTOS PROFESIONALES
// ============================================================================
// Integra conocimientos de:
// - Nano-banana (Google Gemini)
// - Midjourney
// - Fotografía Profesional
// - Filtros Fotográficos y Cinematográficos
// - Capture One Pro (Edición RAW)
// ============================================================================

// ============================================================================
// BASE DE CONOCIMIENTOS FOTOGRÁFICOS PROFESIONALES
// ============================================================================

const KNOWLEDGE_BASE = {
  // MÓDULO 1: ESTRUCTURA DE PROMPTS POR PLATAFORMA
  promptStructure: {
    nanoBanana: {
      name: "Nano-Banana (Google Gemini)",
      components: [
        "1. Sujeto: Descripción detallada (edad, género, rasgos, expresión, vestimenta)",
        "2. Estilo: Fotorrealista, cinematográfico, ilustración, etc.",
        "3. Detalles Técnicos: Cámara, lente (ej: Canon 85mm f/1.2), apertura",
        "4. Iluminación: Tipo (Rembrandt, Butterfly, etc.), dirección, calidad",
        "5. Composición: Encuadre (close-up, medium shot), ángulo (eye level, low angle)",
        "6. Contexto/Fondo: Entorno, nivel de desenfoque",
        "7. Atmósfera/Mood: Tono emocional (cálido, dramático, sereno)",
        "8. Orientación: 'vertical portrait format' o 'wide horizontal composition'"
      ],
      rules: {
        noNegativePrompts: true,
        optimalLength: "1000-1800 caracteres (ideal: 1200-1600)",
        maxLength: "2500 caracteres",
        format: "Un párrafo continuo y fluido",
        conversational: true,
        specifyOrientation: true
      },
      notes: "NO soporta prompts negativos. Usa contexto conversacional. Por defecto genera 1:1 (cuadrado)."
    },
    midjourney: {
      name: "Midjourney V7",
      components: [
        "[Sujeto detallado] + [Estilo] + [Iluminación] + [Composición] + [Ambiente] + [Parámetros]"
      ],
      parameters: {
        aspectRatio: "--ar [ratio] (1:1, 3:4, 4:3, 16:9, 9:16)",
        version: "--v [4-7] (default: 7)",
        stylize: "--s [0-1000] (0-50: literal, 100: default, 200-1000: artístico)",
        quality: "--q [0.25, 0.5, 1, 2] (default: 1)",
        chaos: "--c [0-100] (variedad entre resultados)",
        seed: "--seed [número] (reproducibilidad)",
        negative: "--no [elementos] (lo que NO quieres)",
        weird: "--weird [0-3000] (elementos inusuales)",
        imageWeight: "--iw [0.5-3] (influencia de imagen referencia)"
      },
      rules: {
        parametersAtEnd: true,
        spaceSeparated: true,
        noCommasBetweenParams: true,
        detailedPrompts: true,
        photorealismStylize: "0-100",
        conceptArtStylize: "200-1000"
      },
      notes: "Parámetros al FINAL separados por espacios. Seed para reproducibilidad exacta."
    }
  },

  // MÓDULO 2: ILUMINACIÓN PROFESIONAL
  lighting: {
    classicSchemes: {
      rembrandt: {
        name: "Rembrandt Lighting",
        description: "Luz principal a 45° del sujeto, ligeramente elevada. Crea triángulo de luz en mejilla opuesta.",
        mood: "Dramático, clásico, volumen y carácter",
        prompt: "Rembrandt lighting with triangle of light on cheek, dramatic shadows, 45-degree key light",
        use: "Retratos profesionales, cine, fotografía dramática"
      },
      butterfly: {
        name: "Butterfly Lighting",
        description: "Luz desde arriba y frontal. Crea sombra bajo la nariz en forma de mariposa.",
        mood: "Glamuroso, define pómulos, elegante",
        prompt: "butterfly lighting from above, shadow under nose, glamorous beauty lighting",
        use: "Retratos de belleza, moda, fotografía glamour"
      },
      loop: {
        name: "Loop Lighting",
        description: "Luz a 45° y ligeramente elevada. Sombra en forma de bucle desde nariz hacia mejilla.",
        mood: "Versátil, favorecedor, menos contrastado que Rembrandt",
        prompt: "loop lighting, slight nose shadow toward cheek, flattering portrait setup",
        use: "Retratos generales, corporativos, versatilidad"
      },
      split: {
        name: "Split Lighting",
        description: "Mitad del rostro iluminado, mitad en sombra. Muy dramático.",
        mood: "Dramático, misterioso, alto contraste",
        prompt: "split lighting, one half of face in shadow, dramatic contrast",
        use: "Retratos dramáticos, arte conceptual"
      },
      broad: {
        name: "Broad Lighting",
        description: "Lado del rostro hacia la cámara está iluminado.",
        mood: "Ensancha el rostro",
        prompt: "broad lighting, camera-facing side illuminated",
        use: "Rostros delgados que se quieren ensanchar"
      },
      short: {
        name: "Short Lighting",
        description: "Lado del rostro alejado de la cámara está iluminado. Adelgaza.",
        mood: "Adelgaza, esculpe el rostro",
        prompt: "short lighting, shadow on camera-facing side, slimming effect",
        use: "Rostros anchos que se quieren adelgazar"
      }
    },
    quality: {
      soft: {
        name: "Luz Suave (Difusa)",
        description: "Sombras graduales, transiciones suaves, favorecedora",
        sources: "softbox, día nublado, ventana con cortina, luz rebotada",
        prompt: "soft diffused lighting, gentle shadows, flattering illumination",
        use: "Retratos, belleza, fotografía corporativa"
      },
      hard: {
        name: "Luz Dura",
        description: "Sombras marcadas, alto contraste, dramática",
        sources: "sol directo, flash desnudo, luz puntual sin difusor",
        prompt: "hard lighting, sharp shadows, high contrast, dramatic",
        use: "Fotografía dramática, moda edgy, arte conceptual"
      }
    },
    timeOfDay: {
      goldenHour: {
        name: "Golden Hour",
        description: "Poco después del amanecer o antes del atardecer",
        prompt: "warm golden hour light, sunset glow, magical warm tones",
        mood: "Cálido, mágico, romántico"
      },
      blueHour: {
        name: "Blue Hour",
        description: "Crepúsculo, antes del amanecer o después del atardecer",
        prompt: "blue hour lighting, twilight atmosphere, deep blue tones",
        mood: "Melancólico, sereno, cinematográfico"
      },
      midday: {
        name: "Midday",
        description: "Sol alto, mediodía",
        prompt: "harsh midday sun, overhead lighting, strong shadows",
        mood: "Duro, contrastado (evitar para retratos salvo con difusores)"
      },
      overcast: {
        name: "Overcast",
        description: "Día nublado, luz difusa natural",
        prompt: "soft overcast light, cloudy day diffusion, even illumination",
        mood: "Suave, uniforme, ideal para retratos exteriores"
      }
    },
    direction: {
      frontal: "Luz apunta directamente al sujeto. Reduce sombras, puede aplanar.",
      lateral: "Luz desde el lado. Resalta forma y textura, dramático con volumen.",
      trasera: "Contraluz desde detrás. Crea siluetas o halo (rim light).",
      cenital: "Desde arriba. Evitar en retratos (sombras en ojos). Útil para efectos.",
      uplighting: "Desde abajo. Efecto inquietante, poco natural."
    }
  },

  // MÓDULO 3: LENTES Y ESPECIFICACIONES TÉCNICAS
  lenses: {
    "24-35mm": {
      type: "Gran angular",
      characteristics: "Captura más contexto, ligera distorsión en rostros si muy cerca",
      use: "Paisajes, arquitectura, retratos ambientales",
      prompt: "24mm wide angle lens, environmental context, slight perspective distortion"
    },
    "50mm": {
      type: "Normal (visión ojo humano)",
      characteristics: "Versátil, perspectiva natural",
      use: "Todo tipo de fotografía, street, retratos",
      aperture: "f/1.4, f/1.8 muy común",
      prompt: "50mm f/1.8 lens, natural perspective, versatile framing"
    },
    "85mm": {
      type: "Retrato clásico - REY DEL RETRATO",
      characteristics: "Compresión favorable, bokeh hermoso, perspectiva halagadora",
      use: "Retratos profesionales, headshots, moda",
      aperture: "f/1.2, f/1.4, f/1.8, f/2",
      prompt: "85mm f/1.2 lens, shallow depth of field, creamy bokeh, professional portrait",
      notes: "El más usado en retratos profesionales"
    },
    "135-200mm": {
      type: "Teleobjetivo",
      characteristics: "Gran compresión, aísla sujeto del fondo",
      use: "Retratos íntimos, moda, detalles",
      prompt: "135mm telephoto lens, strong compression, isolated subject"
    }
  },

  // MÓDULO 4: FILTROS CINEMATOGRÁFICOS
  filters: {
    diffusion: {
      blackProMist: {
        name: "Black Pro-Mist (⭐ MÁS USADO EN CINE)",
        effect: "Suaviza imagen, crea halo en luces brillantes, look cinematográfico vs digital",
        intensities: ["1/8 (muy sutil)", "1/4 (sutil)", "1/2 (moderado)", "1 (fuerte)", "2 (muy fuerte)"],
        use: "Casi TODA película/serie moderna usa esto. Retratos, cine, moda.",
        prompt: "soft diffused highlights with Black Pro-Mist effect, cinematic halation on bright lights, organic film-like quality",
        notes: "Reduce nitidez digital, baja contraste, florece las altas luces. Intensidades bajas (1/8, 1/4) para no delatar mucho el efecto."
      },
      hollywoodBlackMagic: {
        name: "Hollywood Black Magic",
        effect: "Pro-Mist + low contrast combinado",
        prompt: "Hollywood Black Magic filter effect, combined diffusion and contrast reduction"
      },
      glimmerglass: {
        name: "Glimmerglass",
        effect: "Partículas brillantes que dan glamour",
        prompt: "Glimmerglass filter effect, glamorous sparkle on highlights"
      },
      softFocus: {
        name: "Soft Focus",
        effect: "Aspecto soñador, romántico",
        prompt: "soft focus effect, dreamy romantic atmosphere"
      }
    },
    nd: {
      name: "ND (Neutral Density)",
      effect: "Reduce luz sin alterar colores. 'Gafas de sol para la cámara'",
      intensities: "ND2 (1 stop), ND4 (2 stops), ND8 (3 stops), ND64 (6 stops), ND1000 (10 stops)",
      use: {
        longExposure: "Largas exposiciones de día (efecto seda en agua)",
        wideAperture: "Apertura amplia bajo sol fuerte (f/1.4 sin sobreexponer)",
        video: "OBLIGATORIO en video exterior para mantener 1/48s (regla 180°)"
      },
      prompt: "shallow depth of field achieved with ND filter, wide aperture in bright conditions"
    },
    polarizer: {
      name: "CPL (Polarizador Circular)",
      effect: "Elimina reflejos en superficies no metálicas, oscurece cielos, satura colores",
      lossOfLight: "-2 a -3 stops",
      use: {
        reflections: "Elimina reflejos en agua, vidrio, piel brillante",
        sky: "Oscurece cielos azules (más dramáticos con sol a 90°)",
        colors: "Aumenta saturación de colores (especialmente verdes)",
        skin: "Reduce brillos en piel (retratos exteriores)"
      },
      prompt: "polarized light reducing skin reflections, darkened sky with saturated colors, enhanced color depth"
    },
    streak: {
      name: "Streak Filters (Anamorphic Flare)",
      effect: "Destello horizontal azul imitando lentes anamórficas",
      prompt: "anamorphic lens flare with blue horizontal streak, cinematic sci-fi look"
    }
  },

  // MÓDULO 5: COLOR GRADING (Capture One Style)
  colorGrading: {
    cinematic: {
      tealOrange: {
        name: "Teal & Orange (Hollywood)",
        description: "Sombras cian/azul, luces naranjas/amarillas",
        prompt: "cinematic color grading with teal shadows and orange highlights, Hollywood blockbuster look",
        use: "Muy usado en cine comercial, moda, publicidad"
      },
      warm: {
        name: "Warm Tones",
        description: "Tonos cálidos en toda la imagen",
        prompt: "warm color grading, golden tones, cozy atmosphere"
      },
      cool: {
        name: "Cool Tones",
        description: "Tonos fríos, azules",
        prompt: "cool color grading, blue tones, cinematic cold atmosphere"
      },
      vintage: {
        name: "Vintage Film",
        description: "Contraste reducido, tonos pastel, levantamiento de sombras",
        prompt: "vintage film look, reduced contrast, lifted shadows, pastel tones, nostalgic atmosphere"
      }
    },
    mood: {
      highKey: {
        name: "High-Key",
        description: "Brillante, sombras levantadas, predominio de tonos claros",
        prompt: "high-key lighting setup, bright tones, lifted shadows, optimistic mood",
        use: "Fotografía comercial, optimismo, ligereza"
      },
      lowKey: {
        name: "Low-Key",
        description: "Oscuro, contraste alto, predominio de sombras",
        prompt: "low-key lighting, dramatic shadows, high contrast, mysterious dark atmosphere",
        use: "Drama, misterio, intensidad, film noir"
      }
    },
    adjustments: {
      liftedShadows: "lifted shadows revealing detail in dark areas",
      reducedHighlights: "reduced highlights preserving sky detail without clipping",
      dehaze: "dehaze applied removing atmospheric haze, increased clarity",
      clarityPunch: "enhanced clarity using punch method, increased midtone contrast",
      clarityNatural: "natural clarity enhancement, subtle detail boost",
      skinUniformity: "skin tone uniformity adjustment for even complexion, reduced color variations"
    }
  },

  // MÓDULO 6: EXPRESIONES Y EMOCIONES
  emotions: {
    joy: "genuine warm smile, eyes crinkling with joy, radiant happiness, authentic laughter",
    confidence: "confident gaze, strong direct eye contact, slight smirk, assured expression, powerful presence",
    serenity: "peaceful expression, calm demeanor, soft gentle smile, relaxed features, tranquil atmosphere",
    contemplative: "contemplative look, gazing into distance, slightly furrowed brow, thoughtful expression, introspective mood",
    mysterious: "enigmatic expression, subtle Mona Lisa smile, intense penetrating gaze, secretive aura",
    serious: "serious professional expression, neutral face, composed demeanor, business-like attitude",
    playful: "playful expression, mischievous smile, bright eyes, fun energy"
  },

  // MÓDULO 7: PROFUNDIDAD DE CAMPO Y BOKEH
  depthOfField: {
    shallow: {
      description: "Poca profundidad, fondo muy desenfocado",
      howToAchieve: "Apertura amplia (f/1.4 - f/2.8), cerca del sujeto, lentes largos (85mm+), sensor grande",
      prompt: "extremely shallow depth of field, f/1.2 aperture, creamy bokeh background, subject isolation",
      use: "Retratos, aislar sujeto, look profesional"
    },
    deep: {
      description: "Gran profundidad, todo enfocado",
      howToAchieve: "Apertura cerrada (f/8 - f/16), alejado del sujeto, gran angular",
      prompt: "deep depth of field, f/11 aperture, everything in sharp focus from foreground to background",
      use: "Paisajes, fotografía de grupo, arquitectura"
    }
  },

  // MÓDULO 8: COMPOSICIÓN Y ENCUADRE
  composition: {
    shotTypes: {
      extremeCloseUp: "Extreme close-up (ECU), solo parte del rostro (ej: ojos)",
      closeUp: "Close-up (CU), rostro completo desde hombros",
      mediumCloseUp: "Medium close-up (MCU), desde pecho hacia arriba",
      mediumShot: "Medium shot (MS), desde cintura hacia arriba",
      americanShot: "American shot, tres cuartos desde rodillas",
      fullShot: "Full shot (FS), cuerpo completo de pies a cabeza",
      longShot: "Long shot (LS), sujeto en entorno amplio"
    },
    cameraAngles: {
      eyeLevel: "Eye level angle, neutral natural perspective at subject's eye height",
      highAngle: "High angle (picado), camera above looking down, suggests vulnerability",
      lowAngle: "Low angle (contrapicado), camera below looking up, powerful imposing perspective",
      birdsEye: "Bird's eye view, directly from above, top-down perspective",
      dutchAngle: "Dutch angle, tilted camera, dynamic tension, unease"
    },
    rules: {
      ruleOfThirds: "rule of thirds composition, subject placed at intersection points",
      goldenRatio: "golden ratio composition, natural harmonious placement",
      centered: "centered composition, symmetrical balanced framing",
      leadingLines: "leading lines directing eye to subject",
      negativeSpace: "negative space composition, minimalist approach"
    }
  },

  // MÓDULO 9: ERRORES COMUNES A EVITAR
  commonMistakes: {
    nanoBanana: [
      "❌ NO usar prompts negativos (NO FUNCIONAN en nano-banana)",
      "❌ NO hacer prompts excesivamente largos (>2500 caracteres)",
      "❌ NO usar términos contradictorios ('iluminación brillante y oscura')",
      "✅ SÍ especificar encuadre y ángulo claramente",
      "✅ SÍ usar orientación específica ('vertical portrait format')",
      "✅ SÍ mantener coherencia en la descripción",
      "✅ SÍ usar contexto conversacional"
    ],
    midjourney: [
      "❌ NO poner parámetros al principio (van al FINAL)",
      "❌ NO usar comas entre parámetros (solo espacios)",
      "❌ NO usar operadores de búsqueda ('-', 'site:', comillas)",
      "✅ SÍ ser más explícito y detallado que en V4",
      "✅ SÍ especificar versión si no quieres V7 (--v 6)",
      "✅ SÍ usar --s bajo (0-100) para fotorrealismo",
      "✅ SÍ usar --seed para reproducibilidad exacta"
    ],
    general: [
      "❌ NO describir el equipo físico de iluminación que aparecería en la imagen (softbox, umbrella)",
      "✅ SÍ describir la CALIDAD y EFECTO de la luz (soft, hard, diffused, directional)",
      "❌ NO usar descripciones genéricas ('foto bonita de una mujer')",
      "✅ SÍ ser específico con todos los elementos (edad, rasgos, iluminación, técnica)"
    ]
  }
};

// ============================================================================
// FUNCTION: GENERAR SYSTEM PROMPT DINÁMICO SEGÚN PLATAFORMA
// ============================================================================

function generateSystemPrompt(platform, userData) {
  const {
    prompt,
    referenceImage,
    preset,
    scenario,
    sliders,
    shotType,
    outfitStyle,
    environment
  } = userData;

  // BASE COMÚN PARA AMBAS PLATAFORMAS
  let systemPrompt = `You are Promptraits V2.0, an expert AI prompt engineer specializing in hyper-realistic photography prompts.

You have DEEP PROFESSIONAL KNOWLEDGE in:
- Professional photography lighting techniques (Rembrandt, Butterfly, Loop, Split lighting)
- Camera technical specifications (sensor types, focal lengths, aperture, ISO, white balance)
- Cinematographic filters (Black Pro-Mist, ND filters, Polarizers, Anamorphic flares)
- Color grading workflows (Capture One, teal & orange, vintage film looks)
- Composition rules (rule of thirds, golden ratio, shot types, camera angles)
- Emotional expression and mood creation
- Professional retrato, moda, and editorial photography

CRITICAL KNOWLEDGE BASE:
${JSON.stringify(KNOWLEDGE_BASE, null, 2)}

`;

  // ============================================================================
  // NANO-BANANA (GOOGLE GEMINI) - SYSTEM PROMPT
  // ============================================================================
  if (platform === 'nano-banana') {
    systemPrompt += `
╔═══════════════════════════════════════════════════════════════╗
║              PLATFORM: NANO-BANANA (GOOGLE GEMINI)            ║
╚═══════════════════════════════════════════════════════════════╝

PROMPT STRUCTURE (8 Essential Components):
You MUST integrate ALL 8 components seamlessly into ONE continuous paragraph:

1. SUJETO: Detailed description
   - Edad, género, rasgos físicos específicos
   - Expresión facial (use KNOWLEDGE_BASE.emotions)
   - Vestimenta detallada, accesorios
   - Pose y lenguaje corporal

2. ESTILO: Photography style
   - "Ultra-realistic portrait", "Editorial fashion", "Cinematic", etc.
   - Reference professional photography styles

3. DETALLES TÉCNICOS: Camera specifications
   - Sensor: "Full-frame sensor", "APS-C", "Medium format"
   - Lens: Use KNOWLEDGE_BASE.lenses (ejemplo: "Canon 85mm f/1.2 lens")
   - Aperture: f/1.2, f/1.4, f/1.8, f/2.8, etc.
   - ISO, shutter speed, white balance (exact K value)

4. ILUMINACIÓN: Lighting setup (THE MOST IMPORTANT)
   - Use KNOWLEDGE_BASE.lighting.classicSchemes
   - Specify light QUALITY and EFFECT (soft, hard, diffused)
   - Direction and angle (45°, 60°, side light, key light position)
   - Time of day if relevant (golden hour, blue hour, overcast)
   - ❌ NEVER describe physical equipment (softbox, umbrella, reflector)
   - ✅ ALWAYS describe light characteristics and resulting effects

5. COMPOSICIÓN: Framing and camera angle
   - Shot type: Use KNOWLEDGE_BASE.composition.shotTypes
   - Camera angle: Use KNOWLEDGE_BASE.composition.cameraAngles
   - Composition rule: rule of thirds, golden ratio, centered, etc.

6. CONTEXTO/FONDO: Environment and background
   - Location description
   - Background treatment: "soft bokeh", "blurred background", "sharp environmental details"
   - Depth of field (shallow or deep)

7. ATMÓSFERA/MOOD: Emotional tone
   - Use KNOWLEDGE_BASE.colorGrading for mood
   - "warm cozy atmosphere", "dramatic moody", "bright optimistic", etc.
   - Post-processing style: "cinematic color grading", "natural tones", "vintage film look"

8. ORIENTACIÓN: Format specification
   - "vertical portrait format" for 3:4 / 4:5
   - "wide horizontal composition" for 16:9
   - "square composition" for 1:1 (default if not specified)

CRITICAL RULES FOR NANO-BANANA:
❌ NO NEGATIVE PROMPTS (they don't work in nano-banana)
✅ Optimal length: 1000-1800 characters (ideal: 1200-1600)
✅ Maximum: 2500 characters
✅ Format: ONE continuous flowing paragraph
✅ Natural, conversational language
✅ Coherent (no contradictions like "bright and dark lighting")
✅ Specify orientation clearly
✅ Focus on LIGHT EFFECTS not equipment

ADDITIONAL FILTERS & EFFECTS TO INCLUDE WHEN APPROPRIATE:
${JSON.stringify(KNOWLEDGE_BASE.filters, null, 2)}

COLOR GRADING OPTIONS:
${JSON.stringify(KNOWLEDGE_BASE.colorGrading, null, 2)}

OUTPUT FORMAT:
Write a single continuous paragraph in ENGLISH that naturally integrates all 8 components.
The prompt should read like a professional photography brief, not a list.

EXAMPLE OF GOOD NANO-BANANA PROMPT:
"Professional corporate headshot of confident young tech entrepreneur in early 30s with short dark hair and trimmed beard, wearing casual smart navy blazer over crisp white t-shirt, natural genuine smile showing warmth and approachability with direct eye contact. Shot with Canon 85mm f/1.2 lens at f/2 on full-frame sensor, ISO 400, 5600K white balance, creating extremely shallow depth of field with creamy bokeh. Soft window light from camera left positioned at 45-degree angle creates gentle Rembrandt lighting with subtle triangle of light on right cheek, fill light from right at 3:1 ratio maintaining detail in shadows. Medium close-up composition at eye level, following rule of thirds with eyes positioned at upper intersection point, 12% headroom above head. Modern minimalist office background with subtle bokeh separation, warm professional atmosphere with natural color grading and enhanced clarity using natural method. Vertical portrait format, 8K ultra detailed, sharp focus on eyes, editorial quality."

`;
  }

  // ============================================================================
  // MIDJOURNEY - SYSTEM PROMPT
  // ============================================================================
  else if (platform === 'midjourney') {
    systemPrompt += `
╔═══════════════════════════════════════════════════════════════╗
║                    PLATFORM: MIDJOURNEY V7                    ║
╚═══════════════════════════════════════════════════════════════╝

PROMPT STRUCTURE:
[Detailed Subject Description] + [Style] + [Lighting] + [Composition] + [Atmosphere] + [Parameters]

INTEGRATION OF PROFESSIONAL KNOWLEDGE:
- Use KNOWLEDGE_BASE.lighting for lighting setups
- Use KNOWLEDGE_BASE.lenses for lens specifications
- Use KNOWLEDGE_BASE.filters for cinematic effects
- Use KNOWLEDGE_BASE.colorGrading for color grading styles
- Use KNOWLEDGE_BASE.composition for framing
- Use KNOWLEDGE_BASE.emotions for expressions

MIDJOURNEY PARAMETERS (ADD AT THE END):
Available parameters to use when appropriate:

--ar [ratio]      Aspect ratio (REQUIRED)
                  Common: 1:1 (square), 3:4 (portrait), 4:3 (landscape), 16:9 (wide), 9:16 (mobile)

--v [version]     Model version (default: 7)
                  Use --v 6 for slightly different aesthetic
                  Use --v 5.2 for more creative variation

--s [0-1000]      Stylize (artistic interpretation)
                  0-50: Very literal to prompt (photorealism)
                  100: Default balance
                  200-1000: Very artistic and creative
                  For photorealism: use --s 50 to --s 100

--q [0.25-2]      Quality/detail level
                  0.25: Fast draft
                  1: Default
                  2: Maximum quality (recommended for final images)

--c [0-100]       Chaos/variety
                  0: Very similar results
                  50: Moderate variety
                  100: Maximum diversity (brainstorming)

--seed [number]   Reproducibility
                  Use specific number (0-4294967295) for consistent results
                  Same seed + same prompt = similar images

--no [elements]   Negative prompt (what you DON'T want)
                  Example: --no glasses, jewelry, text, watermark
                  Useful for: removing unwanted elements

--weird [0-3000]  Unusual/experimental elements
                  Add unique, quirky characteristics

--iw [0.5-3]      Image weight (when using image reference)
                  0.5: Low influence
                  1: Default
                  2-3: High influence on composition/style

CRITICAL RULES FOR MIDJOURNEY:
✅ Parameters MUST be at THE END of the prompt
✅ Separate parameters with SPACES, NO COMMAS
✅ Be detailed and explicit (more verbose than nano-banana)
✅ For photorealism: always use --s 50 to --s 100
✅ Always specify --ar (aspect ratio)
✅ Use --q 2 for final professional images
✅ Can use --seed for reproducibility

FILTERS TO MENTION IN PROMPT (not parameters):
- "soft diffused highlights with Black Pro-Mist effect" for cinematic look
- "polarized light reducing reflections" for clean surfaces
- "anamorphic lens flare with blue horizontal streak" for sci-fi look
- "shallow depth of field achieved with ND filter" for bokeh

COLOR GRADING TO MENTION:
- "cinematic color grading with teal shadows and orange highlights"
- "vintage film look with lifted shadows and pastel tones"
- "high-key bright atmosphere" or "low-key dramatic lighting"

OUTPUT FORMAT:
[Comprehensive prompt describing all visual elements] --ar [ratio] --v 7 --q 2 --s [value] [other parameters if needed]

EXAMPLE OF GOOD MIDJOURNEY PROMPT:
"Professional corporate headshot of confident business woman in her 40s, shoulder-length blonde hair, blue eyes, subtle warm smile, wearing elegant navy blazer with white shirt, direct eye contact with camera, neutral gray gradient background. Studio lighting setup with soft diffused key light from 45-degree angle creating gentle Rembrandt lighting, fill light from opposite side at 3:1 ratio, subtle rim light from behind for separation. Shot with Canon 85mm f/2.0 lens, extremely shallow depth of field with creamy bokeh, full-frame sensor, ISO 400. Medium close-up framing at eye level, rule of thirds composition with eyes at upper intersection point. Photorealistic style, natural color grading with enhanced clarity, editorial photography quality, sharp focus on eyes --ar 3:4 --v 7 --q 2 --s 75"

`;
  }

  // ============================================================================
  // AÑADIR CONTEXTO ADICIONAL DEL USUARIO
  // ============================================================================

  // Shot Type
  if (shotType) {
    systemPrompt += `\n\n📸 SHOT TYPE/FRAMING SPECIFIED:
Apply this specific framing: ${shotType.technical}
Composition guidance: ${shotType.nameEN} - ${shotType.description}`;
  }

  // Outfit Style
  if (outfitStyle) {
    systemPrompt += `\n\n👔 OUTFIT STYLE SPECIFIED:
Subject wearing: ${outfitStyle.keywords}
Style aesthetic: ${outfitStyle.name} - ${outfitStyle.description}`;
  }

  // Environment
  if (environment) {
    systemPrompt += `\n\n🌍 ENVIRONMENT/LOCATION SPECIFIED:
Location description: ${environment.prompt}
Lighting conditions: ${environment.lighting}
Technical considerations: ${environment.technical}`;
  }

  // Preset
  if (preset) {
    systemPrompt += `\n\n🎨 PRESET STYLE TO APPLY:
${preset}`;
  }

  // Scenario
  if (scenario) {
    systemPrompt += `\n\n📍 SCENARIO BASE:
${scenario}`;
  }

  // Sliders (Technical Parameters)
  if (sliders) {
    systemPrompt += `\n\n⚙️ TECHNICAL PARAMETERS TO APPLY:
- Aperture: f/${sliders.aperture}
- Focal length: ${sliders.focalLength}mm
- Contrast: ${sliders.contrast}
- Film grain: ${sliders.grain}
- Color temperature: ${sliders.temperature}K`;
  }

  // Reference Image Instructions
  if (referenceImage) {
    systemPrompt += `\n\n📷 REFERENCE IMAGE PROVIDED:
Analyze the reference image for:
- Pose, body angle, and head tilt (NOT person's physical features)
- Lighting setup and quality (soft/hard, direction, mood)
- Composition and framing style
- Background treatment and depth of field
- Overall atmosphere and mood
- Color grading style

CRITICAL: DO NOT describe the person's appearance (face, hair, skin tone, age, gender).
Focus ONLY on: technical photography elements, pose structure, lighting style, composition, and atmosphere.
The output must be UNIVERSAL and work for ANY person's selfie.`;
  }

  // User's Custom Prompt
  if (prompt && !referenceImage) {
    systemPrompt += `\n\n💬 USER'S CUSTOM REQUEST:
"${prompt}"

Interpret this request and create a professional ${platform} prompt incorporating all the photography knowledge above.`;
  }

  // Final instructions
  systemPrompt += `\n\n
╔═══════════════════════════════════════════════════════════════╗
║                     FINAL INSTRUCTIONS                        ║
╚═══════════════════════════════════════════════════════════════╝

Generate the prompt NOW in ENGLISH.
${platform === 'nano-banana' ? 
  'Output: ONE continuous paragraph (1000-1800 characters optimal)' : 
  'Output: Detailed prompt + parameters at the end'}

NO explanations, NO preamble, ONLY the prompt.
Use professional photography terminology throughout.
Be specific with technical values (angles, distances, temperatures, f-stops).
`;

  return systemPrompt;
}

// ============================================================================
// MAIN HANDLER FUNCTION
// ============================================================================

export default async function handler(req, res) {
  res.setHeader("Content-Type", "application/json");
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
      shotType,
      outfitStyle,
      environment,
      platform = 'nano-banana' // ✅ NUEVO: Plataforma seleccionada
    } = req.body;

    const API_KEY = process.env.GEMINI_API_KEY;

    if (!API_KEY) {
      console.error("❌ API key no configurada");
      return res.status(500).json({ error: "API key no configurada en el servidor" });
    }

    // MODO: APLICAR SUGERENCIAS (Solo PRO)
    if (applySuggestions && currentPrompt && suggestions) {
      console.log("✅ Aplicando sugerencias al prompt...");

      const improvementPrompt = `You are Promptraits V2.0. Improve this ${platform} prompt by applying these suggestions:

CURRENT PROMPT:
${currentPrompt}

SUGGESTIONS TO APPLY (in Spanish, but apply them in English):
${suggestions.map((s, i) => `${i + 1}. ${s}`).join("\n")}

PLATFORM: ${platform}
${platform === 'midjourney' ? 'Maintain all parameters at the end.' : 'Maintain single paragraph format.'}

OUTPUT: Return ONLY the improved prompt. Apply all suggestions naturally.

CRITICAL: Output ONLY the improved prompt, nothing else.`;

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${API_KEY}`,
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
        qualityAnalysis: null,
        platform
      });
    }

    // MODO: GENERACIÓN NORMAL DE PROMPT
    if (!prompt && !referenceImage) {
      return res.status(400).json({
        error: "Debes proporcionar un prompt o una imagen de referencia",
      });
    }

    console.log(`✅ Generando prompt profesional para ${platform}...`);

    // Construir system prompt dinámico según plataforma
    const systemPrompt = generateSystemPrompt(platform, {
      prompt,
      referenceImage,
      preset,
      scenario,
      sliders,
      shotType,
      outfitStyle,
      environment
    });

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
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${API_KEY}`,
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

    // Validar longitud según plataforma
    const validation = validatePromptLength(generatedPrompt, platform);

    // Si es PRO y pide análisis de calidad
    let qualityAnalysis = null;
    if (isPro && analyzeQuality) {
      qualityAnalysis = await analyzePromptQuality(generatedPrompt, platform, API_KEY);
    }

    console.log("✅ Prompt generado");
    return res.status(200).json({
      prompt: generatedPrompt,
      qualityAnalysis: qualityAnalysis,
      platform,
      validation
    });
  } catch (error) {
    console.error("❌ Error en gemini-processor:");
    console.error("Message:", error.message);
    console.error("Stack:", error.stack);

    return res.status(500).json({
      error: "Error al procesar la solicitud",
      details: error.message,
      stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
    });
  }
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

function validatePromptLength(prompt, platform) {
  const length = prompt.length;
  
  if (platform === 'nano-banana') {
    return {
      length,
      optimal: length >= 1000 && length <= 1800,
      acceptable: length >= 800 && length <= 2500,
      message: length < 1000 
        ? '⚠️ Prompt un poco corto. Óptimo: 1200-1600 caracteres.'
        : length > 1800
        ? '⚠️ Prompt un poco largo. Óptimo: 1200-1600 caracteres.'
        : '✅ Longitud óptima para nano-banana'
    };
  }
  
  // Midjourney es más flexible
  return {
    length,
    optimal: true,
    acceptable: true,
    message: '✅ Prompt válido para Midjourney'
  };
}

async function analyzePromptQuality(generatedPrompt, platform, API_KEY) {
  const analysisPrompt = `You are an expert photography director. Analyze this ${platform} prompt:

PROMPT TO ANALYZE:
${generatedPrompt}

Evaluate completeness and professional quality IN SPANISH.

CRITERIA:
1. LIGHTING (25%): Setup detail, ratios, temperatures
2. CAMERA SPECS (25%): Sensor, lens, aperture, ISO, WB
3. COMPOSITION (20%): Framing, orientation, placement
4. POST-PROCESSING (15%): Color grading, contrast, effects
5. TECHNICAL KEYWORDS (15%): Relevant photography terms

Score 0-10.

Provide ONLY valid JSON:
{
  "score": 9.2,
  "included": [
    "Setup de iluminación Rembrandt completo con ratios especificados",
    "Especificaciones de cámara profesionales completas",
    "Composición clara con regla de tercios y headroom"
  ],
  "suggestions": [
    "Añade temperatura de color específica para fill light",
    "Especifica tratamiento de sombras en post",
    "Incluye referencias de color más precisas"
  ]
}

Score 9.0-10.0: Editorial quality
Score 7.5-8.9: Very good
Score 6.0-7.4: Good foundation
Score 4.0-5.9: Needs detail
Score 0.0-3.9: Insufficient

ALL text in SPANISH. Be constructive. Output ONLY JSON.`;

  try {
    const analysisResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${API_KEY}`,
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
      const analysisText = analysisData.candidates[0].content.parts[0].text;
      const jsonMatch = analysisText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
    }
  } catch (e) {
    console.error("Error parsing quality analysis:", e);
  }
  
  return null;
}
