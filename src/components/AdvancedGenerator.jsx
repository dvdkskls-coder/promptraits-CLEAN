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
  Lock,
  User,
  Camera,
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
import { ENVIRONMENTS_ARRAY } from "../data/environmentsData";

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
    textES: "Iluminación profesional estilo Rembrandt o Butterfly",
    promptText:
      "Professional studio lighting setup with Rembrandt or Butterfly lighting creating gentle shadow modeling, soft diffused key light at 45-degree angle, fill light maintaining detail in shadows",
  },
  {
    id: "bokeh",
    name: "Fondo Desenfocado",
    description: "Shallow depth of field con 85mm",
    textES: "Fondo desenfocado con efecto bokeh (85mm f/1.8)",
    promptText:
      "Shallow depth of field with 85mm f/1.8 lens creating creamy smooth bokeh, background beautifully blurred with soft out-of-focus areas",
  },
  {
    id: "cinematic",
    name: "Look Cinematográfico",
    description: "Black Pro-Mist effect",
    textES: "Look cinematográfico con filtro Black Pro-Mist",
    promptText:
      "Cinematic look with soft diffused highlights using Black Pro-Mist filter effect, gentle halation on bright lights, organic film-like quality",
  },
  {
    id: "golden-hour",
    name: "Golden Hour",
    description: "Luz cálida de atardecer",
    textES: "Luz cálida natural de golden hour",
    promptText:
      "Warm golden hour light with sunset glow, magical warm tones creating romantic atmosphere, soft natural illumination",
  },
  {
    id: "smooth-skin",
    name: "Piel Suave y Uniforme",
    description: "Skin tone uniformity",
    textES: "Textura de piel suave y natural",
    promptText:
      "Skin tone uniformity with subtle texture preservation, even complexion, natural beauty retouching maintaining realistic appearance",
  },
  {
    id: "teal-orange",
    name: "Teal & Orange",
    description: "Color grading Hollywood",
    textES: "Color grading cinematográfico teal & orange",
    promptText:
      "Cinematic color grading with teal shadows and orange highlights, Hollywood blockbuster style, complementary color contrast",
  },
];

// ============================================================================
// ✨ OPCIONES DE GÉNERO (Actualizado con PAREJA)
// ============================================================================
const GENDER_OPTIONS = [
  { id: "masculine", name: "Masculino" },
  { id: "feminine", name: "Femenino" },
  { id: "couple", name: "Pareja" },
];

export default function AdvancedGenerator() {
  const { user, profile, refreshProfile } = useAuth();
  
  // ✅ VALIDACIÓN: Si no hay datos de autenticación aún, mostrar loading
  const [isInitializing, setIsInitializing] = React.useState(true);

  React.useEffect(() => {
    if (user !== undefined && profile !== undefined) {
      setIsInitializing(false);
    }
  }, [user, profile]);

  const [prompt, setPrompt] = useState("");
  const [userPrompt, setUserPrompt] = useState(""); // ✅ Lo que escribe el usuario
  const [response, setResponse] = useState("");

  // Estados para el generador de imágenes con Nano Banana 🍌
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [generatedImages, setGeneratedImages] = useState([]);
  const [selectedAspectRatio, setSelectedAspectRatio] = useState("1:1");
  const [selfieImage, setSelfieImage] = useState(null); // ✅ NUEVO: Imagen selfie para rostro
  const [selfiePreview, setSelfiePreview] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [referenceImage, setReferenceImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [qualityAnalysis, setQualityAnalysis] = useState(null);
  const [isApplyingSuggestions, setIsApplyingSuggestions] = useState(false);
  const [copied, setCopied] = useState(false);

  // Estados para características rápidas (solo 1)
  const [selectedFeature, setSelectedFeature] = useState(null);
  const [showProTools, setShowProTools] = useState(false);

  // ✨ Estados para Herramientas PRO EXPANDIDAS (8 secciones)
  const [proSettings, setProSettings] = useState({
    environment: null,
    customEnvironment: "",
    shotType: null,
    cameraAngle: null,
    gender: "", // ✅ Sin género seleccionado por defecto
    pose: null,
    outfit: null,
    lighting: null,
    colorGrading: null,
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

  // ✅ ABRIR HERRAMIENTAS PRO AUTOMÁTICAMENTE SI EL USUARIO ES PRO
  useEffect(() => {
    if (isPro && !showProTools) {
      setShowProTools(true);
    }
  }, [isPro]);

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

  // ✅ VALORES POR DEFECTO PARA EVITAR ERRORES - Usar useMemo para memorizar
  const safeEnvironments = React.useMemo(() => {
    const result = Array.isArray(ENVIRONMENTS_ARRAY) ? ENVIRONMENTS_ARRAY : [];
    if (result.length === 0) {
      console.warn('⚠️ ENVIRONMENTS_ARRAY está vacío o undefined');
    }
    return result;
  }, []);

  const safeShotTypes = React.useMemo(() => {
    const result = Array.isArray(SHOT_TYPES) ? SHOT_TYPES : [];
    if (result.length === 0) {
      console.warn('⚠️ SHOT_TYPES está vacío o undefined');
    }
    return result;
  }, []);

  const safeCameraAngles = React.useMemo(() => {
    const result = Array.isArray(CAMERA_ANGLES) ? CAMERA_ANGLES : [];
    if (result.length === 0) {
      console.warn('⚠️ CAMERA_ANGLES está vacío o undefined');
    }
    return result;
  }, []);

  const safeLightingSetups = React.useMemo(() => {
    const result = Array.isArray(LIGHTING_SETUPS) ? LIGHTING_SETUPS : [];
    if (result.length === 0) {
      console.warn('⚠️ LIGHTING_SETUPS está vacío o undefined');
    }
    return result;
  }, []);

  const safeColorGrading = React.useMemo(() => {
    const result = Array.isArray(COLOR_GRADING_FILTERS) ? COLOR_GRADING_FILTERS : [];
    if (result.length === 0) {
      console.warn('⚠️ COLOR_GRADING_FILTERS está vacío o undefined');
    }
    return result;
  }, []);

  const currentOutfits = getOutfitsByGender();
  const currentPoses = getPosesForGender();

  const safeOutfits = React.useMemo(() => {
    const result = Array.isArray(currentOutfits) ? currentOutfits : [];
    if (result.length === 0) {
      console.warn('⚠️ Outfits está vacío o undefined');
    }
    return result;
  }, [currentOutfits]);

  const safePoses = React.useMemo(() => {
    const result = Array.isArray(currentPoses) ? currentPoses : [];
    if (result.length === 0) {
      console.warn('⚠️ Poses está vacío o undefined');
    }
    return result;
  }, [currentPoses]);

  // ============================================================================
  // EFECTO: Cuando se abre PRO, limpia características rápidas
  // ============================================================================
  useEffect(() => {
    if (showProTools) {
      setSelectedFeature(null);
    }
  }, [showProTools]);

  // ============================================================================
  // EFECTO: Construir prompt combinando userPrompt + características/PRO
  // ============================================================================
  useEffect(() => {
    let combinedPrompt = userPrompt.trim();

    // Añadir característica rápida si está seleccionada
    if (selectedFeature && !showProTools) {
      const feature = QUICK_FEATURES.find((f) => f.id === selectedFeature);
      if (feature) {
        combinedPrompt += `\n\n${feature.textES}`;
      }
    }

    // Añadir parámetros PRO seleccionados
    if (showProTools && isPro) {
      const proParams = [];

      if (proSettings.environment && proSettings.environment !== "auto") {
        const env = safeEnvironments.find((e) => e.id === proSettings.environment);
        if (env) proParams.push(`Entorno: ${env.name}`);
      }

      if (proSettings.shotType && proSettings.shotType !== "auto") {
        const shot = safeShotTypes.find((s) => s.id === proSettings.shotType);
        if (shot) proParams.push(`Plano: ${shot.nameES}`);
      }

      if (proSettings.cameraAngle && proSettings.cameraAngle !== "auto") {
        const angle = safeCameraAngles.find(
          (a) => a.id === proSettings.cameraAngle
        );
        if (angle) proParams.push(`Ángulo: ${angle.nameES}`);
      }

      if (proSettings.gender) {
        const gender = GENDER_OPTIONS.find((g) => g.id === proSettings.gender);
        if (gender) proParams.push(`Género: ${gender.name}`);
      }

      if (proSettings.pose && proSettings.pose !== "auto") {
        const pose = safePoses.find((p) => p.id === proSettings.pose);
        if (pose) proParams.push(`Pose: ${pose.name}`);
      }

      if (proSettings.outfit && proSettings.outfit !== "auto") {
        const outfit = safeOutfits.find((o) => o.id === proSettings.outfit);
        if (outfit) proParams.push(`Outfit: ${outfit.name}`);
      }

      if (proSettings.lighting && proSettings.lighting !== "auto") {
        const light = safeLightingSetups.find(
          (l) => l.id === proSettings.lighting
        );
        if (light) proParams.push(`Iluminación: ${light.name}`);
      }

      if (proSettings.colorGrading && proSettings.colorGrading !== "auto") {
        const grading = safeColorGrading.find(
          (g) => g.id === proSettings.colorGrading
        );
        if (grading) proParams.push(`Color: ${grading.name}`);
      }

      if (proParams.length > 0) {
        combinedPrompt += "\n\n" + proParams.join(" | ");
      }
    }

    setPrompt(combinedPrompt);
  }, [
    userPrompt,
    selectedFeature,
    showProTools,
    proSettings,
    isPro,
    safePoses,
    safeOutfits,
    safeEnvironments,
    safeShotTypes,
    safeCameraAngles,
    safeLightingSetups,
    safeColorGrading,
  ]);

  // ============================================================================
  // MANEJO DE IMAGEN DE REFERENCIA
  // ============================================================================
  const handleReferenceImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setReferenceImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeReferenceImage = () => {
    setReferenceImage(null);
    setImagePreview("");
  };

  // ============================================================================
  // MANEJO DE IMAGEN SELFIE (PARA GENERAR IMAGEN CON ROSTRO)
  // ============================================================================
  const handleSelfieChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelfieImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelfiePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeSelfie = () => {
    setSelfieImage(null);
    setSelfiePreview("");
  };

  // ============================================================================
  // GENERAR PROMPT
  // ============================================================================
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!prompt.trim()) {
      alert("Por favor, describe lo que quieres generar");
      return;
    }

    if (!profile || profile.credits < 1) {
      alert("No tienes suficientes créditos. Compra más en la sección Planes.");
      return;
    }

    setIsLoading(true);
    setResponse("");
    setQualityAnalysis(null);

    try {
      let requestData;
      let headers = {};

      // Si hay imagen de referencia, usar FormData
      if (referenceImage) {
        const formData = new FormData();
        formData.append("prompt", prompt);
        formData.append("platform", "nano-banana");
        formData.append("userId", user.id);
        formData.append("proSettings", JSON.stringify(proSettings));
        formData.append("referenceImage", referenceImage);
        
        requestData = formData;
        // No establecer Content-Type para FormData
      } else {
        // Sin imagen, usar JSON simple
        requestData = JSON.stringify({
          prompt: prompt,
          platform: "nano-banana",
          userId: user.id,
          proSettings: proSettings,
        });
        
        headers["Content-Type"] = "application/json";
      }

      const res = await fetch("/api/gemini-processor", {
        method: "POST",
        headers: headers,
        body: requestData,
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Error al generar el prompt");
      }

      const data = await res.json();

      setResponse(data.prompt || "");
      if (data.analysis) {
        setQualityAnalysis(data.analysis);
      }

      await refreshProfile();
    } catch (error) {
      console.error("Error:", error);
      alert(error.message || "Error al generar el prompt");
    } finally {
      setIsLoading(false);
    }
  };

  // ============================================================================
  // GENERAR IMAGEN CON NANO BANANA 🍌
  // ============================================================================
  const handleGenerateImage = async () => {
    if (!response) {
      alert("Primero debes generar un prompt");
      return;
    }

    if (!profile || profile.credits < 1) {
      alert("No tienes suficientes créditos. Compra más en la sección Planes.");
      return;
    }

    if (!selfieImage) {
      alert(
        "Debes subir una foto selfie para generar la imagen con tu rostro"
      );
      return;
    }

    setIsGeneratingImage(true);
    setGeneratedImages([]);

    try {
      const formData = new FormData();
      formData.append("prompt", response);
      formData.append("aspectRatio", selectedAspectRatio);
      formData.append("userId", user.id);
      formData.append("selfieImage", selfieImage); // ✅ Enviar selfie

      const res = await fetch("/api/generate-image", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Error al generar imagen");
      }

      const data = await res.json();

      if (data.images && data.images.length > 0) {
        setGeneratedImages(data.images);
      } else {
        throw new Error("No se generaron imágenes");
      }

      await refreshProfile();
    } catch (error) {
      console.error("Error generando imagen:", error);
      alert(error.message || "Error al generar imagen");
    } finally {
      setIsGeneratingImage(false);
    }
  };

  // ============================================================================
  // COPIAR PROMPT
  // ============================================================================
  const handleCopy = () => {
    navigator.clipboard.writeText(response);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // ============================================================================
  // TOGGLE SECCIONES PRO
  // ============================================================================
  const toggleSection = (section) => {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  // ============================================================================
  // SELECCIONAR/DESELECCIONAR CARACTERÍSTICA RÁPIDA
  // ============================================================================
  const toggleFeature = (featureId) => {
    setSelectedFeature((prev) => (prev === featureId ? null : featureId));
    setShowProTools(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Loading mientras se inicializa */}
      {isInitializing ? (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <Loader2 className="w-12 h-12 animate-spin text-[#D8C780] mx-auto mb-4" />
            <p className="text-[#C1C1C1]">Cargando generador...</p>
          </div>
        </div>
      ) : (
        <AnimatedSection>
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">
            <span className="bg-gradient-to-r from-[#D8C780] to-[#D8C780] bg-clip-text text-transparent">
              Generador Profesional Nano Banana
            </span>{" "}
            <span className="text-4xl">🍌</span>
          </h1>
          <p className="text-[#C1C1C1] max-w-2xl mx-auto">
            Crea prompts profesionales optimizados para Nano Banana (Google
            Gemini). Cada generación de prompt consume 1 crédito. Cada
            generación de imagen consume 1 crédito adicional.
          </p>
          {profile && (
            <div className="mt-4 inline-block px-4 py-2 bg-[#D8C780]/20 border border-[#D8C780] rounded-lg">
              <span className="text-[#D8C780] font-medium">
                Créditos disponibles: {profile.credits || 0}
              </span>
            </div>
          )}
        </div>

        {/* Formulario Principal */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Layout Responsive: Mobile = columna única, Desktop = dos columnas */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* COLUMNA IZQUIERDA: Descripción + Imagen Referencia + Características Rápidas */}
            <div className="space-y-6">
              {/* Textarea Principal */}
              <div>
                <label className="block text-sm font-medium text-[#C1C1C1] mb-2">
                  Describe lo que quieres generar
                </label>
                <textarea
                  value={userPrompt}
                  onChange={(e) => setUserPrompt(e.target.value)}
                  placeholder="Ej: Retrato profesional en estudio con fondo negro..."
                  className="w-full h-40 bg-[#06060C]/50 text-white rounded-lg p-4 border border-[#2D2D2D] focus:border-[#D8C780] focus:outline-none resize-none"
                />
                <p className="text-xs text-[#C1C1C1] mt-1">
                  Los parámetros seleccionados se añadirán automáticamente
                </p>
              </div>

              {/* Imagen de Referencia - BOTÓN */}
              <div>
                <label className="block text-sm font-medium text-[#C1C1C1] mb-2">
                  Imagen de referencia (opcional)
                </label>
                <p className="text-xs text-[#C1C1C1] mb-3">
                  Sube una imagen para que el generador analice el estilo,
                  iluminación y composición
                </p>

                {!imagePreview ? (
                  <label className="cursor-pointer block">
                    <div className="flex items-center gap-3 p-4 bg-[#06060C]/50 border border-[#2D2D2D] hover:border-[#D8C780] rounded-lg transition-colors">
                      <Camera className="w-6 h-6 text-[#D8C780]" />
                      <div>
                        <p className="text-white font-medium">
                          Adjuntar imagen de referencia
                        </p>
                        <p className="text-xs text-[#C1C1C1]">
                          Formatos: JPG, PNG (máx 5MB)
                        </p>
                      </div>
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleReferenceImageChange}
                      className="hidden"
                    />
                  </label>
                ) : (
                  <div className="relative">
                    <img
                      src={imagePreview}
                      alt="Referencia"
                      className="w-full h-48 object-cover rounded-lg border border-[#2D2D2D]"
                    />
                    <button
                      type="button"
                      onClick={removeReferenceImage}
                      className="absolute top-2 right-2 p-2 bg-red-500 hover:bg-red-600 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>

              {/* Características Rápidas */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="block text-sm font-medium text-[#C1C1C1]">
                    Características Rápidas
                  </label>
                  <Info className="w-4 h-4 text-[#C1C1C1]" />
                </div>
                <p className="text-xs text-[#C1C1C1] mb-3">
                  Selecciona una característica rápida o usa las Herramientas
                  PRO para control completo
                </p>

                <div className="grid grid-cols-2 gap-2">
                  {QUICK_FEATURES.map((feature) => (
                    <button
                      key={feature.id}
                      type="button"
                      onClick={() => toggleFeature(feature.id)}
                      disabled={showProTools}
                      className={`p-3 rounded-lg border transition-all text-sm ${
                        selectedFeature === feature.id
                          ? "border-[#D8C780] bg-[#D8C780]/20 text-white"
                          : showProTools
                          ? "border-[#2D2D2D] bg-[#06060C]/30 text-[#666] cursor-not-allowed"
                          : "border-[#2D2D2D] bg-[#06060C] text-[#C1C1C1] hover:border-[#D8C780]/50"
                      }`}
                    >
                      {feature.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* COLUMNA DERECHA: Herramientas PRO */}
            <div>
              {!isPro ? (
                <div className="p-6 bg-gradient-to-br from-[#D8C780]/10 to-[#D8C780]/5 border border-[#D8C780]/30 rounded-lg text-center">
                  <Crown className="w-12 h-12 text-[#D8C780] mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-white mb-2">
                    Herramientas PRO
                  </h3>
                  <p className="text-[#C1C1C1] mb-4">
                    Accede a control completo sobre iluminación, poses,
                    vestuario, planos y más
                  </p>
                  <a
                    href="/planes"
                    className="inline-block px-6 py-3 bg-[#D8C780] hover:bg-[#C4B66D] rounded-lg font-medium transition-colors"
                  >
                    Actualizar a PRO
                  </a>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-medium text-white">
                        Herramientas PRO
                      </h3>
                      <p className="text-xs text-[#C1C1C1]">
                        Control profesional completo
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowProTools(!showProTools)}
                      className={`px-4 py-2 rounded-lg border transition-all ${
                        showProTools
                          ? "border-[#D8C780] bg-[#D8C780]/20 text-white"
                          : "border-[#2D2D2D] bg-[#06060C] text-[#C1C1C1]"
                      }`}
                    >
                      {showProTools ? "Ocultar" : "Mostrar"}
                    </button>
                  </div>

                  {showProTools && (
                    <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
                      {/* Género */}
                      <ProSection
                        title="Género"
                        description="Selecciona el género para personalizar poses y vestuario"
                        isOpen={openSections.gender}
                        onToggle={() => toggleSection("gender")}
                      >
                        <div className="grid grid-cols-3 gap-2">
                          {GENDER_OPTIONS.map((option) => (
                            <button
                              key={option.id}
                              type="button"
                              onClick={() =>
                                setProSettings((prev) => ({
                                  ...prev,
                                  gender: option.id,
                                }))
                              }
                              className={`p-2 rounded-lg border text-sm transition-all ${
                                proSettings.gender === option.id
                                  ? "border-[#D8C780] bg-[#D8C780]/20 text-white"
                                  : "border-[#2D2D2D] bg-[#06060C] text-[#C1C1C1] hover:border-[#D8C780]/50"
                              }`}
                            >
                              {option.name}
                            </button>
                          ))}
                        </div>
                      </ProSection>

                      {/* Entorno */}
                      <ProSection
                        title="Entorno"
                        description="Selecciona el entorno o ubicación"
                        isOpen={openSections.environment}
                        onToggle={() => toggleSection("environment")}
                      >
                        <div className="grid grid-cols-2 gap-2">
                          <button
                            type="button"
                            onClick={() =>
                              setProSettings((prev) => ({
                                ...prev,
                                environment: "auto",
                              }))
                            }
                            className={`p-2 rounded-lg border text-sm transition-all ${
                              proSettings.environment === "auto"
                                ? "border-[#D8C780] bg-[#D8C780]/20 text-white"
                                : "border-[#2D2D2D] bg-[#06060C] text-[#C1C1C1] hover:border-[#D8C780]/50"
                            }`}
                          >
                            Automático
                          </button>
                          {safeEnvironments.map((env) => (
                            <button
                              key={env.id}
                              type="button"
                              onClick={() =>
                                setProSettings((prev) => ({
                                  ...prev,
                                  environment: env.id,
                                }))
                              }
                              className={`p-3 rounded-lg border text-left transition-all ${
                                proSettings.environment === env.id
                                  ? "border-[#D8C780] bg-[#D8C780]/20 text-white"
                                  : "border-[#2D2D2D] bg-[#06060C] text-[#C1C1C1] hover:border-[#D8C780]/50"
                              }`}
                            >
                              <div className="font-medium text-sm">{env.name}</div>
                              {env.description && (
                                <div className="text-xs text-[#C1C1C1] mt-1">
                                  {env.description}
                                </div>
                              )}
                            </button>
                          ))}
                        </div>
                      </ProSection>

                      {/* Tipo de Plano */}
                      <ProSection
                        title="Tipo de Plano"
                        description="Define el encuadre de la foto"
                        isOpen={openSections.shotType}
                        onToggle={() => toggleSection("shotType")}
                      >
                        <div className="grid grid-cols-2 gap-2">
                          <button
                            type="button"
                            onClick={() =>
                              setProSettings((prev) => ({
                                ...prev,
                                shotType: "auto",
                              }))
                            }
                            className={`p-2 rounded-lg border text-sm transition-all ${
                              proSettings.shotType === "auto"
                                ? "border-[#D8C780] bg-[#D8C780]/20 text-white"
                                : "border-[#2D2D2D] bg-[#06060C] text-[#C1C1C1] hover:border-[#D8C780]/50"
                            }`}
                          >
                            Automático
                          </button>
                          {safeShotTypes.map((shot) => (
                            <button
                              key={shot.id}
                              type="button"
                              onClick={() =>
                                setProSettings((prev) => ({
                                  ...prev,
                                  shotType: shot.id,
                                }))
                              }
                              className={`p-3 rounded-lg border text-left transition-all ${
                                proSettings.shotType === shot.id
                                  ? "border-[#D8C780] bg-[#D8C780]/20 text-white"
                                  : "border-[#2D2D2D] bg-[#06060C] text-[#C1C1C1] hover:border-[#D8C780]/50"
                              }`}
                            >
                              <div className="font-medium text-sm">{shot.nameES}</div>
                              {shot.description && (
                                <div className="text-xs text-[#C1C1C1] mt-1">
                                  {shot.description}
                                </div>
                              )}
                            </button>
                          ))}
                        </div>
                      </ProSection>

                      {/* Ángulo de Cámara */}
                      <ProSection
                        title="Ángulo de Cámara"
                        description="Perspectiva desde la que se toma la foto"
                        isOpen={openSections.cameraAngle}
                        onToggle={() => toggleSection("cameraAngle")}
                      >
                        <div className="grid grid-cols-2 gap-2">
                          <button
                            type="button"
                            onClick={() =>
                              setProSettings((prev) => ({
                                ...prev,
                                cameraAngle: "auto",
                              }))
                            }
                            className={`p-2 rounded-lg border text-sm transition-all ${
                              proSettings.cameraAngle === "auto"
                                ? "border-[#D8C780] bg-[#D8C780]/20 text-white"
                                : "border-[#2D2D2D] bg-[#06060C] text-[#C1C1C1] hover:border-[#D8C780]/50"
                            }`}
                          >
                            Automático
                          </button>
                          {safeCameraAngles.map((angle) => (
                            <button
                              key={angle.id}
                              type="button"
                              onClick={() =>
                                setProSettings((prev) => ({
                                  ...prev,
                                  cameraAngle: angle.id,
                                }))
                              }
                              className={`p-3 rounded-lg border text-left transition-all ${
                                proSettings.cameraAngle === angle.id
                                  ? "border-[#D8C780] bg-[#D8C780]/20 text-white"
                                  : "border-[#2D2D2D] bg-[#06060C] text-[#C1C1C1] hover:border-[#D8C780]/50"
                              }`}
                            >
                              <div className="font-medium text-sm">{angle.nameES}</div>
                              {angle.description && (
                                <div className="text-xs text-[#C1C1C1] mt-1">
                                  {angle.description}
                                </div>
                              )}
                            </button>
                          ))}
                        </div>
                      </ProSection>

                      {/* Poses */}
                      {proSettings.gender && (
                        <ProSection
                          title="Poses"
                          description="Selecciona una pose específica"
                          isOpen={openSections.pose}
                          onToggle={() => toggleSection("pose")}
                        >
                          <div className="grid grid-cols-2 gap-2">
                            <button
                              type="button"
                              onClick={() =>
                                setProSettings((prev) => ({
                                  ...prev,
                                  pose: "auto",
                                }))
                              }
                              className={`p-2 rounded-lg border text-sm transition-all ${
                                proSettings.pose === "auto"
                                  ? "border-[#D8C780] bg-[#D8C780]/20 text-white"
                                  : "border-[#2D2D2D] bg-[#06060C] text-[#C1C1C1] hover:border-[#D8C780]/50"
                              }`}
                            >
                              Automático
                            </button>
                            {safePoses.map((pose) => (
                              <button
                                key={pose.id}
                                type="button"
                                onClick={() =>
                                  setProSettings((prev) => ({
                                    ...prev,
                                    pose: pose.id,
                                  }))
                                }
                                className={`p-3 rounded-lg border text-left transition-all ${
                                  proSettings.pose === pose.id
                                    ? "border-[#D8C780] bg-[#D8C780]/20 text-white"
                                    : "border-[#2D2D2D] bg-[#06060C] text-[#C1C1C1] hover:border-[#D8C780]/50"
                                }`}
                              >
                                <div className="font-medium text-sm">{pose.name}</div>
                                {pose.description && (
                                  <div className="text-xs text-[#C1C1C1] mt-1">
                                    {pose.description}
                                  </div>
                                )}
                              </button>
                            ))}
                          </div>
                        </ProSection>
                      )}

                      {/* Vestuario */}
                      {proSettings.gender && (
                        <ProSection
                          title="Vestuario"
                          description="Estilo de outfit"
                          isOpen={openSections.outfit}
                          onToggle={() => toggleSection("outfit")}
                        >
                          <div className="grid grid-cols-2 gap-2">
                            <button
                              type="button"
                              onClick={() =>
                                setProSettings((prev) => ({
                                  ...prev,
                                  outfit: "auto",
                                }))
                              }
                              className={`p-2 rounded-lg border text-sm transition-all ${
                                proSettings.outfit === "auto"
                                  ? "border-[#D8C780] bg-[#D8C780]/20 text-white"
                                  : "border-[#2D2D2D] bg-[#06060C] text-[#C1C1C1] hover:border-[#D8C780]/50"
                              }`}
                            >
                              Automático
                            </button>
                            {safeOutfits.map((outfit) => (
                              <button
                                key={outfit.id}
                                type="button"
                                onClick={() =>
                                  setProSettings((prev) => ({
                                    ...prev,
                                    outfit: outfit.id,
                                  }))
                                }
                                className={`p-3 rounded-lg border text-left transition-all ${
                                  proSettings.outfit === outfit.id
                                    ? "border-[#D8C780] bg-[#D8C780]/20 text-white"
                                    : "border-[#2D2D2D] bg-[#06060C] text-[#C1C1C1] hover:border-[#D8C780]/50"
                                }`}
                              >
                                <div className="font-medium text-sm">{outfit.name}</div>
                                {outfit.description && (
                                  <div className="text-xs text-[#C1C1C1] mt-1">
                                    {outfit.description}
                                  </div>
                                )}
                              </button>
                            ))}
                          </div>
                        </ProSection>
                      )}

                      {/* Iluminación */}
                      <ProSection
                        title="Iluminación"
                        description="Esquema de luces profesional"
                        isOpen={openSections.lighting}
                        onToggle={() => toggleSection("lighting")}
                      >
                        <div className="grid grid-cols-2 gap-2">
                          <button
                            type="button"
                            onClick={() =>
                              setProSettings((prev) => ({
                                ...prev,
                                lighting: "auto",
                              }))
                            }
                            className={`p-2 rounded-lg border text-sm transition-all ${
                              proSettings.lighting === "auto"
                                ? "border-[#D8C780] bg-[#D8C780]/20 text-white"
                                : "border-[#2D2D2D] bg-[#06060C] text-[#C1C1C1] hover:border-[#D8C780]/50"
                            }`}
                          >
                            Automático
                          </button>
                          {safeLightingSetups.map((light) => (
                            <button
                              key={light.id}
                              type="button"
                              onClick={() =>
                                setProSettings((prev) => ({
                                  ...prev,
                                  lighting: light.id,
                                }))
                              }
                              className={`p-3 rounded-lg border text-left transition-all ${
                                proSettings.lighting === light.id
                                  ? "border-[#D8C780] bg-[#D8C780]/20 text-white"
                                  : "border-[#2D2D2D] bg-[#06060C] text-[#C1C1C1] hover:border-[#D8C780]/50"
                              }`}
                            >
                              <div className="font-medium text-sm">{light.name}</div>
                              {light.description && (
                                <div className="text-xs text-[#C1C1C1] mt-1">
                                  {light.description}
                                </div>
                              )}
                            </button>
                          ))}
                        </div>
                      </ProSection>

                      {/* Color Grading */}
                      <ProSection
                        title="Color Grading"
                        description="Corrección de color cinematográfica"
                        isOpen={openSections.colorGrading}
                        onToggle={() => toggleSection("colorGrading")}
                      >
                        <div className="grid grid-cols-2 gap-2">
                          <button
                            type="button"
                            onClick={() =>
                              setProSettings((prev) => ({
                                ...prev,
                                colorGrading: "auto",
                              }))
                            }
                            className={`p-2 rounded-lg border text-sm transition-all ${
                              proSettings.colorGrading === "auto"
                                ? "border-[#D8C780] bg-[#D8C780]/20 text-white"
                                : "border-[#2D2D2D] bg-[#06060C] text-[#C1C1C1] hover:border-[#D8C780]/50"
                            }`}
                          >
                            Automático
                          </button>
                          {safeColorGrading.map((grading) => (
                            <button
                              key={grading.id}
                              type="button"
                              onClick={() =>
                                setProSettings((prev) => ({
                                  ...prev,
                                  colorGrading: grading.id,
                                }))
                              }
                              className={`p-3 rounded-lg border text-left transition-all ${
                                proSettings.colorGrading === grading.id
                                  ? "border-[#D8C780] bg-[#D8C780]/20 text-white"
                                  : "border-[#2D2D2D] bg-[#06060C] text-[#C1C1C1] hover:border-[#D8C780]/50"
                              }`}
                            >
                              <div className="font-medium text-sm">{grading.name}</div>
                              {grading.description && (
                                <div className="text-xs text-[#C1C1C1] mt-1">
                                  {grading.description}
                                </div>
                              )}
                            </button>
                          ))}
                        </div>
                      </ProSection>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Botón Generar Prompt - Ancho completo */}
          <button
            type="submit"
            disabled={isLoading || !prompt.trim()}
            className="w-full py-4 bg-gradient-to-r from-[#D8C780] to-[#D8C780] hover:from-[#C4B66D] hover:to-[#C4B66D] disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed rounded-xl font-medium transition-all flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Generando prompt... (1 crédito)
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                Generar Prompt Profesional (1 crédito)
              </>
            )}
          </button>
        </form>

        {/* Resultados: Prompt + Análisis */}
        {response && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
            {/* Prompt Generado */}
            <div className="bg-[#2D2D2D] backdrop-blur-sm rounded-xl p-6 border border-[#2D2D2D]">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-white">
                  Prompt Generado
                </h3>
                <button
                  type="button"
                  onClick={handleCopy}
                  className="flex items-center gap-2 px-4 py-2 bg-[#D8C780] hover:bg-[#C4B66D] rounded-lg transition-colors"
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
              <div className="bg-[#06060C]/50 rounded-lg p-4 text-[#C1C1C1] whitespace-pre-wrap max-h-[400px] overflow-y-auto">
                {response}
              </div>
            </div>

            {/* Análisis de Calidad */}
            {qualityAnalysis && (
              <div className="bg-[#2D2D2D] backdrop-blur-sm rounded-xl p-6 border border-[#2D2D2D]">
                <QualityAnalysis analysis={qualityAnalysis} />
              </div>
            )}
          </div>
        )}

        {/* Generador de Imagen con Nano Banana 🍌 */}
        {response && (
          <div className="mt-8 bg-[#2D2D2D] rounded-xl p-6 border border-[#2D2D2D]">
            <h3 className="text-xl font-medium text-white mb-2">
              ¿Quieres generar la imagen con Nano Banana 🍌?
            </h3>
            <p className="text-[#C1C1C1] text-sm mb-6">
              Sube una foto selfie para adaptar el prompt generado con tu
              rostro. La generación de imagen consume 1 crédito adicional.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Subir Selfie */}
              <div>
                <label className="block text-sm font-medium text-[#C1C1C1] mb-2">
                  Foto Selfie (requerida)
                </label>
                <p className="text-xs text-[#C1C1C1] mb-3">
                  Sube tu foto para crear la imagen con tu rostro
                </p>

                {!selfiePreview ? (
                  <label className="cursor-pointer block">
                    <div className="flex items-center gap-3 p-4 bg-[#06060C]/50 border-2 border-dashed border-[#D8C780]/50 hover:border-[#D8C780] rounded-lg transition-colors">
                      <User className="w-6 h-6 text-[#D8C780]" />
                      <div>
                        <p className="text-white font-medium">
                          Subir foto selfie
                        </p>
                        <p className="text-xs text-[#C1C1C1]">
                          JPG, PNG (máx 5MB)
                        </p>
                      </div>
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleSelfieChange}
                      className="hidden"
                    />
                  </label>
                ) : (
                  <div className="relative">
                    <img
                      src={selfiePreview}
                      alt="Selfie"
                      className="w-full h-48 object-cover rounded-lg border border-[#D8C780]"
                    />
                    <button
                      type="button"
                      onClick={removeSelfie}
                      className="absolute top-2 right-2 p-2 bg-red-500 hover:bg-red-600 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>

              {/* Formato de Imagen */}
              <div>
                <label className="text-sm font-medium text-[#C1C1C1] mb-2 block">
                  Formato de imagen
                </label>
                <div className="grid grid-cols-5 gap-2 mb-4">
                  {["1:1", "3:4", "4:3", "9:16", "16:9"].map((ratio) => (
                    <button
                      key={ratio}
                      type="button"
                      onClick={() => setSelectedAspectRatio(ratio)}
                      className={`py-2 px-3 rounded-lg border transition-all text-sm ${
                        selectedAspectRatio === ratio
                          ? "border-[#D8C780] bg-[#D8C780]/20 text-white"
                          : "border-[#2D2D2D] bg-[#06060C] text-[#C1C1C1] hover:border-[#D8C780]/50"
                      }`}
                    >
                      {ratio}
                    </button>
                  ))}
                </div>

                {/* Botón generar */}
                <button
                  type="button"
                  onClick={handleGenerateImage}
                  disabled={isGeneratingImage || !selfieImage}
                  className="w-full py-4 bg-[#D8C780] hover:bg-[#C4B66D] disabled:bg-[#2D2D2D] disabled:cursor-not-allowed rounded-xl font-medium text-[#06060C] disabled:text-[#C1C1C1] transition-all flex items-center justify-center gap-2"
                >
                  {isGeneratingImage ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Generando imagen...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5" />
                      Generar Imagen con Nano Banana 🍌 (1 crédito)
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Galería de imágenes generadas */}
            {generatedImages.length > 0 && (
              <div className="mt-6">
                <h4 className="text-lg font-medium text-white mb-3">
                  Imagen generada:
                </h4>
                <div className="grid gap-4">
                  {generatedImages.map((img, idx) => (
                    <div key={idx} className="relative group">
                      <img
                        src={`data:${img.mimeType};base64,${img.base64}`}
                        alt={`Generada ${idx + 1}`}
                        className="w-full rounded-lg border border-[#2D2D2D]"
                      />
                      <a
                        href={`data:${img.mimeType};base64,${img.base64}`}
                        download={`promptraits-nanoBanana-${Date.now()}.png`}
                        className="absolute bottom-4 right-4 px-4 py-3 bg-[#D8C780] hover:bg-[#C4B66D] rounded-lg text-[#06060C] font-medium opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        Descargar Imagen
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </AnimatedSection>
      )}
    </div>
  );
}

// ============================================================================
// COMPONENTE HELPER: ProSection
// ============================================================================
function ProSection({ title, description, isOpen, onToggle, children }) {
  return (
    <div className="border border-[#2D2D2D] rounded-lg overflow-hidden">
      <button
        type="button"
        onClick={onToggle}
        className="w-full flex items-center justify-between p-3 bg-[#06060C]/50 hover:bg-[#06060C] transition-colors"
      >
        <div className="text-left flex-1">
          <div className="font-medium text-white text-sm">{title}</div>
          <div className="text-xs text-[#C1C1C1]">{description}</div>
        </div>

        <span className="text-xl">
          {isOpen ? (
            <ChevronUp className="w-4 h-4" />
          ) : (
            <ChevronDown className="w-4 h-4" />
          )}
        </span>
      </button>

      {isOpen && <div className="p-3 bg-black/20">{children}</div>}
    </div>
  );
}
