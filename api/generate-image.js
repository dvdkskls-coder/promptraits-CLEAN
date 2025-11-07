// ============================================================================
// GENERATE IMAGE WITH NANO BANANA 🍌
// ============================================================================
// Este endpoint genera imágenes usando Google Imagen 3 con el rostro del usuario
// Endpoint: /api/generate-image
// Método: POST
// ============================================================================

import formidable from "formidable";
import fs from "fs";
import { createClient } from "@supabase/supabase-js";

// Inicializar Supabase
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Configurar formidable
export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  // CORS headers
  res.setHeader("Access-Control-Allow-Credentials", true);
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET,OPTIONS,PATCH,DELETE,POST,PUT"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version"
  );

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método no permitido" });
  }

  try {
    // Parse FormData
    const form = formidable({
      maxFileSize: 10 * 1024 * 1024, // 10MB max
      keepExtensions: true,
    });

    const [fields, files] = await new Promise((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) reject(err);
        resolve([fields, files]);
      });
    });

    const prompt = Array.isArray(fields.prompt)
      ? fields.prompt[0]
      : fields.prompt;
    const aspectRatio = Array.isArray(fields.aspectRatio)
      ? fields.aspectRatio[0]
      : fields.aspectRatio || "1:1";
    const userId = Array.isArray(fields.userId)
      ? fields.userId[0]
      : fields.userId;

    const selfieFile = files.selfieImage
      ? Array.isArray(files.selfieImage)
        ? files.selfieImage[0]
        : files.selfieImage
      : null;

    // Validaciones
    if (!prompt || !prompt.trim()) {
      return res.status(400).json({ error: "El prompt es requerido" });
    }

    if (!userId) {
      return res.status(400).json({ error: "Usuario no identificado" });
    }

    if (!selfieFile) {
      return res
        .status(400)
        .json({
          error: "Debes subir una foto selfie para generar la imagen",
        });
    }

    // Verificar API Key
    const API_KEY = process.env.GEMINI_API_KEY;
    if (!API_KEY) {
      return res.status(500).json({ error: "API key no configurada" });
    }

    // Verificar créditos del usuario
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("credits, plan")
      .eq("id", userId)
      .single();

    if (profileError || !profile) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    if (profile.credits < 1) {
      return res
        .status(402)
        .json({
          error: "Créditos insuficientes",
          creditsNeeded: 1,
          creditsAvailable: profile.credits,
        });
    }

    console.log("🍌 Generando imagen con Nano Banana...");
    console.log("Prompt:", prompt);
    console.log("Aspect Ratio:", aspectRatio);
    console.log("Selfie:", selfieFile.originalFilename);

    // Convertir selfie a base64
    const selfieBuffer = fs.readFileSync(selfieFile.filepath);
    const selfieBase64 = selfieBuffer.toString("base64");
    const selfieMimeType =
      selfieFile.mimetype || "image/jpeg";

    // Mapeo de aspect ratios a dimensiones de Imagen 3
    const aspectRatioMap = {
      "1:1": "square",
      "3:4": "portrait",
      "4:3": "landscape",
      "9:16": "portrait",
      "16:9": "landscape",
    };

    const imageFormat = aspectRatioMap[aspectRatio] || "square";

    // Construir el prompt mejorado que incluye referencia al rostro
    const enhancedPrompt = `${prompt}

IMPORTANT: Use the exact facial features, expression, and appearance from the provided reference photograph. Maintain the person's authentic and natural look without any modifications or alterations.`;

    // Llamar a la API de Google Imagen 3
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/imagen-3.0-generate-002:predict?key=${API_KEY}`;

    const requestBody = {
      instances: [
        {
          prompt: enhancedPrompt,
          referenceImages: [
            {
              image: {
                bytesBase64Encoded: selfieBase64,
              },
              referenceType: "SUBJECT", // Usar el sujeto de la imagen
            },
          ],
        },
      ],
      parameters: {
        sampleCount: 1, // Solo 1 imagen
        aspectRatio: imageFormat,
        safetySetting: "block_some",
        personGeneration: "allow_all", // Permitir generar personas
        outputMimeType: "image/png",
      },
    };

    console.log("Llamando a Imagen 3 API...");

    const imageResponse = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    if (!imageResponse.ok) {
      const errorData = await imageResponse.text();
      console.error("Error de Imagen 3:", errorData);
      return res.status(imageResponse.status).json({
        error: "Error al generar imagen",
        details: errorData,
      });
    }

    const imageData = await imageResponse.json();

    // Verificar que hay imágenes generadas
    if (
      !imageData.predictions ||
      imageData.predictions.length === 0 ||
      !imageData.predictions[0].bytesBase64Encoded
    ) {
      console.error("No se generaron imágenes:", imageData);
      return res.status(500).json({
        error: "No se pudieron generar imágenes",
        details: imageData,
      });
    }

    // Preparar las imágenes para enviar al frontend
    const generatedImages = imageData.predictions.map((pred) => ({
      base64: pred.bytesBase64Encoded,
      mimeType: pred.mimeType || "image/png",
    }));

    // Descontar créditos
    const { error: updateError } = await supabase
      .from("profiles")
      .update({ credits: profile.credits - 1 })
      .eq("id", userId);

    if (updateError) {
      console.error("Error al actualizar créditos:", updateError);
    }

    console.log("✅ Imagen generada exitosamente");
    console.log(`Créditos restantes: ${profile.credits - 1}`);

    // Limpiar archivo temporal
    if (fs.existsSync(selfieFile.filepath)) {
      fs.unlinkSync(selfieFile.filepath);
    }

    return res.status(200).json({
      images: generatedImages,
      creditsUsed: 1,
      creditsRemaining: profile.credits - 1,
    });
  } catch (error) {
    console.error("Error generando imagen:", error);
    return res.status(500).json({
      error: "Error al procesar la solicitud",
      details: error.message,
    });
  }
}
