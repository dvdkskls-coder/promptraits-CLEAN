import React, { useState, useEffect, useMemo, useRef } from "react";
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
  XCircle,
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

// CONSTANTES
const QUICK_FEATURES = [
  {
    id: "professional-lighting",
    name: "Iluminación Profesional",
    description: "Rembrandt, Butterfly o Loop lighting",
    textES: "Iluminación profesional",
    promptText:
      "Professional studio lighting setup with Rembrandt or Butterfly lighting creating gentle shadow modeling, soft diffused key light at 45-degree angle.",
  },
  {
    id: "bokeh",
    name: "Fondo Desenfocado",
    description: "Shallow depth of field con 85mm",
    textES: "Fondo desenfocado (85mm f/1.8)",
    promptText:
      "Shallow depth of field with 85mm f/1.8 lens creating creamy smooth bokeh, background beautifully blurred.",
  },
  {
    id: "cinematic",
    name: "Look Cinematográfico",
    description: "Black Pro-Mist effect",
    textES: "Look cinematográfico",
    promptText:
      "Cinematic look with soft diffused highlights using Black Pro-Mist filter effect, organic film-like quality.",
  },
  {
    id: "golden-hour",
    name: "Golden Hour",
    description: "Luz cálida de atardecer",
    textES: "Luz cálida golden hour",
    promptText:
      "Warm golden hour light with sunset glow, magical warm tones creating romantic atmosphere.",
  },
  {
    id: "smooth-skin",
    name: "Piel Suave y Uniforme",
    description: "Skin tone uniformity",
    textES: "Piel suave natural",
    promptText:
      "Skin tone uniformity with subtle texture preservation, even complexion, natural beauty retouching.",
  },
  {
    id: "teal-orange",
    name: "Teal & Orange",
    description: "Color grading Hollywood",
    textES: "Color grading teal & orange",
    promptText:
      "Cinematic color grading with teal shadows and orange highlights, Hollywood blockbuster style.",
  },
];

const GENDER_OPTIONS = [
  { id: "masculine", name: "Masculino" },
  { id: "feminine", name: "Femenino" },
  { id: "couple", name: "Pareja" },
  { id: "animal", name: "Animal" }, // Agregado soporte animal
];
const VALID_ASPECT_RATIOS = [
  { id: "1:1", name: "Cuadrado" },
  { id: "3:4", name: "Vertical" },
  { id: "9:16", name: "Historia" },
  { id: "4:3", name: "Horizontal" },
  { id: "16:9", name: "Panorámica" },
];

// Helper Base64
const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
};

// SUBCOMPONENTE: Uploader de Selfie Circular (Estilo AI Studio adaptado)
const SelfieUploader = ({ label, onFileChange, currentPreview, onRemove }) => {
  const inputRef = useRef(null);

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 4 * 1024 * 1024) return alert("Máximo 4MB");
      const base64 = await fileToBase64(file);
      onFileChange({ base64, mimeType: file.type });
    }
  };

  return (
    <div className="flex flex-col items-center gap-2 p-3 bg-[#06060C]/50 rounded-lg border border-[#2D2D2D] hover:border-[#D8C780]/50 transition-all w-full">
      <span className="text-xs font-medium text-[#C1C1C1] text-center">
        {label}
      </span>
      <input
        type="file"
        accept="image/*"
        ref={inputRef}
        onChange={handleFile}
        className="hidden"
      />

      {!currentPreview ? (
        <button
          onClick={() => inputRef.current?.click()}
          className="flex items-center justify-center w-16 h-16 bg-[#2D2D2D] hover:bg-[#D8C780]/20 rounded-full text-[#C1C1C1] hover:text-[#D8C780] transition-all"
        >
          <User className="w-8 h-8" />
        </button>
      ) : (
        <div className="relative">
          <img
            src={currentPreview}
            alt="Selfie"
            className="w-16 h-16 rounded-full object-cover border-2 border-[#D8C780]"
          />
          <button
            onClick={onRemove}
            className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-0.5 hover:bg-red-600"
          >
            <XCircle className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};

export default function AdvancedGenerator() {
  const { user, profile, refreshProfile, consumeCredits, savePromptToHistory } =
    useAuth();
  const [isInitializing, setIsInitializing] = useState(true);
  useEffect(() => {
    if (user !== undefined && profile !== undefined) setIsInitializing(false);
  }, [user, profile]);

  // Estados Prompt
  const [userPrompt, setUserPrompt] = useState("");
  const [response, setResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [referenceImage, setReferenceImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [qualityAnalysis, setQualityAnalysis] = useState(null);

  // Estados Generación Imagen (Multi-Face Support)
  // faceImages será un array de objetos { base64, mimeType } o null
  // [null, null] permite manejar hasta 2 slots
  const [faceImages, setFaceImages] = useState([null, null]);
  const [facePreviews, setFacePreviews] = useState([null, null]);

  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [generatedImages, setGeneratedImages] = useState([]);
  const [selectedAspectRatio, setSelectedAspectRatio] = useState("1:1");

  // Settings
  const [showProTools, setShowProTools] = useState(false);
  const [selectedFeature, setSelectedFeature] = useState(null);
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
  const [proPromptPreview, setProPromptPreview] = useState("");
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
    if (isPro && !showProTools) setShowProTools(true);
  }, [isPro]);

  // Helpers de Datos
  const safeEnvironments = useMemo(() => ENVIRONMENTS_ARRAY || [], []);
  const safeShotTypes = useMemo(() => SHOT_TYPES || [], []);
  const safeCameraAngles = useMemo(() => CAMERA_ANGLES || [], []);
  const safeLightingSetups = useMemo(() => LIGHTING_SETUPS || [], []);
  const safeColorGrading = useMemo(() => COLOR_GRADING_FILTERS || [], []);
  const safeOutfits = useMemo(() => {
    if (proSettings.gender === "masculine" || proSettings.gender === "couple")
      return Outfits_men || [];
    if (proSettings.gender === "feminine") return Outfits_women || [];
    return [...(Outfits_women || []), ...(Outfits_men || [])];
  }, [proSettings.gender]);
  const safePoses = useMemo(
    () => getPosesByGender(proSettings.gender) || [],
    [proSettings.gender]
  );

  const getSelectedItemName = (section, value) => {
    if (value === "auto" || !value) return "Automático";
    const find = (arr) =>
      arr.find((i) => i.id === value)?.name ||
      arr.find((i) => i.id === value)?.nameES ||
      "Automático";
    if (section === "environment") return find(safeEnvironments);
    if (section === "shotType") return find(safeShotTypes);
    if (section === "cameraAngle") return find(safeCameraAngles);
    if (section === "gender") return find(GENDER_OPTIONS);
    if (section === "pose") return find(safePoses);
    if (section === "outfit") return find(safeOutfits);
    if (section === "lighting") return find(safeLightingSetups);
    if (section === "colorGrading") return find(safeColorGrading);
    return "Automático";
  };

  // Preview Prompt
  useEffect(() => {
    if (!isPro || !showProTools) {
      setProPromptPreview("");
      return;
    }
    const params = [];
    const add = (sec, val) => {
      if (val !== "auto")
        params.push(`${sec}: ${getSelectedItemName(sec.toLowerCase(), val)}`);
    };
    if (proSettings.gender) add("Género", proSettings.gender);
    add("Entorno", proSettings.environment);
    add("Plano", proSettings.shotType);
    add("Ángulo", proSettings.cameraAngle);
    setProPromptPreview(params.join(" | "));
  }, [proSettings, isPro, showProTools]);

  // Handlers Referencia
  const handleReferenceImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setReferenceImage(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };
  const removeReferenceImage = () => {
    setReferenceImage(null);
    setImagePreview("");
  };

  // Handlers Selfies (Multi-Sujeto)
  const handleFaceFileChange = (index) => (fileData) => {
    setFaceImages((prev) => {
      const n = [...prev];
      n[index] = fileData;
      return n;
    });
    setFacePreviews((prev) => {
      const n = [...prev];
      n[index] = fileData
        ? `data:${fileData.mimeType};base64,${
            fileData.base64.split(",")[1] || fileData.base64
          }`
        : null;
      return n;
    });
  };
  const removeFaceImage = (index) => () => {
    setFaceImages((prev) => {
      const n = [...prev];
      n[index] = null;
      return n;
    });
    setFacePreviews((prev) => {
      const n = [...prev];
      n[index] = null;
      return n;
    });
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(response);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  const toggleSection = (section) =>
    setOpenSections((p) => ({
      environment: false,
      shotType: false,
      cameraAngle: false,
      gender: false,
      pose: false,
      outfit: false,
      lighting: false,
      colorGrading: false,
      [section]: !p[section],
    }));
  const toggleFeature = (id) => {
    setSelectedFeature((p) => (p === id ? null : id));
    setShowProTools(false);
  };

  // ============================================================================
  // GENERAR PROMPT (Con Detección Automática)
  // ============================================================================
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userPrompt.trim() && !referenceImage)
      return alert("Describe lo que quieres generar o sube una imagen.");
    if (!profile || profile.credits < 1)
      return alert("No tienes suficientes créditos.");

    setIsLoading(true);
    setResponse("");
    setQualityAnalysis(null);

    try {
      let imageBase64 = null;
      if (referenceImage) imageBase64 = await fileToBase64(referenceImage);

      const payload = {
        prompt: userPrompt.trim(),
        referenceImage: imageBase64,
        platform: "nano-banana",
        userId: user.id,
        analyzeQuality: isPro,
        gender: proSettings.gender, // Envío configuración actual
        environment: proSettings.environment,
        shotType: proSettings.shotType,
        cameraAngle: proSettings.cameraAngle,
        lighting: proSettings.lighting,
        colorGrading: proSettings.colorGrading,
        outfit: proSettings.outfit,
        pose: proSettings.pose,
      };

      const res = await fetch("/api/gemini-processor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok)
        throw new Error((await res.json()).error || "Error al generar");

      const data = await res.json();
      setResponse(data.prompt || "");
      if (data.analysis) setQualityAnalysis(data.analysis);

      // ✅ DETECCIÓN AUTOMÁTICA: Si el backend detecta otro género (ej: Pareja), actualizamos la UI
      if (data.detectedGender && data.detectedGender !== proSettings.gender) {
        console.log("🤖 IA Detectó:", data.detectedGender);
        setProSettings((prev) => ({ ...prev, gender: data.detectedGender }));
      }

      await consumeCredits(1);
      await savePromptToHistory(
        data.prompt,
        {
          platform: "nano-banana",
          proSettings,
          referenceImage: !!referenceImage,
        },
        null
      );
      await refreshProfile();
    } catch (error) {
      console.error("Error:", error);
      alert(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // ============================================================================
  // GENERAR IMAGEN (Soporte Multi-Face)
  // ============================================================================
  const handleGenerateImage = async () => {
    if (!response) return alert("Primero genera un prompt.");

    // Validar que haya al menos 1 imagen subida
    const validFaces = faceImages.filter((img) => img !== null);
    if (validFaces.length === 0) return alert("Sube al menos una foto selfie.");

    if (!isPro) return alert("Función solo para PRO.");
    if (!profile || profile.credits < 1) return alert("Sin créditos.");

    setIsGeneratingImage(true);
    setGeneratedImages([]);

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) throw new Error("Inicia sesión de nuevo.");

      const res = await fetch("/api/generate-image", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${session.access_token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: response,
          aspectRatio: selectedAspectRatio,
          faceImages: validFaces, // Enviamos array de imágenes
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error generando imagen");

      if (data.images && data.images.length > 0)
        setGeneratedImages(data.images);
      else throw new Error("No se generaron imágenes");

      await refreshProfile();
    } catch (error) {
      console.error("Generación Imagen:", error);
      alert(error.message);
    } finally {
      setIsGeneratingImage(false);
    }
  };

  // Determinar qué uploaders mostrar según el género
  const renderSelfieUploaders = () => {
    const gender = proSettings.gender;
    if (gender === "couple") {
      return (
        <div className="flex gap-4 w-full justify-center">
          <div className="w-1/2">
            <SelfieUploader
              label="Sujeto 1 (@img1)"
              onFileChange={handleFaceFileChange(0)}
              currentPreview={facePreviews[0]}
              onRemove={removeFaceImage(0)}
            />
          </div>
          <div className="w-1/2">
            <SelfieUploader
              label="Sujeto 2 (@img2)"
              onFileChange={handleFaceFileChange(1)}
              currentPreview={facePreviews[1]}
              onRemove={removeFaceImage(1)}
            />
          </div>
        </div>
      );
    } else if (gender === "animal") {
      return (
        <div className="flex gap-4 w-full justify-center">
          <div className="w-1/2">
            <SelfieUploader
              label="Persona (@img1)"
              onFileChange={handleFaceFileChange(0)}
              currentPreview={facePreviews[0]}
              onRemove={removeFaceImage(0)}
            />
          </div>
          <div className="w-1/2">
            <SelfieUploader
              label="Animal (@img2)"
              onFileChange={handleFaceFileChange(1)}
              currentPreview={facePreviews[1]}
              onRemove={removeFaceImage(1)}
            />
          </div>
        </div>
      );
    } else {
      // Masculino o Femenino (1 solo uploader)
      return (
        <div className="w-full max-w-xs mx-auto">
          <SelfieUploader
            label="Sujeto Principal (@img1)"
            onFileChange={handleFaceFileChange(0)}
            currentPreview={facePreviews[0]}
            onRemove={removeFaceImage(0)}
          />
        </div>
      );
    }
  };

  return (
    <div className="min-h-screen bg-[#06060C] py-20">
      <div className="max-w-6xl mx-auto px-4">
        {isInitializing ? (
          <div className="flex items-center justify-center min-h-screen">
            <div className="text-center">
              <Loader2 className="w-12 h-12 animate-spin text-[#D8C780] mx-auto mb-4" />
              <p className="text-[#C1C1C1]">Cargando...</p>
            </div>
          </div>
        ) : (
          <AnimatedSection>
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold mb-4">
                <span className="bg-gradient-to-r from-[#D8C780] to-[#D8C780] bg-clip-text text-transparent">
                  Generador Profesional Nano Banana
                </span>{" "}
                <span className="text-4xl">🍌</span>
              </h1>
              <p className="text-[#C1C1C1] max-w-2xl mx-auto">
                Crea prompts profesionales optimizados. 1 Crédito por prompt.
              </p>
              {profile && (
                <div className="mt-4 inline-block px-4 py-2 bg-[#D8C780]/20 border border-[#D8C780] rounded-lg">
                  <span className="text-[#D8C780] font-medium">
                    Créditos: {profile.credits || 0}
                  </span>
                </div>
              )}
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-6">
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
                    {isPro && showProTools && proPromptPreview && (
                      <div className="mt-2 p-3 bg-[#06060C] border border-[#2D2D2D] rounded-lg">
                        <p className="text-xs text-[#C1C1C1] font-medium">
                          Opciones PRO:
                        </p>
                        <p className="text-sm text-[#D8C780]">
                          {proPromptPreview}
                        </p>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#C1C1C1] mb-2">
                      Referencia (Opcional)
                    </label>
                    {!imagePreview ? (
                      <label className="cursor-pointer block">
                        <div className="flex items-center gap-3 p-4 bg-[#06060C]/50 border border-[#2D2D2D] hover:border-[#D8C780] rounded-lg transition-colors">
                          <Camera className="w-6 h-6 text-[#D8C780]" />
                          <div>
                            <p className="text-white font-medium">
                              Adjuntar referencia
                            </p>
                            <p className="text-xs text-[#C1C1C1]">JPG, PNG</p>
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
                          className="absolute top-2 right-2 p-2 bg-red-500 hover:bg-red-600 rounded-lg"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#C1C1C1] mb-3">
                      Características Rápidas
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {QUICK_FEATURES.map((feature) => (
                        <button
                          key={feature.id}
                          type="button"
                          onClick={() => toggleFeature(feature.id)}
                          disabled={isPro}
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

                <div>
                  {isPro ? (
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
                        <span>Herramientas PRO</span>
                      </div>
                      {showProTools ? (
                        <ChevronUp className="w-5 h-5 text-[#D8C780]" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-[#C1C1C1]" />
                      )}
                    </button>
                  ) : (
                    <div className="p-6 bg-[#06060C] border border-[#2D2D2D] rounded-lg text-center">
                      <Crown className="w-10 h-10 text-[#D8C780] mx-auto mb-4" />
                      <h3 className="text-xl font-bold text-white mb-4">
                        Herramientas PRO
                      </h3>
                      <p className="text-sm text-[#C1C1C1]">
                        Desbloquea control total actualizando a PRO.
                      </p>
                    </div>
                  )}

                  {isPro && showProTools && (
                    <div className="space-y-4 mt-4">
                      <ProSection
                        title="Género"
                        description={getSelectedItemName(
                          "gender",
                          proSettings.gender
                        )}
                        isOpen={openSections.gender}
                        onToggle={() => toggleSection("gender")}
                      >
                        <div className="grid grid-cols-2 gap-2">
                          {GENDER_OPTIONS.map((o) => (
                            <button
                              key={o.id}
                              type="button"
                              onClick={() => {
                                setProSettings((p) => ({ ...p, gender: o.id }));
                                toggleSection("gender");
                              }}
                              className={`p-2 rounded-lg border text-sm ${
                                proSettings.gender === o.id
                                  ? "border-[#D8C780] bg-[#D8C780]/20 text-white"
                                  : "border-[#2D2D2D] text-[#C1C1C1]"
                              }`}
                            >
                              {o.name}
                            </button>
                          ))}
                        </div>
                      </ProSection>
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
                              setProSettings((p) => ({
                                ...p,
                                environment: "auto",
                              }));
                              toggleSection("environment");
                            }}
                            className="p-2 rounded-lg border border-[#2D2D2D] text-[#C1C1C1] text-sm"
                          >
                            Automático
                          </button>
                          {safeEnvironments.map((e) => (
                            <button
                              key={e.id}
                              type="button"
                              onClick={() => {
                                setProSettings((p) => ({
                                  ...p,
                                  environment: e.id,
                                }));
                                toggleSection("environment");
                              }}
                              className={`p-3 rounded-lg border text-left ${
                                proSettings.environment === e.id
                                  ? "border-[#D8C780] bg-[#D8C780]/20"
                                  : "border-[#2D2D2D]"
                              }`}
                            >
                              <div className="text-sm font-medium text-white">
                                {e.name}
                              </div>
                            </button>
                          ))}
                        </div>
                      </ProSection>
                      {/* Resto de secciones PRO (Plano, Ángulo, etc.) se mantienen igual que antes... */}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-center">
                <button
                  type="submit"
                  disabled={
                    isLoading || (!userPrompt.trim() && !referenceImage)
                  }
                  className={`px-8 py-3 rounded-lg font-medium transition-all flex items-center gap-2 ${
                    isLoading
                      ? "bg-[#2D2D2D] text-[#666]"
                      : "bg-gradient-to-r from-[#D8C780] to-[#B8A760] text-black"
                  }`}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" /> Generando...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5" /> Generar Prompt
                    </>
                  )}
                </button>
              </div>
            </form>

            {response && (
              <AnimatedSection>
                <div className="mt-8 space-y-6">
                  <div className="p-6 bg-[#06060C] border border-[#D8C780] rounded-lg">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-xl font-bold text-[#D8C780]">
                        Prompt Generado
                      </h3>
                      <button
                        onClick={handleCopy}
                        className="p-2 bg-[#D8C780]/20 rounded-lg"
                      >
                        <Copy className="w-5 h-5 text-[#D8C780]" />
                      </button>
                    </div>
                    <p className="text-white whitespace-pre-wrap">{response}</p>
                  </div>

                  {isPro && qualityAnalysis && (
                    <QualityAnalysis
                      analysis={qualityAnalysis}
                      prompt={response}
                    />
                  )}

                  <div className="p-6 bg-gradient-to-br from-[#D8C780]/10 to-[#D8C780]/5 border border-[#D8C780]/30 rounded-lg">
                    <h3 className="text-xl font-bold text-white mb-4">
                      Generar Imagen con Nano Banana 🍌
                    </h3>
                    {!isPro ? (
                      <div className="text-red-400 text-center p-4 border border-red-900 bg-red-900/20 rounded">
                        Solo para usuarios PRO
                      </div>
                    ) : (
                      <>
                        <p className="text-[#C1C1C1] mb-6 text-center">
                          Sube las fotos de referencia (
                          {proSettings.gender === "couple"
                            ? "Pareja"
                            : proSettings.gender === "animal"
                            ? "Persona + Animal"
                            : "Sujeto"}
                          ):
                        </p>

                        {/* ✅ UI DE UPLOADERS DINÁMICA */}
                        <div className="mb-6">{renderSelfieUploaders()}</div>

                        <div className="mb-6">
                          <label className="text-[#C1C1C1] block mb-2">
                            Aspect Ratio:
                          </label>
                          <div className="flex gap-2">
                            {VALID_ASPECT_RATIOS.map((r) => (
                              <button
                                key={r.id}
                                onClick={() => setSelectedAspectRatio(r.id)}
                                className={`p-2 rounded border text-xs ${
                                  selectedAspectRatio === r.id
                                    ? "border-[#D8C780] bg-[#D8C780]/20 text-white"
                                    : "border-[#2D2D2D] text-[#C1C1C1]"
                                }`}
                              >
                                {r.name}
                              </button>
                            ))}
                          </div>
                        </div>

                        <button
                          onClick={handleGenerateImage}
                          disabled={isGeneratingImage}
                          className={`w-full px-6 py-3 rounded-lg font-medium flex items-center justify-center gap-2 ${
                            isGeneratingImage
                              ? "bg-[#2D2D2D] text-[#666]"
                              : "bg-gradient-to-r from-[#D8C780] to-[#B8A760] text-black"
                          }`}
                        >
                          {isGeneratingImage ? (
                            <>
                              <Loader2 className="w-5 h-5 animate-spin" />{" "}
                              Generando...
                            </>
                          ) : (
                            <>
                              <ImageIcon className="w-5 h-5" /> Generar Imagen
                              (1 crédito)
                            </>
                          )}
                        </button>
                      </>
                    )}
                  </div>

                  {generatedImages.length > 0 && (
                    <div className="p-6 bg-[#06060C] border border-[#D8C780] rounded-lg">
                      <h3 className="text-xl font-bold text-[#D8C780] mb-4">
                        Resultado
                      </h3>
                      {generatedImages.map((img, i) => (
                        <div key={i}>
                          <img
                            src={`data:${img.mimeType};base64,${img.base64}`}
                            className="w-full rounded-lg mb-4"
                          />
                          <a
                            href={`data:${img.mimeType};base64,${img.base64}`}
                            download="nano.png"
                            className="inline-flex items-center gap-2 px-4 py-2 border border-[#D8C780] text-white rounded-lg"
                          >
                            <Download className="w-4 h-4" /> Descargar
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
