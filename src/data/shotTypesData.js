// 📷 TIPOS DE PLANO FOTOGRÁFICO
// 15 opciones: 3 generales, 3 medios, 3 primeros planos, 5 ángulos

export const SHOT_TYPES = {
  // ========== PLANOS GENERALES ==========
  extreme_wide: {
    id: "extreme_wide",
    name: "Gran Plano General",
    nameEN: "Extreme Wide Shot",
    description: "Muestra el entorno completo, persona pequeña en contexto",
    technical: "Extreme wide shot (EWS), establishing shot, full environmental context, subject small in frame",
    category: "general",
  },
  wide: {
    id: "wide",
    name: "Plano General",
    nameEN: "Wide Shot",
    description: "Persona completa con contexto visible del entorno",
    technical: "Wide shot (WS), full body with environmental context visible, subject dominant but environment important",
    category: "general",
  },
  full: {
    id: "full",
    name: "Plano Entero",
    nameEN: "Full Shot",
    description: "Cuerpo completo de pies a cabeza, entorno secundario",
    technical: "Full body shot, head to toe framing, subject fills majority of frame, minimal headroom",
    category: "general",
  },

  // ========== PLANOS MEDIOS ==========
  american: {
    id: "american",
    name: "Plano Americano",
    nameEN: "Cowboy Shot",
    description: "Desde las rodillas hacia arriba, ideal para mostrar outfit",
    technical: "Cowboy shot, mid-thigh to head framing, three-quarter body visible, classic western portrait style",
    category: "medium",
  },
  medium: {
    id: "medium",
    name: "Plano Medio",
    nameEN: "Medium Shot",
    description: "Desde la cintura hacia arriba, equilibrio cuerpo-rostro",
    technical: "Medium shot (MS), waist-up portrait, balanced body and face composition, standard interview framing",
    category: "medium",
  },
  medium_close: {
    id: "medium_close",
    name: "Plano Medio Corto",
    nameEN: "Medium Close-Up",
    description: "Desde el pecho hacia arriba, énfasis en expresión",
    technical: "Medium close-up (MCU), chest-up portrait, bust shot, emphasis on facial expression and upper body",
    category: "medium",
  },

  // ========== PRIMEROS PLANOS ==========
  close_up: {
    id: "close_up",
    name: "Primer Plano",
    nameEN: "Close-Up",
    description: "Desde los hombros, rostro como protagonista absoluto",
    technical: "Close-up (CU), shoulders to head framing, face dominates composition, intimate portrait focus",
    category: "closeup",
  },
  extreme_close_up: {
    id: "extreme_close_up",
    name: "Primerísimo Primer Plano",
    nameEN: "Extreme Close-Up",
    description: "Solo rostro completo, máxima intimidad emocional",
    technical: "Extreme close-up (ECU), face fills entire frame, forehead to chin, ultra-intimate emotional portrait",
    category: "closeup",
  },
  detail: {
    id: "detail",
    name: "Plano de Detalle",
    nameEN: "Detail Shot",
    description: "Detalle específico aislado (ojos, manos, textura)",
    technical: "Macro detail shot, isolated feature focus (eyes, hands, texture), extreme shallow depth of field",
    category: "closeup",
  },

  // ========== ÁNGULOS DE CÁMARA ==========
  overhead: {
    id: "overhead",
    name: "Cenital (Overhead)",
    nameEN: "Overhead Shot",
    description: "Cámara directamente arriba a 90° mirando hacia abajo",
    technical: "Top-down view, bird's eye perspective, 90° overhead angle, zenithal shot, directly above subject",
    category: "angles",
  },
  high_angle: {
    id: "high_angle",
    name: "Picado (High Angle)",
    nameEN: "High Angle",
    description: "Cámara elevada mirando hacia abajo 30-45°",
    technical: "High angle shot, camera positioned above eye level at 30-45° downward angle, slightly diminishing perspective",
    category: "angles",
  },
  eye_level: {
    id: "eye_level",
    name: "Normal (Eye Level)",
    nameEN: "Eye Level",
    description: "Cámara a la altura natural de los ojos",
    technical: "Eye level shot, camera at subject's eye height, neutral straight-on perspective, natural viewing angle",
    category: "angles",
  },
  low_angle: {
    id: "low_angle",
    name: "Contrapicado (Low Angle)",
    nameEN: "Low Angle",
    description: "Cámara baja mirando hacia arriba 30-45°",
    technical: "Low angle shot, camera positioned below eye level at 30-45° upward angle, empowering heroic perspective",
    category: "angles",
  },
  worms_eye: {
    id: "worms_eye",
    name: "Nadir (Worm's Eye)",
    nameEN: "Worm's Eye View",
    description: "Cámara al nivel del suelo mirando completamente arriba",
    technical: "Ground level perspective, extreme low angle at 70-90° upward, worm's eye view, dramatic foreshortening",
    category: "angles",
  },
};

// Categorías para organizar en la UI
export const SHOT_TYPE_CATEGORIES = {
  general: {
    name: "Planos Generales",
    icon: "🌍",
    shots: ["extreme_wide", "wide", "full"],
  },
  medium: {
    name: "Planos Medios",
    icon: "👤",
    shots: ["american", "medium", "medium_close"],
  },
  closeup: {
    name: "Primeros Planos",
    icon: "😊",
    shots: ["close_up", "extreme_close_up", "detail"],
  },
  angles: {
    name: "Ángulos de Cámara",
    icon: "📐",
    shots: ["overhead", "high_angle", "eye_level", "low_angle", "worms_eye"],
  },
};

// Función helper para obtener un shot type por ID
export const getShotTypeById = (id) => {
  return SHOT_TYPES[id] || null;
};

// Función para obtener un shot type aleatorio
export const getRandomShotType = () => {
  const keys = Object.keys(SHOT_TYPES);
  const randomKey = keys[Math.floor(Math.random() * keys.length)];
  return SHOT_TYPES[randomKey];
};

// Función para obtener shots por categoría
export const getShotsByCategory = (category) => {
  return Object.values(SHOT_TYPES).filter(shot => shot.category === category);
};
