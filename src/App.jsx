import React, { useState, useMemo, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
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

import Gallery from "./components/Gallery.jsx";
import AdvancedGenerator from "./components/AdvancedGenerator.jsx";
import History from "./components/History.jsx";

import QualityAnalysis from "./components/QualityAnalysis.jsx";

// Sistema Legal
import Footer from "./components/Footer.jsx";
import CookieBanner from "./components/CookieBanner.jsx";
import LegalPages from "./pages/LegalPages.jsx";
import FAQ from "./pages/FAQ.jsx";
import Contacto from "./pages/Contacto.jsx";

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
      "Ultra-realistic editorial portrait with dramatic Rembrandt lighting setup. Key light at 45° creating signature triangle on shadow side cheek. 85mm f/1.4 lens on full-frame sensor, aperture at f/1.8 for shallow depth of field. ISO 400, shutter 1/160s, tungsten white balance 3200K. Dark moody background with subtle rim light separating subject. Low-key exposure with preserved detail in shadows. Cinematic color grading with crushed blacks and warm skin tones.",
  },
  {
    id: 2,
    name: "Golden Hour Lifestyle",
    subtitle: "Cálido atardecer",
    free: true,
    promptBlock:
      "Natural lifestyle portrait during golden hour sunset. Soft warm backlight from sun creating natural rim light and hair highlights. 50mm f/1.8 lens at f/2.2 for dreamy background separation. Subject positioned with sun behind creating warm atmospheric glow. Reflector providing subtle fill from camera direction. Warm color temperature 5500K emphasizing golden tones. Lifestyle candid pose with natural expression.",
  },
  {
    id: 3,
    name: "Corporate Clean",
    subtitle: "High-Key profesional",
    free: true,
    promptBlock:
      "High-key professional corporate headshot. Butterfly lighting setup with main light directly above camera creating subtle nose shadow. Bright even illumination, minimal shadows. Clean white or light gray background. 85mm lens at f/4 for optimal sharpness across face. Confident professional expression with direct eye contact. Smart business attire. High-key exposure maintaining detail in highlights. Clean modern professional aesthetic.",
  },
  {
    id: 4,
    name: "Environmental Portrait",
    subtitle: "Sujeto en su entorno",
    free: false,
    promptBlock:
      "Environmental portrait showing subject in meaningful location context. Wide aperture 35mm lens at f/2.8 balancing subject sharpness with contextual background. Natural available light supplemented with off-camera flash for subject illumination. Subject positioned using rule of thirds. Environmental elements telling story about subject's work or passion. Authentic candid interaction with environment.",
  },
  {
    id: 5,
    name: "Beauty Soft Front",
    subtitle: "Beauty homogéneo",
    free: false,
    promptBlock:
      "High-end beauty portrait with soft butterfly lighting. Large octabox directly in front and above creating wraparound illumination. Minimal shadows, even skin tone rendering. Beauty dish or ring light for catchlights. 85mm-100mm lens at f/4-f/5.6 for optimal sharpness. Neutral background. Focus on skin texture, makeup, and facial details. Clean professional beauty aesthetic.",
  },
  {
    id: 6,
    name: "B/N Clásico Film",
    subtitle: "Monocromo atemporal",
    free: false,
    promptBlock:
      "Classic black and white portrait with timeless film aesthetic. Modified Rembrandt or loop lighting for dimensional modeling. High contrast with preserved shadow detail. Grain structure mimicking Tri-X 400 film. Strong tonal separation. Dramatic side lighting emphasizing texture and form. Monochrome conversion optimized for skin tones. Timeless compositional approach.",
  },
  {
    id: 7,
    name: "Fotografía Urbana Street",
    subtitle: "Energía callejera",
    free: false,
    promptBlock:
      "Urban street photography portrait in authentic city environment. Natural available light, possibly neon or artificial street lighting. 35mm-50mm lens capturing environmental context. Subject interacting naturally with urban setting. Candid or semi-posed moment. Street fashion aesthetic. Gritty urban textures and architectural elements. Documentary storytelling approach.",
  },
  {
    id: 8,
    name: "Ensueño Vintage 70s",
    subtitle: "Nostálgico y cálido",
    free: false,
    promptBlock:
      "Dreamy 1970s vintage aesthetic portrait. Soft focus lens or diffusion filter creating ethereal quality. Warm peachy skin tones, muted pastels. Sun flare and light leaks reminiscent of vintage film. 70s fashion and styling elements. Nostalgic color palette with reduced contrast. Romantic soft lighting. Retro vignetting and grain structure.",
  },
  {
    id: 9,
    name: "Film Noir Clásico",
    subtitle: "Drama B/N años 40-50",
    free: false,
    promptBlock:
      "Classic film noir dramatic portrait. Hard side lighting at 90° creating deep shadows and high contrast. Strong directional light source. Mystery and drama emphasized through lighting. Venetian blind shadow patterns or environmental shadows. Low-key exposure. Black and white with rich blacks. 1940s-50s styling and composition. Dramatic mysterious mood.",
  },
  {
    id: 10,
    name: "Neón Cyberpunk",
    subtitle: "Futurista urbano nocturno",
    free: false,
    promptBlock:
      "Futuristic cyberpunk portrait with neon lighting. Vibrant colored neon lights (cyan, magenta, purple) as key light sources. Urban night environment with neon signs. Shallow depth of field isolating subject from background bokeh of city lights. Cinematic color grading with teal and orange tones. Rain or wet surfaces reflecting neon. Futuristic fashion aesthetic. High contrast with bold colors.",
  },
  {
    id: 11,
    name: "Retrato íntimo Ventana",
    subtitle: "Luz natural pensativa",
    free: false,
    promptBlock:
      "Intimate window light portrait with contemplative mood. Large window as single soft light source from side. Subject positioned near window for soft wraparound illumination. Gentle falloff creating dimensional form. Natural contemplative pose, possibly looking toward or away from window. Interior setting with subtle environmental context. Soft natural color palette. Quiet introspective atmosphere.",
  },
  {
    id: 12,
    name: "Acción Deportiva Congelado",
    subtitle: "Movimiento nítido",
    free: false,
    promptBlock:
      "Dynamic sports action portrait with frozen motion. Fast shutter speed 1/1000s or higher freezing peak action moment. Powerful off-camera flash synchronizing with action. Wide aperture maintaining subject isolation. Decisive moment capturing athletic intensity. Sweat, determination visible. Dramatic lighting emphasizing muscular form. Dynamic composition with tension and energy.",
  },
  {
    id: 13,
    name: "Producto Minimalista Lujo",
    subtitle: "Elegante y limpio",
    free: false,
    promptBlock:
      "Minimalist luxury product photography aesthetic applied to portrait. Clean backgrounds, typically white or neutral. Precise controlled lighting with gradients. Emphasis on clean lines and sophisticated styling. Fashion-forward luxury brand aesthetic. Minimal but considered styling. High-end retouching maintaining natural texture. Sophisticated color palette. Editorial luxury magazine quality.",
  },
  {
    id: 14,
    name: "Fantasía Surrealista Etéreo",
    subtitle: "Onírico y de otro mundo",
    free: false,
    promptBlock:
      "Surreal ethereal fantasy portrait with dreamlike quality. Multiple exposures or composite lighting for otherworldly effect. Unusual color grading - perhaps cool tones or unexpected color shifts. Atmospheric fog or haze. Fantastical or flowing wardrobe. Mysterious surreal props or environmental elements. Dreamy soft focus areas. Imaginative conceptual approach transcending reality.",
  },
  {
    id: 15,
    name: "Editorial Fashion",
    subtitle: "Alta moda dramática",
    free: false,
    promptBlock:
      "High-fashion editorial portrait with dramatic styling. Bold dramatic lighting, possibly with hard light sources. Strong fashion-forward wardrobe and styling. Creative use of color or monochrome. Dynamic pose with strong lines. High contrast and bold compositional choices. Magazine editorial quality. Avant-garde creative direction. Professional hair, makeup, and wardrobe styling.",
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

// Planes y créditos
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
  const [showCopyNotification, setShowCopyNotification] = useState(false);

  const isPro = profile?.plan === "pro" || profile?.plan === "premium";

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

    if (plan.name === "FREE") {
      return;
    }

    setSelectedPlan(plan);
    setShowCheckout(true);
  };

  // Cerrar sesión
  const handleLogout = async () => {
    await supabase.auth.signOut();
    setShowUserMenu(false);
    setView("home");
  };

  // Función de copia
  const handleCopyPreset = async (preset) => {
    // Solo copiar si es FREE o usuario tiene plan PRO
    if (!preset.free && !isPro) {
      // Si es PRO sin plan, redirigir a planes
      setView("pricing");
      return;
    }

    try {
      await navigator.clipboard.writeText(preset.promptBlock);
      setShowCopyNotification(true);
      setTimeout(() => {
        setShowCopyNotification(false);
      }, 2000);
    } catch (error) {
      console.error("Error al copiar:", error);
      alert("Error al copiar el preset");
    }
  };

  // Menú de navegación
  const navItems = [
    { label: "Inicio", value: "home" },
    { label: "Galería", value: "gallery" },
    { label: "Generador IA", value: "generator" },
    { label: "Presets", value: "presets" },
    { label: "Planes", value: "pricing" },
  ];

  // Mi Perfil e Historial ya no se muestran en el menú principal
  // Están accesibles desde el botón de usuario (UserMenu)

  return (
    <div className="min-h-screen bg-[color:var(--bg)] text-[color:var(--fg)]">
      {/* HEADER */}
      <header className="sticky top-0 z-40 bg-black/60 backdrop-blur-xl border-b border-[color:var(--border)]">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
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
            {user && (
              <div className="hidden lg:flex items-center px-3 py-1.5 bg-[color:var(--surface)] rounded-full border border-[color:var(--border)]">
                <Gift className="w-4 h-4 text-[color:var(--primary)] mr-1.5" />
                <span className="text-sm font-semibold">
                  {profile?.credits ?? 0}
                </span>
              </div>
            )}

            {user ? (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="hidden lg:flex items-center space-x-2 px-4 py-2 bg-[color:var(--primary)] text-black rounded-full font-bold hover:opacity-90 transition"
                >
                  {isPro && <Crown className="w-4 h-4" />}
                  <span>{user.email?.split("@")[0]}</span>
                </button>
                {showUserMenu && (
                  <UserMenu
                    onLogout={handleLogout}
                    profile={profile}
                    onNavigate={(viewName) => {
                      setView(viewName);
                      setShowUserMenu(false);
                    }}
                  />
                )}
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

              {user && (
                <div className="pt-3 border-t border-[color:var(--border)] space-y-2">
                  {/* Créditos */}
                  <div className="flex items-center justify-between px-3 py-2 bg-[color:var(--surface)] rounded-lg">
                    <span className="text-sm text-muted">Créditos</span>
                    <div className="flex items-center">
                      <Gift className="w-4 h-4 text-[color:var(--primary)] mr-1.5" />
                      <span className="text-sm font-semibold">
                        {profile?.credits ?? 0}
                      </span>
                    </div>
                  </div>

                  {/* Usuario */}
                  <div className="flex items-center px-3 py-2 bg-[color:var(--surface)] rounded-lg">
                    {isPro && <Crown className="w-4 h-4 text-[color:var(--primary)] mr-2" />}
                    <span className="text-sm font-medium">
                      {user.email?.split("@")[0]}
                    </span>
                  </div>

                  {/* Mi Perfil */}
                  <button
                    type="button"
                    onClick={() => {
                      setView("profile");
                      setShowMobileMenu(false);
                    }}
                    className="w-full py-2 px-4 text-left text-sm border border-[color:var(--border)] rounded-lg hover:bg-[color:var(--surface)] transition"
                  >
                    Mi Perfil
                  </button>

                  {/* Historial */}
                  <button
                    type="button"
                    onClick={() => {
                      setView("history");
                      setShowMobileMenu(false);
                    }}
                    className="w-full py-2 px-4 text-left text-sm border border-[color:var(--border)] rounded-lg hover:bg-[color:var(--surface)] transition"
                  >
                    Historial
                  </button>

                  {/* Cerrar Sesión */}
                  <button
                    type="button"
                    onClick={() => {
                      handleLogout();
                      setShowMobileMenu(false);
                    }}
                    className="w-full py-2 px-4 text-left text-sm bg-red-500/10 text-red-400 border border-red-500/30 rounded-lg hover:bg-red-500/20 transition"
                  >
                    Cerrar Sesión
                  </button>
                </div>
              )}
            </nav>
          </div>
        )}
      </header>

      {/* NOTIFICACIÓN DE COPIA */}
      {showCopyNotification && (
        <div className="fixed top-24 left-1/2 transform -translate-x-1/2 z-50 animate-bounce">
          <div className="bg-green-500 text-white px-6 py-3 rounded-full shadow-lg flex items-center space-x-2">
            <Check className="w-5 h-5" />
            <span className="font-semibold">Preset copiado</span>
          </div>
        </div>
      )}

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

            {/* PLANES */}
            <div className="py-20 px-4">
              <Pricing
                onSelectPlan={handlePlanSelection}
                currentPlan={profile?.plan || "free"}
              />
            </div>

            {/* Presets Preview en Home */}
            <AnimatedSection className="py-20 px-4">
              <div className="max-w-6xl mx-auto">
                <div className="text-center mb-12">
                  <h2 className="text-4xl font-bold mb-4">
                    Presets Profesionales
                  </h2>
                  <p className="text-muted text-lg">
                    Click para copiar al portapapeles
                  </p>
                </div>
                <div className="grid md:grid-cols-3 gap-6 mb-8">
                  {PRESETS.slice(0, 6).map((preset) => {
                    const canView = preset.free || isPro;

                    return (
                      <div
                        key={preset.id}
                        onClick={() => handleCopyPreset(preset)}
                        className={`bg-[color:var(--surface)] rounded-xl p-6 border border-[color:var(--border)] hover:border-[color:var(--primary)] transition-all relative group ${
                          canView ? "cursor-pointer" : "cursor-pointer"
                        }`}
                      >
                        {!preset.free && (
                          <div className="absolute top-4 right-4">
                            <Crown className="w-4 h-4 text-[color:var(--primary)]" />
                          </div>
                        )}
                        <div
                          className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 ${
                            preset.free
                              ? "bg-green-500/20"
                              : "bg-[color:var(--primary)]/20"
                          }`}
                        >
                          <Sparkles
                            className={`w-6 h-6 ${
                              preset.free
                                ? "text-green-500"
                                : "text-[color:var(--primary)]"
                            }`}
                          />
                        </div>
                        <h3 className="text-xl font-semibold mb-2">
                          {preset.name}
                        </h3>
                        <p className="text-sm text-[color:var(--primary)] mb-3">
                          {preset.subtitle}
                        </p>

                        {/* ✅ Contenido: mostrar si canView, sino mensaje bloqueado */}
                        <div className="mb-4 min-h-[60px]">
                          {canView ? (
                            <p className="text-xs text-muted line-clamp-3">
                              {preset.promptBlock}
                            </p>
                          ) : (
                            <div className="flex flex-col items-center justify-center py-4 px-3 bg-black/20 rounded-lg border border-[color:var(--primary)]/30">
                              <Lock className="w-8 h-8 text-[color:var(--primary)] mb-2" />
                              <p className="text-xs text-center text-muted">
                                Contenido exclusivo
                              </p>
                              <p className="text-xs text-center text-[color:var(--primary)] font-semibold">
                                Plan PRO
                              </p>
                            </div>
                          )}
                        </div>

                        {/* Footer */}
                        {canView ? (
                          <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center text-xs text-[color:var(--primary)]">
                            <Copy className="w-3 h-3 mr-1" />
                            Click para copiar
                          </div>
                        ) : (
                          <div className="flex items-center text-xs text-muted justify-center">
                            <span>Click para desbloquear</span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
                <div className="text-center">
                  <button
                    onClick={() => setView("presets")}
                    className="px-8 py-3 bg-[color:var(--primary)] text-black font-bold rounded-lg hover:opacity-90 transition"
                  >
                    Ver Todos los Presets
                  </button>
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
            {/* Footer antiguo eliminado - Ahora se usa el componente Footer al final del AppContent */}
          </>
        )}

        {/* GALERÍA */}
        {view === "gallery" && <Gallery />}

        {/* GENERADOR */}
        {view === "generator" && <AdvancedGenerator />}

        {/* PRESETS - VISTA DEDICADA */}
        {view === "presets" && (
          <div className="min-h-screen py-20 px-4">
            <AnimatedSection className="max-w-6xl mx-auto">
              <div className="text-center mb-12">
                <h1 className="text-5xl font-bold mb-4">
                  Presets Profesionales
                </h1>
                <p className="text-muted text-xl mb-2">
                  Click en cualquier preset para copiarlo
                </p>
                <p className="text-sm text-muted">
                  {isPro
                    ? "Tienes acceso completo a todos los presets"
                    : "Los presets PRO requieren suscripción PRO o PREMIUM"}
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-6 mb-12">
                {PRESETS.map((preset) => {
                  const canView = preset.free || isPro;

                  return (
                    <div
                      key={preset.id}
                      className={`bg-[color:var(--surface)] rounded-xl p-6 border transition-all relative group ${
                        canView
                          ? "border-[color:var(--border)] hover:border-[color:var(--primary)] cursor-pointer"
                          : "border-[color:var(--border)] hover:border-[color:var(--primary)] cursor-pointer"
                      }`}
                      onClick={() => handleCopyPreset(preset)}
                    >
                      {!preset.free && (
                        <div className="absolute top-4 right-4">
                          <Crown className="w-5 h-5 text-[color:var(--primary)]" />
                        </div>
                      )}

                      <div
                        className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 ${
                          preset.free
                            ? "bg-green-500/20"
                            : "bg-[color:var(--primary)]/20"
                        }`}
                      >
                        <Sparkles
                          className={`w-6 h-6 ${
                            preset.free
                              ? "text-green-500"
                              : "text-[color:var(--primary)]"
                          }`}
                        />
                      </div>

                      <h3 className="text-xl font-semibold mb-2">
                        {preset.name}
                      </h3>
                      <p className="text-sm text-[color:var(--primary)] mb-4">
                        {preset.subtitle}
                      </p>

                      {/* ✅ Contenido o mensaje bloqueado */}
                      <div className="mb-4 min-h-[100px] flex items-center">
                        {canView ? (
                          <p className="text-sm text-muted">
                            {preset.promptBlock}
                          </p>
                        ) : (
                          <div className="w-full flex flex-col items-center justify-center py-6 px-4 bg-black/30 rounded-lg border border-[color:var(--primary)]/40">
                            <Lock className="w-10 h-10 text-[color:var(--primary)] mb-3" />
                            <p className="text-sm text-center text-muted mb-1">
                              Contenido bloqueado
                            </p>
                            <p className="text-xs text-center text-[color:var(--primary)] font-semibold">
                              Actualiza a PRO para desbloquear
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Footer */}
                      <div className="flex items-center justify-between pt-2 border-t border-[color:var(--border)]">
                        {preset.free ? (
                          <>
                            <div className="inline-flex items-center text-xs text-green-400">
                              <Check className="w-4 h-4 mr-1" />
                              Gratis
                            </div>
                            {canView && (
                              <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center text-xs text-green-500">
                                <Copy className="w-3 h-3 mr-1" />
                                Copiar
                              </div>
                            )}
                          </>
                        ) : (
                          <>
                            <div className="inline-flex items-center text-xs text-[color:var(--primary)]">
                              <Crown className="w-4 h-4 mr-1" />
                              Plan PRO
                            </div>
                            {canView ? (
                              <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center text-xs text-[color:var(--primary)]">
                                <Copy className="w-3 h-3 mr-1" />
                                Copiar
                              </div>
                            ) : (
                              <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center text-xs text-muted">
                                <span>Ver planes</span>
                              </div>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {!isPro && (
                <div className="mt-12 text-center bg-[color:var(--surface)] border border-[color:var(--border)] rounded-2xl p-8">
                  <Crown className="w-16 h-16 text-[color:var(--primary)] mx-auto mb-4" />
                  <h3 className="text-2xl font-bold mb-2">
                    Desbloquea todos los presets
                  </h3>
                  <p className="text-muted mb-6 text-lg">
                    Obtén acceso completo a los 12 presets profesionales con un
                    plan PRO
                  </p>
                  <button
                    onClick={() => setView("pricing")}
                    className="px-8 py-4 bg-[color:var(--primary)] text-black font-bold rounded-full text-lg hover:opacity-90 transition inline-flex items-center"
                  >
                    <Crown className="w-5 h-5 mr-2" />
                    Ver Planes
                  </button>
                </div>
              )}
            </AnimatedSection>
          </div>
        )}

        {/* PLANES */}
        {view === "pricing" && (
          <Pricing
            onSelectPlan={handlePlanSelection}
            currentPlan={profile?.plan || "free"}
          />
        )}

        {/* PERFIL */}
        {view === "profile" && (
          <Profile
            onNavigate={(viewName) => setView(viewName)}
            onAccountDeleted={() => {
              // Refrescar la página automáticamente al eliminar cuenta
              window.location.reload();
            }}
          />
        )}

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

      {/* Footer en todas las páginas */}
      <Footer />

      {/* Banner de Cookies */}
      <CookieBanner />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Ruta principal de la aplicación */}
          <Route path="/" element={<AppContent />} />

          {/* Rutas del sistema legal */}
          <Route path="/legal/:page" element={<LegalPages />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/contacto" element={<Contacto />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}
