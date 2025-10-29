/**
 * PRESETS DE FOTOGRAFÍA PROFESIONAL
 * Datos técnicos completos para generación de prompts
 * Organizado por: Plan (FREE/PRO) y Categoría
 */

export const PRESET_PLANS = {
  FREE: 'free',
  PRO: 'pro',
  PREMIUM: 'premium'
};

export const PRESET_CATEGORIES = {
  CINEMATIC: 'Cinemático y Dramático',
  CREATIVE: 'Creativo y Experimental',
  LIFESTYLE: 'Lifestyle y Editorial',
  SPORT: 'Deporte y Acción',
  VINTAGE: 'Vintage y Clásico',
  BEAUTY: 'Beauty',
  CONTEXTUAL: 'Ambientales y Contextuales',
  FASHION: 'Retratos de Moda',
  MAGAZINE: 'Retratos de Revista (Vogue)',
  FANTASY: 'Retratos de Fantasía',
  SOCIAL: 'Redes Sociales'
};

export const presetsData = [
  // ==========================================
  // 🆓 PRESETS PLAN FREE (5)
  // ==========================================
  {
    id: 'preset-free-01',
    shortName: 'Corporativo Ambiental',
    fullName: 'Retrato corporativo ambiental',
    category: PRESET_CATEGORIES.LIFESTYLE,
    plan: PRESET_PLANS.FREE,
    description: 'Headshot en oficina o entorno de trabajo',
    technical: {
      lens: '85 mm f/2.2',
      lighting: 'Luz principal suave frontal; reflectores',
      wb: '5200 K',
      post: 'Claridad baja; piel natural; fondo desenfocado'
    },
    keywords: ['corporativo', 'oficina', 'profesional', 'linkedin', 'headshot']
  },
  {
    id: 'preset-free-02',
    shortName: 'Hora Dorada',
    fullName: 'Lifestyle en hora dorada',
    category: PRESET_CATEGORIES.LIFESTYLE,
    plan: PRESET_PLANS.FREE,
    description: 'Retrato cálido al atardecer',
    technical: {
      lens: '50 mm f/1.8',
      lighting: 'Contraluz + reflector dorado',
      wb: '6000–6500 K',
      post: 'Split-toning cálido; realce de altas luces'
    },
    keywords: ['atardecer', 'dorado', 'cálido', 'exterior', 'natural']
  },
  {
    id: 'preset-free-03',
    shortName: 'Rembrandt Clásico',
    fullName: 'Retrato clásico Rembrandt',
    category: PRESET_CATEGORIES.VINTAGE,
    plan: PRESET_PLANS.FREE,
    description: 'Retrato tradicional con carácter',
    technical: {
      lens: '85 mm f/1.4',
      lighting: 'Luz principal 45° elevada (Rembrandt); fill −1 EV',
      wb: '5400 K',
      post: 'Curva en S; textura suave; viñeta sutil'
    },
    keywords: ['clásico', 'rembrandt', 'tradicional', 'estudio', 'dramático']
  },
  {
    id: 'preset-free-04',
    shortName: 'Fondo Minimalista',
    fullName: 'Fondo minimalista',
    category: PRESET_CATEGORIES.SOCIAL,
    plan: PRESET_PLANS.FREE,
    description: 'Headshot para perfiles profesionales',
    technical: {
      lens: '85 mm f/2',
      lighting: 'Luz suave frontal; fondo neutro',
      wb: '5200 K',
      post: 'Piel uniforme; saturación natural; claridad 0'
    },
    keywords: ['minimalista', 'perfil', 'profesional', 'simple', 'limpio']
  },
  {
    id: 'preset-free-05',
    shortName: 'Cinematográfico Suave',
    fullName: 'Suave cinematográfico (difusión)',
    category: PRESET_CATEGORIES.CINEMATIC,
    plan: PRESET_PLANS.FREE,
    description: 'Retrato etéreo y delicado',
    technical: {
      lens: '85 mm f/1.4 (FF)',
      lighting: 'Luz principal suave 45° + reflector; filtro Pro-Mist',
      wb: '5200 K',
      post: 'Curva S ligera; claridad −10; grano fino'
    },
    notes: 'El filtro de difusión suaviza altas luces y contraste. Un lente luminoso de 85 mm crea fondo desenfocado agradable.',
    keywords: ['cinematográfico', 'suave', 'etéreo', 'difusión', 'cine']
  },

  // ==========================================
  // 💎 PRESETS PRO/PREMIUM (30)
  // ==========================================

  // --- CINEMÁTICO Y DRAMÁTICO (4) ---
  {
    id: 'preset-pro-01',
    shortName: 'Silueta Contraluz',
    fullName: 'Silueta al contraluz',
    category: PRESET_CATEGORIES.CINEMATIC,
    plan: PRESET_PLANS.PRO,
    description: 'Silueta dramática al atardecer',
    technical: {
      lens: '35 mm f/2',
      lighting: 'Sol de fondo; exposímetro para siluetar',
      wb: '6000 K',
      post: 'Contraste alto; saturación +10'
    },
    notes: 'Aprovecha la hora dorada para lograr luz cálida y aumenta el contraste en la edición.',
    keywords: ['silueta', 'contraluz', 'atardecer', 'dramático', 'backlight']
  },
  {
    id: 'preset-pro-02',
    shortName: 'Calle B&N',
    fullName: 'Calle en blanco y negro de alto contraste',
    category: PRESET_CATEGORIES.CINEMATIC,
    plan: PRESET_PLANS.PRO,
    description: 'Retrato callejero dramático B&N',
    technical: {
      lens: '35 mm f/1.8',
      lighting: 'Luz lateral dura; sombras marcadas',
      wb: 'Monocromo',
      post: 'Curva en S fuerte; grano tipo 400 ISO'
    },
    notes: 'La luz lateral dura añade dramatismo. La curva en S aumenta el contraste.',
    keywords: ['blanco y negro', 'street', 'urbano', 'contraste', 'monocromo']
  },
  {
    id: 'preset-pro-03',
    shortName: 'Playa Silueta',
    fullName: 'Silueta en playa al atardecer',
    category: PRESET_CATEGORIES.CINEMATIC,
    plan: PRESET_PLANS.PRO,
    description: 'Silueta romántica en la orilla',
    technical: {
      lens: '35 mm f/2.8',
      lighting: 'Sol en horizonte detrás; reflejo en agua',
      wb: '6200 K',
      post: 'Saturación +20; contraste medio; sombras profundas'
    },
    notes: 'El agua refleja la luz del sol creando destellos. Se expone para el cielo para lograr la silueta.',
    keywords: ['playa', 'silueta', 'atardecer', 'agua', 'romántico']
  },
  {
    id: 'preset-pro-04',
    shortName: 'Monocromo Bajo',
    fullName: 'Retrato monocromo de bajo perfil',
    category: PRESET_CATEGORIES.CINEMATIC,
    plan: PRESET_PLANS.PRO,
    description: 'Retrato dramático low-key',
    technical: {
      lens: '50 mm f/1.8',
      lighting: 'Luz dura lateral; fondo negro',
      wb: 'Monocromo',
      post: 'Contraste extremo; grano grueso'
    },
    notes: 'La luz dura lateral resalta la textura.',
    keywords: ['low-key', 'monocromo', 'dramático', 'negro', 'contraste']
  },

  // --- CREATIVO Y EXPERIMENTAL (3) ---
  {
    id: 'preset-pro-05',
    shortName: 'Urbano Neón',
    fullName: 'Retrato nocturno urbano (neón)',
    category: PRESET_CATEGORIES.CREATIVE,
    plan: PRESET_PLANS.PRO,
    description: 'Retrato con luces de neón',
    technical: {
      lens: '50 mm f/1.4',
      lighting: 'Luces de neón; contraluz para halo',
      wb: '4200 K',
      post: 'Balance de blancos hacia magenta; reducción de contraste'
    },
    keywords: ['neón', 'urbano', 'nocturno', 'ciudad', 'futurista']
  },
  {
    id: 'preset-pro-06',
    shortName: 'Geles Color',
    fullName: 'Retrato con geles de color',
    category: PRESET_CATEGORIES.CREATIVE,
    plan: PRESET_PLANS.PRO,
    description: 'Retrato con luces de colores',
    technical: {
      lens: '85 mm f/2',
      lighting: 'Gel rojo frontal; gel azul de recorte; niebla',
      wb: '5000 K',
      post: 'Contraste medio; glow; viñeta'
    },
    keywords: ['geles', 'color', 'experimental', 'creativo', 'estudio']
  },
  {
    id: 'preset-pro-07',
    shortName: 'Cyberpunk Neón',
    fullName: 'Retrato cyberpunk (neón y humo)',
    category: PRESET_CATEGORIES.CREATIVE,
    plan: PRESET_PLANS.PRO,
    description: 'Retrato futurista con colores saturados',
    technical: {
      lens: '50 mm f/1.4',
      lighting: 'Geles magenta y azul; humo',
      wb: '4600 K',
      post: 'Contraste alto; saturación +30; viñeta'
    },
    keywords: ['cyberpunk', 'futurista', 'neón', 'humo', 'sci-fi']
  },

  // --- LIFESTYLE Y EDITORIAL (2) ---
  {
    id: 'preset-pro-08',
    shortName: 'Lluvioso Callejero',
    fullName: 'Retrato lluvioso callejero',
    category: PRESET_CATEGORIES.LIFESTYLE,
    plan: PRESET_PLANS.PRO,
    description: 'Retrato atmosférico bajo lluvia',
    technical: {
      lens: '50 mm f/1.8',
      lighting: 'Luz natural difusa; paraguas translúcido',
      wb: '5500 K',
      post: 'Claridad +15; grano medio; tonos fríos'
    },
    keywords: ['lluvia', 'callejero', 'atmosférico', 'mojado', 'urbano']
  },
  {
    id: 'preset-pro-09',
    shortName: 'Invernal Nieve',
    fullName: 'Retrato invernal con nieve',
    category: PRESET_CATEGORIES.LIFESTYLE,
    plan: PRESET_PLANS.PRO,
    description: 'Retrato en exteriores con nieve',
    technical: {
      lens: '85 mm f/1.8',
      lighting: 'Luz difusa de cielo nublado; reflector',
      wb: '6000 K',
      post: 'WB frío; saturación baja; claridad +10'
    },
    keywords: ['invierno', 'nieve', 'frío', 'exterior', 'blanco']
  },

  // --- DEPORTE Y ACCIÓN (2) ---
  {
    id: 'preset-pro-10',
    shortName: 'Deportivo Congelado',
    fullName: 'Retrato deportivo congelado',
    category: PRESET_CATEGORIES.SPORT,
    plan: PRESET_PLANS.PRO,
    description: 'Retrato de atleta con acción congelada',
    technical: {
      lens: '70–200 mm f/2.8',
      lighting: 'Luz dura lateral; flash HSS',
      wb: '5400 K',
      post: 'Contraste alto; textura marcada; saturación moderada'
    },
    keywords: ['deporte', 'acción', 'atleta', 'movimiento', 'congelado']
  },
  {
    id: 'preset-pro-11',
    shortName: 'Mascota Acción',
    fullName: 'Mascota en acción (running)',
    category: PRESET_CATEGORIES.SPORT,
    plan: PRESET_PLANS.PRO,
    description: 'Captar a un perro/caballo corriendo',
    technical: {
      lens: '70–200 mm f/2.8',
      lighting: 'Luz de tarde; flash HSS',
      wb: '5400 K',
      post: 'Contraste alto; claridad +20; saturación natural'
    },
    notes: 'Este preset se mantiene aquí porque también aplica a escenas deportivas con mascotas o personas.',
    keywords: ['mascota', 'perro', 'acción', 'corriendo', 'animal']
  },

  // --- VINTAGE Y CLÁSICO (1) ---
  {
    id: 'preset-pro-12',
    shortName: 'Vintage Color',
    fullName: 'Retrato vintage con filtro de color',
    category: PRESET_CATEGORIES.VINTAGE,
    plan: PRESET_PLANS.PRO,
    description: 'Retrato inspirado en cine clásico',
    technical: {
      lens: '50 mm f/1.8',
      lighting: 'Luz continua cálida; difusor',
      wb: '4800 K',
      post: 'Curva S suave; tonos sepia; grano fino'
    },
    keywords: ['vintage', 'retro', 'sepia', 'clásico', 'antiguo']
  },

  // --- BEAUTY (2) ---
  {
    id: 'preset-pro-13',
    shortName: 'Beauty Pastel',
    fullName: 'Beauty pastel de alto key',
    category: PRESET_CATEGORIES.BEAUTY,
    plan: PRESET_PLANS.PRO,
    description: 'Retrato beauty con tonos pasteles',
    technical: {
      lens: '100 mm macro o 85 mm f/2',
      lighting: 'Beauty dish centrado; luz de relleno suave',
      wb: '5000 K',
      post: 'Claridad −15; tonos pastel; piel uniforme'
    },
    keywords: ['beauty', 'pastel', 'suave', 'high-key', 'maquillaje']
  },
  {
    id: 'preset-pro-14',
    shortName: 'Beauty Clamshell',
    fullName: 'Retrato beauty con esquema clamshell',
    category: PRESET_CATEGORIES.BEAUTY,
    plan: PRESET_PLANS.PRO,
    description: 'Beauty con iluminación clamshell',
    technical: {
      lens: '85 mm f/2',
      lighting: 'Luz principal cenital + reflector',
      wb: '5200 K',
      post: 'Claridad negativa; piel uniforme; high key'
    },
    keywords: ['beauty', 'clamshell', 'iluminación', 'estudio', 'glamour']
  },

  // --- AMBIENTALES Y CONTEXTUALES (3) ---
  {
    id: 'preset-pro-15',
    shortName: 'Reflejos Ventana',
    fullName: 'Retrato con reflejos de ventana',
    category: PRESET_CATEGORIES.CONTEXTUAL,
    plan: PRESET_PLANS.PRO,
    description: 'Retrato íntimo con reflejo',
    technical: {
      lens: '50 mm f/1.4',
      lighting: 'Luz natural de ventana; polarizador CPL',
      wb: '5400 K',
      post: 'Balance de blancos ajustado; saturación natural; contraste moderado'
    },
    keywords: ['ventana', 'reflejos', 'natural', 'íntimo', 'interior']
  },
  {
    id: 'preset-pro-16',
    shortName: 'Músico Ambiental',
    fullName: 'Retrato de músico ambiental',
    category: PRESET_CATEGORIES.CONTEXTUAL,
    plan: PRESET_PLANS.PRO,
    description: 'Retrato de músico con instrumento',
    technical: {
      lens: '35 mm f/1.8',
      lighting: 'Luz lateral suave; ambiente',
      wb: '5300 K',
      post: 'Curva suave; saturación moderada; grano fino'
    },
    keywords: ['músico', 'instrumento', 'ambiental', 'artista', 'contexto']
  },
  {
    id: 'preset-pro-17',
    shortName: 'Artesano Taller',
    fullName: 'Retrato artesanal en taller',
    category: PRESET_CATEGORIES.CONTEXTUAL,
    plan: PRESET_PLANS.PRO,
    description: 'Retrato de chef/artesano en su espacio',
    technical: {
      lens: '35 mm f/2',
      lighting: 'Luz ambiental con relleno',
      wb: '5200 K',
      post: 'Contraste suave; colores cálidos; claridad +5'
    },
    keywords: ['artesano', 'chef', 'taller', 'trabajo', 'contexto']
  },

  // --- RETRATOS DE MODA (3) ---
  {
    id: 'preset-pro-18',
    shortName: 'Moda Contraste',
    fullName: 'Fashion high contrast (hard light)',
    category: PRESET_CATEGORIES.FASHION,
    plan: PRESET_PLANS.PRO,
    description: 'Moda con sombras marcadas',
    technical: {
      lens: '70–135 mm f/4',
      lighting: 'Luz dura 45°; banderas',
      wb: '5400 K',
      post: 'Contraste alto; split-toning frío'
    },
    notes: 'Inspirado en editoriales de moda con luces duras que realzan la textura y forma.',
    keywords: ['moda', 'fashion', 'contraste', 'editorial', 'duro']
  },
  {
    id: 'preset-pro-19',
    shortName: 'Estudio Minimalista',
    fullName: 'Minimalist studio',
    category: PRESET_CATEGORIES.FASHION,
    plan: PRESET_PLANS.PRO,
    description: 'Moda con fondo minimalista',
    technical: {
      lens: '85 mm f/2.8',
      lighting: 'Luz suave difusa; fondo gris',
      wb: '5200 K',
      post: 'Claridad +10; saturación natural; tono neutro'
    },
    keywords: ['minimalista', 'estudio', 'moda', 'simple', 'limpio']
  },
  {
    id: 'preset-pro-20',
    shortName: 'Editorial Glam',
    fullName: 'Editorial glam fashion',
    category: PRESET_CATEGORIES.FASHION,
    plan: PRESET_PLANS.PRO,
    description: 'Moda editorial con glamour',
    technical: {
      lens: '50 mm f/1.4',
      lighting: 'Luz lateral con gel; reflejos',
      wb: '5000 K',
      post: 'Tonificación de color; viñeta; grano fino'
    },
    keywords: ['editorial', 'glamour', 'moda', 'elegante', 'revista']
  },

  // --- RETRATOS DE REVISTA (VOGUE) (3) ---
  {
    id: 'preset-pro-21',
    shortName: 'Vogue Glamour',
    fullName: 'Portada Vogue glamour',
    category: PRESET_CATEGORIES.MAGAZINE,
    plan: PRESET_PLANS.PREMIUM,
    description: 'Retrato glamouroso de portada',
    technical: {
      lens: '100 mm macro o 85 mm f/1.8',
      lighting: 'Beauty dish frontal; reflector',
      wb: '5300 K',
      post: 'Piel suave; saturación baja; viñeta sutil'
    },
    keywords: ['vogue', 'portada', 'glamour', 'revista', 'elegante']
  },
  {
    id: 'preset-pro-22',
    shortName: 'Revista Lujo',
    fullName: 'Editorial de revista de lujo',
    category: PRESET_CATEGORIES.MAGAZINE,
    plan: PRESET_PLANS.PREMIUM,
    description: 'Retrato elegante con ambiente lujoso',
    technical: {
      lens: '50 mm f/1.4',
      lighting: 'Luz Rembrandt suavizada; fondo liso',
      wb: '5400 K',
      post: 'Contraste medio; color natural; textura elegante'
    },
    keywords: ['revista', 'lujo', 'elegante', 'editorial', 'sofisticado']
  },
  {
    id: 'preset-pro-23',
    shortName: 'Moda B&N',
    fullName: 'Moda en blanco y negro',
    category: PRESET_CATEGORIES.MAGAZINE,
    plan: PRESET_PLANS.PREMIUM,
    description: 'Fotografía de moda en B&N',
    technical: {
      lens: '85 mm f/2',
      lighting: 'Luz dura lateral',
      wb: 'Monocromo',
      post: 'B&N clásico; grano fino; contraste controlado'
    },
    keywords: ['moda', 'blanco y negro', 'fashion', 'monocromo', 'clásico']
  },

  // --- RETRATOS DE FANTASÍA (4) ---
  {
    id: 'preset-pro-24',
    shortName: 'Bosque Encantado',
    fullName: 'Bosque encantado',
    category: PRESET_CATEGORIES.FANTASY,
    plan: PRESET_PLANS.PREMIUM,
    description: 'Retrato mágico en un bosque',
    technical: {
      lens: '35 mm f/1.8',
      lighting: 'Luz filtrada entre árboles; niebla',
      wb: '5500 K',
      post: 'Tonos verdes y violeta; viñeta; brillo suave'
    },
    notes: 'Usa niebla artificial para acentuar la atmósfera mágica.',
    keywords: ['bosque', 'fantasía', 'mágico', 'naturaleza', 'encantado']
  },
  {
    id: 'preset-pro-25',
    shortName: 'Hada Nocturna',
    fullName: 'Hada nocturna',
    category: PRESET_CATEGORIES.FANTASY,
    plan: PRESET_PLANS.PREMIUM,
    description: 'Retrato de fantasía con look de hada',
    technical: {
      lens: '50 mm f/1.4',
      lighting: 'Luces LED azules; glitter',
      wb: '4800 K',
      post: 'Glow difuso; destellos de estrella; desaturación parcial'
    },
    keywords: ['hada', 'fantasía', 'nocturno', 'mágico', 'azul']
  },
  {
    id: 'preset-pro-26',
    shortName: 'Sirena Urbana',
    fullName: 'Sirena urbana',
    category: PRESET_CATEGORIES.FANTASY,
    plan: PRESET_PLANS.PREMIUM,
    description: 'Retrato inspirado en sirenas urbanas',
    technical: {
      lens: '35 mm f/2',
      lighting: 'Geles verde y azul; reflejos en charco',
      wb: '5000 K',
      post: 'Saturación fría; contraste suave; texturas líquidas'
    },
    keywords: ['sirena', 'urbano', 'fantasía', 'agua', 'azul']
  },
  {
    id: 'preset-pro-27',
    shortName: 'Steampunk',
    fullName: 'Steampunk retrato',
    category: PRESET_CATEGORIES.FANTASY,
    plan: PRESET_PLANS.PREMIUM,
    description: 'Retrato con estética steampunk',
    technical: {
      lens: '85 mm f/2',
      lighting: 'Luz dura direccional; accesorios metálicos',
      wb: '5200 K',
      post: 'Tono sepia; textura metálica; grano leve'
    },
    keywords: ['steampunk', 'vintage', 'metálico', 'retro-futurista', 'industrial']
  },

  // --- REDES SOCIALES (3) ---
  {
    id: 'preset-pro-28',
    shortName: 'Selfie Glow',
    fullName: 'Selfie glow (ring light)',
    category: PRESET_CATEGORIES.SOCIAL,
    plan: PRESET_PLANS.PRO,
    description: 'Retrato para selfie con luz favorecedora',
    technical: {
      lens: '35 mm (smartphone)',
      lighting: 'Aro de luz frontal',
      wb: '5000 K',
      post: 'Claridad −5; tono cálido; piel suave'
    },
    keywords: ['selfie', 'ring light', 'redes sociales', 'instagram', 'tiktok']
  },
  {
    id: 'preset-pro-29',
    shortName: 'Street Style',
    fullName: 'Street style influencer',
    category: PRESET_CATEGORIES.SOCIAL,
    plan: PRESET_PLANS.PRO,
    description: 'Retrato urbano para influencers',
    technical: {
      lens: '50 mm f/2',
      lighting: 'Luz natural; fondo de ciudad',
      wb: '5300 K',
      post: 'Saturación +10; contraste moderado; look moderno'
    },
    keywords: ['street style', 'influencer', 'urbano', 'casual', 'moderno']
  },
  {
    id: 'preset-pro-30',
    shortName: 'Selfie Neón',
    fullName: 'Selfie con neón',
    category: PRESET_CATEGORIES.SOCIAL,
    plan: PRESET_PLANS.PRO,
    description: 'Retrato juvenil con luces neón',
    technical: {
      lens: '35 mm f/1.8',
      lighting: 'Neones de fondo; contraluz',
      wb: '4600 K',
      post: 'Tonos vibrantes; contraste medio; grano mínimo'
    },
    keywords: ['selfie', 'neón', 'juvenil', 'urbano', 'nocturno']
  }
];

// ==========================================
// FUNCIONES AUXILIARES
// ==========================================

/**
 * Obtener presets filtrados por plan
 */
export const getPresetsByPlan = (plan) => {
  return presetsData.filter(preset => preset.plan === plan);
};

/**
 * Obtener presets FREE
 */
export const getFreePresets = () => {
  return getPresetsByPlan(PRESET_PLANS.FREE);
};

/**
 * Obtener presets PRO/PREMIUM
 */
export const getProPresets = () => {
  return presetsData.filter(preset => 
    preset.plan === PRESET_PLANS.PRO || preset.plan === PRESET_PLANS.PREMIUM
  );
};

/**
 * Obtener presets por categoría
 */
export const getPresetsByCategory = (category) => {
  return presetsData.filter(preset => preset.category === category);
};

/**
 * Buscar preset por ID
 */
export const getPresetById = (id) => {
  return presetsData.find(preset => preset.id === id);
};

/**
 * Buscar presets por keywords
 */
export const searchPresets = (query) => {
  const lowerQuery = query.toLowerCase();
  return presetsData.filter(preset => 
    preset.shortName.toLowerCase().includes(lowerQuery) ||
    preset.fullName.toLowerCase().includes(lowerQuery) ||
    preset.description.toLowerCase().includes(lowerQuery) ||
    preset.keywords.some(keyword => keyword.includes(lowerQuery))
  );
};

/**
 * Obtener todas las categorías únicas
 */
export const getAllCategories = () => {
  return Object.values(PRESET_CATEGORIES);
};

export default presetsData;
