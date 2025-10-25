// ============================================
// SELECTOR DE GÉNERO
// ============================================
// Define cómo ajustar el prompt según género

export const GENDERS = {
  male: {
    id: 'male',
    name: 'Hombre',
    nameEN: 'Male',
    icon: '👨',
    
    // Ajustes de prompt
    poseStyle: 'confident, straight posture, grounded stance, assertive body language',
    expressionHints: 'focused gaze, contemplative, determined, serious, subtle smile',
    outfitFocus: 'structured tailoring, clean lines, masculine silhouette',
    
    // Palabras clave que favorecen masculinidad sin mencionar género
    keywords: 'strong composition, sharp angles, bold presence, defined features',
    
    // Qué NO incluir
    avoid: ['makeup application', 'elaborate hairstyling', 'feminine poses', 'soft curves'],
  },
  
  female: {
    id: 'female',
    name: 'Mujer',
    nameEN: 'Female',
    icon: '👩',
    
    // Ajustes de prompt
    poseStyle: 'elegant posture, graceful stance, natural flowing movement, poised body language',
    expressionHints: 'soft gaze, gentle smile, expressive eyes, warm expression',
    outfitFocus: 'flowing fabrics, elegant silhouette, refined styling',
    
    // Incluir aspectos de styling femenino
    styling: {
      makeup: 'professional makeup application, defined features, polished look',
      hair: 'styled hair, soft waves, elegant coiffure, natural movement',
    },
    
    // Palabras clave que favorecen feminidad sin mencionar género
    keywords: 'elegant composition, soft angles, graceful presence, refined features',
    
    // Qué NO incluir
    avoid: ['masculine poses', 'harsh angles', 'rugged styling'],
  },
};

// Función para obtener configuración de género
export function getGenderConfig(genderId) {
  return GENDERS[genderId] || null;
}

// Función para aplicar ajustes de género al prompt
export function applyGenderToPrompt(basePrompt, genderId) {
  const config = getGenderConfig(genderId);
  if (!config) return basePrompt;
  
  // Insertar hints de género en el prompt
  let modifiedPrompt = basePrompt;
  
  // Añadir keywords de género al final
  modifiedPrompt += `, ${config.keywords}`;
  
  return modifiedPrompt;
}

export default GENDERS;
