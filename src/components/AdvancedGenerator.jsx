import React, { useState, useEffect, useRef } from "react";
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
  Download, // ✅ AÑADIDO
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
  // ============================================================================
  // ESTADOS PRINCIPALES
  // ============================================================================
  const {
    user,
    profile,
    refreshProfile,
    consumeCredits,
    savePromptToHistory,
  } = useAuth();

  const [isInitializing, setIsInitializing] = useState(true);
  const [userPrompt, setUserPrompt] = useState("");
  const [response, setResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [referenceImage, setReferenceImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [qualityAnalysis, setQualityAnalysis] = useState(null);

  const [selfieImage, setSelfieImage] = useState(null);
  const [selfiePreview, setSelfiePreview] = useState("");
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [generatedImages, setGeneratedImages] = useState([]);

  const [showProTools, setShowProTools] = useState(false);
  const [selectedFeature, setSelectedFeature] = useState(null);
  const [selectedGender, setSelectedGender] = useState("masculine");
  const [openSections, setOpenSections] = useState({
    environment: false,
    shotType: false,
    cameraAngle: false,
    pose: false,
    outfit: false,
    lighting: false,
    colorGrading: false,
  });
  const [proSettings, setProSettings] = useState({
    gender: "masculine",
    environment: { id: null, custom: "" },
    shotType: null,
    cameraAngle: null,
    pose: null,
    outfit: null,
    lighting: null,
    colorGrading: null,
  });

  // ============================================================================

  // VERIFICAR QUE isPro EXISTE - ✅ INCLUIR PREMIUM
  // ============================================================================

  const isPro = 
    profile?.subscription_status === 'active' || 
    profile?.subscription_tier === 'pro' ||
    profile?.subscription_tier === 'premium' ||
    profile?.is_pro === true || 
    false;

  // Debug temporal para verificar
  useEffect(() => {
    console.log('🔍 DEBUG SUBSCRIPTION:', {
      subscription_status: profile?.subscription_status,
      subscription_tier: profile?.subscription_tier,
      is_pro: profile?.is_pro,
      isPro: isPro
    });
  }, [profile]);

  // ============================================================================
  // INICIALIZACIÓN
  // ============================================================================
  useEffect(() => {
    const init = async () => {
      setIsInitializing(true);
      if (user) {
        await refreshProfile();
      }
      setIsInitializing(false);
    };
    init();
  }, [user]);

  // ============================================================================
  // PROMPT COMBINADO
  // ============================================================================
  const prompt = userPrompt || "";

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
  // 🔥 GENERAR PROMPT (CORREGIDO CON CONSUME DE CRÉDITOS E HISTORIAL)
  // ============================================================================
  const handleSubmit = async (e) => {
    e.preventDefault();

    // ✅ PERMITIR generar si hay imagen de referencia O texto
    if (!prompt.trim() && !referenceImage) {
      alert(
        "Por favor, describe lo que quieres generar o sube una imagen de referencia"
      );
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
        // Si no hay texto, usar un prompt descriptivo por defecto
        const promptToSend =
          prompt.trim() ||
          "Recreate this exact image with all its details, environment, lighting, subject pose, camera angle, and composition. Using the exact face from the provided selfie — no editing, no retouching, no smoothing. Match the reference image precisely.";
        formData.append("prompt", promptToSend);
        formData.append("platform", "nano-banana");
        formData.append("userId", user.id);
        formData.append("proSettings", JSON.stringify(proSettings));
        formData.append("referenceImage", referenceImage);
        formData.append("analyzeReference", "true");

        requestData = formData;
        // No establecer Content-Type para FormData
      } else {
        // Sin imagen, usar JSON simple
        requestData = JSON.stringify({
          prompt: prompt,
          platform: "nano-banana",
          userId: user.id,
          proSettings: proSettings,
          analyzeQuality: isPro, // ✅ Solo analizar calidad si es PRO
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

      // ✅ ACTUALIZAR ESTADOS CON LA RESPUESTA
      setResponse(data.prompt || "");
      if (data.analysis) {
        setQualityAnalysis(data.analysis);
      }

      // 🔥 CONSUMIR CRÉDITOS (NUEVO)
      try {
        console.log("💳 Consumiendo 1 crédito...");
        const consumeResult = await consumeCredits(1);
        console.log("✅ Crédito consumido:", consumeResult);
      } catch (creditError) {
        console.error("❌ Error al consumir crédito:", creditError);
        alert("Error al consumir créditos. Por favor, recarga la página.");
      }

      // 🔥 GUARDAR EN HISTORIAL (NUEVO)
      try {
        console.log("💾 Guardando en historial...");
        await savePromptToHistory(
          data.prompt,
          {
            platform: "nano-banana",
            proSettings: proSettings,
            referenceImage: referenceImage ? true : false,
            selectedFeature: selectedFeature,
          },
          null // La imagen URL se añadirá después si se genera
        );
        console.log("✅ Guardado en historial");
      } catch (historyError) {
        console.error("❌ Error al guardar en historial:", historyError);
        // No mostrar error al usuario, el historial es secundario
      }

      // Refrescar el perfil para actualizar los créditos en UI
      await refreshProfile();
    } catch (error) {
      console.error("Error:", error);
      alert(error.message || "Error al generar el prompt");
    } finally {
      setIsLoading(false);
    }
  };

  // ============================================================================
  // 🔥 GENERAR IMAGEN (CORREGIDO CON CONSUME DE CRÉDITOS)
  // ============================================================================
  const handleGenerateImage = async () => {
    if (!response) {
      alert("Primero genera un prompt antes de crear una imagen");
      return;
    }

    if (!selfieImage) {
      alert("Por favor, sube una imagen selfie para generar la imagen");
      return;
    }

    if (!profile || profile.credits < 1) {
      alert("No tienes suficientes créditos para generar una imagen");
      return;
    }

    setIsGeneratingImage(true);
    setGeneratedImages([]);

    try {
      const formData = new FormData();
      formData.append("prompt", response);
      formData.append("selfieImage", selfieImage);
      formData.append("aspectRatio", "1:1");
      formData.append("userId", user.id);

      const res = await fetch("/api/generate-image", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Error al generar la imagen");
      }

      const data = await res.json();

      if (data.images && data.images.length > 0) {
        setGeneratedImages(data.images);

        // 🔥 CONSUMIR CRÉDITOS POR LA IMAGEN
        try {
          console.log("💳 Consumiendo 1 crédito por imagen...");
          await consumeCredits(1);
          console.log("✅ Crédito consumido por imagen");
        } catch (creditError) {
          console.error("❌ Error al consumir crédito:", creditError);
          alert("Error al consumir créditos. Por favor, recarga la página.");
        }

        // 🔥 ACTUALIZAR HISTORIAL CON LA IMAGEN (OPCIONAL)
        // Si quieres guardar la imagen en el historial, puedes hacerlo aquí
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

  // ✅ COMPONENTE PROSECTION
  const ProSection = ({ title, description, isOpen, onToggle, children }) => (
    <div className="border border-[#2D2D2D] rounded-lg overflow-hidden">
      <button
        type="button"
        onClick={onToggle}
        className="w-full flex items-center justify-between p-4 bg-[#06060C]/50 hover:bg-[#06060C] transition-colors"
      >
        <div className="text-left">
          <h4 className="text-white font-medium">{title}</h4>
          <p className="text-xs text-[#C1C1C1] mt-1">{description}</p>
        </div>
        {isOpen ? (
          <ChevronUp className="w-5 h-5 text-[#D8C780]" />
        ) : (
          <ChevronDown className="w-5 h-5 text-[#C1C1C1]" />
        )}
      </button>
      {isOpen && <div className="p-4 bg-[#06060C]/30">{children}</div>}
    </div>
  );

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
                {/* BOTÓN HERRAMIENTAS PRO */}
                {isPro && (
                  <button
                    type="button"
                    onClick={() => setShowProTools(!showProTools)}
                    className={`w-full flex items-center justify-between p-4 rounded-lg border transition-all ${
                      showProTools
                        ? 'bg-[#D8C780]/10 border-[#D8C780]'
                        : 'bg-[#06060C]/50 border-[#2D2D2D] hover:border-[#D8C780]/50'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <Crown className="w-5 h-5 text-[#D8C780]" />
                      <div className="text-left">
                        <span className="text-white font-medium">Herramientas PRO</span>
                        <p className="text-xs text-[#C1C1C1] mt-1">
                          Control avanzado de parámetros fotográficos
                        </p>
                      </div>
                    </div>
                    {showProTools ? (
                      <ChevronUp className="w-5 h-5 text-[#D8C780]" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-[#C1C1C1]" />
                    )}
                  </button>
                )}

                {/* SI NO ES PRO, MOSTRAR MENSAJE */}
                {!isPro && (
                  <div className="p-4 bg-[#D8C780]/5 border border-[#D8C780]/20 rounded-lg text-center">
                    <Crown className="w-8 h-8 text-[#D8C780] mx-auto mb-2" />
                    <p className="text-sm text-[#C1C1C1]">
                      Actualiza a <span className="text-[#D8C780] font-semibold">PRO</span> o{' '}
                      <span className="text-[#D8C780] font-semibold">PREMIUM</span> para acceder a herramientas avanzadas
                    </p>
                  </div>
                )}

                {showProTools && (
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
                                <div className="font-medium text-sm">
                                  {env.name}
                                </div>
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
                                <div className="font-medium text-sm">
                                  {shot.nameES}
                                </div>
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
                                <div className="font-medium text-sm">
                                  {angle.nameES}
                                </div>
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
                                  <div className="font-medium text-sm">
                                    {pose.name}
                                  </div>
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
                                  <div className="font-medium text-sm">
                                    {outfit.name}
                                  </div>
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
                                <div className="font-medium text-sm">
                                  {light.name}
                                </div>
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
                                <div className="font-medium text-sm">
                                  {grading.name}
                                </div>
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

            {/* Botón de Generar Prompt */}
            <div className="flex justify-center">
              <button
                type="submit"
                disabled={isLoading || (!prompt.trim() && !referenceImage)}
                className={`px-8 py-3 rounded-lg font-medium transition-all flex items-center gap-2 ${
                  isLoading || (!prompt.trim() && !referenceImage)
                    ? "bg-[#2D2D2D] text-[#666] cursor-not-allowed"
                    : "bg-gradient-to-r from-[#D8C780] to-[#B8A760] text-black hover:shadow-lg hover:shadow-[#D8C780]/30"
                }`}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Generando...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    Generar Prompt (1 crédito)
                  </>
                )}
              </button>
            </div>
          </form>

          {/* 🔥 RESULTADO CON ANÁLISIS DE CALIDAD */}
          {response && (
            <AnimatedSection>
              <div className="mt-8 space-y-6">
                {/* Prompt Generado */}
                <div className="p-6 bg-[#06060C] border border-[#D8C780] rounded-lg">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-bold text-[#D8C780]">
                      Prompt Generado
                    </h3>
                    <button
                      onClick={handleCopy}
                      className="p-2 bg-[#D8C780]/20 hover:bg-[#D8C780]/30 rounded-lg transition-colors"
                    >
                      {copied ? (
                        <Check className="w-5 h-5 text-[#D8C780]" />
                      ) : (
                        <Copy className="w-5 h-5 text-[#D8C780]" />
                      )}
                    </button>
                  </div>
                  <p className="text-white whitespace-pre-wrap leading-relaxed">
                    {response}
                  </p>
                  <div className="mt-4 text-sm text-[#C1C1C1]">
                    {response.length} caracteres
                  </div>
                </div>

                {/* 🔥 ANÁLISIS DE CALIDAD (NUEVO) */}
                {qualityAnalysis && (
                  <QualityAnalysis
                    analysis={qualityAnalysis}
                    prompt={response}
                  />
                )}

                {/* Sección de Generar Imagen con Selfie */}
                <div className="p-6 bg-gradient-to-br from-[#D8C780]/10 to-[#D8C780]/5 border border-[#D8C780]/30 rounded-lg">
                  <h3 className="text-xl font-bold text-white mb-4">
                    ¿Quieres generar la imagen con Nano Banana 🍌?
                  </h3>
                  <p className="text-[#C1C1C1] mb-6">
                    Sube una foto selfie para generar la imagen con tu rostro
                  </p>

                  {!selfiePreview ? (
                    <label className="cursor-pointer block mb-6">
                      <div className="flex items-center gap-3 p-4 bg-[#06060C]/50 border border-[#2D2D2D] hover:border-[#D8C780] rounded-lg transition-colors">
                        <User className="w-6 h-6 text-[#D8C780]" />
                        <div>
                          <p className="text-white font-medium">
                            Subir selfie para generar imagen
                          </p>
                          <p className="text-xs text-[#C1C1C1]">
                            Tu rostro se usará para crear la imagen
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
                    <div className="relative mb-6">
                      <img
                        src={selfiePreview}
                        alt="Selfie"
                        className="w-32 h-32 object-cover rounded-lg border border-[#2D2D2D]"
                      />
                      <button
                        type="button"
                        onClick={removeSelfie}
                        className="absolute -top-2 -right-2 p-1 bg-red-500 hover:bg-red-600 rounded-full transition-colors"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  )}

                  <button
                    onClick={handleGenerateImage}
                    disabled={!selfieImage || isGeneratingImage}
                    className={`px-6 py-3 rounded-lg font-medium transition-all flex items-center gap-2 ${
                      !selfieImage || isGeneratingImage
                        ? "bg-[#2D2D2D] text-[#666] cursor-not-allowed"
                        : "bg-gradient-to-r from-[#D8C780] to-[#B8A760] text-black hover:shadow-lg hover:shadow-[#D8C780]/30"
                    }`}
                  >
                    {isGeneratingImage ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Generando imagen...
                      </>
                    ) : (
                      <>
                        <ImageIcon className="w-5 h-5" />
                        Generar Imagen (1 crédito)
                      </>
                    )}
                  </button>
                </div>

                {/* Mostrar imagen generada */}
                {generatedImages.length > 0 && (
                  <div className="p-6 bg-[#06060C] border border-[#D8C780] rounded-lg">
                    <h3 className="text-xl font-bold text-[#D8C780] mb-4">
                      Imagen Generada
                    </h3>
                    {generatedImages.map((img, index) => (
                      <div key={index} className="space-y-4">
                        <img
                          src={`data:${img.mimeType || "image/png"};base64,${
                            img.base64
                          }`}
                          alt={`Generada ${index + 1}`}
                          className="w-full rounded-lg border border-[#2D2D2D]"
                        />
                        <a
                          href={`data:${img.mimeType || "image/png"};base64,${
                            img.base64
                          }`}
                          download={`nano-banana-${Date.now()}.png`}
                          className="inline-flex items-center gap-2 px-4 py-2 bg-[#D8C780]/20 hover:bg-[#D8C780]/30 border border-[#D8C780] rounded-lg transition-colors text-white"
                        >
                          <Download className="w-4 h-4" />
                          Descargar
                        </a>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </AnimatedSection>
          )}
        </AnimatedSection>
      )}
    </div>
  );
}
