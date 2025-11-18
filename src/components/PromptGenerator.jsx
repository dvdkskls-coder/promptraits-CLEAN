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
import { Wand2, Loader2, ChevronDown } from "lucide-react";
import { processAndSetItems } from "../utils/dataProcessor";
import { generateProfessionalPrompt } from "../services/geminiService";
import { useAuth } from "../contexts/AuthContext";
import { supabase } from "../lib/supabase";

// Importación de datos
import { ENVIRONMENTS_ARRAY as ENVIRONMENTS } from "../data/environmentsData"; // Importamos el Array aplanado
import { POSES } from "../data/posesData";
import { SHOT_TYPES } from "../data/shotTypesData";
import { Outfits_men } from "../data/Outfits_men";
import { Outfits_women } from "../data/Outfits_women";
import { LIGHTING_SETUPS } from "../data/lightingData";
import { COLOR_GRADING_FILTERS } from "../data/colorGradingData";
import { cameras } from "../data/camerasData";
import { lenses } from "../data/lensesData";
import { filmEmulations } from "../data/filmEmulationsData";
import { PHOTO_STYLES } from "../data/photoStylesData";

// ----- INICIO DE LA CORRECCIÓN "a prueba de balas" -----
// Esta función auxiliar se asegura de que los datos de los selectores
// sean siempre un array, incluso si los archivos de datos están mal.
const safeProcessItems = (data) => {
  if (Array.isArray(data)) {
    return processAndSetItems(data);
  }
  if (typeof data === "object" && data !== null) {
    return processAndSetItems(Object.values(data));
  }
  return []; // Devuelve array vacío si el dato es incorrecto
};
// ----- FIN DE LA CORRECCIÓN -----

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
  const { user, consumeCredits } = useAuth();

  const [proToolsOpen, setProToolsOpen] = useState(false);

  const [processedEnvironments, setProcessedEnvironments] = useState([]);
  const [processedShotTypes, setProcessedShotTypes] = useState([]);
  const [processedPhotoStyles, setProcessedPhotoStyles] = useState([]);
  const [processedLighting, setProcessedLighting] = useState([]);
  const [processedColorGrading, setProcessedColorGrading] = useState([]);
  const [processedCameras, setProcessedCameras] = useState([]);
  const [processedLenses, setProcessedLenses] = useState([]);
  const [processedFilmEmulations, setProcessedFilmEmulations] = useState([]);

  const [dynamicPoses, setDynamicPoses] = useState([]);
  const [dynamicOutfits, setDynamicOutfits] = useState([]);

  const [subjectType, setSubjectType] = useState("woman");
  const [environment, setEnvironment] = useState("automatico");
  const [pose, setPose] = useState("automatico");
  const [shotType, setShotType] = useState("automatico");
  const [photoStyle, setPhotoStyle] = useState("automatico");
  const [outfit, setOutfit] = useState("automatico");
  const [lightingStyle, setLightingStyle] = useState("automatico");
  const [color, setColor] = useState("automatico");
  const [camera, setCamera] = useState("automatico");
  const [lens, setLens] = useState("automatico");
  const [film, setFilm] = useState("automatico");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const processStaticData = () => {
      // Usamos la nueva función "safeProcessItems" para evitar errores
      setProcessedEnvironments(safeProcessItems(ENVIRONMENTS));
      setProcessedShotTypes(safeProcessItems(SHOT_TYPES));
      setProcessedPhotoStyles(safeProcessItems(PHOTO_STYLES));
      setProcessedLighting(safeProcessItems(LIGHTING_SETUPS));
      setProcessedColorGrading(safeProcessItems(COLOR_GRADING_FILTERS));
      setProcessedCameras(safeProcessItems(cameras));
      setProcessedLenses(safeProcessItems(lenses));
      setProcessedFilmEmulations(safeProcessItems(filmEmulations));
    };
    processStaticData();
  }, []);

  useEffect(() => {
    let posesData = [];
    let outfitsData = [];

    // Usamos Object.values() para asegurarnos de que mapeamos un array
    switch (subjectType) {
      case "woman":
        posesData = POSES.feminine || [];
        outfitsData = Object.values(Outfits_women || {});
        break;
      case "man":
        posesData = POSES.masculine || [];
        outfitsData = Object.values(Outfits_men || {});
        break;
      case "couple":
        posesData = POSES.couple || [];
        break;
      case "animal":
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

    setPose("automatico");
    setOutfit("automatico");
  }, [subjectType]);

  // -------- INICIO DE LA CORRECCIÓN "handleGenerate" --------
  // Esta función ha sido actualizada para manejar la respuesta JSON
  const handleGenerate = async () => {
    setIsLoading(true);
    onLoading(true);
    try {
      if (user) {
        await consumeCredits(1);
      }

      const settings = {
        idea: initialIdea,
        subjectType,
        environment,
        pose,
        shotType,
        photoStyle,
        outfit,
        lightingStyle,
        color,
        camera,
        lens,
        film,
      };

      // 1. La API ahora devuelve el JSON completo
      const responseJson = await generateProfessionalPrompt(settings);

      // 2. Extraemos el texto "narrative" para mostrarlo en la caja
      //    y pasamos el JSON completo al componente padre (si es necesario)
      const promptTextToShow =
        responseJson.narrative || "Error: No narrative found";

      // 'onPromptGenerated' debe estar preparado para recibir el JSON completo
      // o solo el texto. Asumiremos que el padre ahora recibe el JSON.
      // Para la caja de texto "Prompt Generado", el padre debe usar 'responseJson.narrative'.
      onPromptGenerated(responseJson);

      // 3. Guardamos en Supabase usando las claves correctas del JSON
      if (user && responseJson.narrative) {
        const { error: historyError } = await supabase
          .from("prompt_history")
          .insert({
            user_id: user.id,
            prompt_text: responseJson.narrative, // Guardamos la narrativa como texto principal
            options: settings, // Guardamos las selecciones
            full_prompt_json: responseJson, // Guardamos el JSON completo
          });

        if (historyError) {
          console.error("Error saving to history:", historyError);
        }
      }
    } catch (error) {
      console.error("Error in generation process:", error);
      alert(`Error: ${error.message}`);
    } finally {
      setIsLoading(false);
      onLoading(false);
    }
  };
  // -------- FIN DE LA CORRECCIÓN "handleGenerate" --------

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

      <Section title="Modo Rápido">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <GeneratorSelector
            label="Tipo de Plano"
            value={shotType}
            onChange={setShotType}
            items={processedShotTypes}
          />
          <GeneratorSelector
            label="Estilo de Fotografía"
            value={photoStyle}
            onChange={setPhotoStyle}
            items={processedPhotoStyles}
          />
        </div>
      </Section>

      {/* ¡OJO! Esto sigue aquí. Si no ves las herramientas,
        es 100% seguro que tu 'role' en Supabase no es 'pro' o 'premium'.
      */}
      {user && ["pro", "premium"].includes(user.role) && (
        <div>
          <Button
            onClick={() => setProToolsOpen(!proToolsOpen)}
            variant="link"
            className="text-indigo-400 hover:text-indigo-300 text-lg font-semibold mb-4 px-0"
          >
            {proToolsOpen
              ? "Ocultar Herramientas PRO"
              : "Mostrar Herramientas PRO"}
            <ChevronDown
              className={`ml-2 h-5 w-5 transition-transform ${
                proToolsOpen ? "rotate-180" : ""
              }`}
            />
          </Button>

          {proToolsOpen && (
            <Section title="Herramientas PRO">
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
                  items={dynamicPoses}
                />
                <GeneratorSelector
                  label="Estilo de Vestuario"
                  value={outfit}
                  onChange={setOutfit}
                  items={dynamicOutfits}
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
            </Section>
          )}
        </div>
      )}

      <div className="flex justify-end">
        <Button
          onClick={handleGenerate}
          disabled={isLoading}
          className="w-full md:w-auto gap-2 bg-[#D8C780] text-black font-bold py-3 px-6 rounded-lg flex items-center justify-center transition-all disabled:bg-gray-600 disabled:cursor-not-allowed hover:bg-yellow-300"
        >
          {isLoading ? (
            <>
              <Loader2 className="animate-spin mr-2" size={18} />
              Generando...
            </>
          ) : (
            <>
              <Wand2 size={18} />
              Generar Prompt
            </>
          )}
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
