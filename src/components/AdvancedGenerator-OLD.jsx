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
  const [sliders, setSliders] = useState({
    aperture: 2.8,
    focalLength: 85,
    contrast: "medium",
    grain: "subtle",
    temperature: 5500,
  });

  // ✅ NUEVOS ESTADOS PARA CONTROL AVANZADO
  const [selectedShot, setSelectedShot] = useState(null);
  const [selectedOutfit, setSelectedOutfit] = useState(null);
  const [selectedEnvironment, setSelectedEnvironment] = useState(null);
  const [selectedEnvCategory, setSelectedEnvCategory] = useState("all");
  const [showCompositionTools, setShowCompositionTools] = useState(false);

  const isPro = profile?.plan === "pro" || profile?.plan === "premium";

  // ✅ OBTENER PRESETS SEGÚN PLAN DEL USUARIO
  const freePresets = getFreePresets();
  const proPresets = getProPresets();

  // ✅ FUNCIÓN AUXILIAR: Convertir preset a formato legacy para API
  const presetToPromptBlock = (preset) => {
    if (!preset) return null;

    const { technical } = preset;
    return `Ultra-realistic portrait, ${technical.lens}, ${technical.lighting}, WB ${technical.wb}, ${technical.post}`;
  };

  // ✅ GENERAR IDEA ALEATORIA COMPLETA (MODIFICADA)
  const generateRandomIdea = () => {
    // Seleccionar aleatoriamente de cada categoría
    const randomShot = getRandomShotType();
    const randomOutfit = getRandomOutfit();
    const randomEnvironment = getRandomEnvironment();
    const randomPreset = presetsData[
      Math.floor(Math.random() * presetsData.length)
    ];
    
    // Construir descripción humana de la idea
    const ideaDescription = `${randomShot.name} de estilo ${randomOutfit.name} en ${randomEnvironment.name} con look ${randomPreset.name}`;
    
    // Actualizar todos los estados
    setSelectedShot(randomShot.id);
    setSelectedOutfit(randomOutfit.id);
    setSelectedEnvironment(randomEnvironment.id);
    setSelectedPreset(randomPreset.id);
    setPrompt(ideaDescription);
    
    showToast("💡 Idea completa generada aleatoriamente");
  };

  // Toast notification
  const showToast = (message) => {
    const toast = document.createElement("div");
    toast.className =
      "fixed top-4 right-4 bg-black/80 text-white px-4 py-2 rounded-lg z-50";
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 2000);
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!prompt && !referenceImage) return;

    // 🔒 VERIFICAR AUTENTICACIÓN
    if (!user) {
      showToast("❌ Debes iniciar sesión para generar prompts");
      return;
    }

    // 🔒 VERIFICAR CRÉDITOS
    if (!profile || profile.credits <= 0) {
      showToast("❌ No tienes créditos suficientes. Actualiza tu plan.");
      return;
    }

    setIsLoading(true);
    setResponse("");
    setQualityAnalysis(null);

    try {
      const selectedPresetObj = presetsData.find((p) => p.id === selectedPreset);
      const presetPrompt = selectedPresetObj
        ? presetToPromptBlock(selectedPresetObj)
        : null;

      const selectedScenarioObj = SCENARIOS.find(
        (s) => s.id === selectedScenario
      );
      const scenarioPrompt = selectedScenarioObj?.prompt || null;

      // Convertir imagen a base64 si existe
      let base64Image = null;
      if (referenceImage) {
        const reader = new FileReader();
        base64Image = await new Promise((resolve, reject) => {
          reader.onload = () => {
            const base64String = reader.result.split(",")[1];
            resolve(base64String);
          };
          reader.onerror = reject;
          reader.readAsDataURL(referenceImage);
        });
      }

      // ✅ PREPARAR LOS OBJETOS COMPLETOS PARA LOS NUEVOS PARÁMETROS
      const shotData = selectedShot ? SHOT_TYPES[selectedShot] : null;
      const outfitData = selectedOutfit ? OUTFIT_STYLES[selectedOutfit] : null;
      const envData = selectedEnvironment ? ENVIRONMENTS[selectedEnvironment] : null;

      const payload = {
        prompt,
        referenceImage: base64Image,
        mimeType: referenceImage?.type,
        preset: presetPrompt,
        scenario: scenarioPrompt,
        sliders: sliders,
        shotType: shotData,      // ← NUEVO
        outfitStyle: outfitData, // ← NUEVO
        environment: envData,    // ← NUEVO
        analyzeQuality: isPro,
        isPro,
      };

      const res = await fetch("/api/gemini-processor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      // Verificar si la respuesta es JSON válida
      let data;
      try {
        const text = await res.text();
        data = JSON.parse(text);
      } catch (parseError) {
        console.error("Error parsing response:", parseError);
        throw new Error("El servidor no devolvió una respuesta válida. Verifica que la API_KEY esté configurada.");
      }

      if (!res.ok) {
        throw new Error(data.error || data.details || "Error al generar el prompt");
      }

      setResponse(data.prompt);

      if (data.qualityAnalysis) {
        setQualityAnalysis(data.qualityAnalysis);
      }

      // 💳 DESCONTAR CRÉDITO DESPUÉS DE GENERAR EXITOSAMENTE
      try {
        const { data: creditData, error: creditError } = await supabase.rpc('use_credit', {
          user_id_param: user.id
        });

        if (creditError) {
          console.error("Error al descontar crédito:", creditError);
          showToast("⚠️ Prompt generado, pero no se pudo descontar el crédito");
        } else if (creditData === false) {
          showToast("⚠️ Prompt generado, pero no tenías créditos suficientes");
        } else {
          // ✅ GUARDAR EN HISTORIAL
          await supabase.rpc('add_prompt_to_history', {
            user_id_param: user.id,
            prompt_text_param: data.prompt,
            preset_used_param: selectedPresetObj?.name || null,
            scenario_used_param: selectedScenarioObj?.name || null
          });

          // 🔄 RECARGAR PERFIL PARA ACTUALIZAR CRÉDITOS
          if (refreshProfile) {
            await refreshProfile();
          }

          showToast("✅ Prompt generado correctamente");
        }
      } catch (creditError) {
        console.error("Error en sistema de créditos:", creditError);
        showToast("⚠️ Prompt generado, pero hubo un problema con los créditos");
      }
    } catch (error) {
      console.error("Error:", error);
      showToast("❌ Error al generar el prompt");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle apply suggestions
  const handleApplySuggestions = async () => {
    if (!qualityAnalysis?.suggestions || !response) return;

    setIsApplyingSuggestions(true);

    try {
      const payload = {
        applySuggestions: true,
        currentPrompt: response,
        suggestions: qualityAnalysis.suggestions,
        isPro: true,
      };

      const res = await fetch("/api/gemini-processor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      // Verificar si la respuesta es JSON válida
      let data;
      try {
        const text = await res.text();
        data = JSON.parse(text);
      } catch (parseError) {
        console.error("Error parsing response:", parseError);
        throw new Error("El servidor no devolvió una respuesta válida. Verifica que la API_KEY esté configurada.");
      }

      if (!res.ok) {
        throw new Error(data.error || data.details || "Error al aplicar sugerencias");
      }

      setResponse(data.prompt);
      setQualityAnalysis(null);
      showToast("✅ Sugerencias aplicadas correctamente");
    } catch (error) {
      console.error("Error:", error);
      showToast("❌ Error al aplicar sugerencias");
    } finally {
      setIsApplyingSuggestions(false);
    }
  };

  // Handle image upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      showToast("❌ La imagen debe ser menor a 5MB");
      return;
    }

    if (!file.type.startsWith("image/")) {
      showToast("❌ Solo se permiten archivos de imagen");
      return;
    }

    setReferenceImage(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setReferenceImage(null);
    setImagePreview("");
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(response);
    setCopied(true);
    showToast("✅ Prompt copiado");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleUseInGemini = () => {
    window.open(
      `https://gemini.google.com/?prompt=${encodeURIComponent(response)}`,
      "_blank"
    );
  };

  return (
    <section className="min-h-screen py-20 px-4">
      <div className="max-w-4xl mx-auto">
        <AnimatedSection>
          <h1 className="text-4xl font-black text-center mb-12">
            Generador Avanzado
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Upload de imagen */}
            <div>
              <label className="block text-sm font-medium mb-2">
                📸 Imagen de Referencia (opcional):
              </label>
              {!imagePreview ? (
                <label className="w-full flex flex-col items-center justify-center border-2 border-dashed border-[var(--border)] rounded-lg p-8 cursor-pointer hover:border-[var(--primary)] transition">
                  <Upload className="w-12 h-12 mb-2 opacity-50" />
                  <p className="text-sm opacity-70">
                    Sube una imagen para recrear su estilo
                  </p>
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
                    className="w-full h-64 object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute top-2 right-2 bg-red-500/80 backdrop-blur-sm p-2 rounded-full hover:bg-red-600 transition"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              )}
            </div>

            {/* Prompt */}
            <div>
              <label className="block text-sm font-medium mb-2">
                💬 Describe tu idea:
              </label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Ej: Retrato cinematográfico en bosque con luz natural filtrada..."
                rows={4}
                className="w-full bg-[var(--surface)] text-white border border-[var(--border)] rounded-lg px-4 py-3 focus:outline-none focus:border-[var(--primary)] transition"
              />
            </div>

            {/* ✅ CONFIGURACIÓN DE COMPOSICIÓN (PRO) */}
            {isPro && (
              <div className="mt-4">
                <button
                  type="button"
                  onClick={() => setShowCompositionTools(!showCompositionTools)}
                  className="w-full flex items-center justify-between px-4 py-3 bg-black/30 border border-[var(--border)] rounded-lg hover:bg-black/40 transition"
                >
                  <div className="flex items-center gap-2">
                    <span className="font-medium">📷 Configuración de Composición</span>
                    <span className="text-xs opacity-60">(PRO)</span>
                  </div>
                  {showCompositionTools ? "▲" : "▼"}
                </button>

                {showCompositionTools && (
                  <div className="mt-3 p-4 bg-black/20 border border-[var(--border)] rounded-lg space-y-4">
                    
                    {/* PLANO */}
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        📷 Plano Fotográfico
                      </label>
                      <div className="flex gap-2">
                        <select
                          value={selectedShot || ""}
                          onChange={(e) => setSelectedShot(e.target.value || null)}
                          className="flex-1 bg-[var(--surface)] text-white border border-[var(--border)] rounded-lg px-3 py-2"
                        >
                          <option value="">Ninguno (automático)</option>
                          <optgroup label="Planos Generales">
                            <option value="extreme_wide">Gran Plano General</option>
                            <option value="wide">Plano General</option>
                            <option value="full">Plano Entero</option>
                          </optgroup>
                          <optgroup label="Planos Medios">
                            <option value="american">Plano Americano</option>
                            <option value="medium">Plano Medio</option>
                            <option value="medium_close">Plano Medio Corto</option>
                          </optgroup>
                          <optgroup label="Primeros Planos">
                            <option value="close_up">Primer Plano</option>
                            <option value="extreme_close_up">Primerísimo Primer Plano</option>
                            <option value="detail">Plano de Detalle</option>
                          </optgroup>
                          <optgroup label="Ángulos">
                            <option value="overhead">Cenital</option>
                            <option value="high_angle">Picado</option>
                            <option value="eye_level">Normal</option>
                            <option value="low_angle">Contrapicado</option>
                            <option value="worms_eye">Nadir</option>
                          </optgroup>
                        </select>
                        <button
                          type="button"
                          onClick={() => setSelectedShot(getRandomShotType().id)}
                          className="px-3 py-2 bg-[var(--primary)]/20 border border-[var(--primary)] rounded-lg hover:bg-[var(--primary)]/30 transition"
                        >
                          🎲
                        </button>
                      </div>
                    </div>

                    {/* OUTFIT */}
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        👔 Estilo de Outfit
                      </label>
                      <div className="flex gap-2">
                        <select
                          value={selectedOutfit || ""}
                          onChange={(e) => setSelectedOutfit(e.target.value || null)}
                          className="flex-1 bg-[var(--surface)] text-white border border-[var(--border)] rounded-lg px-3 py-2"
                        >
                          <option value="">Ninguno (automático)</option>
                          <option value="casual">Casual</option>
                          <option value="smart_casual">Smart Casual</option>
                          <option value="elegant">Elegante</option>
                          <option value="streetwear">Streetwear</option>
                          <option value="minimalist">Minimalista</option>
                          <option value="vintage">Vintage</option>
                          <option value="boho">Boho</option>
                          <option value="cyberpunk">Cyberpunk</option>
                          <option value="grunge">Grunge</option>
                          <option value="preppy">Preppy</option>
                          <option value="athleisure">Athleisure</option>
                          <option value="gothic">Gótico</option>
                          <option value="punk">Punk</option>
                          <option value="rockabilly">Rockabilly</option>
                          <option value="country">Country</option>
                          <option value="military">Militar</option>
                          <option value="safari">Safari</option>
                          <option value="nautical">Náutico</option>
                          <option value="western">Western</option>
                          <option value="kpop">K-Pop</option>
                          <option value="techwear">Techwear</option>
                          <option value="art_deco">Art Déco</option>
                          <option value="edwardian">Eduardiano</option>
                          <option value="victorian">Victoriano</option>
                          <option value="retro_80s">Retro 80s</option>
                          <option value="retro_90s">Retro 90s</option>
                          <option value="seventies">Años 70</option>
                          <option value="flapper">Flapper</option>
                        </select>
                        <button
                          type="button"
                          onClick={() => setSelectedOutfit(getRandomOutfit().id)}
                          className="px-3 py-2 bg-[var(--primary)]/20 border border-[var(--primary)] rounded-lg hover:bg-[var(--primary)]/30 transition"
                        >
                          🎲
                        </button>
                      </div>
                    </div>

                    {/* ENTORNO */}
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        🏞️ Entorno/Locación
                      </label>
                      <div className="flex gap-2">
                        <select
                          value={selectedEnvironment || ""}
                          onChange={(e) => setSelectedEnvironment(e.target.value || null)}
                          className="flex-1 bg-[var(--surface)] text-white border border-[var(--border)] rounded-lg px-3 py-2"
                        >
                          <option value="">Ninguno (automático)</option>
                          <optgroup label="Estudio">
                            <option value="studio_gray">Estudio Fondo Gris</option>
                            <option value="studio_black_lowkey">Estudio Fondo Negro</option>
                            <option value="studio_white_highkey">Estudio Fondo Blanco</option>
                          </optgroup>
                          <optgroup label="Urbano">
                            <option value="modern_glass_window">Ventanal Moderno</option>
                            <option value="industrial_concrete">Cemento Industrial</option>
                            <option value="neon_street_night">Calle con Neones</option>
                            <option value="rooftop_urban">Azotea Urbana</option>
                            <option value="graffiti_alley">Callejón Graffiti</option>
                            <option value="parking_garage">Parking</option>
                          </optgroup>
                          <optgroup label="Natural">
                            <option value="golden_wheat_field">Campo de Trigo</option>
                            <option value="foggy_forest">Bosque con Niebla</option>
                            <option value="beach_sunrise">Playa Amanecer</option>
                            <option value="mountain_lake">Lago de Montaña</option>
                            <option value="botanical_garden">Jardín Botánico</option>
                            <option value="desert_dunes">Dunas del Desierto</option>
                          </optgroup>
                          <optgroup label="Atmosférico">
                            <option value="vintage_cafe">Café Vintage</option>
                            <option value="dim_bedroom">Habitación Tenue</option>
                            <option value="artist_workshop">Taller de Artista</option>
                            <option value="library_classic">Biblioteca Clásica</option>
                            <option value="jazz_club">Club de Jazz</option>
                            <option value="bookstore_cozy">Librería Acogedora</option>
                          </optgroup>
                          <optgroup label="Cinemático">
                            <option value="dark_corridor">Pasillo Oscuro</option>
                            <option value="motel_neon">Motel con Neón</option>
                            <option value="abandoned_theater">Teatro Abandonado</option>
                            <option value="industrial_factory">Fábrica Industrial</option>
                            <option value="subway_station">Estación de Metro</option>
                            <option value="warehouse_empty">Warehouse Vacío</option>
                          </optgroup>
                          <optgroup label="Cyberpunk">
                            <option value="rain_city_night">Ciudad Lluvia</option>
                            <option value="neon_arcade">Arcade de Neones</option>
                            <option value="cyberpunk_ruins">Ruinas Futuristas</option>
                            <option value="underground_tunnel">Túnel Subterráneo</option>
                            <option value="hacker_den">Guarida Hacker</option>
                            <option value="spaceship_interior">Interior Nave Espacial</option>
                          </optgroup>
                        </select>
                        <button
                          type="button"
                          onClick={() => setSelectedEnvironment(getRandomEnvironment().id)}
                          className="px-3 py-2 bg-[var(--primary)]/20 border border-[var(--primary)] rounded-lg hover:bg-[var(--primary)]/30 transition"
                        >
                          🎲
                        </button>
                      </div>
                    </div>

                  </div>
                )}
              </div>
            )}

            {/* PRESETS FREE */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                🎨 Estilos (Gratis - {freePresets.length}):
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

            {/* ✅ HERRAMIENTAS PRO */}
            <div className="relative mt-4">
              {!isPro && (
                <div className="absolute inset-0 bg-black/70 backdrop-blur-sm rounded-lg flex flex-col items-center justify-center z-10 p-4 text-center">
                  <Lock className="w-10 h-10 text-[var(--primary)] mx-auto mb-4" />
                  <p className="text-white font-bold text-lg mb-2">
                    Herramientas PRO
                  </p>
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
                className="w-full bg-[var(--primary)] text-black px-6 py-3 rounded-full font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transition-all"
              >
                {!profile || profile.credits <= 0
                  ? "Sin créditos disponibles"
                  : isLoading
                  ? "Generando..."
                  : `Generar Prompt (${profile.credits} créditos)`}
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

          {/* PROMPT GENERADO */}
          <div className="mt-6">
            <h3 className="font-semibold text-lg mb-3">Prompt Generado:</h3>
            <div className="bg-black/40 border border-[var(--border)] rounded-lg p-4">
              <pre className="text-gray-300 whitespace-pre-wrap font-sans text-sm">
                {response || "Aquí aparecerá el prompt generado..."}
              </pre>
              {response && (
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

                  {/* Usar en Gemini */}
                  <button
                    type="button"
                    onClick={handleUseInGemini}
                    className="w-full flex items-center justify-center space-x-2 bg-[var(--primary)] text-black px-4 py-3 rounded-lg font-bold hover:shadow transition"
                  >
                    <Send size={18} />
                    <span>Usar en Gemini</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
