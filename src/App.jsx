import React, { useState, useMemo } from "react";
import { Camera, Check, Instagram, Send, Menu, X, Download, Copy, Gift, Crown, Lock, ChevronDown, ChevronUp, Lightbulb, Trash2, Upload, Sparkles } from "lucide-react";

import { useAuth } from './contexts/AuthContext.jsx';
import { supabase } from './lib/supabase.js';

import AnimatedSection from './components/AnimatedSection.jsx';
import CategoryTabs from './components/CategoryTabs.jsx';

import Login from './components/Auth/Login.jsx';
import Register from './components/Auth/Register.jsx';
import UserMenu from './components/Auth/UserMenu.jsx';
import Profile from './components/Auth/Profile.jsx';
import Checkout from './components/Auth/Checkout.jsx';

// si usas este componente en el JSX:
import QualityAnalysis from './components/QualityAnalysis.jsx';

// prompts externos
import { ALL_PROMPTS } from './data/prompts.js';


const CATEGORIES = [
  { id: 'todos', name: 'Todos' },
  { id: 'hombre', name: 'Hombre' },
  { id: 'mujer', name: 'Mujer' },
  { id: 'mascotas', name: 'Mascotas' },
  { id: 'halloween', name: 'Halloween' },
  { id: 'pareja', name: 'Parejas' }
];

// PRESETS (3 free + 12 pro)
const PRESETS = [
  { id: 1, name: "CinematogrÃ¡fico Editorial", subtitle: "Low-Key Rembrandt", free: true, promptBlock: "Ultra-realistic editorial portrait, 85mm f/1.4, Rembrandt lighting..." },
  { id: 2, name: "Golden Hour Lifestyle", subtitle: "CÃ¡lido atardecer", free: true, promptBlock: "Warm golden hour portrait, 50mm f/1.8..." },
  { id: 3, name: "Corporate Clean", subtitle: "High-Key profesional", free: true, promptBlock: "High-key professional headshot..." },
  { id: 4, name: "Environmental Portrait", subtitle: "Sujeto en su entorno", free: false, promptBlock: "Environmental portrait..." },
  { id: 5, name: "Beauty Soft Front", subtitle: "Beauty homogÃ©neo", free: false, promptBlock: "Beauty portrait..." },
  { id: 6, name: "B/N ClÃ¡sico Film", subtitle: "Monocromo atemporal", free: false, promptBlock: "Classic black and white portrait..." },
  { id: 7, name: "FotografÃ­a Urbana Street", subtitle: "EnergÃ­a callejera", free: false, promptBlock: "Urban street photography..." },
  { id: 8, name: "EnsueÃ±o Vintage 70s", subtitle: "NostÃ¡lgico y cÃ¡lido", free: false, promptBlock: "Vintage 70s dreamy portrait..." },
  { id: 9, name: "Film Noir ClÃ¡sico", subtitle: "Drama B/N aÃ±os 40-50", free: false, promptBlock: "Classic film noir portrait..." },
  { id: 10, name: "NeÃ³n Cyberpunk", subtitle: "Futurista urbano nocturno", free: false, promptBlock: "Cyberpunk neon portrait..." },
  { id: 11, name: "Retrato Ãntimo Ventana", subtitle: "Luz natural pensativa", free: false, promptBlock: "Intimate window light portrait..." },
  { id: 12, name: "AcciÃ³n Deportiva Congelado", subtitle: "Movimiento nÃ­tido", free: false, promptBlock: "Frozen sports action..." },
  { id: 13, name: "Producto Minimalista Lujo", subtitle: "Elegante y limpio", free: false, promptBlock: "Luxury minimalist product..." },
  { id: 14, name: "FantasÃ­a Surrealista EtÃ©reo", subtitle: "OnÃ­rico y de otro mundo", free: false, promptBlock: "Surreal ethereal fantasy..." },
  { id: 15, name: "Editorial Fashion", subtitle: "Alta moda dramÃ¡tica", free: false, promptBlock: "Editorial fashion portrait..." }
];

const SCENARIOS = [
  { id: 1, name: "Estudio Fondo Negro", description: "Minimalista, dramÃ¡tico, fondo oscuro", prompt: "Professional studio with seamless black backdrop..." },
  { id: 2, name: "Calle Europea Atardecer", description: "Arquitectura clÃ¡sica, luz dorada", prompt: "Narrow European street at golden hour..." },
  { id: 3, name: "Playa Amanecer Contraluz", description: "Costa, luz suave, horizonte marino", prompt: "Sandy beach at sunrise..." },
  { id: 4, name: "Urbano Nocturno Neones", description: "Ciudad de noche, luces vibrantes", prompt: "Night city street with neon signs..." },
  { id: 5, name: "Interior Ventana Natural", description: "Luz de ventana lateral suave", prompt: "Indoor setting with large window as single light source..." },
  { id: 6, name: "Bosque Niebla AtmosfÃ©rico", description: "Naturaleza, bruma, luz filtrada", prompt: "Misty forest setting..." },
  { id: 7, name: "Azotea Ciudad Atardecer", description: "Skyline urbano, golden hour", prompt: "Rooftop location at sunset..." },
  { id: 8, name: "Industrial Warehouse Oscuro", description: "Grungy, luces prÃ¡cticas, textura", prompt: "Dark industrial warehouse..." }
];

// Packs de recarga
const CREDIT_PACKS = [
  { credits: 20, price: "3.99" },
  { credits: 50, price: "8.99" },
  { credits: 100, price: "15.99" }
];

// Planes y crÃ©ditos (segÃºn tu especificaciÃ³n)
const SUBSCRIPTION_PLANS = [
  {
    name: "FREE",
    price: "0",
    priceLabel: "Gratis",
    period: "por registrarte",
    popular: false,
    credits: 5,
    features: ["5 crÃ©ditos al registrarte", "Newsletter con consejos y trucos", "4 prompts exclusivos al mes"]
  },
  {
    name: "PRO",
    price: "6.99",
    priceLabel: "6.99â‚¬",
    period: "/mes",
    popular: true,
    credits: 60,
    features: ["60 crÃ©ditos/mes", "3 prompts personalizados (24â€“48h)", "Revisiones incluidas", "8 prompts exclusivos al mes"]
  },
  {
    name: "PREMIUM",
    price: "19.99",
    priceLabel: "19.99â‚¬",
    period: "/mes",
    popular: false,
    credits: 300,
    features: ["300 crÃ©ditos/mes", "Acceso al agente personalizado", "AsesorÃ­a 1 a 1", "5 prompts personalizados"]
  }
];

// GEMINI ASSISTANT VIEW
const GeminiAssistantView = ({ onCopy, isPro }) => {
  const { user, profile } = useAuth();
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
  const [sliders, setSliders] = useState({
    aperture: 2.8,
    focalLength: 85,
    contrast: "medium",
    grain: "subtle",
    temperature: 5500
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

  // helper: convertir File -> base64 (solo la parte base64)
  const fileToBase64 = (file) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      try {
        const parts = String(reader.result).split(',');
        resolve(parts[1] || null); // solo base64
      } catch (err) { resolve(null); }
    };
    reader.onerror = (err) => reject(err);
  });

  // GeneraciÃ³n real: llamada al endpoint /api/gemini-processor
  const handleGenerate = async (e) => {
    e && e.preventDefault();

    if (!user) {
      setResponse("Inicia sesiÃ³n para generar.");
      window.App_showToast?.("Inicia sesiÃ³n para generar.");
      return;
    }
    if (profile?.credits <= 0) {
      setResponse("No tienes crÃ©ditos disponibles. Compra crÃ©ditos o suscrÃ­bete.");
      window.App_showToast?.("No tienes crÃ©ditos.");
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

      const res = await fetch('/api/gemini-processor', {
        method: 'POST',
        headers: { 'Content-Type':'application/json' },
        body: JSON.stringify({
          prompt,
          referenceImage: imageBase64,              // base64 puro
          mimeType: referenceImage ? referenceImage.type : null,
          preset: selectedPreset ? PRESETS.find(p => p.id === selectedPreset)?.promptBlock : null,
          scenario: selectedScenario ? SCENARIOS.find(s => s.id === selectedScenario)?.prompt : null,
          sliders: isPro && showAdvanced ? sliders : null,
          analyzeQuality: isPro,
          isPro
        })
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: `Error del servidor: ${res.status}` }));
        throw new Error(err.error || 'Fallo en el generador');
      }

      const data = await res.json();
      setResponse(data.prompt || "No se recibiÃ³ respuesta del generador.");
      if (data.qualityAnalysis) setQualityAnalysis(data.qualityAnalysis);
      window.App_showToast?.("Prompt generado.");
    } catch (err) {
      console.error(err);
      setResponse("Hubo un error generando el prompt. Intenta de nuevo.");
      window.App_showToast?.("Error generando prompt.");
    } finally {
      setIsLoading(false);
    }
  };

  // Aplicar sugerencias (llama al mismo endpoint pidiendo aplicar sugerencias)
  const handleApplySuggestions = async () => {
    if (!qualityAnalysis || !qualityAnalysis.suggestions?.length) return;

    setIsApplyingSuggestions(true);
    try {
      const res = await fetch('/api/gemini-processor', {
        method: 'POST',
        headers: { 'Content-Type':'application/json' },
        body: JSON.stringify({
          applySuggestions: true,
          currentPrompt: response,
          suggestions: qualityAnalysis.suggestions,
          isPro
        })
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: `Error del servidor: ${res.status}` }));
        throw new Error(err.error || 'Fallo aplicando sugerencias');
      }
      const data = await res.json();
      setResponse(data.prompt || response);
      setQualityAnalysis(null);
      window.App_showToast?.("Sugerencias aplicadas.");
    } catch (e) {
      console.error(e);
      alert(`Error: ${e.message || 'Fallo aplicando sugerencias'}`);
    } finally {
      setIsApplyingSuggestions(false);
    }
  };
  return (
    <section id="prompt-generator" className="py-24 px-4 bg-black/20">
      <div className="max-w-6xl mx-auto">
        {/* ALERTA DE CRÃ‰DITOS */}
        {user && profile && profile.credits <= 3 && (
          <div className={`mb-6 p-4 rounded-lg border ${profile.credits === 0 ? 'bg-red-500/10 border-red-500/30' : 'bg-[color:var(--primary)]/10 border-[color:var(--primary)]/30'}`}>
            <p className={`font-bold ${profile.credits === 0 ? 'text-red-400' : 'text-[color:var(--primary)]'}`}>
              {profile.credits === 0
                ? 'âš ï¸ No tienes crÃ©ditos. Actualiza tu plan para continuar.'
                : `âš ï¸ Te quedan ${profile.credits} crÃ©dito${profile.credits === 1 ? '' : 's'}.`
              }
            </p>
            {profile.plan === 'free' && (
              <a href="#planes" className="text-[color:var(--primary)] hover:opacity-90 text-sm font-semibold mt-2 inline-block">Ver planes â†’</a>
            )}
          </div>
        )}

        <AnimatedSection className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-heading mb-4">
            Generador de Prompts <span className="text-[color:var(--primary)]">PROMPTRAITS</span>
          </h2>
          <p className="text-gray-400 text-lg">Describe tu idea o sube una imagen de referencia para generar un prompt profesional.</p>
        </AnimatedSection>

        <div className="bg-white/5 border border-[color:var(--border)] rounded-2xl p-6">
          <form onSubmit={handleGenerate} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2">
                <label htmlFor="inputText" className="block text-sm font-medium text-gray-300 mb-2">Describe tu idea:</label>
                <textarea
                  id="inputText"
                  rows="8"
                  className="w-full h-full bg-black/50 border border-[color:var(--border)] rounded-lg p-3 text-gray-300 focus:ring-2 focus:ring-[color:var(--primary)] resize-none"
                  placeholder="Ej: un retrato cinematogrÃ¡fico en una calle europea al atardecer..."
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                ></textarea>
              </div>

              <div className="flex flex-col">
                <label className="block text-sm font-medium text-gray-300 mb-2">Imagen de referencia:</label>
                {!imagePreview ? (
                  <label htmlFor="referenceImagePrompt-Gen" className="flex-1 flex flex-col items-center justify-center bg-[color:var(--surface)]/30 border-2 border-dashed border-[color:var(--border)] rounded-lg cursor-pointer hover:bg-[color:var(--surface)]/40 transition-all p-4">
                    <Upload className="w-8 h-8 text-[color:var(--primary)] mb-2" />
                    <span className="text-sm font-semibold text-center">Subir imagen</span>
                    <span className="text-xs text-muted mt-1 text-center">Opcional</span>
                  </label>
                ) : (
                  <div className="relative flex-1 rounded-lg overflow-hidden border border-[color:var(--border)]">
                    <img src={imagePreview} alt="Referencia" className="w-full h-full object-cover" />
                    <button type="button" onClick={removeImage} className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white p-2 rounded-full transition-all shadow-lg">
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

            {/* PRESETS FREE (compactos) */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-3">ðŸŽ¨ Estilos BÃ¡sicos (GRATIS):</label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                {PRESETS.filter(p => p.free).map(preset => (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => setSelectedPreset(selectedPreset === preset.id ? null : preset.id)}
                    className={`p-3 rounded-lg text-left transition-all text-sm ${selectedPreset === preset.id ? 'bg-[color:var(--primary)]/10 border-2 border-[color:var(--primary)] shadow-sm' : 'bg-white/5 border border-[color:var(--border)] hover:bg-white/10'}`}
                  >
                    <div className="text-sm font-semibold">{preset.name}</div>
                    <div className="text-xs text-gray-400 mt-1">{preset.subtitle}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* HERRAMIENTAS PRO (bloqueo/estilo + generar idea) */}
            <div className="relative mt-4">
              {!isPro && (
                <div className="absolute inset-0 bg-black/70 backdrop-blur-sm rounded-lg flex flex-col items-center justify-center z-10 p-4 text-center">
                  <Lock className="w-10 h-10 text-[color:var(--primary)] mx-auto mb-4" />
                  <p className="text-white font-bold text-lg mb-2">Herramientas PRO</p>
                  <a href="#planes" className="text-[color:var(--primary)] hover:opacity-90 text-sm font-semibold">Actualizar a PRO â†’</a>
                </div>
              )}

              <button
                type="button"
                onClick={() => setShowProTools(!showProTools)}
                disabled={!isPro}
                className="w-full flex items-center justify-between p-3 bg-[color:var(--surface)]/30 border border-[color:var(--border)] rounded-lg hover:border-[color:var(--primary)] transition-all"
              >
                <span className="font-semibold flex items-center space-x-2">
                  <Crown className="w-5 h-5 text-[color:var(--primary)]" />
                  <span>Herramientas PRO</span>
                </span>
                {showProTools ? <ChevronUp /> : <ChevronDown />}
              </button>

              {showProTools && isPro && (
                <div className="mt-3 p-4 bg-black/30 border border-[color:var(--border)] rounded-lg space-y-4">
                  <div>
                    <button type="button" onClick={generateRandomIdea} className="w-full flex items-center justify-center space-x-2 bg-[color:var(--primary)] text-black px-4 py-3 rounded-lg font-bold hover:shadow transition-all">
                      <Lightbulb size={18} />
                      <span>ðŸ’¡ Generar Idea Aleatoria</span>
                    </button>
                    <p className="text-xs text-muted mt-2 text-center">Genera ideas completas con estilo, escenario y vestuario</p>
                  </div>

                  <div className="border-t border-[color:var(--border)] my-2"></div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">âœ¨ Presets PRO (12 adicionales):</label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {PRESETS.filter(p => !p.free).map(preset => (
                        <button
                          key={preset.id}
                          type="button"
                          onClick={() => setSelectedPreset(selectedPreset === preset.id ? null : preset.id)}
                          className={`p-2 rounded-lg text-left text-sm transition-all ${selectedPreset === preset.id ? 'bg-[color:var(--primary)]/10 border-2 border-[color:var(--primary)]' : 'bg-white/5 border border-[color:var(--border)] hover:bg-white/10'}`}
                        >
                          <div className="text-sm font-semibold">{preset.name}</div>
                          <div className="text-xs text-gray-400 mt-1">{preset.subtitle}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* BOTÃ“N GENERAR */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading || (!prompt && !referenceImage)}
                className="w-full bg-[color:var(--primary)] text-black px-6 py-3 rounded-full font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transition-all"
              >
                {isLoading ? "Generando..." : "Generar Prompt"}
              </button>
            </div>
          </form>

          {/* ANÃLISIS DE CALIDAD */}
<QualityAnalysis analysis={qualityAnalysis} isPro={isPro} onApplySuggestions={handleApplySuggestions} isApplying={isApplyingSuggestions} />
          {/* PROMPT GENERADO */}
          <div className="mt-6">
            <h3 className="font-semibold text-lg mb-3">Prompt Generado:</h3>
            <div className="bg-black/40 border border-[color:var(--border)] rounded-lg p-4">
              <pre className="text-gray-300 whitespace-pre-wrap font-sans text-sm">{response || "AquÃ­ aparecerÃ¡ el prompt generado..."}</pre>
              {response && (
                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Copiar */}
                  <button
                    onClick={() => { navigator.clipboard.writeText(response); if (window.App_showToast) window.App_showToast("Prompt copiado."); }}
                    className="w-full flex items-center justify-center space-x-2 bg-[color:var(--surface)] text-[color:var(--fg)] px-4 py-3 rounded-lg font-bold hover:bg-[color:var(--surface)]/80 transition"
                  >
                    <Copy size={18} />
                    <span>Copiar Prompt</span>
                  </button>

                  {/* Usar en Gemini: copia + abre pestaÃ±a */}
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(response);
                      window.open("https://gemini.google.com/app", "_blank", "noopener,noreferrer");
                      if (window.App_showToast) window.App_showToast("Prompt copiado. Abriendo Geminiâ€¦");
                    }}
                    className="w-full flex items-center justify-center space-x-2 bg-[color:var(--primary)] text-black px-4 py-3 rounded-lg font-bold hover:shadow transition"
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
};

// APP principal (UI final ajustada)
export default function App() {
  const [view, setView] = useState('home');
  const [galleryFilter, setGalleryFilter] = useState('todos');
  const [toastText, setToastText] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, profile, signOut } = useAuth();
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [showProPresets, setShowProPresets] = useState(false);

  // Exponer funciÃ³n global para que componentes hijos puedan mostrar toasts
  React.useEffect(() => {
    window.App_showToast = (text) => {
      setToastText(text);
      setTimeout(() => setToastText(""), 2000);
    };
    // permitir refrescar perfil desde backend
    window.App_refreshProfile = async () => {
      try {
        const res = await fetch('/api/profile');
        if (res.ok) {
          // implementaciÃ³n especÃ­fica puede variar; simple reload:
          window.location.reload();
        }
      } catch (err) { /* noop */ }
    };
    return () => { delete window.App_showToast; delete window.App_refreshProfile; };
  }, []);

  const showToast = (text) => {
    setToastText(text);
    setTimeout(() => setToastText(""), 2000);
  };

  const handleCopy = (text) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    showToast("Â¡Prompt copiado!");
  };

  const filteredPrompts = useMemo(() =>
    galleryFilter === 'todos' ? ALL_PROMPTS : ALL_PROMPTS.filter(p => p.category === galleryFilter),
    [galleryFilter]
  );

  const homePrompts = useMemo(() => {
    const categories = ['hombre', 'mujer', 'mascotas', 'halloween'];
    return categories.map(cat => ALL_PROMPTS.find(p => p.category === cat)).filter(Boolean);
  }, []);

  const navigateToPage = (page) => {
    setView(page);
    setMobileMenuOpen(false);
    window.scrollTo(0, 0);
  };

  const isPaid = profile?.plan && profile.plan !== 'free';
  const presetsToShow = isPaid ? PRESETS : PRESETS.filter(p => p.free).slice(0, 6);

  // Abrir Stripe Customer Portal
  const openStripePortal = async () => {
    try {
      const res = await fetch('/api/stripe/create-portal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerId: profile?.stripe_customer_id,
          returnUrl: window.location.origin
        })
      });
      const data = await res.json();
      if (data?.url) {
        window.location.href = data.url;
      } else {
        alert('No se pudo abrir el portal de facturaciÃ³n.');
      }
    } catch (err) {
      console.error(err);
      alert('Error al abrir el portal de facturaciÃ³n.');
    }
  };

  return (
    <div className="min-h-screen bg-[color:var(--bg)] text-[color:var(--fg)] font-body">
      {/* NAV */}
      <nav className="fixed top-0 w-full z-50 bg-[color:var(--bg)]/80 backdrop-blur-lg border-b border-[color:var(--border]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="absolute left-1/2 transform -translate-x-1/2 md:static md:transform-none md:left-0 md:pl-2">
              <button type="button" onClick={() => navigateToPage('home')} className="flex items-center">
                <img src="/logo.svg" alt="Promptraits Logo" className="w-[220px] md:w-[300px] h-auto" />
              </button>
            </div>

            <div className="hidden md:flex items-center space-x-8">
              <button onClick={() => navigateToPage('gallery')} className="text-gray-300 hover:text-white transition duration-300">GalerÃ­a</button>
              <button onClick={() => navigateToPage('assistant')} className="text-gray-300 hover:text-white transition duration-300">Generador IA</button>

              <button onClick={() => setShowRegister(true)} className="px-4 py-2 rounded-full font-bold bg-[color:var(--primary)] text-black hover:opacity-90 transition">
                Crear cuenta gratis
              </button>
            </div>

            <div className="hidden md:flex items-center">
              {!user ? (
               <button className="md:hidden p-2" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} aria-expanded={mobileMenuOpen} aria-controls="mobile-menu">
                  {mobileMenuOpen ? <X /> : <Menu />}
                </button>
              ) : (
                <UserMenu
                  credits={profile?.credits ?? 0}
                  plan={profile?.plan || 'free'}
                  onNavigate={(dest) => {
                    switch (dest) {
                      case 'profile':
                        setView('profile'); break;
                      case 'history':
                        setView('profile');
                        window.dispatchEvent(new CustomEvent('profile:openTab', { detail: 'history' }));
                        break;
                      case 'assistant':
                        setView('assistant'); break;
                      case 'gallery':
                        setView('gallery'); break;
                      case 'credits':
                        setShowCheckout(true); break;
                      case 'logout':
                        signOut(); break;
                      default:
                        setView('home');
                    }
                    setMobileMenuOpen(false);
                    window.scrollTo(0, 0);
                  }}
                />
              )}
            </div>
            
            <button
              className="md:hidden p-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-menu"
              aria-label={mobileMenuOpen ? "Cerrar menÃº" : "Abrir menÃº"}
            >
              {mobileMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
        
        {mobileMenuOpen && (
          <div className="md:hidden bg-[color:var(--surface)] border-t border-[color:var(--border)]" id="mobile-menu">
            <div className="px-4 py-4 space-y-4">
              <button onClick={() => navigateToPage('gallery')} className="block w-full text-left text-gray-300 hover:text-white">GalerÃ­a</button>
              <button onClick={() => navigateToPage('assistant')} className="block w-full text-left text-gray-300 hover:text-white">Generador IA</button>

              <button onClick={() => { setShowRegister(true); setMobileMenuOpen(false); }} className="block w-full text-left text-gray-300 hover:text-white">Crear cuenta gratis</button>

              {!user ? (
                <button onClick={() => { setShowLogin(true); setMobileMenuOpen(false); }} className="block w-full text-left text-gray-300 hover:text-white">Login</button>
              ) : (
                <>
                  <div className="text-gray-300">CrÃ©ditos: <span className="font-bold text-[color:var(--primary)]">{profile?.credits || 0}</span></div>
                  <button onClick={() => { signOut(); setMobileMenuOpen(false); }} className="block w-full text-left text-red-400 hover:text-red-300">Cerrar SesiÃ³n</button>
                </>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* TOAST */}
      {toastText && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 bg-[color:var(--primary)] text-black px-6 py-3 rounded-full font-bold shadow-lg z-[110]">
          {toastText}
        </div>
      )}

      {/* VISTAS */}
      {view === 'home' && (
        <main>
          {/* HERO */}
          <section className="relative pt-40 pb-12 px-4 overflow-hidden text-center">
            <AnimatedSection className="max-w-5xl mx-auto relative z-10">
              <h1 className="text-5xl md:text-7xl font-heading font-bold mb-6 leading-tight tracking-tighter">
                Convierte tus Selfies en
                <span className="block text-[color:var(--primary)] mt-2">Retratos Profesionales</span>
              </h1>

              <div className="max-w-3xl mx-auto">
                <p className="text-lg text-muted mb-8">Crea prompts ultra detallados para conseguir la mayor consistencia en tus retratos y fotos</p>

                <div className="flex justify-center mb-12">
                  <button onClick={() => navigateToPage('assistant')} className="inline-flex items-center justify-center rounded-full px-6 py-3 bg-[color:var(--primary)] text-black font-semibold hover:opacity-90 transition">
                    Ir al Generador de Prompts
                  </button>
                </div>
              </div>
            </AnimatedSection>
          </section>

          {/* MUESTRA DE GALERÍA */}
          <AnimatedSection className="py-20 px-4">
            <div className="max-w-7xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-4xl font-bold mb-4">Galería de Prompts Profesionales</h2>
                <p className="text-muted text-lg">Explora nuestra colección de prompts optimizados</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {ALL_PROMPTS.slice(0, 4).map((prompt) => (
                  <div key={prompt.id} className="bg-[color:var(--surface)] rounded-xl overflow-hidden border border-[color:var(--border)] hover:border-[color:var(--primary)] transition-all">
                    <img src={prompt.src} alt={prompt.title} className="aspect-square w-full object-cover" />
                    <div className="p-4">
                      <h3 className="font-semibold mb-2">{prompt.name}</h3>
                      <p className="text-sm text-muted mb-3">{prompt.category}</p>
                      <span className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded bg-[color:var(--primary)]/20 text-[color:var(--primary)]">
                        {prompt.isPro ? <Crown className="w-3 h-3" /> : null}
                        {prompt.isPro ? 'PRO' : 'FREE'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="text-center">
                <button
                  onClick={() => navigateToPage('gallery')}
                  className="px-8 py-3 bg-[color:var(--primary)] text-black font-bold rounded-lg hover:opacity-90 transition"
                >
                  Ver Galería Completa
                </button>
              </div>
            </div>
          </AnimatedSection>

          {/* PLANES */}
          <AnimatedSection className="py-20 px-4 bg-black/20">
            <div className="max-w-5xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-4xl font-bold mb-4">Elige tu Plan</h2>
                <p className="text-muted text-lg">Accede a herramientas profesionales y contenido exclusivo</p>
              </div>
              <div className="grid md:grid-cols-2 gap-8">
                <div className="bg-[color:var(--surface)] rounded-xl p-8 border border-[color:var(--border)]">
                  <div className="flex items-center gap-2 mb-4">
                    <Gift className="w-6 h-6 text-[color:var(--primary)]" />
                    <h3 className="text-2xl font-bold">Plan FREE</h3>
                  </div>
                  <div className="text-4xl font-bold mb-6">0€<span className="text-lg text-muted">/mes</span></div>
                  <ul className="space-y-3 mb-8">
                    <li className="flex items-start gap-2">
                      <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span>Acceso a prompts básicos</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span>Galería pública</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span>Comunidad y soporte</span>
                    </li>
                  </ul>
                  <button className="w-full py-3 bg-white/10 rounded-lg font-semibold hover:bg-white/20 transition">
                    Comenzar Gratis
                  </button>
                </div>
                <div className="bg-gradient-to-br from-[color:var(--primary)]/20 to-[color:var(--surface)] rounded-xl p-8 border-2 border-[color:var(--primary)] relative">
                  <div className="absolute top-4 right-4 px-3 py-1 bg-[color:var(--primary)] text-black text-xs font-bold rounded-full">
                    RECOMENDADO
                  </div>
                  <div className="flex items-center gap-2 mb-4">
                    <Crown className="w-6 h-6 text-[color:var(--primary)]" />
                    <h3 className="text-2xl font-bold">Plan PRO</h3>
                  </div>
                  <div className="text-4xl font-bold mb-6">29€<span className="text-lg text-muted">/mes</span></div>
                  <ul className="space-y-3 mb-8">
                    <li className="flex items-start gap-2">
                      <Check className="w-5 h-5 text-[color:var(--primary)] flex-shrink-0 mt-0.5" />
                      <span className="font-semibold">Todo lo del plan FREE</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="w-5 h-5 text-[color:var(--primary)] flex-shrink-0 mt-0.5" />
                      <span>Prompts PRO exclusivos</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="w-5 h-5 text-[color:var(--primary)] flex-shrink-0 mt-0.5" />
                      <span>Generador de prompts IA</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="w-5 h-5 text-[color:var(--primary)] flex-shrink-0 mt-0.5" />
                      <span>Análisis de calidad</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="w-5 h-5 text-[color:var(--primary)] flex-shrink-0 mt-0.5" />
                      <span>Soporte prioritario</span>
                    </li>
                  </ul>
                  <button className="w-full py-3 bg-[color:var(--primary)] text-black font-bold rounded-lg hover:opacity-90 transition">
                    Activar PRO
                  </button>
                </div>
              </div>
            </div>
          </AnimatedSection>

          {/* PRESETS */}
          <AnimatedSection className="py-20 px-4">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-4xl font-bold mb-4">Presets Profesionales</h2>
                <p className="text-muted text-lg">Configuraciones optimizadas para diferentes estilos</p>
              </div>
              <div className="grid md:grid-cols-3 gap-6">
                {['Corporativo', 'Creativo', 'Natural', 'Editorial', 'Lifestyle', 'Minimalista'].map((preset) => (
                  <div key={preset} className="bg-[color:var(--surface)] rounded-xl p-6 border border-[color:var(--border)] hover:border-[color:var(--primary)] transition-all cursor-pointer">
                    <div className="w-12 h-12 rounded-lg bg-[color:var(--primary)]/20 flex items-center justify-center mb-4">
                      <Sparkles className="w-6 h-6 text-[color:var(--primary)]" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">{preset}</h3>
                    <p className="text-sm text-muted">Preset optimizado para fotografía {preset.toLowerCase()}</p>
                  </div>
                ))}
              </div>
            </div>
          </AnimatedSection>
        </main>
      )}

      {view === 'gallery' && (
        <main className="pt-32 px-4">
          <section id="full-gallery" className="py-12">
            <div className="max-w-7xl mx-auto">
              <AnimatedSection className="text-center mb-16">
                <h2 className="text-4xl md:text-5xl font-heading font-bold mb-4">GalerÃ­a de <span className="text-[color:var(--primary)]">Prompts PÃºblicos</span></h2>
                <p className="text-muted text-lg">Navega, inspÃ­rate y haz clic en una imagen para copiar el prompt.</p>
              </AnimatedSection>

              <CategoryTabs
                selected={galleryFilter}
                onSelect={setGalleryFilter}
                categories={CATEGORIES}
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                {filteredPrompts.map(item => (
                  <div key={item.id} onClick={() => handleCopy(item.prompt)} className="cursor-pointer group relative overflow-hidden rounded-2xl bg-white/5 border border-[color:var(--border)] transform hover:-translate-y-2 transition-transform duration-300 aspect-[3/4]">
                    <img src={item.src} alt={item.title} loading="lazy" className="w-full h-full object-cover" onError={(e) => { e.target.onerror = null; e.target.src = "https://via.placeholder.com/300x400.png?text=Imagen+no+encontrada"; }} />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity pointer-events-none">
                      <Copy className="w-12 h-12 text-white/80" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </main>
      )}

      {view === 'assistant' && (
        <main className="pt-32 px-4">
          <GeminiAssistantView onCopy={handleCopy} isPro={isPaid} />
        </main>
      )}

      {view === 'profile' && (
        <Profile
          onBack={() => setView('home')}
          onOpenCheckout={() => setShowCheckout(true)}
          onOpenRegister={() => setShowRegister(true)}
          onOpenPortal={openStripePortal}
        />
      )}

      {/* DESCARGA DE LA GUÃA (final) */}
      <section className="py-12 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h3 className="text-2xl font-heading font-semibold mb-3">Guia para crear PROMPTS de retratos profesional <span className="text-[color:var(--primary)]">GRATIS</span></h3>
          <p className="text-lg text-muted mb-6">Descarga nuestra guÃ­a en pdf para convertir fotos normales en fotografÃ­as de estudio profesionales</p>
          <div className="flex justify-center">
            <a href="/Promptraits_Guia_Completa_Prompts_y_Fotografia_v2.pdf" download className="inline-flex items-center justify-center space-x-2 bg-[color:var(--primary)] text-black px-8 py-4 rounded-full font-bold text-lg hover:shadow-lg transition-all duration-300">
              <Download className="w-5 h-5" />
              <span>Descargar guÃ­a GRATIS</span>
            </a>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-black/20 border-t border-[color:var(--border)] py-12 px-4 mt-12">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center mb-6">
            <button
              type="button"
              onClick={() => navigateToPage('home')}
              className="inline-flex items-center"
              aria-label="Ir a inicio"
            >
              <img src="/logo.svg" alt="Promptraits Logo" className="w-40 h-auto" />
            </button>
          </div>
          <p className="text-muted max-w-lg mx-auto mb-6">Plataforma profesional de prompts y retratos IA. Transforma tu presencia digital y eleva tu marca personal.</p>
          <div className="flex justify-center space-x-6 mb-8">
            <a
              href="https://www.instagram.com/sr_waly/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted hover:text-[color:var(--fg)] transition"
              aria-label="Instagram de Sr. Waly"
            >
              <Instagram />
            </a>
            <a
              href="https://t.me/+nyMJxze9il4wZGJk"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted hover:text-[color:var(--fg)] transition"
              aria-label="Canal de Telegram"
            >
              <Send />
            </a>
          </div>
          <p className="text-gray-600 text-sm">
            âœ… Deploy OK â€” Â© {new Date().getFullYear()} Promptraits by Sr. Waly. Todos los derechos reservados.
          </p>
        </div>
      </footer>

      {/* MODALES */}
      {showLogin && <Login onClose={() => setShowLogin(false)} onSwitchToRegister={() => { setShowLogin(false); setShowRegister(true); }} />}
      {showRegister && <Register onClose={() => setShowRegister(false)} onSwitchToLogin={() => { setShowRegister(false); setShowLogin(true); }} />}
      {showCheckout && <Checkout onClose={() => setShowCheckout(false)} />}

    </div>
  );
}

