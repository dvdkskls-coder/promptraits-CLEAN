// ============================================================================
// KNOWLEDGE BASE - LENSES
// ============================================================================
// Conocimientos sobre lentes y especificaciones técnicas

export const lenses = {
  "24-35mm": {
    type: "Gran angular",
    characteristics: "Captura más contexto, ligera distorsión en rostros si muy cerca",
    use: "Paisajes, arquitectura, retratos ambientales",
    prompt: "24mm wide angle lens, environmental context, slight perspective distortion"
  },
  "50mm": {
    type: "Normal (visión ojo humano)",
    characteristics: "Versátil, perspectiva natural",
    use: "Todo tipo de fotografía, street, retratos",
    aperture: "f/1.4, f/1.8 muy común",
    prompt: "50mm f/1.8 lens, natural perspective, versatile framing"
  },
  "85mm": {
    type: "Retrato clásico - REY DEL RETRATO",
    characteristics: "Compresión favorable, bokeh hermoso, perspectiva halagadora",
    use: "Retratos profesionales, headshots, moda",
    aperture: "f/1.2, f/1.4, f/1.8, f/2",
    prompt: "85mm f/1.2 lens, shallow depth of field, creamy bokeh, professional portrait",
    notes: "El más usado en retratos profesionales"
  },
  "135-200mm": {
    type: "Teleobjetivo",
    characteristics: "Gran compresión, aísla sujeto del fondo",
    use: "Retratos íntimos, moda, detalles",
    prompt: "135mm telephoto lens, strong compression, isolated subject"
  }
};

export const apertures = {
  "f/1.2": "Apertura máxima extrema. Bokeh cremoso. Profundidad de campo muy reducida. Para retratos íntimos.",
  "f/1.4": "Gran apertura. Bokeh hermoso. PDC reducida. Clásico para retratos.",
  "f/1.8": "Apertura amplia. Buen bokeh. PDC limitada. Versátil y común.",
  "f/2.8": "Apertura media-amplia. Bokeh moderado. Más PDC. Bueno para grupos pequeños.",
  "f/4": "Apertura media. Más nitidez. PDC moderada. Para retratos de cuerpo completo.",
  "f/5.6-f/8": "Apertura media-cerrada. Mayor PDC. Bueno para contexto ambiental.",
  "f/11-f/16": "Apertura cerrada. Gran PDC. Paisajes, arquitectura con retratos."
};

export const cameraSpecs = {
  sensors: {
    fullFrame: "Full-frame sensor (35mm), mejor en poca luz, mayor bokeh, más rango dinámico",
    apsc: "APS-C sensor, crop factor ~1.5x, más económico, buen equilibrio",
    mediumFormat: "Medium format sensor, máxima resolución y calidad, profesional editorial"
  },
  iso: {
    low: "ISO 100-400: Máxima calidad, mínimo ruido, requiere buena luz",
    medium: "ISO 800-1600: Equilibrio calidad/sensibilidad, versátil",
    high: "ISO 3200+: Poca luz, más ruido, procesamiento necesario"
  },
  shutterSpeed: {
    fast: "1/500s - 1/8000s: Congelar movimiento, acción, deportes",
    standard: "1/125s - 1/250s: Retratos generales, mínimo movimiento",
    slow: "1/60s - 1/15s: Motion blur intencional, poca luz con estabilización"
  }
};
