import React, { useState } from "react";
import PropTypes from "prop-types";
import {
  Wand2,
  FileSearch,
  Star,
  Image as ImageIcon,
  Sparkles,
  Upload,
  Download,
  Share2,
} from "lucide-react";
import PromptGenerator from "./PromptGenerator";
import { ImageAnalyzer } from "./ImageAnalyzer";
import { useAuth } from "../contexts/AuthContext";

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
export const PromptLab = ({ isPro }) => {
  const { user, consumeCredits, savePromptToHistory } = useAuth();
  const [activeTab, setActiveTab] = useState("manual");
  const [generatedPrompt, setGeneratedPrompt] = useState("");
  const [selfieImage, setSelfieImage] = useState(null);
  const [selfiePreview, setSelfiePreview] = useState("");
  const [aspectRatio, setAspectRatio] = useState("3:4");
  const [generatedImage, setGeneratedImage] = useState(null);
  const [isLoadingImage, setIsLoadingImage] = useState(false);
  const [error, setError] = useState("");
  const [initialIdea, setInitialIdea] = useState("");
  const [isLoadingPrompt, setIsLoadingPrompt] = useState(false);

  const tabs = [
    { id: "manual", label: "Manual", icon: Wand2 },
    { id: "analyzer", label: "Analizador", icon: FileSearch },
    { id: "presets", label: "Presets", icon: Star },
  ];

  const handlePromptGenerated = (prompt) => {
    setGeneratedPrompt(prompt);
    setGeneratedImage(null); // Limpiar imagen anterior al generar nuevo prompt
  };

  const handleSelfieChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelfieImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelfiePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerateImage = async () => {
    if (!generatedPrompt || !selfieImage || !user) {
      setError(
        "Se requiere un prompt, una imagen de referencia y estar autenticado."
      );
      return;
    }

    setIsLoadingImage(true);
    setError("");
    setGeneratedImage(null);

    try {
      // Consumir créditos para la imagen (ej: 1 crédito)
      await consumeCredits(1);

      const formData = new FormData();
      formData.append("prompt", generatedPrompt);
      formData.append("selfieImage", selfieImage);
      formData.append("aspectRatio", aspectRatio);
      formData.append("userId", user.id);

      const response = await fetch("/api/generate-image", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error al generar la imagen");
      }

      const data = await response.json();

      if (data.success && data.images?.[0]) {
        const image = data.images[0];
        const imageUrl = `data:${image.mimeType};base64,${image.base64}`;
        setGeneratedImage(imageUrl);
        await savePromptToHistory(generatedPrompt, { aspectRatio }, imageUrl);
      } else {
        throw new Error(
          "La respuesta de la API no contiene una imagen válida."
        );
      }
    } catch (err) {
      setError(err.message);
      console.error(err);
    } finally {
      setIsLoadingImage(false);
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case "manual":
        return (
          <PromptGenerator
            onPromptGenerated={handlePromptGenerated}
            onLoading={setIsLoadingPrompt}
            isPro={isPro}
            initialIdea={initialIdea}
            onIdeaChange={setInitialIdea}
          />
        );
      case "analyzer":
        return (
          <ImageAnalyzer onPromptReady={handlePromptGenerated} isPro={isPro} />
        ); // Usar el componente real
      case "presets":
        return <PresetPrompts />;
      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto max-w-7xl">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Columna Izquierda: Generador y Controles */}
        <div className="bg-[#0A0A0A] rounded-xl p-6 border border-[#2D2D2D] space-y-6">
          {/* Pestañas de Navegación */}
          <div>
            <h3 className="text-lg font-semibold mb-3 flex items-center">
              <span className="text-3xl mr-3">1</span>
              Método de Creación
            </h3>
            <div className="flex border-b border-[#2D2D2D]">
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
            <div className="pt-4 min-h-[200px]">{renderContent()}</div>
          </div>

          {/* Prompt Generado */}
          <div>
            <h3 className="text-lg font-semibold mb-3 flex items-center">
              <Sparkles className="w-5 h-5 mr-2 text-[#D8C780]" />
              Prompt Generado
            </h3>
            <div className="bg-black/50 rounded-lg p-4 min-h-[120px] text-gray-300 text-sm whitespace-pre-wrap font-mono">
              {generatedPrompt || "Aquí aparecerá tu prompt experto..."}
            </div>
          </div>
        </div>

        {/* Columna Derecha: Resultados y Generación de Imagen */}
        <div className="space-y-6">
          {/* Controles de Imagen */}
          <div className="bg-[#0A0A0A] rounded-xl p-6 border border-[#2D2D2D]">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <span className="text-3xl mr-3">2</span>
              Imagen de Referencia
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Cargar Selfie */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Sube tu imagen
                </label>
                <div className="relative flex items-center justify-center w-full">
                  <label
                    htmlFor="selfie-upload"
                    className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-gray-600 rounded-lg cursor-pointer bg-black/50 hover:bg-black/70 transition-colors"
                  >
                    {selfiePreview ? (
                      <img
                        src={selfiePreview}
                        alt="Preview"
                        className="w-full h-full object-cover rounded-lg"
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <Upload className="w-8 h-8 mb-2 text-gray-400" />
                        <p className="mb-1 text-sm text-gray-400">
                          Click para subir
                        </p>
                        <p className="text-xs text-gray-500">
                          PNG, JPG (MAX. 5MB)
                        </p>
                      </div>
                    )}
                    <input
                      id="selfie-upload"
                      type="file"
                      className="hidden"
                      onChange={handleSelfieChange}
                      accept="image/png, image/jpeg"
                    />
                  </label>
                </div>
              </div>

              {/* Aspect Ratio */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Relación de Aspecto
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {["3:4", "1:1", "4:3", "16:9", "9:16"].map((ratio) => (
                    <button
                      key={ratio}
                      onClick={() => setAspectRatio(ratio)}
                      className={`py-2 rounded-lg text-sm font-semibold border transition-all ${
                        aspectRatio === ratio
                          ? "bg-[#D8C780] text-black border-[#D8C780]"
                          : "bg-gray-800 text-gray-300 border-gray-700 hover:bg-gray-700"
                      }`}
                    >
                      {ratio}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <button
              onClick={handleGenerateImage}
              disabled={!generatedPrompt || !selfieImage || isLoadingImage}
              className="w-full mt-6 py-3 px-4 bg-[#D8C780] text-black font-bold rounded-lg flex items-center justify-center transition-all disabled:bg-gray-600 disabled:cursor-not-allowed hover:bg-yellow-300"
            >
              {isLoadingImage ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-black mr-3"></div>
                  Generando... (1 crédito)
                </>
              ) : (
                "Generar Imagen (1 crédito)"
              )}
            </button>
            {error && (
              <p className="text-red-500 text-sm mt-2 text-center">{error}</p>
            )}
          </div>

          {/* Imagen Generada */}
          <div className="bg-[#0A0A0A] rounded-xl p-6 border border-[#2D2D2D]">
            <h3 className="text-lg font-semibold mb-3 flex items-center">
              <span className="text-3xl mr-3">3</span>
              Resultado Final
            </h3>
            <div className="aspect-w-3 aspect-h-4 bg-black/50 rounded-lg flex items-center justify-center relative group">
              {isLoadingImage && (
                <div className="text-center text-gray-400">
                  <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#D8C780] mx-auto mb-4"></div>
                  <p>Creando tu retrato...</p>
                </div>
              )}
              {generatedImage && !isLoadingImage && (
                <img
                  src={generatedImage}
                  alt="Retrato generado"
                  className="w-full h-full object-contain rounded-lg"
                />
              )}
              {!generatedImage && !isLoadingImage && (
                <div className="text-center text-gray-500">
                  <ImageIcon className="w-12 h-12 mx-auto mb-2" />
                  <p>La imagen generada aparecerá aquí.</p>
                </div>
              )}
              {generatedImage && !isLoadingImage && (
                <div className="absolute top-2 right-2 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => {
                      const a = document.createElement("a");
                      a.href = generatedImage;
                      a.download = "promptrait.png";
                      a.click();
                    }}
                    className="p-2 bg-black/50 rounded-full text-white hover:bg-black/80"
                  >
                    <Download className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() =>
                      navigator.share({
                        files: [
                          new File([generatedImage], "promptrait.png", {
                            type: "image/png",
                          }),
                        ],
                      })
                    }
                    className="p-2 bg-black/50 rounded-full text-white hover:bg-black/80"
                  >
                    <Share2 className="w-5 h-5" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

PromptLab.propTypes = {
  isPro: PropTypes.bool.isRequired,
  onSelection: PropTypes.func,
};

PromptLab.defaultProps = {
  onSelection: () => {},
};
