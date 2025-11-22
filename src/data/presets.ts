export interface Preset {
  id: string;
  name: string;
  description: string;
  prompt: string;
  category: string;
}

export const PRESETS: Preset[] = [
  {
    id: "1",
    name: "Retrato Cinematográfico",
    description: "Estilo película, dramático y profesional",
    prompt:
      "Professional cinematic portrait, dramatic lighting, shallow depth of field, shot on Arri Alexa with anamorphic lens, film grain texture, moody atmosphere, color graded like a Hollywood movie, 4K resolution, professional makeup and styling",
    category: "Cinematográfico",
  },
  {
    id: "2",
    name: "Editorial de Moda",
    description: "Alta costura, limpio y elegante",
    prompt:
      "High fashion editorial portrait, studio lighting setup, clean white background, sharp focus, shot on Hasselblad H6D-100c with 80mm lens, professional makeup, vogue magazine style, high-end retouching, ultra detailed, 8K quality",
    category: "Moda",
  },
  {
    id: "3",
    name: "Luz Natural Dorada",
    description: "Cálido, suave y orgánico",
    prompt:
      "Natural light portrait, golden hour photography, soft warm tones, bokeh background, shot on Canon EOS R5 with 85mm f/1.2 lens, shallow depth of field, film-like color grading, organic and authentic feel, professional color correction",
    category: "Natural",
  },
  {
    id: "4",
    name: "Street Style Urbano",
    description: "Moderno, fresco y auténtico",
    prompt:
      "Urban street style portrait, natural city lighting, graffiti background, candid pose, shot on Sony A7 III with 35mm lens, vibrant colors, documentary photography style, authentic urban environment, professional editing",
    category: "Urbano",
  },
  {
    id: "5",
    name: "Film Noir Clásico",
    description: "Alto contraste, misterioso",
    prompt:
      "Film noir style portrait, dramatic shadows, high contrast black and white, venetian blind shadows, moody atmosphere, shot on vintage film camera, 1940s aesthetic, dramatic lighting setup, mystery and intrigue",
    category: "Vintage",
  },
];

export const getPresetById = (id: string) => {
  return PRESETS.find((p) => p.id === id) || null;
};
