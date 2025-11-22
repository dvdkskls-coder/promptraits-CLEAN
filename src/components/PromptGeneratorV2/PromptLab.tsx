import React, { useState } from "react";
import { PromptGenerator } from "./PromptGenerator";
import { PRESETS } from "../../data/presets";
import { CopyIcon, SparklesIcon } from "./icons";
import { copyToClipboard } from "../../utils/fileUtils";

interface PromptLabProps {
  onPromptGenerated: (prompt: string) => void;
  gender: "masculine" | "feminine" | "couple" | "animal";
  setGender: (gender: "masculine" | "feminine" | "couple" | "animal") => void;
}

export const PromptLab: React.FC<PromptLabProps> = ({
  onPromptGenerated,
  gender,
  setGender,
}) => {
  const [activeTab, setActiveTab] = useState<"generator" | "presets">(
    "generator"
  );
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopyPreset = async (preset: (typeof PRESETS)[0]) => {
    await copyToClipboard(preset.prompt);
    onPromptGenerated(preset.prompt);
    setCopiedId(preset.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="bg-zinc-800/50 backdrop-blur-sm rounded-2xl border border-zinc-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-amber-400 flex items-center gap-2">
          <SparklesIcon className="w-6 h-6" />
          Prompt Lab
        </h2>

        <div className="flex gap-2">
          <button
            onClick={() => setGender("masculine")}
            className={`px-3 py-1 rounded-lg text-sm font-medium transition-all ${
              gender === "masculine"
                ? "bg-blue-500 text-white"
                : "bg-zinc-700 text-zinc-400 hover:bg-zinc-600"
            }`}
          >
            Masculino
          </button>
          <button
            onClick={() => setGender("feminine")}
            className={`px-3 py-1 rounded-lg text-sm font-medium transition-all ${
              gender === "feminine"
                ? "bg-pink-500 text-white"
                : "bg-zinc-700 text-zinc-400 hover:bg-zinc-600"
            }`}
          >
            Femenino
          </button>
          <button
            onClick={() => setGender("couple")}
            className={`px-3 py-1 rounded-lg text-sm font-medium transition-all ${
              gender === "couple"
                ? "bg-purple-500 text-white"
                : "bg-zinc-700 text-zinc-400 hover:bg-zinc-600"
            }`}
          >
            Pareja
          </button>
          <button
            onClick={() => setGender("animal")}
            className={`px-3 py-1 rounded-lg text-sm font-medium transition-all ${
              gender === "animal"
                ? "bg-green-500 text-white"
                : "bg-zinc-700 text-zinc-400 hover:bg-zinc-600"
            }`}
          >
            Animal
          </button>
        </div>
      </div>

      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setActiveTab("generator")}
          className={`flex-1 px-4 py-2 rounded-lg font-medium transition-all ${
            activeTab === "generator"
              ? "bg-amber-500 text-black"
              : "bg-zinc-700 text-zinc-300 hover:bg-zinc-600"
          }`}
        >
          Generador Personalizado
        </button>
        <button
          onClick={() => setActiveTab("presets")}
          className={`flex-1 px-4 py-2 rounded-lg font-medium transition-all ${
            activeTab === "presets"
              ? "bg-amber-500 text-black"
              : "bg-zinc-700 text-zinc-300 hover:bg-zinc-600"
          }`}
        >
          Presets Profesionales
        </button>
      </div>

      {activeTab === "generator" ? (
        <PromptGenerator
          onPromptGenerated={onPromptGenerated}
          gender={gender}
        />
      ) : (
        <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
          {PRESETS.map((preset) => (
            <div
              key={preset.id}
              className="bg-zinc-900/50 rounded-lg p-4 border border-zinc-700 hover:border-amber-500/50 transition-all group"
            >
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className="text-lg font-semibold text-white group-hover:text-amber-400 transition-colors">
                    {preset.name}
                  </h3>
                  <p className="text-sm text-zinc-400">{preset.description}</p>
                  <span className="inline-block mt-1 px-2 py-0.5 bg-zinc-800 rounded text-xs text-zinc-300">
                    {preset.category}
                  </span>
                </div>
                <button
                  onClick={() => handleCopyPreset(preset)}
                  className="p-2 bg-zinc-800 hover:bg-amber-500 rounded-lg transition-all group-hover:scale-110"
                  title="Copiar y usar"
                >
                  {copiedId === preset.id ? (
                    <span className="text-green-400 text-sm">✓</span>
                  ) : (
                    <CopyIcon className="w-4 h-4 text-zinc-400 group-hover:text-black" />
                  )}
                </button>
              </div>
              <p className="text-sm text-zinc-300 bg-zinc-800/50 p-3 rounded-lg mt-2 font-mono leading-relaxed">
                {preset.prompt}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
