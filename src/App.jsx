import React, { useState, useMemo, useEffect } from "react";
import { Camera, Check, Instagram, Send, Menu, X, Download, Copy, Gift, Crown, Lock, ChevronDown, ChevronUp, Lightbulb, Trash2, Upload, Sparkles } from "lucide-react";

import { AuthProvider, useAuth } from './contexts/AuthContext.jsx';
import { supabase } from './lib/supabase.js';

import AnimatedSection from './components/AnimatedSection.jsx';
import CategoryTabs from './components/CategoryTabs.jsx';

import Login from './components/Auth/Login.jsx';
import Register from './components/Auth/Register.jsx';
import UserMenu from './components/Auth/UserMenu.jsx';
import Profile from './components/Auth/Profile.jsx';
import Checkout from './components/Auth/Checkout.jsx';
import Pricing from './components/Pricing.jsx';

// ← AÑADIR ESTOS IMPORTS
import Gallery from './components/Gallery.jsx';
import Generator from './components/Generator.jsx';
import History from './components/History.jsx';

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
  { id: 1, name: "Cinematográfico Editorial", subtitle: "Low-Key Rembrandt", free: true, promptBlock: "Ultra-realistic editorial portrait, 85mm f/1.4, Rembrandt lighting..." },
  { id: 2, name: "Golden Hour Lifestyle", subtitle: "Cálido atardecer", free: true, promptBlock: "Warm golden hour portrait, 50mm f/1.8..." },
  { id: 3, name: "Corporate Clean", subtitle: "High-Key profesional", free: true, promptBlock: "High-key professional headshot..." },
  { id: 4, name: "Environmental Portrait", subtitle: "Sujeto en su entorno", free: false, promptBlock: "Environmental portrait..." },
  { id: 5, name: "Beauty Soft Front", subtitle: "Beauty homogéneo", free: false, promptBlock: "Beauty portrait..." },
  { id: 6, name: "B/N Clásico Film", subtitle: "Monocromo atemporal", free: false, promptBlock: "Classic black and white portrait..." },
  { id: 7, name: "Fotografía Urbana Street", subtitle: "Energía callejera", free: false, promptBlock: "Urban street photography..." },
  { id: 8, name: "Ensueño Vintage 70s", subtitle: "Nostálgico y cálido", free: false, promptBlock: "Vintage 70s dreamy portrait..." },
  { id: 9, name: "Film Noir Clásico", subtitle: "Drama B/N años 40-50", free: false, promptBlock: "Classic film noir portrait..." },
  { id: 10, name: "Neón Cyberpunk", subtitle: "Futurista urbano nocturno", free: false, promptBlock: "Cyberpunk neon portrait..." },
  { id: 11, name: "Retrato íntimo Ventana", subtitle: "Luz natural pensativa", free: false, promptBlock: "Intimate window light portrait..." },
  { id: 12, name: "Acción Deportiva Congelado", subtitle: "Movimiento nítido", free: false, promptBlock: "Frozen sports action..." },
  { id: 13, name: "Producto Minimalista Lujo", subtitle: "Elegante y limpio", free: false, promptBlock: "Luxury minimalist product..." },
  { id: 14, name: "Fantasía Surrealista Etéreo", subtitle: "Onírico y de otro mundo", free: false, promptBlock: "Surreal ethereal fantasy..." },
  { id: 15, name: "Editorial Fashion", subtitle: "Alta moda dramática", free: false, promptBlock: "Editorial fashion portrait..." }
];

const SCENARIOS = [
  { id: 1, name: "Estudio Fondo Negro", description: "Minimalista, dramático, fondo oscuro", prompt: "Professional studio with seamless black backdrop..." },
  { id: 2, name: "Calle Europea Atardecer", description: "Arquitectura clásica, luz dorada", prompt: "Narrow European street at golden hour..." },
  { id: 3, name: "Playa Amanecer Contraluz", description: "Costa, luz suave, horizonte marino", prompt: "Sandy beach at sunrise..." },
  { id: 4, name: "Urbano Nocturno Neones", description: "Ciudad de noche, luces vibrantes", prompt: "Night city street with neon signs..." },
  { id: 5, name: "Interior Ventana Natural", description: "Luz de ventana lateral suave", prompt: "Indoor setting with large window as single light source..." },
  { id: 6, name: "Bosque Niebla Atmosférico", description: "Naturaleza, bruma, luz filtrada", prompt: "Misty forest setting..." },
  { id: 7, name: "Azotea Ciudad Atardecer", description: "Skyline urbano, golden hour", prompt: "Rooftop location at sunset..." },
  { id: 8, name: "Industrial Warehouse Oscuro", description: "Grungy, luces prácticas, textura", prompt: "Dark industrial warehouse..." }
];

// Packs de recarga
const CREDIT_PACKS = [
  { credits: 20, price: "3.99" },
  { credits: 50, price: "8.99" },
  { credits: 100, price: "15.99" }
];

// Planes y créditos (según tu especificación)
const SUBSCRIPTION_PLANS = [
  {
    name: "FREE",
    price: "0",
    priceLabel: "Gratis",
    period: "por registrarte",
    popular: false,
    credits: 5,
    features: ["5 créditos al registrarte", "Newsletter con consejos y trucos", "4 prompts exclusivos al mes"]
  },
  {
    name: "PRO",
    price: "6.99",
    priceLabel: "6.99â‚¬",
    period: "/mes",
    popular: true,
    credits: 60,
    features: ["60 créditos/mes", "3 prompts personalizados (24â€“48h)", "Revisiones incluidas", "8 prompts exclusivos al mes"]
  },
  {
    name: "PREMIUM",
    price: "19.99",
    priceLabel: "19.99â‚¬",
    period: "/mes",
    popular: false,
    credits: 300,
    features: ["300 créditos/mes", "Acceso al agente personalizado", "Asesoría 1 a 1", "5 prompts personalizados"]
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

  // Generación real: llamada al endpoint /api/gemini-processor
  const handleGenerate = async (e) => {
    e && e.preventDefault();

    if (!user) {
      setResponse("Inicia sesión para generar.");
      window.App_showToast?.("Inicia sesión para generar.");
      return;
    }
    if (profile?.credits <= 0) {
      setResponse("No tienes créditos disponibles. Compra créditos o suscríbete.");
      window.App_showToast?.("No tienes créditos.");
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
      setResponse(data.prompt || "No se recibió respuesta del generador.");
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
        {/* ALERTA DE CRí‰DITOS */}
        {user && profile && profile.credits <= 3 && (
          <div className={`mb-6 p-4 rounded-lg border ${profile.credits === 0 ? 'bg-red-500/10 border-red-500/30' : 'bg-[color:var(--primary)]/10 border-[color:var(--primary)]/30'}`}>
            <p className={`font-bold ${profile.credits === 0 ? 'text-red-400' : 'text-[color:var(--primary)]'}`}>
              {profile.credits === 0
                ? 'âš ï¸ No tienes créditos. Actualiza tu plan para continuar.'
                : `âš ï¸ Te quedan ${profile.credits} crédito${profile.credits === 1 ? '' : 's'}.`
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
                  placeholder="Ej: un retrato cinematográfico en una calle europea al atardecer..."
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
              <label className="block text-sm font-medium text-gray-300 mb-3">ðŸŽ¨ Estilos Básicos (GRATIS):</label>
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

            {/* BOTí“N GENERAR */}
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

          {/* ANíLISIS DE CALIDAD */}
<QualityAnalysis analysis={qualityAnalysis} isPro={isPro} onApplySuggestions={handleApplySuggestions} isApplying={isApplyingSuggestions} />
          {/* PROMPT GENERADO */}
          <div className="mt-6">
            <h3 className="font-semibold text-lg mb-3">Prompt Generado:</h3>
            <div className="bg-black/40 border border-[color:var(--border)] rounded-lg p-4">
              <pre className="text-gray-300 whitespace-pre-wrap font-sans text-sm">{response || "Aquí aparecerá el prompt generado..."}</pre>
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

                  {/* Usar en Gemini: copia + abre pestaña */}
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

// HISTORIAL DE PROMPTS
function PromptHistory() {
  const { user, profile } = useAuth();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchHistory();
    }
  }, [user]);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('prompt_history')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setHistory(data || []);
    } catch (err) {
      console.error('Error fetching history:', err);
    } finally {
      setLoading(false);
    }
  };

  const deletePrompt = async (id) => {
    try {
      const { error } = await supabase
        .from('prompt_history')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setHistory(history.filter(p => p.id !== id));
    } catch (err) {
      console.error('Error deleting prompt:', err);
    }
  };

  if (loading) {
    return <div className="text-center py-8">Cargando historial...</div>;
  }

  if (history.length === 0) {
    return (
      <div className="text-center py-8 text-gray-400">
        No tienes prompts guardados aún.
        {profile.plan === 'free' && (
          <p className="mt-2 text-sm">
            Los usuarios Free guardan solo los últimos 3 prompts.
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold">
          Historial de Prompts
          {profile.plan === 'free' && (
            <span className="text-sm text-gray-400 ml-2">
              (últimos 3)
            </span>
          )}
        </h3>
        <span className="text-sm text-gray-400">
          {history.length} prompt{history.length !== 1 ? 's' : ''}
        </span>
      </div>

      <div className="space-y-3">
        {history.map((prompt) => (
          <div
            key={prompt.id}
            className="bg-white/5 border border-white/10 rounded-lg p-4 hover:bg-white/10 transition"
          >
            <div className="flex justify-between items-start gap-4">
              <div className="flex-1">
                <p className="text-white mb-2">{prompt.prompt_text}</p>
                <div className="flex items-center gap-2 text-xs text-gray-400">
                  <Calendar className="w-3 h-3" />
                  {new Date(prompt.created_at).toLocaleString('es-ES', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </div>
              </div>

              {prompt.image_url && (
                <img
                  src={prompt.image_url}
                  alt="Prompt result"
                  className="w-20 h-20 object-cover rounded"
                />
              )}

              <button
                onClick={() => deletePrompt(prompt.id)}
                className="p-2 text-red-400 hover:text-red-300 hover:bg-red-400/10 rounded transition"
                title="Eliminar"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// APP principal (UI final ajustada)
export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}

function AppContent() {
  const { user, profile, signOut } = useAuth()
  const [view, setView] = useState('home')
  const [showAuth, setShowAuth] = useState(false)
  const [authMode, setAuthMode] = useState('login')
  const [selectedPlan, setSelectedPlan] = useState(null)
  const [showCheckout, setShowCheckout] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isProcessingCheckout, setIsProcessingCheckout] = useState(false)
  const [showPaymentSuccess, setShowPaymentSuccess] = useState(false)

  // Detectar retorno de Stripe
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const payment = params.get('payment');
    const sessionId = params.get('session_id');
    
    if (payment === 'success' && sessionId) {
      console.log('✅ Pago exitoso detectado');
      
      // Mostrar mensaje de éxito
      setShowPaymentSuccess(true);
      
      // Limpiar URL inmediatamente
      window.history.replaceState({}, '', '/');
      
      // Esperar 3 segundos y RECARGAR PÁGINA COMPLETA
      setTimeout(() => {
        console.log('🔄 Recargando página para actualizar datos...');
        window.location.reload();
      }, 3000);
      
    } else if (payment === 'cancelled') {
      console.log('⚠️ Pago cancelado');
      setView('pricing');
      window.history.replaceState({}, '', '/');
    }
  }, []);

  const handleNavigation = async (action) => {
    console.log('🔴 handleNavigation:', action)

    if (action === 'logout') {
      console.log('🔴 CERRANDO SESIÓN - Inicio')
      try {
        const { error } = await signOut()
        if (error) {
          console.error('❌ Error en signOut:', error)
          throw error
        }
        console.log('✅ signOut() ejecutado')
        console.log('🔄 Recargando página...')
        window.location.reload()
      } catch (error) {
        console.error('❌ Error al cerrar sesión:', error)
      }
      return
    }

    if (!user && action !== 'home' && action !== 'gallery' && action !== 'pricing') {
      setShowAuth(true)
      setAuthMode('login')
      return
    }

    setView(action)
    setMobileMenuOpen(false)
  }

  const handlePlanSelection = async (planId) => {
    console.log('🔵 Plan seleccionado:', planId);

    if (planId === 'free') {
      if (!user) {
        setShowAuth(true);
        setAuthMode('register');
      } else {
        console.log('ℹ️ Ya tienes el plan FREE');
      }
      return;
    }

    if (!user) {
      console.log('⚠️ Usuario no logueado - Mostrando modal de login');
      setShowAuth(true);
      setAuthMode('login');
      return;
    }

    console.log('💳 Usuario logueado - Iniciando checkout...');
    setIsProcessingCheckout(true);
    
    try {
      const response = await fetch('/api/create-checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          planId,
          userId: user.id,
          userEmail: user.email,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al crear sesión de checkout');
      }

      const { url } = await response.json();
      
      console.log('✅ Sesión creada - Redirigiendo a Stripe...');
      
      // Redirigir a Stripe Checkout
      window.location.href = url;
    } catch (error) {
      console.error('❌ Error en checkout:', error);
      alert(`Error al procesar el pago: ${error.message}\n\nPor favor, intenta de nuevo.`);
      setIsProcessingCheckout(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-black/50 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Botón Hamburguesa (solo móvil) */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-white/10 transition"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6 text-white" />
              ) : (
                <Menu className="w-6 h-6 text-white" />
              )}
            </button>

            {/* Logo - Centrado en móvil, izquierda en desktop */}
            <div className="flex-1 md:flex-initial flex justify-center md:justify-start">
              <div 
                onClick={() => {
                  setView('home')
                  setMobileMenuOpen(false)
                }}
                className="cursor-pointer"
              >
                <img 
                  src="/logo.svg" 
                  alt="PROMPTRAITS" 
                  className="h-12 w-auto"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.parentElement.innerHTML = '<span class="text-2xl font-bold bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] bg-clip-text text-transparent">PROMPTRAITS</span>';
                  }}
                />
              </div>
            </div>

            {/* Spacer para balance en móvil */}
            <div className="w-10 md:hidden"></div>

            {/* Navigation Desktop */}
            <nav className="hidden md:flex space-x-8">
              <button 
                onClick={() => setView('gallery')} 
                className={`transition duration-300 ${view === 'gallery' ? 'text-[var(--primary)]' : 'text-gray-300 hover:text-white'}`}
              >
                Galería
              </button>
              <button 
                onClick={() => handleNavigation('generator')} 
                className={`transition duration-300 ${view === 'generator' ? 'text-[var(--primary)]' : 'text-gray-300 hover:text-white'}`}
              >
                Generador IA
              </button>
              <button 
                onClick={() => setView('pricing')} 
                className={`transition duration-300 ${view === 'pricing' ? 'text-[var(--primary)]' : 'text-gray-300 hover:text-white'}`}
              >
                Precios
              </button>
            </nav>

            {/* User Menu / Auth Button Desktop */}
            <div className="hidden md:block">
              {user ? (
                <UserMenu 
                  credits={profile?.credits || 0}
                  plan={profile?.plan || 'free'}
                  onNavigate={handleNavigation}
                />
              ) : (
                <button
                  onClick={() => {
                    setShowAuth(true)
                    setAuthMode('login')
                  }}
                  className="px-6 py-2 rounded-full bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] text-white font-semibold hover:opacity-90 transition duration-300"
                >
                  Iniciar sesión
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-black/95 border-t border-white/10">
            <div className="px-4 py-6 space-y-4">
              {/* Navigation Links */}
              <button
                onClick={() => {
                  setView('gallery')
                  setMobileMenuOpen(false)
                }}
                className={`block w-full text-left px-4 py-3 rounded-lg transition ${
                  view === 'gallery' 
                    ? 'bg-[var(--primary)]/20 text-[var(--primary)]' 
                    : 'text-gray-300 hover:bg-white/10'
                }`}
              >
                Galería
              </button>
              
              <button
                onClick={() => {
                  handleNavigation('generator')
                }}
                className={`block w-full text-left px-4 py-3 rounded-lg transition ${
                  view === 'generator' 
                    ? 'bg-[var(--primary)]/20 text-[var(--primary)]' 
                    : 'text-gray-300 hover:bg-white/10'
                }`}
              >
                Generador IA
              </button>
              
              <button
                onClick={() => {
                  setView('pricing')
                  setMobileMenuOpen(false)
                }}
                className={`block w-full text-left px-4 py-3 rounded-lg transition ${
                  view === 'pricing' 
                    ? 'bg-[var(--primary)]/20 text-[var(--primary)]' 
                    : 'text-gray-300 hover:bg-white/10'
                }`}
              >
                Precios
              </button>

              <div className="border-t border-white/10 my-4"></div>

              {/* User Section */}
              {user ? (
                <div className="space-y-3">
                  <div className="px-4 py-3 bg-white/5 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-400">Créditos</span>
                      <span className="text-lg font-bold text-[var(--primary)]">
                        {profile?.credits || 0}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Crown className="w-4 h-4 text-[var(--primary)]" />
                      <span className="text-sm font-semibold uppercase text-[var(--primary)]">
                        {profile?.plan || 'free'}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      handleNavigation('profile')
                    }}
                    className="block w-full text-left px-4 py-3 rounded-lg text-gray-300 hover:bg-white/10 transition"
                  >
                    Mi Perfil
                  </button>

                  <button
                    onClick={() => {
                      handleNavigation('history')
                    }}
                    className="block w-full text-left px-4 py-3 rounded-lg text-gray-300 hover:bg-white/10 transition"
                  >
                    Historial
                  </button>

                  <button
                    onClick={() => handleNavigation('logout')}
                    className="block w-full text-left px-4 py-3 rounded-lg text-red-400 hover:bg-red-400/10 transition"
                  >
                    Cerrar Sesión
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => {
                    setShowAuth(true)
                    setAuthMode('login')
                    setMobileMenuOpen(false)
                  }}
                  className="w-full px-6 py-3 rounded-full bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] text-white font-semibold hover:opacity-90 transition"
                >
                  Iniciar sesión
                </button>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="pt-16">
        {/* HOME */}
        {view === 'home' && (
          <>
            {/* Hero Section */}
            <section className="relative pt-40 pb-12 px-4 overflow-hidden text-center">
              <AnimatedSection className="max-w-5xl mx-auto relative z-10">
                <h1 className="text-5xl md:text-7xl font-heading font-bold mb-6 leading-tight tracking-tighter">
                  Convierte tus Selfies en
                  <span className="block text-[color:var(--primary)] mt-2">Retratos Profesionales</span>
                </h1>
                <p className="text-lg text-muted mb-8">Crea prompts ultra detallados para conseguir la mayor consistencia en tus retratos y fotos</p>
                <button onClick={() => setView('generator')} className="inline-flex items-center justify-center rounded-full px-6 py-3 bg-[color:var(--primary)] text-black font-semibold hover:opacity-90 transition">
                  Ir al Generador de Prompts
                </button>
              </AnimatedSection>
            </section>

            {/* Galería Preview */}
            <AnimatedSection className="py-20 px-4">
              <div className="max-w-7xl mx-auto">
                <div className="text-center mb-12">
                  <h2 className="text-4xl font-bold mb-4">Galería de Prompts Profesionales</h2>
                  <p className="text-muted text-lg">Explora nuestra colección de prompts optimizados</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  {ALL_PROMPTS.slice(0, 4).map((prompt) => (
                    <div
                      key={prompt.id}
                      onClick={() => setView('gallery')}
                      className="cursor-pointer group relative overflow-hidden rounded-2xl transform hover:-translate-y-2 transition-transform duration-300 aspect-[4/5]"
                    >
                      <img
                        src={prompt.image}
                        alt={prompt.title}
                        loading="lazy"
                        className="w-full h-full object-cover"
                        onError={(e) => { e.target.src = "https://via.placeholder.com/400x500?text=No+disponible"; }}
                      />
                      {/* Overlay sutil al hover */}
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300"></div>
                    </div>
                  ))}
                </div>
                <div className="text-center">
                  <button 
                    onClick={() => setView('gallery')} 
                    className="px-8 py-3 bg-[color:var(--primary)] text-black font-bold rounded-lg hover:opacity-90 transition"
                  >
                    Ver Galería Completa
                  </button>
                </div>
              </div>
            </AnimatedSection>

            {/* PLANES - Reutilizar componente Pricing */}
            <div className="py-20 px-4">
              <Pricing 
                onSelectPlan={handlePlanSelection}
                currentPlan={profile?.plan || 'free'}
              />
            </div>

            {/* Presets */}
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

            {/* CTA Guía PDF */}
            <section className="py-12 px-4">
              <div className="max-w-7xl mx-auto text-center">
                <h3 className="text-2xl font-heading font-semibold mb-3">Guía para crear PROMPTS de retratos profesional <span className="text-[color:var(--primary)]">GRATIS</span></h3>
                <p className="text-lg text-muted mb-6">Descarga nuestra guía en pdf</p>
                <a href="/Promptraits_Guia_Completa_Prompts_y_Fotografia_v2.pdf" download className="inline-flex items-center justify-center space-x-2 bg-[color:var(--primary)] text-black px-8 py-4 rounded-full font-bold text-lg hover:shadow-lg transition-all">
                  <Download className="w-5 h-5" />
                  <span>Descargar guía GRATIS</span>
                </a>
              </div>
            </section>

            {/* Footer */}
            <footer className="bg-black/20 border-t border-[color:var(--border)] py-12 px-4 mt-12">
              <div className="max-w-7xl mx-auto text-center">
                <button type="button" onClick={() => setView('home')} className="inline-flex items-center mb-6">
                  <img src="/logo.svg" alt="Logo" className="w-40 h-auto" />
                </button>
                <p className="text-muted max-w-lg mx-auto mb-6">Plataforma profesional de prompts y retratos IA.</p>
                <div className="flex justify-center space-x-6 mb-8">
                  <a href="https://www.instagram.com/sr_waly/" target="_blank" rel="noopener noreferrer" className="text-muted hover:text-[color:var(--fg)] transition">
                    <Instagram />
                  </a>
                  <a href="https://t.me/+nyMJxze9il4wZGJk" target="_blank" rel="noopener noreferrer" className="text-muted hover:text-[color:var(--fg)] transition">
                    <Send />
                  </a>
                </div>
                <p className="text-gray-600 text-sm">© {new Date().getFullYear()} Promptraits by Sr. Waly.</p>
              </div>
            </footer>
          </>
        )}

        {/* GALERÍA */}
        {view === 'gallery' && <Gallery />}

        {/* GENERADOR */}
        {view === 'generator' && <Generator />}

        {/* PRECIOS */}
        {view === 'pricing' && (
          <Pricing 
            onSelectPlan={handlePlanSelection}
            currentPlan={profile?.plan || 'free'}
          />
        )}

        {/* PERFIL */}
        {view === 'profile' && <Profile />}

        {/* HISTORIAL */}
        {view === 'history' && <History />}
      </main>

      {/* Auth Modal */}
      {showAuth && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          {authMode === 'login' ? (
            <Login
              onClose={() => setShowAuth(false)}
              onSwitchToRegister={() => setAuthMode('register')}
              onSuccess={() => setShowAuth(false)}
            />
          ) : (
            <Register
              onClose={() => setShowAuth(false)}
              onSwitchToLogin={() => setAuthMode('login')}
              onSuccess={() => {
                setShowAuth(false)
                setView('generator')
              }}
            />
          )}
        </div>
      )}

      {/* Checkout Modal */}
      {showCheckout && selectedPlan && (
        <Checkout
          selectedPlan={selectedPlan}
          onClose={() => {
            setShowCheckout(false)
            setSelectedPlan(null)
          }}
        />
      )}

      {/* Loading Overlay during checkout */}
      {isProcessingCheckout && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[color:var(--primary)] mx-auto mb-4"></div>
            <p className="text-white text-lg font-semibold">Redirigiendo a checkout...</p>
            <p className="text-gray-400 text-sm mt-2">No cierres esta ventana</p>
          </div>
        </div>
      )}

      {/* Payment Success Overlay */}
      {showPaymentSuccess && (
        <div className="fixed inset-0 bg-black/95 flex items-center justify-center z-50">
          <div className="max-w-md w-full bg-[color:var(--surface)] rounded-2xl p-8 border border-[color:var(--border)] text-center mx-4">
            <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold mb-4 text-white">¡Pago Exitoso!</h2>
            <p className="text-gray-400 mb-6">
              Tu compra se ha procesado correctamente. Actualizando tus créditos...
            </p>
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[color:var(--primary)] mx-auto"></div>
            <p className="text-sm text-gray-500 mt-4">Recargando en 3 segundos...</p>
          </div>
        </div>
      )}
    </div>
  )
}

