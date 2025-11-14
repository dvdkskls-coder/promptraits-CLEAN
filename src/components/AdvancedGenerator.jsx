import React, { useState, useEffect } from "react";
import {
  Trash2,
  Copy,
  Check,
  Loader2,
  Image as ImageIcon,
  User,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import AnimatedSection from "./AnimatedSection";
import { PromptLab } from "./PromptLab"; // Importamos el nuevo componente

// Importamos solo los servicios que este componente necesita directamente
import {
  generateImageNano,
  analyzeImage as analyzeImageService, // Renombramos para evitar conflictos
} from "../services/geminiService";

export default function AdvancedGenerator() {
  const { user, profile, refreshProfile } = useAuth();
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    if (user !== undefined && profile !== undefined) {
      setIsInitializing(false);
    }
  }, [user, profile]);

  // ESTADO CENTRALIZADO: Estos estados ahora son el "cerebro" de la página.
  const [finalPrompt, setFinalPrompt] = useState("");
  const [gender, setGender] = useState("masculine"); // 'masculine', 'feminine', 'couple', 'animal'

  // Estados para la generación de imagen (se mantienen igual)
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [generatedImages, setGeneratedImages] = useState([]);
  const [selectedAspectRatio, setSelectedAspectRatio] = useState("1:1");
  const [selfieImage, setSelfieImage] = useState(null);
  const [selfiePreview, setSelfiePreview] = useState("");
  const [copied, setCopied] = useState(false);

  // Estado para el tipo de sujeto detectado por el analizador
  const [detectedSubjectType, setDetectedSubjectType] = useState(null);

  // --------------------------------------------------------------------------
  // MANEJO DE ARCHIVOS Y GENERACIÓN (Lógica sin cambios)
  // --------------------------------------------------------------------------
  const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleSelfieChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelfieImage(file);
      const reader = new FileReader();
      reader.onloadend = () => setSelfiePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleGenerateImage = async () => {
    if (!finalPrompt)
      return alert(
        "Primero debes generar un prompt desde el Laboratorio de Prompts."
      );
    if (!profile || profile.credits < 1)
      return alert("No tienes suficientes créditos.");
    if (!selfieImage) return alert("Debes subir una foto selfie.");

    setIsGeneratingImage(true);
    setGeneratedImages([]);

    try {
      const base64 = await fileToBase64(selfieImage);
      const faceImages = [{ base64, mimeType: selfieImage.type }];

      const imageFile = await generateImageNano(finalPrompt, faceImages);

      if (imageFile && imageFile.base64) {
        setGeneratedImages([imageFile]);
        // Descontar crédito después de una generación exitosa
        await refreshProfile();
      } else {
        throw new Error("No se recibieron datos de imagen del servidor.");
      }
    } catch (error) {
      console.error("Error generando imagen:", error);
      alert(error.message || "Ocurrió un error al generar la imagen.");
    } finally {
      setIsGeneratingImage(false);
    }
  };

  const handleCopy = () => {
    if (!finalPrompt) return;
    navigator.clipboard.writeText(finalPrompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // El callback que recibe el prompt desde el PromptLab
  const handlePromptGenerated = (prompt, subjectType) => {
    setFinalPrompt(prompt);
    if (subjectType) {
      setDetectedSubjectType(subjectType);
      // Opcional: cambiar el género automáticamente si el análisis lo sugiere
      if (["male", "female", "couple", "animal"].includes(subjectType)) {
        const genderMap = { male: "masculine", female: "feminine" };
        setGender(genderMap[subjectType] || subjectType);
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {isInitializing ? (
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="w-12 h-12 animate-spin text-[#D8C780]" />
        </div>
      ) : (
        <AnimatedSection>
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-4">
              <span className="bg-gradient-to-r from-[#D8C780] to-[#D8C780] bg-clip-text text-transparent">
                Generador Profesional
              </span>{" "}
              <span className="text-4xl">🍌</span>
            </h1>
            <p className="text-[#C1C1C1] max-w-2xl mx-auto">
              Usa el laboratorio para crear tu prompt y luego genera tu imagen
              fotorrealista.
            </p>
            {profile && (
              <div className="mt-4 inline-block px-4 py-2 bg-[#D8C780]/20 border border-[#D8C780] rounded-lg">
                <span className="text-[#D8C780] font-medium">
                  Créditos: {profile.credits || 0}
                </span>
              </div>
            )}
          </div>

          {/* NUEVA ESTRUCTURA: PromptLab a la izquierda, Resultados a la derecha */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* COLUMNA IZQUIERDA: Laboratorio de Prompts */}
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white">
                1. Laboratorio de Prompts
              </h2>
              <PromptLab
                onPromptGenerated={handlePromptGenerated}
                gender={gender}
                setGender={setGender}
                isPro={profile?.plan === "pro" || profile?.plan === "premium"}
              />
            </div>

            {/* COLUMNA DERECHA: Área de Trabajo y Generación */}
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white">
                2. Área de Trabajo
              </h2>

              {/* Bloque de Texto Prompt */}
              <div className="bg-[#0A0A0A] rounded-xl p-6 border border-[#2D2D2D]">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium text-white">
                    Prompt Final
                  </h3>
                  <button
                    onClick={handleCopy}
                    disabled={!finalPrompt}
                    className="flex items-center gap-2 px-3 py-1 bg-[#D8C780] text-black rounded text-sm font-bold disabled:bg-gray-600"
                  >
                    {copied ? (
                      <Check className="w-4 h-4" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                    {copied ? "Copiado" : "Copiar"}
                  </button>
                </div>
                <div className="bg-[#06060C]/50 rounded-lg p-4 text-[#C1C1C1] whitespace-pre-wrap min-h-[150px] max-h-[300px] overflow-y-auto">
                  {finalPrompt ||
                    "Aquí aparecerá el prompt generado por el laboratorio..."}
                </div>
              </div>

              {/* Bloque Generar Imagen */}
              <div className="bg-[#0A0A0A] rounded-xl p-6 border border-[#D8C780]/30">
                <h3 className="text-xl font-medium text-white mb-2">
                  3. Generar Imagen Final
                </h3>
                <p className="text-[#C1C1C1] text-sm mb-6">
                  Sube tu selfie para aplicar tu cara al prompt generado.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-[#C1C1C1] mb-2">
                      Tu Selfie
                    </label>
                    {!selfiePreview ? (
                      <label className="cursor-pointer block p-4 border-2 border-dashed border-[#D8C780] rounded-lg text-center hover:bg-[#D8C780]/10">
                        <User className="w-8 h-8 text-[#D8C780] mx-auto mb-2" />
                        <span className="text-[#D8C780]">Subir Selfie</span>
                        <input
                          type="file"
                          accept="image/png, image/jpeg, image/webp"
                          onChange={handleSelfieChange}
                          className="hidden"
                        />
                      </label>
                    ) : (
                      <div className="relative h-48">
                        <img
                          src={selfiePreview}
                          className="w-full h-full object-contain rounded border border-[#D8C780]"
                          alt="Selfie"
                        />
                        <button
                          onClick={() => {
                            setSelfieImage(null);
                            setSelfiePreview("");
                          }}
                          className="absolute top-2 right-2 bg-red-500 p-1 rounded text-white"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col justify-end">
                    <div className="mb-4">
                      <label className="block text-sm text-[#C1C1C1] mb-2">
                        Formato
                      </label>
                      <div className="flex gap-2">
                        {["1:1", "3:4", "16:9"].map((r) => (
                          <button
                            key={r}
                            onClick={() => setSelectedAspectRatio(r)}
                            className={`px-3 py-1 rounded border text-sm ${
                              selectedAspectRatio === r
                                ? "bg-[#D8C780] text-black border-[#D8C780]"
                                : "border-[#2D2D2D] text-gray-400"
                            }`}
                          >
                            {r}
                          </button>
                        ))}
                      </div>
                    </div>
                    <button
                      onClick={handleGenerateImage}
                      disabled={
                        isGeneratingImage || !selfieImage || !finalPrompt
                      }
                      className="w-full py-3 bg-[#D8C780] hover:bg-[#C4B66D] disabled:bg-gray-700 disabled:text-gray-500 rounded-lg font-bold text-black flex justify-center gap-2"
                    >
                      {isGeneratingImage ? (
                        <Loader2 className="animate-spin" />
                      ) : (
                        <ImageIcon />
                      )}
                      Generar Imagen (1 Crédito)
                    </button>
                  </div>
                </div>

                {/* Galería Resultados */}
                {generatedImages.length > 0 && (
                  <div className="mt-6 grid gap-4">
                    {generatedImages.map((img, idx) => (
                      <div key={idx} className="relative group">
                        <img
                          src={`data:${img.mimeType};base64,${img.base64}`}
                          className="w-full rounded-lg border border-[#2D2D2D]"
                          alt="Result"
                        />
                        <a
                          href={`data:${img.mimeType};base64,${img.base64}`}
                          download={`generated-${idx}.jpg`}
                          className="absolute bottom-4 right-4 bg-[#D8C780] text-black px-4 py-2 rounded font-bold opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          Descargar
                        </a>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </AnimatedSection>
      )}
    </div>
  );
}
