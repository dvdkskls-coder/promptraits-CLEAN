// src/components/PromptGeneratorV2/PromptGenerator.tsx

import React, { useState } from "react";
import { SparklesIcon } from "./icons";
import { generateProfessionalPrompt } from "../../services/geminiServiceV2";
import type { GenerationOptions } from "../../types/promptTypes";
import { SHOT_TYPES, CAMERA_ANGLES } from "../../constants/promptConstants";
import { ENVIRONMENTS } from "../../data/environments";
import { LIGHTING_SETUPS } from "../../data/lighting";
import { COLOR_GRADING_FILTERS } from "../../data/colorGrading";
import { OUTFITS, getOutfitsByGender } from "../../data/outfits";
import { POSES, getPosesByGender } from "../../data/poses";

interface PromptGeneratorProps {
  onPromptGenerated: (prompt: string) => void;
  gender: "masculine" | "feminine" | "couple" | "animal";
}

export const PromptGenerator: React.FC<PromptGeneratorProps> = ({
  onPromptGenerated,
  gender,
}) => {
  const [idea, setIdea] = useState("");
  const [shotType, setShotType] = useState("");
  const [cameraAngle, setCameraAngle] = useState("");
  const [environment, setEnvironment] = useState("");
  const [lighting, setLighting] = useState("");
  const [colorGrading, setColorGrading] = useState("");
  const [outfit, setOutfit] = useState("");
  const [pose, setPose] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState("");

  // Filter outfits and poses by gender
  const filteredOutfits = getOutfitsByGender(
    gender === "animal" ? "unisex" : gender
  );
  const filteredPoses = getPosesByGender(
    gender === "animal" ? "unisex" : gender
  );

  const handleGenerate = async () => {
    if (!idea.trim()) {
      setError("Por favor, describe tu idea");
      return;
    }

    setIsGenerating(true);
    setError("");

    try {
      const options: GenerationOptions = {
        idea,
        shotType: shotType || undefined,
        cameraAngle: cameraAngle || undefined,
        environment: environment || undefined,
        lighting: lighting || undefined,
        colorGrading: colorGrading || undefined,
        outfit: outfit || undefined,
        pose: pose || undefined,
        gender,
      };

      const prompt = await generateProfessionalPrompt(options);
      onPromptGenerated(prompt);
    } catch (err: any) {
      setError(err.message || "Error al generar el prompt");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-zinc-300 mb-2">
          Describe tu Idea *
        </label>
        <textarea
          value={idea}
          onChange={(e) => setIdea(e.target.value)}
          placeholder="Ej: Un retrato elegante de una persona en un café parisino..."
          className="w-full px-4 py-3 bg-zinc-900 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent resize-none"
          rows={4}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-2">
            Tipo de Plano
          </label>
          <select
            value={shotType}
            onChange={(e) => setShotType(e.target.value)}
            className="w-full px-4 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
          >
            <option value="">Automático</option>
            {SHOT_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-2">
            Ángulo de Cámara
          </label>
          <select
            value={cameraAngle}
            onChange={(e) => setCameraAngle(e.target.value)}
            className="w-full px-4 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
          >
            <option value="">Automático</option>
            {CAMERA_ANGLES.map((angle) => (
              <option key={angle} value={angle}>
                {angle}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-2">
            Entorno
          </label>
          <select
            value={environment}
            onChange={(e) => setEnvironment(e.target.value)}
            className="w-full px-4 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
          >
            <option value="">Automático</option>
            {ENVIRONMENTS.map((env) => (
              <option key={env.id} value={env.name}>
                {env.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-2">
            Iluminación
          </label>
          <select
            value={lighting}
            onChange={(e) => setLighting(e.target.value)}
            className="w-full px-4 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
          >
            <option value="">Automático</option>
            {LIGHTING_SETUPS.map((light) => (
              <option key={light.id} value={light.name}>
                {light.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-2">
            Color Grading
          </label>
          <select
            value={colorGrading}
            onChange={(e) => setColorGrading(e.target.value)}
            className="w-full px-4 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
          >
            <option value="">Automático</option>
            {COLOR_GRADING_FILTERS.map((filter) => (
              <option key={filter.id} value={filter.name}>
                {filter.name}
              </option>
            ))}
          </select>
        </div>

        {gender !== "animal" && (
          <>
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">
                Vestimenta
              </label>
              <select
                value={outfit}
                onChange={(e) => setOutfit(e.target.value)}
                className="w-full px-4 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
              >
                <option value="">Automático</option>
                {filteredOutfits.map((out) => (
                  <option key={out.id} value={out.name}>
                    {out.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">
                Pose
              </label>
              <select
                value={pose}
                onChange={(e) => setPose(e.target.value)}
                className="w-full px-4 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
              >
                <option value="">Automático</option>
                {filteredPoses.map((p) => (
                  <option key={p.id} value={p.name}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>
          </>
        )}
      </div>

      {error && (
        <div className="p-3 bg-red-500/10 border border-red-500/50 rounded-lg text-red-400 text-sm">
          {error}
        </div>
      )}

      <button
        onClick={handleGenerate}
        disabled={isGenerating || !idea.trim()}
        className="w-full px-6 py-3 bg-gradient-to-r from-amber-500 to-yellow-600 text-black font-semibold rounded-lg hover:from-amber-600 hover:to-yellow-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
      >
        <SparklesIcon className="w-5 h-5" />
        {isGenerating ? "Generando..." : "Generar Prompt Profesional"}
      </button>
    </div>
  );
};
