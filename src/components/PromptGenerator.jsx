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
import { useAuth } from "../contexts/AuthContext";
import { supabase } from "../lib/supabase";

// Importación de datos
import { ENVIRONMENTS } from "../data/environmentsData";
import { POSES } from "../data/posesData"; // Contiene todas las poses
import { SHOT_TYPES } from "../data/shotTypesData";
import { Outfits_men } from "../data/Outfits_men";
import { Outfits_women } from "../data/Outfits_women";
import { LIGHTING_SETUPS } from "../data/lightingData";
import { COLOR_GRADING_FILTERS } from "../data/colorGradingData";
import { cameras } from "../data/camerasData";
import { lenses } from "../data/lensesData";
import { filmEmulations } from "../data/filmEmulationsData";

const subjectTypes = [
  { id: "woman", name: "Mujer" },
  { id: "man", name: "Hombre" },
  { id: "couple", name: "Pareja" },
  { id: "animal", name: "Animal" },
];

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

export default function PromptGenerator({
  onPromptGenerated,
  onLoading,
  initialIdea,
  onIdeaChange,
}) {
  const { user, profile, consumeCredits } = useAuth();

  // Estados para selectores estáticos
  const [processedEnvironments, setProcessedEnvironments] = useState([]);
  const [processedShotTypes, setProcessedShotTypes] = useState([]);
  const [processedLighting, setProcessedLighting] = useState([]);
  const [processedColorGrading, setProcessedColorGrading] = useState([]);
  const [processedCameras, setProcessedCameras] = useState([]);
  const [processedLenses, setProcessedLenses] = useState([]);
  const [processedFilmEmulations, setProcessedFilmEmulations] = useState([]);

  // Estados para selectores dinámicos
  const [dynamicPoses, setDynamicPoses] = useState([]);
  const [dynamicOutfits, setDynamicOutfits] = useState([]);

  // Estados para los valores seleccionados
  const [subjectType, setSubjectType] = useState("woman");
  const [environment, setEnvironment] = useState("automatico");
  const [pose, setPose] = useState("automatico");
  const [shotType, setShotType] = useState("automatico");
  const [outfit, setOutfit] = useState("automatico");
  const [lightingStyle, setLightingStyle] = useState("automatico");
  const [color, setColor] = useState("automatico");
  const [camera, setCamera] = useState("automatico");
  const [lens, setLens] = useState("automatico");
  const [film, setFilm] = useState("automatico");

  // Efecto para actualizar la idea desde el PromptLab
  useEffect(() => {
    const selections = [
      environment,
      pose,
      shotType,
      outfit,
      lightingStyle,
      color,
      camera,
      lens,
      film,
    ]
      .filter((v) => v !== "automatico")
      .map((v) => {
        const allItems = [
          ...processedEnvironments,
          ...dynamicPoses,
          ...processedShotTypes,
          ...dynamicOutfits,
          ...processedLighting,
          ...processedColorGrading,
          ...processedCameras,
          ...processedLenses,
          ...processedFilmEmulations,
        ];
        const item = allItems.find((i) => i.id === v);
        return item ? item.name : "";
      })
      .filter(Boolean)
      .join(", ");

    onIdeaChange(
      [initialIdea.split(" #")[0], selections].filter(Boolean).join(" # ")
    );
  }, [
    environment,
    pose,
    shotType,
    outfit,
    lightingStyle,
    color,
    camera,
    lens,
    film,
  ]);

  // Efecto para procesar datos estáticos (solo se ejecuta una vez)
  useEffect(() => {
    const processStaticData = () => {
      setProcessedEnvironments(processAndSetItems(ENVIRONMENTS));
      setProcessedShotTypes(processAndSetItems(SHOT_TYPES));
      setProcessedLighting(processAndSetItems(LIGHTING_SETUPS));
      setProcessedColorGrading(processAndSetItems(COLOR_GRADING_FILTERS));
      setProcessedCameras(processAndSetItems(cameras));
      setProcessedLenses(processAndSetItems(lenses));
      setProcessedFilmEmulations(processAndSetItems(filmEmulations));
    };
    processStaticData();
  }, []);

  // Efecto para actualizar poses y vestuarios cuando cambia el tipo de sujeto
  useEffect(() => {
    let posesData = [];
    let outfitsData = [];

    switch (subjectType) {
      case "woman":
        posesData = POSES.feminine || [];
        outfitsData = Outfits_women || [];
        break;
      case "man":
        posesData = POSES.masculine || [];
        outfitsData = Outfits_men || [];
        break;
      case "couple":
        posesData = POSES.couple || [];
        // No hay outfits específicos para pareja, se usará 'automatico'
        break;
      case "animal":
        // No hay poses ni outfits específicos para animales
        break;
      default:
        break;
    }

    setDynamicPoses(
      (posesData || []).map((p) =>
        typeof p === "string" ? { id: p, name: p } : p
      )
    );
    setDynamicOutfits(
      (outfitsData || []).map((o) =>
        typeof o === "string" ? { id: o, name: o } : o
      )
    );

    // Resetear selección si ya no es válida
    setPose("automatico");
    setOutfit("automatico");
  }, [subjectType]);

  const handleGenerate = async () => {
    onLoading(true);
    try {
      // 1. Verificar créditos antes de generar
      if (user) {
        // consumeCredits ya maneja el caso 'premium' y lanza error si no hay créditos.
        await consumeCredits(1);
      }

      const settings = {
        idea: initialIdea,
        subjectType,
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

      // 2. Guardar en el historial (la deducción de crédito ya se hizo)
      if (user && response.text) {
        const { error: historyError } = await supabase
          .from("prompt_history")
          .insert({
            user_id: user.id,
            prompt_text: response.text,
            options: settings,
          });

        if (historyError) {
          console.error("Error saving to history:", historyError);
        }
      }
    } catch (error) {
      console.error("Error in generation process:", error);
      // Mostrar error al usuario (ej. créditos insuficientes)
      alert(`Error: ${error.message}`);
    } finally {
      onLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Section title="Tu Idea Inicial">
        <Textarea
          placeholder="Describe la escena, el sujeto o la emoción que quieres capturar. Por ejemplo: 'Un retrato melancólico en un día lluvioso en la ciudad.'"
          value={initialIdea}
          onChange={(e) => onIdeaChange(e.target.value)}
          className="min-h-[100px] bg-gray-800 border border-gray-700 text-white"
        />
      </Section>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <GeneratorSelector
          label="Tipo de Sujeto"
          value={subjectType}
          onChange={setSubjectType}
          items={subjectTypes}
        />
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
          items={dynamicPoses} // Usa la lista dinámica
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
          items={dynamicOutfits} // Usa la lista dinámica
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
  initialIdea: PropTypes.string,
  onIdeaChange: PropTypes.func.isRequired,
};

PromptGenerator.defaultProps = {
  initialIdea: "",
};
