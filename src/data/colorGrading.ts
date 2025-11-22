export interface ColorGradingFilter {
  id: string;
  name: string;
  description: string;
  technical: string;
}

export const COLOR_GRADING_FILTERS: ColorGradingFilter[] = [
  {
    id: "cinematic-teal-orange",
    name: "Teal & Orange Cinematográfico",
    description: "Look de cine moderno con tonos teal y naranja",
    technical:
      "cinematic color grading, teal and orange color palette, Hollywood blockbuster look, warm skin tones, cool shadows",
  },
  {
    id: "film-noir",
    name: "Film Noir",
    description: "Blanco y negro de alto contraste",
    technical:
      "black and white, high contrast, film noir aesthetic, deep blacks, bright highlights, classic monochrome",
  },
  {
    id: "vintage-film",
    name: "Vintage Film",
    description: "Tonos desvanecidos estilo película antigua",
    technical:
      "vintage film look, faded colors, warm nostalgia, film grain, retro color palette, 70s photography aesthetic",
  },
  {
    id: "clean-natural",
    name: "Natural Limpio",
    description: "Colores naturales y balanceados",
    technical:
      "clean natural colors, accurate skin tones, balanced white balance, minimal color grading, true to life",
  },
  {
    id: "moody-dark",
    name: "Moody Oscuro",
    description: "Tonos oscuros y atmosféricos",
    technical:
      "moody dark color grade, desaturated tones, lifted blacks, crushed highlights, atmospheric and emotional",
  },
  {
    id: "bright-airy",
    name: "Brillante y Aireado",
    description: "Tonos claros y luminosos",
    technical:
      "bright and airy color grade, lifted shadows, soft highlights, pastel tones, dreamy and light aesthetic",
  },
  {
    id: "golden-warm",
    name: "Dorado Cálido",
    description: "Tonos cálidos dorados",
    technical:
      "golden warm color palette, enhanced yellows and oranges, sunset tones, cozy and inviting atmosphere",
  },
  {
    id: "cool-blue",
    name: "Azul Frío",
    description: "Tonos azules fríos",
    technical:
      "cool blue color grade, cyan and blue tones, cold atmosphere, Nordic aesthetic, clean and modern",
  },
  {
    id: "matte-finish",
    name: "Acabado Mate",
    description: "Look mate con negros elevados",
    technical:
      "matte finish, lifted blacks, reduced contrast, milky look, Instagram aesthetic, soft and subtle",
  },
  {
    id: "vibrant-saturated",
    name: "Vibrante Saturado",
    description: "Colores intensos y vívidos",
    technical:
      "vibrant saturated colors, punchy and bold, enhanced saturation, commercial photography look, eye-catching",
  },
  {
    id: "sepia-tone",
    name: "Sepia",
    description: "Tonos sepia vintage",
    technical:
      "sepia tone, warm brown monochrome, vintage photograph aesthetic, nostalgic and timeless",
  },
  {
    id: "cross-processed",
    name: "Cross-Process",
    description: "Efecto de procesado cruzado",
    technical:
      "cross-processed look, shifted colors, unusual color casts, experimental aesthetic, artistic and edgy",
  },
];

export const getColorGradingById = (id: string) => {
  return COLOR_GRADING_FILTERS.find((filter) => filter.id === id);
};
