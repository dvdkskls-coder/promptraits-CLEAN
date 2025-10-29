// ============================================================================
// KNOWLEDGE BASE - COLOR GRADING
// ============================================================================
// Conocimientos sobre color grading y post-procesamiento

export const colorGrading = {
  tealOrange: {
    name: "Teal & Orange (Blockbuster Look)",
    description: "Tonos naranjas en piel/sujeto, teals/cyans en sombras y fondos",
    mood: "Cinematográfico, moderno, blockbuster, pop",
    prompt: "cinematic teal and orange color grading, warm skin tones, cool shadows",
    use: "Cine comercial, retratos cinematográficos, Instagram popular",
    captureOne: "Lift en azules/cyanos, Gamma en naranjas, separación tonal piel vs fondo"
  },
  
  vintage: {
    name: "Vintage Film Look",
    description: "Emula película analógica con menor saturación, lift en sombras, tonos suaves",
    mood: "Nostálgico, atemporal, artístico",
    prompt: "vintage film color grading, faded colors, lifted blacks, organic film grain",
    use: "Fotografía editorial, retratos artísticos, bodas vintage",
    captureOne: "Curva S suave, lift en negros, reducir saturación 10-15%, film grain"
  },
  
  highKey: {
    name: "High-Key",
    description: "Tonos mayormente claros, luminoso, pocos negros profundos",
    mood: "Ligero, optimista, limpio, aireado",
    prompt: "high-key lighting and grading, bright tones, minimal shadows, airy feel",
    use: "Retratos de belleza, moda primaveral, fotografía comercial",
    captureOne: "Exposición +0.5, Highlights protegidos, Shadows lift, bajo contraste"
  },
  
  lowKey: {
    name: "Low-Key",
    description: "Tonos mayormente oscuros, dramático, negros profundos",
    mood: "Dramático, misterioso, intenso, moody",
    prompt: "low-key lighting and grading, dark moody tones, deep blacks, dramatic contrast",
    use: "Retratos dramáticos, cine noir, fotografía de carácter",
    captureOne: "Exposición -0.3, crush blacks, alto contraste, saturación selectiva"
  },
  
  warm: {
    name: "Warm Tones",
    description: "Tonos cálidos dominantes: amarillos, naranjas, rojos",
    mood: "Acogedor, íntimo, nostálgico, golden hour",
    prompt: "warm color grading, golden tones, cozy atmosphere",
    use: "Retratos íntimos, golden hour, fotografía lifestyle",
    captureOne: "WB +300K, tint +5 magenta, saturación amarillos/naranjas"
  },
  
  cool: {
    name: "Cool Tones",
    description: "Tonos fríos dominantes: azules, cyans, verdes",
    mood: "Fresco, moderno, clínico, blue hour",
    prompt: "cool color grading, blue tones, fresh modern look",
    use: "Fotografía corporativa moderna, tech, fashion editorial",
    captureOne: "WB -300K, tint +3 green, saturación azules/cyans"
  }
};

export const filmStocks = {
  portra400: {
    name: "Kodak Portra 400",
    characteristics: "Tonos piel naturales, saturación moderada, grain fino, forgiving",
    prompt: "Kodak Portra 400 film emulation, natural skin tones, subtle grain"
  },
  ektar100: {
    name: "Kodak Ektar 100",
    characteristics: "Saturación alta, grain muy fino, colores vibrantes",
    prompt: "Kodak Ektar 100 film look, vibrant saturated colors, ultra-fine grain"
  },
  hp5: {
    name: "Ilford HP5 Plus (B&W)",
    characteristics: "Blanco y negro, grain visible, contraste medio-alto",
    prompt: "Ilford HP5 Plus black and white film, visible grain, classic contrast"
  }
};

export const postProcessing = {
  contrast: {
    low: "Bajo contraste, suave, etéreo, vintage",
    medium: "Contraste medio, natural, versátil",
    high: "Alto contraste, dramático, impactante, edgy"
  },
  
  clarity: {
    negative: "Claridad negativa (-20 a -50): Suaviza, glow, ethereal",
    neutral: "Claridad 0: Natural, sin alteración de microcontraste",
    positive: "Claridad positiva (+20 a +50): Detalle, textura, HDR look"
  },
  
  grain: {
    none: "Sin grain, digital limpio, comercial moderno",
    subtle: "Grain sutil (15-25), añade textura orgánica",
    prominent: "Grain prominente (40-60), look película analógica marcado"
  }
};
