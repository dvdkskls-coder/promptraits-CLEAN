// src/contexts/ImageGenerationContext.tsx

import React, { createContext, useContext, ReactNode } from "react";
import type { ImageFile } from "../types/promptTypes";

interface ImageGenerationContextType {
  isLoading: boolean;
  loadingMessage: string;
  generatedImage: ImageFile | null;
  onGenerationComplete: (image: ImageFile) => void;
  onGenerationError: (error: Error) => void;
}

const ImageGenerationContext = createContext<
  ImageGenerationContextType | undefined
>(undefined);

interface ImageGenerationProviderProps {
  children: ReactNode;
  isLoading: boolean;
  loadingMessage: string;
  generatedImage: ImageFile | null;
  onGenerationComplete: (image: ImageFile) => void;
  onGenerationError: (error: Error) => void;
}

export function ImageGenerationProvider({
  children,
  isLoading,
  loadingMessage,
  generatedImage,
  onGenerationComplete,
  onGenerationError,
}: ImageGenerationProviderProps) {
  return (
    <ImageGenerationContext.Provider
      value={{
        isLoading,
        loadingMessage,
        generatedImage,
        onGenerationComplete,
        onGenerationError,
      }}
    >
      {children}
    </ImageGenerationContext.Provider>
  );
}

export function useImageGeneration() {
  const context = useContext(ImageGenerationContext);
  if (context === undefined) {
    throw new Error(
      "useImageGeneration must be used within ImageGenerationProvider"
    );
  }
  return context;
}
