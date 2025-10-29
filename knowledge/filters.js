// ============================================================================
// KNOWLEDGE BASE - FILTERS
// ============================================================================
// Conocimientos sobre filtros fotográficos y cinematográficos

export const diffusion = {
  blackProMist: {
    name: "Black Pro-Mist (⭐ MÁS USADO EN CINE)",
    effect: "Suaviza imagen, crea halo en luces brillantes, look cinematográfico vs digital",
    intensities: ["1/8 (muy sutil)", "1/4 (sutil)", "1/2 (moderado)", "1 (fuerte)", "2 (muy fuerte)"],
    use: "Casi TODA película/serie moderna usa esto. Retratos, cine, moda.",
    prompt: "soft diffused highlights with Black Pro-Mist effect, cinematic halation on bright lights, organic film-like quality",
    notes: "Reduce nitidez digital, baja contraste, florece las altas luces. Intensidades bajas (1/8, 1/4) para no delatar mucho el efecto."
  },
  hollywoodBlackMagic: {
    name: "Hollywood Black Magic",
    effect: "Pro-Mist + low contrast combinado",
    prompt: "Hollywood Black Magic filter effect, combined diffusion and contrast reduction"
  },
  glimmerglass: {
    name: "Glimmerglass",
    effect: "Partículas brillantes que dan glamour",
    prompt: "Glimmerglass filter, sparkling highlights, glamorous glow effect"
  }
};

export const ndFilters = {
  purpose: "Reducir luz sin afectar color. Permite aperturas abiertas en exteriores brillantes.",
  types: {
    fixed: "ND8, ND16, ND64 - Reducción fija de pasos de luz",
    variable: "ND2-ND400 - Ajustable según necesidad",
    graduated: "ND Graduado - Oscurece cielo, mantiene tierra equilibrada"
  },
  prompt: "neutral density filter allowing wide aperture in bright conditions, balanced exposure"
};

export const polarizers = {
  cpl: {
    name: "Circular Polarizing Filter (CPL)",
    effects: [
      "Elimina reflejos en superficies no metálicas (agua, vidrio)",
      "Intensifica cielos azules",
      "Aumenta saturación de colores",
      "Reduce haze atmosférico"
    ],
    prompt: "circular polarizing filter reducing reflections, intensified sky colors, enhanced contrast",
    use: "Paisajes, arquitectura con vidrio, retratos exteriores para control de reflejos"
  }
};

export const specialEffects = {
  anamorphic: {
    name: "Anamorphic Flares",
    effect: "Destellos horizontales característicos de lentes anamórficos",
    prompt: "horizontal anamorphic lens flares, cinematic blue streaks from light sources",
    use: "Look cinematográfico, moda, retratos editoriales"
  },
  prism: {
    name: "Prism Effects",
    effect: "Efectos de prisma creando distorsiones coloridas y artísticas",
    prompt: "prismatic light refractions, rainbow color splits, artistic distortion",
    use: "Fotografía creativa, editorial fashion"
  }
};
