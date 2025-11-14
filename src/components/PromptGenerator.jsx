import React, { useState, useEffect } from "react";
import PropTypes from "prop-types"; // Importar PropTypes
import { Sparkles, Wand2 } from "lucide-react";

// Importar todos los datos necesarios
import { ENVIRONMENTS as environments } from "../data/environmentsData";
import { poses } from "../data/posesData";
import { shotTypes } from "../data/shotTypesData";
import { outfitStyles } from "../data/outfitStylesData";
import { outfitsMen } from "../data/Outfits_men";
import { outfitsWomen } from "../data/Outfits_women";
import { lighting } from "../data/lightingData";
import { colorGrading } from "../data/colorGradingData";

// Componente reutilizable para un selector
const ProSelect = ({ label, value, onChange, options, pro, disabled }) => (
  <div>
    <label className="text-sm font-medium text-gray-300 mb-2 flex items-center">
      {label} {pro && <Sparkles className="w-3 h-3 text-yellow-400 ml-1" />}
    </label>
    <select
      value={value}
      onChange={onChange}
      disabled={disabled}
      className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-white focus:ring-yellow-500 focus:border-yellow-500 disabled:opacity-50"
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  </div>
);

// Añadir validación de PropTypes para ProSelect
ProSelect.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
    })
  ).isRequired,
  pro: PropTypes.bool,
  disabled: PropTypes.bool,
};

export const PromptGenerator = ({ onPromptReady, isPro, gender }) => {
  // Estados para cada parte del prompt
  const [environment, setEnvironment] = useState(environments[0].value);
  const [pose, setPose] = useState(poses[0].value);
  const [shotType, setShotType] = useState(shotTypes[0].value);
  const [outfitStyle, setOutfitStyle] = useState(outfitStyles[0].value);
  const [outfit, setOutfit] = useState("");
  const [lightingStyle, setLightingStyle] = useState(lighting[0].value);
  const [colorGrade, setColorGrade] = useState(colorGrading[0].value);
  const [camera, setCamera] = useState("Sony A7R IV");
  const [lens, setLens] = useState("Zeiss Planar T* 50mm f/1.4");
  const [filmStock, setFilmStock] = useState("Kodak Portra 400");
  const [customDetails, setCustomDetails] = useState("");

  // Determinar qué lista de outfits usar
  const outfitOptions = gender === "masculine" ? outfitsMen : outfitsWomen;

  // Sincronizar el outfit inicial cuando cambia el género o el estilo
  useEffect(() => {
    const filteredOutfits = outfitOptions.filter(
      (o) => o.style === outfitStyle
    );
    if (filteredOutfits.length > 0) {
      setOutfit(filteredOutfits[0].value);
    } else {
      setOutfit(""); // Si no hay outfits para ese estilo, se resetea
    }
  }, [gender, outfitStyle, outfitOptions]);

  const handleGeneratePrompt = () => {
    const promptParts = [
      `**Subject:** A realistic photo of a person with the face of [TARGET_FACE].`,
      `**Gender:** ${gender === "masculine" ? "Male" : "Female"}.`,
      `**Environment:** ${environment}.`,
      `**Pose:** ${pose}.`,
      `**Outfit:** ${outfit}.`,
      `**Shot Type:** ${shotType}.`,
      `**Lighting:** ${lightingStyle}.`,
      `**Color Grading:** Cinematic, ${colorGrade}.`,
      `**Camera & Lens:** Shot on ${camera}, ${lens}, f/1.8, 1/200s, ISO 100.`,
      `**Film Stock:** Emulating ${filmStock} film stock.`,
      `**Details:** Ultra-detailed, 8K, photorealistic, sharp focus, high quality.`,
      customDetails && `**Custom Details:** ${customDetails}.`,
    ];

    const finalPrompt = promptParts.filter(Boolean).join("\n");
    onPromptReady(finalPrompt);
  };

  const filteredOutfits = outfitOptions.filter((o) => o.style === outfitStyle);

  return (
    <div className="space-y-6 p-4 bg-black/20 rounded-lg">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Columna 1 */}
        <div className="space-y-4">
          <ProSelect
            label="Entorno"
            value={environment}
            onChange={(e) => setEnvironment(e.target.value)}
            options={environments}
            pro
            disabled={!isPro}
          />
          <ProSelect
            label="Pose"
            value={pose}
            onChange={(e) => setPose(e.target.value)}
            options={poses}
            pro
            disabled={!isPro}
          />
          <ProSelect
            label="Tipo de Plano"
            value={shotType}
            onChange={(e) => setShotType(e.target.value)}
            options={shotTypes}
            pro
            disabled={!isPro}
          />
          <ProSelect
            label="Estilo de Vestimenta"
            value={outfitStyle}
            onChange={(e) => setOutfitStyle(e.target.value)}
            options={outfitStyles}
            pro
            disabled={!isPro}
          />
          {filteredOutfits.length > 0 && (
            <ProSelect
              label="Vestimenta Específica"
              value={outfit}
              onChange={(e) => setOutfit(e.target.value)}
              options={filteredOutfits}
              pro
              disabled={!isPro}
            />
          )}
        </div>

        {/* Columna 2 */}
        <div className="space-y-4">
          <ProSelect
            label="Iluminación"
            value={lightingStyle}
            onChange={(e) => setLightingStyle(e.target.value)}
            options={lighting}
            pro
            disabled={!isPro}
          />
          <ProSelect
            label="Grado de Color"
            value={colorGrade}
            onChange={(e) => setColorGrade(e.target.value)}
            options={colorGrading}
            pro
            disabled={!isPro}
          />

          <div>
            <label className="text-sm font-medium text-gray-300 mb-2 flex items-center">
              Cámara{" "}
              {isPro && <Sparkles className="w-3 h-3 text-yellow-400 ml-1" />}
            </label>
            <input
              type="text"
              value={camera}
              onChange={(e) => setCamera(e.target.value)}
              disabled={!isPro}
              className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-white focus:ring-yellow-500 focus:border-yellow-500 disabled:opacity-50"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-300 mb-2 flex items-center">
              Lente{" "}
              {isPro && <Sparkles className="w-3 h-3 text-yellow-400 ml-1" />}
            </label>
            <input
              type="text"
              value={lens}
              onChange={(e) => setLens(e.target.value)}
              disabled={!isPro}
              className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-white focus:ring-yellow-500 focus:border-yellow-500 disabled:opacity-50"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-300 mb-2 flex items-center">
              Emulación de Película{" "}
              {isPro && <Sparkles className="w-3 h-3 text-yellow-400 ml-1" />}
            </label>
            <input
              type="text"
              value={filmStock}
              onChange={(e) => setFilmStock(e.target.value)}
              disabled={!isPro}
              className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-white focus:ring-yellow-500 focus:border-yellow-500 disabled:opacity-50"
            />
          </div>
        </div>
      </div>

      {/* Detalles Adicionales */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Detalles Adicionales
        </label>
        <textarea
          value={customDetails}
          onChange={(e) => setCustomDetails(e.target.value)}
          placeholder="Ej: con un ligero viento en el pelo, mirando hacia la cámara..."
          className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-white focus:ring-yellow-500 focus:border-yellow-500 h-24"
        />
      </div>

      {/* Botón de Generar */}
      <button
        onClick={handleGeneratePrompt}
        className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-yellow-500 to-yellow-600 text-black font-bold rounded-lg hover:from-yellow-600 hover:to-yellow-700 transition-all"
      >
        <Wand2 className="w-5 h-5" />
        Generar Prompt Detallado
      </button>
    </div>
  );
};

// Añadir validación de PropTypes para PromptGenerator
PromptGenerator.propTypes = {
  onPromptReady: PropTypes.func.isRequired,
  isPro: PropTypes.bool.isRequired,
  gender: PropTypes.string.isRequired,
};
