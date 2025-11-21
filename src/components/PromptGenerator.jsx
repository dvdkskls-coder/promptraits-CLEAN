import React, { useState } from "react";
import { Sparkles, Camera, Aperture } from "lucide-react";
import { generatePrompt } from "../services/geminiService";

const SHOT_TYPES = [
  "Automático",
  "Extreme Close-Up",
  "Close-Up",
  "Medium Shot",
  "American Shot",
  "Full Shot",
  "Long Shot",
];

const PHOTO_STYLES = [
  "Automático",
  "Cinemático",
  "Retrato Editorial",
  "Fotografía de Moda",
  "Film Noir",
  "Cyberpunk",
  "Documental",
  "Analog Film",
  "Kodak Portra",
];

const PromptGenerator = () => {
  const [idea, setIdea] = useState("");
  const [loading, setLoading] = useState(false);
  const [generatedPrompt, setGeneratedPrompt] = useState("");
  const [error, setError] = useState(null);

  const [selectedShot, setSelectedShot] = useState("Automático");
  const [selectedStyle, setSelectedStyle] = useState("Automático");

  const handleGeneratePrompt = async () => {
    if (!idea.trim()) return;

    setLoading(true);
    setError(null);
    setGeneratedPrompt("");

    try {
      const result = await generatePrompt({
        idea: idea,
        style: selectedStyle,
        camera: selectedShot !== "Automático" ? selectedShot : undefined,
      });

      if (result && result.prompt_text) {
        setGeneratedPrompt(result.prompt_text);
      } else {
        throw new Error("No se recibió el texto del prompt.");
      }
    } catch (err) {
      console.error("Error generando prompt:", err);
      setError(err.message || "Error al generar el prompt.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full flex flex-col gap-6">
      <div className="bg-[#1A1D21] border border-gray-800 rounded-xl p-6 shadow-lg">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="w-5 h-5 text-yellow-500" />
          <h3 className="text-white font-semibold">Tu Idea Inicial</h3>
        </div>

        <textarea
          value={idea}
          onChange={(e) => setIdea(e.target.value)}
          className="w-full bg-gray-900/50 text-white border border-gray-700 rounded-lg p-4 min-h-[100px] focus:ring-2 focus:ring-yellow-500 focus:border-transparent resize-none placeholder-gray-500"
          placeholder="Ej: Un retrato cinematográfico de una mujer bajo la lluvia neón..."
        />
      </div>

      <div className="bg-[#1A1D21] border border-gray-800 rounded-xl p-6 shadow-lg">
        <div className="flex items-center gap-2 mb-4">
          <Camera className="w-5 h-5 text-blue-400" />
          <h3 className="text-white font-semibold">Modo Rápido</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-gray-400 text-xs uppercase font-medium">
              Tipo de Plano
            </label>
            <select
              value={selectedShot}
              onChange={(e) => setSelectedShot(e.target.value)}
              className="w-full bg-gray-900 text-white border border-gray-700 rounded-lg p-3 focus:ring-2 focus:ring-blue-500"
            >
              {SHOT_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-gray-400 text-xs uppercase font-medium">
              Estilo
            </label>
            <select
              value={selectedStyle}
              onChange={(e) => setSelectedStyle(e.target.value)}
              className="w-full bg-gray-900 text-white border border-gray-700 rounded-lg p-3 focus:ring-2 focus:ring-blue-500"
            >
              {PHOTO_STYLES.map((style) => (
                <option key={style} value={style}>
                  {style}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={handleGeneratePrompt}
          disabled={loading || !idea.trim()}
          className={`
            flex items-center gap-2 px-6 py-3 rounded-lg font-bold transition-all
            ${
              loading
                ? "bg-gray-700 cursor-not-allowed"
                : "bg-yellow-500 hover:bg-yellow-400 text-black"
            }
          `}
        >
          {loading ? "Generando..." : "✨ Generar Prompt"}
        </button>
      </div>

      {error && (
        <div className="bg-red-900/20 border border-red-500/50 text-red-200 p-4 rounded-lg text-sm">
          🚨 {error}
        </div>
      )}

      <div className="bg-black border border-gray-800 rounded-xl p-6 min-h-[120px] relative group">
        <div className="flex items-center gap-2 mb-2 text-gray-500">
          <Aperture className="w-4 h-4" />
          <span className="text-xs font-mono uppercase">Prompt Generado</span>
        </div>

        {generatedPrompt ? (
          <>
            <p className="text-gray-300 whitespace-pre-line font-mono text-sm">
              {generatedPrompt}
            </p>
            <button
              onClick={() => navigator.clipboard.writeText(generatedPrompt)}
              className="absolute top-4 right-4 text-xs bg-gray-800 text-white px-2 py-1 rounded hover:bg-gray-700"
            >
              Copiar
            </button>
          </>
        ) : (
          <div className="flex justify-center text-gray-700 italic text-sm mt-4">
            Aquí aparecerá tu prompt experto...
          </div>
        )}
      </div>
    </div>
  );
};

export default PromptGenerator;
