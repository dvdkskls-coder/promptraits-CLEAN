export interface Outfit {
  id: string;
  name: string;
  description: string;
  gender: "masculine" | "feminine" | "unisex";
  prompt: string;
}

export const OUTFITS: Outfit[] = [
  {
    id: "casual-jeans-tshirt",
    name: "Casual - Jeans y Camiseta",
    description: "Look casual relajado",
    gender: "unisex",
    prompt:
      "casual outfit, blue jeans and t-shirt, relaxed fit, comfortable streetwear, everyday style",
  },
  {
    id: "business-formal",
    name: "Formal de Negocios",
    description: "Traje formal profesional",
    gender: "unisex",
    prompt:
      "formal business suit, tailored fit, professional attire, crisp white shirt, polished shoes, corporate style",
  },
  {
    id: "elegant-dress",
    name: "Vestido Elegante",
    description: "Vestido formal elegante",
    gender: "feminine",
    prompt:
      "elegant evening dress, flowing fabric, sophisticated style, formal gown, refined fashion",
  },
  {
    id: "leather-jacket",
    name: "Chaqueta de Cuero",
    description: "Look rockero con chaqueta de cuero",
    gender: "unisex",
    prompt:
      "leather jacket, edgy style, rock and roll aesthetic, black leather, rebellious fashion",
  },
  {
    id: "summer-dress",
    name: "Vestido de Verano",
    description: "Vestido ligero y fresco",
    gender: "feminine",
    prompt:
      "summer dress, light fabric, floral patterns, breezy and comfortable, vacation style",
  },
  {
    id: "smart-casual",
    name: "Smart Casual",
    description: "Elegante pero relajado",
    gender: "unisex",
    prompt:
      "smart casual outfit, blazer with jeans, polished yet relaxed, modern professional style",
  },
  {
    id: "athletic-sporty",
    name: "Deportivo",
    description: "Ropa deportiva moderna",
    gender: "unisex",
    prompt:
      "athletic sportswear, performance clothing, modern activewear, fitness fashion, dynamic style",
  },
  {
    id: "bohemian",
    name: "Bohemio",
    description: "Estilo boho chic",
    gender: "feminine",
    prompt:
      "bohemian style, flowing fabrics, earthy tones, free-spirited fashion, boho chic aesthetic",
  },
  {
    id: "minimalist-modern",
    name: "Minimalista Moderno",
    description: "Diseño limpio y minimalista",
    gender: "unisex",
    prompt:
      "minimalist modern outfit, clean lines, neutral colors, simple elegance, contemporary fashion",
  },
  {
    id: "vintage-retro",
    name: "Vintage Retro",
    description: "Estilo retro de los 70s-80s",
    gender: "unisex",
    prompt:
      "vintage retro outfit, 70s-80s fashion, nostalgic style, classic patterns, timeless look",
  },
  {
    id: "streetwear-urban",
    name: "Streetwear Urbano",
    description: "Moda urbana de calle",
    gender: "unisex",
    prompt:
      "urban streetwear, oversized hoodie, sneakers, hip-hop fashion, contemporary street style",
  },
  {
    id: "cocktail-attire",
    name: "Cóctel",
    description: "Vestimenta semi-formal para eventos",
    gender: "feminine",
    prompt:
      "cocktail dress, semi-formal attire, party outfit, elegant yet fun, evening wear",
  },
];

export const getOutfitsByGender = (
  gender: "masculine" | "feminine" | "couple" | "animal" | "unisex"
) => {
  if (gender === "unisex" || gender === "couple" || gender === "animal") {
    return OUTFITS.filter((outfit) => outfit.gender === "unisex");
  }
  return OUTFITS.filter(
    (outfit) => outfit.gender === gender || outfit.gender === "unisex"
  );
};

export const getOutfitById = (id: string) => {
  return OUTFITS.find((outfit) => outfit.id === id);
};
