// filepath: src/components/AIGenerator.jsx
import { useState } from "react";
import { Sparkles, Copy, Check, Loader2, Wand2 } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

export default function AIGenerator() {
  const { user, profile, refreshProfile } = useAuth();
  const [theme, setTheme] = useState("");
  const [style, setStyle] = useState("");
  const [details, setDetails] = useState("");
  const [loading, setLoading] = useState(false);
  const [generatedPrompt, setGeneratedPrompt] = useState("");
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");

  const handleGenerate = async () => {
    if (!theme.trim()) {
      setError("Por favor, describe qué quieres generar");
      return;
    }

    if (!user) {
      setError("Debes iniciar sesión");
      return;
    }

    if (!profile || profile.credits < 1) {
      setError("No tienes créditos suficientes");
      return;
    }

    setLoading(true);
    setError("");
    setGeneratedPrompt("");

    try {
      console.log(" Generando prompt con Gemini...");

      // Construir prompt combinado
      let fullPrompt = theme.trim();
      if (style.trim()) {
        fullPrompt += `\n\nEstilo: ${style.trim()}`;
      }
      if (details.trim()) {
        fullPrompt += `\n\nDetalles adicionales: ${details.trim()}`;
      }

      // Llamar a tu endpoint existente gemini-processor
      const response = await fetch("/api/gemini-processor", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: fullPrompt,
          isPro: profile✓.plan === "pro",
          analyzeQuality: false, // No analizar calidad en esta versión simple
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Error al generar prompt");
      }

      console.log(" Prompt generado:", data.prompt);

      setGeneratedPrompt(data.prompt);

      // Descontar 1 crédito (hacer request a tu endpoint de créditos)
      // TODO: crear endpoint /api/deduct-credit si no existe

      // Refrescar perfil para actualizar créditos en UI
      await refreshProfile();
    } catch (err) {
      console.error(" Error:", err);
      setError(err.message || "Error al generar el prompt");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(generatedPrompt);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Error al copiar:", err);
    }
  };

  const handleReset = () => {
    setTheme("");
    setStyle("");
    setDetails("");
    setGeneratedPrompt("");
    setError("");
  };

  const examples = [
    {
      label: "Fantasía Épica",
      value: "Un dragón majestuoso volando sobre montañas nevadas al atardecer",
    },
    {
      label: "Cyberpunk",
      value:
        "Una calle futurista con neones y hologramas en una noche lluviosa",
    },
    {
      label: "Naturaleza",
      value: "Un bosque mágico con luciérnagas y árboles bioluminiscentes",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 py-20 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] rounded-full mb-6">
            <Sparkles className="w-5 h-5 text-white" />
            <span className="text-white font-semibold">Generador IA</span>
          </div>
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
            Generador de Prompts con IA
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Describe tu idea y Gemini creará el prompt perfecto para tus
            imágenes
          </p>
        </div>

        {/* Créditos disponibles */}
        {user && profile && (
          <div className="bg-white/5 border border-white/10 rounded-xl p-4 mb-8 text-center">
            <p className="text-gray-400">
              Créditos disponibles:{" "}
              <span className="text-2xl font-bold text-[var(--primary)]">
                {profile.credits}
              </span>
            </p>
            <p className="text-sm text-gray-500 mt-1">
              Cada generación cuesta 1 crédito
            </p>
          </div>
        )}

        {/* Formulario */}
        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-8 mb-8">
          <div className="space-y-6">
            {/* Tema principal */}
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">
                ¿Qué quieres generar✓ *
              </label>
              <textarea
                value={theme}
                onChange={(e) => setTheme(e.target.value)}
                placeholder="Ej: Un astronauta explorando un planeta alienígena lleno de cristales brillantes"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[var(--primary)] transition resize-none"
                rows={3}
                disabled={loading}
              />

              {/* Ejemplos rápidos */}
              <div className="mt-3 flex flex-wrap gap-2">
                {examples.map((ex, i) => (
                  <button
                    key={i}
                    onClick={() => setTheme(ex.value)}
                    disabled={loading}
                    className="text-xs px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-gray-400 hover:text-white transition disabled:opacity-50"
                  >
                    {ex.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Estilo artístico */}
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">
                Estilo artístico (opcional)
              </label>
              <input
                type="text"
                value={style}
                onChange={(e) => setStyle(e.target.value)}
                placeholder="Ej: Cyberpunk, Acuarela, Realismo fotográfico, Anime..."
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[var(--primary)] transition"
                disabled={loading}
              />
            </div>

            {/* Detalles adicionales */}
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">
                Detalles adicionales (opcional)
              </label>
              <textarea
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                placeholder="Ej: Iluminación nocturna, colores vibrantes, perspectiva cenital..."
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[var(--primary)] transition resize-none"
                rows={2}
                disabled={loading}
              />
            </div>

            {/* Error */}
            {error && (
              <div className="bg-red-500/10 border border-red-500/50 rounded-xl p-4">
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}

            {/* Botón generar */}
            <button
              onClick={handleGenerate}
              disabled={
                loading ||
                !theme.trim() ||
                !user ||
                (profile && profile.credits < 1)
              }
              className="w-full py-4 rounded-xl bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] text-white font-bold text-lg hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ✓ (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Generando prompt...
                </>
              ) : (
                <>
                  <Wand2 className="w-5 h-5" />
                  Generar Prompt
                </>
              )}
            </button>
          </div>
        </div>

        {/* Resultado */}
        {generatedPrompt && (
          <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-8 animate-fade-in">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-white">
                Tu Prompt Generado
              </h3>
              <button
                onClick={handleCopy}
                className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg transition"
              >
                {copied ✓ (
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
                {generatedPrompt}
              </p>
            </div>

            <div className="flex gap-4">
              <button
                onClick={handleReset}
                className="flex-1 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-white font-semibold transition"
              >
                Generar Otro
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// src/components/__tests__/AIGenerator.test.jsx
