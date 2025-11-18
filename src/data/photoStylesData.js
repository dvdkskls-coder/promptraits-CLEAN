// src/data/photoStylesData.js
// ESTRUCTURA APLANADA Y TRADUCIDA PARA COMPATIBILIDAD CON LA UI

export const PHOTO_STYLES = [
  // Anteriormente "A. Professional Photographic Styles"
  {
    id: "classic_portrait",
    name: "Retrato Clásico",
    description:
      "Timeless style, soft lighting, elegant poses, balanced composition; ideal for formal portraits.",
  },
  {
    id: "fine_art_portrait",
    name: 'Retrato "Fine Art"',
    description:
      "Artistic aesthetic, soft tones, painterly light, Renaissance inspiration; emphasis on emotion and atmosphere.",
  },
  {
    id: "editorial_portrait",
    name: "Retrato Editorial",
    description:
      "Magazine style; elaborate lighting, fashion, attitude, drama; visually-driven storytelling.",
  },
  {
    id: "fashion_portrait",
    name: "Retrato de Moda",
    description:
      "Clothing is the focus, stylized poses, clean or dramatic lighting, runway/editorial aesthetic.",
  },
  {
    id: "beauty_portrait",
    name: 'Retrato "Beauty"',
    description:
      "Perfect close-ups of the face; focus on skin, makeup, flawlessness, and symmetry.",
  },
  {
    id: "corporate_portrait",
    name: "Retrato Corporativo / de Negocios",
    description:
      "Formal, professional, neutral background or office environment; conveys trust and leadership.",
  },
  {
    id: "lifestyle_portrait",
    name: 'Retrato "Lifestyle"',
    description:
      "Natural, spontaneous, soft light; captures the person's lifestyle in their real environment.",
  },
  {
    id: "environmental_portrait",
    name: "Retrato Ambiental",
    description:
      "The environment tells part of the subject's story; includes tools, places, and context.",
  },
  {
    id: "documentary_portrait",
    name: "Retrato Documental",
    description:
      "Real, unposed; shows the subject's life as it is; emotional and authentic.",
  },
  {
    id: "conceptual_portrait",
    name: "Retrato Conceptual",
    description:
      "A visual idea behind the image: metaphors, symbolism, surreal or creative elements.",
  },
  // Anteriormente "B. Emotional & Mood-Based Portraits"
  {
    id: "dramatic_portrait",
    name: "Retrato Dramático",
    description:
      "Deep shadows, hard or directional light; intense emotions, visual tension.",
  },
  {
    id: "cinematic_portrait",
    name: "Retrato Cinematográfico",
    description:
      "Film-like color grading, directional light, atmosphere; visual storytelling and strong mood.",
  },
  {
    id: "psychochromatic_portrait",
    name: "Retrato Psicocromático",
    description: "Use of emotional color to convey specific feelings.",
  },
  {
    id: "melancholic_portrait",
    name: "Retrato Melancólico",
    description:
      "Cool tones, introspective expressions, low saturation, emotional depth.",
  },
  {
    id: "vibrant_portrait",
    name: "Retrato Alegre / Vibrante",
    description:
      "Bright colors, open expressions, soft or bright light, positive mood.",
  },
  // Anteriormente "C. Lighting & Atmosphere Portraits"
  {
    id: "high_key_portrait",
    name: "Retrato en Clave Alta (High Key)",
    description:
      "Very bright, white backgrounds, soft shadows; clean and positive look.",
  },
  {
    id: "low_key_portrait",
    name: "Retrato en Clave Baja (Low Key)",
    description:
      "Dark, intense shadows, minimal light; deep and dramatic aesthetic.",
  },
  {
    id: "natural_light_portrait",
    name: "Retrato con Luz Natural",
    description:
      "Soft, organic light; ideal for lifestyle and emotional portraits.",
  },
  {
    id: "neon_light_portrait",
    name: "Retrato con Luz de Neón",
    description:
      "Vibrant colors, cyan/pink contrast; urban and futuristic look.",
  },
  {
    id: "chiaroscuro_portrait",
    name: "Retrato Closcuro (Chiaroscuro)",
    description: "Caravaggio style; extreme contrast between light and shadow.",
  },
  {
    id: "color_gel_portrait",
    name: "Retrato con Geles de Color",
    description: "Creative, impactful colors; modern and design-oriented look.",
  },
  {
    id: "backlit_portrait",
    name: "Retrato a Contraluz (Backlit)",
    description: "Luminous halo around the subject, ethereal feeling.",
  },
  // Anteriormente "D. Beauty, Makeup, or Fashion Styles"
  {
    id: "glamour_portrait",
    name: 'Retrato "Glamour"',
    description: "Strong makeup, glowing skin, elegant poses; luxurious look.",
  },
  {
    id: "haute_couture_portrait",
    name: "Retrato de Alta Costura",
    description: "High fashion, elaborate compositions, artistic aesthetic.",
  },
  {
    id: "editorial_beauty_portrait",
    name: 'Retrato "Beauty" Editorial',
    description: "Very detailed, perfect for magazines, flawless skin.",
  },
  {
    id: "avant_garde_fashion",
    name: "Retrato de Moda Vanguardista",
    description: "Creative, experimental, extreme accessories, bold styling.",
  },
  // Anteriormente "E. Cinematic & Dramatic Styles"
  {
    id: "noir_portrait",
    name: 'Retrato "Noir" (Cine Negro)',
    description:
      "Hard shadows, high-contrast black and white, film noir atmosphere.",
  },
  {
    id: "cyberpunk_portrait",
    name: 'Retrato "Cyberpunk"',
    description:
      "Neon lights, magenta/cyan color grading, futuristic urban vibe.",
  },
  {
    id: "retro_vintage_portrait",
    name: "Retrato Retro / Vintage",
    description: "Warm tones, halation, grain; analog aesthetic.",
  },
  {
    id: "70s_80s_90s_portrait",
    name: "Retrato Años 70 / 80 / 90",
    description: "Color, fashion, and aesthetic typical of each decade.",
  },
  {
    id: "post_apocalyptic_portrait",
    name: "Retrato Post-Apocalíptico",
    description:
      "Gritty, desaturated look, green or gray tones; strong narrative.",
  },
  {
    id: "steampunk_portrait",
    name: 'Retrato "Steampunk"',
    description:
      "Victorian industrial aesthetic, mechanical accessories, bronze tones.",
  },
  // Anteriormente "F. Modern Perspectives & Aesthetics"
  {
    id: "minimalist_portrait",
    name: "Retrato Minimalista",
    description: "Clean background, few elements, absolute simplicity.",
  },
  {
    id: "geometric_portrait",
    name: "Retrato Geométrico",
    description: "Composition based on shapes, lines, and patterns.",
  },
  {
    id: "abstract_portrait",
    name: "Retrato Abstracto",
    description:
      "Distortion, color, fragmentation; not necessarily recognizable.",
  },
  {
    id: "expressionist_portrait",
    name: "Retrato Expresionista",
    description: "Emphasis on emotion and color over realistic precision.",
  },
  {
    id: "surrealist_portrait",
    name: "Retrato Surrealista",
    description: "Incorporates impossible elements, a dreamlike composition.",
  },
  // Anteriormente "G. Photographic Technique Portraits"
  {
    id: "long_exposure_portrait",
    name: "Retrato de Larga Exposición",
    description: "Smooth movements, light painting, ethereal effect.",
  },
  {
    id: "direct_flash_portrait",
    name: "Retrato con Flash Directo",
    description: "Raw look, paparazzi or edgy fashion style.",
  },
  {
    id: "extreme_dof_portrait",
    name: "Retrato Profundidad de Campo Extrema (f/1.2)",
    description: "Exaggerated bokeh, dreamlike atmosphere.",
  },
  {
    id: "hdr_portrait",
    name: "Retrato HDR",
    description: "High dynamic range, detail in both shadows and highlights.",
  },
  {
    id: "monochromatic_portrait",
    name: "Retrato Monocromático",
    description: "Pure black and white; focus on texture and expression.",
  },
  {
    id: "film_look_portrait",
    name: "Retrato Look Analógico / Cine",
    description: "Grain, organic color, characteristic imperfections.",
  },
  // Anteriormente "H. Subject or Context Portraits"
  {
    id: "professional_headshot",
    name: "Headshot Profesional / de Actor",
    description:
      "Total facial clarity, neutral, ideal for actors or professionals.",
  },
  {
    id: "family_portrait",
    name: "Retrato Familiar",
    description: "Warmth, connection, emotional gestures, soft tones.",
  },
  {
    id: "child_portrait",
    name: "Retrato Infantil",
    description: "Spontaneous, natural, soft light, authentic expressions.",
  },
  {
    id: "couple_portrait",
    name: "Retrato de Pareja",
    description: "Evident emotional connection, intimate or natural poses.",
  },
  {
    id: "celebrity_portrait",
    name: "Retrato de Celebridad",
    description: "High-end editorial, careful production, iconic identity.",
  },
  // Anteriormente "I. AI & Prompt Engineering Styles"
  {
    id: "hyperrealistic_portrait",
    name: "Retrato Hiperrealista",
    description: "Extreme level of detail, realistic skin, complex textures.",
  },
  {
    id: "raw_photo_portrait",
    name: "Retrato Fotográfico (RAW)",
    description: "Pure, unedited look: natural contrast, true-to-life tones.",
  },
  {
    id: "cinematic_style_portrait",
    name: "Retrato Cinematográfico (Estilo)",
    description: "Film tones, long lenses, narrative atmosphere.",
  },
  {
    id: "ultra_detailed_studio",
    name: "Retrato de Estudio Ultra Detallado",
    description: "High-end studio, maximum sharpness, total light control.",
  },
  {
    id: "painterly_portrait_style",
    name: "Retrato Pictórico (Painterly)",
    description: "Inspired by painting; brushstroke or artistic texture.",
  },
];
