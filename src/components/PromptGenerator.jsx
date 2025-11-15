import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Wand2 } from "lucide-react";
import { processAndSetItems } from "../utils/dataProcessor";
import { generateProfessionalPrompt } from "../services/geminiService";

// Importación de datos
import { ENVIRONMENTS as environments } from "../data/environmentsData";
import { POSES as poses } from "../data/posesData";
import { SHOT_TYPES as shotTypes } from "../data/shotTypesData";
import { OUTFIT_STYLES as outfitStyles } from "../data/outfitStylesData";
import { LIGHTING_SETUPS as lighting } from "../data/lightingData";
import { COLOR_GRADING_FILTERS as colorGrading } from "../data/colorGradingData";
import { cameras } from "../data/camerasData";
import { lenses } from "../data/lensesData";
import { filmEmulations } from "../data/filmEmulationsData";

const Section = ({ title, children }) => (
  <Card className="bg-gray-800 border border-gray-700 rounded-lg">
    <CardHeader>
      <CardTitle className="text-lg font-semibold text-white">
        {title}
      </CardTitle>
    </CardHeader>
    <CardContent>{children}</CardContent>
  </Card>
);

Section.propTypes = {
  title: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};

const GeneratorSelector = ({ label, value, onChange, items }) => (
  <div className="space-y-2">
    <label className="text-sm font-medium text-gray-300">{label}</label>
    <Select onValueChange={onChange} value={value}>
      <SelectTrigger className="bg-gray-800 border border-gray-700 text-white">
        <SelectValue placeholder={`Seleccionar ${label}`} />
      </SelectTrigger>
      <SelectContent className="bg-gray-900 border border-gray-700">
        <SelectItem value="automatico" className="text-gray-300">
          Automático
        </SelectItem>
        {items.map((item) => (
          <SelectItem key={item.id} value={item.id} className="text-gray-300">
            {item.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  </div>
);

GeneratorSelector.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  items: PropTypes.array.isRequired,
};

export default function PromptGenerator({ onPromptGenerated, onLoading }) {
  const [processedEnvironments, setProcessedEnvironments] = useState([]);
  const [processedPoses, setProcessedPoses] = useState([]);
  const [processedShotTypes, setProcessedShotTypes] = useState([]);
  const [processedOutfitStyles, setProcessedOutfitStyles] = useState([]);
  const [processedLighting, setProcessedLighting] = useState([]);
  const [processedColorGrading, setProcessedColorGrading] = useState([]);
  const [processedCameras, setProcessedCameras] = useState([]);
  const [processedLenses, setProcessedLenses] = useState([]);
  const [processedFilmEmulations, setProcessedFilmEmulations] = useState([]);

  const [idea, setIdea] = useState("");
  const [environment, setEnvironment] = useState("automatico");
  const [pose, setPose] = useState("automatico");
  const [shotType, setShotType] = useState("automatico");
  const [outfit, setOutfit] = useState("automatico");
  const [lightingStyle, setLightingStyle] = useState("automatico");
  const [color, setColor] = useState("automatico");
  const [camera, setCamera] = useState("automatico");
  const [lens, setLens] = useState("automatico");
  const [film, setFilm] = useState("automatico");

  useEffect(() => {
    const processData = () => {
      setProcessedEnvironments(processAndSetItems(environments));
      setProcessedPoses(processAndSetItems(poses));
      setProcessedShotTypes(processAndSetItems(shotTypes));
      setProcessedOutfitStyles(processAndSetItems(outfitStyles));
      setProcessedLighting(processAndSetItems(lighting));
      setProcessedColorGrading(processAndSetItems(colorGrading));
      setProcessedCameras(processAndSetItems(cameras));
      setProcessedLenses(processAndSetItems(lenses));
      setProcessedFilmEmulations(processAndSetItems(filmEmulations));
    };
    processData();
  }, []);

  const handleGenerate = async () => {
    onLoading(true);
    try {
      const settings = {
        idea,
        environment,
        pose,
        shotType,
        outfit,
        lightingStyle,
        color,
        camera,
        lens,
        film,
      };

      const response = await generateProfessionalPrompt(settings);
      onPromptGenerated(response.text);
    } catch (error) {
      console.error("Error generating prompt:", error);
      // Manejar el error en la UI si es necesario
    } finally {
      onLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Section title="Tu Idea Inicial">
        <Textarea
          placeholder="Describe la escena, el sujeto o la emoción que quieres capturar. Por ejemplo: 'Un retrato melancólico en un día lluvioso en la ciudad.'"
          value={idea}
          onChange={(e) => setIdea(e.target.value)}
          className="min-h-[100px] bg-gray-800 border border-gray-700 text-white"
        />
      </Section>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <GeneratorSelector
          label="Entorno"
          value={environment}
          onChange={setEnvironment}
          items={processedEnvironments}
        />
        <GeneratorSelector
          label="Pose/Acción"
          value={pose}
          onChange={setPose}
          items={processedPoses}
        />
        <GeneratorSelector
          label="Tipo de Plano"
          value={shotType}
          onChange={setShotType}
          items={processedShotTypes}
        />
        <GeneratorSelector
          label="Estilo de Vestuario"
          value={outfit}
          onChange={setOutfit}
          items={processedOutfitStyles}
        />
        <GeneratorSelector
          label="Estilo de Iluminación"
          value={lightingStyle}
          onChange={setLightingStyle}
          items={processedLighting}
        />
        <GeneratorSelector
          label="Grado de Color"
          value={color}
          onChange={setColor}
          items={processedColorGrading}
        />
        <GeneratorSelector
          label="Cámara"
          value={camera}
          onChange={setCamera}
          items={processedCameras}
        />
        <GeneratorSelector
          label="Lente"
          value={lens}
          onChange={setLens}
          items={processedLenses}
        />
        <GeneratorSelector
          label="Emulación de Película"
          value={film}
          onChange={setFilm}
          items={processedFilmEmulations}
        />
      </div>

      <div className="flex justify-end">
        <Button onClick={handleGenerate} className="gap-2">
          <Wand2 size={18} />
          Generar Prompt
        </Button>
      </div>
    </div>
  );
}

PromptGenerator.propTypes = {
  onPromptGenerated: PropTypes.func.isRequired,
  onLoading: PropTypes.func.isRequired,
};
