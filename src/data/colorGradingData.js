// colorGradingData.js - Filtros y corrección de color cinematográfica
// Basado en: Manual de Filtros Fotográficos y Cinematográficos

export const COLOR_GRADING_FILTERS = [
  {
    id: "natural_neutral",
    name: "Natural Neutro",
    category: "neutral",
    description: "Sin dominantes de color, balance de blancos preciso, tonos naturales",
    keywords: "natural neutral color grading, accurate white balance, no color cast, true-to-life tones, realistic colors",
    technical: "Neutral color temperature 5500K, accurate skin tones, minimal color grading",
    mood: ["natural", "realistic", "documentary"],
    bestFor: ["documentary", "corporate", "natural-portrait"]
  },
  {
    id: "warm_golden",
    name: "Cálido Dorado",
    category: "warm",
    description: "Tonos cálidos anaranjados y dorados, atmosfera acogedora",
    keywords: "warm golden color grade, orange amber tones, cozy atmosphere, sunset warmth, inviting feel",
    technical: "Color temperature 3200-4000K, lifted oranges and yellows in midtones, warm highlights",
    mood: ["warm", "cozy", "romantic"],
    bestFor: ["romantic", "lifestyle", "golden-hour"]
  },
  {
    id: "cool_blue",
    name: "Azul Frío",
    category: "cool",
    description: "Tonos fríos azulados, atmosfera melancólica o distante",
    keywords: "cool blue color grade, cyan teal tones, melancholic atmosphere, cold distant feel, blue hour mood",
    technical: "Color temperature 6500-8000K, lifted blues in shadows, desaturated warm tones",
    mood: ["cool", "melancholic", "distant"],
    bestFor: ["dramatic", "melancholic", "night-scenes"]
  },
  {
    id: "teal_orange",
    name: "Teal & Orange",
    category: "cinematic",
    description: "Contraste complementario teal en sombras, naranja en tonos piel",
    keywords: "teal and orange color grade, complementary color contrast, teal shadows orange skin tones, blockbuster look, cinematic separation",
    technical: "Cyan-teal pushed in shadows, orange-amber in midtones/highlights, high saturation contrast",
    mood: ["cinematic", "dramatic", "blockbuster"],
    bestFor: ["cinematic", "action", "commercial"]
  },
  {
    id: "vintage_film",
    name: "Film Vintage",
    category: "vintage",
    description: "Look de película analógica, grano visible, colores desaturados suaves",
    keywords: "vintage film look, analog grain texture, slightly desaturated soft colors, faded blacks lifted shadows, nostalgic feel",
    technical: "Lifted blacks with milky shadows, reduced contrast, film grain overlay, slight color shift",
    mood: ["nostalgic", "vintage", "retro"],
    bestFor: ["editorial", "fashion", "artistic"]
  },
  {
    id: "faded_matte",
    name: "Matte Desvanecido",
    category: "matte",
    description: "Negros levantados con aspecto lechoso, contraste reducido",
    keywords: "faded matte look, lifted blacks milky appearance, reduced contrast, soft pastel tones, dreamy aesthetic",
    technical: "Blacks lifted to grey (RGB 20-40), reduced contrast curve, desaturated",
    mood: ["dreamy", "soft", "ethereal"],
    bestFor: ["fashion", "beauty", "dreamy-portraits"]
  },
  {
    id: "high_contrast_punchy",
    name: "Alto Contraste Vibrante",
    category: "vibrant",
    description: "Contraste fuerte, colores saturados, negros profundos",
    keywords: "high contrast punchy grade, strong saturation, deep blacks pure whites, vibrant bold colors, dynamic range",
    technical: "S-curve contrast adjustment, saturation boost 15-25%, crushed blacks stretched highlights",
    mood: ["vibrant", "energetic", "bold"],
    bestFor: ["commercial", "fashion", "advertising"]
  },
  {
    id: "low_contrast_soft",
    name: "Bajo Contraste Suave",
    category: "soft",
    description: "Contraste suave, tonos pastel, atmosfera delicada",
    keywords: "low contrast soft grade, pastel tones, gentle transitions, delicate atmosphere, minimal shadows",
    technical: "Flattened contrast curve, reduced saturation, lifted shadows, soft highlights",
    mood: ["soft", "delicate", "gentle"],
    bestFor: ["beauty", "romantic", "lifestyle"]
  },
  {
    id: "black_white_classic",
    name: "Blanco y Negro Clásico",
    category: "monochrome",
    description: "Monocromo con contraste medio, enfoque en tonos y texturas",
    keywords: "classic black and white, monochrome medium contrast, tonal range emphasis, texture focus, timeless aesthetic",
    technical: "Desaturated with luminance adjustments, medium contrast, detail preservation",
    mood: ["timeless", "classic", "emotional"],
    bestFor: ["portrait", "artistic", "documentary"]
  },
  {
    id: "black_white_high_contrast",
    name: "Blanco y Negro Alto Contraste",
    category: "monochrome",
    description: "Monocromo dramático, negros profundos, blancos brillantes",
    keywords: "high contrast black and white, dramatic monochrome, deep blacks bright whites, bold tonal separation",
    technical: "Desaturated with strong S-curve, crushed blacks blown highlights for effect",
    mood: ["dramatic", "bold", "graphic"],
    bestFor: ["artistic", "dramatic", "graphic-portraits"]
  },
  {
    id: "sepia_warm",
    name: "Sepia Cálido",
    category: "vintage",
    description: "Tonos sepia marrones cálidos, look vintage nostálgico",
    keywords: "warm sepia tone, brown vintage color cast, nostalgic old photograph look, aged appearance",
    technical: "Desaturated with warm brown overlay in shadows/midtones, reduced contrast",
    mood: ["nostalgic", "vintage", "historical"],
    bestFor: ["vintage", "historical", "nostalgic-portraits"]
  },
  {
    id: "bleach_bypass",
    name: "Bleach Bypass",
    category: "cinematic",
    description: "Look desaturado con contraste alto, tonos plateados",
    keywords: "bleach bypass look, desaturated high contrast, silver tones, gritty cinematic feel, war film aesthetic",
    technical: "Partial desaturation with contrast boost, silver-grey color cast, enhanced grain",
    mood: ["gritty", "harsh", "cinematic"],
    bestFor: ["action", "gritty-drama", "war-films"]
  },
  {
    id: "cross_process",
    name: "Cross Process",
    category: "experimental",
    description: "Colores alterados no naturales, contraste inusual, look experimental",
    keywords: "cross process effect, altered unnatural colors, unusual contrast shifts, experimental film look, color inversions",
    technical: "Color channel manipulation, inverted curves in specific channels, high saturation shifts",
    mood: ["experimental", "surreal", "artistic"],
    bestFor: ["fashion", "experimental", "artistic"]
  },
  {
    id: "pro_mist",
    name: "Pro-Mist",
    category: "diffusion",
    description: "Difusión suave con halos en luces, look dreamycon contraste reducido",
    keywords: "pro-mist diffusion, soft halation around highlights, dreamy ethereal look, glowing lights, reduced sharpness",
    technical: "Reduced clarity and sharpness, bloom effect on highlights, lifted blacks",
    mood: ["dreamy", "soft", "ethereal"],
    bestFor: ["romantic", "beauty", "fashion"]
  },
  {
    id: "black_pro_mist",
    name: "Black Pro-Mist",
    category: "diffusion",
    description: "Difusión con contraste mantenido, halos sutiles, negros profundos",
    keywords: "black pro-mist effect, subtle halation preserved contrast, maintained blacks, gentle glow, cinematic softness",
    technical: "Selective diffusion on highlights with contrast preservation, black point maintained",
    mood: ["cinematic", "soft", "professional"],
    bestFor: ["cinematic", "commercial", "portraits"]
  },
  {
    id: "heavy_grain",
    name: "Grano Pesado",
    category: "texture",
    description: "Grano de película visible pronunciado, textura analógica",
    keywords: "heavy film grain, pronounced analog texture, visible grain structure, film stock aesthetic, textured appearance",
    technical: "Large grain overlay (ISO 1600+ equivalent), luminance and color noise added",
    mood: ["gritty", "analog", "textured"],
    bestFor: ["artistic", "gritty", "documentary"]
  },
  {
    id: "fine_grain",
    name: "Grano Fino",
    category: "texture",
    description: "Grano sutil que añade textura sin distraer, look orgánico",
    keywords: "fine subtle grain, organic texture without distraction, film-like quality, refined appearance",
    technical: "Small grain overlay (ISO 400-800 equivalent), subtle luminance noise",
    mood: ["organic", "refined", "film-like"],
    bestFor: ["portrait", "fashion", "editorial"]
  },
  {
    id: "vignette_dark",
    name: "Viñeta Oscura",
    category: "vignette",
    description: "Bordes oscurecidos que dirigen atención al centro",
    keywords: "dark vignette, darkened edges, center focus attention, dramatic framing, spotlight effect",
    technical: "Radial gradient darkening from edges, feathered transition, 20-40% opacity",
    mood: ["focused", "dramatic", "intimate"],
    bestFor: ["portrait", "dramatic", "intimate"]
  },
  {
    id: "vignette_light",
    name: "Viñeta Clara",
    category: "vignette",
    description: "Bordes aclarados sutilmente, look aireado y suave",
    keywords: "light vignette, brightened subtle edges, airy soft look, open feel, gentle glow",
    technical: "Radial gradient brightening from edges, subtle feathering, 10-20% opacity",
    mood: ["airy", "soft", "open"],
    bestFor: ["beauty", "lifestyle", "bright-portraits"]
  },
  {
    id: "halation_glow",
    name: "Halation Glow",
    category: "special",
    description: "Resplandor alrededor de luces altas, efecto de película vintage",
    keywords: "halation glow effect, bloom around bright lights, vintage film light bleeding, glowing highlights, soft halo",
    technical: "Bloom effect on highlights >90% luminance, red channel bleed, vintage film emulation",
    mood: ["nostalgic", "glowing", "romantic"],
    bestFor: ["vintage", "romantic", "music-videos"]
  },
  {
    id: "split_tone_warm_cool",
    name: "Split Tone Cálido/Frío",
    category: "split-tone",
    description: "Tonos cálidos en luces, tonos fríos en sombras, separación visual",
    keywords: "split toning warm highlights cool shadows, visual separation, complementary color split, dimensional look",
    technical: "Warm (orange-yellow) applied to highlights, cool (blue-cyan) applied to shadows",
    mood: ["dimensional", "cinematic", "separated"],
    bestFor: ["cinematic", "editorial", "portraits"]
  },
  {
    id: "duotone",
    name: "Duotono",
    category: "monochrome",
    description: "Dos colores dominantes creando esquema cromático limitado",
    keywords: "duotone color scheme, two dominant colors, limited chromatic palette, graphic aesthetic, bold color statement",
    technical: "Two-color gradient map applied across tonal range, saturated color palette",
    mood: ["graphic", "bold", "stylized"],
    bestFor: ["fashion", "artistic", "posters"]
  },
  {
    id: "infrared_simulation",
    name: "Simulación Infrarroja",
    category: "special",
    description: "Look de fotografía infrarroja, tonos invertidos, cielos oscuros",
    keywords: "infrared simulation, inverted tones, dark skies white foliage, surreal landscape effect, IR aesthetic",
    technical: "Channel swap (R-IR), vegetation brightened, sky darkened, surreal color mapping",
    mood: ["surreal", "otherworldly", "artistic"],
    bestFor: ["landscape", "artistic", "experimental"]
  },
  {
    id: "kodachrome_emulation",
    name: "Emulación Kodachrome",
    category: "film-emulation",
    description: "Colores saturados característicos de Kodachrome, rojos ricos, azules profundos",
    keywords: "Kodachrome film emulation, saturated rich colors, deep blues strong reds, 1970s slide film look, vibrant film stock",
    technical: "Boosted saturation especially reds and blues, slight warm cast, medium contrast",
    mood: ["vibrant", "nostalgic", "classic-film"],
    bestFor: ["travel", "landscape", "vintage-editorial"]
  },
  {
    id: "portra_emulation",
    name: "Emulación Portra",
    category: "film-emulation",
    description: "Tonos de piel suaves de Kodak Portra, colores pastel sutiles",
    keywords: "Kodak Portra emulation, soft skin tones, subtle pastel colors, gentle contrast, portrait film stock",
    technical: "Reduced contrast with lifted shadows, accurate skin tone rendering, subtle color",
    mood: ["soft", "natural", "portrait-focused"],
    bestFor: ["portrait", "wedding", "lifestyle"]
  },
  {
    id: "fuji_velvia",
    name: "Fuji Velvia",
    category: "film-emulation",
    description: "Saturación extrema estilo Velvia, verdes y azules intensos",
    keywords: "Fuji Velvia emulation, extreme saturation, intense greens and blues, landscape slide film, punchy colors",
    technical: "High saturation boost especially greens/blues, high contrast, deep blacks",
    mood: ["saturated", "punchy", "vibrant-landscape"],
    bestFor: ["landscape", "nature", "travel"]
  }
];

// Función para obtener filtros por categoría
export function getFiltersByCategory(category) {
  return COLOR_GRADING_FILTERS.filter(filter => filter.category === category);
}

// Función para obtener filtros por mood
export function getFiltersByMood(mood) {
  return COLOR_GRADING_FILTERS.filter(filter => filter.mood.includes(mood));
}

// Función para obtener filtro aleatorio
export function getRandomFilter(category = null) {
  let filters = COLOR_GRADING_FILTERS;
  
  if (category) {
    filters = filters.filter(f => f.category === category);
  }
  
  return filters[Math.floor(Math.random() * filters.length)];
}

// Obtener todas las categorías
export function getAllFilterCategories() {
  const categories = new Set();
  COLOR_GRADING_FILTERS.forEach(filter => categories.add(filter.category));
  return Array.from(categories);
}

// Obtener todos los moods
export function getAllFilterMoods() {
  const moods = new Set();
  COLOR_GRADING_FILTERS.forEach(filter => filter.mood.forEach(m => moods.add(m)));
  return Array.from(moods);
}
