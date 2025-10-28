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
  Image as ImageIcon,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { supabase } from "../lib/supabase";
import AnimatedSection from "./AnimatedSection";
import QualityAnalysis from "./QualityAnalysis";

// ✅ IMPORTAR DATOS
import {
  presetsData,
  getFreePresets,
} from "../data/presetsData";

import { SHOT_TYPES } from "../data/shotTypesData";
import { OUTFIT_STYLES } from "../data/outfitStylesData";
import { ENVIRONMENTS } from "../data/environmentsData";

// ============================================================================
// ✨ CARACTERÍSTICAS RÁPIDAS (Solo 1 seleccionable)
// ============================================================================
const QUICK_FEATURES = [
  {
    id: 'professional-lighting',
    name: 'Iluminación Profesional',
    description: 'Rembrandt, Butterfly o Loop lighting con ratio 3:1',
  },
  {
    id: 'bokeh',
    name: 'Fondo Desenfocado (Bokeh)',
    description: 'Shallow depth of field con 85mm f/1.2',
  },
  {
    id: 'cinematic',
    name: 'Look Cinematográfico',
    description: 'Black Pro-Mist filter effect para look de película',
  },
  {
    id: 'golden-hour',
    name: 'Golden Hour',
    description: 'Luz cálida mágica de atardecer, 5500K',
  },
  {
    id: 'smooth-skin',
    name: 'Piel Suave y Uniforme',
    description: 'Skin tone uniformity con textura preservada',
  },
  {
    id: 'teal-orange',
    name: 'Teal & Orange',
    description: 'Color grading cinematográfico estilo Hollywood',
  },
];

// ============================================================================
// ✨ HERRAMIENTAS PRO - DATOS
// ============================================================================

const LIGHTING_SCHEMES = [
  { id: 'rembrandt', name: 'Rembrandt', description: '45° con triángulo de luz' },
  { id: 'butterfly', name: 'Butterfly', description: 'Frontal elevada, sombra nariz' },
  { id: 'loop', name: 'Loop', description: '45° elevada, sombra bucle' },
  { id: 'split', name: 'Split', description: 'Lateral 90°, mitad luz/sombra' },
  { id: 'broad', name: 'Broad', description: 'Lado hacia cámara iluminado' },
  { id: 'short', name: 'Short', description: 'Lado alejado iluminado' },
];

const LENSES = [
  { id: '24-35mm', name: '24-35mm', description: 'Gran angular, contexto' },
  { id: '50mm', name: '50mm', description: 'Normal, versátil' },
  { id: '85mm', name: '85mm', description: 'REY del retrato' },
  { id: '135-200mm', name: '135-200mm', description: 'Teleobjetivo, compresión' },
];

const COLOR_GRADING = [
  { id: 'teal-orange', name: 'Teal & Orange', description: 'Hollywood blockbuster' },
  { id: 'vintage', name: 'Vintage Film', description: 'Tonos pastel, contraste suave' },
  { id: 'high-key', name: 'High-Key', description: 'Brillante, optimista' },
  { id: 'low-key', name: 'Low-Key', description: 'Oscuro, dramático' },
  { id: 'warm', name: 'Warm Tones', description: 'Tonos cálidos' },
  { id: 'cool', name: 'Cool Tones', description: 'Tonos fríos' },
];

const FILTERS = [
  { id: 'black-pro-mist', name: 'Black Pro-Mist', description: 'Look cinematográfico' },
  { id: 'nd', name: 'ND Filter', description: 'Largas exposiciones, bokeh' },
  { id: 'polarizer', name: 'Polarizer (CPL)', description: 'Elimina reflejos, satura' },
  { id: 'anamorphic', name: 'Anamorphic Flare', description: 'Destello horizontal azul' },
];

const CAMERA_ANGLES = [
  { id: 'eye-level', name: 'Eye Level', description: 'Neutral, natural' },
  { id: 'high-angle', name: 'High Angle', description: 'Picado, desde arriba' },
  { id: 'low-angle', name: 'Low Angle', description: 'Contrapicado, heroico' },
  { id: 'birds-eye', name: "Bird's Eye", description: 'Cenital, desde arriba' },
  { id: 'dutch', name: 'Dutch Angle', description: 'Inclinado, dinámico' },
  { id: 'selfie', name: 'Selfie Angle', description: 'Brazo extendido, personal' },
];

const COMPOSITION_RULES = [
  { id: 'rule-thirds', name: 'Rule of Thirds', description: 'Clásica, equilibrada' },
  { id: 'golden-ratio', name: 'Golden Ratio', description: 'Proporción áurea' },
  { id: 'centered', name: 'Centered', description: 'Centrado, simétrico' },
  { id: 'leading-lines', name: 'Leading Lines', description: 'Líneas guía' },
  { id: 'negative-space', name: 'Negative Space', description: 'Espacio negativo' },
];

const ASPECT_RATIOS = [
  { id: '1:1', name: '1:1', description: 'Cuadrado (Instagram)' },
  { id: '3:4', name: '3:4', description: 'Vertical retrato' },
  { id: '4:5', name: '4:5', description: 'Vertical Instagram' },
  { id: '9:16', name: '9:16', description: 'Vertical Stories/Reels' },
  { id: '16:9', name: '16:9', description: 'Horizontal panorámico' },
  { id: '4:3', name: '4:3', description: 'Horizontal clásico' },
];

const GENDER_OPTIONS = [
  { id: 'masculine', name: 'Masculino' },
  { id: 'feminine', name: 'Femenino' },
  { id: 'neutral', name: 'Neutral' },
];

export default function AdvancedGenerator() {
  const { user, profile, refreshProfile } = useAuth();
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [referenceImage, setReferenceImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [selectedPreset, setSelectedPreset] = useState(null);
  const [qualityAnalysis, setQualityAnalysis] = useState(null);
  const [isApplyingSuggestions, setIsApplyingSuggestions] = useState(false);
  const [copied, setCopied] = useState(false);
  
  const [selectedPlatform, setSelectedPlatform] = useState('nano-banana');
  const [validation, setValidation] = useState(null);

  // ✨ Solo 1 característica rápida seleccionable
  const [selectedQuickFeature, setSelectedQuickFeature] = useState(null);
  
  const [showProTools, setShowProTools] = useState(false);

  // ✨ Estados para Herramientas PRO
  const [proSettings, setProSettings] = useState({
    lighting: null,
    lens: null,
    colorGrading: null,
    filter: null,
    angle: null,
    composition: null,
    aspectRatio: null,
    gender: 'neutral',
    shotType: null,
    outfit: null,
    environment: null,
  });

  const isPro = profile?.plan === "pro" || profile?.plan === "premium";
  const freePresets = getFreePresets();

  // ✅ Convertir objetos a arrays
  const shotTypesArray = Object.values(SHOT_TYPES);
  const outfitStylesArray = Object.values(OUTFIT_STYLES);
  const environmentsArray = Object.values(ENVIRONMENTS);

  // ============================================================================
  // Si abres PRO, limpias Quick Feature
  // ============================================================================
  const handleToggleProTools = () => {
    if (!showProTools) {
      // Al abrir PRO, limpia quick feature
      setSelectedQuickFeature(null);
    }
    setShowProTools(!showProTools);
  };

  // Si seleccionas Quick Feature, cierras PRO
  const handleSelectQuickFeature = (featureId) => {
    setSelectedQuickFeature(featureId === selectedQuickFeature ? null : featureId);
    if (featureId !== null) {
      setShowProTools(false);
    }
  };

  const updateProSetting = (key, value) => {
    setProSettings(prev => ({
      ...prev,
      [key]: prev[key] === value ? null : value
    }));
  };

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setResponse("");
    setQualityAnalysis(null);
    setValidation(null);

    try {
      let enhancedPrompt = prompt;
      
      if (selectedQuickFeature) {
        const feature = QUICK_FEATURES.find(f => f.id === selectedQuickFeature);
        if (feature) {
          enhancedPrompt = `${prompt}. Apply: ${feature.description}`;
        }
      }

      const payload = {
        prompt: enhancedPrompt,
        referenceImage,
        mimeType: "image/jpeg",
        preset: selectedPreset
          ? presetsData.find((p) => p.id === selectedPreset)?.prompt
          : null,
        analyzeQuality: isPro,
        isPro,
        platform: selectedPlatform,
        proSettings: showProTools ? proSettings : null,
      };

      const res = await fetch("/api/gemini-processor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Error al generar el prompt");
      }

      setResponse(data.prompt);
      setQualityAnalysis(data.qualityAnalysis);
      setValidation(data.validation);

      await supabase
        .from("profiles")
        .update({
          credits: (profile.credits || 0) - 1,
        })
        .eq("id", user.id);

      await refreshProfile();
    } catch (error) {
      console.error("Error:", error);
      alert(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(response);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleUseInGemini = () => {
    const encodedPrompt = encodeURIComponent(response);
    window.open(`https://gemini.google.com/?prompt=${encodedPrompt}`, "_blank");
  };

  const handleApplySuggestions = async (suggestions) => {
    if (!suggestions || !Array.isArray(suggestions) || suggestions.length === 0) {
      return;
    }

    setIsApplyingSuggestions(true);

    try {
      const res = await fetch("/api/gemini-processor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          applySuggestions: true,
          currentPrompt: response,
          suggestions: suggestions,
          isPro,
          platform: selectedPlatform,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Error al aplicar sugerencias");
      }

      setResponse(data.prompt);
      setQualityAnalysis(null);
    } catch (error) {
      console.error("Error al aplicar sugerencias:", error);
      alert("Error al aplicar sugerencias: " + error.message);
    } finally {
      setIsApplyingSuggestions(false);
    }
  };

  return (
    <section className="min-h-screen py-24 px-6">
      <div className="max-w-5xl mx-auto">
        <AnimatedSection>
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Generador Avanzado de Prompts
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Tecnología profesional con Gemini 2.0 Flash Experimental
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* ============================================================================ */}
            {/* 1. INPUT + IMAGEN (80% + 20%) HORIZONTAL */}
            {/* ============================================================================ */}
            <div className="grid grid-cols-1 md:grid-cols-[80%_20%] gap-4">
              {/* INPUT 80% */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Describe lo que quieres generar:
                </label>
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  rows={6}
                  placeholder="Ej: Retrato cinematográfico en un garaje abandonado"
                  className="w-full px-4 py-3 bg-black/40 border border-[var(--border)] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[var(--primary)] transition"
                />
                {referenceImage && (
                  <p className="text-xs text-yellow-400 mt-2">
                    ⚠️ Con imagen: NO describas físicamente a la persona (edad, género, pelo). Solo pose, expresión y outfit.
                  </p>
                )}
              </div>

              {/* IMAGEN 20% */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Imagen de Referencia:
                </label>
                {!imagePreview ? (
                  <label className="flex flex-col items-center justify-center w-full h-[calc(100%-2rem)] border-2 border-dashed border-[var(--border)] rounded-lg cursor-pointer hover:border-[var(--primary)] transition bg-black/20">
                    <Upload size={32} className="text-gray-400 mb-2" />
                    <span className="text-xs text-gray-400 text-center px-2">
                      Sube imagen
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                ) : (
                  <div className="relative h-[calc(100%-2rem)]">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-full object-cover rounded-lg border border-[var(--border)]"
                    />
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full hover:bg-red-600 transition"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* ============================================================================ */}
            {/* 2. PLATAFORMAS DE DESTINO (Sin emojis) */}
            {/* ============================================================================ */}
            <div className="bg-[var(--surface)]/50 border border-[var(--border)] rounded-xl p-6">
              <h3 className="font-semibold text-lg mb-4" style={{ color: 'var(--primary)' }}>
                Plataforma de Destino
              </h3>

              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setSelectedPlatform('nano-banana')}
                  className={`p-4 rounded-lg border-2 transition-all text-left ${
                    selectedPlatform === 'nano-banana'
                      ? 'border-[var(--primary)] bg-[var(--primary)]/10'
                      : 'border-[var(--border)] bg-black/20 hover:border-[var(--primary)]/50'
                  }`}
                >
                  <div className="font-bold mb-1">Nano-Banana</div>
                  <div className="text-xs text-gray-400">Google Gemini</div>
                  <div className="text-xs text-gray-500 mt-1">
                    Imagen.ia • Párrafo continuo
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedPlatform('midjourney')}
                  className={`p-4 rounded-lg border-2 transition-all text-left ${
                    selectedPlatform === 'midjourney'
                      ? 'border-[var(--primary)] bg-[var(--primary)]/10'
                      : 'border-[var(--border)] bg-black/20 hover:border-[var(--primary)]/50'
                  }`}
                >
                  <div className="font-bold mb-1">Midjourney</div>
                  <div className="text-xs text-gray-400">V7</div>
                  <div className="text-xs text-gray-500 mt-1">
                    Parámetros • Control total
                  </div>
                </button>
              </div>
            </div>

            {/* ============================================================================ */}
            {/* 3. CARACTERÍSTICAS RÁPIDAS (Solo 1 seleccionable, sin emojis) */}
            {/* ============================================================================ */}
            <div className="bg-[var(--surface)]/50 border border-[var(--border)] rounded-xl p-6">
              <h3 className="font-semibold text-lg mb-2" style={{ color: 'var(--primary)' }}>
                Características Rápidas
              </h3>
              <p className="text-sm text-gray-400 mb-4">
                Selecciona un efecto profesional (solo uno)
              </p>

              {showProTools && (
                <div className="mb-4 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg text-sm text-yellow-400">
                  Las Características Rápidas están desactivadas porque Herramientas PRO está abierto.
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {QUICK_FEATURES.map((feature) => (
                  <button
                    key={feature.id}
                    type="button"
                    onClick={() => handleSelectQuickFeature(feature.id)}
                    disabled={showProTools}
                    className={`p-4 rounded-lg border-2 transition-all text-left ${
                      selectedQuickFeature === feature.id && !showProTools
                        ? 'border-[var(--primary)] bg-[var(--primary)]/10'
                        : 'border-[var(--border)] bg-black/20 hover:border-[var(--primary)]/30'
                    } ${showProTools ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <div className="font-semibold mb-1" style={{ color: 'var(--primary)' }}>
                      {feature.name}
                    </div>
                    <div className="text-xs text-gray-400">
                      {feature.description}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* ============================================================================ */}
            {/* 4. PRESETS FREE */}
            {/* ============================================================================ */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Presets Gratuitos ({freePresets.length}):
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

            {/* ============================================================================ */}
            {/* 5. BOTÓN GENERAR */}
            {/* ============================================================================ */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading || (!prompt && !referenceImage) || !profile || profile.credits <= 0}
                className="w-full bg-[var(--primary)] text-black px-6 py-4 rounded-full font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transition-all flex items-center justify-center space-x-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="animate-spin" size={20} />
                    <span>Generando prompt profesional...</span>
                  </>
                ) : !profile || profile.credits <= 0 ? (
                  <span>Sin créditos disponibles</span>
                ) : (
                  <>
                    <Sparkles size={20} />
                    <span>Generar Prompt ({profile.credits} créditos)</span>
                  </>
                )}
              </button>
              {profile && (
                <p className="text-xs text-center mt-2 opacity-60">
                  {profile.credits > 0 
                    ? `Tienes ${profile.credits} crédito${profile.credits !== 1 ? 's' : ''} disponible${profile.credits !== 1 ? 's' : ''}`
                    : "No tienes créditos. Actualiza tu plan para continuar."}
                </p>
              )}
            </div>

            {/* ============================================================================ */}
            {/* 6. HERRAMIENTAS PRO (Desplegable al final) */}
            {/* ============================================================================ */}
            <div>
              {!isPro && (
                <div className="mb-3 p-3 bg-[var(--primary)]/10 border border-[var(--primary)] rounded-lg flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Crown className="text-[var(--primary)]" size={20} />
                    <span className="text-sm font-semibold">
                      Desbloquea herramientas PRO
                    </span>
                  </div>
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
                onClick={handleToggleProTools}
                disabled={!isPro}
                className="w-full flex items-center justify-between p-3 bg-[var(--surface)]/30 border border-[var(--border)] rounded-lg hover:border-[var(--primary)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="font-semibold flex items-center space-x-2">
                  <Crown className="w-5 h-5 text-[var(--primary)]" />
                  <span>Herramientas PRO</span>
                  {showProTools && (
                    <span className="text-xs bg-[var(--primary)]/20 text-[var(--primary)] px-2 py-1 rounded">
                      ACTIVO
                    </span>
                  )}
                </span>
                {showProTools ? <ChevronUp /> : <ChevronDown />}
              </button>

              {showProTools && isPro && (
                <div className="mt-3 p-4 bg-black/30 border border-[var(--border)] rounded-lg space-y-6">
                  {/* GÉNERO */}
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: 'var(--primary)' }}>
                      Género (para outfit/maquillaje):
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {GENDER_OPTIONS.map((gender) => (
                        <button
                          key={gender.id}
                          type="button"
                          onClick={() => updateProSetting('gender', gender.id)}
                          className={`p-2 rounded-lg text-sm transition-all ${
                            proSettings.gender === gender.id
                              ? 'bg-[var(--primary)]/10 border-2 border-[var(--primary)]'
                              : 'bg-white/5 border border-[var(--border)] hover:bg-white/10'
                          }`}
                        >
                          {gender.name}
                        </button>
                      ))}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      * NO aparece en el prompt, solo guía el tipo de outfit/maquillaje
                    </p>
                  </div>

                  {/* ILUMINACIÓN */}
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: 'var(--primary)' }}>
                      Iluminación:
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {LIGHTING_SCHEMES.map((light) => (
                        <button
                          key={light.id}
                          type="button"
                          onClick={() => updateProSetting('lighting', light.id)}
                          className={`p-2 rounded-lg text-left text-sm transition-all ${
                            proSettings.lighting === light.id
                              ? 'bg-[var(--primary)]/10 border-2 border-[var(--primary)]'
                              : 'bg-white/5 border border-[var(--border)] hover:bg-white/10'
                          }`}
                        >
                          <div className="font-semibold">{light.name}</div>
                          <div className="text-xs text-gray-400">{light.description}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* LENTE */}
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: 'var(--primary)' }}>
                      Lente:
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                      {LENSES.map((lens) => (
                        <button
                          key={lens.id}
                          type="button"
                          onClick={() => updateProSetting('lens', lens.id)}
                          className={`p-2 rounded-lg text-left text-sm transition-all ${
                            proSettings.lens === lens.id
                              ? 'bg-[var(--primary)]/10 border-2 border-[var(--primary)]'
                              : 'bg-white/5 border border-[var(--border)] hover:bg-white/10'
                          }`}
                        >
                          <div className="font-semibold">{lens.name}</div>
                          <div className="text-xs text-gray-400">{lens.description}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* COLOR GRADING */}
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: 'var(--primary)' }}>
                      Color Grading:
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {COLOR_GRADING.map((grade) => (
                        <button
                          key={grade.id}
                          type="button"
                          onClick={() => updateProSetting('colorGrading', grade.id)}
                          className={`p-2 rounded-lg text-left text-sm transition-all ${
                            proSettings.colorGrading === grade.id
                              ? 'bg-[var(--primary)]/10 border-2 border-[var(--primary)]'
                              : 'bg-white/5 border border-[var(--border)] hover:bg-white/10'
                          }`}
                        >
                          <div className="font-semibold">{grade.name}</div>
                          <div className="text-xs text-gray-400">{grade.description}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* FILTROS */}
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: 'var(--primary)' }}>
                      Filtros Cinematográficos:
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                      {FILTERS.map((filter) => (
                        <button
                          key={filter.id}
                          type="button"
                          onClick={() => updateProSetting('filter', filter.id)}
                          className={`p-2 rounded-lg text-left text-sm transition-all ${
                            proSettings.filter === filter.id
                              ? 'bg-[var(--primary)]/10 border-2 border-[var(--primary)]'
                              : 'bg-white/5 border border-[var(--border)] hover:bg-white/10'
                          }`}
                        >
                          <div className="font-semibold">{filter.name}</div>
                          <div className="text-xs text-gray-400">{filter.description}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* ÁNGULO */}
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: 'var(--primary)' }}>
                      Ángulo de Cámara:
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {CAMERA_ANGLES.map((angle) => (
                        <button
                          key={angle.id}
                          type="button"
                          onClick={() => updateProSetting('angle', angle.id)}
                          className={`p-2 rounded-lg text-left text-sm transition-all ${
                            proSettings.angle === angle.id
                              ? 'bg-[var(--primary)]/10 border-2 border-[var(--primary)]'
                              : 'bg-white/5 border border-[var(--border)] hover:bg-white/10'
                          }`}
                        >
                          <div className="font-semibold">{angle.name}</div>
                          <div className="text-xs text-gray-400">{angle.description}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* COMPOSICIÓN */}
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: 'var(--primary)' }}>
                      Reglas de Composición:
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {COMPOSITION_RULES.map((rule) => (
                        <button
                          key={rule.id}
                          type="button"
                          onClick={() => updateProSetting('composition', rule.id)}
                          className={`p-2 rounded-lg text-left text-sm transition-all ${
                            proSettings.composition === rule.id
                              ? 'bg-[var(--primary)]/10 border-2 border-[var(--primary)]'
                              : 'bg-white/5 border border-[var(--border)] hover:bg-white/10'
                          }`}
                        >
                          <div className="font-semibold">{rule.name}</div>
                          <div className="text-xs text-gray-400">{rule.description}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* ASPECT RATIO */}
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: 'var(--primary)' }}>
                      Aspect Ratio:
                    </label>
                    <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
                      {ASPECT_RATIOS.map((ratio) => (
                        <button
                          key={ratio.id}
                          type="button"
                          onClick={() => updateProSetting('aspectRatio', ratio.id)}
                          className={`p-2 rounded-lg text-left text-sm transition-all ${
                            proSettings.aspectRatio === ratio.id
                              ? 'bg-[var(--primary)]/10 border-2 border-[var(--primary)]'
                              : 'bg-white/5 border border-[var(--border)] hover:bg-white/10'
                          }`}
                        >
                          <div className="font-semibold">{ratio.name}</div>
                          <div className="text-xs text-gray-400">{ratio.description}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* SHOT TYPE */}
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: 'var(--primary)' }}>
                      Shot Type:
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                      {shotTypesArray.map((shot) => (
                        <button
                          key={shot.id}
                          type="button"
                          onClick={() => updateProSetting('shotType', shot.id)}
                          className={`p-2 rounded-lg text-left text-sm transition-all ${
                            proSettings.shotType === shot.id
                              ? 'bg-[var(--primary)]/10 border-2 border-[var(--primary)]'
                              : 'bg-white/5 border border-[var(--border)] hover:bg-white/10'
                          }`}
                        >
                          <div className="font-semibold">{shot.nameEN}</div>
                          <div className="text-xs text-gray-400">{shot.description}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* OUTFIT */}
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: 'var(--primary)' }}>
                      Outfit Style:
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 max-h-64 overflow-y-auto">
                      {outfitStylesArray.map((outfit) => (
                        <button
                          key={outfit.id}
                          type="button"
                          onClick={() => updateProSetting('outfit', outfit.id)}
                          className={`p-2 rounded-lg text-left text-sm transition-all ${
                            proSettings.outfit === outfit.id
                              ? 'bg-[var(--primary)]/10 border-2 border-[var(--primary)]'
                              : 'bg-white/5 border border-[var(--border)] hover:bg-white/10'
                          }`}
                        >
                          <div className="font-semibold">{outfit.name}</div>
                          <div className="text-xs text-gray-400">{outfit.description}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* ENVIRONMENT */}
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: 'var(--primary)' }}>
                      Environment:
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 max-h-64 overflow-y-auto">
                      {environmentsArray.map((env) => (
                        <button
                          key={env.id}
                          type="button"
                          onClick={() => updateProSetting('environment', env.id)}
                          className={`p-2 rounded-lg text-left text-sm transition-all ${
                            proSettings.environment === env.id
                              ? 'bg-[var(--primary)]/10 border-2 border-[var(--primary)]'
                              : 'bg-white/5 border border-[var(--border)] hover:bg-white/10'
                          }`}
                        >
                          <div className="font-semibold">{env.name}</div>
                          <div className="text-xs text-gray-400">{env.category}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
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

          {/* RESULTADO */}
          <div className="mt-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-lg">Prompt Generado:</h3>
              {response && validation && (
                <div className={`text-sm px-3 py-1 rounded-full ${
                  validation.optimal 
                    ? 'bg-green-500/20 text-green-400 border border-green-500/50'
                    : validation.acceptable
                    ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/50'
                    : 'bg-red-500/20 text-red-400 border border-red-500/50'
                }`}>
                  {validation.length} caracteres • {validation.message}
                </div>
              )}
            </div>

            <div className="bg-black/40 border border-[var(--border)] rounded-lg p-4">
              <pre className="text-gray-300 whitespace-pre-wrap font-sans text-sm">
                {response || "Aquí aparecerá el prompt generado..."}
              </pre>
              {response && (
                <>
                  <div className="mt-4 p-3 bg-[var(--primary)]/10 border border-[var(--primary)]/30 rounded-lg text-sm">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="font-semibold">Optimizado para {selectedPlatform === 'nano-banana' ? 'Nano-Banana (Google Gemini)' : 'Midjourney V7'}</span>
                    </div>
                    {selectedPlatform === 'midjourney' && (
                      <div className="text-xs text-gray-400">
                        Los parámetros están al final del prompt. Puedes ajustar --ar, --s, --q según necesites.
                      </div>
                    )}
                    {selectedPlatform === 'nano-banana' && (
                      <div className="text-xs text-gray-400">
                        Este prompt está optimizado como párrafo continuo. Si no especificaste orientación, generará formato cuadrado (1:1).
                      </div>
                    )}
                  </div>

                  <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
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

                    {selectedPlatform === 'nano-banana' && (
                      <button
                        type="button"
                        onClick={handleUseInGemini}
                        className="w-full flex items-center justify-center space-x-2 bg-[var(--primary)] text-black px-4 py-3 rounded-lg font-bold hover:shadow transition"
                      >
                        <Send size={18} />
                        <span>Usar en Gemini</span>
                      </button>
                    )}

                    {selectedPlatform === 'midjourney' && (
                      <button
                        type="button"
                        onClick={() => window.open('https://www.midjourney.com', '_blank')}
                        className="w-full flex items-center justify-center space-x-2 bg-[var(--primary)] text-black px-4 py-3 rounded-lg font-bold hover:shadow transition"
                      >
                        <ImageIcon size={18} />
                        <span>Ir a Midjourney</span>
                      </button>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
