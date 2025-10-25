// ============================================
// PRESETS DE ILUMINACIÓN PROFESIONAL
// ============================================
// 6 estilos de iluminación basados en tus fotos reales

export const LIGHTING_PRESETS = {
  rembrandt_classic: {
    id: 'rembrandt_classic',
    name: 'Rembrandt Clásico',
    nameEN: 'Classic Rembrandt',
    icon: '🎭',
    description: 'Luz 45°, triángulo en mejilla. Dramático, profesional, atemporal.',
    
    prompt: 'Rembrandt lighting setup, key light at 45-degree angle, characteristic triangle of light on cheek, 3:1 lighting ratio, dramatic side lighting, classic portrait lighting, defined shadows, professional studio lighting, chiaroscuro effect, sculpted facial features',
    
    technical: {
      keyLight: '45° angle, slightly above eye level',
      ratio: '3:1 (key to fill)',
      shadows: 'Triangle on shadow-side cheek',
      mood: 'Dramatic, professional, timeless',
    },
    
    references: ['Fotos 6, 12, 15'],
    useCases: ['formal portraits', 'professional headshots', 'dramatic portraits'],
  },
  
  window_natural: {
    id: 'window_natural',
    name: 'Ventana Natural',
    nameEN: 'Natural Window Light',
    icon: '🪟',
    description: 'Luz ventana lateral suave. Natural, flattering, editorial.',
    
    prompt: 'soft window light from side, natural diffused lighting, gentle wrap-around light, soft shadows, flattering natural illumination, window as key light source, 2:1 lighting ratio, editorial lighting quality, subtle gradation, organic light fall-off',
    
    technical: {
      source: 'Large window, north-facing ideal',
      ratio: '2:1 (key to ambient)',
      quality: 'Soft, diffused, flattering',
      mood: 'Natural, editorial, gentle',
    },
    
    references: ['Fotos 2, 4, 8'],
    useCases: ['natural portraits', 'editorial shots', 'soft beauty'],
  },
  
  dramatic_chiaroscuro: {
    id: 'dramatic_chiaroscuro',
    name: 'Dramático Chiaroscuro',
    nameEN: 'Dramatic Chiaroscuro',
    icon: '⚫⚪',
    description: 'Contraste extremo luz/sombra. Misterioso, cinematográfico, intenso.',
    
    prompt: 'dramatic chiaroscuro lighting, extreme light and shadow contrast, single hard light source, deep blacks and bright highlights, high-contrast lighting, cinematic dramatic illumination, minimal fill light, bold shadows, noir-style lighting, mysterious atmosphere',
    
    technical: {
      contrast: 'Extreme (10:1 or higher)',
      source: 'Single hard light, spotlight',
      fill: 'Minimal or none',
      mood: 'Mysterious, dramatic, cinematic',
    },
    
    references: ['Fotos 6, 7'],
    useCases: ['dramatic portraits', 'noir style', 'mysterious mood'],
  },
  
  golden_hour: {
    id: 'golden_hour',
    name: 'Golden Hour',
    nameEN: 'Golden Hour Exterior',
    icon: '🌅',
    description: 'Luz dorada atardecer, bokeh. Cálido, romántico, lifestyle.',
    
    prompt: 'golden hour natural lighting, warm sunset glow, soft golden backlight, beautiful bokeh in background, warm color temperature (3000-4000K), rim lighting from sun, glowing atmospheric light, magical hour quality, soft warm shadows, dreamy outdoor lighting',
    
    technical: {
      time: '1 hour before sunset',
      temperature: '3000-4000K (warm)',
      quality: 'Soft, directional, warm',
      mood: 'Warm, romantic, dreamy',
    },
    
    references: ['Fotos 3, 18'],
    useCases: ['lifestyle portraits', 'romantic shots', 'outdoor editorial'],
  },
  
  neon_urban: {
    id: 'neon_urban',
    name: 'Neón Urbano',
    nameEN: 'Urban Neon',
    icon: '🌃',
    description: 'Luces neón cyan/teal. Moderno, cinematográfico, Blade Runner.',
    
    prompt: 'urban neon lighting, cyan and teal color palette, modern cinematic lighting, neon lights as accents, cool color temperature, futuristic urban atmosphere, Blade Runner aesthetic, moody neon glow, contemporary city lighting, dramatic color contrast',
    
    technical: {
      colors: 'Cyan, teal, blue, magenta accents',
      temperature: '6000-8000K (cool)',
      style: 'Mixed practical + ambient',
      mood: 'Modern, cinematic, urban',
    },
    
    references: ['Foto 16'],
    useCases: ['urban portraits', 'modern editorial', 'cinematic mood'],
  },
  
  overcast_soft: {
    id: 'overcast_soft',
    name: 'Overcast Suave',
    nameEN: 'Soft Overcast',
    icon: '☁️',
    description: 'Luz difusa día nublado. Suave, editorial, urbano.',
    
    prompt: 'soft overcast daylight, diffused natural lighting, even illumination, cloudy day light quality, gentle shadows, flattering editorial lighting, muted ambient light, soft wrap-around illumination, minimal contrast, contemporary outdoor lighting',
    
    technical: {
      condition: 'Overcast sky, cloudy day',
      quality: 'Extremely soft, even',
      contrast: 'Low (1:1.5 ratio)',
      mood: 'Soft, editorial, modern',
    },
    
    references: ['Fotos 13, 14, 17, 19'],
    useCases: ['editorial portraits', 'urban lifestyle', 'soft outdoor shots'],
  },
};

// Obtener preset por ID
export function getLightingPreset(presetId) {
  return LIGHTING_PRESETS[presetId] || null;
}

// Obtener todos los presets
export function getAllLightingPresets() {
  return Object.values(LIGHTING_PRESETS);
}

export default LIGHTING_PRESETS;
