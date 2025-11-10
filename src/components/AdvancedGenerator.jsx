import React, { useState, useEffect, useMemo } from "react";
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
  Download,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { supabase } from "../lib/supabase";
import AnimatedSection from "./AnimatedSection";
import QualityAnalysis from "./QualityAnalysis";

// IMPORTAR DATOS
import Outfits_women from "../data/Outfits_women";
import Outfits_men from "../data/Outfits_men";
import { SHOT_TYPES, CAMERA_ANGLES } from "../data/shotTypesData";
import { ENVIRONMENTS_ARRAY } from "../data/environmentsData";
import { getPosesByGender, POSES } from "../data/posesData";
import { LIGHTING_SETUPS } from "../data/lightingData";
import { COLOR_GRADING_FILTERS } from "../data/colorGradingData";

// ============================================================================
// CONSTANTES
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

const GENDER_OPTIONS = [
  { id: "masculine", name: "Masculino" },
  { id: "feminine", name: "Femenino" },
  { id: "couple", name: "Pareja" },
];

const VALID_ASPECT_RATIOS = [
  { id: "1:1", name: "Cuadrado" },
  { id: "3:4", name: "Vertical" },
  { id: "9:16", name: "Historia" },
  { id: "4:3", name: "Horizontal" },
  { id: "16:9", name: "Panorámica" },
];

// ============================================================================
// COMPONENTE PRINCIPAL
// ============================================================================
export default function AdvancedGenerator() {
  // ============================================================================
  // ESTADOS Y HOOKS
  // ============================================================================

  const { user, profile, refreshProfile, consumeCredits, savePromptToHistory } =
    useAuth();

  // ✅ Volvemos a tu lógica de 'isInitializing' que SÍ funcionaba
  const [isInitializing, setIsInitializing] = useState(true);
  useEffect(() => {
    if (user !== undefined && profile !== undefined) {
      setIsInitializing(false);
    }
  }, [user, profile]);

  const [userPrompt, setUserPrompt] = useState("");
  const [response, setResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [referenceImage, setReferenceImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [qualityAnalysis, setQualityAnalysis] = useState(null);

  // Nano Banana
  const [selfieImage, setSelfieImage] = useState(null);
  const [selfiePreview, setSelfiePreview] = useState("");
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [generatedImages, setGeneratedImages] = useState([]);
  const [selectedAspectRatio, setSelectedAspectRatio] = useState("1:1");

  // Herramientas PRO
  const [showProTools, setShowProTools] = useState(false);
  const [selectedFeature, setSelectedFeature] = useState(null);

  // ✅ Estado de settings (con "auto" por defecto)
  const [proSettings, setProSettings] = useState({
    gender: "masculine",
    environment: "auto",
    shotType: "auto",
    cameraAngle: "auto",
    pose: "auto",
    outfit: "auto",
    lighting: "auto",
    colorGrading: "auto",
  });

  // ✅ Estado para la previsualización del prompt PRO
  const [proPromptPreview, setProPromptPreview] = useState("");

  // Estado para desplegables
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

  // ============================================================================
  // VERIFICACIÓN DE ESTADO PRO
  // ============================================================================

  // ✅ CORREGIDO: Usar 'profile.plan'
  const isPro = profile?.plan === "pro" || profile?.plan === "premium";

  useEffect(() => {
    if (isPro && !showProTools) {
      setShowProTools(true);
    }
  }, [isPro]);

  // ============================================================================
  // LÓGICA DE DATOS (Optimizada con useMemo)
  // ============================================================================
  const safeEnvironments = useMemo(() => ENVIRONMENTS_ARRAY || [], []);
  const safeShotTypes = useMemo(() => SHOT_TYPES || [], []);
  const safeCameraAngles = useMemo(() => CAMERA_ANGLES || [], []);
  const safeLightingSetups = useMemo(() => LIGHTING_SETUPS || [], []);
  const safeColorGrading = useMemo(() => COLOR_GRADING_FILTERS || [], []);

  const safeOutfits = useMemo(() => {
    if (proSettings.gender === "masculine" || proSettings.gender === "couple") {
      return Outfits_men || [];
    } else if (proSettings.gender === "feminine") {
      return Outfits_women || [];
    }
    return [...(Outfits_women || []), ...(Outfits_men || [])];
  }, [proSettings.gender]);

  const safePoses = useMemo(() => {
    return getPosesByGender(proSettings.gender) || [];
  }, [proSettings.gender]);

  // ============================================================================
  // ✅ NUEVO: Función para obtener el nombre de la selección actual
  // ============================================================================
  const getSelectedItemName = (section, value) => {
    if (value === "auto" || !value) return "Automático";
    let data;
    switch (section) {
      case "environment":
        data = safeEnvironments;
        break;
      case "shotType":
        data = safeShotTypes;
        return data.find((i) => i.id === value)?.nameES || "Automático";
      case "cameraAngle":
        data = safeCameraAngles;
        return data.find((i) => i.id === value)?.nameES || "Automático";
      case "gender":
        data = GENDER_OPTIONS;
        break;
      case "pose":
        data = safePoses;
        break;
      case "outfit":
        data = safeOutfits;
        break;
      case "lighting":
        data = safeLightingSetups;
        break;
      case "colorGrading":
        data = safeColorGrading;
        break;
      default:
        return "Automático";
    }
    return data.find((item) => item.id === value)?.name || "Automático";
  };

  // ============================================================================
  // ✅ NUEVO: useEffect para actualizar la previsualización del prompt PRO
  // ============================================================================
  useEffect(() => {
    if (!isPro || !showProTools) {
      setProPromptPreview(""); // Limpiar si no es PRO o las herramientas están cerradas
      return;
    }

    const proParams = [];
    const getName = (section, id) => getSelectedItemName(section, id);

    // Construir el texto solo con las opciones que NO son "Automático"
    if (proSettings.gender)
      proParams.push(`Género: ${getName("gender", proSettings.gender)}`);
    if (proSettings.environment !== "auto")
      proParams.push(
        `Entorno: ${getName("environment", proSettings.environment)}`
      );
    if (proSettings.shotType !== "auto")
      proParams.push(`Plano: ${getName("shotType", proSettings.shotType)}`);
    if (proSettings.cameraAngle !== "auto")
      proParams.push(
        `Ángulo: ${getName("cameraAngle", proSettings.cameraAngle)}`
      );
    if (proSettings.pose !== "auto")
      proParams.push(`Pose: ${getName("pose", proSettings.pose)}`);
    if (proSettings.outfit !== "auto")
      proParams.push(`Outfit: ${getName("outfit", proSettings.outfit)}`);
    if (proSettings.lighting !== "auto")
      proParams.push(
        `Iluminación: ${getName("lighting", proSettings.lighting)}`
      );
    if (proSettings.colorGrading !== "auto")
      proParams.push(
        `Color: ${getName("colorGrading", proSettings.colorGrading)}`
      );

    setProPromptPreview(proParams.join(" | "));
  }, [
    proSettings,
    isPro,
    showProTools,
    safeEnvironments,
    safeShotTypes,
    safeCameraAngles,
    safePoses,
    safeOutfits,
    safeLightingSetups,
    safeColorGrading,
  ]);

  // ============================================================================
  // HANDLERS (Imágenes, Copiar, etc.)
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

  const handleCopy = () => {
    navigator.clipboard.writeText(response);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // ✅ CORREGIDO: Lógica de Auto-Colapso
  const toggleSection = (section) => {
    setOpenSections((prev) => ({
      // Reseteamos todas a 'false' para que solo una esté abierta
      environment: false,
      shotType: false,
      cameraAngle: false,
      gender: false,
      pose: false,
      outfit: false,
      lighting: false,
      colorGrading: false,
      // Abrimos/cerramos la actual
      [section]: !prev[section],
    }));
  };

  const toggleFeature = (featureId) => {
    setSelectedFeature((prev) => (prev === featureId ? null : featureId));
    setShowProTools(false);
  };

  // ============================================================================
  // 🔥 GENERAR PROMPT (Función Principal)
  // ============================================================================
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!userPrompt.trim() && !referenceImage) {
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

      const promptToSend =
        userPrompt.trim() ||
        "Recreate this exact image with all its details, environment, lighting, subject pose, camera angle, and composition. Using the exact face from the provided selfie — no editing, no retouching, no smoothing. Match the reference image precisely.";

      if (referenceImage) {
        const formData = new FormData();
        formData.append("prompt", promptToSend);
        formData.append("platform", "nano-banana");
        formData.append("userId", user.id);
        formData.append("proSettings", JSON.stringify(proSettings));
        formData.append("referenceImage", referenceImage);
        formData.append("analyzeReference", "true");
        formData.append("analyzeQuality", isPro);
        requestData = formData;
      } else {
        requestData = JSON.stringify({
          prompt: promptToSend,
          platform: "nano-banana",
          userId: user.id,
          proSettings: proSettings, // <-- Enviar el objeto de settings
          analyzeQuality: isPro,
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
        console.log("✅ Análisis de calidad recibido");
        setQualityAnalysis(data.analysis);
      } else {
        console.log("ℹ️ No se recibió análisis de calidad.");
      }

      try {
        console.log("💳 Consumiendo 1 crédito...");
        await consumeCredits(1);
      } catch (creditError) {
        console.error("❌ Error al consumir crédito:", creditError);
      }

      try {
        await savePromptToHistory(
          data.prompt,
          {
            platform: "nano-banana",
            proSettings: proSettings,
            referenceImage: referenceImage ? true : false,
            selectedFeature: selectedFeature,
          },
          null
        );
      } catch (historyError) {
        console.error("❌ Error al guardar en historial:", historyError);
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
  // 🔥 GENERAR IMAGEN (Función Principal)
  // ============================================================================
  const handleGenerateImage = async () => {
    if (!response) {
      alert("Primero debes generar un prompt");
      return;
    }
    if (!selfieImage) {
      alert("Debes subir una foto selfie para generar la imagen con tu rostro");
      return;
    }

    if (!isPro) {
      alert(
        "Solo los usuarios PRO y PREMIUM pueden generar imágenes. Por favor, actualiza tu plan."
      );
      return;
    }

    if (!profile || profile.credits < 1) {
      alert("No tienes suficientes créditos. Compra más en la sección Planes.");
      return;
    }

    setIsGeneratingImage(true);
    setGeneratedImages([]);

    try {
      // 1. OBTENER TOKEN
      console.log("🔐 Obteniendo sesión de Supabase...");
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();

      if (sessionError || !session) {
        console.error("Error al obtener la sesión:", sessionError);
        throw new Error(
          "No estás autenticado. Por favor, inicia sesión de nuevo."
        );
      }
      const token = session.access_token;
      console.log("✅ Token JWT obtenido.");

      // 2. CONSTRUIR FORMDATA
      const formData = new FormData();
      formData.append("prompt", response);
      formData.append("aspectRatio", selectedAspectRatio);
      formData.append("selfieImage", selfieImage);

      // 3. LLAMAR A LA API SEGURA
      const res = await fetch("/api/generate-image", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`, // <-- Autenticación
        },
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Error al generar imagen");
      }

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
  // RENDERIZADO
  // ============================================================================
  return (
    <div className="min-h-screen bg-[#06060C] py-20">
      <div className="max-w-6xl mx-auto px-4">
        {" "}
        {/* ✅ ANCHO CORREGIDO */}
        {/* ✅ LÓGICA DE CARGA (de tu código antiguo) */}
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
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* COLUMNA IZQUIERDA: ... */}
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

                    {/* ================================================================== */}
                    {/* ✅ NUEVO: Previsualización de Opciones PRO */}
                    {/* ================================================================== */}
                    {isPro && showProTools && proPromptPreview && (
                      <div className="mt-2 p-3 bg-[#06060C] border border-[#2D2D2D] rounded-lg">
                        <p className="text-xs text-[#C1C1C1] mb-1 font-medium">
                          Opciones PRO activas:
                        </p>
                        <p className="text-sm text-[#D8C780] leading-relaxed">
                          {proPromptPreview}
                        </p>
                      </div>
                    )}
                    {!isPro && selectedFeature && (
                      <div className="mt-2 p-3 bg-[#06060C] border border-[#2D2D2D] rounded-lg">
                        <p className="text-xs text-[#C1C1C1] mb-1 font-medium">
                          Opción Rápida activa:
                        </p>
                        <p className="text-sm text-[#D8C780] leading-relaxed">
                          {
                            QUICK_FEATURES.find((f) => f.id === selectedFeature)
                              ?.name
                          }
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Imagen de Referencia */}
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
                      Selecciona una característica rápida (solo usuarios Free)
                    </p>
                    <div className="grid grid-cols-2 gap-2">
                      {QUICK_FEATURES.map((feature) => (
                        <button
                          key={feature.id}
                          type="button"
                          onClick={() => toggleFeature(feature.id)}
                          disabled={isPro} // <-- Deshabilitado si eres PRO
                          className={`p-3 rounded-lg border transition-all text-sm ${
                            selectedFeature === feature.id
                              ? "border-[#D8C780] bg-[#D8C780]/20 text-white"
                              : isPro
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
                          ? "bg-[#D8C780]/10 border-[#D8C780]"
                          : "bg-[#06060C]/50 border-[#2D2D2D] hover:border-[#D8C780]/50"
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <Crown className="w-5 h-5 text-[#D8C780]" />
                        <div className="text-left">
                          <span className="text-white font-medium">
                            Herramientas PRO
                          </span>
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

                  {/* ✅ BANNER UPSELL CON FONDO CORREGIDO */}
                  {!isPro && (
                    <div className="p-6 bg-[#06060C] border border-[#2D2D2D] rounded-lg">
                      {" "}
                      {/* <-- FONDO CORREGIDO */}
                      <Crown className="w-10 h-10 text-[#D8C780] mx-auto mb-4" />
                      <h3 className="text-xl font-bold text-white text-center mb-4">
                        Herramientas PRO
                      </h3>
                      <p className="text-sm text-[#C1C1C1] text-center mb-6">
                        Regístrate o inicia sesión con una cuenta PRO para
                        acceder a:
                      </p>
                      <ul className="space-y-3 text-[#C1C1C1]">
                        <li className="flex items-start">
                          <span className="text-[#D8C780] mr-2 mt-1"> • </span>
                          <span>Control completo de entornos y locaciones</span>
                        </li>
                        <li className="flex items-start">
                          <span className="text-[#D8C780] mr-2 mt-1"> • </span>
                          <span>
                            Selección de planos de cámara profesionales
                          </span>
                        </li>
                        <li className="flex items-start">
                          <span className="text-[#D8C780] mr-2 mt-1"> • </span>
                          <span>
                            56 poses profesionales (masculinas, femeninas y
                            pareja)
                          </span>
                        </li>
                        <li className="flex items-start">
                          <span className="text-[#D8C780] mr-2 mt-1"> • </span>
                          <span>
                            Estilos de vestuario y outfits personalizados
                          </span>
                        </li>
                        <li className="flex items-start">
                          <span className="text-[#D8C780] mr-2 mt-1"> • </span>
                          <span>23 esquemas de iluminación profesional</span>
                        </li>
                        <li className="flex items-start">
                          <span className="text-[#D8C780] mr-2 mt-1"> • </span>
                          <span>
                            27 filtros de color grading cinematográfico
                          </span>
                        </li>
                        <li className="flex items-start">
                          <span className="text-[#D8C780] mr-2 mt-1"> • </span>
                          <span className="flex items-center">
                            Generar imágenes con Nano Banana 🍌 desde
                            Promptraits.com
                          </span>
                        </li>
                      </ul>
                    </div>
                  )}

                  {/* Contenedor de Herramientas PRO */}
                  {isPro && showProTools && (
                    <div className="space-y-4 mt-4">
                      <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
                        {/* Género */}
                        <ProSection
                          title="Género"
                          description={getSelectedItemName(
                            "gender",
                            proSettings.gender
                          )}
                          isOpen={openSections.gender}
                          onToggle={() => toggleSection("gender")}
                        >
                          <div className="grid grid-cols-3 gap-2">
                            {GENDER_OPTIONS.map((option) => (
                              <button
                                key={option.id}
                                type="button"
                                onClick={() => {
                                  setProSettings((prev) => ({
                                    ...prev,
                                    gender: option.id,
                                  }));
                                  toggleSection("gender"); // ✅ AUTO-COLAPSAR
                                }}
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
                          description={getSelectedItemName(
                            "environment",
                            proSettings.environment
                          )}
                          isOpen={openSections.environment}
                          onToggle={() => toggleSection("environment")}
                        >
                          <div className="grid grid-cols-2 gap-2">
                            <button
                              type="button"
                              onClick={() => {
                                setProSettings((prev) => ({
                                  ...prev,
                                  environment: "auto",
                                }));
                                toggleSection("environment"); // ✅ AUTO-COLAPSAR
                              }}
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
                                onClick={() => {
                                  setProSettings((prev) => ({
                                    ...prev,
                                    environment: env.id,
                                  }));
                                  toggleSection("environment"); // ✅ AUTO-COLAPSAR
                                }}
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
                          description={getSelectedItemName(
                            "shotType",
                            proSettings.shotType
                          )}
                          isOpen={openSections.shotType}
                          onToggle={() => toggleSection("shotType")}
                        >
                          <div className="grid grid-cols-2 gap-2">
                            <button
                              type="button"
                              onClick={() => {
                                setProSettings((prev) => ({
                                  ...prev,
                                  shotType: "auto",
                                }));
                                toggleSection("shotType"); // ✅ AUTO-COLAPSAR
                              }}
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
                                onClick={() => {
                                  setProSettings((prev) => ({
                                    ...prev,
                                    shotType: shot.id,
                                  }));
                                  toggleSection("shotType"); // ✅ AUTO-COLAPSAR
                                }}
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
                          description={getSelectedItemName(
                            "cameraAngle",
                            proSettings.cameraAngle
                          )}
                          isOpen={openSections.cameraAngle}
                          onToggle={() => toggleSection("cameraAngle")}
                        >
                          <div className="grid grid-cols-2 gap-2">
                            <button
                              type="button"
                              onClick={() => {
                                setProSettings((prev) => ({
                                  ...prev,
                                  cameraAngle: "auto",
                                }));
                                toggleSection("cameraAngle"); // ✅ AUTO-COLAPSAR
                              }}
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
                                onClick={() => {
                                  setProSettings((prev) => ({
                                    ...prev,
                                    cameraAngle: angle.id,
                                  }));
                                  toggleSection("cameraAngle"); // ✅ AUTO-COLAPSAR
                                }}
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
                            description={getSelectedItemName(
                              "pose",
                              proSettings.pose
                            )}
                            isOpen={openSections.pose}
                            onToggle={() => toggleSection("pose")}
                          >
                            <div className="grid grid-cols-2 gap-2">
                              <button
                                type="button"
                                onClick={() => {
                                  setProSettings((prev) => ({
                                    ...prev,
                                    pose: "auto",
                                  }));
                                  toggleSection("pose"); // ✅ AUTO-COLAPSAR
                                }}
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
                                  onClick={() => {
                                    setProSettings((prev) => ({
                                      ...prev,
                                      pose: pose.id,
                                    }));
                                    toggleSection("pose"); // ✅ AUTO-COLAPSAR
                                  }}
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
                            description={getSelectedItemName(
                              "outfit",
                              proSettings.outfit
                            )}
                            isOpen={openSections.outfit}
                            onToggle={() => toggleSection("outfit")}
                          >
                            <div className="grid grid-cols-2 gap-2">
                              <button
                                type="button"
                                onClick={() => {
                                  setProSettings((prev) => ({
                                    ...prev,
                                    outfit: "auto",
                                  }));
                                  toggleSection("outfit"); // ✅ AUTO-COLAPSAR
                                }}
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
                                  onClick={() => {
                                    setProSettings((prev) => ({
                                      ...prev,
                                      outfit: outfit.id,
                                    }));
                                    toggleSection("outfit"); // ✅ AUTO-COLAPSAR
                                  }}
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
                          description={getSelectedItemName(
                            "lighting",
                            proSettings.lighting
                          )}
                          isOpen={openSections.lighting}
                          onToggle={() => toggleSection("lighting")}
                        >
                          <div className="grid grid-cols-2 gap-2">
                            <button
                              type="button"
                              onClick={() => {
                                setProSettings((prev) => ({
                                  ...prev,
                                  lighting: "auto",
                                }));
                                toggleSection("lighting"); // ✅ AUTO-COLAPSAR
                              }}
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
                                onClick={() => {
                                  setProSettings((prev) => ({
                                    ...prev,
                                    lighting: light.id,
                                  }));
                                  toggleSection("lighting"); // ✅ AUTO-COLAPSAR
                                }}
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
                          description={getSelectedItemName(
                            "colorGrading",
                            proSettings.colorGrading
                          )}
                          isOpen={openSections.colorGrading}
                          onToggle={() => toggleSection("colorGrading")}
                        >
                          <div className="grid grid-cols-2 gap-2">
                            <button
                              type="button"
                              onClick={() => {
                                setProSettings((prev) => ({
                                  ...prev,
                                  colorGrading: "auto",
                                }));
                                toggleSection("colorGrading"); // ✅ AUTO-COLAPSAR
                              }}
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
                                onClick={() => {
                                  setProSettings((prev) => ({
                                    ...prev,
                                    colorGrading: grading.id,
                                  }));
                                  toggleSection("colorGrading"); // ✅ AUTO-COLAPSAR
                                }}
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
                    </div>
                  )}
                </div>
              </div>

              {/* Botón de Generar Prompt */}
              <div className="flex justify-center">
                <button
                  type="submit"
                  disabled={
                    isLoading || (!userPrompt.trim() && !referenceImage)
                  }
                  className={`px-8 py-3 rounded-lg font-medium transition-all flex items-center gap-2 ${
                    isLoading || (!userPrompt.trim() && !referenceImage)
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
                  {isPro && qualityAnalysis && (
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

                    {/* Mensaje de solo PRO/Premium */}
                    {!isPro ? (
                      <div className="mb-6 p-4 bg-red-900/50 border border-red-700 rounded-lg text-center">
                        <Lock className="w-6 h-6 text-red-400 mx-auto mb-2" />
                        <p className="font-medium text-red-300">
                          Función solo para PRO y PREMIUM
                        </p>
                        <p className="text-sm text-red-300/80">
                          Actualiza tu plan para poder generar imágenes.
                        </p>
                      </div>
                    ) : (
                      <>
                        <p className="text-[#C1C1C1] mb-6">
                          Sube una foto selfie para generar la imagen con tu
                          rostro
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
                          <div className="relative mb-6 w-32">
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

                        {/* SECCIÓN DE ASPECT RATIO */}
                        <div className="mb-6">
                          <label className="block text-sm font-medium text-[#C1C1C1] mb-3">
                            Selecciona la relación de aspecto
                          </label>
                          <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                            {VALID_ASPECT_RATIOS.map((ratio) => (
                              <button
                                key={ratio.id}
                                type="button"
                                onClick={() => setSelectedAspectRatio(ratio.id)}
                                className={`p-3 rounded-lg border text-center transition-all text-sm ${
                                  selectedAspectRatio === ratio.id
                                    ? "border-[#D8C780] bg-[#D8C780]/20 text-white"
                                    : "border-[#2D2D2D] bg-[#06060C] text-[#C1C1C1] hover:border-[#D8C780]/50"
                                }`}
                              >
                                <span className="font-medium">{ratio.id}</span>
                                <span className="block text-xs">
                                  {ratio.name}
                                </span>
                              </button>
                            ))}
                          </div>
                        </div>

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
                      </>
                    )}
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
    </div>
  );
}

// ============================================================================
// ✅ ¡¡AQUÍ ESTÁ!! El componente que faltaba
// ============================================================================
function ProSection({ title, description, isOpen, onToggle, children }) {
  return (
    <div className="border border-[#2D2D2D] rounded-lg overflow-hidden">
      <button
        type="button"
        onClick={onToggle}
        className="w-full flex items-center justify-between p-4 bg-[#06060C]/50 hover:bg-[#06060C] transition-colors"
      >
        <div className="text-left">
          <h4 className="text-white font-medium">{title}</h4>
          {/* Muestra la descripción (selección actual) */}
          <p className="text-xs text-[#D8C780] mt-1">{description}</p>
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
}
