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
import AnimatedSection from "./AnimatedSection";
import QualityAnalysis from "./QualityAnalysis";

// ✅ IMPORTAR NUEVO SERVICIO (El cerebro inteligente)
import {
  generateProfessionalPrompt,
  analyzeImage,
} from "../services/geminiService";

// ✅ IMPORTAR DATOS
import Outfits_women from "../data/Outfits_women";
import Outfits_men from "../data/Outfits_men";
import { SHOT_TYPES, CAMERA_ANGLES } from "../data/shotTypesData";
import { ENVIRONMENTS_ARRAY } from "../data/environmentsData";
import { getPosesByGender } from "../data/posesData";
import { LIGHTING_SETUPS } from "../data/lightingData";
import { COLOR_GRADING_FILTERS } from "../data/colorGradingData";

// ============================================================================
// ✨ CARACTERÍSTICAS RÁPIDAS
// ============================================================================
const QUICK_FEATURES = [
  {
    id: "professional-lighting",
    name: "Iluminación Profesional",
    description: "Rembrandt, Butterfly o Loop lighting with professional setup",
    textES: "Iluminación profesional estilo Rembrandt o Butterfly",
  },
  {
    id: "bokeh",
    name: "Fondo Desenfocado",
    description: "Shallow depth of field con 85mm",
    textES: "Fondo desenfocado con efecto bokeh (85mm f/1.8)",
  },
  {
    id: "cinematic",
    name: "Look Cinematográfico",
    description: "Black Pro-Mist effect",
    textES: "Look cinematográfico con filtro Black Pro-Mist",
  },
  {
    id: "golden-hour",
    name: "Golden Hour",
    description: "Luz cálida de atardecer",
    textES: "Luz cálida natural de golden hour",
  },
  {
    id: "smooth-skin",
    name: "Piel Suave y Uniforme",
    description: "Skin tone uniformity",
    textES: "Textura de piel suave y natural",
  },
  {
    id: "teal-orange",
    name: "Teal & Orange",
    description: "Color grading Hollywood",
    textES: "Color grading cinematográfico teal & orange",
  },
];

const GENDER_OPTIONS = [
  { id: "masculine", name: "Masculino" },
  { id: "feminine", name: "Femenino" },
  { id: "couple", name: "Pareja" },
];

export default function AdvancedGenerator() {
  const { user, profile, refreshProfile } = useAuth();
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    if (user !== undefined && profile !== undefined) {
      setIsInitializing(false);
    }
  }, [user, profile]);

  const [prompt, setPrompt] = useState("");
  const [userPrompt, setUserPrompt] = useState("");
  const [response, setResponse] = useState("");

  // Estados imágenes
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [generatedImages, setGeneratedImages] = useState([]);
  const [selectedAspectRatio, setSelectedAspectRatio] = useState("1:1");
  const [selfieImage, setSelfieImage] = useState(null);
  const [selfiePreview, setSelfiePreview] = useState("");

  // Estados proceso
  const [isLoading, setIsLoading] = useState(false);
  const [referenceImage, setReferenceImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [qualityAnalysis, setQualityAnalysis] = useState(null);
  const [copied, setCopied] = useState(false);

  // Estados UI
  const [selectedFeature, setSelectedFeature] = useState(null);
  const [showProTools, setShowProTools] = useState(false);

  // ✨ Estados PRO
  const [proSettings, setProSettings] = useState({
    environment: "auto",
    shotType: "auto",
    cameraAngle: "auto",
    gender: "",
    pose: "auto",
    outfit: "auto",
    lighting: "auto",
    colorGrading: "auto",
  });

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

  useEffect(() => {
    if (isPro && !showProTools) {
      setShowProTools(true);
    }
  }, [isPro]);

  // --------------------------------------------------------------------------
  // MEMOS DE DATOS SEGUROS
  // --------------------------------------------------------------------------
  const safeEnvironments = React.useMemo(
    () => (Array.isArray(ENVIRONMENTS_ARRAY) ? ENVIRONMENTS_ARRAY : []),
    []
  );
  const safeShotTypes = React.useMemo(
    () => (Array.isArray(SHOT_TYPES) ? SHOT_TYPES : []),
    []
  );
  const safeCameraAngles = React.useMemo(
    () => (Array.isArray(CAMERA_ANGLES) ? CAMERA_ANGLES : []),
    []
  );
  const safeLightingSetups = React.useMemo(
    () => (Array.isArray(LIGHTING_SETUPS) ? LIGHTING_SETUPS : []),
    []
  );
  const safeColorGrading = React.useMemo(
    () => (Array.isArray(COLOR_GRADING_FILTERS) ? COLOR_GRADING_FILTERS : []),
    []
  );

  const currentOutfits = (() => {
    if (proSettings.gender === "masculine" || proSettings.gender === "couple")
      return Outfits_men;
    if (proSettings.gender === "feminine") return Outfits_women;
    return [...Outfits_women, ...Outfits_men];
  })();

  const currentPoses = getPosesByGender(proSettings.gender);

  const safeOutfits = React.useMemo(
    () => (Array.isArray(currentOutfits) ? currentOutfits : []),
    [currentOutfits]
  );
  const safePoses = React.useMemo(
    () => (Array.isArray(currentPoses) ? currentPoses : []),
    [currentPoses]
  );

  // --------------------------------------------------------------------------
  // EFECTOS DE UI
  // --------------------------------------------------------------------------
  useEffect(() => {
    if (showProTools) setSelectedFeature(null);
  }, [showProTools]);

  // Actualizar vista previa del prompt
  useEffect(() => {
    let combinedPrompt = userPrompt.trim();

    if (selectedFeature && !showProTools) {
      const feature = QUICK_FEATURES.find((f) => f.id === selectedFeature);
      if (feature) combinedPrompt += `\n\n${feature.textES}`;
    }

    if (showProTools && isPro) {
      const proParams = [];
      if (proSettings.environment && proSettings.environment !== "auto") {
        const env = safeEnvironments.find(
          (e) => e.id === proSettings.environment
        );
        if (env) proParams.push(`Entorno: ${env.name}`);
      }
      if (proSettings.gender) {
        const gender = GENDER_OPTIONS.find((g) => g.id === proSettings.gender);
        if (gender) proParams.push(`Género: ${gender.name}`);
      }
      // ... Se pueden añadir más visualizaciones aquí si se desea

      if (proParams.length > 0) {
        combinedPrompt += "\n\n" + proParams.join(" | ");
      }
    }
    setPrompt(combinedPrompt);
  }, [userPrompt, selectedFeature, showProTools, proSettings, isPro]);

  // --------------------------------------------------------------------------
  // MANEJO DE ARCHIVOS
  // --------------------------------------------------------------------------
  const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleReferenceImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setReferenceImage(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSelfieChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelfieImage(file);
      const reader = new FileReader();
      reader.onloadend = () => setSelfiePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  // --------------------------------------------------------------------------
  // 🚀 FUNCIÓN PRINCIPAL: GENERAR PROMPT (Conectada al nuevo servicio)
  // --------------------------------------------------------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();

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
      let generatedText = "";

      // CASO A: Análisis de imagen (Referencia sin texto, o para extraer info)
      if (referenceImage && !userPrompt.trim()) {
        const base64 = await fileToBase64(referenceImage);
        const mimeType = referenceImage.type;

        // Llamada al servicio de análisis
        const analysisResult = await analyzeImage(base64, mimeType);
        generatedText = analysisResult.prompt;

        // Auto-detectar género si la IA lo devuelve
        if (analysisResult.detectedSubjectType) {
          setProSettings((prev) => ({
            ...prev,
            gender: analysisResult.detectedSubjectType,
          }));
        }
      } else {
        // CASO B: Generación normal con parámetros
        const options = {
          simpleIdea: userPrompt,
          gender: proSettings.gender || "masculine",
          shotType: proSettings.shotType,
          cameraAngle: proSettings.cameraAngle,
          outfitId: proSettings.outfit,
          poseId: proSettings.pose,
          environmentId: proSettings.environment,
          lightingId: proSettings.lighting,
          colorGradingId: proSettings.colorGrading,
        };

        // Llamada al servicio de generación
        generatedText = await generateProfessionalPrompt(options);
      }

      setResponse(generatedText);

      // Descontar crédito (opcional, depende de tu lógica de negocio)
      // await refreshProfile();
    } catch (error) {
      console.error("Error:", error);
      alert(error.message || "Error al generar el prompt");
    } finally {
      setIsLoading(false);
    }
  };

  // --------------------------------------------------------------------------
  // GENERAR IMAGEN (Nano Banana) - Mantiene endpoint original de imagen
  // --------------------------------------------------------------------------
  const handleGenerateImage = async () => {
    if (!response) return alert("Primero debes generar un prompt");
    if (!profile || profile.credits < 1)
      return alert("No tienes suficientes créditos.");
    if (!selfieImage) return alert("Debes subir una foto selfie.");

    setIsGeneratingImage(true);
    setGeneratedImages([]);

    try {
      const formData = new FormData();
      formData.append("prompt", response);
      formData.append("aspectRatio", selectedAspectRatio);
      formData.append("userId", user.id);
      formData.append("selfieImage", selfieImage);

      const res = await fetch("/api/generate-image", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Error al generar imagen");
      }

      const data = await res.json();
      if (data.images?.length > 0) {
        setGeneratedImages(data.images);
      } else {
        throw new Error("No se generaron imágenes");
      }

      await refreshProfile();
    } catch (error) {
      console.error("Error generando imagen:", error);
      alert(error.message);
    } finally {
      setIsGeneratingImage(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(response);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Helper para secciones
  const toggleSection = (section) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {isInitializing ? (
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="w-12 h-12 animate-spin text-[#D8C780]" />
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
              Crea prompts profesionales optimizados. Generación de prompt:
              GRATIS/1 Crédito (según plan). Generación de imagen: 1 crédito.
            </p>
            {profile && (
              <div className="mt-4 inline-block px-4 py-2 bg-[#D8C780]/20 border border-[#D8C780] rounded-lg">
                <span className="text-[#D8C780] font-medium">
                  Créditos: {profile.credits || 0}
                </span>
              </div>
            )}
          </div>

          {/* Formulario */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* COLUMNA IZQUIERDA */}
              <div className="space-y-6">
                {/* Textarea */}
                <div>
                  <label className="block text-sm font-medium text-[#C1C1C1] mb-2">
                    Describe tu idea
                  </label>
                  <textarea
                    value={userPrompt}
                    onChange={(e) => setUserPrompt(e.target.value)}
                    placeholder="Ej: Retrato profesional en estudio con fondo negro..."
                    className="w-full h-40 bg-[#06060C]/50 text-white rounded-lg p-4 border border-[#2D2D2D] focus:border-[#D8C780] focus:outline-none resize-none"
                  />
                </div>

                {/* Imagen Referencia */}
                <div>
                  <label className="block text-sm font-medium text-[#C1C1C1] mb-2">
                    Imagen de referencia (Para extraer estilo/prompt)
                  </label>
                  {!imagePreview ? (
                    <label className="cursor-pointer block">
                      <div className="flex items-center gap-3 p-4 bg-[#06060C]/50 border border-[#2D2D2D] hover:border-[#D8C780] rounded-lg transition-colors">
                        <Camera className="w-6 h-6 text-[#D8C780]" />
                        <div className="text-white font-medium">
                          Adjuntar referencia
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
                        alt="Ref"
                        className="w-full h-48 object-cover rounded-lg border border-[#2D2D2D]"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setReferenceImage(null);
                          setImagePreview("");
                        }}
                        className="absolute top-2 right-2 p-2 bg-red-500 rounded-lg"
                      >
                        <Trash2 className="w-4 h-4 text-white" />
                      </button>
                    </div>
                  )}
                </div>

                {/* Características Rápidas (Solo visuales si no es PRO tools) */}
                {!showProTools && (
                  <div>
                    <label className="block text-sm font-medium text-[#C1C1C1] mb-2">
                      Atajos rápidos
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {QUICK_FEATURES.map((f) => (
                        <button
                          key={f.id}
                          type="button"
                          onClick={() =>
                            setSelectedFeature(
                              selectedFeature === f.id ? null : f.id
                            )
                          }
                          className={`p-2 text-xs rounded border ${
                            selectedFeature === f.id
                              ? "border-[#D8C780] bg-[#D8C780]/20"
                              : "border-[#2D2D2D]"
                          }`}
                        >
                          {f.name}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* COLUMNA DERECHA: Herramientas PRO */}
              <div>
                {!isPro ? (
                  <div className="p-6 bg-[#D8C780]/5 border border-[#D8C780]/30 rounded-lg text-center">
                    <Crown className="w-12 h-12 text-[#D8C780] mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-white mb-2">
                      Herramientas PRO
                    </h3>
                    <p className="text-[#C1C1C1] text-sm mb-4">
                      Desbloquea control total sobre luz, cámara, poses y
                      vestuario.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-medium text-white">
                        Controles PRO
                      </h3>
                      <button
                        type="button"
                        onClick={() => setShowProTools(!showProTools)}
                        className="text-xs border border-[#2D2D2D] px-3 py-1 rounded"
                      >
                        {showProTools ? "Ocultar" : "Mostrar"}
                      </button>
                    </div>

                    {showProTools && (
                      <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
                        {/* Género */}
                        <ProSection
                          title="Género"
                          description="Define estética general"
                          isOpen={openSections.gender}
                          onToggle={() => toggleSection("gender")}
                        >
                          <div className="grid grid-cols-3 gap-2">
                            {GENDER_OPTIONS.map((opt) => (
                              <button
                                key={opt.id}
                                type="button"
                                onClick={() =>
                                  setProSettings((p) => ({
                                    ...p,
                                    gender: opt.id,
                                  }))
                                }
                                className={`p-2 rounded border text-sm ${
                                  proSettings.gender === opt.id
                                    ? "border-[#D8C780] bg-[#D8C780]/20"
                                    : "border-[#2D2D2D]"
                                }`}
                              >
                                {opt.name}
                              </button>
                            ))}
                          </div>
                        </ProSection>

                        {/* Entorno */}
                        <ProSection
                          title="Entorno"
                          description="Ubicación de la foto"
                          isOpen={openSections.environment}
                          onToggle={() => toggleSection("environment")}
                        >
                          <div className="grid grid-cols-2 gap-2">
                            <button
                              type="button"
                              onClick={() =>
                                setProSettings((p) => ({
                                  ...p,
                                  environment: "auto",
                                }))
                              }
                              className={`p-2 rounded border text-sm ${
                                proSettings.environment === "auto"
                                  ? "border-[#D8C780]"
                                  : "border-[#2D2D2D]"
                              }`}
                            >
                              Automático
                            </button>
                            {safeEnvironments.map((env) => (
                              <button
                                key={env.id}
                                type="button"
                                onClick={() =>
                                  setProSettings((p) => ({
                                    ...p,
                                    environment: env.id,
                                  }))
                                }
                                className={`p-2 rounded border text-sm text-left ${
                                  proSettings.environment === env.id
                                    ? "border-[#D8C780]"
                                    : "border-[#2D2D2D]"
                                }`}
                              >
                                {env.name}
                              </button>
                            ))}
                          </div>
                        </ProSection>

                        {/* Shot Type */}
                        <ProSection
                          title="Plano"
                          description="Encuadre"
                          isOpen={openSections.shotType}
                          onToggle={() => toggleSection("shotType")}
                        >
                          <div className="grid grid-cols-2 gap-2">
                            <button
                              type="button"
                              onClick={() =>
                                setProSettings((p) => ({
                                  ...p,
                                  shotType: "auto",
                                }))
                              }
                              className={`p-2 rounded border text-sm ${
                                proSettings.shotType === "auto"
                                  ? "border-[#D8C780]"
                                  : "border-[#2D2D2D]"
                              }`}
                            >
                              Automático
                            </button>
                            {safeShotTypes.map((s) => (
                              <button
                                key={s.id}
                                type="button"
                                onClick={() =>
                                  setProSettings((p) => ({
                                    ...p,
                                    shotType: s.id,
                                  }))
                                }
                                className={`p-2 rounded border text-sm text-left ${
                                  proSettings.shotType === s.id
                                    ? "border-[#D8C780]"
                                    : "border-[#2D2D2D]"
                                }`}
                              >
                                {s.nameES}
                              </button>
                            ))}
                          </div>
                        </ProSection>

                        {/* Iluminación */}
                        <ProSection
                          title="Iluminación"
                          description="Esquema de luz"
                          isOpen={openSections.lighting}
                          onToggle={() => toggleSection("lighting")}
                        >
                          <div className="grid grid-cols-2 gap-2">
                            <button
                              type="button"
                              onClick={() =>
                                setProSettings((p) => ({
                                  ...p,
                                  lighting: "auto",
                                }))
                              }
                              className={`p-2 rounded border text-sm ${
                                proSettings.lighting === "auto"
                                  ? "border-[#D8C780]"
                                  : "border-[#2D2D2D]"
                              }`}
                            >
                              Automático
                            </button>
                            {safeLightingSetups.map((l) => (
                              <button
                                key={l.id}
                                type="button"
                                onClick={() =>
                                  setProSettings((p) => ({
                                    ...p,
                                    lighting: l.id,
                                  }))
                                }
                                className={`p-2 rounded border text-sm text-left ${
                                  proSettings.lighting === l.id
                                    ? "border-[#D8C780]"
                                    : "border-[#2D2D2D]"
                                }`}
                              >
                                {l.name}
                              </button>
                            ))}
                          </div>
                        </ProSection>

                        {/* Color Grading */}
                        <ProSection
                          title="Color"
                          description="Estilo visual"
                          isOpen={openSections.colorGrading}
                          onToggle={() => toggleSection("colorGrading")}
                        >
                          <div className="grid grid-cols-2 gap-2">
                            <button
                              type="button"
                              onClick={() =>
                                setProSettings((p) => ({
                                  ...p,
                                  colorGrading: "auto",
                                }))
                              }
                              className={`p-2 rounded border text-sm ${
                                proSettings.colorGrading === "auto"
                                  ? "border-[#D8C780]"
                                  : "border-[#2D2D2D]"
                              }`}
                            >
                              Automático
                            </button>
                            {safeColorGrading.map((c) => (
                              <button
                                key={c.id}
                                type="button"
                                onClick={() =>
                                  setProSettings((p) => ({
                                    ...p,
                                    colorGrading: c.id,
                                  }))
                                }
                                className={`p-2 rounded border text-sm text-left ${
                                  proSettings.colorGrading === c.id
                                    ? "border-[#D8C780]"
                                    : "border-[#2D2D2D]"
                                }`}
                              >
                                {c.name}
                              </button>
                            ))}
                          </div>
                        </ProSection>

                        {/* Outfit (Si hay género) */}
                        {proSettings.gender && (
                          <ProSection
                            title="Outfit"
                            description="Vestuario"
                            isOpen={openSections.outfit}
                            onToggle={() => toggleSection("outfit")}
                          >
                            <div className="grid grid-cols-2 gap-2">
                              <button
                                type="button"
                                onClick={() =>
                                  setProSettings((p) => ({
                                    ...p,
                                    outfit: "auto",
                                  }))
                                }
                                className={`p-2 rounded border text-sm ${
                                  proSettings.outfit === "auto"
                                    ? "border-[#D8C780]"
                                    : "border-[#2D2D2D]"
                                }`}
                              >
                                Automático
                              </button>
                              {safeOutfits.map((o) => (
                                <button
                                  key={o.id}
                                  type="button"
                                  onClick={() =>
                                    setProSettings((p) => ({
                                      ...p,
                                      outfit: o.id,
                                    }))
                                  }
                                  className={`p-2 rounded border text-sm text-left ${
                                    proSettings.outfit === o.id
                                      ? "border-[#D8C780]"
                                      : "border-[#2D2D2D]"
                                  }`}
                                >
                                  {o.name}
                                </button>
                              ))}
                            </div>
                          </ProSection>
                        )}

                        {/* Poses (Si hay género) */}
                        {proSettings.gender && (
                          <ProSection
                            title="Poses"
                            description="Posición del sujeto"
                            isOpen={openSections.pose}
                            onToggle={() => toggleSection("pose")}
                          >
                            <div className="grid grid-cols-2 gap-2">
                              <button
                                type="button"
                                onClick={() =>
                                  setProSettings((p) => ({
                                    ...p,
                                    pose: "auto",
                                  }))
                                }
                                className={`p-2 rounded border text-sm ${
                                  proSettings.pose === "auto"
                                    ? "border-[#D8C780]"
                                    : "border-[#2D2D2D]"
                                }`}
                              >
                                Automático
                              </button>
                              {safePoses.map((pose) => (
                                <button
                                  key={pose.id}
                                  type="button"
                                  onClick={() =>
                                    setProSettings((p) => ({
                                      ...p,
                                      pose: pose.id,
                                    }))
                                  }
                                  className={`p-2 rounded border text-sm text-left ${
                                    proSettings.pose === pose.id
                                      ? "border-[#D8C780]"
                                      : "border-[#2D2D2D]"
                                  }`}
                                >
                                  {pose.name}
                                </button>
                              ))}
                            </div>
                          </ProSection>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Botón Generar Prompt */}
            <button
              type="submit"
              disabled={isLoading || (!userPrompt.trim() && !referenceImage)}
              className="w-full py-4 bg-gradient-to-r from-[#D8C780] to-[#C4B66D] hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl font-bold text-black transition-all flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" /> Generando
                  Prompt...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" /> Generar Prompt Profesional
                </>
              )}
            </button>
          </form>

          {/* RESULTADOS */}
          {response && (
            <div className="mt-8 space-y-6">
              {/* Bloque de Texto Prompt */}
              <div className="bg-[#2D2D2D] rounded-xl p-6 border border-[#2D2D2D]">
                <div className="flex justify-between mb-4">
                  <h3 className="text-lg font-medium text-white">
                    Prompt Generado
                  </h3>
                  <button
                    onClick={handleCopy}
                    className="flex items-center gap-2 px-3 py-1 bg-[#D8C780] text-black rounded text-sm font-bold"
                  >
                    {copied ? (
                      <Check className="w-4 h-4" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}{" "}
                    {copied ? "Copiado" : "Copiar"}
                  </button>
                </div>
                <div className="bg-[#06060C]/50 rounded-lg p-4 text-[#C1C1C1] whitespace-pre-wrap max-h-[300px] overflow-y-auto">
                  {response}
                </div>
              </div>

              {/* Bloque Generar Imagen */}
              <div className="bg-[#2D2D2D] rounded-xl p-6 border border-[#D8C780]/30">
                <h3 className="text-xl font-medium text-white mb-2">
                  Generar Imagen Final 🍌
                </h3>
                <p className="text-[#C1C1C1] text-sm mb-6">
                  Sube tu selfie para aplicar tu cara al prompt generado.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-[#C1C1C1] mb-2">
                      Tu Selfie
                    </label>
                    {!selfiePreview ? (
                      <label className="cursor-pointer block p-4 border-2 border-dashed border-[#D8C780] rounded-lg text-center hover:bg-[#D8C780]/10">
                        <User className="w-8 h-8 text-[#D8C780] mx-auto mb-2" />
                        <span className="text-[#D8C780]">Subir Selfie</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleSelfieChange}
                          className="hidden"
                        />
                      </label>
                    ) : (
                      <div className="relative h-48">
                        <img
                          src={selfiePreview}
                          className="w-full h-full object-contain rounded border border-[#D8C780]"
                          alt="Selfie"
                        />
                        <button
                          onClick={() => {
                            setSelfieImage(null);
                            setSelfiePreview("");
                          }}
                          className="absolute top-2 right-2 bg-red-500 p-1 rounded text-white"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col justify-end">
                    <div className="mb-4">
                      <label className="block text-sm text-[#C1C1C1] mb-2">
                        Formato
                      </label>
                      <div className="flex gap-2">
                        {["1:1", "3:4", "16:9"].map((r) => (
                          <button
                            key={r}
                            onClick={() => setSelectedAspectRatio(r)}
                            className={`px-3 py-1 rounded border text-sm ${
                              selectedAspectRatio === r
                                ? "bg-[#D8C780] text-black border-[#D8C780]"
                                : "border-[#2D2D2D] text-gray-400"
                            }`}
                          >
                            {r}
                          </button>
                        ))}
                      </div>
                    </div>
                    <button
                      onClick={handleGenerateImage}
                      disabled={isGeneratingImage || !selfieImage}
                      className="w-full py-3 bg-[#D8C780] hover:bg-[#C4B66D] disabled:bg-gray-700 disabled:text-gray-500 rounded-lg font-bold text-black flex justify-center gap-2"
                    >
                      {isGeneratingImage ? (
                        <Loader2 className="animate-spin" />
                      ) : (
                        <ImageIcon />
                      )}{" "}
                      Generar Imagen (1 Crédito)
                    </button>
                  </div>
                </div>

                {/* Galería Resultados */}
                {generatedImages.length > 0 && (
                  <div className="mt-6 grid gap-4">
                    {generatedImages.map((img, idx) => (
                      <div key={idx} className="relative group">
                        <img
                          src={`data:${img.mimeType};base64,${img.base64}`}
                          className="w-full rounded-lg border border-[#2D2D2D]"
                          alt="Result"
                        />
                        <a
                          href={`data:${img.mimeType};base64,${img.base64}`}
                          download={`generated-${idx}.jpg`}
                          className="absolute bottom-4 right-4 bg-[#D8C780] text-black px-4 py-2 rounded font-bold opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          Descargar
                        </a>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </AnimatedSection>
      )}
    </div>
  );
}

// Helper simple para secciones
function ProSection({ title, description, isOpen, onToggle, children }) {
  return (
    <div className="border border-[#2D2D2D] rounded-lg overflow-hidden">
      <button
        type="button"
        onClick={onToggle}
        className="w-full flex items-center justify-between p-3 bg-[#06060C]/50 hover:bg-[#06060C] transition-colors"
      >
        <div className="text-left">
          <div className="font-medium text-white text-sm">{title}</div>
          <div className="text-xs text-[#C1C1C1]">{description}</div>
        </div>
        {isOpen ? (
          <ChevronUp className="w-4 h-4" />
        ) : (
          <ChevronDown className="w-4 h-4" />
        )}
      </button>
      {isOpen && <div className="p-3 bg-black/20">{children}</div>}
    </div>
  );
}
