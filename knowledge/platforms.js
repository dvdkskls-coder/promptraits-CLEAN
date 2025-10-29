// ============================================================================
// KNOWLEDGE BASE - PLATFORMS
// ============================================================================
// Conocimientos sobre estructura de prompts para diferentes plataformas

export const platforms = {
  nanoBanana: {
    name: "Nano-Banana (Google Gemini)",
    components: [
      "1. Sujeto: When NO image: describe person (age, gender, traits). When WITH image: ONLY pose, expression, outfit (NEVER physical traits)",
      "2. Estilo: Fotorrealista, cinematográfico, ilustración, etc.",
      "3. Detalles Técnicos: Cámara, lente (ej: Canon 85mm f/1.2), apertura",
      "4. Iluminación: Tipo (Rembrandt, Butterfly, etc.), dirección, calidad",
      "5. Composición: Encuadre (close-up, medium shot), ángulo (eye level, low angle)",
      "6. Contexto/Fondo: Entorno, nivel de desenfoque",
      "7. Atmósfera/Mood: Tono emocional (cálido, dramático, sereno)",
      "8. Orientación: 'vertical portrait format' o 'wide horizontal composition'"
    ],
    rules: {
      noNegativePrompts: true,
      optimalLength: "1000-1800 caracteres (ideal: 1200-1600)",
      maxLength: "2500 caracteres",
      format: "Un párrafo continuo y fluido",
      conversational: true,
      specifyOrientation: true
    },
    notes: "NO soporta prompts negativos. Usa contexto conversacional. Por defecto genera 1:1 (cuadrado)."
  },
  
  midjourney: {
    name: "Midjourney V7",
    components: [
      "[Sujeto detallado] + [Estilo] + [Iluminación] + [Composición] + [Ambiente] + [Parámetros]"
    ],
    parameters: {
      aspectRatio: "--ar [ratio] (1:1, 3:4, 4:3, 16:9, 9:16)",
      version: "--v [4-7] (default: 7)",
      stylize: "--s [0-1000] (0-50: literal, 100: default, 200-1000: artístico)",
      quality: "--q [0.25, 0.5, 1, 2] (default: 1)",
      chaos: "--c [0-100] (variedad entre resultados)",
      seed: "--seed [número] (reproducibilidad)",
      negative: "--no [elementos] (lo que NO quieres)",
      weird: "--weird [0-3000] (elementos inusuales)",
      imageWeight: "--iw [0.5-3] (influencia de imagen referencia)"
    },
    rules: {
      parametersAtEnd: true,
      spaceSeparated: true,
      noCommasBetweenParams: true,
      detailedPrompts: true,
      photorealismStylize: "0-100",
      conceptArtStylize: "200-1000"
    },
    notes: "Parámetros al FINAL separados por espacios. Seed para reproducibilidad exacta."
  }
};

export const commonMistakes = {
  nanoBanana: [
    "❌ NO usar prompts negativos (NO FUNCIONAN en nano-banana)",
    "❌ NO hacer prompts excesivamente largos (>2500 caracteres)",
    "❌ NO usar términos contradictorios ('iluminación brillante y oscura')",
    "✅ SÍ especificar encuadre y ángulo claramente",
    "✅ SÍ usar orientación específica ('vertical portrait format')",
    "✅ SÍ mantener coherencia en la descripción",
    "✅ SÍ usar contexto conversacional"
  ],
  midjourney: [
    "❌ NO poner parámetros al principio (van al FINAL)",
    "❌ NO usar comas entre parámetros (solo espacios)",
    "❌ NO usar operadores de búsqueda ('-', 'site:', comillas)",
    "✅ SÍ ser más explícito y detallado que en V4",
    "✅ SÍ especificar versión si no quieres V7 (--v 6)",
    "✅ SÍ usar --s bajo (0-100) para fotorrealismo",
    "✅ SÍ usar --seed para reproducibilidad exacta"
  ],
  general: [
    "❌ NO describir el equipo físico de iluminación que aparecería en la imagen (softbox, umbrella)",
    "✅ SÍ describir la CALIDAD y EFECTO de la luz (soft, hard, diffused, directional)",
    "❌ NO usar descripciones genéricas ('foto bonita de una mujer')",
    "✅ SÍ ser específico con todos los elementos (edad, rasgos, iluminación, técnica)"
  ]
};
