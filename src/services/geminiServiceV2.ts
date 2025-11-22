// src/services/geminiServiceV2.ts

import { GoogleGenAI, Modality, type Content } from "@google/genai";
import type {
  ImageFile,
  AspectRatio,
  GenerationOptions,
} from "../types/promptTypes";
import { SHOT_TYPES, CAMERA_ANGLES } from "../constants/promptConstants";
import { ENVIRONMENTS_ARRAY } from "../data/environments";
import { LIGHTING_SETUPS } from "../data/lighting";
import { COLOR_GRADING_FILTERS } from "../data/colorGrading";

const getAiClient = () => {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error(
      "API Key not found. Please ensure 'VITE_GEMINI_API_KEY' is set in your .env file"
    );
  }
  return new GoogleGenAI({ apiKey });
};

const SYSTEM_INSTRUCTION = `You are a professional photography prompt engineer specialized in creating detailed, cinematic prompts for AI image generation.

Your task is to transform simple ideas into professional, detailed photography prompts that include:
- Shot type and camera angle
- Lighting setup and mood
- Color grading and post-processing
- Environment and setting details
- Outfit and styling
- Pose and expression
- Technical camera details

Available options:
- Shot Types: ${SHOT_TYPES.join(", ")}
- Camera Angles: ${CAMERA_ANGLES.join(", ")}
- Environments: ${ENVIRONMENTS_ARRAY.join(", ")}
- Lighting: ${LIGHTING_SETUPS.map((l) => l.name).join(", ")}
- Color Grading: ${COLOR_GRADING_FILTERS.map((c) => c.name).join(", ")}

Generate prompts that are:
1. Technically accurate with real camera equipment
2. Professionally structured
3. Rich in visual details
4. Optimized for AI image generation
5. In English, regardless of input language

Return ONLY the prompt text, no explanations or additional text.`;

export const generateProfessionalPrompt = async (
  options: GenerationOptions
): Promise<string> => {
  const ai = getAiClient();
  const model = ai.getGenerativeModel({
    model: "gemini-2.0-flash-exp",
    systemInstruction: SYSTEM_INSTRUCTION,
  });

  let userPrompt = `Generate a professional photography prompt based on this idea: "${options.idea}"`;

  if (options.shotType) userPrompt += `\nShot Type: ${options.shotType}`;
  if (options.cameraAngle)
    userPrompt += `\nCamera Angle: ${options.cameraAngle}`;
  if (options.environment)
    userPrompt += `\nEnvironment: ${options.environment}`;
  if (options.lighting) userPrompt += `\nLighting: ${options.lighting}`;
  if (options.colorGrading)
    userPrompt += `\nColor Grading: ${options.colorGrading}`;
  if (options.outfit) userPrompt += `\nOutfit: ${options.outfit}`;
  if (options.pose) userPrompt += `\nPose: ${options.pose}`;
  if (options.gender) userPrompt += `\nGender context: ${options.gender}`;

  const result = await model.generateContent(userPrompt);
  return result.response.text();
};

export const generateImageGeminiPro = async (
  prompt: string,
  faceImages: ImageFile[],
  aspectRatio: AspectRatio = "1:1"
): Promise<ImageFile> => {
  const ai = getAiClient();

  const model = ai.getGenerativeModel({
    model: "imagen-3.0-generate-001",
  });

  const contentParts: Content["parts"] = [];

  if (faceImages && faceImages.length > 0) {
    faceImages.forEach((img) => {
      contentParts.push({
        inlineData: {
          mimeType: img.mimeType,
          data: img.data,
        },
      });
    });
  }

  contentParts.push({ text: prompt });

  const result = await model.generateContent({
    contents: [{ role: "user", parts: contentParts }],
    generationConfig: {
      responseModalities: [Modality.IMAGE],
      outputMimeType: "image/jpeg",
      ...(aspectRatio && { aspectRatio }),
    },
  });

  const imagePart = result.response.candidates?.[0]?.content?.parts?.find(
    (part) => part.inlineData
  );

  if (!imagePart?.inlineData) {
    throw new Error("No se generó ninguna imagen");
  }

  return {
    name: `generated-${Date.now()}.jpg`,
    mimeType: imagePart.inlineData.mimeType || "image/jpeg",
    data: imagePart.inlineData.data || "",
  };
};

export const editImage = async (
  baseImage: ImageFile,
  maskImage: ImageFile | null,
  editInstruction: string
): Promise<ImageFile> => {
  const ai = getAiClient();
  const model = ai.getGenerativeModel({
    model: "imagen-3.0-generate-001",
  });

  const contentParts: Content["parts"] = [
    {
      inlineData: {
        mimeType: baseImage.mimeType,
        data: baseImage.data,
      },
    },
  ];

  if (maskImage) {
    contentParts.push({
      inlineData: {
        mimeType: maskImage.mimeType,
        data: maskImage.data,
      },
    });
  }

  contentParts.push({ text: editInstruction });

  const result = await model.generateContent({
    contents: [{ role: "user", parts: contentParts }],
    generationConfig: {
      responseModalities: [Modality.IMAGE],
      outputMimeType: "image/jpeg",
    },
  });

  const imagePart = result.response.candidates?.[0]?.content?.parts?.find(
    (part) => part.inlineData
  );

  if (!imagePart?.inlineData) {
    throw new Error("No se pudo editar la imagen");
  }

  return {
    name: `edited-${Date.now()}.jpg`,
    mimeType: imagePart.inlineData.mimeType || "image/jpeg",
    data: imagePart.inlineData.data || "",
  };
};

export const summarizePromptForPlatforms = async (
  prompt: string
): Promise<{ instagram: string; twitter: string; linkedin: string }> => {
  const ai = getAiClient();
  const model = ai.getGenerativeModel({
    model: "gemini-2.0-flash-exp",
  });

  const systemInstruction = `You are a social media expert. Given a photography prompt, create platform-specific summaries:
- Instagram: Casual, engaging, use emojis, 2-3 sentences max
- Twitter: Concise, punchy, 1-2 sentences, no emojis
- LinkedIn: Professional, technical, 2-3 sentences

Return your response in this exact JSON format:
{
  "instagram": "...",
  "twitter": "...",
  "linkedin": "..."
}`;

  const result = await model.generateContent({
    contents: [
      { role: "user", parts: [{ text: systemInstruction }] },
      { role: "user", parts: [{ text: `Prompt: ${prompt}` }] },
    ],
  });

  const responseText = result.response.text();
  const jsonMatch = responseText.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error("No se pudo generar el resumen");
  }

  return JSON.parse(jsonMatch[0]);
};

export const downloadImage = (imageFile: ImageFile) => {
  const link = document.createElement("a");
  link.href = `data:${imageFile.mimeType};base64,${imageFile.data}`;
  link.download = imageFile.name;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
