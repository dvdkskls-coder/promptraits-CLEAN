import { GoogleGenerativeAI } from "@google/generative-ai";

// Inicializar Gemini API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/**
 * Genera y optimiza un prompt fotográfico profesional
 * LÍMITE: 1000-1800 caracteres (óptimo: 1200-1600)
 */
export async function generateAndOptimizePrompt(basePrompt) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

    // ============================================
    // PROMPT PARA GEMINI CON ANÁLISIS AUTOMÁTICO
    // LÍMITE ACTUALIZADO: 1000-1800 CARACTERES
    // ============================================
    const systemPrompt = `
You are an expert AI prompt engineer specialized in creating professional photography prompts.

TASK: Analyze and optimize the following photography prompt to achieve a score of 9.5-10.0/10.

BASE PROMPT TO OPTIMIZE:
"${basePrompt}"

OPTIMIZATION REQUIREMENTS:

1. MAINTAIN CRITICAL ELEMENTS (DO NOT CHANGE):
   - Shot type and framing (if specified, it MUST stay exactly as written 3 times)
   - Gender characteristics (if specified)
   - Selected outfit details (if specified)
   - Lighting setup (if specified)
   - Environment/location (if specified)

2. ENHANCE WITH PROFESSIONAL DETAILS (BE CONCISE):
   - Add specific camera equipment (Canon EOS R5, Sony A7R V)
   - Add precise lens specifications (85mm f/1.4, 50mm f/1.2)
   - Add key camera settings (ISO, aperture - be selective)
   - Add professional photography terminology
   - Add quality markers (8K, ultra-sharp, commercial grade)
   - Add color grading details (concise)
   - Add professional post-processing terms (essential only)

3. ENSURE TECHNICAL EXCELLENCE:
   - Use precise, professional language
   - Be CONCISE - every word must add value
   - No redundancy or repetition
   - Focus on visual impact descriptors
   - Prioritize composition and lighting over excessive tech specs

4. CRITICAL CONSTRAINTS:
   - Final prompt MUST be between 1000-1800 characters (STRICT LIMIT)
   - Optimal range: 1200-1600 characters
   - Shot type MUST appear exactly 3 times if originally specified
   - All user-selected options MUST be preserved
   - QUALITY over quantity - be concise but complete

5. OUTPUT FORMAT:
   Return ONLY the optimized prompt as plain text, no explanations, no markdown, no additional commentary.

IMPORTANT: The optimized prompt should sound like a professional photographer's concise but detailed brief. Every word counts. NO redundancy.

Generate the optimized prompt now (1000-1800 chars):`;

    // Generar respuesta
    const result = await model.generateContent(systemPrompt);
    const response = await result.response;
    let optimizedPrompt = response.text().trim();

    // Limpiar cualquier markdown o formato extra
    optimizedPrompt = optimizedPrompt
      .replace(/```/g, '')
      .replace(/\*\*/g, '')
      .replace(/\n\n+/g, ' ')
      .trim();

    // Asegurar límite de 1000-1800 caracteres
    if (optimizedPrompt.length > 1800) {
      optimizedPrompt = truncatePromptSafely(optimizedPrompt, 1800);
    }

    // Asegurar mínimo de 1000 caracteres
    if (optimizedPrompt.length < 1000) {
      console.warn(`Prompt demasiado corto: ${optimizedPrompt.length} chars. Se mantendrá el prompt original.`);
    }

    // Calcular score estimado
    const score = calculateFinalScore(optimizedPrompt);

    return {
      success: true,
      optimizedPrompt,
      score,
      characterCount: optimizedPrompt.length,
      originalLength: basePrompt.length,
    };
  } catch (error) {
    console.error("Error in generateAndOptimizePrompt:", error);
    return {
      success: false,
      error: error.message,
      optimizedPrompt: basePrompt, // Fallback al prompt original
    };
  }
}

/**
 * Analiza una imagen de referencia en detalle extremo
 */
export async function analyzeReferenceImage(imageBase64) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro-vision" });

    const analysisPrompt = `
Analyze this reference image in EXTREME detail for AI image generation. Describe EVERY visible aspect:

1. SUBJECT DETAILS:
   - Gender, age range, ethnicity
   - Facial features, expression, gaze direction
   - Body posture, positioning
   - Visible skin tones, textures

2. CLOTHING & STYLING:
   - Every garment in extreme detail
   - Colors (exact shades), materials, textures
   - Fit, cut, style details
   - Accessories, jewelry
   - Hair style and color
   - Makeup details

3. SHOT COMPOSITION:
   - Exact framing (headshot, medium, full body)
   - Camera angle (eye level, high angle, low angle)
   - Subject positioning in frame
   - Perspective and depth

4. LIGHTING ANALYSIS:
   - Light direction and quality
   - Shadow characteristics
   - Highlight and contrast levels
   - Color temperature
   - Light modifiers visible or implied

5. ENVIRONMENT:
   - Background details
   - Setting/location type
   - Props or objects visible
   - Spatial depth
   - Architectural elements

6. TECHNICAL ASPECTS:
   - Apparent focal length
   - Depth of field
   - Image sharpness
   - Color grading style
   - Post-processing effects

7. MOOD & AESTHETIC:
   - Overall emotional tone
   - Artistic style
   - Professional quality markers
   - Genre (editorial, commercial, artistic)

Be EXTREMELY DETAILED and SPECIFIC. This analysis will be used to create highly accurate AI prompts.`;

    const imagePart = {
      inlineData: {
        data: imageBase64,
        mimeType: "image/jpeg", // o image/png según corresponda
      },
    };

    const result = await model.generateContent([analysisPrompt, imagePart]);
    const response = await result.response;
    const analysis = response.text();

    return {
      success: true,
      analysis,
    };
  } catch (error) {
    console.error("Error in analyzeReferenceImage:", error);
    return {
      success: false,
      error: error.message,
    };
  }
}

/**
 * Calcula el score final del prompt optimizado
 * Rango óptimo: 1000-1800 caracteres (ACTUALIZADO)
 */
function calculateFinalScore(prompt) {
  let score = 5.0;

  // Longitud óptima (1000-1800 caracteres) - AJUSTADO
  if (prompt.length >= 1200 && prompt.length <= 1600) {
    score += 3.0; // Rango perfecto (1200-1600)
  } else if (prompt.length >= 1000 && prompt.length <= 1800) {
    score += 2.5; // Rango aceptable (1000-1800)
  } else if (prompt.length >= 800 && prompt.length <= 2000) {
    score += 1.5; // Rango tolerante
  } else if (prompt.length >= 500) {
    score += 0.5; // Rango mínimo
  }

  // Contiene shot type/framing
  if (prompt.includes('shot') || prompt.includes('framing') || prompt.includes('composition')) {
    score += 0.5;
  }

  // Contiene especificaciones técnicas
  if (prompt.includes('mm') || prompt.includes('f/') || prompt.includes('ISO')) {
    score += 0.5;
  }

  // Contiene iluminación detallada
  if (prompt.includes('lighting') || prompt.includes('light') || prompt.includes('shadows')) {
    score += 0.5;
  }

  // Contiene marcadores de calidad
  if (prompt.includes('8K') || prompt.includes('ultra') || prompt.includes('professional') || prompt.includes('sharp')) {
    score += 0.5;
  }

  // Cap máximo en 10.0
  return Math.min(score, 10.0);
}

/**
 * Trunca el prompt de forma segura sin cortar palabras
 * LÍMITE ACTUALIZADO: 1800 caracteres máximo
 */
function truncatePromptSafely(text, maxLength = 1800) {
  if (text.length <= maxLength) return text;

  // Truncar en el último espacio antes del límite
  let truncated = text.substring(0, maxLength);
  const lastSpace = truncated.lastIndexOf(' ');
  
  if (lastSpace > 0) {
    truncated = truncated.substring(0, lastSpace);
  }

  return truncated.trim();
}

export default {
  generateAndOptimizePrompt,
  analyzeReferenceImage,
};
