// ============================================
// ENTORNOS UNIFICADOS (Escenarios + Entornos)
// ============================================
// 8 entornos categorizados basados en tus fotos

export const ENVIRONMENTS = {
  // ================== ESTUDIO (3) ==================
  
  studio_solid: {
    id: 'studio_solid',
    name: 'Estudio Fondo Sólido',
    nameEN: 'Solid Studio Background',
    category: 'studio',
    icon: '🎨',
    description: 'Fondo de color sólido (negro, rojo, azul, gris). Profesional, limpio.',
    
    prompt: 'professional studio setting with solid color backdrop, seamless paper background, clean studio environment, controlled lighting setup, minimal distractions, pure background color (black, red, blue, or grey), commercial photography studio aesthetic',
    
    colors: ['black', 'red', 'deep blue', 'grey', 'burgundy'],
    mood: 'professional, clean, editorial, commercial',
    references: ['Fotos 1, 5, 6, 7'],
  },
  
  studio_gradient: {
    id: 'studio_gradient',
    name: 'Estudio Gradiente',
    nameEN: 'Gradient Studio Background',
    category: 'studio',
    icon: '🌫️',
    description: 'Fondo difuminado gris/neutro. Sofisticado, corporativo.',
    
    prompt: 'studio gradient backdrop, soft neutral grey background with subtle gradient, sophisticated studio setup, gentle light fall-off, seamless gradient transition, professional corporate photography environment, refined backdrop, smooth tonal shift',
    
    colors: ['grey gradient', 'neutral tones', 'soft whites'],
    mood: 'sophisticated, corporate, refined, professional',
    references: ['Fotos 2, 4, 15'],
  },
  
  studio_infinity: {
    id: 'studio_infinity',
    name: 'Estudio Infinity Wall',
    nameEN: 'Infinity Wall Studio',
    category: 'studio',
    icon: '⚪',
    description: 'Infinity wall blanco. Minimalista, limpio, fashion.',
    
    prompt: 'infinity wall studio setup, seamless white curved backdrop, minimalist studio environment, endless white background, no visible floor-wall junction, clean fashion photography setting, bright even lighting, pure white cyclorama',
    
    colors: ['pure white', 'bright white'],
    mood: 'minimalist, clean, fashion, bright',
    references: ['Estilo editorial moderno'],
  },
  
  // =============== URBANO EXTERIOR (3) ==============
  
  street_bokeh: {
    id: 'street_bokeh',
    name: 'Calle Urbana Bokeh',
    nameEN: 'Urban Street with Bokeh',
    category: 'urban_outdoor',
    icon: '🌆',
    description: 'Exterior ciudad, desenfoque fondo. Cinematográfico, lifestyle.',
    
    prompt: 'urban street location, beautiful background bokeh, city lights out of focus, shallow depth of field, cinematic urban atmosphere, blurred cityscape behind, modern city environment, lifestyle photography setting, golden hour urban lighting',
    
    elements: ['city lights', 'bokeh', 'shallow DOF', 'urban elements'],
    mood: 'cinematic, lifestyle, urban, romantic',
    references: ['Fotos 3, 14, 18'],
  },
  
  modern_plaza: {
    id: 'modern_plaza',
    name: 'Plaza Moderna',
    nameEN: 'Modern Plaza',
    category: 'urban_outdoor',
    icon: '🏛️',
    description: 'Arquitectura contemporánea. Minimalista, urbano.',
    
    prompt: 'modern urban plaza, contemporary architecture background, clean geometric lines, minimal urban environment, sleek modern buildings, architectural photography setting, open public space, modern city design, symmetrical urban composition',
    
    elements: ['modern architecture', 'clean lines', 'open space', 'minimal'],
    mood: 'minimalist, urban, contemporary, architectural',
    references: ['Foto 19'],
  },
  
  street_overcast: {
    id: 'street_overcast',
    name: 'Calle Overcast',
    nameEN: 'Overcast Street',
    category: 'urban_outdoor',
    icon: '🌧️',
    description: 'Día nublado, luz difusa. Editorial, urbano.',
    
    prompt: 'urban street on overcast day, soft diffused natural light, cloudy weather atmosphere, muted city colors, editorial urban environment, contemporary street photography setting, modern city street, subtle shadows, moody urban backdrop',
    
    elements: ['overcast sky', 'soft light', 'urban street', 'muted colors'],
    mood: 'editorial, urban, moody, contemporary',
    references: ['Fotos 13, 17'],
  },
  
  // =============== URBANO INTERIOR (2) ==============
  
  parking_neon: {
    id: 'parking_neon',
    name: 'Parking/Túnel Neón',
    nameEN: 'Neon Parking/Tunnel',
    category: 'urban_indoor',
    icon: '🚗',
    description: 'Luces neón, hormigón. Underground, moderno.',
    
    prompt: 'underground parking or tunnel setting, neon lights, concrete urban environment, cyan and teal lighting, modern urban underground atmosphere, industrial aesthetic, contemporary neon glow, Blade Runner-inspired setting, dramatic urban interior',
    
    elements: ['neon lights', 'concrete', 'cyan/teal tones', 'industrial'],
    mood: 'underground, modern, cinematic, urban',
    references: ['Foto 16'],
  },
  
  cozy_interior: {
    id: 'cozy_interior',
    name: 'Interior Cálido',
    nameEN: 'Cozy Warm Interior',
    category: 'urban_indoor',
    icon: '🏠',
    description: 'Ambiente con bokeh lights. Íntimo, festivo.',
    
    prompt: 'warm cozy interior setting, soft bokeh lights in background, intimate indoor atmosphere, warm ambient lighting, comfortable home environment, golden decorative lights, festive warm ambiance, soft interior glow, inviting indoor space',
    
    elements: ['warm lights', 'bokeh', 'cozy atmosphere', 'indoor'],
    mood: 'intimate, warm, festive, cozy',
    references: ['Fotos 8, 9'],
  },
};

// Obtener entorno por ID
export function getEnvironment(envId) {
  return ENVIRONMENTS[envId] || null;
}

// Obtener entornos por categoría
export function getEnvironmentsByCategory(category) {
  return Object.values(ENVIRONMENTS).filter(env => env.category === category);
}

// Obtener todas las categorías
export function getEnvironmentCategories() {
  return {
    studio: 'Estudio',
    urban_outdoor: 'Urbano Exterior',
    urban_indoor: 'Urbano Interior',
  };
}

// Obtener todos los entornos
export function getAllEnvironments() {
  return Object.values(ENVIRONMENTS);
}

export default ENVIRONMENTS;
