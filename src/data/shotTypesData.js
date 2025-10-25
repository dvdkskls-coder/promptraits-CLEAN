// ============================================
// PLANOS FOTOGRÁFICOS - SIMPLIFICADOS
// ============================================
// Solo 5 planos esenciales, GARANTIZADOS en el prompt

export const SHOT_TYPES = {
  full_body: {
    id: 'full_body',
    name: 'Plano General',
    nameEN: 'Full Body Shot',
    icon: '🧍',
    description: 'Cuerpo completo visible, ideal para mostrar outfit y entorno',
    
    // Instrucciones FORZADAS para Gemini (3 menciones)
    technical: 'full-body portrait, complete figure visible from head to toe, showing entire body composition',
    framing: 'Full-length shot with subject occupying 60-80% of frame height',
    composition: 'Full body framing, vertical composition, complete silhouette',
    
    // Especificaciones técnicas
    aspectRatio: '3:4 or 4:5',
    headroom: '10-15%',
    footroom: '5-10%',
    
    // Cuándo usar
    useCases: ['streetwear', 'lifestyle', 'fashion', 'outfit showcase'],
  },
  
  medium_shot: {
    id: 'medium_shot',
    name: 'Plano Medio',
    nameEN: 'Medium Shot',
    icon: '👔',
    description: 'Cintura hacia arriba, equilibrio perfecto entre sujeto y expresión',
    
    // Instrucciones FORZADAS para Gemini (3 menciones)
    technical: 'waist-up portrait, medium shot framing, torso and head composition',
    framing: 'Medium shot cutting at waist level, showing upper body',
    composition: 'Waist-up framing, balanced composition, upper body focus',
    
    // Especificaciones técnicas
    aspectRatio: '3:2 or 4:5',
    headroom: '12-18%',
    cutLine: 'waist level',
    
    // Cuándo usar
    useCases: ['formal', 'business', 'versatile', 'balanced'],
  },
  
  close_up: {
    id: 'close_up',
    name: 'Primer Plano',
    nameEN: 'Close-Up / Head & Shoulders',
    icon: '😀',
    description: 'Cabeza y hombros, máxima expresividad y conexión',
    
    // Instrucciones FORZADAS para Gemini (3 menciones)
    technical: 'head-and-shoulders portrait, close-up shot framing, tight facial composition',
    framing: 'Close-up shot cutting at shoulder level, focusing on face',
    composition: 'Tight head-and-shoulders framing, intimate composition, facial emphasis',
    
    // Especificaciones técnicas
    aspectRatio: '4:5 or 1:1',
    headroom: '15-20%',
    cutLine: 'mid-chest or shoulders',
    
    // Cuándo usar
    useCases: ['dramatic', 'expressive', 'portrait', 'emotional'],
  },
  
  high_angle: {
    id: 'high_angle',
    name: 'Picado',
    nameEN: 'High Angle',
    icon: '📐',
    description: 'Cámara arriba mirando abajo, reduce presencia, íntimo',
    
    // Instrucciones FORZADAS para Gemini (3 menciones)
    technical: 'high-angle shot, camera positioned above subject looking down, downward perspective',
    framing: 'High-angle view with camera 15-30 degrees above eye level',
    composition: 'Top-down perspective, elevated camera angle, looking down composition',
    
    // Especificaciones técnicas
    cameraAngle: '15-30° above eye level',
    effect: 'reduces subject presence, intimate feel',
    aspectRatio: '3:2 or 4:5',
    
    // Cuándo usar
    useCases: ['intimate', 'vulnerable', 'unique perspective', 'editorial'],
  },
  
  low_angle: {
    id: 'low_angle',
    name: 'Contrapicado',
    nameEN: 'Low Angle',
    icon: '📈',
    description: 'Cámara abajo mirando arriba, poder e impacto visual',
    
    // Instrucciones FORZADAS para Gemini (3 menciones)
    technical: 'low-angle shot, camera positioned below subject looking up, upward perspective',
    framing: 'Low-angle view with camera 15-30 degrees below eye level',
    composition: 'Bottom-up perspective, low camera angle, looking up composition',
    
    // Especificaciones técnicas
    cameraAngle: '15-30° below eye level',
    effect: 'increases subject presence, powerful feel',
    aspectRatio: '3:2 or 16:9',
    
    // Cuándo usar
    useCases: ['powerful', 'heroic', 'dramatic', 'imposing'],
  },
};

// Función para obtener shot type
export function getShotType(shotId) {
  return SHOT_TYPES[shotId] || null;
}

// Función para FORZAR el shot type en el prompt (3 menciones)
export function forceShotTypeInPrompt(shotId) {
  const shot = getShotType(shotId);
  if (!shot) return '';
  
  return `${shot.technical}, ${shot.framing}, ${shot.composition}`;
}

// Obtener todos los shots como array
export function getAllShotTypes() {
  return Object.values(SHOT_TYPES);
}

export default SHOT_TYPES;