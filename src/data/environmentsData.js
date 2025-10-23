// 🏞️ ENTORNOS Y LOCACIONES
// 40+ entornos organizados en 5 categorías principales

export const ENVIRONMENTS = {
  // ========================================
  // CATEGORÍA: ESTUDIO (Studio)
  // ========================================
  studio_gray: {
    id: "studio_gray",
    category: "studio",
    name: "Estudio Fondo Gris Neutro",
    description: "Clásico, versátil, perfecto para iluminación controlada y retratos profesionales",
    prompt: "Professional photography studio with seamless gray backdrop, neutral 18% gray background, controlled studio environment, clean minimal atmosphere",
    lighting: "Three-point studio lighting setup, soft diffused key light, balanced fill, subtle rim separation",
    technical: "Studio strobes, softbox modifiers, even illumination at 5600K",
  },
  studio_black_lowkey: {
    id: "studio_black_lowkey",
    category: "studio",
    name: "Estudio Fondo Negro Low Key",
    description: "Ideal para retratos dramáticos, tipo Rembrandt o cinematográficos",
    prompt: "Dark photography studio with seamless black backdrop, dramatic low-key lighting atmosphere, deep shadows, high contrast environment",
    lighting: "Single directional key light, Rembrandt or split lighting pattern, minimal fill, dramatic shadows",
    technical: "Hard light source at 45°, 8:1 contrast ratio, 3200-4500K warm key light",
  },
  studio_white_highkey: {
    id: "studio_white_highkey",
    category: "studio",
    name: "Estudio Fondo Blanco High Key",
    description: "Luminoso, limpio, usado en moda o publicidad",
    prompt: "Bright photography studio with seamless white infinity backdrop, high-key lighting, pure white background, clean commercial atmosphere",
    lighting: "Overexposed background lights, soft wraparound lighting, minimal shadows, ethereal bright mood",
    technical: "Multiple light sources, background at +3EV, soft fill creating almost shadowless look at 5600K",
  },

  // ========================================
  // CATEGORÍA: URBANO (Urban)
  // ========================================
  window_natural_light: {
    id: "window_natural_light",
    category: "urban",
    name: "Ventanal con Luz Natural Suave",
    description: "Retratos íntimos, luz difusa y natural; gran opción lifestyle",
    prompt: "Indoor space with large window as natural light source, soft diffused daylight streaming in, intimate lifestyle atmosphere, minimal interior",
    lighting: "Natural window light as single source, soft directional illumination, gentle falloff, organic shadows",
    technical: "North-facing window preferred, diffused daylight at 5500-6500K, natural soft quality",
  },
  cement_wall: {
    id: "cement_wall",
    category: "urban",
    name: "Pared de Cemento o Textura Industrial",
    description: "Estilo urbano, moderno y minimalista",
    prompt: "Raw concrete wall with visible texture, industrial urban setting, modern minimalist aesthetic, rough surface details",
    lighting: "Hard directional light creating texture emphasis, side or top lighting, defined shadows on texture",
    technical: "Single hard light source, 4500-5000K neutral, moderate contrast highlighting texture",
  },
  cobblestone_street: {
    id: "cobblestone_street",
    category: "urban",
    name: "Calle Empedrada o Casco Antiguo",
    description: "Look clásico con fondo con historia y textura",
    prompt: "Historic cobblestone street in old town district, classic European architecture, aged stone pavement, traditional urban setting with character",
    lighting: "Natural ambient daylight, soft overcast or golden hour, even illumination with gentle shadows",
    technical: "Soft natural light at 5000-6000K, diffused quality, low contrast ambient",
  },
  neon_street_night: {
    id: "neon_street_night",
    category: "urban",
    name: "Calle con Neones de Noche",
    description: "Atmósfera cinematográfica tipo Blade Runner o cyberpunk",
    prompt: "Night city street illuminated by vibrant neon signs, colorful artificial lights reflecting off surfaces, urban nightlife atmosphere, light fog or mist",
    lighting: "Mixed color temperature neon lights (magenta, cyan, orange), practical neon sources, colored reflections",
    technical: "Multiple colored light sources at 2500-7000K, high saturation, mixed color temperatures creating mood",
  },
  rooftop_urban: {
    id: "rooftop_urban",
    category: "urban",
    name: "Azotea Urbana con Horizonte",
    description: "Sensación de libertad y contraste de ciudad",
    prompt: "Urban rooftop location with city skyline backdrop, elevated perspective above street level, metropolitan horizon, open sky visible",
    lighting: "Natural daylight (golden hour or blue hour preferred), city ambient glow at night, open sky fill",
    technical: "Soft directional natural light at sunset/sunrise (3000-4000K) or cool blue hour (7000-9000K)",
  },

  // ========================================
  // CATEGORÍA: NATURAL (Nature)
  // ========================================
  golden_wheat_field: {
    id: "golden_wheat_field",
    category: "natural",
    name: "Campo de Trigo al Atardecer (Golden Hour)",
    description: "Cálido, nostálgico y muy favorecedor",
    prompt: "Golden wheat field at sunset during golden hour, warm amber natural light, rural agricultural landscape, soft glowing atmosphere",
    lighting: "Natural golden hour sunlight, warm directional light at low angle, soft quality with warm color cast",
    technical: "Direct sunlight at 2800-3500K, backlighting or side lighting, natural warm glow",
  },
  foggy_forest: {
    id: "foggy_forest",
    category: "natural",
    name: "Bosque con Niebla o Luz Filtrada",
    description: "Retratos poéticos y misteriosos",
    prompt: "Misty forest setting with fog between trees, atmospheric haze, filtered natural light through canopy, mysterious woodland ambiance",
    lighting: "Soft diffused natural light filtered through fog and trees, low contrast ethereal quality",
    technical: "Heavily diffused daylight at 6000-7000K, very soft shadowless quality, cool atmospheric mood",
  },
  beach_sunrise: {
    id: "beach_sunrise",
    category: "natural",
    name: "Playa al Amanecer o Atardecer",
    description: "Tonos suaves, piel cálida, ambiente relajado",
    prompt: "Sandy beach coastline at golden hour (sunrise or sunset), ocean horizon visible, warm natural light, serene coastal atmosphere",
    lighting: "Natural golden hour sun at low angle, warm directional light, reflected fill from sand and water",
    technical: "Direct sunlight at 2800-4000K, soft quality at low sun angle, warm color palette",
  },
  park_bokeh: {
    id: "park_bokeh",
    category: "natural",
    name: "Parque o Jardín con Bokeh Verde",
    description: "Retrato natural y fresco",
    prompt: "Park or garden setting with lush green foliage, natural bokeh from out-of-focus background vegetation, fresh outdoor atmosphere",
    lighting: "Soft natural daylight, open shade or filtered through trees, even gentle illumination",
    technical: "Diffused natural light at 5500-6500K, shallow depth of field creating soft bokeh, fresh natural mood",
  },

  // ========================================
  // CATEGORÍA: INTERIORES ATMOSFÉRICOS (Atmospheric Indoor)
  // ========================================
  cafe_ambient: {
    id: "cafe_ambient",
    category: "atmospheric",
    name: "Café con Luz Ambiental",
    description: "Tono íntimo y cotidiano, excelente para retratos naturales",
    prompt: "Cozy café interior with warm ambient lighting, intimate casual atmosphere, natural lifestyle setting with soft practical lights",
    lighting: "Mixed warm practical lights from fixtures and windows, soft ambient glow, low-key intimate mood",
    technical: "Tungsten practicals at 2700-3200K mixed with window light at 5500K, low key atmosphere",
  },
  minimalist_room: {
    id: "minimalist_room",
    category: "atmospheric",
    name: "Habitación Minimalista con Luz Lateral",
    description: "Retratos modernos y limpios",
    prompt: "Minimalist bedroom or living space with white walls, single window providing side lighting, clean modern interior, simple aesthetic",
    lighting: "Natural window light as single directional source from side, creating gentle modeling and depth",
    technical: "Soft window light at 5500-6500K, directional from 90° side angle, moderate contrast",
  },
  workshop_garage: {
    id: "workshop_garage",
    category: "atmospheric",
    name: "Taller o Garaje con Texturas Metálicas",
    description: "Retrato rudo o de carácter",
    prompt: "Workshop or garage setting with tools and metallic textures, industrial practical lights, gritty authentic workspace atmosphere",
    lighting: "Hard practical work lights, mixed with natural light from garage door, creating texture and character",
    technical: "Practical fluorescent or LED work lights at 4000-5000K, hard quality emphasizing textures",
  },
  library_study: {
    id: "library_study",
    category: "atmospheric",
    name: "Biblioteca o Estudio con Libros",
    description: "Retrato intelectual o introspectivo",
    prompt: "Library or study room with bookshelves, academic atmosphere, intellectual setting, warm practical lighting from lamps",
    lighting: "Warm practical desk lamps and ambient interior lighting, cozy intimate intellectual mood",
    technical: "Tungsten practical lights at 2700-3200K, soft warm ambient, low-key scholarly atmosphere",
  },
  theater_stage: {
    id: "theater_stage",
    category: "atmospheric",
    name: "Teatro o Escenario con Focos Puntuales",
    description: "Atmósfera artística o dramática",
    prompt: "Theater stage with spotlights, dramatic theatrical atmosphere, focused lighting from stage lights, artistic performance setting",
    lighting: "Directional stage spotlights creating dramatic focused beams, high contrast theatrical lighting",
    technical: "Hard theatrical spotlights at 3200K, high contrast with defined light cones, dramatic shadows",
  },

  // ========================================
  // CATEGORÍA: CINEMATOGRÁFICO/DRAMÁTICO (Cinematic)
  // ========================================
  dark_corridor_single_light: {
    id: "dark_corridor_single_light",
    category: "cinematic",
    name: "Pasillo Oscuro con Luz Única al Fondo",
    description: "Genera tensión, misterio y composición en capas",
    prompt: "Dark corridor or hallway with single warm light source at far end, mysterious atmospheric tension, layered depth composition",
    lighting: "Single practical light at background creating silhouette or rim lighting, deep shadows in foreground",
    technical: "Single tungsten source at 2700K in background, very high contrast 16:1, dramatic mystery mood",
  },
  tv_blue_window: {
    id: "tv_blue_window",
    category: "cinematic",
    name: "Habitación Iluminada por TV o Ventana Azul",
    description: "Ambiente introspectivo, tipo drama psicológico",
    prompt: "Dark room lit only by television screen or blue moonlight through window, introspective psychological atmosphere, cool color palette",
    lighting: "Blue cool light from TV (flickering) or window moonlight, very low-key mysterious mood",
    technical: "Cool light source at 7000-10000K, very low-key lighting, high contrast, psychological thriller aesthetic",
  },
  underground_garage_neon: {
    id: "underground_garage_neon",
    category: "cinematic",
    name: "Garaje Subterráneo con Neón y Humo",
    description: "Estilo neo-noir o thriller urbano",
    prompt: "Underground parking garage with neon lights and atmospheric haze or smoke, neo-noir urban aesthetic, moody cinematic atmosphere",
    lighting: "Colored neon tube lights (cyan, magenta) with atmospheric smoke diffusing light, urban thriller mood",
    technical: "Mixed neon sources at 3000-7000K, haze for light shaping, high contrast neo-noir style",
  },
  wet_street_reflections: {
    id: "wet_street_reflections",
    category: "cinematic",
    name: "Calle Mojada con Reflejos de Luces",
    description: "Retratos melancólicos o cinematográficos",
    prompt: "Wet street at night after rain with reflections of street lights and neon signs, melancholic cinematic atmosphere, urban film aesthetic",
    lighting: "Practical street lights and neon reflected in wet pavement, mixed color temperatures, moody dramatic lighting",
    technical: "Multiple practical sources at 2500-6000K, reflections doubling light sources, cinematic color palette",
  },
  motel_room_colored: {
    id: "motel_room_colored",
    category: "cinematic",
    name: "Interior de Motel con Luces Rojas y Azules",
    description: "Retrato con tensión emocional y contraste cromático fuerte",
    prompt: "Motel room interior with crossed red and blue lighting, strong chromatic contrast, emotional tension atmosphere, neo-noir aesthetic",
    lighting: "Red and blue gelled lights from opposite directions creating color split on subject, high tension mood",
    technical: "Red gel at 2000K and blue gel at 10000K from opposing 45° angles, very saturated, high drama",
  },
  empty_theater_spotlight: {
    id: "empty_theater_spotlight",
    category: "cinematic",
    name: "Teatro Vacío con Foco Cenital Único",
    description: "Atmósfera teatral, melancólica y simbólica",
    prompt: "Empty theater auditorium with single overhead spotlight on subject, theatrical melancholic atmosphere, symbolic dramatic setting",
    lighting: "Single hard overhead spotlight creating dramatic top-down lighting, dark theater surroundings",
    technical: "Hard theatrical spot from directly above (90° overhead), 3200K, very high contrast, symbolic mood",
  },
  old_factory_dusty_rays: {
    id: "old_factory_dusty_rays",
    category: "cinematic",
    name: "Vieja Fábrica con Rayos de Luz Polvorientos",
    description: "Contraste entre dureza industrial y humanidad del rostro",
    prompt: "Abandoned old factory with rays of light streaming through dusty broken windows, industrial decay atmosphere, light beams visible through dust particles",
    lighting: "Hard directional sunlight creating visible light beams through atmospheric dust, dramatic volumetric lighting",
    technical: "Direct sunlight at 5500K through openings, visible light shafts in dust, high contrast industrial mood",
  },
  stormy_field: {
    id: "stormy_field",
    category: "cinematic",
    name: "Campo Abierto con Cielo Tormentoso",
    description: "Dramatismo natural, épico y cinematográfico",
    prompt: "Open field landscape with dramatic stormy sky backdrop, dark clouds, epic natural atmosphere, cinematic weather conditions",
    lighting: "Overcast diffused light from storm clouds, occasional breaks of directional light, dramatic natural mood",
    technical: "Heavily diffused natural light at 6000-8000K, low-key storm lighting, epic cinematic atmosphere",
  },
  alley_steam_backlight: {
    id: "alley_steam_backlight",
    category: "cinematic",
    name: "Callejón con Vapor y Contraluz Intenso",
    description: "Estética urbana de película de acción o crimen",
    prompt: "Urban alley with steam rising from manholes and vents, strong backlight creating atmospheric haze, action film aesthetic",
    lighting: "Strong backlight illuminating steam and atmospheric smoke, creating dramatic rim lighting and silhouettes",
    technical: "Hard backlight at 4500K, atmospheric elements for light shaping, high contrast urban thriller mood",
  },
  abandoned_church: {
    id: "abandoned_church",
    category: "cinematic",
    name: "Iglesia Abandonada con Luz de Vitral",
    description: "Atmósfera sagrada y decadente, ideal para retratos simbólicos",
    prompt: "Abandoned gothic church interior with golden light filtering through broken stained glass windows, sacred decadent atmosphere, symbolic religious setting",
    lighting: "Colored light beams from stained glass creating colored patterns, dramatic sacred mood with decay",
    technical: "Filtered colored sunlight through stained glass, mixed color temperatures, high contrast symbolic lighting",
  },

  // ========================================
  // CATEGORÍA: CYBERPUNK/FUTURISTA (Cyberpunk/Futuristic)
  // ========================================
  cyberpunk_rain: {
    id: "cyberpunk_rain",
    category: "cyberpunk",
    name: "Ciudad Cyberpunk con Neones y Lluvia",
    description: "Reflejos, humo, y luces fucsias/azules en el rostro; estética Blade Runner",
    prompt: "Cyberpunk megacity with constant rain, neon signs reflecting on wet surfaces, holographic advertisements, steam rising from vents, futuristic dystopian atmosphere",
    lighting: "Mixed neon lighting (magenta, cyan, orange), reflections from wet surfaces, atmospheric fog and rain",
    technical: "Multiple colored neon sources at 3000-9000K, very saturated colors, wet reflections doubling lights, Blade Runner aesthetic",
  },
  overgrown_ruins: {
    id: "overgrown_ruins",
    category: "cyberpunk",
    name: "Ruinas de Megaciudad Cubierta de Vegetación",
    description: "Mezcla de tecnología caída y naturaleza renaciendo (The Last of Us vibes)",
    prompt: "Post-apocalyptic ruins of futuristic megacity overtaken by vegetation, nature reclaiming urban structures, abandoned technology with plants growing through, dystopian hope atmosphere",
    lighting: "Natural daylight filtered through overgrown structures, soft green-tinted ambient from vegetation",
    technical: "Diffused natural light at 5500K with green color cast from foliage, post-apocalyptic mood",
  },
  red_emergency_tunnel: {
    id: "red_emergency_tunnel",
    category: "cyberpunk",
    name: "Túnel Subterráneo con Luces de Emergencia Rojas",
    description: "Sensación de huida o rebelión",
    prompt: "Underground tunnel or subway passage illuminated only by red emergency lights, dystopian escape atmosphere, industrial rebellion setting",
    lighting: "Red emergency lights creating monochromatic red lighting scheme, high tension dramatic mood",
    technical: "Red LED emergency lights at 1800K equivalent, monochromatic red wash, very high contrast, tense mood",
  },
  control_room_abandoned: {
    id: "control_room_abandoned",
    category: "cyberpunk",
    name: "Sala de Control Abandonada con Pantallas",
    description: "Ambiente frío, tecnológico y decadente",
    prompt: "Abandoned control room or command center with flickering screens and monitors, cold technological atmosphere, decaying high-tech environment",
    lighting: "Blue and green light from monitors and screens, cold technological glow, decayed sci-fi mood",
    technical: "Cool light from screens at 8000-12000K, flickering quality, cold dystopian technological aesthetic",
  },
  postnuclear_desert: {
    id: "postnuclear_desert",
    category: "cyberpunk",
    name: "Desierto Postnuclear con Cielo Anaranjado",
    description: "Look épico tipo Dune o Mad Max",
    prompt: "Post-nuclear desert wasteland with orange-tinted sky, dust suspended in atmosphere, apocalyptic landscape, epic dystopian setting",
    lighting: "Harsh direct sunlight filtered through atmospheric dust creating orange color cast, epic harsh mood",
    technical: "Direct sunlight at 2500-3000K through dust, very warm orange palette, high contrast wasteland aesthetic",
  },
  industrial_drones: {
    id: "industrial_drones",
    category: "cyberpunk",
    name: "Calle Industrial con Drones y Cables",
    description: "Retrato urbano-futurista con luces artificiales y neblina",
    prompt: "Industrial street with drones flying overhead and cables crisscrossing sky, futuristic urban atmosphere, artificial lights and atmospheric haze",
    lighting: "Mixed artificial lights from street and buildings, atmospheric haze, cold futuristic urban mood",
    technical: "Cool LED streetlights at 5000-6000K, atmospheric fog for light shaping, sci-fi urban aesthetic",
  },
  destroyed_lab: {
    id: "destroyed_lab",
    category: "cyberpunk",
    name: "Laboratorio Destruido con Luces Verdes",
    description: "Tono experimental, peligroso y cinematográfico",
    prompt: "Destroyed laboratory with green emergency lights and electrical sparks, experimental dangerous atmosphere, sci-fi disaster setting",
    lighting: "Green emergency lighting with practical sparks and electrical effects, dangerous experimental mood",
    technical: "Green tinted lights at 5000K with practical spark effects, high contrast, experimental danger aesthetic",
  },
  space_station: {
    id: "space_station",
    category: "cyberpunk",
    name: "Estación Espacial con Ventanal al Espacio",
    description: "Retrato de aislamiento y asombro cósmico",
    prompt: "Space station interior with large window showing planet or cosmos outside, isolated cosmic atmosphere, sci-fi wonder setting",
    lighting: "Cool white artificial station lighting mixed with blue cosmic light from window, isolated sci-fi mood",
    technical: "White LED station lights at 6500K mixed with cool blue space light at 9000K, clean sci-fi aesthetic",
  },
  spaceship_corridor: {
    id: "spaceship_corridor",
    category: "cyberpunk",
    name: "Pasillo de Nave con Luces Estroboscópicas",
    description: "Estética Alien o The Expanse, ideal para tensión y contraste",
    prompt: "Spaceship corridor with strobing emergency lights, sci-fi horror atmosphere, high tension industrial spacecraft interior",
    lighting: "Strobing white and red lights creating disorienting effect, high tension sci-fi horror mood",
    technical: "Flickering white at 6500K and red at 2000K, strobing effect, very high contrast Alien aesthetic",
  },
  futuristic_temple: {
    id: "futuristic_temple",
    category: "cyberpunk",
    name: "Ruinas de Templo Futurista con Luz Divina",
    description: "Mezcla espiritual y tecnológica, perfecta para retratos simbólicos",
    prompt: "Ruins of futuristic temple with metallic sculptures and divine light beaming down, spiritual-technological fusion, symbolic rebirth atmosphere",
    lighting: "Strong overhead beam of light creating god-rays effect, mixing spiritual and technological aesthetics",
    technical: "Hard overhead light at 6000K creating visible beam through atmospheric haze, symbolic divine tech fusion",
  },
};

// Categorías para organizar en la UI
export const ENVIRONMENT_CATEGORIES = {
  studio: {
    name: "Estudio",
    icon: "🎬",
    description: "Entornos controlados para fotografía profesional",
  },
  urban: {
    name: "Urbano",
    icon: "🏙️",
    description: "Locaciones de ciudad y espacios urbanos",
  },
  natural: {
    name: "Natural",
    icon: "🌿",
    description: "Exteriores naturales y paisajes",
  },
  atmospheric: {
    name: "Interiores Atmosféricos",
    icon: "🏠",
    description: "Espacios interiores con carácter",
  },
  cinematic: {
    name: "Cinematográfico",
    icon: "🎥",
    description: "Locaciones dramáticas tipo película",
  },
  cyberpunk: {
    name: "Cyberpunk/Futurista",
    icon: "🤖",
    description: "Escenarios de ciencia ficción y distopía",
  },
};

// Funciones helper
export const getEnvironmentById = (id) => {
  return ENVIRONMENTS[id] || null;
};

export const getRandomEnvironment = () => {
  const keys = Object.keys(ENVIRONMENTS);
  const randomKey = keys[Math.floor(Math.random() * keys.length)];
  return ENVIRONMENTS[randomKey];
};

export const getEnvironmentsByCategory = (category) => {
  return Object.values(ENVIRONMENTS).filter(env => env.category === category);
};

export const getAllCategories = () => {
  return Object.keys(ENVIRONMENT_CATEGORIES).map(key => ({
    id: key,
    ...ENVIRONMENT_CATEGORIES[key],
  }));
};
