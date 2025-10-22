import React, { useState, useEffect } from "react";
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
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import QualityAnalysis from "./QualityAnalysis";

// PRESETS (15 estilos profesionales)
const PRESETS = [
  {
    id: 1,
    name: "Cinematográfico Editorial",
    subtitle: "Low-Key Rembrandt",
    free: true,
    promptBlock:
      "Ultra-realistic editorial portrait, 85mm f/1.4, Rembrandt lighting...",
  },
  {
    id: 2,
    name: "Golden Hour Lifestyle",
    subtitle: "Cálido atardecer",
    free: true,
    promptBlock: "Warm golden hour portrait, 50mm f/1.8...",
  },
  {
    id: 3,
    name: "Corporate Clean",
    subtitle: "High-Key profesional",
    free: true,
    promptBlock: "High-key professional headshot...",
  },
  {
    id: 4,
    name: "Environmental Portrait",
    subtitle: "Sujeto en su entorno",
    free: false,
    promptBlock: "Environmental portrait...",
  },
  {
    id: 5,
    name: "Beauty Soft Front",
    subtitle: "Beauty homogéneo",
    free: false,
    promptBlock: "Beauty portrait...",
  },
  {
    id: 6,
    name: "B/N Clásico Film",
    subtitle: "Monocromo atemporal",
    free: false,
    promptBlock: "Classic black and white portrait...",
  },
  {
    id: 7,
    name: "Fotografía Urbana Street",
    subtitle: "Energía callejera",
    free: false,
    promptBlock: "Urban street photography...",
  },
  {
    id: 8,
    name: "Ensueño Vintage 70s",
    subtitle: "Nostálgico y cálido",
    free: false,
    promptBlock: "Vintage 70s dreamy portrait...",
  },
  {
    id: 9,
    name: "Film Noir Clásico",
    subtitle: "Drama B/N años 40-50",
    free: false,
    promptBlock: "Classic film noir portrait...",
  },
  {
    id: 10,
    name: "Neón Cyberpunk",
    subtitle: "Futurista urbano nocturno",
    free: false,
    promptBlock: "Cyberpunk neon portrait...",
  },
  {
    id: 11,
    name: "Retrato Íntimo Ventana",
    subtitle: "Luz natural pensativa",
    free: false,
    promptBlock: "Intimate window light portrait...",
  },
  {
    id: 12,
    name: "Acción Deportiva Congelado",
    subtitle: "Movimiento nítido",
    free: false,
    promptBlock: "Frozen sports action...",
  },
  {
    id: 13,
    name: "Producto Minimalista Lujo",
    subtitle: "Elegante y limpio",
    free: false,
    promptBlock: "Luxury minimalist product...",
  },
  {
    id: 14,
    name: "Fantasía Surrealista Etéreo",
    subtitle: "Onírico y de otro mundo",
    free: false,
    promptBlock: "Surreal ethereal fantasy...",
  },
  {
    id: 15,
    name: "Editorial Fashion",
    subtitle: "Alta moda dramática",
    free: false,
    promptBlock: "Editorial fashion portrait...",
  },
];

// SCENARIOS (8 escenarios)
const SCENARIOS = [
  {
    id: 1,
    name: "Estudio Fondo Negro",
    description: "Minimalista, dramático, fondo oscuro",
    prompt: "Professional studio with seamless black backdrop...",
  },
  {
    id: 2,
    name: "Calle Europea Atardecer",
    description: "Arquitectura clásica, luz dorada",
    prompt: "Narrow European street at golden hour...",
  },
  {
    id: 3,
    name: "Playa Amanecer Contraluz",
    description: "Costa, luz suave, horizonte marino",
    prompt: "Sandy beach at sunrise...",
  },
  {
    id: 4,
    name: "Urbano Nocturno Neones",
    description: "Ciudad de noche, luces vibrantes",
    prompt: "Night city street with neon signs...",
  },
  {
    id: 5,
    name: "Interior Ventana Natural",
    description: "Luz de ventana lateral suave",
    prompt: "Indoor setting with large window as single light source...",
  },
  {
    id: 6,
    name: "Bosque Niebla Atmosférico",
    description: "Naturaleza, bruma, luz filtrada",
    prompt: "Misty forest setting...",
  },
  {
    id: 7,
    name: "Azotea Ciudad Atardecer",
    description: "Skyline urbano, golden hour",
    prompt: "Rooftop location at sunset...",
  },
  {
    id: 8,
    name: "Industrial Warehouse Oscuro",
    description: "Grungy, luces prácticas, textura",
    prompt: "Dark industrial warehouse...",
  },
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

  const handleGenerate = async (e) => {
    e && e.preventDefault();

    if (!user) {
      setResponse("Inicia sesión para generar.");
      return;
    }
    if (profile?.credits <= 0) {
      setResponse(
        "No tienes créditos disponibles. Compra créditos o suscríbete."
      );
      return;
    }

    setIsLoading(true);
    setResponse("");
    setQualityAnalysis(null);

    try {
      let imageBase64 = null;
      if (referenceImage) {
        imageBase64 = await fileToBase64(referenceImage);
      }

      const res = await fetch("/api/gemini-processor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt,
          referenceImage: imageBase64,
          mimeType: referenceImage ? referenceImage.type : null,
          preset: selectedPreset
            ? PRESETS.find((p) => p.id === selectedPreset)?.promptBlock
            : null,
          scenario: selectedScenario
            ? SCENARIOS.find((s) => s.id === selectedScenario)?.prompt
            : null,
          sliders,
          isPro: profile?.plan === "pro",
          analyzeQuality: false,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Error al generar prompt");
      }

      const data = await res.json();
      setResponse(data.prompt || "No se recibió respuesta del generador.");
      if (data.qualityAnalysis) setQualityAnalysis(data.qualityAnalysis);

      await refreshProfile();
    } catch (error) {
      console.error("Error al generar:", error);
      setResponse(`Error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleApplySuggestions = async () => {
    if (!qualityAnalysis?.suggestions?.length) return;
    setIsApplyingSuggestions(true);
    try {
      const res = await fetch("/api/gemini-processor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: response,
          applyFixes: true,
          suggestions: qualityAnalysis.suggestions,
        }),
      });
      const data = await res.json();
      if (data.prompt) setResponse(data.prompt);
    } catch (error) {
      console.error("Error aplicando sugerencias:", error);
    } finally {
      setIsApplyingSuggestions(false);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(response);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Error al copiar:", err);
    }
  };

  const isPro = profile?.plan === "pro" || profile?.plan === "premium";

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 py-20 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] rounded-full mb-6">
            <Sparkles className="w-5 h-5 text-white" />
            <span className="text-white font-semibold">Generador Avanzado</span>
          </div>
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
            Generador Profesional de Prompts
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Presets, escenarios, imagen de referencia y controles avanzados
          </p>
        </div>

        {/* Créditos */}
        {user && profile && (
          <div className="bg-white/5 border border-white/10 rounded-xl p-4 mb-8 text-center">
            <p className="text-gray-400">
              Créditos disponibles:{" "}
              <span className="text-2xl font-bold text-[var(--primary)]">
                {profile.credits}
              </span>
            </p>
            <p className="text-sm text-gray-500 mt-1">
              Plan:{" "}
              <span className="text-[var(--primary)] font-semibold">
                {profile.plan || "FREE"}
              </span>
            </p>
          </div>
        )}

        {/* Formulario Principal */}
        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-8 mb-8">
          <div className="space-y-6">
            {/* Descripción */}
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">
                Describe tu idea *
              </label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Ej: un retrato cinematográfico en una calle europea al atardecer..."
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[var(--primary)] transition resize-none"
                rows={3}
                disabled={isLoading}
              />
            </div>

            {/* Upload de Imagen */}
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">
                <Upload className="w-4 h-4 inline mr-2" />
                Imagen de referencia (opcional)
              </label>
              {!imagePreview ? (
                <label className="block w-full border-2 border-dashed border-white/10 rounded-xl p-8 text-center cursor-pointer hover:border-[var(--primary)] transition">
                  <Camera className="w-12 h-12 mx-auto mb-3 text-gray-500" />
                  <span className="text-gray-400">Click para subir imagen</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                    disabled={isLoading}
                  />
                </label>
              ) : (
                <div className="relative rounded-xl overflow-hidden border border-white/10">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-48 object-cover"
                  />
                  <button
                    onClick={removeImage}
                    className="absolute top-2 right-2 p-2 bg-red-500 rounded-full hover:bg-red-600 transition"
                  >
                    <Trash2 className="w-4 h-4 text-white" />
                  </button>
                </div>
              )}
            </div>

            {/* Presets */}
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-3">
                🎨 Presets Profesionales (selecciona uno):
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-h-64 overflow-y-auto">
                {PRESETS.map((preset) => (
                  <button
                    key={preset.id}
                    onClick={() =>
                      setSelectedPreset(
                        preset.id === selectedPreset ? null : preset.id
                      )
                    }
                    disabled={!preset.free && !isPro}
                    className={`p-3 rounded-lg border text-left transition ${
                      selectedPreset === preset.id
                        ? "border-[var(--primary)] bg-[var(--primary)]/10"
                        : "border-white/10 bg-white/5 hover:border-white/20"
                    } ${
                      !preset.free && !isPro
                        ? "opacity-50 cursor-not-allowed"
                        : ""
                    }`}
                  >
                    <div className="font-semibold text-sm text-white">
                      {preset.name}
                    </div>
                    <div className="text-xs text-gray-400 mt-1">
                      {preset.subtitle}
                    </div>
                    {!preset.free && !isPro && (
                      <div className="text-xs text-[var(--primary)] mt-1">
                        🔒 PRO
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Scenarios */}
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-3">
                📍 Escenarios (selecciona uno):
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {SCENARIOS.map((scenario) => (
                  <button
                    key={scenario.id}
                    onClick={() =>
                      setSelectedScenario(
                        scenario.id === selectedScenario ? null : scenario.id
                      )
                    }
                    className={`p-3 rounded-lg border text-left transition ${
                      selectedScenario === scenario.id
                        ? "border-[var(--primary)] bg-[var(--primary)]/10"
                        : "border-white/10 bg-white/5 hover:border-white/20"
                    }`}
                  >
                    <div className="font-semibold text-sm text-white">
                      {scenario.name}
                    </div>
                    <div className="text-xs text-gray-400 mt-1">
                      {scenario.description}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Controles Avanzados */}
            <div>
              <button
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="flex items-center gap-2 text-sm font-semibold text-gray-300 hover:text-white transition"
              >
                {showAdvanced ? (
                  <ChevronUp className="w-4 h-4" />
                ) : (
                  <ChevronDown className="w-4 h-4" />
                )}
                Controles Avanzados{" "}
                {isPro && (
                  <span className="text-[var(--primary)] text-xs">PRO</span>
                )}
              </button>

              {showAdvanced && isPro && (
                <div className="mt-4 space-y-4 p-4 bg-white/5 rounded-lg border border-white/10">
                  <div>
                    <label className="text-xs text-gray-400">
                      Apertura (f-stop): {sliders.aperture}
                    </label>
                    <input
                      type="range"
                      min="1.4"
                      max="16"
                      step="0.1"
                      value={sliders.aperture}
                      onChange={(e) =>
                        setSliders({
                          ...sliders,
                          aperture: parseFloat(e.target.value),
                        })
                      }
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-400">
                      Distancia Focal (mm): {sliders.focalLength}
                    </label>
                    <input
                      type="range"
                      min="24"
                      max="200"
                      step="1"
                      value={sliders.focalLength}
                      onChange={(e) =>
                        setSliders({
                          ...sliders,
                          focalLength: parseInt(e.target.value),
                        })
                      }
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-400">
                      Temperatura de Color (K): {sliders.temperature}
                    </label>
                    <input
                      type="range"
                      min="2500"
                      max="9000"
                      step="100"
                      value={sliders.temperature}
                      onChange={(e) =>
                        setSliders({
                          ...sliders,
                          temperature: parseInt(e.target.value),
                        })
                      }
                      className="w-full"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Botón Generar */}
            <button
              onClick={handleGenerate}
              disabled={
                isLoading ||
                !prompt.trim() ||
                !user ||
                (profile && profile.credits < 1)
              }
              className="w-full py-4 rounded-xl bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] text-white font-bold text-lg hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Generando con IA...
                </>
              ) : (
                <>
                  <Wand2 className="w-5 h-5" />
                  Generar Prompt Profesional
                </>
              )}
            </button>
          </div>
        </div>

        {/* Resultado */}
        {response && (
          <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-8 animate-fade-in">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-white">
                Tu Prompt Generado
              </h3>
              <button
                onClick={handleCopy}
                className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg transition"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 text-green-500" />
                    <span className="text-green-500 text-sm font-semibold">
                      Copiado
                    </span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-400 text-sm font-semibold">
                      Copiar
                    </span>
                  </>
                )}
              </button>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-xl p-6 mb-6">
              <p className="text-white leading-relaxed whitespace-pre-wrap">
                {response}
              </p>
            </div>

            {qualityAnalysis && (
              <QualityAnalysis
                analysis={qualityAnalysis}
                isPro={isPro}
                onApplySuggestions={handleApplySuggestions}
                isApplying={isApplyingSuggestions}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
}
