export interface LightingSetup {
  id: string;
  name: string;
  description: string;
  technical: string;
}

export const LIGHTING_SETUPS: LightingSetup[] = [
  {
    id: "rembrandt",
    name: "Rembrandt",
    description: "Triángulo de luz característico bajo el ojo",
    technical:
      "Rembrandt lighting, key light at 45 degrees, triangle of light on cheek, dramatic shadows, classic portrait setup",
  },
  {
    id: "butterfly",
    name: "Butterfly (Paramount)",
    description: "Luz frontal desde arriba creando sombra de mariposa",
    technical:
      "Butterfly lighting, beauty lighting, key light directly above and in front, shadow under nose, glamorous Hollywood style",
  },
  {
    id: "loop",
    name: "Loop",
    description: "Pequeño loop de sombra junto a la nariz",
    technical:
      "Loop lighting, key light slightly above eye level at 30-45 degrees, small shadow loop beside nose, versatile portrait lighting",
  },
  {
    id: "split",
    name: "Split",
    description: "Divide el rostro en luz y sombra",
    technical:
      "Split lighting, key light at 90 degrees, dramatic half-lit face, high contrast, moody and edgy aesthetic",
  },
  {
    id: "broad",
    name: "Broad",
    description: "Ilumina el lado del rostro hacia la cámara",
    technical:
      "Broad lighting, illuminates the side of face toward camera, makes face appear wider, commercial photography",
  },
  {
    id: "short",
    name: "Short",
    description: "Ilumina el lado alejado de la cámara",
    technical:
      "Short lighting, illuminates the side of face away from camera, creates depth, slimming effect, artistic portraits",
  },
  {
    id: "natural-window",
    name: "Luz Natural de Ventana",
    description: "Luz suave difusa de ventana",
    technical:
      "Natural window light, soft diffused illumination, organic quality, gentle falloff, authentic and intimate feeling",
  },
  {
    id: "golden-hour",
    name: "Golden Hour",
    description: "Luz cálida dorada del atardecer",
    technical:
      "Golden hour lighting, warm sunset tones, low angle sun, soft shadows, romantic and dreamy atmosphere",
  },
  {
    id: "rim-backlight",
    name: "Rim/Backlight",
    description: "Contraluz que separa del fondo",
    technical:
      "Rim lighting, backlight separation, glowing edges, hair light, adds depth and dimension, professional studio technique",
  },
  {
    id: "low-key",
    name: "Low Key",
    description: "Iluminación dramática con sombras profundas",
    technical:
      "Low key lighting, predominantly dark tones, minimal fill light, dramatic mood, film noir aesthetic, high contrast",
  },
  {
    id: "high-key",
    name: "High Key",
    description: "Iluminación brillante y uniforme",
    technical:
      "High key lighting, bright even illumination, minimal shadows, clean white background, commercial and beauty photography",
  },
  {
    id: "chiaroscuro",
    name: "Chiaroscuro",
    description: "Contraste extremo luz-oscuridad",
    technical:
      "Chiaroscuro lighting, extreme contrast between light and dark, Renaissance painting style, dramatic and artistic",
  },
];

export const getLightingById = (id: string) => {
  return LIGHTING_SETUPS.find((setup) => setup.id === id);
};
