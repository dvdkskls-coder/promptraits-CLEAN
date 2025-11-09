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
  Download,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { supabase } from "../lib/supabase"; // Importamos supabase para coger el token
import AnimatedSection from "./AnimatedSection";
import QualityAnalysis from "./QualityAnalysis";

// IMPORTAR OUTFITS SEPARADOS POR GÉNERO
import Outfits_women from "../data/Outfits_women";
import Outfits_men from "../data/Outfits_men";

// IMPORTAR TIPOS DE PLANO Y ÁNGULOS DE CÁMARA
import { SHOT_TYPES, CAMERA_ANGLES } from "../data/shotTypesData";

// IMPORTAR ENTORNOS
import { ENVIRONMENTS_ARRAY } from "../data/environmentsData";

// IMPORTAR NUEVOS COMPONENTES PRO
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

// ============================================================================
// ✨ NUEVO: RELACIONES DE ASPECTO VÁLIDAS (Las 5 que soporta Google)
// ============================================================================
const VALID_ASPECT_RATIOS = [
  { id: "1:1", name: "Cuadrado" },
  { id: "3:4", name: "Vertical" },
  { id: "9:16", name: "Historia" },
  { id: "4:3", name: "Horizontal" },
  { id: "16:9", name: "Panorámica" },
];

export default function AdvancedGenerator() {
  // ============================================================================
  // ESTADOS PRINCIPALES
  // ============================================================================
  
  // ✅ OBTENEMOS TODO DEL CONTEXTO
  const { 
    user, 
    profile, 
    loading, // <-- ¡LA CLAVE ESTÁ AQUÍ!
    refreshProfile, 
    consumeCredits, 
    savePromptToHistory 
  } = useAuth();

  // ❌ ELIMINADO EL ESTADO LOCAL REDUNDANTE
  // const [isInitializing, setIsInitializing] = useState(true); 

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

  // --- ✅ ESTADO PARA ASPECT RATIO ---
  const [selectedAspectRatio, setSelectedAspectRatio] = useState("1:1");

  const [showProTools, setShowProTools] = useState(false);
  const [selectedFeature, setSelectedFeature] = useState(null);
  const [openSections, setOpenSections] = useState({
    environment: false,
    shotType: false,
    cameraAngle: false,
    pose: false,
    outfit: false,
    lighting: false,
    colorGrading: false,
    gender: false,
  });
  const [proSettings, setProSettings] = useState({
    gender: "masculine", // Género por defecto
    environment: { id: null, custom: "" },
    shotType: null,
    cameraAngle: null,
    pose: null,
    outfit: null,
    lighting: null,
    colorGrading: null,
  });

  // ============================================================================

  // VERIFICAR SUSCRIPCIÓN - PRO/PREMIUM vs FREE
  // ============================================================================

  // ✅ Esta variable se calculará correctamente en cada render
  //    Cuando 'loading' sea false, 'profile' será el correcto.
  const isPro =
    profile?.subscription_tier === "pro" ||
    profile?.subscription_tier === "premium";

  // Debug (puedes eliminarlo después)
  useEffect(() => {
    console.log("🔍 Verificación de suscripción (AdvancedGenerator):", {
      loading: loading, // Ver el estado de carga
      tier: profile?.subscription_tier,
      isPro: isPro,
    });
  }, [profile, loading, isPro]);


  // ============================================================================
  // ❌ INICIALIZACIÓN (ELIMINADO)
  // ============================================================================
  // Ya no necesitamos este useEffect, el AuthContext se encarga de todo.
  /*
  useEffect(() => {
    const init = async () => {
      // ... (código eliminado)
    };
    init();
  }, [user]);
  */
  // ============================================================================

  const prompt = userPrompt || "";

  // ... (handleReferenceImageChange y removeReferenceImage no cambian) ...
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

  // ... (handleSelfieChange y removeSelfie no cambian) ...
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
  // 🔥 GENERAR PROMPT (No necesita cambios mayores)
  // ============================================================================
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
      let requestData;
      let headers = {};

      if (referenceImage) {
        const formData = new FormData();
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
      } else {
        requestData = JSON.stringify({
          prompt: prompt,
          platform: "nano-banana",
          userId: user.id,
          proSettings: proSettings,
          analyzeQuality: isPro, 
        });
        headers["Content-Type"] = "application/json";
      }

      // (Asumimos que gemini-processor NO requiere token, si lo requiere, hay que añadirlo)
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

      // Consumir créditos
      try {
        console.log("💳 Consumiendo 1 crédito...");
        await consumeCredits(1);
      } catch (creditError) {
        console.error("❌ Error al consumir crédito:", creditError);
        alert("Error al consumir créditos. Por favor, recarga la página.");
      }

      // Guardar en historial
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
          null 
        );
      } catch (historyError) {
        console.error("❌ Error al guardar en historial:", historyError);
      }

      await refreshProfile(); // Refrescar para actualizar los créditos en UI
    } catch (error) {
      console.error("Error:", error);
      alert(error.message || "Error al generar el prompt");
    } finally {
      setIsLoading(false);
    }
  };

  // ============================================================================
  // 🔥 GENERAR IMAGEN (VERSIÓN SEGURA CON TOKEN)
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

    // ✅ Esta comprobación ahora FUNCIONARÁ
    if (!isPro) {
       alert("Solo los usuarios PRO y PREMIUM pueden generar imágenes. Por favor, actualiza tu plan.");
       return;
    }
    
    // Comprobación de créditos frontend (buena práctica)
    if (!profile || profile.credits < 1) {
      alert("No tienes suficientes créditos para generar una imagen");
      return;
    }

    setIsGeneratingImage(true);
    setGeneratedImages([]);

    try {
      // 1. OBTENER TOKEN DE AUTORIZACIÓN
      console.log("🔐 Obteniendo sesión de Supabase...");
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();

      if (sessionError || !session) {
        console.error("Error al obtener la sesión:", sessionError);
        throw new Error("No estás autenticado. Por favor, inicia sesión de nuevo.");
      }
      const token = session.access_token;
      console.log("✅ Token JWT obtenido.");

      // 2. CONSTRUIR FORMDATA
      const formData = new FormData();
      formData.append("prompt", response);
      formData.append("selfieImage", selfieImage);
      formData.append("aspectRatio", selectedAspectRatio); // Usar el estado
      // No necesitamos 'userId', el backend lo saca del token

      // 3. LLAMAR A LA API CON HEADERS
      const res = await fetch("/api/generate-image", {
        method: "POST",
        headers: {
          'Authorization': `Bearer ${token}` // Así se autentica
        },
        body: formData,
      });

      const data = await res.json(); // Leer la respuesta (sea OK o error)

      if (!res.ok) {
        // El backend nos dará un error claro
        console.error("❌ Error de la API (generate-image):", data.error);
        throw new Error(data.error || "Error al generar la imagen");
      }

      if (data.images && data.images.length > 0) {
        setGeneratedImages(data.images);
        // El backend (el código que te pasé) ya se encarga de consumir
        // los créditos. Solo necesitamos refrescar la UI.
        console.log("Imagen generada, refrescando perfil para ver créditos...");
      } else {
        throw new Error("No se generaron imágenes");
      }

      await refreshProfile(); // Refrescar para actualizar créditos consumidos por el backend

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

  // ============================================================================
  // ⚠️ CORRECCIÓN DE BUGS: LÓGICA DE HERRAMIENTAS PRO
  // ============================================================================
  
  // ✅ Lógica para Poses (basado en género)
  const safePoses = getPosesByGender(proSettings.gender);

  // ✅ Lógica para Outfits (basado en género)
  const safeOutfits =
    proSettings.gender === "masculine" ? Outfits_men : Outfits_women;

  // ============================================================================
  // COMPONENTE PROSECTION
  // ============================================================================
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
    <div className="min-h-screen bg-[#06060C] py-20">
      {/* ================================================================== */}
      {/* ✨ CAMBIO DE CSS (ANCHO) */}
      {/* ================================================================== */}
      <div className="max-w-6xl mx-auto px-4"> {/* <-- ANCHO CAMBIADO */}
        
        {/* ================================================================== */}
        {/* ✨ CAMBIO DE LÓGICA (LOADING) */}
        {/* ================================================================== */}
        {/* Usamos 'loading' de useAuth(), NO 'isInitializing' */}
        {loading ? (
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
              {/* Esta comprobación ahora es segura, 
                  porque 'loading' es false y 'profile' está definido */}
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
                    <p className="text-xs text-[#C1C1C1] mt-1">
                      Los parámetros seleccionados se añadirán automáticamente
                    </p>
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
                      Selecciona una característica rápida o usa las
                      Herramientas PRO para control completo
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
                  {/* Esta variable 'isPro' ahora es fiable */}
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

                  {/* ================================================================== */}
                  {/* ✨ CAMBIO DE UI: BANNER UPSELL (PROBLEMA 3) */}
                  {/* ================================================================== */}
                  {!isPro && (
                    <div className="p-6 bg-[#0E0E0E] border border-[#2D2D2D] rounded-lg">
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
                          <span>
                            Control completo de entornos y locaciones
                          </span>
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

                  {/* Herramientas PRO (Contenedor) */}
                  {/* ⚠️ CORRECCIÓN DE BUGS EN .map() */}
                  {isPro && showProTools && (
                    <div className="space-y-4 mt-4">
                      <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
                        {/* Género */}
                        <ProSection
                          title="Género"
                          description="Personaliza poses y vestuario"
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
                            {ENVIRONMENTS_ARRAY.map((env) => (
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
                            {SHOT_TYPES.map((shot) => (
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
                          description="Perspectiva de la foto"
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
                            {CAMERA_ANGLES.map((angle) => (
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
                                      {outf