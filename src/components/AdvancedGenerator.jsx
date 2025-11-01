import React, { useState, useEffect } from "react";
import {
  Upload,
  Trash2,
  Sparkles,
  Copy,
  Check,
  Loader2,
  ChevronDown,
  ChevronUp,
  Crown,
  Send,
  Info,
  Image as ImageIcon,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { supabase } from "../lib/supabase";
import AnimatedSection from "./AnimatedSection";
import QualityAnalysis from "./QualityAnalysis";

// ✅ IMPORTAR OUTFITS SEPARADOS POR GÉNERO
import Outfits_women from "../data/Outfits_women";
import Outfits_men from "../data/Outfits_men";

// ✅ IMPORTAR TIPOS DE PLANO Y ÁNGULOS DE CÁMARA
import { SHOT_TYPES, CAMERA_ANGLES } from "../data/shotTypesData";

// ============================================================================
// ✨ CARACTERÍSTICAS RÁPIDAS (Solo 1 seleccionable)
// ============================================================================
const QUICK_FEATURES = [
  {
    id: "professional-lighting",
    name: "Iluminación Profesional",
    description: "Rembrandt, Butterfly o Loop lighting with professional setup",
    promptText: "Professional studio lighting setup with Rembrandt or Butterfly lighting creating gentle shadow modeling, soft diffused key light at 45-degree angle, fill light maintaining detail in shadows",
  },
  {
    id: "bokeh",
    name: "Fondo Desenfocado",
    description: "Shallow depth of field con 85mm",
    promptText: "Shallow depth of field with 85mm f/1.8 lens creating creamy smooth bokeh, background beautifully blurred with soft out-of-focus areas",
  },
  {
    id: "cinematic",
    name: "Look Cinematográfico",
    description: "Black Pro-Mist effect",
    promptText: "Cinematic look with soft diffused highlights using Black Pro-Mist filter effect, gentle halation on bright lights, organic film-like quality",
  },
  {
    id: "golden-hour",
    name: "Golden Hour",
    description: "Luz cálida de atardecer",
    promptText: "Warm golden hour light with sunset glow, magical warm tones creating romantic atmosphere, soft natural illumination",
  },
  {
    id: "smooth-skin",
    name: "Piel Suave y Uniforme",
    description: "Skin tone uniformity",
    promptText: "Skin tone uniformity with subtle texture preservation, even complexion, natural beauty retouching maintaining realistic appearance",
  },
  {
    id: "teal-orange",
    name: "Teal & Orange",
    description: "Color grading Hollywood",
    promptText: "Cinematic color grading with teal shadows and orange highlights, Hollywood blockbuster style, complementary color contrast",
  },
];

// ============================================================================
// ✨ HERRAMIENTAS PRO - SIMPLIFICADAS (7 elementos)
// ============================================================================

const GENDER_OPTIONS = [
  { id: "masculine", name: "Masculino" },
  { id: "feminine", name: "Femenino" },
  { id: "neutral", name: "Neutral" },
];

const LIGHTING_SCHEMES = [
  {
    id: "rembrandt",
    name: "Rembrandt",
    description: "45° con triángulo de luz",
    promptText: "Rembrandt lighting setup with triangle of light on cheek, key light at 45-degree angle creating dramatic shadows, 2:1 lighting ratio",
  },
  {
    id: "butterfly",
    name: "Butterfly",
    description: "Frontal elevada, sombra nariz",
    promptText: "Butterfly lighting from above creating shadow under nose in butterfly shape, glamorous beauty lighting, defines cheekbones",
  },
  { 
    id: "loop", 
    name: "Loop", 
    description: "45° elevada, sombra bucle",
    promptText: "Loop lighting with 45-degree elevated key light, loop-shaped nose shadow toward cheek, flattering portrait setup",
  },
  { 
    id: "split", 
    name: "Split", 
    description: "Lateral 90°, mitad luz/sombra",
    promptText: "Split lighting with half face illuminated and half in shadow, dramatic high contrast, 90-degree side light",
  },
  { 
    id: "broad", 
    name: "Broad", 
    description: "Lado hacia cámara iluminado",
    promptText: "Broad lighting with camera-facing side of face illuminated, widening effect on face",
  },
  { 
    id: "short", 
    name: "Short", 
    description: "Lado alejado iluminado",
    promptText: "Short lighting with shadow on camera-facing side, slimming effect, sculpts facial structure",
  },
];

const LENSES = [
  { 
    id: "24-35mm", 
    name: "24-35mm", 
    description: "Gran angular, contexto",
    promptText: "24mm wide-angle lens capturing environmental context, slight perspective distortion, expansive field of view",
  },
  { 
    id: "50mm", 
    name: "50mm", 
    description: "Normal, versátil",
    promptText: "50mm f/1.8 lens with natural perspective matching human vision, versatile standard focal length",
  },
  { 
    id: "85mm", 
    name: "85mm", 
    description: "REY del retrato",
    promptText: "85mm f/1.2 portrait lens creating shallow depth of field, creamy smooth bokeh, flattering compression, professional portrait setup",
  },
  {
    id: "135-200mm",
    name: "135-200mm",
    description: "Teleobjetivo, compresión",
    promptText: "135mm telephoto lens with strong compression isolating subject from background, compressed perspective",
  },
];

const COLOR_GRADING = [
  {
    id: "teal-orange",
    name: "Teal & Orange",
    description: "Hollywood blockbuster",
    promptText: "Cinematic color grading with teal shadows and warm orange highlights, Hollywood blockbuster style, complementary color contrast",
  },
  {
    id: "vintage",
    name: "Vintage Film",
    description: "Tonos pastel, contraste suave",
    promptText: "Vintage film look with lifted shadows creating pastel tones, soft faded contrast, nostalgic aesthetic, film grain texture",
  },
  { 
    id: "high-key", 
    name: "High-Key", 
    description: "Brillante, optimista",
    promptText: "High-key bright atmosphere with minimal shadows, optimistic mood, soft overall illumination, light airy feel",
  },
  { 
    id: "low-key", 
    name: "Low-Key", 
    description: "Oscuro, dramático",
    promptText: "Low-key dramatic lighting with predominant shadows, dark moody atmosphere, high contrast with deep blacks",
  },
  { 
    id: "warm", 
    name: "Warm Tones", 
    description: "Tonos cálidos",
    promptText: "Warm color tones with enhanced oranges and yellows, cozy inviting atmosphere, golden warmth throughout",
  },
  { 
    id: "cool", 
    name: "Cool Tones", 
    description: "Tonos fríos",
    promptText: "Cool color tones with enhanced blues and cyans, modern clean aesthetic, professional cool atmosphere",
  },
];

// ============================================================================
// ✨ INFORMACIÓN DE PLATAFORMAS
// ============================================================================
const PLATFORM_INFO = {
  "nano-banana": {
    name: "Nano-Banana (Google Gemini)",
    description: "Imagen.ia basado en Google Gemini",
    features: [
      "Un párrafo continuo y fluido",
      "1200-1600 caracteres óptimo",
      "Especificar orientación (vertical/horizontal)",
      "NO soporta prompts negativos",
    ],
    tips: 'Genera cuadrado (1:1) por defecto. Especifica "vertical portrait format" o "wide horizontal".',
  },
  midjourney: {
    name: "Midjourney V7",
    description: "Plataforma líder en generación artística",
    features: [
      "Parámetros al final (--ar, --v, --s, --q)",
      "Soporta prompts negativos (--no)",
      "Control total con seeds (--seed)",
      "Stylize para fotorrealismo (--s 50-100)",
    ],
    tips: "Usa --ar para aspect ratio, --q 2 para máxima calidad, --s bajo para fotorrealismo.",
  },
};

export default function AdvancedGenerator() {
  const { user, profile, refreshProfile } = useAuth();
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [referenceImage, setReferenceImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [qualityAnalysis, setQualityAnalysis] = useState(null);
  const [isApplyingSuggestions, setIsApplyingSuggestions] = useState(false);
  const [copied, setCopied] = useState(false);

  // Estados para plataforma
  const [selectedPlatform, setSelectedPlatform] = useState("nano-banana");
  const [showPlatformInfo, setShowPlatformInfo] = useState(false);
  const [validation, setValidation] = useState(null);

  // Estados para características rápidas (solo 1)
  const [selectedFeature, setSelectedFeature] = useState(null);
  const [showProTools, setShowProTools] = useState(false);

  // ✨ Estados para Herramientas PRO (SIMPLIFICADAS - 7 elementos)
  const [proSettings, setProSettings] = useState({
    shotType: null,
    cameraAngle: null,
    gender: "neutral",
    lighting: null,
    lens: null,
    colorGrading: null,
    outfit: null,
  });

  const isPro = profile?.plan === "pro" || profile?.plan === "premium";

  // ✅ OBTENER OUTFITS SEGÚN GÉNERO
  const getOutfitsByGender = () => {
    if (proSettings.gender === "masculine") {
      return Outfits_men;
    } else if (proSettings.gender === "feminine") {
      return Outfits_women;
    }
    // Si es neutral, mostrar ambos combinados
    return [...Outfits_women, ...Outfits_men];
  };

  const currentOutfits = getOutfitsByGender();

  // ============================================================================
  // EFECTO: Cuando se abre PRO, limpia características rápidas
  // ============================================================================
  useEffect(() => {
    if (showProTools) {
      setSelectedFeature(null);
    }
  }, [showProTools]);

  // ============================================================================
  // ✨ EFECTO: ACTUALIZAR TEXTAREA AUTOMÁTICAMENTE
  // ============================================================================
  useEffect(() => {
    // Construir el texto completo basado en selecciones
    let enhancedText = "";
    const parts = [];

    // 1. Característica rápida
    if (selectedFeature) {
      const feature = QUICK_FEATURES.find((f) => f.id === selectedFeature);
      if (feature) {
        parts.push(feature.promptText);
      }
    }

    // 2. Herramientas PRO
    if (showProTools) {
      // Shot Type
      if (proSettings.shotType) {
        const shot = SHOT_TYPES.find((s) => s.id === proSettings.shotType);
        if (shot) parts.push(shot.promptText);
      }

      // Camera Angle
      if (proSettings.cameraAngle) {
        const angle = CAMERA_ANGLES.find((a) => a.id === proSettings.cameraAngle);
        if (angle) parts.push(angle.promptText);
      }

      // Género (solo si no es neutral)
      if (proSettings.gender && proSettings.gender !== "neutral") {
        const genderText = proSettings.gender === "masculine" 
          ? "masculine aesthetic with strong confident posing" 
          : "feminine aesthetic with elegant graceful styling";
        parts.push(genderText);
      }

      // Iluminación
      if (proSettings.lighting) {
        const lighting = LIGHTING_SCHEMES.find((l) => l.id === proSettings.lighting);
        if (lighting) parts.push(lighting.promptText);
      }

      // Lente
      if (proSettings.lens) {
        const lens = LENSES.find((l) => l.id === proSettings.lens);
        if (lens) parts.push(lens.promptText);
      }

      // Color Grading
      if (proSettings.colorGrading) {
        const grading = COLOR_GRADING.find((g) => g.id === proSettings.colorGrading);
        if (grading) parts.push(grading.promptText);
      }

      // Outfit
      if (proSettings.outfit) {
        const outfit = currentOutfits.find((o) => o.id === proSettings.outfit);
        if (outfit) {
          parts.push(`wearing ${outfit.keywords}`);
        }
      }
    }

    // Unir todas las partes
    if (parts.length > 0) {
      enhancedText = parts.join(", ");
    }

    // Solo actualizar si hay cambios
    if (enhancedText && enhancedText !== prompt) {
      setPrompt(enhancedText);
    }
  }, [selectedFeature, showProTools, proSettings, currentOutfits]);

  // ============================================================================
  // HANDLERS
  // ============================================================================

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 4 * 1024 * 1024) {
        alert("La imagen debe ser menor a 4MB");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setReferenceImage(reader.result.split(",")[1]);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setImagePreview("");
    setReferenceImage(null);
  };

  const selectFeature = (featureId) => {
    if (showProTools) {
      // Si PRO está abierto, cerrar PRO y limpiar
      setShowProTools(false);
      setProSettings({
        shotType: null,
        cameraAngle: null,
        gender: "neutral",
        lighting: null,
        lens: null,
        colorGrading: null,
        outfit: null,
      });
    }
    // Toggle de la característica (solo 1 puede estar activa)
    setSelectedFeature(selectedFeature === featureId ? null : featureId);
  };

  const updateProSetting = (key, value) => {
    setProSettings((prev) => ({
      ...prev,
      [key]: prev[key] === value ? null : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setResponse("");
    setQualityAnalysis(null);
    setValidation(null);

    try {
      const payload = {
        prompt,
        referenceImage,
        mimeType: "image/jpeg",
        analyzeQuality: isPro,
        isPro,
        platform: selectedPlatform,
        // Enviar solo si PRO está activo, sino null
        proSettings: showProTools ? proSettings : null,
      };

      console.log("📤 Enviando payload a API...", {
        platform: payload.platform,
        hasImage: !!payload.referenceImage,
        hasPrompt: !!payload.prompt,
        isPro: payload.isPro,
        hasProSettings: !!payload.proSettings,
      });

      const res = await fetch("/api/gemini-processor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      console.log("📥 Respuesta recibida - Status:", res.status);

      // Intentar parsear respuesta
      let data;
      try {
        data = await res.json();
        console.log("📥 Data parseada:", data);
      } catch (parseError) {
        console.error("❌ Error parseando JSON:", parseError);
        throw new Error("Error parseando respuesta del servidor");
      }

      // Manejo específico de errores según status
      if (!res.ok) {
        console.error("❌ Error en respuesta:", data);

        if (res.status === 429) {
          throw new Error(
            "⚠️ LÍMITE DE PETICIONES ALCANZADO.\n\nGemini API está bloqueando por demasiadas peticiones.\n\nEspera 60 segundos y vuelve a intentar."
          );
        } else if (res.status === 404) {
          throw new Error(
            "❌ API NO ENCONTRADA (404)\n\nVerifica que:\n1. El archivo api/gemini-processor.js esté en tu repositorio\n2. El deploy haya sido exitoso\n3. La ruta /api/gemini-processor sea correcta"
          );
        } else if (res.status === 500) {
          const errorMsg =
            data.details || data.error || "Error interno del servidor";
          throw new Error(
            `❌ ERROR DEL SERVIDOR (500)\n\n${errorMsg}\n\nRevisa los logs de Vercel para más detalles.`
          );
        } else if (res.status === 401 || res.status === 403) {
          throw new Error(
            `❌ ERROR DE AUTENTICACIÓN (${res.status})\n\nVerifica que la API Key de Gemini esté configurada correctamente en Vercel.`
          );
        }

        throw new Error(data.error || `Error ${res.status}: ${res.statusText}`);
      }

      // Validar que la respuesta tenga el prompt
      if (!data.prompt) {
        console.error("❌ Respuesta sin prompt:", data);
        throw new Error("La API no devolvió un prompt válido");
      }

      console.log("✅ Prompt generado exitosamente");

      // Actualizar estados con la respuesta
      setResponse(data.prompt);
      setQualityAnalysis(data.qualityAnalysis);
      setValidation(data.validation);

      // Descontar crédito y refrescar perfil
      await supabase
        .from("profiles")
        .update({
          credits: (profile.credits || 0) - 1,
        })
        .eq("id", user.id);

      await refreshProfile();

      console.log("✅ Todo completado correctamente");
    } catch (error) {
      console.error("❌ Error en handleSubmit:", error);

      // Mostrar error con más contexto
      const errorMessage =
        error.message || "Error desconocido al generar el prompt";
      alert(
        `ERROR:\n\n${errorMessage}\n\nRevisa la consola (F12) para más detalles.`
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(response);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleUseInGemini = () => {
    const encodedPrompt = encodeURIComponent(response);
    window.open(`https://gemini.google.com/?prompt=${encodedPrompt}`, "_blank");
  };

  const handleApplySuggestions = async (suggestions) => {
    if (
      !suggestions ||
      !Array.isArray(suggestions) ||
      suggestions.length === 0
    ) {
      alert("No hay sugerencias para aplicar");
      return;
    }

    setIsApplyingSuggestions(true);

    try {
      const payload = {
        applySuggestions: true,
        currentPrompt: response,
        suggestions: suggestions,
        isPro: true,
        platform: selectedPlatform,
      };

      const res = await fetch("/api/gemini-processor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Error al aplicar sugerencias");
      }

      setResponse(data.prompt);
      setQualityAnalysis(null);
    } catch (error) {
      console.error("Error:", error);
      alert(error.message);
    } finally {
      setIsApplyingSuggestions(false);
    }
  };

  // ============================================================================
  // RENDER
  // ============================================================================

  return (
    <section className="py-12">
      <div className="max-w-5xl mx-auto px-4">
        <AnimatedSection>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold">✨ Generador Avanzado</h2>
            {profile && (
              <div className="text-sm text-gray-400">
                Créditos: {profile.credits || 0}
              </div>
            )}
          </div>

          {/* SELECTOR DE PLATAFORMA */}
          <div className="mb-6 p-4 bg-white/5 border border-[var(--border)] rounded-lg">
            <div className="flex items-center justify-between mb-3">
              <label className="text-sm font-medium">
                Plataforma de Destino:
              </label>
              <button
                type="button"
                onClick={() => setShowPlatformInfo(!showPlatformInfo)}
                className="text-xs text-[var(--primary)] hover:underline flex items-center space-x-1"
              >
                <Info size={14} />
                <span>{showPlatformInfo ? "Ocultar" : "Más info"}</span>
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-3">
              {Object.entries(PLATFORM_INFO).map(([key, info]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setSelectedPlatform(key)}
                  className={`p-3 rounded-lg text-left transition-all ${
                    selectedPlatform === key
                      ? "bg-[var(--primary)]/20 border-2 border-[var(--primary)]"
                      : "bg-white/5 border border-[var(--border)] hover:bg-white/10"
                  }`}
                >
                  <div className="font-semibold text-sm">{info.name}</div>
                  <div className="text-xs text-gray-400 mt-1">
                    {info.description}
                  </div>
                </button>
              ))}
            </div>

            {showPlatformInfo && (
              <div className="mt-3 p-3 bg-black/40 rounded-lg text-xs space-y-2">
                <div>
                  <div className="font-semibold text-[var(--primary)] mb-1">
                    {PLATFORM_INFO[selectedPlatform].name}
                  </div>
                  <ul className="space-y-1 text-gray-400">
                    {PLATFORM_INFO[selectedPlatform].features.map(
                      (feature, idx) => (
                        <li key={idx}>• {feature}</li>
                      )
                    )}
                  </ul>
                  <div className="mt-2 text-gray-300">
                    💡 {PLATFORM_INFO[selectedPlatform].tips}
                  </div>
                </div>
              </div>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* SECCIÓN: IMAGEN + TEXTAREA EN GRID */}
            <div className="grid grid-cols-12 gap-4">
              {/* IMAGEN DE REFERENCIA - 20% */}
              <div className="col-span-12 md:col-span-3 flex flex-col">
                <label
                  className="block text-sm font-medium mb-2"
                  style={{ color: "var(--primary)" }}
                >
                  Imagen de Referencia (Opcional):
                </label>
                <div
                  className="border-2 border-dashed border-[var(--border)] rounded-lg flex items-center justify-center overflow-hidden bg-black/20"
                  style={{ minHeight: "300px" }}
                >
                  {imagePreview ? (
                    <div className="relative w-full h-full">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={handleRemoveImage}
                        className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ) : (
                    <label className="cursor-pointer flex flex-col items-center space-y-2 p-6 text-center">
                      <Upload size={32} className="text-gray-400" />
                      <span className="text-sm text-gray-400">
                        Arrastra o haz clic para subir
                      </span>
                      <span className="text-xs text-gray-500">
                        (Max 4MB - JPG, PNG)
                      </span>
                      <input
                        type="file"
                        onChange={handleImageUpload}
                        accept="image/*"
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
              </div>

              {/* TEXTAREA DESCRIPCIÓN - 80% */}
              <div className="col-span-12 md:col-span-9 flex flex-col">
                <label
                  className="block text-sm font-medium mb-2"
                  style={{ color: "var(--primary)" }}
                >
                  Describe lo que quieres generar:
                </label>
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Ejemplo: Professional portrait with confident expression..."
                  className="w-full p-4 rounded-lg bg-white/5 border border-[var(--border)] text-gray-200 placeholder-gray-500 resize-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
                  style={{ minHeight: "300px" }}
                />
              </div>
            </div>

            {/* CARACTERÍSTICAS RÁPIDAS */}
            <div>
              <label
                className="block text-sm font-medium mb-3"
                style={{ color: "var(--primary)" }}
              >
                Características Rápidas (Selecciona 1):
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
                {QUICK_FEATURES.map((feature) => (
                  <button
                    key={feature.id}
                    type="button"
                    onClick={() => selectFeature(feature.id)}
                    disabled={showProTools}
                    className={`p-3 rounded-lg text-xs text-left transition-all ${
                      selectedFeature === feature.id
                        ? "bg-[var(--primary)]/20 border-2 border-[var(--primary)]"
                        : "bg-white/5 border border-[var(--border)] hover:bg-white/10"
                    } ${showProTools ? "opacity-50 cursor-not-allowed" : ""}`}
                  >
                    <div className="font-semibold">{feature.name}</div>
                    <div className="text-gray-400 mt-1">
                      {feature.description}
                    </div>
                  </button>
                ))}
              </div>
              {showProTools && (
                <p className="text-xs text-gray-400 mt-2">
                  ⚠️ Desactiva Herramientas PRO para usar características
                  rápidas
                </p>
              )}
            </div>

            {/* HERRAMIENTAS PRO */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <button
                  type="button"
                  onClick={() => {
                    if (isPro) {
                      setShowProTools(!showProTools);
                    } else {
                      alert("Esta función requiere Plan PRO o Premium");
                    }
                  }}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
                    isPro
                      ? showProTools
                        ? "bg-gradient-to-r from-[#FFD700] to-[#FFA500] text-black font-bold hover:shadow-lg"
                        : "bg-white/10 hover:bg-white/20"
                      : "bg-white/5 opacity-50 cursor-not-allowed"
                  }`}
                >
                  <Crown size={18} />
                  <span>
                    {showProTools
                      ? "Cerrar Herramientas PRO"
                      : "Abrir Herramientas PRO"}
                  </span>
                  {showProTools ? (
                    <ChevronUp size={16} />
                  ) : (
                    <ChevronDown size={16} />
                  )}
                </button>
                {!isPro && (
                  <span className="text-xs text-gray-400">
                    Solo para usuarios PRO/Premium
                  </span>
                )}
              </div>

              {showProTools && isPro && (
                <div className="space-y-4 p-4 bg-white/5 border border-[var(--primary)]/30 rounded-lg">
                  {/* 1. TIPO DE PLANO */}
                  <div>
                    <label
                      className="block text-sm font-medium mb-2"
                      style={{ color: "var(--primary)" }}
                    >
                      📸 Tipo de Plano:
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                      {SHOT_TYPES.map((shot) => (
                        <button
                          key={shot.id}
                          type="button"
                          onClick={() => updateProSetting("shotType", shot.id)}
                          className={`p-2 rounded-lg text-left text-sm transition-all ${
                            proSettings.shotType === shot.id
                              ? "bg-[var(--primary)]/10 border-2 border-[var(--primary)]"
                              : "bg-white/5 border border-[var(--border)] hover:bg-white/10"
                          }`}
                        >
                          <div className="font-semibold flex items-center space-x-1">
                            <span>{shot.icon}</span>
                            <span>{shot.name}</span>
                          </div>
                          <div className="text-xs text-gray-400 mt-1">
                            {shot.description}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* 2. ÁNGULO DE CÁMARA */}
                  <div>
                    <label
                      className="block text-sm font-medium mb-2"
                      style={{ color: "var(--primary)" }}
                    >
                      🎥 Ángulo de Cámara:
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                      {CAMERA_ANGLES.map((angle) => (
                        <button
                          key={angle.id}
                          type="button"
                          onClick={() => updateProSetting("cameraAngle", angle.id)}
                          className={`p-2 rounded-lg text-left text-sm transition-all ${
                            proSettings.cameraAngle === angle.id
                              ? "bg-[var(--primary)]/10 border-2 border-[var(--primary)]"
                              : "bg-white/5 border border-[var(--border)] hover:bg-white/10"
                          }`}
                        >
                          <div className="font-semibold flex items-center space-x-1">
                            <span>{angle.icon}</span>
                            <span>{angle.name}</span>
                          </div>
                          <div className="text-xs text-gray-400 mt-1">
                            {angle.description}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* 3. GÉNERO */}
                  <div>
                    <label
                      className="block text-sm font-medium mb-2"
                      style={{ color: "var(--primary)" }}
                    >
                      Género:
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {GENDER_OPTIONS.map((gender) => (
                        <button
                          key={gender.id}
                          type="button"
                          onClick={() => updateProSetting("gender", gender.id)}
                          className={`p-2 rounded-lg text-sm transition-all ${
                            proSettings.gender === gender.id
                              ? "bg-[var(--primary)]/10 border-2 border-[var(--primary)]"
                              : "bg-white/5 border border-[var(--border)] hover:bg-white/10"
                          }`}
                        >
                          {gender.name}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* 4. ILUMINACIÓN */}
                  <div>
                    <label
                      className="block text-sm font-medium mb-2"
                      style={{ color: "var(--primary)" }}
                    >
                      Iluminación:
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {LIGHTING_SCHEMES.map((light) => (
                        <button
                          key={light.id}
                          type="button"
                          onClick={() => updateProSetting("lighting", light.id)}
                          className={`p-2 rounded-lg text-left text-sm transition-all ${
                            proSettings.lighting === light.id
                              ? "bg-[var(--primary)]/10 border-2 border-[var(--primary)]"
                              : "bg-white/5 border border-[var(--border)] hover:bg-white/10"
                          }`}
                        >
                          <div className="font-semibold">{light.name}</div>
                          <div className="text-xs text-gray-400">
                            {light.description}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* 5. LENTE */}
                  <div>
                    <label
                      className="block text-sm font-medium mb-2"
                      style={{ color: "var(--primary)" }}
                    >
                      Lente:
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                      {LENSES.map((lens) => (
                        <button
                          key={lens.id}
                          type="button"
                          onClick={() => updateProSetting("lens", lens.id)}
                          className={`p-2 rounded-lg text-left text-sm transition-all ${
                            proSettings.lens === lens.id
                              ? "bg-[var(--primary)]/10 border-2 border-[var(--primary)]"
                              : "bg-white/5 border border-[var(--border)] hover:bg-white/10"
                          }`}
                        >
                          <div className="font-semibold">{lens.name}</div>
                          <div className="text-xs text-gray-400">
                            {lens.description}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* 6. COLOR GRADING */}
                  <div>
                    <label
                      className="block text-sm font-medium mb-2"
                      style={{ color: "var(--primary)" }}
                    >
                      Color Grading:
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {COLOR_GRADING.map((grade) => (
                        <button
                          key={grade.id}
                          type="button"
                          onClick={() =>
                            updateProSetting("colorGrading", grade.id)
                          }
                          className={`p-2 rounded-lg text-left text-sm transition-all ${
                            proSettings.colorGrading === grade.id
                              ? "bg-[var(--primary)]/10 border-2 border-[var(--primary)]"
                              : "bg-white/5 border border-[var(--border)] hover:bg-white/10"
                          }`}
                        >
                          <div className="font-semibold">{grade.name}</div>
                          <div className="text-xs text-gray-400">
                            {grade.description}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* 7. OUTFIT */}
                  {currentOutfits.length > 0 && (
                    <div>
                      <label
                        className="block text-sm font-medium mb-2"
                        style={{ color: "var(--primary)" }}
                      >
                        Outfit Style ({proSettings.gender === "masculine" ? "Masculino" : proSettings.gender === "feminine" ? "Femenino" : "Todos"}):
                      </label>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 max-h-96 overflow-y-auto">
                        {currentOutfits.map((outfit) => (
                          <button
                            key={outfit.id}
                            type="button"
                            onClick={() =>
                              updateProSetting("outfit", outfit.id)
                            }
                            className={`p-2 rounded-lg text-left text-sm transition-all ${
                              proSettings.outfit === outfit.id
                                ? "bg-[var(--primary)]/10 border-2 border-[var(--primary)]"
                                : "bg-white/5 border border-[var(--border)] hover:bg-white/10"
                            }`}
                          >
                            <div className="font-semibold">{outfit.name}</div>
                            <div className="text-xs text-gray-400">
                              {outfit.description}
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* BOTÓN GENERAR */}
            <button
              type="submit"
              disabled={isLoading || (!prompt && !referenceImage)}
              className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-[#FFD700] to-[#FFA500] text-black px-6 py-4 rounded-lg font-bold text-lg hover:shadow-2xl hover:from-[#FFC700] hover:to-[#FF9500] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:from-[#FFD700] disabled:hover:to-[#FFA500]"
            >
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  <span>Generando...</span>
                </>
              ) : (
                <>
                  <Sparkles size={20} />
                  <span>Generar Prompt Profesional</span>
                </>
              )}
            </button>
          </form>

          {/* ANÁLISIS DE CALIDAD */}
          <QualityAnalysis
            analysis={qualityAnalysis}
            isPro={isPro}
            onApplySuggestions={handleApplySuggestions}
            isApplying={isApplyingSuggestions}
          />

          {/* RESULTADO */}
          <div className="mt-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-lg">Prompt Generado:</h3>
              {response && validation && (
                <div
                  className={`text-sm px-3 py-1 rounded-full ${
                    validation.optimal
                      ? "bg-green-500/20 text-green-400 border border-green-500/50"
                      : validation.acceptable
                      ? "bg-yellow-500/20 text-yellow-400 border border-yellow-500/50"
                      : "bg-red-500/20 text-red-400 border border-red-500/50"
                  }`}
                >
                  {validation.length} caracteres • {validation.message}
                </div>
              )}
            </div>

            <div className="bg-black/40 border border-[var(--border)] rounded-lg p-4">
              <pre className="text-gray-300 whitespace-pre-wrap font-sans text-sm">
                {response || "Aquí aparecerá el prompt generado..."}
              </pre>
              {response && (
                <>
                  <div className="mt-4 p-3 bg-[var(--primary)]/10 border border-[var(--primary)]/30 rounded-lg text-sm">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="font-semibold">
                        Optimizado para {PLATFORM_INFO[selectedPlatform].name}
                      </span>
                    </div>
                    {selectedPlatform === "midjourney" && (
                      <div className="text-xs text-gray-400">
                        Los parámetros están al final del prompt. Puedes ajustar
                        --ar, --s, --q según necesites.
                      </div>
                    )}
                    {selectedPlatform === "nano-banana" && (
                      <div className="text-xs text-gray-400">
                        Este prompt está optimizado como párrafo continuo.
                      </div>
                    )}
                  </div>

                  <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={handleCopy}
                      className="w-full flex items-center justify-center space-x-2 bg-[var(--surface)] text-white px-4 py-3 rounded-lg font-bold hover:bg-[var(--surface)]/80 transition"
                    >
                      {copied ? (
                        <>
                          <Check size={18} />
                          <span>Copiado</span>
                        </>
                      ) : (
                        <>
                          <Copy size={18} />
                          <span>Copiar Prompt</span>
                        </>
                      )}
                    </button>

                    {selectedPlatform === "nano-banana" && (
                      <button
                        type="button"
                        onClick={handleUseInGemini}
                        className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-[#FFD700] to-[#FFA500] text-black px-4 py-3 rounded-lg font-bold hover:shadow-lg hover:from-[#FFC700] hover:to-[#FF9500] transition-all"
                      >
                        <Send size={18} />
                        <span>Usar en Gemini</span>
                      </button>
                    )}

                    {selectedPlatform === "midjourney" && (
                      <button
                        type="button"
                        onClick={() =>
                          window.open("https://www.midjourney.com", "_blank")
                        }
                        className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-[#FFD700] to-[#FFA500] text-black px-4 py-3 rounded-lg font-bold hover:shadow-lg hover:from-[#FFC700] hover:to-[#FF9500] transition-all"
                      >
                        <ImageIcon size={18} />
                        <span>Ir a Midjourney</span>
                      </button>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
