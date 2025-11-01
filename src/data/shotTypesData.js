// 📸 TIPOS DE PLANO Y ÁNGULOS DE CÁMARA
// Sistema completo para control preciso de composición fotográfica

// ============================================================================
// TIPOS DE PLANO (SHOT TYPES)
// ============================================================================

export const SHOT_TYPES = [
  {
    id: "extreme-close-up",
    name: "Extreme Close-Up",
    nameES: "Primerísimo Primer Plano",
    description: "Solo rostro, muy íntimo",
    promptText: "Extreme close-up shot focusing on facial details and expression, tight framing from forehead to chin creating intimate perspective, minimal background visible",
    technical: "Framing: Face only (forehead to chin), Distance: < 1m, FOV: Minimal, Background: None/Blurred",
    icon: "👁️"
  },
  {
    id: "close-up",
    name: "Close-Up",
    nameES: "Primer Plano",
    description: "Cabeza y hombros",
    promptText: "Close-up portrait shot from shoulders to top of head, standard professional headshot framing, intimate yet professional distance, focus on facial expression",
    technical: "Framing: Shoulders to head, Distance: 1-1.5m, FOV: 15-20°, Background: Minimal context",
    icon: "😊"
  },
  {
    id: "medium-close-up",
    name: "Medium Close-Up",
    nameES: "Plano Medio Corto",
    description: "Desde pecho hasta cabeza",
    promptText: "Medium close-up shot from chest to head, balanced portrait framing showing upper body and torso context, professional interview style composition",
    technical: "Framing: Chest to head, Distance: 1.5-2m, FOV: 20-30°, Background: Some visible",
    icon: "👤"
  },
  {
    id: "medium-shot",
    name: "Medium Shot",
    nameES: "Plano Medio",
    description: "Desde cintura hasta cabeza",
    promptText: "Medium shot from waist to head, classical portrait composition showing upper body and hands, balanced environmental context",
    technical: "Framing: Waist to head, Distance: 2-3m, FOV: 30-40°, Background: Contextual",
    icon: "🧍"
  },
  {
    id: "american-shot",
    name: "American Shot",
    nameES: "Plano Americano",
    description: "Desde rodillas hasta cabeza",
    promptText: "American shot from knees to head, Western film style framing showing three-quarters of body, dynamic action-ready composition",
    technical: "Framing: Knees to head, Distance: 2.5-3.5m, FOV: 35-45°, Background: Visible",
    icon: "🤠"
  },
  {
    id: "full-body",
    name: "Full Body Shot",
    nameES: "Plano Entero",
    description: "Cuerpo completo visible",
    promptText: "Full body shot showing entire figure from head to feet, complete environmental context, fashion editorial style framing with space above and below subject",
    technical: "Framing: Full body head to toe, Distance: 3-5m, FOV: 45-60°, Background: Full context",
    icon: "🧍‍♂️"
  },
  {
    id: "cowboy-shot",
    name: "Cowboy Shot",
    nameES: "Plano 3/4",
    description: "Desde medio muslo",
    promptText: "Cowboy shot from mid-thigh to head, action cinema style framing showing most of body, dynamic composition with movement potential",
    technical: "Framing: Mid-thigh to head, Distance: 2-3.5m, FOV: 30-40°, Background: Contextual",
    icon: "🔫"
  },
  {
    id: "two-shot",
    name: "Two-Shot",
    nameES: "Plano de Dos",
    description: "Dos personas en cuadro",
    promptText: "Two-shot composition framing two subjects together, balanced dual portrait showing relationship and interaction between subjects",
    technical: "Framing: Two people visible, Distance: 2-4m, FOV: 40-50°, Background: Shared context",
    icon: "👥"
  }
];

// ============================================================================
// ÁNGULOS DE CÁMARA (CAMERA ANGLES)
// ============================================================================

export const CAMERA_ANGLES = [
  {
    id: "eye-level",
    name: "Eye Level",
    nameES: "A Nivel de Ojos",
    description: "Neutral, realista",
    promptText: "Camera at eye level creating neutral perspective, natural realistic viewpoint at subject's eye height, standard documentary style angle",
    technical: "Angle: 0°, Height: Subject's eyes, Effect: Neutral/Realistic, Feeling: Equal status",
    icon: "👁️"
  },
  {
    id: "high-angle",
    name: "High Angle",
    nameES: "Picado",
    description: "Cámara arriba mirando abajo",
    promptText: "High angle shot with camera positioned above subject looking down, creates vulnerable diminutive feeling, subject appears smaller and less powerful",
    technical: "Angle: 15-45° down, Height: Above subject, Effect: Diminishing, Feeling: Vulnerability/Weakness",
    icon: "⬇️"
  },
  {
    id: "low-angle",
    name: "Low Angle",
    nameES: "Contrapicado",
    description: "Cámara abajo mirando arriba",
    promptText: "Low angle shot with camera positioned below subject looking up, creates powerful heroic feeling, subject appears larger and more imposing",
    technical: "Angle: 15-45° up, Height: Below subject, Effect: Empowering, Feeling: Power/Dominance",
    icon: "⬆️"
  },
  {
    id: "overhead",
    name: "Overhead / Bird's Eye",
    nameES: "Cenital",
    description: "Vista desde arriba 90°",
    promptText: "Overhead shot from directly above, bird's eye view perspective with 90-degree downward angle, architectural geometric composition",
    technical: "Angle: 90° down, Height: Directly above, Effect: Detached/Abstract, Feeling: Omniscient view",
    icon: "🦅"
  },
  {
    id: "worm-eye",
    name: "Worm's Eye View",
    nameES: "Nadir",
    description: "Vista desde abajo 90°",
    promptText: "Worm's eye view from ground level looking straight up, extreme low angle with 90-degree upward perspective, dramatic towering effect",
    technical: "Angle: 90° up, Height: Ground level, Effect: Dramatic/Imposing, Feeling: Overwhelming scale",
    icon: "🐛"
  },
  {
    id: "dutch-angle",
    name: "Dutch Angle / Canted",
    nameES: "Aberrante",
    description: "Cámara inclinada",
    promptText: "Dutch angle with tilted horizon line, diagonal composition creating dynamic tension and unease, camera rolled 10-45 degrees",
    technical: "Angle: 10-45° tilt, Orientation: Diagonal, Effect: Disorienting, Feeling: Tension/Unease",
    icon: "↗️"
  },
  {
    id: "over-shoulder",
    name: "Over-the-Shoulder",
    nameES: "Sobre el Hombro",
    description: "Desde detrás del hombro",
    promptText: "Over-the-shoulder shot with camera positioned behind subject's shoulder, creates sense of perspective and relationship with what subject is viewing",
    technical: "Angle: Slight side, Height: Shoulder, Effect: Perspective, Feeling: Shared viewpoint",
    icon: "🔙"
  }
];

// ============================================================================
// COMPOSICIONES ESPECIALES (SPECIAL COMPOSITIONS)
// ============================================================================

export const SPECIAL_COMPOSITIONS = [
  {
    id: "rule-of-thirds",
    name: "Rule of Thirds",
    nameES: "Regla de Tercios",
    description: "Sujeto en intersecciones",
    promptText: "Rule of thirds composition with subject positioned at intersection points, eyes on upper third line, balanced negative space",
    technical: "Grid: 3x3, Position: Intersections, Balance: 1/3 - 2/3 ratio",
    icon: "⊞"
  },
  {
    id: "centered",
    name: "Centered / Symmetrical",
    nameES: "Centrado Simétrico",
    description: "Perfecto balance central",
    promptText: "Centered symmetrical composition with subject in exact center, balanced equal negative space on both sides, formal portrait style",
    technical: "Position: Center, Balance: 50-50, Style: Formal/Symmetrical",
    icon: "⊡"
  },
  {
    id: "golden-ratio",
    name: "Golden Ratio",
    nameES: "Proporción Áurea",
    description: "Espiral de Fibonacci",
    promptText: "Golden ratio composition following Fibonacci spiral, subject positioned along phi grid lines, naturally pleasing proportions",
    technical: "Ratio: 1.618:1, Pattern: Fibonacci spiral, Balance: Natural/Organic",
    icon: "φ"
  },
  {
    id: "leading-lines",
    name: "Leading Lines",
    nameES: "Líneas Guía",
    description: "Líneas hacia el sujeto",
    promptText: "Leading lines composition with environmental elements directing eye toward subject, creating depth and guiding viewer attention",
    technical: "Pattern: Converging lines, Purpose: Guide attention, Depth: Enhanced",
    icon: "➡️"
  },
  {
    id: "negative-space",
    name: "Negative Space",
    nameES: "Espacio Negativo",
    description: "Mucho espacio vacío",
    promptText: "Negative space composition with subject occupying small portion, extensive empty space creating minimalist artistic effect",
    technical: "Subject: < 30%, Empty: > 70%, Style: Minimalist/Artistic",
    icon: "⬜"
  },
  {
    id: "frame-within-frame",
    name: "Frame Within Frame",
    nameES: "Marco Dentro de Marco",
    description: "Elementos enmarcan sujeto",
    promptText: "Frame within frame composition using environmental elements to create natural border around subject, adds depth and focus",
    technical: "Layers: Multiple frames, Depth: Enhanced, Focus: Directed",
    icon: "🖼️"
  }
];

// ============================================================================
// DEPTH OF FIELD (PROFUNDIDAD DE CAMPO)
// ============================================================================

export const DEPTH_OF_FIELD = [
  {
    id: "shallow-dof",
    name: "Shallow DOF",
    nameES: "Profundidad Reducida",
    description: "Fondo muy desenfocado",
    promptText: "Shallow depth of field with extremely blurred background, creamy smooth bokeh, subject isolated with sharp focus, wide aperture f/1.2-f/2.8 effect",
    technical: "Aperture: f/1.2-f/2.8, Focus: Narrow plane, Bokeh: Pronounced, Background: Very blurred",
    icon: "🔵"
  },
  {
    id: "medium-dof",
    name: "Medium DOF",
    nameES: "Profundidad Media",
    description: "Fondo semi-desenfocado",
    promptText: "Medium depth of field with moderately blurred background, subject clearly separated but some context visible, balanced aperture f/4-f/5.6 effect",
    technical: "Aperture: f/4-f/5.6, Focus: Moderate plane, Bokeh: Subtle, Background: Soft",
    icon: "🟢"
  },
  {
    id: "deep-dof",
    name: "Deep DOF",
    nameES: "Profundidad Amplia",
    description: "Todo nítido",
    promptText: "Deep depth of field with sharp focus throughout entire scene, foreground to background all in focus, small aperture f/11-f/22 effect",
    technical: "Aperture: f/11-f/22, Focus: Wide plane, Bokeh: None, Background: Sharp",
    icon: "🔴"
  }
];

// ============================================================================
// FUNCIONES HELPER
// ============================================================================

export const getShotTypeById = (id) => {
  return SHOT_TYPES.find(shot => shot.id === id) || null;
};

export const getCameraAngleById = (id) => {
  return CAMERA_ANGLES.find(angle => angle.id === id) || null;
};

export const getCompositionById = (id) => {
  return SPECIAL_COMPOSITIONS.find(comp => comp.id === id) || null;
};

export const getDOFById = (id) => {
  return DEPTH_OF_FIELD.find(dof => dof.id === id) || null;
};

// ============================================================================
// EXPORT DEFAULT
// ============================================================================

export default {
  SHOT_TYPES,
  CAMERA_ANGLES,
  SPECIAL_COMPOSITIONS,
  DEPTH_OF_FIELD,
  getShotTypeById,
  getCameraAngleById,
  getCompositionById,
  getDOFById
};
