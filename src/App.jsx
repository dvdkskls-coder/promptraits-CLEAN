// src/App.jsx - PARTE 1: IMPORTS Y SETUP

import { useState, useEffect } from "react";
import { supabase } from "./lib/supabase";
import { useAuth } from "./contexts/AuthContext";
import PromptGeneratorV2App from "./components/PromptGeneratorV2/PromptGeneratorV2App";

function App() {
  const { user, profile, loading: authLoading } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [authError, setAuthError] = useState("");
  const [authLoading2, setAuthLoading2] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  // ============================================================================
  // FUNCIONES DE AUTENTICACIÓN
  // ============================================================================

  const handleLogin = async (e) => {
    e.preventDefault();
    setAuthError("");
    setAuthLoading2(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      setShowAuthModal(false);
      setEmail("");
      setPassword("");
    } catch (error) {
      setAuthError(error.message);
    } finally {
      setAuthLoading2(false);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setAuthError("");
    setAuthLoading2(true);

    if (password !== confirmPassword) {
      setAuthError("Las contraseñas no coinciden");
      setAuthLoading2(false);
      return;
    }

    if (password.length < 6) {
      setAuthError("La contraseña debe tener al menos 6 caracteres");
      setAuthLoading2(false);
      return;
    }

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: window.location.origin,
        },
      });

      if (error) throw error;

      setSuccessMessage(
        "¡Cuenta creada! Revisa tu email para confirmar tu cuenta."
      );
      setEmail("");
      setPassword("");
      setConfirmPassword("");

      setTimeout(() => {
        setShowAuthModal(false);
        setSuccessMessage("");
      }, 3000);
    } catch (error) {
      setAuthError(error.message);
    } finally {
      setAuthLoading2(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  const openAuthModal = (mode) => {
    setAuthMode(mode);
    setShowAuthModal(true);
    setAuthError("");
    setSuccessMessage("");
  };

  const handleCheckout = async (planId) => {
    if (!user) {
      openAuthModal("login");
      return;
    }

    try {
      const response = await fetch("/api/create-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          planId,
          userId: user.id,
          userEmail: user.email,
        }),
      });

      const data = await response.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        alert("Error al crear la sesión de pago");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error al procesar el pago");
    }
  };
  // ============================================================================
  // DATOS DE PRESETS (mismo que antes)
  // ============================================================================

  const presets = [
    {
      id: 1,
      name: "Retrato Cinematográfico",
      subtitle: "Estilo película, dramático y profesional",
      promptBlock:
        "Professional cinematic portrait, dramatic lighting, shallow depth of field, shot on Arri Alexa with anamorphic lens, film grain texture, moody atmosphere, color graded like a Hollywood movie, 4K resolution, professional makeup and styling",
      isPro: false,
    },
    {
      id: 2,
      name: "Editorial de Moda",
      subtitle: "Alta costura, limpio y elegante",
      promptBlock:
        "High fashion editorial portrait, studio lighting setup, clean white background, sharp focus, shot on Hasselblad H6D-100c with 80mm lens, professional makeup, vogue magazine style, high-end retouching, ultra detailed, 8K quality",
      isPro: false,
    },
    {
      id: 3,
      name: "Luz Natural Dorada",
      subtitle: "Cálido, suave y orgánico",
      promptBlock:
        "Natural light portrait, golden hour photography, soft warm tones, bokeh background, shot on Canon EOS R5 with 85mm f/1.2 lens, shallow depth of field, film-like color grading, organic and authentic feel, professional color correction",
      isPro: false,
    },
    {
      id: 4,
      name: "Street Style Urbano",
      subtitle: "Moderno, fresco y auténtico",
      promptBlock:
        "Urban street style portrait, natural city lighting, graffiti background, candid pose, shot on Sony A7 III with 35mm lens, vibrant colors, documentary photography style, authentic urban environment, professional editing",
      isPro: true,
    },
    {
      id: 5,
      name: "Film Noir Clásico",
      subtitle: "Alto contraste, misterioso",
      promptBlock:
        "Film noir style portrait, dramatic shadows, high contrast black and white, venetian blind shadows, moody atmosphere, shot on vintage film camera, 1940s aesthetic, dramatic lighting setup, mystery and intrigue",
      isPro: true,
    },
    {
      id: 6,
      name: "Estudio Minimalista",
      subtitle: "Limpio, profesional, corporativo",
      promptBlock:
        "Minimalist studio portrait, even lighting, solid color background, clean and professional, shot on Phase One XF with 80mm lens, perfect exposure, corporate headshot style, neutral expression, high resolution",
      isPro: true,
    },
    {
      id: 7,
      name: "Retro Vintage",
      subtitle: "Nostálgico, colores desvanecidos",
      promptBlock:
        "Vintage film photography aesthetic, grainy texture, faded colors, shot on Kodak Portra 400, medium format camera, nostalgic 70s vibe, soft focus, warm color palette, analog photography feel",
      isPro: true,
    },
    {
      id: 8,
      name: "Cyberpunk Futurista",
      subtitle: "Neón, tecnológico, blade runner",
      promptBlock:
        "Cyberpunk style portrait, neon lighting, futuristic city background, rain and reflections, blue and pink color scheme, blade runner aesthetic, high contrast, cinematic color grading, sci-fi atmosphere",
      isPro: true,
    },
    {
      id: 9,
      name: "Fotografía de Revista",
      subtitle: "Glamour, portada de revista",
      promptBlock:
        "Magazine cover portrait, professional lighting, confident pose, bold colors, sharp details, shot on Hasselblad, fashion forward styling, celebrity photographer style, high-end production quality",
      isPro: true,
    },
    {
      id: 10,
      name: "Naturaleza Orgánica",
      subtitle: "Exterior, luz natural, bohemio",
      promptBlock:
        "Outdoor natural portrait, forest or field location, soft natural light, organic environment, earthy tones, shot on Canon EOS R with 50mm lens, shallow depth of field, bohemian aesthetic, connection with nature",
      isPro: true,
    },
    {
      id: 11,
      name: "Contraluz Dramático",
      subtitle: "Silueta, bordes iluminados",
      promptBlock:
        "Backlit portrait, rim lighting, dramatic silhouette, lens flare, golden hour backlighting, shot on Sony A7R IV with 85mm lens, ethereal atmosphere, glowing edges, professional color grading",
      isPro: true,
    },
    {
      id: 12,
      name: "Retrato Artístico",
      subtitle: "Conceptual, expresivo, único",
      promptBlock:
        "Artistic conceptual portrait, creative lighting, unique composition, fine art photography, shot on medium format camera, museum quality, expressive and emotional, avant-garde style, gallery-worthy",
      isPro: true,
    },
  ];

  const isPro =
    profile?.plan === "pro" ||
    profile?.plan === "premium" ||
    profile?.subscription_status === "active";

  const handleCopyPreset = (promptBlock) => {
    navigator.clipboard.writeText(promptBlock);
    alert("✅ Prompt copiado al portapapeles!");
  };

  // ============================================================================
  // RENDER
  // ============================================================================

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
        <div className="text-white text-xl">Cargando...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white">
      {/* ============================================================ */}
      {/* HEADER / NAVEGACIÓN */}
      {/* ============================================================ */}
      <header className="fixed top-0 w-full bg-black/90 backdrop-blur-md border-b border-[#D4AF37]/20 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="text-2xl">📸</span>
            <h1 className="text-xl font-bold bg-gradient-to-r from-[#D4AF37] to-[#FFD700] bg-clip-text text-transparent">
              Promptraits
            </h1>
          </div>

          <nav className="hidden md:flex items-center gap-6">
            <a href="#hero" className="hover:text-[#D4AF37] transition">
              Inicio
            </a>
            <a href="#generator" className="hover:text-[#D4AF37] transition">
              Generador
            </a>
            <a href="#gallery" className="hover:text-[#D4AF37] transition">
              Galería
            </a>
            <a href="#presets" className="hover:text-[#D4AF37] transition">
              Presets
            </a>
            <a href="#pricing" className="hover:text-[#D4AF37] transition">
              Planes
            </a>
          </nav>

          <div className="flex items-center gap-4">
            {user ? (
              <>
                <div className="text-sm">
                  <p className="text-zinc-400">{user.email}</p>
                  <p className="text-[#D4AF37] font-semibold">
                    Plan: {profile?.plan || "Free"} | Créditos:{" "}
                    {profile?.credits || 0}
                  </p>
                </div>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg transition"
                >
                  Cerrar Sesión
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => openAuthModal("login")}
                  className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg transition"
                >
                  Iniciar Sesión
                </button>
                <button
                  onClick={() => openAuthModal("signup")}
                  className="px-4 py-2 bg-[#D4AF37] hover:bg-[#FFD700] text-black font-semibold rounded-lg transition"
                >
                  Registrarse
                </button>
              </>
            )}
          </div>
        </div>
      </header>
      {/* ============================================================ */}
      {/* HERO SECTION */}
      {/* ============================================================ */}
      <section
        id="hero"
        className="pt-32 pb-20 bg-gradient-to-b from-[#0A0A0A] to-[#1A1A1A]"
      >
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-5xl md:text-7xl font-extrabold mb-6 bg-gradient-to-r from-[#D4AF37] via-[#FFD700] to-[#D4AF37] bg-clip-text text-transparent">
            Retratos profesionales con IA
          </h2>
          <p className="text-xl text-zinc-400 mb-8 max-w-3xl mx-auto">
            Genera prompts cinematográficos y profesionales para crear retratos
            de calidad editorial con IA.
          </p>
          <div className="flex gap-4 justify-center">
            <a
              href="#generator"
              className="px-8 py-4 bg-[#D4AF37] hover:bg-[#FFD700] text-black font-bold rounded-lg transition text-lg"
            >
              Empezar Ahora
            </a>
            <a
              href="#gallery"
              className="px-8 py-4 bg-zinc-800 hover:bg-zinc-700 rounded-lg transition text-lg"
            >
              Ver Galería
            </a>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* GENERADOR DE PROMPTS - ✅ NUEVA VERSIÓN */}
      {/* ============================================================ */}
      <section
        id="generator"
        className="py-16 bg-gradient-to-b from-[#1A1A1A] to-[#0A0A0A]"
      >
        <PromptGeneratorV2App />
      </section>

      {/* ============================================================ */}
      {/* GALERÍA */}
      {/* ============================================================ */}
      <section
        id="gallery"
        className="py-20 bg-gradient-to-b from-[#0A0A0A] to-[#1A1A1A]"
      >
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-4 bg-gradient-to-r from-[#D4AF37] to-[#FFD700] bg-clip-text text-transparent">
            Galería de Retratos
          </h2>
          <p className="text-center text-zinc-400 mb-12">
            Explora nuestros mejores prompts generados
          </p>
          <div className="text-center text-zinc-500 py-20">
            Galería próximamente...
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* PRESETS PROFESIONALES */}
      {/* ============================================================ */}
      <section
        id="presets"
        className="py-20 bg-gradient-to-b from-[#1A1A1A] to-[#0A0A0A]"
      >
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-4 bg-gradient-to-r from-[#D4AF37] to-[#FFD700] bg-clip-text text-transparent">
            Presets Profesionales
          </h2>
          <p className="text-center text-zinc-400 mb-4">
            Click para copiar al portapapeles
          </p>

          {!isPro && (
            <div className="max-w-2xl mx-auto mb-12 p-6 bg-zinc-900 border border-[#D4AF37]/30 rounded-xl text-center">
              <h3 className="text-xl font-bold mb-2 text-[#D4AF37]">
                🎨 Desbloquea todos los presets
              </h3>
              <p className="text-zinc-400 mb-4">
                Obtén acceso completo a los 12 presets profesionales con un plan
                PRO
              </p>
              <a
                href="#pricing"
                className="inline-block px-6 py-3 bg-[#D4AF37] hover:bg-[#FFD700] text-black font-semibold rounded-lg transition"
              >
                Ver Planes
              </a>
            </div>
          )}

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {presets.map((preset) => (
              <div
                key={preset.id}
                className={`bg-zinc-900 rounded-xl p-6 border transition-all ${
                  preset.isPro && !isPro
                    ? "border-zinc-800 opacity-60"
                    : "border-zinc-800 hover:border-[#D4AF37]/50"
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-white mb-1">
                      {preset.name}
                    </h3>
                    <p className="text-sm text-zinc-400">{preset.subtitle}</p>
                  </div>
                  {preset.isPro && !isPro && (
                    <span className="px-2 py-1 bg-[#D4AF37]/20 text-[#D4AF37] text-xs font-semibold rounded">
                      PRO
                    </span>
                  )}
                </div>

                {preset.isPro && !isPro ? (
                  <div className="bg-zinc-800/50 rounded-lg p-4 text-center">
                    <p className="text-zinc-500 text-sm mb-3">
                      🔒 Contenido bloqueado
                    </p>
                    <a
                      href="#pricing"
                      className="inline-block px-4 py-2 bg-[#D4AF37] hover:bg-[#FFD700] text-black text-sm font-semibold rounded-lg transition"
                    >
                      Actualiza a PRO
                    </a>
                  </div>
                ) : (
                  <>
                    <p className="text-sm text-zinc-300 bg-zinc-800/50 rounded-lg p-3 mb-3 font-mono leading-relaxed line-clamp-3">
                      {preset.promptBlock}
                    </p>
                    <button
                      onClick={() => handleCopyPreset(preset.promptBlock)}
                      className="w-full px-4 py-2 bg-zinc-800 hover:bg-[#D4AF37] hover:text-black font-semibold rounded-lg transition flex items-center justify-center gap-2"
                    >
                      📋 Copiar Prompt
                    </button>
                  </>
                )}
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <a
              href="https://promptraits.com/guia-prompts-retratos.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-8 py-4 bg-gradient-to-r from-[#D4AF37] to-[#FFD700] text-black font-bold rounded-lg hover:shadow-lg hover:shadow-[#D4AF37]/50 transition text-lg"
            >
              📥 Guía para crear PROMPTS de retratos profesional{" "}
              <span className="bg-red-500 text-white px-2 py-0.5 rounded text-sm ml-2">
                GRATIS
              </span>
            </a>
            <p className="text-zinc-400 mt-3">Descarga nuestra guía en pdf</p>
          </div>
        </div>
      </section>
      {/* ============================================================ */}
      {/* PRICING / PLANES */}
      {/* ============================================================ */}
      <section
        id="pricing"
        className="py-20 bg-gradient-to-b from-[#0A0A0A] to-[#1A1A1A]"
      >
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-4 bg-gradient-to-r from-[#D4AF37] to-[#FFD700] bg-clip-text text-transparent">
            Elige tu Plan
          </h2>
          <p className="text-center text-zinc-400 mb-12">
            Desbloquea todo el potencial de Promptraits
          </p>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* FREE */}
            <div className="bg-zinc-900 rounded-2xl p-8 border border-zinc-800">
              <h3 className="text-2xl font-bold mb-2">Free</h3>
              <p className="text-4xl font-bold mb-4">
                €0<span className="text-lg text-zinc-400">/mes</span>
              </p>
              <ul className="space-y-3 mb-6">
                <li className="flex items-center gap-2">
                  <span className="text-green-500">✓</span> 3 Presets básicos
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-500">✓</span> Generador básico
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-red-500">✗</span> Sin créditos
                </li>
              </ul>
              <button
                disabled
                className="w-full px-6 py-3 bg-zinc-800 text-zinc-500 rounded-lg cursor-not-allowed"
              >
                Plan Actual
              </button>
            </div>

            {/* PRO */}
            <div className="bg-gradient-to-b from-[#D4AF37]/10 to-zinc-900 rounded-2xl p-8 border-2 border-[#D4AF37] relative">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-[#D4AF37] text-black text-sm font-bold rounded-full">
                MÁS POPULAR
              </div>
              <h3 className="text-2xl font-bold mb-2 text-[#D4AF37]">Pro</h3>
              <p className="text-4xl font-bold mb-4">
                €6.99<span className="text-lg text-zinc-400">/mes</span>
              </p>
              <ul className="space-y-3 mb-6">
                <li className="flex items-center gap-2">
                  <span className="text-green-500">✓</span> 12 Presets
                  profesionales
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-500">✓</span> Generador avanzado
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-500">✓</span> 60 créditos/mes
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-500">✓</span> Soporte prioritario
                </li>
              </ul>
              <button
                onClick={() => handleCheckout("pro")}
                className="w-full px-6 py-3 bg-[#D4AF37] hover:bg-[#FFD700] text-black font-bold rounded-lg transition"
              >
                Empezar Ahora
              </button>
            </div>

            {/* PREMIUM */}
            <div className="bg-zinc-900 rounded-2xl p-8 border border-zinc-800">
              <h3 className="text-2xl font-bold mb-2">Premium</h3>
              <p className="text-4xl font-bold mb-4">
                €19.99<span className="text-lg text-zinc-400">/mes</span>
              </p>
              <ul className="space-y-3 mb-6">
                <li className="flex items-center gap-2">
                  <span className="text-green-500">✓</span> Todo de Pro
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-500">✓</span> 300 créditos/mes
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-500">✓</span> API access
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-500">✓</span> Uso comercial
                </li>
              </ul>
              <button
                onClick={() => handleCheckout("premium")}
                className="w-full px-6 py-3 bg-zinc-800 hover:bg-zinc-700 rounded-lg transition"
              >
                Empezar Ahora
              </button>
            </div>
          </div>

          {/* Packs de créditos */}
          <div className="mt-16 max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold text-center mb-8">
              O compra créditos adicionales
            </h3>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-zinc-900 rounded-xl p-6 border border-zinc-800 text-center">
                <p className="text-3xl font-bold mb-2">20 créditos</p>
                <p className="text-2xl text-[#D4AF37] mb-4">€3.99</p>
                <button
                  onClick={() => handleCheckout("credits-20")}
                  className="w-full px-4 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg transition"
                >
                  Comprar
                </button>
              </div>
              <div className="bg-zinc-900 rounded-xl p-6 border border-zinc-800 text-center">
                <p className="text-3xl font-bold mb-2">50 créditos</p>
                <p className="text-2xl text-[#D4AF37] mb-4">€8.99</p>
                <button
                  onClick={() => handleCheckout("credits-50")}
                  className="w-full px-4 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg transition"
                >
                  Comprar
                </button>
              </div>
              <div className="bg-zinc-900 rounded-xl p-6 border border-zinc-800 text-center">
                <p className="text-3xl font-bold mb-2">100 créditos</p>
                <p className="text-2xl text-[#D4AF37] mb-4">€15.99</p>
                <button
                  onClick={() => handleCheckout("credits-100")}
                  className="w-full px-4 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg transition"
                >
                  Comprar
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* FOOTER */}
      {/* ============================================================ */}
      <footer className="py-12 bg-black border-t border-zinc-800">
        <div className="container mx-auto px-4 text-center text-zinc-400">
          <p>© 2024 Promptraits. Todos los derechos reservados.</p>
        </div>
      </footer>

      {/* ============================================================ */}
      {/* MODAL DE AUTENTICACIÓN */}
      {/* ============================================================ */}
      {showAuthModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-zinc-900 rounded-2xl p-8 max-w-md w-full border border-zinc-800">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">
                {authMode === "login" ? "Iniciar Sesión" : "Crear Cuenta"}
              </h2>
              <button
                onClick={() => setShowAuthModal(false)}
                className="text-zinc-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            {successMessage && (
              <div className="mb-4 p-3 bg-green-500/20 border border-green-500 rounded-lg text-green-400 text-sm">
                {successMessage}
              </div>
            )}

            {authError && (
              <div className="mb-4 p-3 bg-red-500/20 border border-red-500 rounded-lg text-red-400 text-sm">
                {authError}
              </div>
            )}

            <form onSubmit={authMode === "login" ? handleLogin : handleSignup}>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">
                  Contraseña
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                  required
                />
              </div>

              {authMode === "signup" && (
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">
                    Confirmar Contraseña
                  </label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                    required
                  />
                </div>
              )}

              <button
                type="submit"
                disabled={authLoading2}
                className="w-full px-6 py-3 bg-[#D4AF37] hover:bg-[#FFD700] text-black font-bold rounded-lg transition disabled:opacity-50"
              >
                {authLoading2
                  ? "Procesando..."
                  : authMode === "login"
                  ? "Iniciar Sesión"
                  : "Crear Cuenta"}
              </button>
            </form>

            <div className="mt-4 text-center">
              <button
                onClick={() =>
                  setAuthMode(authMode === "login" ? "signup" : "login")
                }
                className="text-[#D4AF37] hover:underline"
              >
                {authMode === "login"
                  ? "¿No tienes cuenta? Regístrate"
                  : "¿Ya tienes cuenta? Inicia sesión"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
