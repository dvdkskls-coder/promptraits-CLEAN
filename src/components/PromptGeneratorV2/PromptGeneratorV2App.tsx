// src/components/PromptGeneratorV2/PromptGeneratorV2App.tsx

import React, { useState } from "react";
import { PromptLab } from "./PromptLab";
import { ImageWorkspace } from "./ImageWorkspace";
import type { ImageFile, AspectRatio } from "../../types/promptTypes";
import { ImageGenerationProvider } from "../../contexts/ImageGenerationContext";
import { generateImageGeminiPro } from "../../services/geminiServiceV2";

export default function PromptGeneratorV2App(): React.ReactElement {
  const [professionalPrompt, setProfessionalPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");
  const [generatedImage, setGeneratedImage] = useState<ImageFile | null>(null);
  const [gender, setGender] = useState<
    "masculine" | "feminine" | "couple" | "animal"
  >("masculine");

  const handlePromptGenerated = (prompt: string) => {
    setProfessionalPrompt(prompt);
  };

  const handleGenerationStart = (message: string) => {
    setIsLoading(true);
    setLoadingMessage(message);
    setGeneratedImage(null);
  };

  const handleGenerationComplete = (imageFile: ImageFile) => {
    setGeneratedImage(imageFile);
    setIsLoading(false);
    setLoadingMessage("");
  };

  const handleGenerationError = (error: Error) => {
    alert(`Error: ${error.message}`);
    setIsLoading(false);
    setLoadingMessage("");
  };

  const handleGenerateImage = async (
    prompt: string,
    faceImages: ImageFile[],
    aspectRatio: AspectRatio
  ) => {
    handleGenerationStart(
      `Generando imagen con Gemini Imagen 3 (${aspectRatio})...`
    );

    try {
      const imageFile = await generateImageGeminiPro(
        prompt,
        faceImages,
        aspectRatio
      );
      handleGenerationComplete(imageFile);
    } catch (error: any) {
      handleGenerationError(error as Error);
    }
  };

  return (
    <ImageGenerationProvider
      isLoading={isLoading}
      loadingMessage={loadingMessage}
      generatedImage={generatedImage}
      onGenerationComplete={handleGenerationComplete}
      onGenerationError={handleGenerationError}
    >
      <div className="min-h-screen bg-gradient-to-br from-black via-zinc-900 to-black text-white">
        <div className="container mx-auto px-4 py-8">
          <header className="text-center mb-8">
            <h1 className="text-5xl font-extrabold mb-2 bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-600 bg-clip-text text-transparent">
              Promptraits Studio Pro
            </h1>
            <p className="text-zinc-400 text-lg">
              Generador Profesional de Prompts Fotográficos con IA
            </p>
          </header>

          <div className="grid lg:grid-cols-2 gap-8">
            <PromptLab
              onPromptGenerated={handlePromptGenerated}
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
      </div>
    </ImageGenerationProvider>
  );
}
