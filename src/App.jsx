import React, { useState, useMemo, useEffect } from "react";
import {
  Camera,
  Check,
  Instagram,
  Send,
  Menu,
  X,
  Download,
  Copy,
  Gift,
  Crown,
  Lock,
  ChevronDown,
  ChevronUp,
  Lightbulb,
  Trash2,
  Upload,
  Sparkles,
} from "lucide-react";

import { AuthProvider, useAuth } from "./contexts/AuthContext.jsx";
import { supabase } from "./lib/supabase.js";

import AnimatedSection from "./components/AnimatedSection.jsx";
import CategoryTabs from "./components/CategoryTabs.jsx";

import Login from "./components/Auth/Login.jsx";
import Register from "./components/Auth/Register.jsx";
import UserMenu from "./components/Auth/UserMenu.jsx";
import Profile from "./components/Auth/Profile.jsx";
import Checkout from "./components/Auth/Checkout.jsx";
import Pricing from "./components/Pricing.jsx";

// ✅ IMPORTS CORREGIDOS - Usar AdvancedGenerator en lugar de Generator
import Gallery from "./components/Gallery.jsx";
import AdvancedGenerator from "./components/AdvancedGenerator.jsx";
import History from "./components/History.jsx";

import QualityAnalysis from "./components/QualityAnalysis.jsx";

// prompts externos
import { ALL_PROMPTS } from "./data/prompts.js";

const CATEGORIES = [
  { id: "todos", name: "Todos" },
  { id: "hombre", name: "Hombre" },
  { id: "mujer", name: "Mujer" },
  { id: "mascotas", name: "Mascotas" },
  { id: "halloween", name: "Halloween" },
  { id: "pareja", name: "Parejas" },
];

// PRESETS (3 free + 12 pro)
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
    name: "Retrato íntimo Ventana",
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

// Packs de recarga
const CREDIT_PACKS = [
  { credits: 20, price: "3.99" },
  { credits: 50, price: "8.99" },
  { credits: 100, price: "15.99" },
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
    features: [
      "5 créditos al registrarte",
      "Newsletter con consejos y trucos",
      "4 prompts exclusivos al mes",
    ],
  },
  {
    name: "PRO",
    price: "6.99",
    priceLabel: "6.99€",
    period: "/mes",
    popular: true,
    credits: 60,
    features: [
      "60 créditos/mes",
      "3 prompts personalizados (24–48h)",
      "12 Presets y 8 Escenarios avanzados",
      "Descarga directa y copia rápida de prompts",
      "Acceso a la galería completa",
      "Análisis de calidad PRO",
      "Cancelar cuando quieras",
    ],
  },
  {
    name: "PREMIUM",
    price: "13.99",
    priceLabel: "13.99€",
    period: "/mes",
    popular: false,
    credits: 150,
    features: [
      "150 créditos/mes",
      "10 prompts personalizados (12–24h)",
      "Presets + Escenarios ilimitados",
      "Soporte prioritario vía Telegram",
      "Acceso anticipado a nuevas funciones",
      "Análisis de calidad PREMIUM",
      "Cancelar cuando quieras",
    ],
  },
];

function AppContent() {
  const { user, profile, isLoading, refreshProfile } = useAuth();

  const [view, setView] = useState("home");
  const [showAuth, setShowAuth] = useState(false);
  const [authMode, setAuthMode] = useState("login");
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [isProcessingCheckout, setIsProcessingCheckout] = useState(false);
  const [showPaymentSuccess, setShowPaymentSuccess] = useState(false);

  // Verificar query params
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("payment") === "success") {
      setShowPaymentSuccess(true);
      setTimeout(() => {
        setShowPaymentSuccess(false);
        window.location.href = window.location.pathname;
      }, 3000);
    }
  }, []);

  // Refrescar si el usuario está logueado
  useEffect(() => {
    if (user) {
      refreshProfile();
    }
  }, [user, refreshProfile]);

  // Manejo de plan
  const handlePlanSelection = async (plan) => {
    if (!user) {
      setShowAuth(true);
      setAuthMode("login");
      return;
    }

    // Si es FREE
    if (plan.name === "FREE") {
      return;
    }

    // Guardar plan seleccionado y abrir checkout
    setSelectedPlan(plan);
    setShowCheckout(true);
  };

  // Cerrar sesión
  const handleLogout = async () => {
    await supabase.auth.signOut();
    setShowUserMenu(false);
    setView("home");
  };

  // Menú de navegación
  const navItems = [
    { label: "Inicio", value: "home" },
    { label: "Galería", value: "gallery" },
    { label: "Generador IA", value: "generator" },
    { label: "Precios", value: "pricing" },
  ];

  if (user) {
    navItems.push(
      { label: "Mi Perfil", value: "profile" },
      { label: "Historial", value: "history" }
    );
  }

  return (
    <div className="min-h-screen bg-[color:var(--bg)] text-[color:var(--fg)]">
      {/* HEADER */}
      <header className="sticky top-0 z-40 bg-black/60 backdrop-blur-xl border-b border-[color:var(--border)]">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          {/* Logo */}
          <button
            type="button"
            onClick={() => setView("home")}
            className="flex items-center"
          >
            <img src="/logo.svg" alt="Logo" className="w-40 h-auto" />
          </button>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center space-x-6">
            {navItems.map((item) => (
              <button
                key={item.value}
                type="button"
                onClick={() => setView(item.value)}
                className={`text-sm font-medium transition ${
                  view === item.value
                    ? "text-[color:var(--primary)]"
                    : "text-muted hover:text-[color:var(--fg)]"
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center space-x-4">
            {/* Créditos disponibles */}
            {user && (
              <div className="hidden lg:flex items-center px-3 py-1.5 bg-[color:var(--surface)] rounded-full border border-[color:var(--border)]">
                <Gift className="w-4 h-4 text-[color:var(--primary)] mr-1.5" />
                <span className="text-sm font-semibold">
                  {profile?.credits ?? 0}
                </span>
              </div>
            )}

            {/* CTA / User Menu */}
            {user ? (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="hidden lg:flex items-center space-x-2 px-4 py-2 bg-[color:var(--primary)] text-black rounded-full font-bold hover:opacity-90 transition"
                >
                  {profile?.plan === "pro" && (
                    <Crown className="w-4 h-4" />
                  )}
                  <span>{user.email?.split("@")[0]}</span>
                </button>
                {showUserMenu && <UserMenu onLogout={handleLogout} />}
              </div>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode("login");
                    setShowAuth(true);
                  }}
                  className="hidden lg:block px-4 py-2 text-sm font-medium text-muted hover:text-[color:var(--fg)] transition"
                >
                  Iniciar Sesión
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode("register");
                    setShowAuth(true);
                  }}
                  className="hidden lg:block px-6 py-2 bg-[color:var(--primary)] text-black rounded-full font-bold hover:opacity-90 transition"
                >
                  Registrarse
                </button>
              </>
            )}

            {/* Mobile menu toggle */}
            <button
              type="button"
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="lg:hidden p-2 rounded-lg hover:bg-[color:var(--surface)] transition"
            >
              {showMobileMenu ? <X /> : <Menu />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {showMobileMenu && (
          <div className="lg:hidden border-t border-[color:var(--border)] bg-black/95 backdrop-blur-xl">
            <nav className="container mx-auto px-4 py-4 flex flex-col space-y-3">
              {navItems.map((item) => (
                <button
                  key={item.value}
                  type="button"
                  onClick={() => {
                    setView(item.value);
                    setShowMobileMenu(false);
                  }}
                  className={`text-left py-2 px-3 rounded-lg transition ${
                    view === item.value
                      ? "bg-[color:var(--primary)]/10 text-[color:var(--primary)]"
                      : "text-muted hover:bg-[color:var(--surface)]"
                  }`}
                >
                  {item.label}
                </button>
              ))}

              {/* Auth buttons mobile */}
              {!user && (
                <div className="pt-3 border-t border-[color:var(--border)] flex flex-col space-y-2">
                  <button
                    type="button"
                    onClick={() => {
                      setAuthMode("login");
                      setShowAuth(true);
                      setShowMobileMenu(false);
                    }}
                    className="py-2 px-4 text-center border border-[color:var(--border)] rounded-lg hover:bg-[color:var(--surface)] transition"
                  >
                    Iniciar Sesión
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setAuthMode("register");
                      setShowAuth(true);
                      setShowMobileMenu(false);
                    }}
                    className="py-2 px-4 text-center bg-[color:var(--primary)] text-black rounded-lg font-bold hover:opacity-90 transition"
                  >
                    Registrarse
                  </button>
                </div>
              )}

              {/* Créditos en mobile */}
              {user && (
                <div className="pt-3 border-t border-[color:var(--border)] flex items-center justify-between px-3 py-2 bg-[color:var(--surface)] rounded-lg">
                  <span className="text-sm text-muted">Créditos</span>
                  <div className="flex items-center">
                    <Gift className="w-4 h-4 text-[color:var(--primary)] mr-1.5" />
                    <span className="text-sm font-semibold">
                      {profile?.credits ?? 0}
                    </span>
                  </div>
                </div>
              )}
            </nav>
          </div>
        )}
      </header>

      {/* MAIN CONTENT */}
      <main>
        {/* HOME */}
        {view === "home" && (
          <>
            {/* HERO */}
            <section className="relative overflow-hidden py-20 px-4">
              <div className="absolute inset-0 bg-gradient-to-b from-[color:var(--primary)]/5 to-transparent pointer-events-none"></div>
              <div className="container mx-auto max-w-6xl relative z-10">
                <div className="text-center mb-12">
                  <div className="inline-flex items-center px-4 py-2 bg-[color:var(--surface)] border border-[color:var(--border)] rounded-full text-sm mb-6">
                    <Sparkles className="w-4 h-4 mr-2 text-[color:var(--primary)]" />
                    <span className="text-muted">
                      Prompts profesionales para IA
                    </span>
                  </div>
                  <h1 className="text-5xl md:text-7xl font-heading font-black mb-6 bg-gradient-to-r from-white via-white to-[color:var(--primary)] bg-clip-text text-transparent">
                    Retratos profesionales con IA
                  </h1>
                  <p className="text-xl text-muted max-w-2xl mx-auto mb-8">
                    Genera prompts cinematográficos y profesionales para crear
                    retratos de calidad editorial con IA.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button
                      type="button"
                      onClick={() => setView("generator")}
                      className="px-8 py-4 bg-[color:var(--primary)] text-black rounded-full font-bold text-lg hover:shadow-lg transition-all inline-flex items-center justify-center"
                    >
                      <Camera className="w-5 h-5 mr-2" />
                      Empezar ahora
                    </button>
                    <button
                      type="button"
                      onClick={() => setView("gallery")}
                      className="px-8 py-4 bg-[color:var(--surface)] border border-[color:var(--border)] rounded-full font-bold text-lg hover:bg-[color:var(--surface)]/80 transition"
                    >
                      Ver ejemplos
                    </button>
                  </div>
                </div>
              </div>
            </section>

            {/* GALERÍA DESTACADA */}
            <AnimatedSection className="py-20 px-4 bg-black/20">
              <div className="max-w-7xl mx-auto">
                <div className="text-center mb-12">
                  <h2 className="text-4xl font-bold mb-4">
                    Galería de Retratos
                  </h2>
                  <p className="text-muted text-lg">
                    Explora nuestros mejores prompts generados
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  {ALL_PROMPTS.slice(0, 4).map((prompt) => (
                    <div
                      key={prompt.id}
                      onClick={() => setView("gallery")}
                      className="cursor-pointer group relative overflow-hidden rounded-2xl transform hover:-translate-y-2 transition-transform duration-300 aspect-[4/5]"
                    >
                      <img
                        src={prompt.image}
                        alt={prompt.title}
                        loading="lazy"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src =
                            "https://via.placeholder.com/400x500?text=No+disponible";
                        }}
                      />
                      {/* Overlay sutil al hover */}
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300"></div>
                    </div>
                  ))}
                </div>
                <div className="text-center">
                  <button
                    onClick={() => setView("gallery")}
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
                currentPlan={profile?.plan || "free"}
              />
            </div>

            {/* Presets */}
            <AnimatedSection className="py-20 px-4">
              <div className="max-w-6xl mx-auto">
                <div className="text-center mb-12">
                  <h2 className="text-4xl font-bold mb-4">
                    Presets Profesionales
                  </h2>
                  <p className="text-muted text-lg">
                    Configuraciones optimizadas para diferentes estilos
                  </p>
                </div>
                <div className="grid md:grid-cols-3 gap-6">
                  {[
                    "Corporativo",
                    "Creativo",
                    "Natural",
                    "Editorial",
                    "Lifestyle",
                    "Minimalista",
                  ].map((preset) => (
                    <div
                      key={preset}
                      className="bg-[color:var(--surface)] rounded-xl p-6 border border-[color:var(--border)] hover:border-[color:var(--primary)] transition-all cursor-pointer"
                    >
                      <div className="w-12 h-12 rounded-lg bg-[color:var(--primary)]/20 flex items-center justify-center mb-4">
                        <Sparkles className="w-6 h-6 text-[color:var(--primary)]" />
                      </div>
                      <h3 className="text-xl font-semibold mb-2">{preset}</h3>
                      <p className="text-sm text-muted">
                        Preset optimizado para fotografía {preset.toLowerCase()}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </AnimatedSection>

            {/* CTA Guía PDF */}
            <section className="py-12 px-4">
              <div className="max-w-7xl mx-auto text-center">
                <h3 className="text-2xl font-heading font-semibold mb-3">
                  Guía para crear PROMPTS de retratos profesional{" "}
                  <span className="text-[color:var(--primary)]">GRATIS</span>
                </h3>
                <p className="text-lg text-muted mb-6">
                  Descarga nuestra guía en pdf
                </p>
                <a
                  href="/Promptraits_Guia_Completa_Prompts_y_Fotografia_v2.pdf"
                  download
                  className="inline-flex items-center justify-center space-x-2 bg-[color:var(--primary)] text-black px-8 py-4 rounded-full font-bold text-lg hover:shadow-lg transition-all"
                >
                  <Download className="w-5 h-5" />
                  <span>Descargar guía GRATIS</span>
                </a>
              </div>
            </section>

            {/* Footer */}
            <footer className="bg-black/20 border-t border-[color:var(--border)] py-12 px-4 mt-12">
              <div className="max-w-7xl mx-auto text-center">
                <button
                  type="button"
                  onClick={() => setView("home")}
                  className="inline-flex items-center mb-6"
                >
                  <img src="/logo.svg" alt="Logo" className="w-40 h-auto" />
                </button>
                <p className="text-muted max-w-lg mx-auto mb-6">
                  Plataforma profesional de prompts y retratos IA.
                </p>
                <div className="flex justify-center space-x-6 mb-8">
                  <a
                    href="https://www.instagram.com/sr_waly/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted hover:text-[color:var(--fg)] transition"
                  >
                    <Instagram />
                  </a>
                  <a
                    href="https://t.me/+nyMJxze9il4wZGJk"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted hover:text-[color:var(--fg)] transition"
                  >
                    <Send />
                  </a>
                </div>
                <p className="text-gray-600 text-sm">
                  © {new Date().getFullYear()} Promptraits by Sr. Waly.
                </p>
              </div>
            </footer>
          </>
        )}

        {/* GALERÍA */}
        {view === "gallery" && <Gallery />}

        {/* GENERADOR - ✅ CAMBIADO A AdvancedGenerator */}
        {view === "generator" && <AdvancedGenerator />}

        {/* PRECIOS */}
        {view === "pricing" && (
          <Pricing
            onSelectPlan={handlePlanSelection}
            currentPlan={profile?.plan || "free"}
          />
        )}

        {/* PERFIL */}
        {view === "profile" && <Profile />}

        {/* HISTORIAL */}
        {view === "history" && <History />}
      </main>

      {/* Auth Modal */}
      {showAuth && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          {authMode === "login" ? (
            <Login
              onClose={() => setShowAuth(false)}
              onSwitchToRegister={() => setAuthMode("register")}
              onSuccess={() => setShowAuth(false)}
            />
          ) : (
            <Register
              onClose={() => setShowAuth(false)}
              onSwitchToLogin={() => setAuthMode("login")}
              onSuccess={() => {
                setShowAuth(false);
                setView("generator");
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
            setShowCheckout(false);
            setSelectedPlan(null);
          }}
        />
      )}

      {/* Loading Overlay during checkout */}
      {isProcessingCheckout && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[color:var(--primary)] mx-auto mb-4"></div>
            <p className="text-white text-lg font-semibold">
              Redirigiendo a checkout...
            </p>
            <p className="text-gray-400 text-sm mt-2">
              No cierres esta ventana
            </p>
          </div>
        </div>
      )}

      {/* Payment Success Overlay */}
      {showPaymentSuccess && (
        <div className="fixed inset-0 bg-black/95 flex items-center justify-center z-50">
          <div className="max-w-md w-full bg-[color:var(--surface)] rounded-2xl p-8 border border-[color:var(--border)] text-center mx-4">
            <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg
                className="w-10 h-10 text-green-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h2 className="text-3xl font-bold mb-4 text-white">
              ¡Pago Exitoso!
            </h2>
            <p className="text-gray-400 mb-6">
              Tu compra se ha procesado correctamente. Actualizando tus
              créditos...
            </p>
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[color:var(--primary)] mx-auto"></div>
            <p className="text-sm text-gray-500 mt-4">
              Recargando en 3 segundos...
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
