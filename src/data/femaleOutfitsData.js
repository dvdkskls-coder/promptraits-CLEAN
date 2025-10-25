// ============================================
// OUTFITS FEMENINOS - BASADOS EN TUS FOTOS
// ============================================
// 6 estilos reales elegantes y versátiles

export const FEMALE_OUTFITS = {
  elegant_minimal: {
    id: 'elegant_minimal',
    name: 'Elegant Minimal',
    nameES: 'Minimalista Elegante',
    icon: '✨',
    description: 'Top/vestido negro simple. Sofisticado, atemporal.',
    
    prompt: 'wearing elegant minimal black dress or top, simple clean lines, sophisticated silhouette, timeless black outfit, refined styling, understated elegance, classic minimalist fashion, delicate jewelry, polished look, professional makeup',
    
    mood: 'sophisticated, timeless, elegant, minimalist, refined',
    references: ['Foto 4'],
  },
  
  off_shoulder_romantic: {
    id: 'off_shoulder_romantic',
    name: 'Off-Shoulder Romantic',
    nameES: 'Romántico Hombros',
    icon: '💕',
    description: 'Tops descubiertos, lunares/patterns. Romántico, femenino.',
    
    prompt: 'wearing off-shoulder romantic top, polka dots or elegant pattern, bare shoulders, feminine silhouette, flowing fabric, romantic styling, delicate details, soft makeup, wavy hair, elegant jewelry, graceful look',
    
    mood: 'romantic, feminine, soft, elegant, charming',
    references: ['Foto 2'],
  },
  
  layered_chic: {
    id: 'layered_chic',
    name: 'Layered Chic',
    nameES: 'Capas Urbanas',
    icon: '🧥',
    description: 'Abrigo + capas urbanas. Urbano, moderno.',
    
    prompt: 'wearing urban layered outfit, elegant coat or blazer, sophisticated layers, modern urban fashion, tailored outerwear, chic city style, contemporary feminine look, polished styling, professional makeup, elegant accessories',
    
    mood: 'urban, modern, sophisticated, chic, contemporary',
    references: ['Foto 3'],
  },
  
  business_elegant: {
    id: 'business_elegant',
    name: 'Business Elegant',
    nameES: 'Ejecutiva Elegante',
    icon: '💼',
    description: 'Blazer + falda/pantalón. Profesional, elegante.',
    
    prompt: 'wearing business elegant attire, tailored blazer, pencil skirt or elegant trousers, professional styling, refined corporate look, sophisticated outfit, polished accessories, professional makeup, confident posture, executive fashion',
    
    mood: 'professional, elegant, confident, executive, polished',
    references: ['Basado en estilo observado'],
  },
  
  boho_natural: {
    id: 'boho_natural',
    name: 'Boho Soft',
    nameES: 'Bohemio Natural',
    icon: '🌸',
    description: 'Texturas suaves, colores tierra. Natural, relajado.',
    
    prompt: 'wearing soft boho outfit, flowing natural fabrics, earth tones, relaxed feminine style, soft textures, natural bohemian fashion, effortless elegance, minimal jewelry, natural makeup, soft waves hair, comfortable chic',
    
    mood: 'natural, relaxed, bohemian, soft, effortless',
    references: ['Estilo complementario'],
  },
  
  statement_evening: {
    id: 'statement_evening',
    name: 'Statement Evening',
    nameES: 'Noche Elegante',
    icon: '🌙',
    description: 'Vestido elegante, escote, joyería. Gala, sofisticado.',
    
    prompt: 'wearing elegant evening dress, sophisticated neckline, statement jewelry, formal evening attire, glamorous styling, refined makeup, elegant hairstyle, polished accessories, luxurious fabric, gala-worthy ensemble',
    
    mood: 'glamorous, sophisticated, evening, elegant, formal',
    references: ['Estilo elevado'],
  },
};

// Obtener outfit por ID
export function getFemaleOutfit(outfitId) {
  return FEMALE_OUTFITS[outfitId] || null;
}

// Obtener todos los outfits femeninos
export function getAllFemaleOutfits() {
  return Object.values(FEMALE_OUTFITS);
}

export default FEMALE_OUTFITS;
