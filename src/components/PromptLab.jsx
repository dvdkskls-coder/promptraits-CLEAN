import React, { useState } from "react";
import PropTypes from "prop-types";
import { Wand2, ScanSearch, Star } from "lucide-react";
import { PromptGenerator } from "./PromptGenerator";
import { ImageAnalyzer } from "./ImageAnalyzer"; // Importar el nuevo componente

// Placeholder para los otros componentes de pestañas
const PresetPrompts = () => (
  <div className="p-4 text-center text-gray-400 bg-black/20 rounded-lg">
    <p>
      Próximamente: Elige entre una selección de presets de prompts
      profesionales.
    </p>
  </div>
);

// Componente principal del laboratorio de Prompts
export const PromptLab = ({ onPromptGenerated, gender, setGender, isPro }) => {
  const [activeTab, setActiveTab] = useState("manual");

  const tabs = [
    { id: "manual", label: "Manual", icon: Wand2 },
    { id: "analyzer", label: "Analizador", icon: ScanSearch },
    { id: "presets", label: "Presets", icon: Star },
  ];

  const handlePromptReady = (prompt) => {
    // Aquí es donde el PromptLab recibe el prompt de uno de sus hijos
    // y lo pasa hacia arriba al AdvancedGenerator.
    onPromptGenerated(prompt);
  };

  const renderContent = () => {
    switch (activeTab) {
      case "manual":
        return (
          <PromptGenerator
            onPromptReady={handlePromptReady}
            isPro={isPro}
            gender={gender}
          />
        );
      case "analyzer":
        return (
          <ImageAnalyzer onPromptReady={handlePromptReady} isPro={isPro} />
        ); // Usar el componente real
      case "presets":
        return <PresetPrompts />;
      default:
        return null;
    }
  };

  return (
    <div className="bg-[#0A0A0A] rounded-xl p-6 border border-[#2D2D2D]">
      {/* Selector de Género/Tipo */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Tipo de Sujeto
        </label>
        <div className="flex gap-2">
          {[
            { value: "masculine", label: "Hombre" },
            { value: "feminine", label: "Mujer" },
          ].map((item) => (
            <button
              key={item.value}
              onClick={() => setGender(item.value)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold border ${
                gender === item.value
                  ? "bg-[#D8C780] text-black border-[#D8C780]"
                  : "bg-gray-800 text-gray-300 border-gray-700 hover:bg-gray-700"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Pestañas de Navegación */}
      <div className="flex border-b border-[#2D2D2D] mb-4">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? "border-b-2 border-[#D8C780] text-[#D8C780]"
                : "text-gray-400 hover:text-white"
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Contenido de la Pestaña */}
      <div>{renderContent()}</div>
    </div>
  );
};

PromptLab.propTypes = {
  onPromptGenerated: PropTypes.func.isRequired,
  gender: PropTypes.string.isRequired,
  setGender: PropTypes.func.isRequired,
  isPro: PropTypes.bool.isRequired,
};
