// ============================================
// OUTFITS MASCULINOS - BASADOS EN TUS FOTOS
// ============================================
// 8 estilos reales que tus usuarios SÍ usarán

export const MALE_OUTFITS = {
  total_black_formal: {
    id: 'total_black_formal',
    name: 'Total Black Formal',
    nameES: 'Negro Total Elegante',
    icon: '🖤',
    description: 'Traje completo negro + camisa negra. Elegante, misterioso, GQ.',
    
    prompt: 'wearing all-black formal suit, black blazer, black dress shirt, black tie, black trousers, monochromatic black ensemble, sleek tailored fit, sophisticated formal attire, sharp tailoring, polished black oxford shoes',
    
    mood: 'elegant, mysterious, sophisticated, powerful, GQ editorial',
    references: ['Fotos 1, 6, 14'],
  },
  
  blazer_elegante: {
    id: 'blazer_elegante',
    name: 'Blazer Elegante',
    nameES: 'Blazer Smart Casual',
    icon: '🎩',
    description: 'Blazer oscuro + camisa (blanca/burdeos). Profesional, sofisticado.',
    
    prompt: 'wearing dark tailored blazer, crisp white dress shirt or burgundy shirt, smart casual attire, well-fitted jacket, elegant trousers, polished leather shoes, sophisticated business casual look, refined styling',
    
    mood: 'professional, sophisticated, corporate, confident, executive',
    references: ['Fotos 12, 15'],
  },
  
  streetwear_urbano: {
    id: 'streetwear_urbano',
    name: 'Streetwear Urbano',
    nameES: 'Urbano Casual',
    icon: '👟',
    description: 'Sudadera + chaqueta deportiva/denim. Casual, urbano, millennials.',
    
    prompt: 'wearing urban streetwear, hoodie sweatshirt, denim jacket or bomber jacket, casual joggers or jeans, white sneakers, modern street style, layered casual outfit, contemporary urban fashion, relaxed fit',
    
    mood: 'casual, urban, modern, millennials, street style',
    references: ['Fotos 13, 17'],
  },
  
  capas_urbanas: {
    id: 'capas_urbanas',
    name: 'Capas Urbanas',
    nameES: 'Capas Invierno',
    icon: '🧥',
    description: 'Abrigo largo + sudadera + capas. Lifestyle, urbano, invernal.',
    
    prompt: 'wearing layered urban outfit, long coat or overcoat, hoodie underneath, dark jeans or trousers, white sneakers, winter layers, camel or grey wool coat, modern layered style, cold-weather fashion',
    
    mood: 'lifestyle, urban, winter, layered, contemporary',
    references: ['Fotos 13, 18, 19'],
  },
  
  dark_minimalist: {
    id: 'dark_minimalist',
    name: 'Dark Minimalist',
    nameES: 'Minimalista Oscuro',
    icon: '⚫',
    description: 'Negro total + accesorios (gafas, tattoos). Misterioso, moderno.',
    
    prompt: 'wearing all-black minimalist outfit, black t-shirt or turtleneck, black jeans or trousers, sleek sunglasses, minimal accessories, modern dark aesthetic, clean lines, monochromatic styling, edgy contemporary look',
    
    mood: 'mysterious, modern, underground, edgy, minimalist',
    references: ['Fotos 7, 10, 11, 16'],
  },
  
  smart_casual: {
    id: 'smart_casual',
    name: 'Smart Casual',
    nameES: 'Casual Elegante',
    icon: '👔',
    description: 'Blazer + jeans/pantalón oscuro. Ejecutivo casual, evening.',
    
    prompt: 'wearing smart casual ensemble, fitted blazer, dark jeans or chinos, dress shirt with open collar, leather belt, casual leather shoes or loafers, refined casual style, polished yet relaxed, evening wear',
    
    mood: 'executive casual, evening, refined, balanced, versatile',
    references: ['Fotos 12, 15'],
  },
  
  athletic_comfort: {
    id: 'athletic_comfort',
    name: 'Athletic Comfort',
    nameES: 'Deportivo Cómodo',
    icon: '🏃',
    description: 'Sudadera + joggers + sneakers. Deportivo, cómodo, Gen Z.',
    
    prompt: 'wearing athletic comfort wear, performance hoodie, jogger pants or track pants, premium athletic sneakers, sporty casual outfit, athleisure style, modern comfort fashion, breathable fabrics, relaxed athletic fit',
    
    mood: 'athletic, comfortable, sporty, Gen Z, modern casual',
    references: ['Fotos 17, 18'],
  },
  
  statement_unique: {
    id: 'statement_unique',
    name: 'Statement Piece',
    nameES: 'Pieza Única',
    icon: '🎨',
    description: 'Outfit temático/especial. Único, festivo, editorial.',
    
    prompt: 'wearing unique statement outfit, distinctive jacket or coat with elaborate patterns, bold accessories, thematic styling, editorial fashion piece, eye-catching ensemble, artistic clothing, memorable distinctive look',
    
    mood: 'unique, festive, editorial, artistic, memorable',
    references: ['Foto 9'],
  },
};

// Obtener outfit por ID
export function getMaleOutfit(outfitId) {
  return MALE_OUTFITS[outfitId] || null;
}

// Obtener todos los outfits masculinos
export function getAllMaleOutfits() {
  return Object.values(MALE_OUTFITS);
}

export default MALE_OUTFITS;
