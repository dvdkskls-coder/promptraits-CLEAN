// src/components/PromptGenerator.jsx
import React, { useState } from "react";
import { generatePrompt } from "../services/geminiService"; // Importamos el servicio corregido
// ... tus otros imports de UI (Button, Card, Select, etc.) ...

const PromptGenerator = () => {
  const [idea, setIdea] = useState("");
  const [loading, setLoading] = useState(false);
  const [generatedPrompt, setGeneratedPrompt] = useState("");

  // Estados para los selects (asegúrate de que coincidan con tu UI)
  const [selectedStyle, setSelectedStyle] = useState("Automático");
  const [selectedLighting, setSelectedLighting] = useState("Automático");

  const handleGeneratePrompt = async () => {
    if (!idea.trim()) return;

    setLoading(true);
    setGeneratedPrompt(""); // Limpiar anterior

    try {
      // 1. Llamamos al servicio (SOLO TEXTO)
      const result = await generatePrompt({
        idea: idea,
        style: selectedStyle,
        lighting: selectedLighting,
        // OJO: NO PASAMOS LA IMAGEN AQUÍ.
        // La imagen solo se usa en el paso 2 ("Generar Imagen"), no en el paso 1 ("Generar Prompt").
      });

      // 2. Mostramos el resultado
      if (result && result.prompt_text) {
        setGeneratedPrompt(result.prompt_text);
      }
    } catch (error) {
      console.error("Error generando prompt:", error);
      alert("Error: " + error.message); // Feedback simple
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      {/* ... Aquí va tu JSX de la captura ... */}

      {/* Ejemplo de la sección "Tu Idea Inicial" */}
      <div className="bg-gray-900 p-6 rounded-xl mb-6">
        <label className="text-white block mb-2">Tu Idea Inicial</label>
        <textarea
          value={idea}
          onChange={(e) => setIdea(e.target.value)}
          className="w-full bg-gray-800 text-white p-3 rounded-lg"
          placeholder="Quiero una foto cinematográfica en una azotea..."
        />
      </div>

      {/* ... Tus Selects de Modo Rápido ... */}

      {/* EL BOTÓN DORADO */}
      <div className="flex justify-end mt-4">
        <button
          onClick={handleGeneratePrompt}
          disabled={loading}
          className="bg-yellow-500 hover:bg-yellow-400 text-black font-bold py-2 px-6 rounded-lg flex items-center gap-2"
        >
          {loading ? "Generando..." : "✨ Generar Prompt"}
        </button>
      </div>

      {/* Área de resultado */}
      {generatedPrompt && (
        <div className="mt-6 bg-black p-4 rounded-lg border border-gray-700">
          <h3 className="text-yellow-500 mb-2">✨ Prompt Generado</h3>
          <p className="text-gray-300 text-sm whitespace-pre-line">
            {generatedPrompt}
          </p>
        </div>
      )}
    </div>
  );
};

export default PromptGenerator;
