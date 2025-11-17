// src/data/lensesData.js

export const lenses = {
  "1. By Focal Length": [
    {
      id: "ultra_wide_angle",
      name: "Ultra Wide-Angle Lens (10-20mm)",
      description:
        "Extreme perspective, distorted lines, expands spaces. Ideal for architecture/drones.",
    },
    {
      id: "wide_angle",
      name: "Wide-Angle Lens (20-35mm)",
      description:
        "Widens the scene, creates a sense of depth, documentary or narrative feel.",
    },
    {
      id: "standard",
      name: "Standard Lens (35-50mm)",
      description:
        "Natural perspective similar to the human eye, ideal for environmental portraits and lifestyle.",
    },
    {
      id: "short_telephoto",
      name: "Short Telephoto Lens (70-135mm)",
      description: "Mild compression, pleasing bokeh, classic for portraits.",
    },
    {
      id: "long_telephoto",
      name: "Long Telephoto Lens (200-600mm)",
      description:
        "Very strong compression, flattened backgrounds. Ideal for wildlife and sports.",
    },
    {
      id: "super_telephoto",
      name: "Super-Telephoto Lens (800mm+)",
      description:
        "Ultra compression, long-distance detail, 'compressed reality' look.",
    },
  ],
  "2. By Aperture": [
    {
      id: "fast_aperture",
      name: "Very Fast Lenses (f/0.95 - f/1.4)",
      description:
        "Extreme bokeh, minimal depth of field, cinematic/dreamy look.",
    },
    {
      id: "bright_lenses",
      name: "Bright Lenses (f/1.8 - f/2.8)",
      description: "Good in low light, controlled DOF, balanced sharpness.",
    },
    {
      id: "medium_aperture",
      name: "Medium Aperture Lenses (f/4 - f/5.6)",
      description: "More depth of field, ideal for travel and landscape.",
    },
    {
      id: "slow_aperture",
      name: "Slow Lenses (f/6.3 - f/11)",
      description: "Large DOF, used in compacts, drones, and telephoto zooms.",
    },
  ],
  "3. Specialty Lenses": [
    {
      id: "macro",
      name: "Macro Lens (1:1 / 2:1 / 5:1)",
      description:
        "Extremely close focus, microscopic detail, brutal sharpness and texture.",
    },
    {
      id: "tilt_shift",
      name: "Tilt-Shift Lens",
      description:
        "Corrects perspective, creates a 'miniature' effect, controls the focal plane.",
    },
    {
      id: "fisheye",
      name: "Fisheye Lens",
      description: "180° field of view, circular distortion, extreme look.",
    },
    {
      id: "pancake",
      name: "Pancake Lens",
      description: "Very thin and compact, lightweight, wide DOF.",
    },
    {
      id: "soft_focus",
      name: "Soft Focus Lens",
      description: "Softens skin and creates natural halation, vintage look.",
    },
    {
      id: "anamorphic",
      name: "Anamorphic Lens",
      description:
        "Cinematic look: horizontal distortion, oval flares, oval bokeh.",
    },
    {
      id: "prime",
      name: "Prime Lens (Fixed)",
      description: "Greater sharpness, wider aperture, superior aesthetics.",
    },
    {
      id: "zoom",
      name: "Zoom Lens",
      description: "Versatile, less bright but offers a wide focal range.",
    },
  ],
  "4. Creative & Experimental Lenses": [
    {
      id: "lensbaby",
      name: "Lensbaby",
      description:
        "Selective focus area with blurry edges; artistic/dreamy look.",
    },
    {
      id: "vintage_lenses",
      name: "Vintage Lenses (Helios, Takumar, etc.)",
      description:
        "Swirly bokeh, characteristic flare, low or soft microcontrast.",
    },
    {
      id: "controlled_aberration",
      name: "Lenses with Controlled Aberration",
      description: "Intentional 'lo-fi' effect, vignetting, and distortions.",
    },
    {
      id: "infrared_lenses",
      name: "Infrared Lenses",
      description:
        "Captures the IR spectrum, creating dreamlike colors and deep blacks.",
    },
    {
      id: "uv_lenses",
      name: "UV Lenses",
      description:
        "Captures the UV spectrum, used for science, skin, and flowers.",
    },
    {
      id: "adapted_projection",
      name: "Adapted Projection Lens",
      description: "Very soft bokeh, analog cinematic look.",
    },
    {
      id: "pinhole_lens",
      name: "Pinhole Lens",
      description: "Total softness, infinite focus without sharpness.",
    },
  ],
  "5. Visual Effects by Focal Length": [
    {
      id: "background_compression",
      name: "Background Compression (Telephoto)",
      description: "The background appears closer and larger.",
    },
    {
      id: "space_expansion",
      name: "Space Expansion (Wide-Angle)",
      description: "The distance between objects is exaggerated.",
    },
    {
      id: "natural_perspective",
      name: "Natural Perspective (35-50mm)",
      description: "A balance similar to the human eye.",
    },
    {
      id: "shallow_dof",
      name: "Extremely Shallow DOF (f/1.2 lenses)",
      description: "Only a tiny part of the subject is in focus.",
    },
    {
      id: "extreme_bokeh",
      name: "Extreme Bokeh (Macro & Fast Telephotos)",
      description: "Very smooth background with clear shapes.",
    },
    {
      id: "radial_distortion",
      name: "Radial Distortion (Fisheye)",
      description: "Exaggerated curvature of the environment.",
    },
    {
      id: "natural_vignetting",
      name: "Natural Vignetting (Vintage Lenses)",
      description: "Soft darkening in the corners.",
    },
    {
      id: "oval_flares",
      name: "Oval Flares (Anamorphic)",
      description: "Cinematic 'Blade Runner' look.",
    },
  ],
  "6. Classic Portrait Lenses": [
    {
      id: "50mm_portrait",
      name: "50mm f/1.2 - f/1.8",
      description: "Natural look with soft bokeh.",
    },
    {
      id: "85mm_portrait",
      name: "85mm f/1.4 - f/1.8",
      description: "The king of portraiture: ideal compression + creamy bokeh.",
    },
    {
      id: "105mm_portrait",
      name: "105mm f/1.4",
      description:
        "Very three-dimensional portraits and strong background blur.",
    },
    {
      id: "135mm_portrait",
      name: "135mm f/2",
      description:
        "Maximum compression without being an extreme telephoto; fashion/editorial look.",
    },
  ],
  "7. Landscape Lenses": [
    {
      id: "16_35mm_landscape",
      name: "16-35mm f/2.8",
      description: "Sharp wide-angle, ideal for expansive scenes.",
    },
    {
      id: "24mm_landscape",
      name: "24mm Prime",
      description: "Versatile, environmental, narrative.",
    },
    {
      id: "35mm_landscape",
      name: "35mm Prime",
      description: "Reportage / lifestyle / urban landscape.",
    },
  ],
  "8. Macro & Detail Lenses": [
    {
      id: "90_100mm_macro",
      name: "90-100mm Macro",
      description: "Professional macro portrait with good working distance.",
    },
    {
      id: "150mm_macro",
      name: "150mm Macro",
      description: "Greater compression, ample distance for insects.",
    },
    {
      id: "super_macro",
      name: "Super Macro 2:1 or 5:1",
      description: "Extreme details, pure texture.",
    },
  ],
  "9. Wildlife & Sports Lenses": [
    {
      id: "70_200mm_sports",
      name: "70-200mm f/2.8",
      description:
        "Versatile for sports portraits and medium-distance wildlife.",
    },
    {
      id: "200_600mm_wildlife",
      name: "200-600mm",
      description: "Wildlife and birds; extreme compression.",
    },
    {
      id: "400_600mm_premium_tele",
      name: "400mm f/2.8 / 600mm f/4",
      description:
        "Premium telephoto; brutal separation and legendary sharpness.",
    },
  ],
};
