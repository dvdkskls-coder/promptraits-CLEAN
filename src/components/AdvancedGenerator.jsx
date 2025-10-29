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

// ✅ IMPORTAR SOLO OUTFIT_STYLES
import { OUTFIT_STYLES } from "../data/outfitStylesData";

// ============================================================================
// ✨ CARACTERÍSTICAS RÁPIDAS (Solo 1 seleccionable)
// ============================================================================
const QUICK_FEATURES = [
  {
    id: "professional-lighting",
    name: "Iluminación Profesional",
    description: "Rembrandt, Butterfly o Loop lighting",
  },
  {
    id: "bokeh",
    name: "Fondo Desenfocado",
    description: "Shallow depth of field con 85mm",
  },
  {
    id: "cinematic",
    name: "Look Cinematográfico",
    description: "Black Pro-Mist effect",
  },
  {
    id: "golden-hour",
    name: "Golden Hour",
    description: "Luz cálida de atardecer",
  },
  {
    id: "smooth-skin",
    name: "Piel Suave y Uniforme",
    description: "Skin tone uniformity",
  },
  {
    id: "teal-orange",
    name: "Teal & Orange",
    description: "Color grading Hollywood",
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
  },
  {
    id: "butterfly",
    name: "Butterfly",
    description: "Frontal elevada, sombra nariz",
  },
  { id: "loop", name: "Loop", description: "45° elevada, sombra bucle" },
  { id: "split", name: "Split", description: "Lateral 90°, mitad luz/sombra" },
  { id: "broad", name: "Broad", description: "Lado hacia cámara iluminado" },
  { id: "short", name: "Short", description: "Lado alejado iluminado" },
];

const LENSES = [
  { id: "24-35mm", name: "24-35mm", description: "Gran angular, contexto" },
  { id: "50mm", name: "50mm", description: "Normal, versátil" },
  { id: "85mm", name: "85mm", description: "REY del retrato" },
  {
    id: "135-200mm",
    name: "135-200mm",
    description: "Teleobjetivo, compresión",
  },
];

const COLOR_GRADING = [
  {
    id: "teal-orange",
    name: "Teal & Orange",
    description: "Hollywood blockbuster",
  },
  {
    id: "vintage",
    name: "Vintage Film",
    description: "Tonos pastel, contraste suave",
  },
  { id: "high-key", name: "High-Key", description: "Brillante, optimista" },
  { id: "low-key", name: "Low-Key", description: "Oscuro, dramático" },
  { id: "warm", name: "Warm Tones", description: "Tonos cálidos" },
  { id: "cool", name: "Cool Tones", description: "Tonos fríos" },
];

const FILTERS = [
  {
    id: "black-pro-mist",
    name: "Black Pro-Mist",
    description: "Look cinematográfico",
  },
  { id: "nd", name: "ND Filter", description: "Largas exposiciones, bokeh" },
  {
    id: "polarizer",
    name: "Polarizer",
    description: "Elimina reflejos, satura",
  },
  {
    id: "anamorphic",
    name: "Anamorphic Flare",
    description: "Destello horizontal azul",
  },
];

const ASPECT_RATIOS = [
  { id: "1:1", name: "1:1", description: "Cuadrado (Instagram)" },
  { id: "3:4", name: "3:4", description: "Vertical retrato" },
  { id: "4:5", name: "4:5", description: "Vertical Instagram" },
  { id: "9:16", name: "9:16", description: "Vertical Stories/Reels" },
  { id: "16:9", name: "16:9", description: "Horizontal panorámico" },
  { id: "4:3", name: "4:3", description: "Horizontal clásico" },
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
    gender: "neutral",
    lighting: null,
    lens: null,
    colorGrading: null,
    filter: null,
    aspectRatio: null,
    outfit: null,
  });

  const isPro = profile?.plan === "pro" || profile?.plan === "premium";

  // ✅ Convertir OUTFIT_STYLES a array
  const outfitStylesArray = OUTFIT_STYLES ? Object.values(OUTFIT_STYLES) : [];

  // ============================================================================
  // EFECTO: Cuando se abre PRO, limpia características rápidas
  // ============================================================================
  useEffect(() => {
    if (showProTools) {
      setSelectedFeature(null);
    }
  }, [showProTools]);

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
        gender: "neutral",
        lighting: null,
        lens: null,
        colorGrading: null,
        filter: null,
        aspectRatio: null,
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
      let enhancedPrompt = prompt;

      // Si hay característica rápida seleccionada
      if (selectedFeature) {
        const feature = QUICK_FEATURES.find((f) => f.id === selectedFeature);
        if (feature) {
          enhancedPrompt = `${prompt}. Apply: ${feature.description}`;
        }
      }

      const payload = {
        prompt: enhancedPrompt,
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
      console.error("No hay sugerencias válidas para aplicar");
      return;
    }

    setIsApplyingSuggestions(true);

    try {
      const res = await fetch("/api/gemini-processor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          applySuggestions: true,
          currentPrompt: response,
          suggestions: suggestions,
          isPro,
          platform: selectedPlatform,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Error al aplicar sugerencias");
      }

      setResponse(data.prompt);
      setQualityAnalysis(null);
    } catch (error) {
      console.error("Error al aplicar sugerencias:", error);
      alert("Error al aplicar sugerencias: " + error.message);
    } finally {
      setIsApplyingSuggestions(false);
    }
  };

  return (
    <section className="min-h-screen py-24 px-6">
      <div className="max-w-5xl mx-auto">
        <AnimatedSection>
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Generador Avanzado de Prompts
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Tecnología profesional con Gemini 2.0 Flash Experimental
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* ============================================================================ */}
            {/* 1. INPUT (80%) + IMAGEN (20%) */}
            {/* ============================================================================ */}
            <div className="flex gap-4">
              {/* INPUT */}
              <div className="flex-[0.8]">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Describe lo que quieres generar:
                </label>
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  rows={8}
                  placeholder="Retrato cinematográfico en un garaje abandonado"
                  className="w-full px-4 py-3 bg-black/40 border border-[var(--border)] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[var(--primary)] transition resize-none"
                />
                {referenceImage && (
                  <p className="text-xs text-yellow-400 mt-2">
                    ⚠️ Con imagen: NO describas físicamente a la persona (edad,
                    género, pelo). Solo pose, expresión y outfit.
                  </p>
                )}
              </div>

              {/* IMAGEN */}
              <div className="flex-[0.2]">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Imagen de Referencia:
                </label>

                {!imagePreview ? (
                  <label className="flex flex-col items-center justify-center w-full h-full border-2 border-dashed border-[var(--border)] rounded-lg cursor-pointer hover:border-[var(--primary)] transition bg-black/20">
                    <Upload size={32} className="text-gray-400 mb-2" />
                    <span className="text-xs text-gray-400 text-center px-2">
                      Sube una foto
                    </span>
                    <span className="text-xs text-gray-500 mt-1">Max 4MB</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                ) : (
                  <div className="relative w-full h-full">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-full object-cover rounded-lg border border-[var(--border)]"
                    />
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full hover:bg-red-600 transition"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* ============================================================================ */}
            {/* 2. PLATAFORMA */}
            {/* ============================================================================ */}
            <div className="bg-[var(--surface)]/50 border border-[var(--border)] rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3
                  className="font-semibold text-lg"
                  style={{ color: "var(--primary)" }}
                >
                  Plataforma de Destino
                </h3>
                <button
                  type="button"
                  onClick={() => setShowPlatformInfo(!showPlatformInfo)}
                  className="text-sm text-[var(--primary)] hover:underline flex items-center space-x-1"
                >
                  <Info size={16} />
                  <span>{showPlatformInfo ? "Ocultar" : "Más info"}</span>
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <button
                  type="button"
                  onClick={() => setSelectedPlatform("nano-banana")}
                  className={`p-4 rounded-lg border-2 transition-all text-left ${
                    selectedPlatform === "nano-banana"
                      ? "border-[var(--primary)] bg-[var(--primary)]/10"
                      : "border-[var(--border)] bg-black/20 hover:border-[var(--primary)]/50"
                  }`}
                >
                  <div className="font-bold mb-1">Nano-Banana</div>
                  <div className="text-xs text-gray-400">
                    Google Gemini • Imagen.ia
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedPlatform("midjourney")}
                  className={`p-4 rounded-lg border-2 transition-all text-left ${
                    selectedPlatform === "midjourney"
                      ? "border-[var(--primary)] bg-[var(--primary)]/10"
                      : "border-[var(--border)] bg-black/20 hover:border-[var(--primary)]/50"
                  }`}
                >
                  <div className="font-bold mb-1">Midjourney V7</div>
                  <div className="text-xs text-gray-400">
                    Control total • Parámetros
                  </div>
                </button>
              </div>

              {showPlatformInfo && (
                <div className="bg-black/30 border border-[var(--border)] rounded-lg p-4">
                  <h4 className="font-semibold mb-2">
                    {PLATFORM_INFO[selectedPlatform].name}
                  </h4>
                  <p className="text-sm text-gray-400 mb-3">
                    {PLATFORM_INFO[selectedPlatform].description}
                  </p>
                  <div className="space-y-1 text-sm text-gray-300">
                    {PLATFORM_INFO[selectedPlatform].features.map(
                      (feature, idx) => (
                        <div key={idx}>• {feature}</div>
                      )
                    )}
                  </div>
                  <div className="mt-3 p-2 bg-[var(--primary)]/10 border border-[var(--primary)]/30 rounded text-xs text-gray-300">
                    <strong>Tip:</strong> {PLATFORM_INFO[selectedPlatform].tips}
                  </div>
                </div>
              )}
            </div>

            {/* ============================================================================ */}
            {/* 3. CARACTERÍSTICAS RÁPIDAS */}
            {/* ============================================================================ */}
            <div className="bg-[var(--surface)]/50 border border-[var(--border)] rounded-xl p-6">
              <h3
                className="font-semibold text-lg mb-2"
                style={{ color: "var(--primary)" }}
              >
                Características Rápidas
              </h3>
              <p className="text-sm text-gray-400 mb-4">
                Selecciona un efecto profesional (solo uno)
              </p>

              {showProTools && (
                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3 text-sm text-yellow-400 mb-4">
                  ⚠️ Herramientas PRO está activo. Las características rápidas
                  están desactivadas.
                </div>
              )}

              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {QUICK_FEATURES.map((feature) => (
                  <button
                    key={feature.id}
                    type="button"
                    onClick={() => selectFeature(feature.id)}
                    disabled={showProTools}
                    className={`p-4 rounded-lg border-2 transition-all text-left ${
                      selectedFeature === feature.id && !showProTools
                        ? "border-[var(--primary)] bg-[var(--primary)]/10"
                        : "border-[var(--border)] bg-black/20 hover:border-[var(--primary)]/30"
                    } ${showProTools ? "opacity-30 cursor-not-allowed" : ""}`}
                  >
                    <div
                      className="font-semibold mb-1"
                      style={{ color: "var(--primary)" }}
                    >
                      {feature.name}
                    </div>
                    <div className="text-xs text-gray-400">
                      {feature.description}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* ============================================================================ */}
            {/* 4. BOTÓN GENERAR */}
            {/* ============================================================================ */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={
                  isLoading ||
                  (!prompt && !referenceImage) ||
                  !profile ||
                  profile.credits <= 0
                }
                className="w-full bg-[var(--primary)] text-black px-6 py-4 rounded-full font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transition-all flex items-center justify-center space-x-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="animate-spin" size={20} />
                    <span>Generando prompt profesional...</span>
                  </>
                ) : !profile || profile.credits <= 0 ? (
                  <span>Sin créditos disponibles</span>
                ) : (
                  <>
                    <Sparkles size={20} />
                    <span>Generar Prompt ({profile.credits} créditos)</span>
                  </>
                )}
              </button>
              {profile && (
                <p className="text-xs text-center mt-2 opacity-60">
                  {profile.credits > 0
                    ? `Tienes ${profile.credits} crédito${
                        profile.credits !== 1 ? "s" : ""
                      } disponible${profile.credits !== 1 ? "s" : ""}`
                    : "No tienes créditos. Actualiza tu plan para continuar."}
                </p>
              )}
            </div>

            {/* ============================================================================ */}
            {/* 5. HERRAMIENTAS PRO - SIMPLIFICADAS (7 elementos) */}
            {/* ============================================================================ */}
            <div>
              {!isPro && (
                <div className="mb-3 p-3 bg-[var(--primary)]/10 border border-[var(--primary)] rounded-lg flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Crown className="text-[var(--primary)]" size={20} />
                    <span className="text-sm font-semibold">
                      Desbloquea herramientas PRO
                    </span>
                  </div>
                  <a
                    href="#planes"
                    className="text-[var(--primary)] hover:opacity-90 text-sm font-semibold"
                  >
                    Actualizar a PRO →
                  </a>
                </div>
              )}

              <button
                type="button"
                onClick={() => setShowProTools(!showProTools)}
                disabled={!isPro}
                className="w-full flex items-center justify-between p-3 bg-[var(--surface)]/30 border border-[var(--border)] rounded-lg hover:border-[var(--primary)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="font-semibold flex items-center space-x-2">
                  <Crown className="w-5 h-5 text-[var(--primary)]" />
                  <span>Herramientas PRO</span>
                  {showProTools && (
                    <span className="text-xs bg-[var(--primary)]/20 text-[var(--primary)] px-2 py-1 rounded">
                      ACTIVO
                    </span>
                  )}
                </span>
                {showProTools ? <ChevronUp /> : <ChevronDown />}
              </button>

              {showProTools && isPro && (
                <div className="mt-3 p-4 bg-black/30 border border-[var(--border)] rounded-lg space-y-6">
                  {/* 1. GÉNERO */}
                  <div>
                    <label
                      className="block text-sm font-medium mb-2"
                      style={{ color: "var(--primary)" }}
                    >
                      Género (para outfit/maquillaje):
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
                    <p className="text-xs text-gray-500 mt-1">
                      * NO aparece en el prompt, solo guía el outfit/maquillaje
                    </p>
                  </div>

                  {/* 2. ILUMINACIÓN */}
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

                  {/* 3. LENTE */}
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

                  {/* 4. COLOR GRADING */}
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

                  {/* 5. FILTROS */}
                  <div>
                    <label
                      className="block text-sm font-medium mb-2"
                      style={{ color: "var(--primary)" }}
                    >
                      Filtros:
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                      {FILTERS.map((filter) => (
                        <button
                          key={filter.id}
                          type="button"
                          onClick={() => updateProSetting("filter", filter.id)}
                          className={`p-2 rounded-lg text-left text-sm transition-all ${
                            proSettings.filter === filter.id
                              ? "bg-[var(--primary)]/10 border-2 border-[var(--primary)]"
                              : "bg-white/5 border border-[var(--border)] hover:bg-white/10"
                          }`}
                        >
                          <div className="font-semibold">{filter.name}</div>
                          <div className="text-xs text-gray-400">
                            {filter.description}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* 6. ASPECT RATIO */}
                  <div>
                    <label
                      className="block text-sm font-medium mb-2"
                      style={{ color: "var(--primary)" }}
                    >
                      Aspect Ratio:
                    </label>
                    <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
                      {ASPECT_RATIOS.map((ratio) => (
                        <button
                          key={ratio.id}
                          type="button"
                          onClick={() =>
                            updateProSetting("aspectRatio", ratio.id)
                          }
                          className={`p-2 rounded-lg text-left text-sm transition-all ${
                            proSettings.aspectRatio === ratio.id
                              ? "bg-[var(--primary)]/10 border-2 border-[var(--primary)]"
                              : "bg-white/5 border border-[var(--border)] hover:bg-white/10"
                          }`}
                        >
                          <div className="font-semibold">{ratio.name}</div>
                          <div className="text-xs text-gray-400">
                            {ratio.description}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* 7. OUTFIT */}
                  {outfitStylesArray.length > 0 && (
                    <div>
                      <label
                        className="block text-sm font-medium mb-2"
                        style={{ color: "var(--primary)" }}
                      >
                        Outfit Style:
                      </label>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 max-h-96 overflow-y-auto">
                        {outfitStylesArray.map((outfit) => (
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
                        className="w-full flex items-center justify-center space-x-2 bg-[var(--primary)] text-black px-4 py-3 rounded-lg font-bold hover:shadow transition"
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
                        className="w-full flex items-center justify-center space-x-2 bg-[var(--primary)] text-black px-4 py-3 rounded-lg font-bold hover:shadow transition"
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
