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
import AnimatedSection from "./AnimatedSection";
import QualityAnalysis from "./QualityAnalysis";

// ✅ IMPORTAR DATOS DE PRESETS ORGANIZADOS
import {
  presetsData,
  getFreePresets,
  getProPresets,
  PRESET_PLANS,
} from "../data/presetsData";

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

// IDEAS ALEATORIAS para generar (PRO feature)
const RANDOM_IDEAS = [
  "Retrato elegante en biblioteca antigua con luz de ventana",
  "Fotografía editorial en mercado callejero colorido al mediodía",
  "Sesión de moda minimalista en galería de arte contemporáneo",
  "Retrato íntimo en café parisino con luz natural suave",
  "Fotografía urbana nocturna con reflejos en charcos de lluvia",
  "Retrato cinematográfico en estación de tren vintage",
  "Sesión lifestyle en campo de lavanda al atardecer",
  "Retrato conceptual en museo de historia natural",
  "Fotografía de moda en azotea con skyline de fondo",
  "Retrato dramático en teatro abandonado con luz cenital",
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

  // Función para generar idea aleatoria (PRO)
  const generateRandomIdea = () => {
    const randomIdea =
      RANDOM_IDEAS[Math.floor(Math.random() * RANDOM_IDEAS.length)];
    const randomPreset =
      presetsData[Math.floor(Math.random() * presetsData.length)];
    const randomScenario =
      SCENARIOS[Math.floor(Math.random() * SCENARIOS.length)];

    setPrompt(randomIdea);
    setSelectedPreset(randomPreset.id);
    setSelectedScenario(randomScenario.id);

    showToast("💡 Idea generada aleatoriamente");
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setReferenceImage(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setReferenceImage(null);
    setImagePreview("");
  };

  const fileToBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        try {
          const parts = String(reader.result).split(",");
          resolve(parts[1] || null);
        } catch (err) {
          resolve(null);
        }
      };
      reader.onerror = (err) => reject(err);
    });

  const showToast = (message) => {
    if (window.App_showToast) {
      window.App_showToast(message);
    }
  };

  const handleGenerate = async (e) => {
    e && e.preventDefault();

    if (!user) {
      setResponse("Inicia sesión para generar.");
      showToast("Inicia sesión para generar.");
      return;
    }
    if (profile?.credits <= 0) {
      setResponse(
        "No tienes créditos disponibles. Compra créditos o suscríbete."
      );
      showToast("No tienes créditos.");
      return;
    }

    setIsLoading(true);
    setResponse("Generando prompt con IA... por favor, espera.");
    setQualityAnalysis(null);

    try {
      let imageBase64 = null;
      if (referenceImage) {
        imageBase64 = await fileToBase64(referenceImage);
      }

      // ✅ BUSCAR PRESET SELECCIONADO Y CONVERTIRLO
      const selectedPresetData = selectedPreset
        ? presetsData.find((p) => p.id === selectedPreset)
        : null;

      const res = await fetch("/api/gemini-processor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt,
          referenceImage: imageBase64,
          mimeType: referenceImage ? referenceImage.type : null,
          preset: selectedPresetData
            ? presetToPromptBlock(selectedPresetData)
            : null,
          scenario: selectedScenario
            ? SCENARIOS.find((s) => s.id === selectedScenario)?.prompt
            : null,
          sliders: isPro && showAdvanced ? sliders : null,
          analyzeQuality: isPro,
          isPro,
        }),
      });

      if (!res.ok) {
        const err = await res
          .json()
          .catch(() => ({ error: `Error del servidor: ${res.status}` }));
        throw new Error(err.error || "Fallo en el generador");
      }

      const data = await res.json();
      setResponse(data.prompt || "No se recibió respuesta del generador.");
      if (data.qualityAnalysis) setQualityAnalysis(data.qualityAnalysis);
      showToast("Prompt generado correctamente");

      await refreshProfile();
    } catch (err) {
      console.error(err);
      setResponse("Hubo un error generando el prompt. Intenta de nuevo.");
      showToast("Error generando prompt.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleApplySuggestions = async () => {
    if (!qualityAnalysis || !qualityAnalysis.suggestions?.length) return;

    setIsApplyingSuggestions(true);
    try {
      const res = await fetch("/api/gemini-processor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          applySuggestions: true,
          currentPrompt: response,
          suggestions: qualityAnalysis.suggestions,
          isPro,
        }),
      });
      if (!res.ok) {
        const err = await res
          .json()
          .catch(() => ({ error: `Error del servidor: ${res.status}` }));
        throw new Error(err.error || "Fallo aplicando sugerencias");
      }
      const data = await res.json();
      setResponse(data.prompt || response);
      setQualityAnalysis(null);
      showToast("Sugerencias aplicadas.");
    } catch (e) {
      console.error(e);
      alert(`Error: ${e.message || "Fallo aplicando sugerencias"}`);
    } finally {
      setIsApplyingSuggestions(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(response);
    setCopied(true);
    showToast("Prompt copiado");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleUseInGemini = () => {
    navigator.clipboard.writeText(response);
    window.open(
      "https://gemini.google.com/app",
      "_blank",
      "noopener,noreferrer"
    );
    showToast("Prompt copiado. Abriendo Gemini...");
  };

  return (
    <section id="prompt-generator" className="py-24 px-4 bg-black/20">
      <div className="max-w-6xl mx-auto">
        {/* ALERTA DE CRÉDITOS */}
        {user && profile && profile.credits <= 3 && (
          <div
            className={`mb-6 p-4 rounded-lg border ${
              profile.credits === 0
                ? "bg-red-500/10 border-red-500/30"
                : "bg-[var(--primary)]/10 border-[var(--primary)]/30"
            }`}
          >
            <p
              className={`font-bold ${
                profile.credits === 0 ? "text-red-400" : "text-[var(--primary)]"
              }`}
            >
              {profile.credits === 0
                ? "⚠️ No tienes créditos. Actualiza tu plan para continuar."
                : `⚠️ Te quedan ${profile.credits} crédito${
                    profile.credits === 1 ? "" : "s"
                  }.`}
            </p>
            {profile.plan === "free" && (
              <a
                href="#planes"
                className="text-[var(--primary)] hover:opacity-90 text-sm font-semibold mt-2 inline-block"
              >
                Ver planes →
              </a>
            )}
          </div>
        )}

        <AnimatedSection className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-heading mb-4">
            Generador de Prompts{" "}
            <span className="text-[var(--primary)]">PROMPTRAITS</span>
          </h2>
          <p className="text-gray-400 text-lg">
            Describe tu idea o sube una imagen de referencia para generar un
            prompt profesional.
          </p>
        </AnimatedSection>

        <div className="bg-white/5 border border-[var(--border)] rounded-2xl p-6">
          <form onSubmit={handleGenerate} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2">
                <label
                  htmlFor="inputText"
                  className="block text-sm font-medium text-gray-300 mb-2"
                >
                  Describe tu idea:
                </label>
                <textarea
                  id="inputText"
                  rows="8"
                  className="w-full h-full bg-black/50 border border-[var(--border)] rounded-lg p-3 text-gray-300 focus:ring-2 focus:ring-[var(--primary)] resize-none"
                  placeholder="Ej: un retrato cinematográfico en una calle europea al atardecer..."
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                ></textarea>
              </div>

              <div className="flex flex-col">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Imagen de referencia:
                </label>
                {!imagePreview ? (
                  <label
                    htmlFor="referenceImagePrompt-Gen"
                    className="flex-1 flex flex-col items-center justify-center bg-[var(--surface)]/30 border-2 border-dashed border-[var(--border)] rounded-lg cursor-pointer hover:bg-[var(--surface)]/40 transition-all p-4"
                  >
                    <Upload className="w-8 h-8 text-[var(--primary)] mb-2" />
                    <span className="text-sm font-semibold text-center">
                      Subir imagen
                    </span>
                    <span className="text-xs text-gray-400 mt-1 text-center">
                      Opcional
                    </span>
                  </label>
                ) : (
                  <div className="relative flex-1 rounded-lg overflow-hidden border border-[var(--border)]">
                    <img
                      src={imagePreview}
                      alt="Referencia"
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={removeImage}
                      className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white p-2 rounded-full transition-all shadow-lg"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                )}
                <input
                  id="referenceImagePrompt-Gen"
                  type="file"
                  className="hidden"
                  onChange={handleImageChange}
                  accept="image/*"
                />
              </div>
            </div>

            {/* ✅ PRESETS FREE - BOTONES COMPACTOS */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-3">
                🎨 Presets Básicos (GRATIS):
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
                {freePresets.map((preset) => (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() =>
                      setSelectedPreset(
                        selectedPreset === preset.id ? null : preset.id
                      )
                    }
                    className={`px-3 py-2 rounded-lg text-center transition-all text-xs font-semibold ${
                      selectedPreset === preset.id
                        ? "bg-[var(--primary)]/20 border-2 border-[var(--primary)] text-white shadow-sm"
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
                disabled={isLoading || (!prompt && !referenceImage)}
                className="w-full bg-[var(--primary)] text-black px-6 py-3 rounded-full font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transition-all"
              >
                {isLoading ? "Generando..." : "Generar Prompt"}
              </button>
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
        </div>
      </div>
    </section>
  );
}
