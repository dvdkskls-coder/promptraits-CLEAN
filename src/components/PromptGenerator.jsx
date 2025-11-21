import React, { useState } from "react";
import {
  Sparkles,
  Camera,
  Aperture,
  Image,
  Wand2,
  Loader2,
  Upload,
  X,
} from "lucide-react";
import {
  generatePrompt,
  analyzeImage,
  generateImage,
} from "../services/geminiService";
import { useAuth } from "../contexts/AuthContext";

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
  "High Fashion",
  "Wes Anderson",
];

const ASPECT_RATIOS = [
  { label: "Cuadrado 1:1", value: "1:1" },
  { label: "Retrato 3:4", value: "3:4" },
  { label: "Retrato 9:16", value: "9:16" },
  { label: "Paisaje 4:3", value: "4:3" },
  { label: "Paisaje 16:9", value: "16:9" },
];

const PromptGenerator = () => {
  const { user } = useAuth();

  // Estados principales
  const [activeTab, setActiveTab] = useState("text");
  const [idea, setIdea] = useState("");
  const [selectedShot, setSelectedShot] = useState("Automático");
  const [selectedStyle, setSelectedStyle] = useState("Automático");
  const [selectedAspectRatio, setSelectedAspectRatio] = useState("1:1");

  // Estados de imagen para análisis (tab "image")
  const [uploadedImage, setUploadedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  // Estados de SELFIE para generación (opcional)
  const [selfieFile, setSelfieFile] = useState(null);
  const [selfiePreview, setSelfiePreview] = useState(null);

  // Estados de resultados
  const [generatedPrompt, setGeneratedPrompt] = useState("");
  const [generatedImage, setGeneratedImage] = useState(null);

  // Estados de UI
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [step, setStep] = useState(1);

  // ========================================================================
  // FUNCIÓN 1: TEXT-TO-TEXT (Generador Manual)
  // ========================================================================
  const handleGeneratePrompt = async () => {
    if (!idea.trim()) {
      setError("Por favor, describe tu idea primero");
      return;
    }

    setLoading(true);
    setError(null);
    setGeneratedPrompt("");

    try {
      const result = await generatePrompt({
        idea: idea,
        style: selectedStyle !== "Automático" ? selectedStyle : undefined,
        camera: selectedShot !== "Automático" ? selectedShot : undefined,
      });

      if (result && result.prompt_text) {
        setGeneratedPrompt(result.prompt_text);
        setStep(2);
      } else {
        throw new Error("No se recibió el texto del prompt");
      }
    } catch (err) {
      console.error("Error generando prompt:", err);
      setError(err.message || "Error al generar el prompt");
    } finally {
      setLoading(false);
    }
  };

  // ========================================================================
  // FUNCIÓN 2: IMAGE-TO-TEXT (Análisis de Foto)
  // ========================================================================
  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadedImage(file);

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleAnalyzeImage = async () => {
    if (!uploadedImage) {
      setError("Por favor, sube una imagen primero");
      return;
    }

    setLoading(true);
    setError(null);
    setGeneratedPrompt("");

    try {
      const result = await analyzeImage(uploadedImage);

      if (result && result.prompt_text) {
        setGeneratedPrompt(result.prompt_text);
        setStep(2);
      } else {
        throw new Error(
          "No se pudo analizar la imagen - respuesta sin prompt_text"
        );
      }
    } catch (err) {
      console.error("Error analizando imagen:", err);
      setError(err.message || "Error al analizar la imagen");
    } finally {
      setLoading(false);
    }
  };

  // ========================================================================
  // FUNCIÓN 3: UPLOAD DE SELFIE (Para generación de imagen)
  // ========================================================================
  const handleSelfieUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelfieFile(file);

    const reader = new FileReader();
    reader.onloadend = () => {
      setSelfiePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveSelfie = () => {
    setSelfieFile(null);
    setSelfiePreview(null);
  };

  // ========================================================================
  // FUNCIÓN 4: GENERADOR DE IMAGEN (Prompt-to-Image)
  // ========================================================================
  const handleGenerateImage = async () => {
    if (!generatedPrompt) {
      setError("Primero necesitas generar un prompt");
      return;
    }

    setLoading(true);
    setError(null);
    setGeneratedImage(null);

    try {
      const result = await generateImage(
        generatedPrompt,
        selectedAspectRatio,
        selfieFile
      );

      if (result && result.imageUrl) {
        setGeneratedImage(result.imageUrl);
      } else {
        throw new Error("No se pudo generar la imagen");
      }
    } catch (err) {
      console.error("Error generando imagen:", err);
      setError(err.message || "Error al generar la imagen");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setGeneratedPrompt("");
    setGeneratedImage(null);
    setStep(1);
    setError(null);
    setIdea("");
    setUploadedImage(null);
    setImagePreview(null);
    setSelfieFile(null);
    setSelfiePreview(null);
  };

  // ========================================================================
  // RENDER
  // ========================================================================
  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold">
          Generador de Prompts Profesionales
        </h2>
        <p className="text-gray-600">
          Crea prompts fotográficos de calidad profesional con IA
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b">
        <button
          onClick={() => {
            setActiveTab("text");
            setError(null);
          }}
          className={`px-6 py-3 font-medium transition-colors ${
            activeTab === "text"
              ? "border-b-2 border-blue-500 text-blue-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          <div className="flex items-center gap-2">
            <Sparkles size={20} />
            <span>Texto a Prompt</span>
          </div>
        </button>
        <button
          onClick={() => {
            setActiveTab("image");
            setError(null);
          }}
          className={`px-6 py-3 font-medium transition-colors ${
            activeTab === "image"
              ? "border-b-2 border-blue-500 text-blue-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          <div className="flex items-center gap-2">
            <Image size={20} />
            <span>Imagen a Prompt</span>
          </div>
        </button>
      </div>

      {/* Step Indicator */}
      <div className="flex items-center justify-center gap-4">
        <div
          className={`flex items-center gap-2 ${
            step === 1 ? "text-blue-600" : "text-green-600"
          }`}
        >
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center ${
              step === 1 ? "bg-blue-600 text-white" : "bg-green-600 text-white"
            }`}
          >
            {step === 1 ? "1" : "✓"}
          </div>
          <span className="font-medium">Generar Prompt</span>
        </div>
        <div className="w-16 h-1 bg-gray-200"></div>
        <div
          className={`flex items-center gap-2 ${
            step === 2 ? "text-blue-600" : "text-gray-400"
          }`}
        >
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center ${
              step === 2 ? "bg-blue-600 text-white" : "bg-gray-200"
            }`}
          >
            2
          </div>
          <span className="font-medium">Generar Imagen</span>
        </div>
      </div>
      {/* Content */}
      <div className="bg-white rounded-lg shadow-lg p-6 space-y-6">
        {step === 1 && (
          <>
            {/* TAB: TEXT-TO-TEXT */}
            {activeTab === "text" && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Describe tu idea 💡
                  </label>
                  <textarea
                    value={idea}
                    onChange={(e) => setIdea(e.target.value)}
                    placeholder="Ej: Una modelo en un entorno urbano nocturno con luces neón..."
                    className="w-full px-4 py-3 border rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    rows={4}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Tipo de Plano
                    </label>
                    <select
                      value={selectedShot}
                      onChange={(e) => setSelectedShot(e.target.value)}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    >
                      {SHOT_TYPES.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Estilo Fotográfico
                    </label>
                    <select
                      value={selectedStyle}
                      onChange={(e) => setSelectedStyle(e.target.value)}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    >
                      {PHOTO_STYLES.map((style) => (
                        <option key={style} value={style}>
                          {style}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <button
                  onClick={handleGeneratePrompt}
                  disabled={loading || !idea.trim()}
                  className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-medium transition-colors"
                >
                  {loading ? (
                    <>
                      <Loader2 className="animate-spin" size={20} />
                      <span>Generando...</span>
                    </>
                  ) : (
                    <>
                      <Wand2 size={20} />
                      <span>Generar Prompt Profesional</span>
                    </>
                  )}
                </button>
              </div>
            )}

            {/* TAB: IMAGE-TO-TEXT */}
            {activeTab === "image" && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Sube una foto para analizar 📸
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-500 transition-colors">
                    {imagePreview ? (
                      <div className="space-y-4">
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="max-h-64 mx-auto rounded-lg"
                        />
                        <button
                          onClick={() => {
                            setImagePreview(null);
                            setUploadedImage(null);
                          }}
                          className="text-red-600 hover:underline"
                        >
                          Cambiar imagen
                        </button>
                      </div>
                    ) : (
                      <label className="cursor-pointer">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                        />
                        <Camera
                          size={48}
                          className="mx-auto mb-4 text-gray-400"
                        />
                        <p className="text-gray-600">
                          Click para seleccionar o arrastra una imagen aquí
                        </p>
                        <p className="text-sm text-gray-400 mt-2">
                          JPG, PNG o WEBP (máx 4MB)
                        </p>
                      </label>
                    )}
                  </div>
                </div>

                <button
                  onClick={handleAnalyzeImage}
                  disabled={loading || !uploadedImage}
                  className="w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-medium transition-colors"
                >
                  {loading ? (
                    <>
                      <Loader2 className="animate-spin" size={20} />
                      <span>Analizando...</span>
                    </>
                  ) : (
                    <>
                      <Aperture size={20} />
                      <span>Analizar y Generar Prompt</span>
                    </>
                  )}
                </button>
              </div>
            )}
          </>
        )}

        {/* STEP 2: Prompt Generado + Generación de Imagen */}
        {step === 2 && generatedPrompt && (
          <div className="space-y-6">
            {/* RECUADRO DEL PROMPT */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-lg border-2 border-blue-200">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-lg flex items-center gap-2">
                  <Sparkles size={20} className="text-yellow-500" />
                  Prompt Profesional Generado (8 líneas)
                </h3>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(generatedPrompt);
                    alert("Prompt copiado al portapapeles");
                  }}
                  className="text-sm px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                >
                  Copiar
                </button>
              </div>
              <div className="bg-white p-4 rounded border border-blue-200">
                <pre className="whitespace-pre-wrap text-sm text-gray-800 font-mono leading-relaxed">
                  {generatedPrompt}
                </pre>
              </div>
            </div>

            {/* UPLOAD DE SELFIE (OPCIONAL) */}
            <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
              <h4 className="font-semibold mb-3 flex items-center gap-2">
                <Upload size={18} className="text-blue-600" />
                Sube tu selfie (Opcional)
              </h4>
              <p className="text-sm text-gray-600 mb-4">
                Si subes una foto de tu rostro, la IA generará la imagen usando
                tu cara exacta.
              </p>

              {selfiePreview ? (
                <div className="flex items-center gap-4">
                  <img
                    src={selfiePreview}
                    alt="Selfie"
                    className="w-24 h-24 rounded-full object-cover border-2 border-blue-500"
                  />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-700">
                      Selfie cargado ✓
                    </p>
                    <p className="text-xs text-gray-500">
                      La imagen se generará con tu rostro
                    </p>
                  </div>
                  <button
                    onClick={handleRemoveSelfie}
                    className="text-red-600 hover:text-red-700 p-2"
                  >
                    <X size={20} />
                  </button>
                </div>
              ) : (
                <label className="cursor-pointer flex items-center gap-3 px-4 py-3 bg-white border-2 border-dashed border-blue-300 rounded-lg hover:border-blue-500 transition-colors">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleSelfieUpload}
                    className="hidden"
                  />
                  <Upload size={20} className="text-blue-600" />
                  <span className="text-sm text-gray-700">
                    Click para subir tu selfie
                  </span>
                </label>
              )}
            </div>

            {/* SELECTOR DE FORMATO */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Formato de Imagen
              </label>
              <select
                value={selectedAspectRatio}
                onChange={(e) => setSelectedAspectRatio(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              >
                {ASPECT_RATIOS.map((ratio) => (
                  <option key={ratio.value} value={ratio.value}>
                    {ratio.label}
                  </option>
                ))}
              </select>
            </div>

            {/* BOTONES DE ACCIÓN */}
            <div className="flex gap-3">
              <button
                onClick={handleGenerateImage}
                disabled={loading}
                className="flex-1 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-medium transition-colors"
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin" size={20} />
                    <span>Generando Imagen...</span>
                  </>
                ) : (
                  <>
                    <Image size={20} />
                    <span>Generar Imagen con este Prompt</span>
                  </>
                )}
              </button>
              <button
                onClick={handleReset}
                disabled={loading}
                className="px-6 py-3 border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                Reiniciar
              </button>
            </div>

            {/* IMAGEN GENERADA */}
            {generatedImage && (
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-lg border-2 border-green-200">
                <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                  <Image size={20} className="text-green-600" />
                  Imagen Generada Exitosamente
                </h3>
                <img
                  src={generatedImage}
                  alt="Generated"
                  className="w-full rounded-lg shadow-lg mb-4 border border-green-200"
                />
                <div className="flex gap-3">
                  <a
                    href={generatedImage}
                    download={`promptraits-${Date.now()}.png`}
                    className="flex-1 text-center bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                  >
                    Descargar Imagen
                  </a>
                  <button
                    onClick={handleReset}
                    className="px-6 py-3 border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Crear Nueva
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-red-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PromptGenerator;
