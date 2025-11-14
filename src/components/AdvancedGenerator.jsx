import React, { useState, useEffect, useMemo, useRef } from "react";
import {
  Upload,
  Trash2,
  Sparkles,
  Copy,
  Check,
  Loader2,
  ChevronDown,
  ChevronUp,
  Crown,
  Image as ImageIcon,
  User,
  Camera,
  Download,
  XCircle,
  FileText,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { supabase } from "../lib/supabase";
import AnimatedSection from "./AnimatedSection";
import QualityAnalysis from "./QualityAnalysis";

import Outfits_women from "../data/Outfits_women";
import Outfits_men from "../data/Outfits_men";
import { SHOT_TYPES, CAMERA_ANGLES } from "../data/shotTypesData";
import { ENVIRONMENTS_ARRAY } from "../data/environmentsData";
import { getPosesByGender } from "../data/posesData";
import { LIGHTING_SETUPS } from "../data/lightingData";
import { COLOR_GRADING_FILTERS } from "../data/colorGradingData";

const QUICK_FEATURES = [
  {
    id: "lighting",
    name: "Iluminación Pro",
    text: "Professional studio lighting setup, Rembrandt style",
  },
  {
    id: "bokeh",
    name: "Bokeh 85mm",
    text: "Shot with 85mm f/1.8 lens, creamy bokeh background",
  },
  {
    id: "cinematic",
    name: "Cinemático",
    text: "Cinematic look, Black Pro-Mist filter effect",
  },
  {
    id: "golden",
    name: "Golden Hour",
    text: "Warm golden hour lighting, sunset glow",
  },
  {
    id: "skin",
    name: "Piel Real",
    text: "Natural skin texture, high detail, no smoothing",
  },
  {
    id: "teal",
    name: "Teal & Orange",
    text: "Teal and orange color grading, blockbuster look",
  },
];

const GENDER_OPTIONS = [
  { id: "masculine", name: "Masculino" },
  { id: "feminine", name: "Femenino" },
  { id: "couple", name: "Pareja" },
  { id: "animal", name: "Animal" },
];
const VALID_ASPECT_RATIOS = [
  { id: "1:1", name: "Cuadrado" },
  { id: "3:4", name: "Vertical" },
  { id: "9:16", name: "Historia" },
  { id: "16:9", name: "Panorámica" },
];

const fileToBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

const SelfieUploader = ({ label, onFileChange, currentPreview, onRemove }) => {
  const inputRef = useRef(null);
  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const base64 = await fileToBase64(file);
      onFileChange({ base64, mimeType: file.type });
    }
  };
  return (
    <div className="flex flex-col items-center gap-2 p-3 bg-[#06060C]/50 rounded-lg border border-[#2D2D2D] hover:border-[#D8C780]/50 w-full">
      <span className="text-xs font-medium text-[#C1C1C1]">{label}</span>
      <input
        type="file"
        accept="image/*"
        ref={inputRef}
        onChange={handleFile}
        className="hidden"
      />
      {!currentPreview ? (
        <button
          onClick={() => inputRef.current?.click()}
          className="flex items-center justify-center w-16 h-16 bg-[#2D2D2D] rounded-full text-[#C1C1C1] hover:text-[#D8C780]"
        >
          <User className="w-8 h-8" />
        </button>
      ) : (
        <div className="relative">
          <img
            src={currentPreview}
            className="w-16 h-16 rounded-full object-cover border-2 border-[#D8C780]"
          />
          <button
            onClick={onRemove}
            className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-0.5"
          >
            <XCircle className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};

export default function AdvancedGenerator() {
  const { user, profile, consumeCredits, savePromptToHistory, refreshProfile } =
    useAuth();
  const [isInitializing, setIsInitializing] = useState(true);
  useEffect(() => {
    if (user !== undefined) setIsInitializing(false);
  }, [user]);

  const [userPrompt, setUserPrompt] = useState("");
  const [referenceImage, setReferenceImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");

  const [detailedPrompt, setDetailedPrompt] = useState("");
  const [compactPrompt, setCompactPrompt] = useState("");
  const [qualityAnalysis, setQualityAnalysis] = useState(null);
  const [generatedImages, setGeneratedImages] = useState([]);

  const [isLoading, setIsLoading] = useState(false);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [copiedDetailed, setCopiedDetailed] = useState(false);
  const [copiedCompact, setCopiedCompact] = useState(false);
  const [openSections, setOpenSections] = useState({});

  const [gender, setGender] = useState("masculine");
  const [faceImages, setFaceImages] = useState([null, null]);
  const [facePreviews, setFacePreviews] = useState([null, null]);
  const [selectedAspectRatio, setSelectedAspectRatio] = useState("1:1");

  const isPro = profile?.plan === "pro" || profile?.plan === "premium";

  const appendText = (text) => {
    setUserPrompt((prev) => {
      const cleanPrev = prev.trim();
      if (cleanPrev.endsWith(",")) return cleanPrev + " " + text;
      return cleanPrev ? cleanPrev + ", " + text : text;
    });
  };

  const handleRefChange = async (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setReferenceImage(file);
      const b64 = await fileToBase64(file);
      setImagePreview(b64);
    }
  };

  const handleFaceChange = (idx) => (data) => {
    const newFaces = [...faceImages];
    newFaces[idx] = data;
    setFaceImages(newFaces);
    const newPrevs = [...facePreviews];
    newPrevs[idx] = data.base64;
    setFacePreviews(newPrevs);
  };

  const handleGeneratePrompt = async (e) => {
    e.preventDefault();
    if (!userPrompt && !referenceImage)
      return alert("Escribe una idea o sube una referencia.");
    if (!profile || profile.credits < 1) return alert("Sin créditos.");

    setIsLoading(true);
    setDetailedPrompt("");
    setCompactPrompt("");
    setQualityAnalysis(null);

    try {
      let base64Ref = null;
      if (referenceImage) base64Ref = await fileToBase64(referenceImage);

      const res = await fetch("/api/gemini-processor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: userPrompt,
          referenceImage: base64Ref,
          gender,
          mimeType: referenceImage?.type,
        }),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Error en API");
      }
      const data = await res.json();

      setDetailedPrompt(data.detailed || "");
      setCompactPrompt(data.compact || "");
      if (data.analysis) setQualityAnalysis(data.analysis);

      if (data.detectedGender) {
        setGender(data.detectedGender);
        setFaceImages([null, null]);
        setFacePreviews([null, null]);
      }

      await consumeCredits(1);
      await refreshProfile();
      try {
        if (data.detailed)
          await savePromptToHistory(
            data.detailed,
            { platform: "nano-banana" },
            null
          );
      } catch (e) {}
    } catch (error) {
      alert("Error: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateImage = async () => {
    const promptToUse = compactPrompt || detailedPrompt;
    if (!promptToUse) return alert("Primero genera un prompt.");
    if (!isPro) return alert("Solo PRO.");
    if (profile.credits < 1) return alert("Sin créditos.");

    setIsGeneratingImage(true);
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      const facesToSend = faceImages.filter((f) => f !== null);

      const res = await fetch("/api/generate-image", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          prompt: promptToUse,
          faceImages: facesToSend,
          aspectRatio: selectedAspectRatio,
        }),
      });

      if (!res.ok) throw new Error((await res.json()).error);
      const data = await res.json();

      if (data.images) setGeneratedImages(data.images);
      await consumeCredits(1);
      await refreshProfile();
    } catch (error) {
      alert("Error imagen: " + error.message);
    } finally {
      setIsGeneratingImage(false);
    }
  };

  const toggleSection = (sec) =>
    setOpenSections((p) => ({ ...p, [sec]: !p[sec] }));

  const renderProSection = (title, key, dataArray, nameKey = "name") => (
    <div className="border border-[#2D2D2D] rounded-lg overflow-hidden mb-2">
      <button
        type="button"
        onClick={() => toggleSection(key)}
        className="w-full flex justify-between p-3 bg-[#06060C]/50 hover:bg-[#06060C] text-left"
      >
        <span className="text-white font-medium text-sm">{title}</span>
        {openSections[key] ? (
          <ChevronUp className="w-4 h-4 text-[#D8C780]" />
        ) : (
          <ChevronDown className="w-4 h-4 text-[#C1C1C1]" />
        )}
      </button>
      {openSections[key] && (
        <div className="p-3 bg-[#06060C]/30 grid grid-cols-2 gap-2 max-h-60 overflow-y-auto">
          {dataArray.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => appendText(item[nameKey] || item.name)}
              className="text-xs p-2 border border-[#2D2D2D] rounded hover:border-[#D8C780] text-[#C1C1C1] hover:text-white text-left"
            >
              {item[nameKey] || item.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-[#06060C] py-20 px-4">
      <div className="max-w-6xl mx-auto">
        {isInitializing ? (
          <div className="text-center py-20">
            <Loader2 className="w-10 h-10 animate-spin mx-auto text-[#D8C780]" />
          </div>
        ) : (
          <AnimatedSection>
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold mb-4 text-white">
                Generador <span className="text-[#D8C780]">Pro</span> 🍌
              </h1>
              <p className="text-[#C1C1C1]">
                Crea prompts ultra-detallados y genera imágenes.
              </p>
              <div className="mt-2 text-[#D8C780] text-sm font-medium">
                Créditos: {profile?.credits || 0}
              </div>
            </div>

            <form onSubmit={handleGeneratePrompt} className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-[#C1C1C1] mb-2">
                      Describe tu idea (o selecciona opciones)
                    </label>
                    <textarea
                      value={userPrompt}
                      onChange={(e) => setUserPrompt(e.target.value)}
                      placeholder="Ej: Retrato de un astronauta..."
                      className="w-full h-48 bg-[#06060C]/50 text-white rounded-lg p-4 border border-[#2D2D2D] focus:border-[#D8C780] outline-none resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#C1C1C1] mb-2">
                      Analizador de Imagen (Opcional)
                    </label>
                    {!imagePreview ? (
                      <label className="flex items-center gap-3 p-4 bg-[#06060C]/50 border border-[#2D2D2D] hover:border-[#D8C780] rounded-lg cursor-pointer transition-colors">
                        <Camera className="w-6 h-6 text-[#D8C780]" />
                        <div>
                          <p className="text-white text-sm">
                            Subir imagen para extraer prompt
                          </p>
                        </div>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleRefChange}
                          className="hidden"
                        />
                      </label>
                    ) : (
                      <div className="relative w-full h-32 bg-[#06060C] rounded-lg overflow-hidden border border-[#2D2D2D]">
                        <img
                          src={imagePreview}
                          className="w-full h-full object-contain"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setReferenceImage(null);
                            setImagePreview("");
                          }}
                          className="absolute top-2 right-2 p-1 bg-red-500 rounded"
                        >
                          <Trash2 className="w-4 h-4 text-white" />
                        </button>
                      </div>
                    )}
                  </div>

                  <div>
                    <p className="text-sm text-[#C1C1C1] mb-2">
                      Características Rápidas:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {QUICK_FEATURES.map((f) => (
                        <button
                          key={f.id}
                          type="button"
                          onClick={() => appendText(f.text)}
                          className="px-3 py-1.5 text-xs border border-[#2D2D2D] rounded-full text-[#C1C1C1] hover:border-[#D8C780] hover:text-white transition-colors"
                        >
                          + {f.name}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="bg-[#06060C]/30 p-4 rounded-xl border border-[#2D2D2D]">
                  <div className="flex items-center gap-2 mb-4">
                    <Crown className="w-5 h-5 text-[#D8C780]" />
                    <h3 className="text-white font-bold">Herramientas PRO</h3>
                  </div>
                  {!isPro ? (
                    <div className="text-center py-8 text-[#C1C1C1] text-sm">
                      Actualiza a PRO.
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="border border-[#2D2D2D] rounded-lg mb-2 p-3">
                        <p className="text-xs text-[#C1C1C1] mb-2">
                          Género (Define estructura):
                        </p>
                        <div className="flex gap-2">
                          {[
                            { id: "masculine", n: "Hombre" },
                            { id: "feminine", n: "Mujer" },
                            { id: "couple", n: "Pareja" },
                            { id: "animal", n: "Animal" },
                          ].map((g) => (
                            <button
                              key={g.id}
                              type="button"
                              onClick={() => setGender(g.id)}
                              className={`flex-1 py-1 text-xs rounded ${
                                gender === g.id
                                  ? "bg-[#D8C780] text-black"
                                  : "bg-[#2D2D2D] text-[#C1C1C1]"
                              }`}
                            >
                              {g.n}
                            </button>
                          ))}
                        </div>
                      </div>
                      {renderProSection("Entornos", "env", ENVIRONMENTS_ARRAY)}
                      {renderProSection("Planos", "shot", SHOT_TYPES, "nameES")}
                      {renderProSection(
                        "Ángulos",
                        "angle",
                        CAMERA_ANGLES,
                        "nameES"
                      )}
                      {renderProSection(
                        "Iluminación",
                        "light",
                        LIGHTING_SETUPS
                      )}
                      {renderProSection(
                        "Estilo Color",
                        "color",
                        COLOR_GRADING_FILTERS
                      )}
                      {renderProSection(
                        "Poses",
                        "pose",
                        getPosesByGender(gender) || []
                      )}
                      {renderProSection(
                        "Vestuario",
                        "outfit",
                        (gender === "feminine" ? Outfits_women : Outfits_men) ||
                          []
                      )}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-center pt-4">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-8 py-3 bg-gradient-to-r from-[#D8C780] to-[#B8A760] text-black font-bold rounded-lg hover:shadow-[0_0_20px_rgba(216,199,128,0.3)] transition-all flex items-center gap-2"
                >
                  {isLoading ? (
                    <Loader2 className="animate-spin" />
                  ) : (
                    <Sparkles />
                  )}
                  Generar Prompt Mejorado
                </button>
              </div>
            </form>

            {(detailedPrompt || compactPrompt) && (
              <AnimatedSection className="mt-12 border-t border-[#2D2D2D] pt-12">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="text-xl font-bold text-[#D8C780]">
                        Prompt Detallado (8 Líneas)
                      </h3>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(detailedPrompt);
                          setCopiedDetailed(true);
                          setTimeout(() => setCopiedDetailed(false), 2000);
                        }}
                        className="p-2 bg-[#2D2D2D] rounded text-[#D8C780]"
                      >
                        {copiedDetailed ? (
                          <Check className="w-4 h-4" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                    <div className="p-4 bg-[#06060C] border border-[#D8C780]/50 rounded-lg text-[#C1C1C1] text-sm whitespace-pre-wrap leading-relaxed h-96 overflow-y-auto font-mono">
                      {detailedPrompt}
                    </div>
                    {compactPrompt && (
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(compactPrompt);
                          setCopiedCompact(true);
                          setTimeout(() => setCopiedCompact(false), 2000);
                        }}
                        className="w-full flex items-center justify-center gap-2 py-3 border border-[#2D2D2D] rounded-lg text-[#C1C1C1] hover:border-[#D8C780] transition-all"
                      >
                        {copiedCompact ? (
                          <Check className="w-4 h-4" />
                        ) : (
                          <FileText className="w-4 h-4" />
                        )}
                        Copiar Prompt Compacto
                      </button>
                    )}
                  </div>

                  <div className="bg-[#06060C] border border-[#2D2D2D] rounded-xl p-6">
                    <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                      <ImageIcon className="w-5 h-5 text-[#D8C780]" /> Generar
                      Imagen
                    </h3>
                    {!isPro ? (
                      <div className="text-center text-sm text-red-400">
                        Solo usuarios PRO
                      </div>
                    ) : (
                      <div className="space-y-6">
                        <div className="flex justify-center gap-4">
                          {gender === "couple" || gender === "animal" ? (
                            <>
                              <SelfieUploader
                                label="Sujeto 1 / Persona"
                                onFileChange={handleFaceChange(0)}
                                currentPreview={facePreviews[0]}
                                onRemove={() => {
                                  const n = [...faceImages];
                                  n[0] = null;
                                  setFaceImages(n);
                                  const p = [...facePreviews];
                                  p[0] = null;
                                  setFacePreviews(p);
                                }}
                              />
                              <SelfieUploader
                                label="Sujeto 2 / Animal"
                                onFileChange={handleFaceChange(1)}
                                currentPreview={facePreviews[1]}
                                onRemove={() => {
                                  const n = [...faceImages];
                                  n[1] = null;
                                  setFaceImages(n);
                                  const p = [...facePreviews];
                                  p[1] = null;
                                  setFacePreviews(p);
                                }}
                              />
                            </>
                          ) : (
                            <SelfieUploader
                              label="Tu Selfie (Opcional)"
                              onFileChange={handleFaceChange(0)}
                              currentPreview={facePreviews[0]}
                              onRemove={() => {
                                const n = [...faceImages];
                                n[0] = null;
                                setFaceImages(n);
                                const p = [...facePreviews];
                                p[0] = null;
                                setFacePreviews(p);
                              }}
                            />
                          )}
                        </div>
                        <button
                          onClick={handleGenerateImage}
                          disabled={isGeneratingImage}
                          className="w-full py-3 bg-[#D8C780] text-black font-bold rounded hover:bg-[#B8A760] transition-colors flex justify-center items-center gap-2"
                        >
                          {isGeneratingImage ? (
                            <Loader2 className="animate-spin" />
                          ) : (
                            <ImageIcon />
                          )}
                          Generar Imagen (1 crédito)
                        </button>
                      </div>
                    )}
                    {generatedImages.length > 0 && (
                      <div className="mt-6 space-y-4">
                        {generatedImages.map((img, i) => (
                          <div key={i} className="relative group">
                            <img
                              src={`data:${img.mimeType};base64,${img.base64}`}
                              className="w-full rounded-lg border border-[#2D2D2D]"
                            />
                            <a
                              href={`data:${img.mimeType};base64,${img.base64}`}
                              download="imagen_ia.png"
                              className="absolute bottom-2 right-2 bg-black/70 text-white p-2 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <Download className="w-4 h-4" />
                            </a>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </AnimatedSection>
            )}
          </AnimatedSection>
        )}
      </div>
    </div>
  );
}
