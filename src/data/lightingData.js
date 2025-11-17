// lightingData.js - Esquemas de iluminación profesional para fotografía de retrato
// Basado en: Curso Completo de Iluminación en Fotografía de Retrato

export const LIGHTING_DATA = {
  "A. Source & Type": [
    {
      id: "natural_light",
      name: "Natural Light",
      description: "Light from the sun, outdoors or indoors.",
    },
    {
      id: "artificial_light",
      name: "Artificial Light",
      description: "Light from man-made devices (lamps, flashes).",
    },
    {
      id: "mixed_light",
      name: "Mixed Light",
      description: "Combination of natural and artificial light.",
    },
    {
      id: "continuous_light",
      name: "Continuous Light",
      description: "Constant light source, effect is visible in real-time.",
    },
    {
      id: "flash_strobe",
      name: "Flash / Strobe",
      description: "Brief, intense burst of light from a flash unit.",
    },
    {
      id: "ambient_light",
      name: "Ambient Light",
      description: "The existing light in a scene without additions.",
    },
    {
      id: "available_light",
      name: "Available Light",
      description: "Using only the light already present in the scene.",
    },
  ],
  "B. Direction": [
    {
      id: "front_light",
      name: "Front Light",
      description: "Light from the front, reduces shadows and texture.",
    },
    {
      id: "side_light",
      name: "Side Light",
      description: "Light from the side, creates strong shadows and volume.",
    },
    {
      id: "backlight",
      name: "Backlight",
      description:
        "Light from behind, creates a halo, silhouette, or rim effect.",
    },
    {
      id: "top_light",
      name: "Top Light (Cenital)",
      description: "Light from above, creates drama and shadows under eyes.",
    },
    {
      id: "bottom_light",
      name: "Bottom Light (Nadir)",
      description: "Light from below, for an unsettling or dramatic effect.",
    },
    {
      id: "classic_45_degree",
      name: "Classic 45° Light",
      description: "Standard portrait light at a 45° angle to the subject.",
    },
    {
      id: "grazing_light",
      name: "Grazing Light",
      description: "Very low side light that emphasizes texture.",
    },
  ],
  "C. Classic Portrait Schemes": [
    {
      id: "rembrandt",
      name: "Rembrandt Lighting",
      description:
        "Creates a triangle of light on the cheek opposite the light source.",
    },
    {
      id: "split",
      name: "Split Lighting",
      description: "Splits the face into two halves: one lit, one in shadow.",
    },
    {
      id: "loop",
      name: "Loop Lighting",
      description: "Creates a small, circular shadow of the nose on the cheek.",
    },
    {
      id: "butterfly",
      name: "Butterfly / Paramount",
      description: "Creates a butterfly-shaped shadow under the nose.",
    },
    {
      id: "clamshell",
      name: "Clamshell Lighting",
      description:
        "Top light plus a reflector below, softens skin for beauty shots.",
    },
    {
      id: "broad",
      name: "Broad Lighting",
      description: "The side of the face turned toward the camera is lit.",
    },
    {
      id: "short",
      name: "Short Lighting",
      description:
        "The side of the face turned away from the camera is lit; slimming.",
    },
  ],
  "D. Cinematic Schemes": [
    {
      id: "three_point",
      name: "Three-Point Lighting",
      description: "Standard setup with Key, Fill, and Backlight.",
    },
    {
      id: "key_light",
      name: "Key Light",
      description: "The main light that models the subject.",
    },
    {
      id: "fill_light",
      name: "Fill Light",
      description: "Softens shadows created by the key light.",
    },
    {
      id: "rim_light_cinematic",
      name: "Backlight / Rim Light",
      description:
        "Separates the subject from the background with an edge of light.",
    },
    {
      id: "practical_light",
      name: "Practical Light",
      description: "Light sources visible in the scene (lamps, candles).",
    },
    {
      id: "motivated_light",
      name: "Motivated Light",
      description: "Artificial light that mimics a real source in the scene.",
    },
    {
      id: "negative_fill",
      name: "Negative Fill",
      description: "Using a black surface to block light and deepen shadows.",
    },
    {
      id: "kicker_light",
      name: "Kicker Light",
      description: "A strong side-backlight that defines contours.",
    },
    {
      id: "edge_light",
      name: "Edge Light",
      description: "A light that specifically outlines the subject's edge.",
    },
    {
      id: "ambient_fill",
      name: "Ambient Fill",
      description: "Using controlled ambient light for general softening.",
    },
  ],
  "E. Natural Light (Time of Day)": [
    {
      id: "golden_hour",
      name: "Golden Hour Light",
      description: "Warm, soft, directional light at sunrise/sunset.",
    },
    {
      id: "blue_hour",
      name: "Blue Hour Light",
      description:
        "Cool, soft, uniform light just before sunrise or after sunset.",
    },
    {
      id: "midday_harsh",
      name: "Midday Harsh Light",
      description: "Hard, high-contrast light with short shadows.",
    },
    {
      id: "diffused_daylight",
      name: "Diffused Daylight",
      description: "Soft light filtered through clouds or diffusers.",
    },
    {
      id: "window_light",
      name: "Window Light",
      description: "Soft, directional light coming through a window.",
    },
    {
      id: "backlit_sunlight",
      name: "Backlit Sunlight",
      description: "Sun behind the subject, creating a halo or silhouette.",
    },
    {
      id: "dappled_light",
      name: "Dappled Light",
      description: "Fragmented light passing through leaves or structures.",
    },
  ],
  "F. Light Hardness": [
    {
      id: "hard_light",
      name: "Hard Light",
      description: "Creates defined shadows, high contrast, and sharp texture.",
    },
    {
      id: "soft_light",
      name: "Soft Light",
      description: "Creates diffuse shadows, smooth skin, and a natural look.",
    },
    {
      id: "semi_soft_light",
      name: "Semi-Soft Light",
      description: "An intermediate transition between hard and soft.",
    },
  ],
  "G. Modifiers": [
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
      name: "Parabolic / Deep Umbrella",
      description: "Directional, high-contrast light with a soft falloff.",
    },
    {
      id: "umbrella_bounce",
      name: "Umbrella (Bounce)",
      description: "Reflective umbrella for broad, soft light.",
    },
    {
      id: "umbrella_shoot_through",
      name: "Umbrella (Shoot-Through)",
      description: "Translucent umbrella to soften and diffuse light.",
    },
    {
      id: "standard_reflector",
      name: "Standard Reflector",
      description: "Hard, controlled light, common in studios.",
    },
    {
      id: "snoot",
      name: "Snoot",
      description: "Concentrates light into a very small, focused spot.",
    },
    {
      id: "grid_honeycomb",
      name: "Grid / Honeycomb",
      description: "Restricts light spread for increased control.",
    },
    {
      id: "barn_doors",
      name: "Barn Doors",
      description: "Metal flaps to shape and control the spread of light.",
    },
    {
      id: "gel_lighting",
      name: "Gel Lighting",
      description:
        "Using colored gels to modify the light's color or temperature.",
    },
  ],
  "H. Creative & Mood Styles": [
    {
      id: "high_key",
      name: "High Key",
      description: "Bright, low-shadow lighting for a clean, soft look.",
    },
    {
      id: "low_key",
      name: "Low Key",
      description: "Dark, shadow-dominant lighting for a dramatic, moody look.",
    },
    {
      id: "contrast_lighting",
      name: "Contrast Lighting",
      description: "Pronounced contrast between light and shadow.",
    },
    {
      id: "flat_lighting",
      name: "Flat Lighting",
      description: "Very uniform light with minimal shadows, reduces texture.",
    },
    {
      id: "silhouette",
      name: "Silhouette Lighting",
      description: "Subject appears dark against a bright background.",
    },
    {
      id: "rim_halo",
      name: "Rim / Halo Lighting",
      description: "An illuminated edge around the subject.",
    },
    {
      id: "noir_lighting",
      name: "Noir Lighting",
      description: "Film noir style: hard light, intense shadows, high drama.",
    },
    {
      id: "cinematic_moody",
      name: "Cinematic Moody",
      description:
        "Soft, directional light with desaturated tones and atmosphere.",
    },
    {
      id: "color_contrast",
      name: "Color Contrast Lighting",
      description: "Using opposing colors (e.g., blue/orange).",
    },
    {
      id: "neon_lighting",
      name: "Neon Lighting",
      description: "Lighting with real or simulated vibrant neon signs.",
    },
    {
      id: "specular_lighting",
      name: "Specular Lighting",
      description: "Bright, shiny reflections on metal, liquid, or wet skin.",
    },
  ],
  "I. Special Effects": [
    {
      id: "strobe_hss",
      name: "Strobe / High-Speed Sync",
      description: "Flash synced at high speeds to freeze motion.",
    },
    {
      id: "light_painting",
      name: "Light Painting",
      description: "Creating patterns by moving lights during a long exposure.",
    },
    {
      id: "gobo_lighting",
      name: "Gobo Lighting",
      description: "Using stencils to project patterns of light or shadow.",
    },
    {
      id: "volumetric_light",
      name: "Volumetric Light",
      description:
        "Visible beams of light passing through fog, smoke, or dust.",
    },
    {
      id: "lens_flare",
      name: "Flares / Lens Flare",
      description: "Direct light entering the lens, creating bright artifacts.",
    },
    {
      id: "bounced_light",
      name: "Bounced Light",
      description: "Light reflected off a surface like a wall or reflector.",
    },
    {
      id: "flagged_light",
      name: "Flagged Light",
      description:
        "Using a 'flag' to block a portion of light and control shadows.",
    },
    {
      id: "glow_light",
      name: "Glow Light",
      description:
        "Soft, expanded light creating a halo effect around the subject.",
    },
  ],
};
