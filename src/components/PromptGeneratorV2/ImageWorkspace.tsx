// src/components/PromptGeneratorV2/ImageWorkspace.tsx

import React, { useState, useRef } from "react";
import { useImageGeneration } from "../../contexts/ImageGenerationContext";
import {
  editImage,
  summarizePromptForPlatforms,
} from "../../services/geminiServiceV2";
import type { ImageFile, AspectRatio } from "../../types/promptTypes";
import { ASPECT_RATIOS } from "../../constants/promptConstants";
import { fileToBase64, copyToClipboard } from "../../utils/fileUtils";
import {
  CopyIcon,
  ImageIcon,
  UserCircleIcon,
  XCircleIcon,
  ImageEditIcon,
  ClipboardListIcon,
  DownloadIcon,
} from "./icons";
import { Spinner } from "./Spinner";

interface SelfieUploaderProps {
  label: string;
  onFileChange: (file: ImageFile | null) => void;
}

const SelfieUploader: React.FC<SelfieUploaderProps> = ({
  label,
  onFileChange,
}) => {
  const [preview, setPreview] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 4 * 1024 * 1024) {
        alert("El tamaño del archivo excede el límite de 4MB.");
        return;
      }

      const base64 = await fileToBase64(file);
      const imageFile: ImageFile = {
        name: file.name,
        mimeType: file.type,
        data: base64,
      };

      onFileChange(imageFile);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleRemove = () => {
    onFileChange(null);
    setPreview(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-zinc-300">{label}</label>
      {preview ? (
        <div className="relative">
          <img
            src={preview}
            alt="Preview"
            className="w-full h-32 object-cover rounded-lg border border-zinc-700"
          />
          <button
            onClick={handleRemove}
            className="absolute top-2 right-2 p-1 bg-red-500 rounded-full hover:bg-red-600 transition-colors"
          >
            <XCircleIcon className="w-4 h-4 text-white" />
          </button>
        </div>
      ) : (
        <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-zinc-700 rounded-lg cursor-pointer hover:border-amber-500 transition-colors bg-zinc-900/50">
          <UserCircleIcon className="w-8 h-8 text-zinc-500 mb-2" />
          <span className="text-sm text-zinc-400">Click para subir foto</span>
          <span className="text-xs text-zinc-500 mt-1">Máx. 4MB</span>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
        </label>
      )}
    </div>
  );
};

interface ImageWorkspaceProps {
  professionalPrompt: string;
  setProfessionalPrompt: (prompt: string) => void;
  onGenerateImage: (
    prompt: string,
    faceImages: ImageFile[],
    aspectRatio: AspectRatio
  ) => void;
  gender: "masculine" | "feminine" | "couple" | "animal";
}

export const ImageWorkspace: React.FC<ImageWorkspaceProps> = ({
  professionalPrompt,
  setProfessionalPrompt,
  onGenerateImage,
  gender,
}) => {
  const { isLoading, loadingMessage, generatedImage } = useImageGeneration();

  const [faceImages, setFaceImages] = useState<ImageFile[]>([]);
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>("1:1");
  const [editInstruction, setEditInstruction] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [summaries, setSummaries] = useState<{
    instagram: string;
    twitter: string;
    linkedin: string;
  } | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const handleFaceImageChange = (index: number, file: ImageFile | null) => {
    const newFaceImages = [...faceImages];
    if (file) {
      newFaceImages[index] = file;
    } else {
      newFaceImages.splice(index, 1);
    }
    setFaceImages(newFaceImages);
  };

  const handleGenerate = () => {
    if (!professionalPrompt.trim()) {
      alert("Por favor, genera o escribe un prompt primero");
      return;
    }
    onGenerateImage(professionalPrompt, faceImages, aspectRatio);
  };

  const handleCopy = async (text: string, field?: string) => {
    await copyToClipboard(text);
    if (field) {
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
    }
  };
  const handleSummarize = async () => {
    if (!professionalPrompt.trim()) {
      alert("No hay prompt para resumir");
      return;
    }

    setIsSummarizing(true);
    try {
      const result = await summarizePromptForPlatforms(professionalPrompt);
      setSummaries(result);
    } catch (error: any) {
      alert("Error al generar resúmenes: " + error.message);
    } finally {
      setIsSummarizing(false);
    }
  };

  const handleDownload = () => {
    if (!generatedImage) return;
    const link = document.createElement("a");
    link.href = `data:${generatedImage.mimeType};base64,${generatedImage.data}`;
    link.download = generatedImage.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const maxFaceImages = gender === "couple" ? 2 : 1;

  return (
    <div className="bg-zinc-800/50 backdrop-blur-sm rounded-2xl border border-zinc-700 p-6">
      <h2 className="text-2xl font-bold text-amber-400 flex items-center gap-2 mb-6">
        <ImageIcon />
        Image Workspace
      </h2>

      {/* Prompt Display/Edit */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <label className="block text-sm font-medium text-zinc-300">
            Prompt Profesional
          </label>
          <button
            onClick={() => handleCopy(professionalPrompt, "prompt")}
            className="p-2 bg-zinc-700 hover:bg-amber-500 rounded-lg transition-all"
            title="Copiar prompt"
          >
            {copiedField === "prompt" ? (
              <span className="text-green-400 text-sm">✓</span>
            ) : (
              <CopyIcon />
            )}
          </button>
        </div>
        <textarea
          value={professionalPrompt}
          onChange={(e) => setProfessionalPrompt(e.target.value)}
          placeholder="El prompt generado aparecerá aquí..."
          className="w-full px-4 py-3 bg-zinc-900 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-amber-500 resize-none font-mono text-sm"
          rows={6}
        />
      </div>

      {/* Face Images Upload */}
      {gender !== "animal" && (
        <div className="mb-6">
          <h3 className="text-sm font-medium text-zinc-300 mb-3">
            Sube tu Selfie{" "}
            {gender === "couple" ? "(Hasta 2 fotos)" : "(Opcional)"}
          </h3>
          <div
            className={`grid ${
              gender === "couple" ? "grid-cols-2" : "grid-cols-1"
            } gap-4`}
          >
            {Array.from({ length: maxFaceImages }).map((_, index) => (
              <SelfieUploader
                key={index}
                label={gender === "couple" ? `Persona ${index + 1}` : "Tu Foto"}
                onFileChange={(file) => handleFaceImageChange(index, file)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Aspect Ratio */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-zinc-300 mb-2">
          Proporción de Aspecto
        </label>
        <div className="grid grid-cols-5 gap-2">
          {ASPECT_RATIOS.map((ratio) => (
            <button
              key={ratio.value}
              onClick={() => setAspectRatio(ratio.value)}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                aspectRatio === ratio.value
                  ? "bg-amber-500 text-black"
                  : "bg-zinc-700 text-zinc-300 hover:bg-zinc-600"
              }`}
            >
              {ratio.value}
            </button>
          ))}
        </div>
      </div>

      {/* Generate Button */}
      <button
        onClick={handleGenerate}
        disabled={isLoading || !professionalPrompt.trim()}
        className="w-full px-6 py-3 bg-gradient-to-r from-amber-500 to-yellow-600 text-black font-semibold rounded-lg hover:from-amber-600 hover:to-yellow-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 mb-6"
      >
        <ImageIcon />
        {isLoading ? "Generando..." : "Generar Imagen"}
      </button>

      {/* Loading State */}
      {isLoading && <Spinner message={loadingMessage} />}

      {/* Generated Image */}
      {generatedImage && !isLoading && (
        <div className="space-y-4">
          <div className="relative">
            <img
              src={`data:${generatedImage.mimeType};base64,${generatedImage.data}`}
              alt="Generated"
              className="w-full rounded-lg border border-zinc-700"
            />
            <button
              onClick={handleDownload}
              className="absolute top-4 right-4 p-3 bg-black/70 hover:bg-amber-500 rounded-lg transition-all backdrop-blur-sm"
              title="Descargar imagen"
            >
              <DownloadIcon className="w-5 h-5 text-white" />
            </button>
          </div>

          {/* Social Media Summaries */}
          <div>
            <button
              onClick={handleSummarize}
              disabled={isSummarizing}
              className="w-full px-4 py-2 bg-zinc-700 hover:bg-zinc-600 text-white rounded-lg transition-all flex items-center justify-center gap-2 mb-3"
            >
              <ClipboardListIcon />
              {isSummarizing
                ? "Generando..."
                : "Generar Resúmenes para Redes Sociales"}
            </button>

            {summaries && (
              <div className="space-y-3">
                {Object.entries(summaries).map(([platform, text]) => (
                  <div
                    key={platform}
                    className="bg-zinc-900/50 rounded-lg p-3 border border-zinc-700"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-amber-400 capitalize">
                        {platform}
                      </span>
                      <button
                        onClick={() => handleCopy(text, platform)}
                        className="p-1 hover:bg-zinc-700 rounded transition-all"
                      >
                        {copiedField === platform ? (
                          <span className="text-green-400 text-xs">✓</span>
                        ) : (
                          <CopyIcon className="w-3 h-3" />
                        )}
                      </button>
                    </div>
                    <p className="text-sm text-zinc-300">{text}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
