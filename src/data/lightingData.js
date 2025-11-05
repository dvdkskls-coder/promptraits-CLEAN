// lightingData.js - Esquemas de iluminación profesional para fotografía de retrato
// Basado en: Curso Completo de Iluminación en Fotografía de Retrato

export const LIGHTING_SETUPS = [
  {
    id: "rembrandt",
    name: "Rembrandt",
    category: "classic",
    description: "Luz principal a 45°, ligeramente elevada, crea triángulo de luz en mejilla opuesta",
    keywords: "Rembrandt lighting, 45-degree key light elevated, triangle of light on opposite cheek, classic portrait lighting, depth and dimension",
    technical: "Key light at 45° angle and slightly above eye level, small triangle of light under opposite eye",
    mood: ["dramatic", "professional", "classic"],
    bestFor: ["portrait", "corporate", "editorial"]
  },
  {
    id: "butterfly",
    name: "Butterfly (Paramount)",
    category: "beauty",
    description: "Luz frontal elevada creando sombra de mariposa bajo la nariz",
    keywords: "butterfly lighting, paramount lighting, frontal key light elevated, butterfly shadow under nose, beauty lighting, defines cheekbones",
    technical: "Main light directly in front and above subject, creating butterfly-shaped shadow beneath nose",
    mood: ["glamorous", "elegant", "beauty"],
    bestFor: ["beauty", "glamour", "fashion"]
  },
  {
    id: "loop",
    name: "Loop",
    category: "classic",
    description: "Luz a 45° y ligeramente arriba, sombra suave en forma de bucle desde nariz",
    keywords: "loop lighting, 45-degree key light slightly above, soft loop-shaped shadow from nose on cheek, flattering portrait lighting",
    technical: "Light positioned 30-45° from subject and slightly above eye level, creates small loop shadow on cheek",
    mood: ["natural", "flattering", "professional"],
    bestFor: ["portrait", "headshot", "general"]
  },
  {
    id: "split",
    name: "Split",
    category: "dramatic",
    description: "Luz lateral a 90°, mitad del rostro iluminado, mitad en sombra",
    keywords: "split lighting, 90-degree side lighting, half face illuminated half in shadow, dramatic high contrast, emphasizes texture",
    technical: "Light at 90° to subject, creates stark division with one side lit and one side shadowed",
    mood: ["dramatic", "mysterious", "intense"],
    bestFor: ["artistic", "dramatic", "masculine"]
  },
  {
    id: "broad",
    name: "Broad (Amplio)",
    category: "corrective",
    description: "Ilumina el lado del rostro más cercano a cámara, ensancha apariencia",
    keywords: "broad lighting, illuminating side of face closest to camera, widens appearance, corrective lighting for narrow faces",
    technical: "Subject turns face away from camera, light illuminates the broader side facing camera",
    mood: ["open", "friendly", "approachable"],
    bestFor: ["narrow faces", "corrective", "commercial"]
  },
  {
    id: "short",
    name: "Short (Corto)",
    category: "corrective",
    description: "Ilumina el lado del rostro alejado de cámara, adelgaza apariencia",
    keywords: "short lighting, illuminating far side of face from camera, slims appearance, shadow on near side, sculptural",
    technical: "Subject turns toward camera, light illuminates the narrower far side, near side in shadow",
    mood: ["sculptural", "slimming", "refined"],
    bestFor: ["round faces", "corrective", "sculpting"]
  },
  {
    id: "clamshell",
    name: "Clamshell",
    category: "beauty",
    description: "Luz frontal suave desde arriba + reflector desde abajo, iluminación uniforme",
    keywords: "clamshell lighting, soft frontal light from above, reflector below, beauty dish setup, uniform facial illumination, minimizes shadows",
    technical: "Main light above and in front, large reflector or fill light below, wraps light around face",
    mood: ["soft", "flawless", "beauty"],
    bestFor: ["beauty", "makeup", "commercial"]
  },
  {
    id: "rim_backlight",
    name: "Rim Light (Contraluz)",
    category: "dramatic",
    description: "Luz detrás del sujeto creando halo o separación del fondo",
    keywords: "rim lighting, backlight behind subject, hair light, separation from background, glowing edge highlight",
    technical: "Light positioned behind subject, creates luminous outline or halo effect",
    mood: ["ethereal", "dramatic", "separating"],
    bestFor: ["editorial", "artistic", "dramatic"]
  },
  {
    id: "natural_window",
    name: "Luz Natural de Ventana",
    category: "natural",
    description: "Luz suave difusa desde ventana grande, con o sin reflector de relleno",
    keywords: "natural window light, soft diffused daylight, large window as softbox, optional reflector fill, gentle even illumination",
    technical: "Subject near large window, window acts as giant softbox, reflector opposite for fill",
    mood: ["natural", "soft", "authentic"],
    bestFor: ["lifestyle", "portrait", "natural"]
  },
  {
    id: "golden_hour",
    name: "Hora Dorada",
    category: "natural",
    description: "Luz cálida y suave del amanecer o atardecer, baja en horizonte",
    keywords: "golden hour lighting, warm soft sunrise sunset light, low horizon sunlight, long soft shadows, romantic warm tones",
    technical: "Shoot during first/last hour of sunlight, sun low on horizon creates warm diffused light",
    mood: ["romantic", "warm", "dreamy"],
    bestFor: ["outdoor", "romantic", "editorial"]
  },
  {
    id: "overcast_diffuse",
    name: "Día Nublado",
    category: "natural",
    description: "Luz difusa uniforme de cielo nublado, actúa como softbox gigante",
    keywords: "overcast diffuse lighting, cloudy day soft light, even illumination, sky as giant softbox, minimal shadows",
    technical: "Clouds act as natural diffuser, provides soft even light from above",
    mood: ["soft", "even", "neutral"],
    bestFor: ["portrait", "commercial", "fashion"]
  },
  {
    id: "direct_sun",
    name: "Sol Directo",
    category: "dramatic",
    description: "Luz solar dura sin modificar, alto contraste, sombras definidas",
    keywords: "direct hard sunlight, high contrast harsh shadows, defined edges, dramatic lighting, intense",
    technical: "Unmodified direct sunlight, creates strong shadows and high contrast",
    mood: ["harsh", "dramatic", "contrasty"],
    bestFor: ["dramatic", "fashion-edgy", "artistic"]
  },
  {
    id: "fill_flash",
    name: "Flash de Relleno",
    category: "mixed",
    description: "Flash sutil rellenando sombras sin dominar luz ambiente",
    keywords: "fill flash technique, subtle flash balancing ambient light, filling shadows, natural appearance, outdoor flash",
    technical: "Flash at lower power than ambient, balances exposure without overpowering natural light",
    mood: ["balanced", "natural", "controlled"],
    bestFor: ["outdoor", "event", "portrait"]
  },
  {
    id: "high_key",
    name: "High Key (Clave Alta)",
    category: "commercial",
    description: "Iluminación muy brillante, predominio de tonos claros, mínimas sombras",
    keywords: "high key lighting, very bright illumination, predominantly light tones, minimal shadows, white background, optimistic mood",
    technical: "Multiple lights creating bright even illumination, typically white or very light background",
    mood: ["bright", "optimistic", "clean"],
    bestFor: ["commercial", "beauty", "catalog"]
  },
  {
    id: "low_key",
    name: "Low Key (Clave Baja)",
    category: "dramatic",
    description: "Iluminación oscura, predominio de sombras, toques de luz selectivos",
    keywords: "low key lighting, dark moody illumination, predominantly shadows, selective light highlights, dramatic dark background",
    technical: "Single focused light source against dark background, controlled to create dramatic mood",
    mood: ["moody", "mysterious", "dramatic"],
    bestFor: ["artistic", "dramatic", "film noir"]
  },
  {
    id: "beauty_dish",
    name: "Beauty Dish",
    category: "beauty",
    description: "Luz concentrada con contraste medio, resalta detalles faciales",
    keywords: "beauty dish lighting, concentrated light medium contrast, highlights facial details, attractive catchlights in eyes, beauty photography",
    technical: "Beauty dish modifier creates semi-hard light with bright center, gradual fall-off",
    mood: ["polished", "detailed", "beauty"],
    bestFor: ["beauty", "fashion", "commercial"]
  },
  {
    id: "flat_frontal",
    name: "Iluminación Frontal Plana",
    category: "commercial",
    description: "Luz frontal directa, mínimas sombras, apariencia bidimensional",
    keywords: "flat frontal lighting, direct on-axis light, minimal shadows, two-dimensional appearance, symmetrical illumination",
    technical: "Light positioned on camera axis or ring light, eliminates most shadows",
    mood: ["flat", "symmetrical", "clean"],
    bestFor: ["passport", "catalog", "documentation"]
  },
  {
    id: "side_hard",
    name: "Lateral Dura",
    category: "dramatic",
    description: "Luz dura lateral sin difusor, textura y volumen pronunciados",
    keywords: "hard side lighting, undiffused lateral light, pronounced texture and volume, dramatic shadows, edgy fashion look",
    technical: "Hard light source at 90° to subject without diffusion modifier",
    mood: ["textured", "edgy", "dramatic"],
    bestFor: ["fashion-edgy", "artistic", "masculine"]
  },
  {
    id: "top_down",
    name: "Cenital (Desde Arriba)",
    category: "creative",
    description: "Luz directamente desde arriba, sombras en ojos y bajo nariz",
    keywords: "top-down lighting, overhead illumination, shadows in eye sockets and under nose, unusual dramatic effect",
    technical: "Light positioned directly above subject pointing down",
    mood: ["unusual", "dramatic", "creative"],
    bestFor: ["creative", "special-effect", "artistic"]
  },
  {
    id: "under_lighting",
    name: "Iluminación desde Abajo",
    category: "special",
    description: "Luz desde abajo, invierte sombras naturales, efecto inquietante",
    keywords: "under lighting, upward illumination, inverted natural shadows, eerie effect, theatrical horror",
    technical: "Light source below subject face pointing upward",
    mood: ["eerie", "theatrical", "unusual"],
    bestFor: ["horror", "theatrical", "special-effect"]
  },
  {
    id: "three_point",
    name: "Tres Puntos Clásico",
    category: "classic",
    description: "Key light + fill light + back/rim light, esquema completo balanceado",
    keywords: "classic three-point lighting, key light main illumination, fill light softens shadows, back light separates subject, balanced professional setup",
    technical: "Key light (main), fill light (opposite lower power), back/rim light (behind subject)",
    mood: ["professional", "balanced", "classic"],
    bestFor: ["video", "interview", "professional-portrait"]
  },
  {
    id: "colored_gels",
    name: "Luces de Colores (Geles)",
    category: "creative",
    description: "Uso de filtros de color en luces para efectos creativos o corrección",
    keywords: "colored gel lighting, creative color effects, CTO orange warming gel, CTB blue cooling gel, complementary color contrast",
    technical: "Color gels placed over lights to tint illumination for creative or corrective purposes",
    mood: ["creative", "artistic", "stylized"],
    bestFor: ["fashion", "editorial", "artistic"]
  },
  {
    id: "mixed_temps",
    name: "Temperaturas Mixtas",
    category: "creative",
    description: "Combinar luces cálidas y frías para contraste de color emocional",
    keywords: "mixed color temperature lighting, warm and cool light combination, complementary color contrast, emotional color tension",
    technical: "Intentionally mixing warm (tungsten/CTO) and cool (daylight/CTB) light sources",
    mood: ["contrasting", "emotional", "cinematic"],
    bestFor: ["cinematic", "editorial", "artistic"]
  }
];

// Función para obtener setup por categoría
export function getLightingByCategory(category) {
  return LIGHTING_SETUPS.filter(setup => setup.category === category);
}

// Función para obtener setup por mood
export function getLightingByMood(mood) {
  return LIGHTING_SETUPS.filter(setup => setup.mood.includes(mood));
}

// Función para obtener setup aleatorio
export function getRandomLighting(category = null) {
  let setups = LIGHTING_SETUPS;
  
  if (category) {
    setups = setups.filter(s => s.category === category);
  }
  
  return setups[Math.floor(Math.random() * setups.length)];
}

// Obtener todas las categorías
export function getAllLightingCategories() {
  const categories = new Set();
  LIGHTING_SETUPS.forEach(setup => categories.add(setup.category));
  return Array.from(categories);
}

// Obtener todos los moods
export function getAllLightingMoods() {
  const moods = new Set();
  LIGHTING_SETUPS.forEach(setup => setup.mood.forEach(m => moods.add(m)));
  return Array.from(moods);
}
