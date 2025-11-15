import React, { useState } from "react";
import PropTypes from "prop-types";
import {
  FileSearch, // Corregido: ScanSearch -> FileSearch
  Loader2,
  UploadCloud,
  Trash2,
  Sparkles,
} from "lucide-react";
import { analyzeImage } from "../services/geminiService";

const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
};

export const ImageAnalyzer = ({ onPromptReady, isPro }) => {
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 4 * 1024 * 1024) {
        // Límite de 4MB
        setError("El archivo es demasiado grande. El límite es 4MB.");
        return;
      }
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
      setError("");
    }
  };

  const handleAnalyze = async () => {
    if (!imageFile) {
      setError("Por favor, sube una imagen para analizar.");
      return;
    }
    if (!isPro) {
      setError("Esta es una función PRO. Por favor, actualiza tu plan.");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const base64Image = await fileToBase64(imageFile);
      const { prompt, subject } = await analyzeImage(
        base64Image,
        imageFile.type
      );

      // Pasamos el prompt generado al componente padre
      onPromptReady(prompt);
    } catch (err) {
      console.error("Error en el análisis de imagen:", err);
      setError(err.message || "Ocurrió un error al analizar la imagen.");
    } finally {
      setIsLoading(false);
    }
  };

  const clearImage = () => {
    setImageFile(null);
    setImagePreview("");
    setError("");
  };

  if (!isPro) {
    return (
      <div className="p-6 text-center text-yellow-400 bg-yellow-900/30 rounded-lg border border-yellow-600/50">
        <Sparkles className="mx-auto w-8 h-8 mb-2" />
        <h3 className="font-bold">Función PRO</h3>
        <p className="text-sm text-yellow-200/80">
          El analizador de imágenes es una herramienta exclusiva para usuarios
          PRO. ¡Actualiza tu plan para desbloquearla!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4 p-4 bg-black/20 rounded-lg">
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Imagen de Referencia
        </label>
        {!imagePreview ? (
          <label className="cursor-pointer flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-600 rounded-lg text-center hover:bg-gray-800/50">
            <UploadCloud className="w-10 h-10 text-gray-400 mb-2" />
            <span className="text-gray-400">
              Sube una imagen (JPG, PNG, WebP)
            </span>
            <p className="text-xs text-gray-500 mt-1">Máx 4MB</p>
            <input
              type="file"
              accept="image/png, image/jpeg, image/webp"
              onChange={handleFileChange}
              className="hidden"
            />
          </label>
        ) : (
          <div className="relative">
            <img
              src={imagePreview}
              alt="Preview"
              className="w-full h-auto max-h-64 object-contain rounded-md border border-gray-700"
            />
            <button
              onClick={clearImage}
              className="absolute top-2 right-2 bg-red-600/80 p-1.5 rounded-full text-white hover:bg-red-500"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

      <button
        onClick={handleAnalyze}
        disabled={isLoading || !imageFile}
        className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-bold rounded-lg hover:from-blue-600 hover:to-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : (
          <FileSearch className="w-5 h-5" />
        )}
        {isLoading ? "Analizando..." : "Analizar Imagen (1 Crédito)"}
      </button>
    </div>
  );
};

ImageAnalyzer.propTypes = {
  onPromptReady: PropTypes.func.isRequired,
  isPro: PropTypes.bool.isRequired,
};
