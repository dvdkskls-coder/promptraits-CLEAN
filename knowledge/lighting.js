// ============================================================================
// KNOWLEDGE BASE - LIGHTING
// ============================================================================
// Conocimientos sobre esquemas de iluminación profesional

export const classicSchemes = {
  rembrandt: {
    name: "Rembrandt Lighting",
    description: "Luz principal a 45° del sujeto, ligeramente elevada. Crea triángulo de luz en mejilla opuesta.",
    mood: "Dramático, clásico, volumen y carácter",
    prompt: "Rembrandt lighting with triangle of light on cheek, dramatic shadows, 45-degree key light",
    use: "Retratos profesionales, cine, fotografía dramática"
  },
  butterfly: {
    name: "Butterfly Lighting",
    description: "Luz desde arriba y frontal. Crea sombra bajo la nariz en forma de mariposa.",
    mood: "Glamuroso, define pómulos, elegante",
    prompt: "butterfly lighting from above, shadow under nose, glamorous beauty lighting",
    use: "Retratos de belleza, moda, fotografía glamour"
  },
  loop: {
    name: "Loop Lighting",
    description: "Luz a 45° y ligeramente elevada. Sombra en forma de bucle desde nariz hacia mejilla.",
    mood: "Versátil, favorecedor, menos contrastado que Rembrandt",
    prompt: "loop lighting, slight nose shadow toward cheek, flattering portrait setup",
    use: "Retratos generales, corporativos, versatilidad"
  },
  split: {
    name: "Split Lighting",
    description: "Mitad del rostro iluminado, mitad en sombra. Muy dramático.",
    mood: "Dramático, misterioso, alto contraste",
    prompt: "split lighting, one half of face in shadow, dramatic contrast",
    use: "Retratos dramáticos, arte conceptual"
  },
  broad: {
    name: "Broad Lighting",
    description: "Lado del rostro hacia la cámara está iluminado.",
    mood: "Ensancha el rostro",
    prompt: "broad lighting, camera-facing side illuminated",
    use: "Rostros delgados que se quieren ensanchar"
  },
  short: {
    name: "Short Lighting",
    description: "Lado del rostro alejado de la cámara está iluminado. Adelgaza.",
    mood: "Adelgaza, esculpe el rostro",
    prompt: "short lighting, shadow on camera-facing side, slimming effect",
    use: "Rostros anchos que se quieren adelgazar"
  }
};

export const quality = {
  soft: {
    name: "Luz Suave (Difusa)",
    description: "Sombras graduales, transiciones suaves, favorecedora",
    sources: "softbox, día nublado, ventana con cortina, luz rebotada",
    prompt: "soft diffused lighting, gentle shadows, flattering illumination",
    use: "Retratos, belleza, fotografía corporativa"
  },
  hard: {
    name: "Luz Dura",
    description: "Sombras marcadas, alto contraste, dramática",
    sources: "sol directo, flash desnudo, luz puntual sin difusor",
    prompt: "hard lighting, sharp shadows, high contrast, dramatic",
    use: "Fotografía dramática, moda edgy, arte conceptual"
  }
};

export const timeOfDay = {
  goldenHour: {
    name: "Golden Hour",
    description: "Poco después del amanecer o antes del atardecer",
    prompt: "warm golden hour light, sunset glow, magical warm tones",
    mood: "Cálido, mágico, romántico"
  },
  blueHour: {
    name: "Blue Hour",
    description: "Crepúsculo, antes del amanecer o después del atardecer",
    prompt: "blue hour lighting, twilight atmosphere, deep blue tones",
    mood: "Melancólico, sereno, cinematográfico"
  },
  midday: {
    name: "Midday",
    description: "Sol alto, mediodía",
    prompt: "harsh midday sun, overhead lighting, strong shadows",
    mood: "Duro, contrastado (evitar para retratos salvo con difusores)"
  },
  overcast: {
    name: "Overcast",
    description: "Día nublado, luz difusa natural",
    prompt: "soft overcast light, cloudy day diffusion, even illumination",
    mood: "Suave, uniforme, ideal para retratos exteriores"
  }
};

export const direction = {
  frontal: "Luz apunta directamente al sujeto. Reduce sombras, puede aplanar.",
  lateral: "Luz desde el lado. Resalta forma y textura, dramático con volumen.",
  trasera: "Contraluz desde detrás. Crea siluetas o halo (rim light).",
  cenital: "Desde arriba. Evitar en retratos (sombras en ojos). Útil para efectos.",
  uplighting: "Desde abajo. Efecto inquietante, poco natural."
};
