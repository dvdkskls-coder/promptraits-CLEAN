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

// ✅ IMPORTAR ENTORNOS
import { ENVIRONMENTS } from "../data/environmentsData";

// ✅ IMPORTAR NUEVOS COMPONENTES PRO
import { getPosesByGender, POSES } from "../data/posesData";
import { LIGHTING_SETUPS } from "../data/lightingData";
import { COLOR_GRADING_FILTERS } from "../data/colorGradingData";

// ============================================================================
// ✨ CARACTERÍSTICAS RÁPIDAS (Solo 1 seleccionable)
// ============================================================================
const QUICK_FEATURES = [
  {
    id: "professional-lighting",
    name: "Iluminación Profesional",
    description: "Rembrandt, Butterfly o Loop lighting with professional setup",
    promptText:
      "Professional studio lighting setup with Rembrandt or Butterfly lighting creating gentle shadow modeling, soft diffused key light at 45-degree angle, fill light maintaining detail in shadows",
  },
  {
    id: "bokeh",
    name: "Fondo Desenfocado",
    description: "Shallow depth of field con 85mm",
    promptText:
      "Shallow depth of field with 85mm f/1.8 lens creating creamy smooth bokeh, background beautifully blurred with soft out-of-focus areas",
  },
  {
    id: "cinematic",
    name: "Look Cinematográfico",
    description: "Black Pro-Mist effect",
    promptText:
      "Cinematic look with soft diffused highlights using Black Pro-Mist filter effect, gentle halation on bright lights, organic film-like quality",
  },
  {
    id: "golden-hour",
    name: "Golden Hour",
    description: "Luz cálida de atardecer",
    promptText:
      "Warm golden hour light with sunset glow, magical warm tones creating romantic atmosphere, soft natural illumination",
  },
  {
    id: "smooth-skin",
    name: "Piel Suave y Uniforme",
    description: "Skin tone uniformity",
    promptText:
      "Skin tone uniformity with subtle texture preservation, even complexion, natural beauty retouching maintaining realistic appearance",
  },
  {
    id: "teal-orange",
    name: "Teal & Orange",
    description: "Color grading Hollywood",
    promptText:
      "Cinematic color grading with teal shadows and orange highlights, Hollywood blockbuster style, complementary color contrast",
  },
];

// ============================================================================
// ✨ OPCIONES DE GÉNERO (Actualizado con PAREJA)
// ============================================================================
const GENDER_OPTIONS = [
  { id: "masculine", name: "👨 Masculino", emoji: "👨" },
  { id: "feminine", name: "👩 Femenino", emoji: "👩" },
  { id: "couple", name: "💑 Pareja", emoji: "💑" },
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

  // ✨ Estados para Herramientas PRO EXPANDIDAS (8 secciones)
  const [proSettings, setProSettings] = useState({
    environment: null,
    customEnvironment: "",
    shotType: null,
    cameraAngle: null,
    gender: "feminine", // Por defecto femenino
    pose: null,
    outfit: null,
    lighting: null,
    colorGrading: null,
  });

  // ✨ Estados "Decide tú" para cada sección
  const [autoSelections, setAutoSelections] = useState({
    autoEnvironment: false,
    autoShotType: false,
    autoAngle: false,
    autoPose: false,
    autoOutfit: false,
    autoLighting: false,
    autoColorGrading: false,
  });

  // ✨ Estados para controlar desplegables
  const [openSections, setOpenSections] = useState({
    environment: false,
    shotType: false,
    cameraAngle: false,
    gender: false,
    pose: false,
    outfit: false,
    lighting: false,
    colorGrading: false,
  });

  const isPro = profile?.plan === "pro" || profile?.plan === "premium";

  // ✅ OBTENER OUTFITS SEGÚN GÉNERO
  const getOutfitsByGender = () => {
    if (proSettings.gender === "masculine" || proSettings.gender === "couple") {
      return Outfits_men;
    } else if (proSettings.gender === "feminine") {
      return Outfits_women;
    }
    return [...Outfits_women, ...Outfits_men];
  };

  // ✅ OBTENER POSES SEGÚN GÉNERO
  const getPosesForGender = () => {
    return getPosesByGender(proSettings.gender);
  };

  const currentOutfits = getOutfitsByGender();
  const currentPoses = getPosesForGender();

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
      // Environment
      if (!autoSelections.autoEnvironment) {
        if (proSettings.customEnvironment) {
          parts.push(`in ${proSettings.customEnvironment}`);
        } else if (proSettings.environment) {
          const env = ENVIRONMENTS[proSettings.environment];
          if (env) parts.push(env.prompt);
        }
      }

      // Shot Type
      if (!autoSelections.autoShotType && proSettings.shotType) {
        const shot = SHOT_TYPES.find((s) => s.id === proSettings.shotType);
        if (shot) parts.push(shot.promptText);
      }

      // Camera Angle
      if (!autoSelections.autoAngle && proSettings.cameraAngle) {
        const angle = CAMERA_ANGLES.find((a) => a.id === proSettings.cameraAngle);
        if (angle) parts.push(angle.promptText);
      }

      // Gender + Pose
      if (proSettings.gender) {
        if (proSettings.gender === "couple") {
          parts.push("couple portrait");
        }
        
        if (!autoSelections.autoPose && proSettings.pose) {
          const pose = currentPoses.find((p) => p.id === proSettings.pose);
          if (pose) parts.push(pose.keywords);
        }
      }

      // Outfit
      if (!autoSelections.autoOutfit && proSettings.outfit) {
        const outfit = currentOutfits.find((o) => o.id === proSettings.outfit);
        if (outfit) {
          parts.push(`wearing ${outfit.keywords}`);
        }
      }

      // Lighting
      if (!autoSelections.autoLighting && proSettings.lighting) {
        const lighting = LIGHTING_SETUPS.find((l) => l.id === proSettings.lighting);
        if (lighting) parts.push(lighting.keywords);
      }

      // Color Grading
      if (!autoSelections.autoColorGrading && proSettings.colorGrading) {
        const grading = COLOR_GRADING_FILTERS.find((g) => g.id === proSettings.colorGrading);
        if (grading) parts.push(grading.keywords);
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
  }, [selectedFeature, showProTools, proSettings, autoSelections, currentOutfits, currentPoses]);

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
      setShowProTools(false);
      setProSettings({
        environment: null,
        customEnvironment: "",
        shotType: null,
        cameraAngle: null,
        gender: "feminine",
        pose: null,
        outfit: null,
        lighting: null,
        colorGrading: null,
      });
    }
    setSelectedFeature(selectedFeature === featureId ? null : featureId);
  };

  const updateProSetting = (key, value) => {
    setProSettings((prev) => ({
      ...prev,
      [key]: prev[key] === value ? null : value,
    }));
  };

  const toggleSection = (section) => {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const toggleAutoSelection = (key) => {
    setAutoSelections((prev) => ({
      ...prev,
      [key]: !prev[key],
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
        proSettings: showProTools ? { ...proSettings, autoSelections } : null,
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

      let data;
      try {
        data = await res.json();
        console.log("📥 Data parseada:", data);
      } catch (parseError) {
        console.error("❌ Error parseando JSON:", parseError);
        throw new Error("Error parseando respuesta del servidor");
      }

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

      if (!data.prompt) {
        console.error("❌ Respuesta sin prompt:", data);
        throw new Error("La API no devolvió un prompt válido");
      }

      console.log("✅ Prompt recibido exitosamente");
      setResponse(data.prompt);
      
      if (data.qualityAnalysis) {
        setQualityAnalysis(data.qualityAnalysis);
      }

      if (data.validation) {
        setValidation(data.validation);
      }

      if (user && profile) {
        await refreshProfile();
      }

    } catch (error) {
      console.error("❌ Error en handleSubmit:", error);
      setResponse(`Error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(response);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // ============================================================================
  // RENDER
  // ============================================================================

  return (
    <div className="space-y-6">
      <AnimatedSection delay={0}>
        {/* Header Section */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 text-transparent bg-clip-text">
            Generador Avanzado de Prompts
          </h1>
          <p className="text-gray-400 text-lg">
            Crea prompts profesionales con IA y herramientas PRO
          </p>
        </div>

        {/* Platform Selection */}
        <div className="bg-black/40 backdrop-blur-sm rounded-xl p-6 border border-white/10">
          <div className="flex items-center justify-between mb-4">
            <label className="text-sm font-medium text-gray-300">
              Plataforma de destino
            </label>
            <button
              type="button"
              onClick={() => setShowPlatformInfo(!showPlatformInfo)}
              className="text-purple-400 hover:text-purple-300 transition-colors"
            >
              <Info className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {Object.entries(PLATFORM_INFO).map(([key, info]) => (
              <button
                key={key}
                type="button"
                onClick={() => setSelectedPlatform(key)}
                className={`p-4 rounded-lg border transition-all ${
                  selectedPlatform === key
                    ? "border-purple-500 bg-purple-500/20"
                    : "border-white/10 bg-white/5 hover:border-white/20"
                }`}
              >
                <div className="font-medium text-white">{info.name}</div>
                <div className="text-sm text-gray-400 mt-1">
                  {info.description}
                </div>
              </button>
            ))}
          </div>

          {showPlatformInfo && (
            <div className="mt-4 p-4 bg-white/5 rounded-lg border border-white/10">
              <h3 className="font-medium text-white mb-2">
                {PLATFORM_INFO[selectedPlatform].name}
              </h3>
              <ul className="space-y-1 text-sm text-gray-400">
                {PLATFORM_INFO[selectedPlatform].features.map((feature, idx) => (
                  <li key={idx}>• {feature}</li>
                ))}
              </ul>
              <p className="mt-2 text-sm text-purple-400">
                💡 {PLATFORM_INFO[selectedPlatform].tips}
              </p>
            </div>
          )}
        </div>

        {/* Image Upload */}
        <div className="bg-black/40 backdrop-blur-sm rounded-xl p-6 border border-white/10">
          <label className="block text-sm font-medium text-gray-300 mb-3">
            Imagen de referencia (opcional)
          </label>
          
          {!imagePreview ? (
            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-white/20 rounded-lg cursor-pointer hover:border-purple-500/50 transition-colors">
              <Upload className="w-8 h-8 text-gray-400 mb-2" />
              <span className="text-sm text-gray-400">
                Sube una imagen de referencia (máx 4MB)
              </span>
              <input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleImageUpload}
              />
            </label>
          ) : (
            <div className="relative">
              <img
                src={imagePreview}
                alt="Preview"
                className="w-full h-48 object-cover rounded-lg"
              />
              <button
                type="button"
                onClick={handleRemoveImage}
                className="absolute top-2 right-2 p-2 bg-red-500 hover:bg-red-600 rounded-full transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* Características Rápidas */}
        <div className="bg-black/40 backdrop-blur-sm rounded-xl p-6 border border-white/10">
          <h3 className="text-lg font-medium text-white mb-4">
            ⚡ Características Rápidas
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {QUICK_FEATURES.map((feature) => (
              <button
                key={feature.id}
                type="button"
                onClick={() => selectFeature(feature.id)}
                className={`p-3 rounded-lg border transition-all text-left ${
                  selectedFeature === feature.id
                    ? "border-purple-500 bg-purple-500/20"
                    : "border-white/10 bg-white/5 hover:border-white/20"
                }`}
              >
                <div className="font-medium text-sm text-white">
                  {feature.name}
                </div>
                <div className="text-xs text-gray-400 mt-1">
                  {feature.description}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Herramientas PRO Button */}
        <div>
          <button
            type="button"
            onClick={() => {
              setShowProTools(!showProTools);
              if (!showProTools) {
                setSelectedFeature(null);
              }
            }}
            className={`w-full py-4 px-6 rounded-xl font-medium transition-all flex items-center justify-between ${
              isPro
                ? "bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                : "bg-gray-700 hover:bg-gray-600"
            }`}
          >
            <span className="flex items-center gap-2">
              {isPro ? <Crown className="w-5 h-5" /> : <Lock className="w-5 h-5" />}
              Herramientas PRO
            </span>
            {showProTools ? (
              <ChevronUp className="w-5 h-5" />
            ) : (
              <ChevronDown className="w-5 h-5" />
            )}
          </button>

          {!isPro && showProTools && (
            <div className="mt-4 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
              <p className="text-yellow-400 text-sm">
                ⚠️ Las herramientas PRO requieren una suscripción activa.
              </p>
            </div>
          )}
        </div>

        {/* Herramientas PRO Expandidas */}
        {showProTools && isPro && (
          <div className="bg-black/40 backdrop-blur-sm rounded-xl p-6 border border-white/10 space-y-4">
            
            {/* 1. ENTORNO */}
            <ProSection
              title="🏞️ Entorno"
              description="Donde se realizará el retrato"
              isOpen={openSections.environment}
              onToggle={() => toggleSection("environment")}
            >
              <div className="space-y-3">
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={autoSelections.autoEnvironment}
                    onChange={() => {
                      toggleAutoSelection("autoEnvironment");
                      if (!autoSelections.autoEnvironment) {
                        setProSettings((prev) => ({
                          ...prev,
                          environment: null,
                          customEnvironment: "",
                        }));
                      }
                    }}
                    className="rounded"
                  />
                  <span className="text-gray-300">🤖 Decide tú</span>
                </label>

                {!autoSelections.autoEnvironment && (
                  <>
                    <select
                      value={proSettings.environment || ""}
                      onChange={(e) => updateProSetting("environment", e.target.value)}
                      className="w-full bg-gray-800 text-white rounded-lg p-2 border border-white/10"
                    >
                      <option value="">-- Selecciona entorno --</option>
                      {Object.values(ENVIRONMENTS).map((env) => (
                        <option key={env.id} value={env.id}>
                          {env.name}
                        </option>
                      ))}
                    </select>

                    <div className="pt-2">
                      <label className="text-sm text-gray-400 block mb-1">
                        O escribe tu propio entorno:
                      </label>
                      <input
                        type="text"
                        value={proSettings.customEnvironment}
                        onChange={(e) => {
                          setProSettings((prev) => ({
                            ...prev,
                            customEnvironment: e.target.value,
                            environment: e.target.value ? null : prev.environment,
                          }));
                        }}
                        placeholder="Ej: En el columpio de un parque"
                        className="w-full bg-gray-800 text-white rounded-lg p-2 border border-white/10"
                      />
                    </div>
                  </>
                )}
              </div>
            </ProSection>

            {/* 2. TIPO DE PLANO */}
            <ProSection
              title="📷 Tipo de Plano"
              description="Encuadre de la fotografía"
              isOpen={openSections.shotType}
              onToggle={() => toggleSection("shotType")}
            >
              <div className="space-y-3">
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={autoSelections.autoShotType}
                    onChange={() => {
                      toggleAutoSelection("autoShotType");
                      if (!autoSelections.autoShotType) {
                        updateProSetting("shotType", null);
                      }
                    }}
                    className="rounded"
                  />
                  <span className="text-gray-300">🤖 Decide tú</span>
                </label>

                {!autoSelections.autoShotType && (
                  <select
                    value={proSettings.shotType || ""}
                    onChange={(e) => updateProSetting("shotType", e.target.value)}
                    className="w-full bg-gray-800 text-white rounded-lg p-2 border border-white/10"
                  >
                    <option value="">-- Selecciona plano --</option>
                    {SHOT_TYPES.map((shot) => (
                      <option key={shot.id} value={shot.id}>
                        {shot.nameES} - {shot.description}
                      </option>
                    ))}
                  </select>
                )}
              </div>
            </ProSection>

            {/* 3. ÁNGULO DE CÁMARA */}
            <ProSection
              title="📐 Ángulo de Cámara"
              description="Perspectiva de la toma"
              isOpen={openSections.cameraAngle}
              onToggle={() => toggleSection("cameraAngle")}
            >
              <div className="space-y-3">
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={autoSelections.autoAngle}
                    onChange={() => {
                      toggleAutoSelection("autoAngle");
                      if (!autoSelections.autoAngle) {
                        updateProSetting("cameraAngle", null);
                      }
                    }}
                    className="rounded"
                  />
                  <span className="text-gray-300">🤖 Decide tú</span>
                </label>

                {!autoSelections.autoAngle && (
                  <select
                    value={proSettings.cameraAngle || ""}
                    onChange={(e) => updateProSetting("cameraAngle", e.target.value)}
                    className="w-full bg-gray-800 text-white rounded-lg p-2 border border-white/10"
                  >
                    <option value="">-- Selecciona ángulo --</option>
                    {CAMERA_ANGLES.map((angle) => (
                      <option key={angle.id} value={angle.id}>
                        {angle.nameES} - {angle.description}
                      </option>
                    ))}
                  </select>
                )}
              </div>
            </ProSection>

            {/* 4. GÉNERO */}
            <ProSection
              title="👤 Género"
              description="Determina poses y outfits disponibles"
              isOpen={openSections.gender}
              onToggle={() => toggleSection("gender")}
            >
              <div className="grid grid-cols-3 gap-3">
                {GENDER_OPTIONS.map((gender) => (
                  <button
                    key={gender.id}
                    type="button"
                    onClick={() => updateProSetting("gender", gender.id)}
                    className={`py-3 px-4 rounded-lg border transition-all ${
                      proSettings.gender === gender.id
                        ? "border-purple-500 bg-purple-500/20"
                        : "border-white/10 bg-white/5 hover:border-white/20"
                    }`}
                  >
                    <div className="text-2xl mb-1">{gender.emoji}</div>
                    <div className="text-sm">{gender.name.split(" ")[1]}</div>
                  </button>
                ))}
              </div>
            </ProSection>

            {/* 5. POSES */}
            <ProSection
              title="🤸 Poses"
              description="Postura y expresión del sujeto"
              isOpen={openSections.pose}
              onToggle={() => toggleSection("pose")}
            >
              <div className="space-y-3">
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={autoSelections.autoPose}
                    onChange={() => {
                      toggleAutoSelection("autoPose");
                      if (!autoSelections.autoPose) {
                        updateProSetting("pose", null);
                      }
                    }}
                    className="rounded"
                  />
                  <span className="text-gray-300">🤖 Decide tú</span>
                </label>

                {!autoSelections.autoPose && (
                  <select
                    value={proSettings.pose || ""}
                    onChange={(e) => updateProSetting("pose", e.target.value)}
                    className="w-full bg-gray-800 text-white rounded-lg p-2 border border-white/10"
                  >
                    <option value="">-- Selecciona pose --</option>
                    {currentPoses.map((pose) => (
                      <option key={pose.id} value={pose.id}>
                        {pose.name} - {pose.description}
                      </option>
                    ))}
                  </select>
                )}
              </div>
            </ProSection>

            {/* 6. OUTFIT */}
            <ProSection
              title="👔 Outfit"
              description="Vestuario y estilo de ropa"
              isOpen={openSections.outfit}
              onToggle={() => toggleSection("outfit")}
            >
              <div className="space-y-3">
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={autoSelections.autoOutfit}
                    onChange={() => {
                      toggleAutoSelection("autoOutfit");
                      if (!autoSelections.autoOutfit) {
                        updateProSetting("outfit", null);
                      }
                    }}
                    className="rounded"
                  />
                  <span className="text-gray-300">🤖 Decide tú</span>
                </label>

                {!autoSelections.autoOutfit && (
                  <select
                    value={proSettings.outfit || ""}
                    onChange={(e) => updateProSetting("outfit", e.target.value)}
                    className="w-full bg-gray-800 text-white rounded-lg p-2 border border-white/10"
                  >
                    <option value="">-- Selecciona outfit --</option>
                    {currentOutfits.map((outfit) => (
                      <option key={outfit.id} value={outfit.id}>
                        {outfit.name}
                      </option>
                    ))}
                  </select>
                )}
              </div>
            </ProSection>

            {/* 7. ILUMINACIÓN */}
            <ProSection
              title="💡 Iluminación"
              description="Esquema de luces profesional"
              isOpen={openSections.lighting}
              onToggle={() => toggleSection("lighting")}
            >
              <div className="space-y-3">
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={autoSelections.autoLighting}
                    onChange={() => {
                      toggleAutoSelection("autoLighting");
                      if (!autoSelections.autoLighting) {
                        updateProSetting("lighting", null);
                      }
                    }}
                    className="rounded"
                  />
                  <span className="text-gray-300">🤖 Decide tú</span>
                </label>

                {!autoSelections.autoLighting && (
                  <select
                    value={proSettings.lighting || ""}
                    onChange={(e) => updateProSetting("lighting", e.target.value)}
                    className="w-full bg-gray-800 text-white rounded-lg p-2 border border-white/10"
                  >
                    <option value="">-- Selecciona iluminación --</option>
                    {LIGHTING_SETUPS.map((light) => (
                      <option key={light.id} value={light.id}>
                        {light.name} - {light.description}
                      </option>
                    ))}
                  </select>
                )}
              </div>
            </ProSection>

            {/* 8. CORRECCIÓN DE COLOR */}
            <ProSection
              title="🎨 Corrección de Color"
              description="Look cinematográfico y filtros"
              isOpen={openSections.colorGrading}
              onToggle={() => toggleSection("colorGrading")}
            >
              <div className="space-y-3">
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={autoSelections.autoColorGrading}
                    onChange={() => {
                      toggleAutoSelection("autoColorGrading");
                      if (!autoSelections.autoColorGrading) {
                        updateProSetting("colorGrading", null);
                      }
                    }}
                    className="rounded"
                  />
                  <span className="text-gray-300">🤖 Decide tú</span>
                </label>

                {!autoSelections.autoColorGrading && (
                  <select
                    value={proSettings.colorGrading || ""}
                    onChange={(e) => updateProSetting("colorGrading", e.target.value)}
                    className="w-full bg-gray-800 text-white rounded-lg p-2 border border-white/10"
                  >
                    <option value="">-- Selecciona filtro --</option>
                    {COLOR_GRADING_FILTERS.map((filter) => (
                      <option key={filter.id} value={filter.id}>
                        {filter.name} - {filter.description}
                      </option>
                    ))}
                  </select>
                )}
              </div>
            </ProSection>

          </div>
        )}

        {/* Prompt Input */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="bg-black/40 backdrop-blur-sm rounded-xl p-6 border border-white/10">
            <label className="block text-sm font-medium text-gray-300 mb-3">
              Describe lo que quieres generar
            </label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Ej: Mujer joven en estudio con iluminación Rembrandt..."
              className="w-full h-32 bg-gray-900/50 text-white rounded-lg p-4 border border-white/10 focus:border-purple-500 focus:outline-none resize-none"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading || !prompt.trim()}
            className="w-full py-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed rounded-xl font-medium transition-all flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Generando...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                Generar Prompt Profesional
              </>
            )}
          </button>
        </form>

        {/* Response */}
        {response && (
          <div className="bg-black/40 backdrop-blur-sm rounded-xl p-6 border border-white/10">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-white">
                ✨ Prompt Generado
              </h3>
              <button
                type="button"
                onClick={handleCopy}
                className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4" />
                    Copiado
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    Copiar
                  </>
                )}
              </button>
            </div>
            <div className="bg-gray-900/50 rounded-lg p-4 text-gray-300 whitespace-pre-wrap">
              {response}
            </div>
          </div>
        )}

        {/* Quality Analysis */}
        {qualityAnalysis && <QualityAnalysis analysis={qualityAnalysis} />}

      </AnimatedSection>
    </div>
  );
}

// ============================================================================
// COMPONENTE HELPER: ProSection
// ============================================================================
function ProSection({ title, description, isOpen, onToggle, children }) {
  return (
    <div className="border border-white/10 rounded-lg overflow-hidden">
      <button
        type="button"
        onClick={onToggle}
        className="w-full flex items-center justify-between p-4 bg-gray-900/50 hover:bg-gray-900 transition-colors"
      >
        <div className="text-left">
          <div className="font-medium text-white">{title}</div>
          <div className="text-sm text-gray-400">{description}</div>
        </div>
        <span className="text-xl">
          {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </span>
      </button>

      {isOpen && (
        <div className="p-4 bg-black/20">
          {children}
        </div>
      )}
    </div>
  );
}
