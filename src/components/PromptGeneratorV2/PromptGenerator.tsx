// src/components/PromptGeneratorV2/PromptGeneratorV2App.tsx

import React, { useState } from "react";
import { PromptLab } from "./PromptLab";
import { ImageWorkspace } from "./ImageWorkspace";
import type { ImageFile, AspectRatio } from "../../types/promptTypes";
import { ImageGenerationProvider } from "../../contexts/ImageGenerationContext";
import { generateImageGeminiPro } from "../../services/geminiServiceV2";

export default function PromptGeneratorV2App(): React.ReactElement {
  const [professionalPrompt, setProfessionalPrompt] = useState("");
  const [gender, setGender] = useState<
    "masculine" | "feminine" | "couple" | "animal"
  >("masculine");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<ImageFile | null>(null);
  const [error, setError] = useState("");

  const handleGenerateImage = async (
    prompt: string,
    faceImages: ImageFile[],
    aspectRatio: AspectRatio
  ) => {
    setIsGenerating(true);
    setError("");

    try {
      const image = await generateImageGeminiPro(
        prompt,
        faceImages,
        aspectRatio
      );
      setGeneratedImage(image);
    } catch (err: any) {
      setError(err.message || "Error al generar la imagen");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <ImageGenerationProvider
      value={{
        isLoading: isGenerating,
        loadingMessage: "Generando imagen...",
        generatedImage,
        error,
      }}
    >
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-4 bg-gradient-to-r from-[#D4AF37] to-[#FFD700] bg-clip-text text-transparent">
          Generador de Prompts Profesional
        </h2>
        <p className="text-center text-zinc-400 mb-12">
          Crea prompts profesionales con IA y genera imágenes fotorrealistas
        </p>

        <div className="grid lg:grid-cols-2 gap-8">
          <PromptLab
            onPromptGenerated={setProfessionalPrompt}
            gender={gender}
            setGender={setGender}
          />

          <ImageWorkspace
            professionalPrompt={professionalPrompt}
            setProfessionalPrompt={setProfessionalPrompt}
            onGenerateImage={handleGenerateImage}
            gender={gender}
          />
        </div>
      </div>
    </ImageGenerationProvider>
  );
}
