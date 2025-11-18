// lightingData.js - Esquemas de iluminación profesional
// ESTRUCTURA APLANADA Y TRADUCIDA PARA COMPATIBILIDAD CON LA UI

export const LIGHTING_SETUPS = [
  // Anteriormente "A. Source & Type"
  {
    id: "natural_light",
    name: "Luz Natural",
    description: "Light from the sun, outdoors or indoors.",
  },
  {
    id: "artificial_light",
    name: "Luz Artificial",
    description: "Light from man-made devices (lamps, flashes).",
  },
  {
    id: "mixed_light",
    name: "Luz Mixta",
    description: "Combination of natural and artificial light.",
  },
  {
    id: "continuous_light",
    name: "Luz Continua",
    description: "Constant light source, effect is visible in real-time.",
  },
  {
    id: "flash_strobe",
    name: "Flash / Estroboscópica",
    description: "Brief, intense burst of light from a flash unit.",
  },
  {
    id: "ambient_light",
    name: "Luz Ambiente",
    description: "The existing light in a scene without additions.",
  },
  {
    id: "available_light",
    name: "Luz Disponible",
    description: "Using only the light already present in the scene.",
  },
  // Anteriormente "B. Direction"
  {
    id: "front_light",
    name: "Luz Frontal",
    description: "Light from the front, reduces shadows and texture.",
  },
  {
    id: "side_light",
    name: "Luz Lateral",
    description: "Light from the side, creates strong shadows and volume.",
  },
  {
    id: "backlight",
    name: "Contraluz",
    description:
      "Light from behind, creates a halo, silhouette, or rim effect.",
  },
  {
    id: "top_light",
    name: "Luz Superior (Cenital)",
    description: "Light from above, creates drama and shadows under eyes.",
  },
  {
    id: "bottom_light",
    name: "Luz Inferior (Nadir)",
    description: "Light from below, for an unsettling or dramatic effect.",
  },
  {
    id: "classic_45_degree",
    name: "Luz Clásica a 45°",
    description: "Standard portrait light at a 45° angle to the subject.",
  },
  {
    id: "grazing_light",
    name: "Luz Rasante",
    description: "Very low side light that emphasizes texture.",
  },
  // Anteriormente "C. Classic Portrait Schemes"
  {
    id: "rembrandt",
    name: "Iluminación Rembrandt",
    description:
      "Creates a triangle of light on the cheek opposite the light source.",
  },
  {
    id: "split",
    name: "Iluminación Dividida (Split)",
    description: "Splits the face into two halves: one lit, one in shadow.",
  },
  {
    id: "loop",
    name: "Iluminación Loop",
    description: "Creates a small, circular shadow of the nose on the cheek.",
  },
  {
    id: "butterfly",
    name: "Iluminación Mariposa (Butterfly)",
    description: "Creates a butterfly-shaped shadow under the nose.",
  },
  {
    id: "clamshell",
    name: "Iluminación Clamshell (Concha)",
    description:
      "Top light plus a reflector below, softens skin for beauty shots.",
  },
  {
    id: "broad",
    name: "Iluminación Amplia (Broad)",
    description: "The side of the face turned toward the camera is lit.",
  },
  {
    id: "short",
    name: "Iluminación Corta (Short)",
    description:
      "The side of the face turned away from the camera is lit; slimming.",
  },
  // Anteriormente "D. Cinematic Schemes"
  {
    id: "three_point",
    name: "Iluminación de Tres Puntos",
    description: "Standard setup with Key, Fill, and Backlight.",
  },
  {
    id: "key_light",
    name: "Luz Principal (Key Light)",
    description: "The main light that models the subject.",
  },
  {
    id: "fill_light",
    name: "Luz de Relleno (Fill Light)",
    description: "Softens shadows created by the key light.",
  },
  {
    id: "rim_light_cinematic",
    name: "Contraluz / Luz de Borde (Rim Light)",
    description:
      "Separates the subject from the background with an edge of light.",
  },
  {
    id: "practical_light",
    name: "Luz Práctica (en escena)",
    description: "Light sources visible in the scene (lamps, candles).",
  },
  {
    id: "motivated_light",
    name: "Luz Motivada",
    description: "Artificial light that mimics a real source in the scene.",
  },
  {
    id: "negative_fill",
    name: "Relleno Negativo",
    description: "Using a black surface to block light and deepen shadows.",
  },
  {
    id: "kicker_light",
    name: "Luz Kicker (de acento)",
    description: "A strong side-backlight that defines contours.",
  },
  {
    id: "edge_light",
    name: "Luz de Canto (Edge)",
    description: "A light that specifically outlines the subject's edge.",
  },
  {
    id: "ambient_fill",
    name: "Relleno Ambiental",
    description: "Using controlled ambient light for general softening.",
  },
  // Anteriormente "E. Natural Light (Time of Day)"
  {
    id: "golden_hour",
    name: "Luz de Hora Dorada",
    description: "Warm, soft, directional light at sunrise/sunset.",
  },
  {
    id: "blue_hour",
    name: "Luz de Hora Azul",
    description:
      "Cool, soft, uniform light just before sunrise or after sunset.",
  },
  {
    id: "midday_harsh",
    name: "Luz Dura de Mediodía",
    description: "Hard, high-contrast light with short shadows.",
  },
  {
    id: "diffused_daylight",
    name: "Luz de Día Difusa",
    description: "Soft light filtered through clouds or diffusers.",
  },
  {
    id: "window_light",
    name: "Luz de Ventana",
    description: "Soft, directional light coming through a window.",
  },
  {
    id: "backlit_sunlight",
    name: "Luz Solar a Contraluz",
    description: "Sun behind the subject, creating a halo or silhouette.",
  },
  {
    id: "dappled_light",
    name: "Luz Moteada (entrecortada)",
    description: "Fragmented light passing through leaves or structures.",
  },
  // Anteriormente "F. Light Hardness"
  {
    id: "hard_light",
    name: "Luz Dura",
    description: "Creates defined shadows, high contrast, and sharp texture.",
  },
  {
    id: "soft_light",
    name: "Luz Suave",
    description: "Creates diffuse shadows, smooth skin, and a natural look.",
  },
  {
    id: "semi_soft_light",
    name: "Luz Semi-Suave",
    description: "An intermediate transition between hard and soft.",
  },
  // Anteriormente "G. Modifiers"
  {
    id: "softbox",
    name: "Softbox",
    description: "Creates soft, controllable, directional light.",
  },
  {
    id: "octabox",
    name: "Octabox",
    description: "Octagonal softbox for more natural-looking catchlights.",
  },
  {
    id: "stripbox",
    name: "Stripbox",
    description: "Narrow, elongated softbox for edge or side lighting.",
  },
  {
    id: "beauty_dish",
    name: "Beauty Dish",
    description: "Soft yet contrasty light, ideal for fashion portraits.",
  },
  {
    id: "parabolic_umbrella",
    name: "Paraguas Parabólico / Profundo",
    description: "Directional, high-contrast light with a soft falloff.",
  },
  {
    id: "umbrella_bounce",
    name: "Paraguas (Rebote)",
    description: "Reflective umbrella for broad, soft light.",
  },
  {
    id: "umbrella_shoot_through",
    name: "Paraguas (Traslúcido)",
    description: "Translucent umbrella to soften and diffuse light.",
  },
  {
    id: "standard_reflector",
    name: "Reflector Estándar",
    description: "Hard, controlled light, common in studios.",
  },
  {
    id: "snoot",
    name: "Snoot (Cono)",
    description: "Concentrates light into a very small, focused spot.",
  },
  {
    id: "grid_honeycomb",
    name: "Grid / Nido de Abeja",
    description: "Restricts light spread for increased control.",
  },
  {
    id: "barn_doors",
    name: "Viseras (Barn Doors)",
    description: "Metal flaps to shape and control the spread of light.",
  },
  {
    id: "gel_lighting",
    name: "Iluminación con Geles",
    description:
      "Using colored gels to modify the light's color or temperature.",
  },
  // Anteriormente "H. Creative & Mood Styles"
  {
    id: "high_key",
    name: "Clave Alta (High Key)",
    description: "Bright, low-shadow lighting for a clean, soft look.",
  },
  {
    id: "low_key",
    name: "Clave Baja (Low Key)",
    description: "Dark, shadow-dominant lighting for a dramatic, moody look.",
  },
  {
    id: "contrast_lighting",
    name: "Iluminación de Contraste",
    description: "Pronounced contrast between light and shadow.",
  },
  {
    id: "flat_lighting",
    name: "Iluminación Plana",
    description: "Very uniform light with minimal shadows, reduces texture.",
  },
  {
    id: "silhouette",
    name: "Iluminación de Silueta",
    description: "Subject appears dark against a bright background.",
  },
  {
    id: "rim_halo",
    name: "Iluminación de Borde / Halo",
    description: "An illuminated edge around the subject.",
  },
  {
    id: "noir_lighting",
    name: 'Iluminación "Noir"',
    description: "Film noir style: hard light, intense shadows, high drama.",
  },
  {
    id: "cinematic_moody",
    name: "Iluminación Cinematográfica (Moody)",
    description:
      "Soft, directional light with desaturated tones and atmosphere.",
  },
  {
    id: "color_contrast",
    name: "Iluminación de Contraste de Color",
    description: "Using opposing colors (e.g., blue/orange).",
  },
  {
    id: "neon_lighting",
    name: "Iluminación de Neón",
    description: "Lighting with real or simulated vibrant neon signs.",
  },
  {
    id: "specular_lighting",
    name: "Iluminación Especular",
    description: "Bright, shiny reflections on metal, liquid, or wet skin.",
  },
  // Anteriormente "I. Special Effects"
  {
    id: "strobe_hss",
    name: "Estroboscópica / Sinc. Alta Velocidad",
    description: "Flash synced at high speeds to freeze motion.",
  },
  {
    id: "light_painting",
    name: "Light Painting (Pintura de Luz)",
    description: "Creating patterns by moving lights during a long exposure.",
  },
  {
    id: "gobo_lighting",
    name: "Iluminación con Gobo",
    description: "Using stencils to project patterns of light or shadow.",
  },
  {
    id: "volumetric_light",
    name: "Luz Volumétrica",
    description: "Visible beams of light passing through fog, smoke, or dust.",
  },
  {
    id: "lens_flare",
    name: "Destellos / Lens Flare",
    description: "Direct light entering the lens, creating bright artifacts.",
  },
  {
    id: "bounced_light",
    name: "Luz Rebotada",
    description: "Light reflected off a surface like a wall or reflector.",
  },
  {
    id: "flagged_light",
    name: "Luz Bloqueada (Bandera)",
    description:
      "Using a 'flag' to block a portion of light and control shadows.",
  },
  {
    id: "glow_light",
    name: "Luz Resplandeciente (Glow)",
    description:
      "Soft, expanded light creating a halo effect around the subject.",
  },
];
