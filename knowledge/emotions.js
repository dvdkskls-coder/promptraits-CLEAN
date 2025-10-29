// ============================================================================
// KNOWLEDGE BASE - EMOTIONS & EXPRESSIONS
// ============================================================================
// Conocimientos sobre expresiones faciales y emociones para retratos

export const emotions = {
  // EXPRESIONES POSITIVAS
  confident: {
    name: "Confident",
    description: "Seguro, determinado, mirada firme",
    prompt: "confident expression, strong steady gaze, assured demeanor",
    bodyLanguage: "Shoulders back, chest open, posture upright"
  },
  
  friendly: {
    name: "Friendly",
    description: "Amigable, accesible, sonrisa genuina",
    prompt: "warm friendly expression, genuine smile, approachable",
    bodyLanguage: "Relaxed shoulders, open posture, slight lean forward"
  },
  
  joyful: {
    name: "Joyful",
    description: "Alegre, feliz, sonrisa amplia",
    prompt: "joyful happy expression, bright smile, eyes crinkled with genuine happiness",
    bodyLanguage: "Animated, energetic, open arms"
  },
  
  seductive: {
    name: "Seductive",
    description: "Seductor, sensual, mirada intensa",
    prompt: "seductive sultry expression, intense smoldering gaze, slight lip parting",
    bodyLanguage: "Relaxed but intentional, chin slightly down, shoulders angled"
  },
  
  playful: {
    name: "Playful",
    description: "Juguetón, divertido, sonrisa traviesa",
    prompt: "playful expression, mischievous smile, twinkle in eyes",
    bodyLanguage: "Dynamic, asymmetric poses, head tilt"
  },
  
  // EXPRESIONES NEUTRALES/SERIAS
  serious: {
    name: "Serious",
    description: "Serio, profesional, rostro neutral",
    prompt: "serious professional expression, neutral face, direct gaze",
    bodyLanguage: "Formal posture, shoulders square, minimal movement"
  },
  
  contemplative: {
    name: "Contemplative",
    description: "Pensativo, reflexivo, mirada perdida",
    prompt: "contemplative thoughtful expression, distant gaze, introspective",
    bodyLanguage: "Relaxed but still, slight head tilt, hand near chin"
  },
  
  mysterious: {
    name: "Mysterious",
    description: "Misterioso, enigmático, mirada indescifrable",
    prompt: "mysterious enigmatic expression, unreadable gaze, subtle intrigue",
    bodyLanguage: "Controlled, minimal expression, partially turned away"
  },
  
  // EXPRESIONES INTENSAS
  intense: {
    name: "Intense",
    description: "Intenso, apasionado, mirada penetrante",
    prompt: "intense passionate expression, piercing gaze, focused energy",
    bodyLanguage: "Tense but controlled, forward lean, direct confrontation"
  },
  
  vulnerable: {
    name: "Vulnerable",
    description: "Vulnerable, delicado, mirada suave",
    prompt: "vulnerable delicate expression, soft gaze, gentle openness",
    bodyLanguage: "Soft shoulders, protective hand positions, slight downward gaze"
  },
  
  melancholic: {
    name: "Melancholic",
    description: "Melancólico, nostálgico, tristeza suave",
    prompt: "melancholic wistful expression, distant sad gaze, gentle sorrow",
    bodyLanguage: "Slumped shoulders, head slightly down, introspective"
  }
};

export const gazeDirections = {
  direct: "Direct eye contact with camera, engaging viewer, powerful connection",
  away: "Looking away from camera, candid feel, introspective mood",
  distance: "Gazing into distance, contemplative, lost in thought",
  down: "Looking downward, vulnerable, shy, or contemplative",
  up: "Looking upward, hopeful, aspirational, or defiant",
  overShoulder: "Over-the-shoulder glance, mysterious, intriguing, flirtatious"
};

export const smileTypes = {
  genuine: "Genuine Duchenne smile, eyes crinkled, natural happiness",
  subtle: "Subtle slight smile, hint of amusement, controlled joy",
  wide: "Wide open smile, showing teeth, uninhibited joy",
  closed: "Closed-mouth smile, Mona Lisa smile, mysterious contentment",
  smirk: "Slight smirk, asymmetric smile, confident or mischievous"
};
