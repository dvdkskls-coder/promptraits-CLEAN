import React, { useState } from "react";
import {
  Camera,
  Upload,
  Trash2,
  Sparkles,
  Copy,
  Check,
  Loader2,
  Wand2,
  Lightbulb,
  ChevronDown,
  ChevronUp,
  Crown,
  Lock,
  Send,
  Info,
  Zap,
  Image as ImageIcon,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { supabase } from "../lib/supabase";
import AnimatedSection from "./AnimatedSection";
import QualityAnalysis from "./QualityAnalysis";

// ✅ IMPORTAR DATOS DE PRESETS ORGANIZADOS
import {
  presetsData,
  getFreePresets,
  getProPresets,
  PRESET_PLANS,
} from "../data/presetsData";

// ✅ IMPORTAR NUEVOS DATOS DE COMPOSICIÓN
import { SHOT_TYPES, getRandomShotType } from "../data/shotTypesData";
import { OUTFIT_STYLES, getRandomOutfit } from "../data/outfitStylesData";
import { 
  ENVIRONMENTS, 
  ENVIRONMENT_CATEGORIES,
  getEnvironmentsByCategory,
  getRandomEnvironment 
} from "../data/environmentsData";

// SCENARIOS (8 escenarios) - Mantener igual por ahora
const SCENARIOS = [
  {
    id: 1,
    name: "Estudio Fondo Negro",
    description: "Minimalista, dramático, fondo oscuro",
    prompt:
      "Professional studio with seamless black backdrop, controlled studio lighting, minimal distractions, dramatic atmosphere",
  },
  {
    id: 2,
    name: "Calle Europea Atardecer",
    description: "Arquitectura clásica, luz dorada",
    prompt:
      "Narrow European street at golden hour, classic architecture, warm natural light, romantic urban setting",
  },
  {
    id: 3,
    name: "Playa Amanecer Contraluz",
    description: "Costa, luz suave, horizonte marino",
    prompt:
      "Sandy beach at sunrise, soft backlight, ocean horizon, serene coastal atmosphere, natural elements",
  },
  {
    id: 4,
    name: "Urbano Nocturno Neones",
    description: "Ciudad de noche, luces vibrantes",
    prompt:
      "Night city street with neon signs, urban nightlife, artificial lights, modern metropolitan atmosphere",
  },
  {
    id: 5,
    name: "Interior Ventana Natural",
    description: "Luz de ventana lateral suave",
    prompt:
      "Indoor setting with large window as single light source, soft natural side lighting, minimal interior",
  },
  {
    id: 6,
    name: "Bosque Niebla Atmosférico",
    description: "Naturaleza, bruma, luz filtrada",
    prompt:
      "Misty forest setting, atmospheric fog, filtered natural light, mysterious woodland ambiance",
  },
  {
    id: 7,
    name: "Azotea Ciudad Atardecer",
    description: "Skyline urbano, golden hour",
    prompt:
      "Rooftop location at sunset, city skyline backdrop, elevated perspective, urban golden hour",
  },
  {
    id: 8,
    name: "Industrial Warehouse Oscuro",
    description: "Grungy, luces prácticas, textura",
    prompt:
      "Dark industrial warehouse, grungy textures, practical lighting, raw urban aesthetic",
  },
];

// IDEAS ALEATORIAS para generar (PRO feature) - 50 ideas variadas
const RANDOM_IDEAS = [
  // INTERIORES ELEGANTES (10)
  "Retrato elegante en biblioteca antigua con luz de ventana natural suave",
  "Fotografía editorial en museo de arte moderno con luz cenital controlada",
  "Sesión íntima en café parisino vintage con luz cálida de atardecer",
  "Retrato minimalista en galería de arte blanca con iluminación puntual",
  "Fotografía conceptual en teatro abandonado con luz dramática filtrada",
  "Sesión de moda en loft industrial con ventanales amplios y luz natural",
  "Retrato cinematográfico en hotel boutique art déco con iluminación ambiente",
  "Fotografía lifestyle en estudio de arquitecto con luz natural difusa",
  "Retrato editorial en bar speakeasy con luces prácticas y neones sutiles",
  "Sesión creativa en biblioteca pública con columnas clásicas y luz lateral",
  
  // URBANO EXTERIOR (10)
  "Fotografía urbana nocturna con reflejos en charcos y luces de neón vibrantes",
  "Retrato de calle en mercado callejero colorido al mediodía con sombras marcadas",
  "Sesión editorial en azotea urbana al atardecer con skyline de fondo",
  "Fotografía de moda en callejón de graffiti con luz natural contrastada",
  "Retrato cinematográfico en estación de tren vintage con luz volumétrica",
  "Sesión urbana en puente de acero al amanecer con niebla atmosférica",
  "Fotografía lifestyle en plaza europea con arquitectura clásica y luz dorada",
  "Retrato nocturno en Times Square con luces artificiales multicolor",
  "Sesión de moda en parking subterráneo con luz de neón fría",
  "Fotografía editorial en escaleras de metro con luz artificial dramática",
  
  // NATURALEZA Y EXTERIOR (10)
  "Sesión lifestyle en campo de lavanda al atardecer con luz dorada suave",
  "Retrato en bosque de niebla con luz filtrada entre árboles al amanecer",
  "Fotografía editorial en playa desierta al sunrise con contraluz dramático",
  "Sesión bohemia en jardín botánico con luz natural difusa de mediodía",
  "Retrato en acantilado costero al golden hour con viento natural",
  "Fotografía de moda en desierto al atardecer con luz cálida rasante",
  "Sesión íntima en viñedo al amanecer con niebla baja y luz suave",
  "Retrato en campo de trigo dorado con luz de tarde lateral",
  "Fotografía lifestyle en lago de montaña con reflejo y luz azul",
  "Sesión editorial en cañón rocoso con luz dramática de mediodía",
  
  // CONCEPTUAL Y CREATIVO (10)
  "Retrato conceptual en museo de historia natural con iluminación direccional",
  "Fotografía surrealista en estudio con fondos de colores vibrantes",
  "Sesión creativa en invernadero tropical con luz natural filtrada por plantas",
  "Retrato artístico en galería de espejos con reflejos múltiples",
  "Fotografía experimental en túnel urbano con luz led multicolor",
  "Sesión conceptual en escalera caracol minimalista con luz cenital",
  "Retrato editorial en habitación victoriana con luz de velas y ambiente",
  "Fotografía creativa en piscina cubierta con luz reflejada en agua",
  "Sesión artística en iglesia gótica abandonada con luz de vitral",
  "Retrato conceptual en sala de máquinas vintage con luz práctica",
  
  // MODA Y EDITORIAL (10)
  "Sesión de alta moda en estudio minimalista con fondo infinito blanco",
  "Fotografía editorial en showroom de diseño con luz arquitectónica",
  "Retrato de moda en boutique de lujo con iluminación comercial suave",
  "Sesión editorial en pasarela con luz de estudio profesional",
  "Fotografía de moda en mansión clásica con luz de araña y ambiente",
  "Retrato editorial en jardín francés con luz natural filtrada",
  "Sesión de moda en warehouse moderno con luz industrial dura",
  "Fotografía editorial en yate de lujo al sunset con luz dorada",
  "Retrato de moda en penthouse con vista panorámica y luz de ciudad",
  "Sesión editorial en estudio fotográfico con setup de tres puntos clásico",
];

// ============================================================================
// ✨ NUEVO: CARACTERÍSTICAS RÁPIDAS (QUICK FEATURES)
// ============================================================================
const QUICK_FEATURES = [
  {
    id: 'professional-lighting',
    name: 'Iluminación Profesional',
    description: 'Rembrandt, Butterfly o Loop lighting',
    icon: '💡',
  },
  {
    id: 'bokeh',
    name: 'Fondo Desenfocado (Bokeh)',
    description: 'Shallow depth of field con 85mm',
    icon: '🎯',
  },
  {
    id: 'cinematic',
    name: 'Look Cinematográfico',
    description: 'Black Pro-Mist effect',
    icon: '🎬',
  },
  {
    id: 'golden-hour',
    name: 'Golden Hour',
    description: 'Luz cálida mágica de atardecer',
    icon: '🌅',
  },
  {
    id: 'smooth-skin',
    name: 'Piel Suave y Uniforme',
    description: 'Skin tone uniformity',
    icon: '✨',
  },
  {
    id: 'teal-orange',
    name: 'Teal & Orange',
    description: 'Color grading cinematográfico',
    icon: '🎨',
  },
];

// ============================================================================
// ✨ NUEVO: INFORMACIÓN DE PLATAFORMAS
// ============================================================================
const PLATFORM_INFO = {
  'nano-banana': {
    name: 'Nano-Banana (Google Gemini)',
    icon: '🤖',
    description: 'Imagen.ia basado en Google Gemini',
    features: [
      '✅ Un párrafo continuo y fluido',
      '✅ 1200-1600 caracteres óptimo',
      '✅ Especificar orientación (vertical/horizontal)',
      '❌ NO soporta prompts negativos',
    ],
    tips: 'Genera cuadrado (1:1) por defecto. Especifica "vertical portrait format" o "wide horizontal".',
  },
  'midjourney': {
    name: 'Midjourney V7',
    icon: '🎨',
    description: 'Plataforma líder en generación artística',
    features: [
      '✅ Parámetros al final (--ar, --v, --s, --q)',
      '✅ Soporta prompts negativos (--no)',
      '✅ Control total con seeds (--seed)',
      '✅ Stylize para fotorrealismo (--s 50-100)',
    ],
    tips: 'Usa --ar para aspect ratio, --q 2 para máxima calidad, --s bajo para fotorrealismo.',
  },
};

export default function AdvancedGenerator() {
  const { user, profile, refreshProfile } = useAuth();
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [referenceImage, setReferenceImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [selectedPreset, setSelectedPreset] = useState(null);
  const [selectedScenario, setSelectedScenario] = useState(null);
  const [showProTools, setShowProTools] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [qualityAnalysis, setQualityAnalysis] = useState(null);
  const [isApplyingSuggestions, setIsApplyingSuggestions] = useState(false);
  const [copied, setCopied] = useState(false);
  
  // ✨ NUEVO: Estados para plataforma y características rápidas
  const [selectedPlatform, setSelectedPlatform] = useState('nano-banana');
  const [selectedFeatures, setSelectedFeatures] = useState([]);
  const [showPlatformInfo, setShowPlatformInfo] = useState(false);
  const [validation, setValidation] = useState(null);

  const [sliders, setSliders] = useState({
    aperture: 2.8,
    focalLength: 85,
    contrast: "medium",
    grain: "subtle",
    temperature: 5600,
  });

  // ✅ NUEVOS ESTADOS para composición avanzada
  const [selectedShotType, setSelectedShotType] = useState(null);
  const [selectedOutfit, setSelectedOutfit] = useState(null);
  const [selectedEnvironment, setSelectedEnvironment] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const isPro = profile?.plan === "pro" || profile?.plan === "premium";

  const freePresets = getFreePresets();
  const proPresets = getProPresets();

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

  // ✨ NUEVO: Toggle de características rápidas
  const toggleFeature = (featureId) => {
    setSelectedFeatures(prev => 
      prev.includes(featureId) 
        ? prev.filter(id => id !== featureId)
        : [...prev, featureId]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setResponse("");
    setQualityAnalysis(null);
    setValidation(null);

    try {
      // ✨ CONSTRUIR PROMPT CON CARACTERÍSTICAS SELECCIONADAS
      let enhancedPrompt = prompt;
      
      // Añadir características rápidas al contexto
      if (selectedFeatures.length > 0) {
        const featureDescriptions = selectedFeatures.map(id => {
          const feature = QUICK_FEATURES.find(f => f.id === id);
          return feature ? feature.description : '';
        }).filter(Boolean).join(', ');
        
        enhancedPrompt = `${prompt}. Apply these features: ${featureDescriptions}`;
      }

      const payload = {
        prompt: enhancedPrompt,
        referenceImage,
        mimeType: "image/jpeg",
        preset: selectedPreset
          ? presetsData.find((p) => p.id === selectedPreset)?.prompt
          : null,
        scenario: selectedScenario
          ? SCENARIOS.find((s) => s.id === selectedScenario)?.prompt
          : null,
        sliders: showAdvanced ? sliders : null,
        analyzeQuality: isPro,
        isPro,
        shotType: selectedShotType,
        outfitStyle: selectedOutfit,
        environment: selectedEnvironment,
        platform: selectedPlatform, // ✨ NUEVO: Enviar plataforma seleccionada
      };

      const res = await fetch("/api/gemini-processor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Error al generar el prompt");
      }

      setResponse(data.prompt);
      setQualityAnalysis(data.qualityAnalysis);
      setValidation(data.validation); // ✨ NUEVO: Guardar validación

      await supabase
        .from("profiles")
        .update({
          credits: (profile.credits || 0) - 1,
        })
        .eq("id", user.id);

      await refreshProfile();
    } catch (error) {
      console.error("Error:", error);
      alert(error.message);
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
    if (!suggestions || suggestions.length === 0) return;

    setIsApplyingSuggestions(true);

    try {
      const res = await fetch("/api/gemini-processor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          applySuggestions: true,
          currentPrompt: response,
          suggestions,
          isPro,
          platform: selectedPlatform, // ✨ NUEVO
        }),
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

  const generateRandomIdea = () => {
    const randomIdea = RANDOM_IDEAS[Math.floor(Math.random() * RANDOM_IDEAS.length)];
    const randomShotType = getRandomShotType();
    const randomOutfit = getRandomOutfit();
    const randomEnvironment = getRandomEnvironment();

    setPrompt(randomIdea);
    setSelectedShotType(randomShotType);
    setSelectedOutfit(randomOutfit);
    setSelectedEnvironment(randomEnvironment);
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
            {/* ✨ NUEVO: SELECTOR DE PLATAFORMA */}
            {/* ============================================================================ */}
            <div className="bg-[var(--surface)]/50 border border-[var(--border)] rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-lg flex items-center space-x-2">
                  <Zap className="w-5 h-5 text-[var(--primary)]" />
                  <span>Plataforma de Destino</span>
                </h3>
                <button
                  type="button"
                  onClick={() => setShowPlatformInfo(!showPlatformInfo)}
                  className="text-sm text-[var(--primary)] hover:underline flex items-center space-x-1"
                >
                  <Info size={16} />
                  <span>{showPlatformInfo ? 'Ocultar info' : 'Más info'}</span>
                </button>
              </div>

              {/* Botones de selección de plataforma */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <button
                  type="button"
                  onClick={() => setSelectedPlatform('nano-banana')}
                  className={`p-4 rounded-lg border-2 transition-all text-left ${
                    selectedPlatform === 'nano-banana'
                      ? 'border-[var(--primary)] bg-[var(--primary)]/10'
                      : 'border-[var(--border)] bg-black/20 hover:border-[var(--primary)]/50'
                  }`}
                >
                  <div className="flex items-center space-x-3 mb-2">
                    <span className="text-2xl">🤖</span>
                    <div>
                      <div className="font-bold">Nano-Banana</div>
                      <div className="text-xs text-gray-400">Google Gemini</div>
                    </div>
                  </div>
                  <div className="text-xs text-gray-400">
                    Imagen.ia • Párrafo continuo
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedPlatform('midjourney')}
                  className={`p-4 rounded-lg border-2 transition-all text-left ${
                    selectedPlatform === 'midjourney'
                      ? 'border-[var(--primary)] bg-[var(--primary)]/10'
                      : 'border-[var(--border)] bg-black/20 hover:border-[var(--primary)]/50'
                  }`}
                >
                  <div className="flex items-center space-x-3 mb-2">
                    <span className="text-2xl">🎨</span>
                    <div>
                      <div className="font-bold">Midjourney</div>
                      <div className="text-xs text-gray-400">V7</div>
                    </div>
                  </div>
                  <div className="text-xs text-gray-400">
                    Parámetros • Control total
                  </div>
                </button>
              </div>

              {/* Info detallada de plataforma */}
              {showPlatformInfo && (
                <div className="bg-black/30 border border-[var(--border)] rounded-lg p-4 space-y-3">
                  <div className="flex items-start space-x-3">
                    <span className="text-2xl">{PLATFORM_INFO[selectedPlatform].icon}</span>
                    <div className="flex-1">
                      <h4 className="font-semibold mb-1">{PLATFORM_INFO[selectedPlatform].name}</h4>
                      <p className="text-sm text-gray-400 mb-3">
                        {PLATFORM_INFO[selectedPlatform].description}
                      </p>
                      <div className="space-y-1 text-sm">
                        {PLATFORM_INFO[selectedPlatform].features.map((feature, idx) => (
                          <div key={idx} className="text-gray-300">{feature}</div>
                        ))}
                      </div>
                      <div className="mt-3 p-2 bg-[var(--primary)]/10 border border-[var(--primary)]/30 rounded text-xs text-gray-300">
                        💡 <strong>Tip:</strong> {PLATFORM_INFO[selectedPlatform].tips}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* ============================================================================ */}
            {/* ✨ NUEVO: CARACTERÍSTICAS RÁPIDAS */}
            {/* ============================================================================ */}
            <div className="bg-[var(--surface)]/50 border border-[var(--border)] rounded-xl p-6">
              <h3 className="font-semibold text-lg mb-4 flex items-center space-x-2">
                <Sparkles className="w-5 h-5 text-[var(--primary)]" />
                <span>Características Rápidas</span>
              </h3>
              <p className="text-sm text-gray-400 mb-4">
                Selecciona efectos profesionales para aplicar automáticamente
              </p>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {QUICK_FEATURES.map((feature) => (
                  <button
                    key={feature.id}
                    type="button"
                    onClick={() => toggleFeature(feature.id)}
                    className={`p-3 rounded-lg border-2 transition-all text-left ${
                      selectedFeatures.includes(feature.id)
                        ? 'border-[var(--primary)] bg-[var(--primary)]/10'
                        : 'border-[var(--border)] bg-black/20 hover:border-[var(--primary)]/30'
                    }`}
                  >
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="text-xl">{feature.icon}</span>
                      <span className="font-semibold text-sm">{feature.name}</span>
                    </div>
                    <div className="text-xs text-gray-400">
                      {feature.description}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* INPUT PRINCIPAL */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Describe lo que quieres generar:
              </label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                rows={4}
                placeholder="Ej: Mujer de 30 años, profesional, sonrisa confiada, traje elegante..."
                className="w-full px-4 py-3 bg-black/40 border border-[var(--border)] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[var(--primary)] transition"
              />
            </div>

            {/* IMAGEN DE REFERENCIA */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Imagen de Referencia (Opcional):
              </label>

              {!imagePreview ? (
                <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-[var(--border)] rounded-lg cursor-pointer hover:border-[var(--primary)] transition bg-black/20">
                  <Upload size={40} className="text-gray-400 mb-2" />
                  <span className="text-sm text-gray-400">
                    Sube una imagen de referencia
                  </span>
                  <span className="text-xs text-gray-500 mt-1">
                    Máximo 4MB
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
              ) : (
                <div className="relative">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-64 object-cover rounded-lg border border-[var(--border)]"
                  />
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              )}
            </div>

            {/* PRESETS FREE */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                🎨 Presets Gratuitos ({freePresets.length}):
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
                {freePresets.map((preset) => (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() =>
                      setSelectedPreset(
                        selectedPreset === preset.id ? null : preset.id
                      )
                    }
                    className={`px-2 py-2 rounded-lg text-center text-xs font-semibold transition-all ${
                      selectedPreset === preset.id
                        ? "bg-[var(--primary)]/20 border-2 border-[var(--primary)] text-white"
                        : "bg-white/5 border border-[var(--border)] text-gray-300 hover:bg-white/10 hover:border-[var(--primary)]/50"
                    }`}
                    title={preset.fullName}
                  >
                    {preset.shortName}
                  </button>
                ))}
              </div>
            </div>

            {/* HERRAMIENTAS PRO */}
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
                className="w-full flex items-center justify-between p-3 bg-[var(--surface)]/30 border border-[var(--border)] rounded-lg hover:border-[var(--primary)] transition-all"
              >
                <span className="font-semibold flex items-center space-x-2">
                  <Crown className="w-5 h-5 text-[var(--primary)]" />
                  <span>Herramientas PRO</span>
                </span>
                {showProTools ? <ChevronUp /> : <ChevronDown />}
              </button>

              {showProTools && isPro && (
                <div className="mt-3 p-4 bg-black/30 border border-[var(--border)] rounded-lg space-y-4">
                  <div>
                    <button
                      type="button"
                      onClick={generateRandomIdea}
                      className="w-full flex items-center justify-center space-x-2 bg-[var(--primary)] text-black px-4 py-3 rounded-lg font-bold hover:shadow transition-all"
                    >
                      <Lightbulb size={18} />
                      <span>💡 Generar Idea Aleatoria</span>
                    </button>
                    <p className="text-xs text-gray-400 mt-2 text-center">
                      Genera ideas completas con estilo, escenario y vestuario
                    </p>
                  </div>

                  <div className="border-t border-[var(--border)] my-2"></div>

                  {/* ✅ PRESETS PRO - BOTONES COMPACTOS */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      ✨ Presets PRO ({proPresets.length} adicionales):
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
                      {proPresets.map((preset) => (
                        <button
                          key={preset.id}
                          type="button"
                          onClick={() =>
                            setSelectedPreset(
                              selectedPreset === preset.id ? null : preset.id
                            )
                          }
                          className={`px-2 py-2 rounded-lg text-center text-xs font-semibold transition-all ${
                            selectedPreset === preset.id
                              ? "bg-[var(--primary)]/20 border-2 border-[var(--primary)] text-white"
                              : "bg-white/5 border border-[var(--border)] text-gray-300 hover:bg-white/10 hover:border-[var(--primary)]/50"
                          }`}
                          title={preset.fullName}
                        >
                          {preset.shortName}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="border-t border-[var(--border)] my-2"></div>

                  {/* ESCENARIOS */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      📍 Escenarios:
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                      {SCENARIOS.map((scenario) => (
                        <button
                          key={scenario.id}
                          type="button"
                          onClick={() =>
                            setSelectedScenario(
                              selectedScenario === scenario.id
                                ? null
                                : scenario.id
                            )
                          }
                          className={`p-2 rounded-lg text-left text-xs transition-all ${
                            selectedScenario === scenario.id
                              ? "bg-[var(--primary)]/10 border-2 border-[var(--primary)]"
                              : "bg-white/5 border border-[var(--border)] hover:bg-white/10"
                          }`}
                        >
                          <div className="text-xs font-semibold">
                            {scenario.name}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* BOTÓN GENERAR */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading || (!prompt && !referenceImage) || !profile || profile.credits <= 0}
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
                    <span>Generar Prompt para {PLATFORM_INFO[selectedPlatform].name} ({profile.credits} créditos)</span>
                  </>
                )}
              </button>
              {profile && (
                <p className="text-xs text-center mt-2 opacity-60">
                  {profile.credits > 0 
                    ? `Tienes ${profile.credits} crédito${profile.credits !== 1 ? 's' : ''} disponible${profile.credits !== 1 ? 's' : ''}`
                    : "No tienes créditos. Actualiza tu plan para continuar."}
                </p>
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

          {/* ============================================================================ */}
          {/* ✨ NUEVO: RESULTADO CON VALIDACIÓN */}
          {/* ============================================================================ */}
          <div className="mt-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-lg">Prompt Generado:</h3>
              {response && validation && (
                <div className={`text-sm px-3 py-1 rounded-full ${
                  validation.optimal 
                    ? 'bg-green-500/20 text-green-400 border border-green-500/50'
                    : validation.acceptable
                    ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/50'
                    : 'bg-red-500/20 text-red-400 border border-red-500/50'
                }`}>
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
                  {/* Info adicional de plataforma */}
                  <div className="mt-4 p-3 bg-[var(--primary)]/10 border border-[var(--primary)]/30 rounded-lg text-sm">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="text-xl">{PLATFORM_INFO[selectedPlatform].icon}</span>
                      <span className="font-semibold">Optimizado para {PLATFORM_INFO[selectedPlatform].name}</span>
                    </div>
                    {selectedPlatform === 'midjourney' && (
                      <div className="text-xs text-gray-400">
                        💡 Los parámetros están al final del prompt. Puedes ajustar --ar, --s, --q según necesites.
                      </div>
                    )}
                    {selectedPlatform === 'nano-banana' && (
                      <div className="text-xs text-gray-400">
                        💡 Este prompt está optimizado como párrafo continuo. Si no especificaste orientación, generará formato cuadrado (1:1).
                      </div>
                    )}
                  </div>

                  <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {/* Copiar */}
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

                    {/* Usar en Gemini (solo para nano-banana) */}
                    {selectedPlatform === 'nano-banana' && (
                      <button
                        type="button"
                        onClick={handleUseInGemini}
                        className="w-full flex items-center justify-center space-x-2 bg-[var(--primary)] text-black px-4 py-3 rounded-lg font-bold hover:shadow transition"
                      >
                        <Send size={18} />
                        <span>Usar en Gemini</span>
                      </button>
                    )}

                    {/* Info para Midjourney */}
                    {selectedPlatform === 'midjourney' && (
                      <button
                        type="button"
                        onClick={() => window.open('https://www.midjourney.com', '_blank')}
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
