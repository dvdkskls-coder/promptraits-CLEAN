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
  LogIn,
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
  const [userPrompt, setUserPrompt] = useState(""); // ✅ Lo que escribe el usuario
  const [response, setResponse] = useState("");
  
  // Estados para el generador de imágenes
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [generatedImages, setGeneratedImages] = useState([]);
  const [selectedAspectRatio, setSelectedAspectRatio] = useState("1:1");
  const [numberOfImages, setNumberOfImages] = useState(1);
  
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
    gender: "", // ✅ Sin género seleccionado por defecto
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
    // Construir el texto de vista previa basado en selecciones PRO
    const parts = [];

    // 1. Característica rápida
    if (selectedFeature) {
      const feature = QUICK_FEATURES.find((f) => f.id === selectedFeature);
      if (feature) {
        parts.push(feature.textES); // Usar texto en español para que el usuario lo vea
      }
    }

    // 2. Herramientas PRO
    if (showProTools) {
      // Environment
      if (!autoSelections.autoEnvironment) {
        if (proSettings.customEnvironment) {
          parts.push(`Entorno: ${proSettings.customEnvironment}`);
        } else if (proSettings.environment) {
          const env = ENVIRONMENTS[proSettings.environment];
          if (env) parts.push(`Entorno: ${env.nameES}`);
        }
      }

      // Shot Type
      if (!autoSelections.autoShotType && proSettings.shotType) {
        const shot = SHOT_TYPES.find((s) => s.id === proSettings.shotType);
        if (shot) parts.push(`Plano: ${shot.nameES}`);
      }

      // Camera Angle
      if (!autoSelections.autoAngle && proSettings.cameraAngle) {
        const angle = CAMERA_ANGLES.find((a) => a.id === proSettings.cameraAngle);
        if (angle) parts.push(`Ángulo: ${angle.nameES}`);
      }

      // Gender
      if (proSettings.gender) {
        const genderOption = GENDER_OPTIONS.find((g) => g.id === proSettings.gender);
        if (genderOption) parts.push(`Género: ${genderOption.name}`);
      }

      // Pose
      if (!autoSelections.autoPose && proSettings.pose) {
        const pose = currentPoses.find((p) => p.id === proSettings.pose);
        if (pose) parts.push(`Pose: ${pose.name}`);
      }

      // Outfit
      if (!autoSelections.autoOutfit && proSettings.outfit) {
        const outfit = currentOutfits.find((o) => o.id === proSettings.outfit);
        if (outfit) parts.push(`Outfit: ${outfit.name}`);
      }

      // Lighting
      if (!autoSelections.autoLighting && proSettings.lighting) {
        const lighting = LIGHTING_SETUPS.find((l) => l.id === proSettings.lighting);
        if (lighting) parts.push(`Iluminación: ${lighting.name}`);
      }

      // Color Grading
      if (!autoSelections.autoColorGrading && proSettings.colorGrading) {
        const grading = COLOR_GRADING_FILTERS.find((g) => g.id === proSettings.colorGrading);
        if (grading) parts.push(`Color: ${grading.name}`);
      }
    }

    // Construir preview para mostrar al usuario
    const previewText = parts.length > 0 ? parts.join(" | ") : "";
    
    // Actualizar el estado prompt que se enviará a la API
    // Combina lo que el usuario escribió + los parámetros seleccionados
    if (previewText) {
      setPrompt(userPrompt ? `${userPrompt}\n\n[Parámetros: ${previewText}]` : previewText);
    } else {
      setPrompt(userPrompt);
    }
  }, [userPrompt, selectedFeature, showProTools, proSettings, autoSelections, currentOutfits, currentPoses]);

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

    // ✅ VERIFICAR CRÉDITOS ANTES DE GENERAR
    if (profile && profile.credits < 1) {
      alert("No tienes suficientes créditos. Por favor, recarga tu cuenta.");
      return;
    }

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

      // ✅ DESCONTAR 1 CRÉDITO Y GUARDAR EN HISTORIAL
      if (user) {
        try {
          // Descontar crédito
          const { error: creditError } = await supabase
            .from('profiles')
            .update({ 
              credits: profile.credits - 1 
            })
            .eq('id', user.id);

          if (creditError) {
            console.error("Error al descontar crédito:", creditError);
          }

          // Guardar en historial
          const { error: historyError } = await supabase
            .from('prompt_history')
            .insert({
              user_id: user.id,
              prompt: prompt,
              generated_prompt: data.prompt,
              platform: selectedPlatform,
              has_image: !!referenceImage,
              pro_settings: proSettings,
              auto_selections: autoSelections,
            });

          if (historyError) {
            console.error("Error al guardar en historial:", historyError);
          }

          // Refrescar perfil para mostrar créditos actualizados
          await refreshProfile();
        } catch (error) {
          console.error("Error en post-generación:", error);
        }
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
  // ✨ CONSTRUIR PREVIEW EN ESPAÑOL
  // ============================================================================
  const buildSpanishPreview = () => {
    const parts = [];

    // Característica rápida
    if (selectedFeature) {
      const feature = QUICK_FEATURES.find((f) => f.id === selectedFeature);
      if (feature?.textES) parts.push(feature.textES);
    }

    // Entorno
    if (autoSelections.autoEnvironment) {
      parts.push("Entorno: [la IA decidirá el mejor]");
    } else if (proSettings.customEnvironment) {
      parts.push(`Entorno: ${proSettings.customEnvironment}`);
    } else if (proSettings.environment) {
      const env = Object.values(ENVIRONMENTS).find((e) => e.id === proSettings.environment);
      if (env) parts.push(`Entorno: ${env.name}`);
    }

    // Tipo de plano
    if (autoSelections.autoShotType) {
      parts.push("Tipo de plano: [la IA decidirá]");
    } else if (proSettings.shotType) {
      const shot = SHOT_TYPES.find((s) => s.id === proSettings.shotType);
      if (shot) parts.push(`Tipo de plano: ${shot.nameES}`);
    }

    // Ángulo
    if (autoSelections.autoAngle) {
      parts.push("Ángulo de cámara: [la IA decidirá]");
    } else if (proSettings.cameraAngle) {
      const angle = CAMERA_ANGLES.find((a) => a.id === proSettings.cameraAngle);
      if (angle) parts.push(`Ángulo: ${angle.nameES}`);
    }

    // Género
    if (proSettings.gender) {
      const gender = GENDER_OPTIONS.find((g) => g.id === proSettings.gender);
      if (gender) parts.push(`Estética: ${gender.name}`);
    }

    // Pose
    if (autoSelections.autoPose) {
      parts.push("Pose: [la IA decidirá]");
    } else if (proSettings.pose) {
      const allPoses = [...POSES.masculine, ...POSES.feminine, ...POSES.couple];
      const pose = allPoses.find((p) => p.id === proSettings.pose);
      if (pose) parts.push(`Pose: ${pose.name}`);
    }

    // Outfit
    if (autoSelections.autoOutfit) {
      parts.push("Outfit: [la IA decidirá]");
    } else if (proSettings.outfit) {
      const allOutfits = [...Outfits_men, ...Outfits_women];
      const outfit = allOutfits.find((o) => o.id === proSettings.outfit);
      if (outfit) parts.push(`Vestuario: ${outfit.name}`);
    }

    // Iluminación
    if (autoSelections.autoLighting) {
      parts.push("Iluminación: [la IA decidirá]");
    } else if (proSettings.lighting) {
      const light = LIGHTING_SETUPS.find((l) => l.id === proSettings.lighting);
      if (light) parts.push(`Iluminación: ${light.name}`);
    }

    // Color grading
    if (autoSelections.autoColorGrading) {
      parts.push("Corrección de color: [la IA decidirá]");
    } else if (proSettings.colorGrading) {
      const filter = COLOR_GRADING_FILTERS.find((f) => f.id === proSettings.colorGrading);
      if (filter) parts.push(`Color: ${filter.name}`);
    }

    return parts.join(". ");
  };

  // ✅ Actualizar preview automáticamente
  useEffect(() => {
    const preview = buildSpanishPreview();
    if (preview) {
      setPrompt(userPrompt ? `${userPrompt}\n\n---PARÁMETROS SELECCIONADOS---\n${preview}` : preview);
    } else {
      setPrompt(userPrompt);
    }
  }, [userPrompt, selectedFeature, autoSelections, proSettings]);

  // ============================================================================
  // ✨ GENERAR IMAGEN CON IMAGEN 3
  // ============================================================================
  const handleGenerateImage = async () => {
    if (!response) {
      alert("Primero genera un prompt profesional");
      return;
    }

    // ✅ VERIFICAR CRÉDITOS ANTES DE GENERAR
    if (profile && profile.credits < 1) {
      alert("No tienes suficientes créditos para generar la imagen. Por favor, recarga tu cuenta.");
      return;
    }

    setIsGeneratingImage(true);
    setGeneratedImages([]);

    try {
      const res = await fetch("/api/generate-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: response, // response es el string del prompt
          referenceImage: referenceImage,
          aspectRatio: selectedAspectRatio,
          numberOfImages: 1, // Siempre 1 imagen
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.details || data.error || "Error desconocido");
      }

      setGeneratedImages(data.images);
      console.log("✅ Imágenes generadas:", data.images.length);

      // ✅ DESCONTAR 1 CRÉDITO
      if (user && profile) {
        try {
          const { error: creditError } = await supabase
            .from('profiles')
            .update({ 
              credits: profile.credits - 1 
            })
            .eq('id', user.id);

          if (creditError) {
            console.error("Error al descontar crédito:", creditError);
          }

          // Refrescar perfil
          await refreshProfile();
        } catch (error) {
          console.error("Error al descontar crédito:", error);
        }
      }

    } catch (error) {
      console.error("Error:", error);
      alert(`Error al generar imagen: ${error.message}`);
    } finally {
      setIsGeneratingImage(false);
    }
  };

  // ============================================================================
  // RENDER
  // ============================================================================

  // ✅ SI NO HAY USER - MOSTRAR MENSAJE DE LOGIN
  if (!user) {
    return (
      <div className="max-w-5xl mx-auto space-y-6 px-4 py-8">
        <AnimatedSection delay={0}>
          <div className="bg-[#2D2D2D] rounded-xl p-12 border border-[#2D2D2D] text-center">
            <Lock className="w-16 h-16 mx-auto mb-4 text-[#D8C780]" />
            <h2 className="text-2xl font-bold text-white mb-3">
              Generador de Prompts Profesional
            </h2>
            <p className="text-[#C1C1C1] mb-6">
              Para utilizar el generador de prompts necesitas registrarte o iniciar sesión
            </p>
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => window.location.href = "/login"}
                className="px-6 py-3 bg-[#D8C780] hover:bg-[#C4B66D] text-[#06060C] rounded-xl font-medium transition-all flex items-center gap-2"
              >
                <LogIn className="w-5 h-5" />
                Iniciar Sesión
              </button>
              <button
                onClick={() => window.location.href = "/register"}
                className="px-6 py-3 bg-[#2D2D2D] hover:bg-[#3D3D3D] border border-[#D8C780] text-[#D8C780] rounded-xl font-medium transition-all"
              >
                Registrarse
              </button>
            </div>
          </div>
        </AnimatedSection>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <AnimatedSection delay={0}>
        {/* Header Section */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-[#D8C780] via-[#D8C780] to-[#D8C780] text-transparent bg-clip-text">
            Generador Avanzado de Prompts
          </h1>
          <p className="text-[#C1C1C1] text-lg">
            Crea prompts profesionales con IA y herramientas PRO
          </p>
        </div>

        {/* Platform Selection */}
        <div className="bg-[#2D2D2D] backdrop-blur-sm rounded-xl p-6 border border-[#2D2D2D]">
          <div className="flex items-center justify-between mb-4">
            <label className="text-sm font-medium text-[#C1C1C1]">
              Plataforma de destino
            </label>
            <button
              type="button"
              onClick={() => setShowPlatformInfo(!showPlatformInfo)}
              className="text-[#D8C780] hover:text-purple-300 transition-colors"
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
                    ? "border-[#D8C780] bg-[#D8C780]/20"
                    : "border-[#2D2D2D] bg-white/5 hover:border-[#D8C780]/50"
                }`}
              >
                <div className="font-medium text-white">{info.name}</div>
                <div className="text-sm text-[#C1C1C1] mt-1">
                  {info.description}
                </div>
              </button>
            ))}
          </div>

          {showPlatformInfo && (
            <div className="mt-4 p-4 bg-white/5 rounded-lg border border-[#2D2D2D]">
              <h3 className="font-medium text-white mb-2">
                {PLATFORM_INFO[selectedPlatform].name}
              </h3>
              <ul className="space-y-1 text-sm text-[#C1C1C1]">
                {PLATFORM_INFO[selectedPlatform].features.map((feature, idx) => (
                  <li key={idx}>• {feature}</li>
                ))}
              </ul>
              <p className="mt-2 text-sm text-[#D8C780]">
                💡 {PLATFORM_INFO[selectedPlatform].tips}
              </p>
            </div>
          )}
        </div>

        {/* Características Rápidas */}
        <div className="bg-[#2D2D2D] backdrop-blur-sm rounded-xl p-6 border border-[#2D2D2D]">
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
                    ? "border-[#D8C780] bg-[#D8C780]/20"
                    : "border-[#2D2D2D] bg-white/5 hover:border-[#D8C780]/50"
                }`}
              >
                <div className="font-medium text-sm text-white">
                  {feature.name}
                </div>
                <div className="text-xs text-[#C1C1C1] mt-1">
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
                ? "bg-gradient-to-r from-[#D8C780] to-[#D8C780] hover:from-[#C4B66D] hover:to-[#C4B66D]"
                : "bg-[#2D2D2D] hover:bg-gray-600"
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
          <div className="bg-[#2D2D2D] backdrop-blur-sm rounded-xl p-6 border border-[#2D2D2D] space-y-4">
            
            {/* 1. ENTORNO */}
            <ProSection
              title="Entorno"
              description="Donde se realizará el retrato"
              isOpen={openSections.environment}
              onToggle={() => toggleSection("environment")}
              autoButton={
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleAutoSelection("autoEnvironment");
                    if (!autoSelections.autoEnvironment) {
                      setProSettings((prev) => ({
                        ...prev,
                        environment: null,
                        customEnvironment: "",
                      }));
                    }
                  }}
                  className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                    autoSelections.autoEnvironment
                      ? "bg-[#D8C780] text-white"
                      : "bg-[#2D2D2D] text-[#C1C1C1] hover:bg-gray-600"
                  }`}
                >
                  Automático
                </button>
              }
            >
              <div className="space-y-3">
                {!autoSelections.autoEnvironment && (
                  <>
                    <select
                      value={proSettings.environment || ""}
                      onChange={(e) => updateProSetting("environment", e.target.value)}
                      className="w-full bg-[#2D2D2D] text-white rounded-lg p-2 border border-[#2D2D2D]"
                    >
                      <option value="">-- Selecciona entorno --</option>
                      {Object.values(ENVIRONMENTS).map((env) => (
                        <option key={env.id} value={env.id}>
                          {env.name}
                        </option>
                      ))}
                    </select>

                    <div className="pt-2">
                      <label className="text-sm text-[#C1C1C1] block mb-1">
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
                        className="w-full bg-[#2D2D2D] text-white rounded-lg p-2 border border-[#2D2D2D]"
                      />
                    </div>
                  </>
                )}
              </div>
            </ProSection>

            {/* 2. TIPO DE PLANO */}
            <ProSection
              title="Tipo de Plano"
              description="Encuadre de la fotografía"
              isOpen={openSections.shotType}
              onToggle={() => toggleSection("shotType")}
              autoButton={
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleAutoSelection("autoShotType");
                    if (!autoSelections.autoShotType) {
                      updateProSetting("shotType", null);
                    }
                  }}
                  className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                    autoSelections.autoShotType
                      ? "bg-[#D8C780] text-white"
                      : "bg-[#2D2D2D] text-[#C1C1C1] hover:bg-gray-600"
                  }`}
                >
                  Automático
                </button>
              }
            >
              <div className="space-y-3">
                {!autoSelections.autoShotType && (
                  <select
                    value={proSettings.shotType || ""}
                    onChange={(e) => updateProSetting("shotType", e.target.value)}
                    className="w-full bg-[#2D2D2D] text-white rounded-lg p-2 border border-[#2D2D2D]"
                  >
                    <option value="">-- Selecciona plano --</option>
                    {SHOT_TYPES.map((shot) => (
                      <option key={shot.id} value={shot.id}>
                        {shot.nameES.toUpperCase()} :: {shot.description}
                      </option>
                    ))}
                  </select>
                )}
              </div>
            </ProSection>

            {/* 3. ÁNGULO DE CÁMARA */}
            <ProSection
              title="Ángulo de Cámara"
              description="Perspectiva de la toma"
              isOpen={openSections.cameraAngle}
              onToggle={() => toggleSection("cameraAngle")}
              autoButton={
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleAutoSelection("autoAngle");
                    if (!autoSelections.autoAngle) {
                      updateProSetting("cameraAngle", null);
                    }
                  }}
                  className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                    autoSelections.autoAngle
                      ? "bg-[#D8C780] text-white"
                      : "bg-[#2D2D2D] text-[#C1C1C1] hover:bg-gray-600"
                  }`}
                >
                  Automático
                </button>
              }
            >
              <div className="space-y-3">
                {!autoSelections.autoAngle && (
                  <select
                    value={proSettings.cameraAngle || ""}
                    onChange={(e) => updateProSetting("cameraAngle", e.target.value)}
                    className="w-full bg-[#2D2D2D] text-white rounded-lg p-2 border border-[#2D2D2D]"
                  >
                    <option value="">-- Selecciona ángulo --</option>
                    {CAMERA_ANGLES.map((angle) => (
                      <option key={angle.id} value={angle.id}>
                        {angle.nameES.toUpperCase()} :: {angle.description}
                      </option>
                    ))}
                  </select>
                )}
              </div>
            </ProSection>

            {/* 4. GÉNERO */}
            <ProSection
              title="Género"
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
                        ? "border-[#D8C780] bg-[#D8C780]/20"
                        : "border-[#2D2D2D] bg-white/5 hover:border-[#D8C780]/50"
                    }`}
                  >
                    <div className="text-sm font-medium text-white">{gender.name}</div>
                  </button>
                ))}
              </div>
            </ProSection>

            {/* 5. POSES */}
            <ProSection
              title="Poses"
              description="Postura y expresión del sujeto"
              isOpen={openSections.pose}
              onToggle={() => toggleSection("pose")}
              autoButton={
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleAutoSelection("autoPose");
                    if (!autoSelections.autoPose) {
                      updateProSetting("pose", null);
                    }
                  }}
                  className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                    autoSelections.autoPose
                      ? "bg-[#D8C780] text-white"
                      : "bg-[#2D2D2D] text-[#C1C1C1] hover:bg-gray-600"
                  }`}
                >
                  Automático
                </button>
              }
            >
              <div className="space-y-3">
                {!autoSelections.autoPose && (
                  <select
                    value={proSettings.pose || ""}
                    onChange={(e) => updateProSetting("pose", e.target.value)}
                    className="w-full bg-[#2D2D2D] text-white rounded-lg p-2 border border-[#2D2D2D]"
                  >
                    <option value="">-- Selecciona pose --</option>
                    {currentPoses.map((pose) => (
                      <option key={pose.id} value={pose.id}>
                        {pose.name.toUpperCase()} :: {pose.description}
                      </option>
                    ))}
                  </select>
                )}
              </div>
            </ProSection>

            {/* 6. OUTFIT */}
            <ProSection
              title="Outfit"
              description="Vestuario y estilo de ropa"
              isOpen={openSections.outfit}
              onToggle={() => toggleSection("outfit")}
              autoButton={
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleAutoSelection("autoOutfit");
                    if (!autoSelections.autoOutfit) {
                      updateProSetting("outfit", null);
                    }
                  }}
                  className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                    autoSelections.autoOutfit
                      ? "bg-[#D8C780] text-white"
                      : "bg-[#2D2D2D] text-[#C1C1C1] hover:bg-gray-600"
                  }`}
                >
                  Automático
                </button>
              }
            >
              <div className="space-y-3">
                {!autoSelections.autoOutfit && (
                  <select
                    value={proSettings.outfit || ""}
                    onChange={(e) => updateProSetting("outfit", e.target.value)}
                    className="w-full bg-[#2D2D2D] text-white rounded-lg p-2 border border-[#2D2D2D]"
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
              title="Iluminación"
              description="Esquema de luces profesional"
              isOpen={openSections.lighting}
              onToggle={() => toggleSection("lighting")}
              autoButton={
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleAutoSelection("autoLighting");
                    if (!autoSelections.autoLighting) {
                      updateProSetting("lighting", null);
                    }
                  }}
                  className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                    autoSelections.autoLighting
                      ? "bg-[#D8C780] text-white"
                      : "bg-[#2D2D2D] text-[#C1C1C1] hover:bg-gray-600"
                  }`}
                >
                  Automático
                </button>
              }
            >
              <div className="space-y-3">
                {!autoSelections.autoLighting && (
                  <select
                    value={proSettings.lighting || ""}
                    onChange={(e) => updateProSetting("lighting", e.target.value)}
                    className="w-full bg-[#2D2D2D] text-white rounded-lg p-2 border border-[#2D2D2D]"
                  >
                    <option value="">-- Selecciona iluminación --</option>
                    {LIGHTING_SETUPS.map((light) => (
                      <option key={light.id} value={light.id}>
                        {light.name.toUpperCase()} :: {light.description}
                      </option>
                    ))}
                  </select>
                )}
              </div>
            </ProSection>

            {/* 8. CORRECCIÓN DE COLOR */}
            <ProSection
              title="Corrección de Color"
              description="Look cinematográfico y filtros"
              isOpen={openSections.colorGrading}
              onToggle={() => toggleSection("colorGrading")}
              autoButton={
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleAutoSelection("autoColorGrading");
                    if (!autoSelections.autoColorGrading) {
                      updateProSetting("colorGrading", null);
                    }
                  }}
                  className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                    autoSelections.autoColorGrading
                      ? "bg-[#D8C780] text-white"
                      : "bg-[#2D2D2D] text-[#C1C1C1] hover:bg-gray-600"
                  }`}
                >
                  Automático
                </button>
              }
            >
              <div className="space-y-3">
                {!autoSelections.autoColorGrading && (
                  <select
                    value={proSettings.colorGrading || ""}
                    onChange={(e) => updateProSetting("colorGrading", e.target.value)}
                    className="w-full bg-[#2D2D2D] text-white rounded-lg p-2 border border-[#2D2D2D]"
                  >
                    <option value="">-- Selecciona filtro --</option>
                    {COLOR_GRADING_FILTERS.map((filter) => (
                      <option key={filter.id} value={filter.id}>
                        {filter.name.toUpperCase()} :: {filter.description}
                      </option>
                    ))}
                  </select>
                )}
              </div>
            </ProSection>

          </div>
        )}

        {/* Prompt Input + Image Upload */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="bg-[#2D2D2D] backdrop-blur-sm rounded-xl p-6 border border-[#2D2D2D] overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Imagen de referencia - Columna pequeña */}
              <div className="md:col-span-1">
                <label className="block text-sm font-medium text-[#C1C1C1] mb-3">
                  Imagen de referencia
                </label>
                
                {!imagePreview ? (
                  <label className="flex flex-col items-center justify-center w-full h-full min-h-[200px] border-2 border-dashed border-[#D8C780]/50 rounded-lg cursor-pointer hover:border-[#D8C780]/50 transition-colors">
                    <Upload className="w-8 h-8 text-[#C1C1C1] mb-2" />
                    <span className="text-xs text-[#C1C1C1] text-center px-2">
                      Sube una imagen (máx 4MB)
                    </span>
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handleImageUpload}
                    />
                  </label>
                ) : (
                  <div className="relative h-full min-h-[200px]">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-full object-cover rounded-lg"
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

              {/* Textarea - Columna grande */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-[#C1C1C1] mb-3">
                  Describe lo que quieres generar
                </label>
                <textarea
                  value={userPrompt}
                  onChange={(e) => setUserPrompt(e.target.value)}
                  placeholder="Ej: Retrato profesional en estudio... (Los parámetros PRO seleccionados se añadirán automáticamente)"
                  className="w-full h-full min-h-[200px] bg-[#06060C]/50 text-white rounded-lg p-4 border border-[#2D2D2D] focus:border-[#D8C780] focus:outline-none resize-none"
                />
                
                {/* Vista previa de parámetros seleccionados */}
                {prompt !== userPrompt && (
                  <div className="mt-2 p-3 bg-[#D8C780]/10 border border-[#D8C780]/30 rounded-lg">
                    <p className="text-xs text-[#D8C780] mb-1">
                      ✨ Vista previa con parámetros seleccionados:
                    </p>
                    <p className="text-xs text-[#C1C1C1] whitespace-pre-wrap">
                      {prompt}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading || !prompt.trim()}
            className="w-full py-4 bg-gradient-to-r from-[#D8C780] to-[#D8C780] hover:from-[#C4B66D] hover:to-[#C4B66D] disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed rounded-xl font-medium transition-all flex items-center justify-center gap-2"
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
          <div className="bg-[#2D2D2D] backdrop-blur-sm rounded-xl p-6 border border-[#2D2D2D]">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-white">
                ✨ Prompt Generado
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
            <div className="bg-[#06060C]/50 rounded-lg p-4 text-[#C1C1C1] whitespace-pre-wrap">
              {response}
            </div>
          </div>
        )}

        {/* Generador de Imágenes con Imagen 3 */}
        {response && (
          <div className="bg-[#2D2D2D] rounded-xl p-6 border border-[#2D2D2D]">
            <h3 className="text-lg font-medium text-white mb-4">
              🎨 Generar Imagen con Imagen 3
            </h3>
            
            <div className="space-y-4">
              {/* Aspect Ratio */}
              <div>
                <label className="text-sm font-medium text-[#C1C1C1] mb-2 block">
                  Formato de imagen
                </label>
                <div className="grid grid-cols-5 gap-2">
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
              </div>

              {/* Botón generar */}
              <button
                type="button"
                onClick={handleGenerateImage}
                disabled={isGeneratingImage}
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
                    Generar Imagen
                  </>
                )}
              </button>

              {/* Galería de imágenes generadas */}
              {generatedImages.length > 0 && (
                <div className="mt-6">
                  <h4 className="text-sm font-medium text-white mb-3">
                    Imágenes generadas:
                  </h4>
                  <div className={`grid gap-4 ${
                    generatedImages.length === 1 ? "grid-cols-1" : "grid-cols-2"
                  }`}>
                    {generatedImages.map((img, idx) => (
                      <div key={idx} className="relative group">
                        <img
                          src={`data:${img.mimeType};base64,${img.base64}`}
                          alt={`Generada ${idx + 1}`}
                          className="w-full rounded-lg border border-[#2D2D2D]"
                        />
                        <a
                          href={`data:${img.mimeType};base64,${img.base64}`}
                          download={`promptraits-${Date.now()}-${idx}.png`}
                          className="absolute bottom-2 right-2 px-3 py-2 bg-[#D8C780] hover:bg-[#C4B66D] rounded-lg text-[#06060C] text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          Descargar
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              )}
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
function ProSection({ title, description, isOpen, onToggle, autoButton, children }) {
  return (
    <div className="border border-[#2D2D2D] rounded-lg overflow-hidden">
      <button
        type="button"
        onClick={onToggle}
        className="w-full flex items-center justify-between p-4 bg-[#06060C]/50 hover:bg-[#06060C] transition-colors"
      >
        <div className="text-left flex-1">
          <div className="font-medium text-white">{title}</div>
          <div className="text-sm text-[#C1C1C1]">{description}</div>
        </div>
        
        <div className="flex items-center gap-3">
          {autoButton}
          <span className="text-xl">
            {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </span>
        </div>
      </button>

      {isOpen && (
        <div className="p-4 bg-black/20">
          {children}
        </div>
      )}
    </div>
  );
}
