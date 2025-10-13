// api/gemini-processor.js
import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(req, res) {
  // Configurar CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  // Manejar preflight
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Solo acepta POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  try {
    const { prompt, referenceImage, mimeType } = req.body;

    // Validación básica
    if (!prompt && !referenceImage) {
      return res.status(400).json({ error: 'Debes proporcionar un prompt o una imagen' });
    }

    // Verificar que la API key existe
    if (!process.env.GEMINI_API_KEY) {
      console.error('❌ GEMINI_API_KEY no está configurada');
      return res.status(500).json({ error: 'API key no configurada en el servidor' });
    }

    // Inicializa Gemini
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    let result;

    if (referenceImage) {
      // Procesar con imagen
      const imageParts = [
        {
          inlineData: {
            data: referenceImage,
            mimeType: mimeType || "image/jpeg"
          }
        }
      ];

      const promptText = prompt || "Analiza esta imagen y genera un prompt detallado para recrear un retrato similar con IA, incluyendo iluminación, composición, estilo fotográfico y ajustes técnicos profesionales.";
      
      result = await model.generateContent([promptText, ...imageParts]);
    } else {
      // Solo texto
      const fullPrompt = `Eres un experto en fotografía profesional y prompts para IA generativa de retratos. 

El usuario quiere: ${prompt}

Genera un prompt técnico ultra-detallado para crear un retrato profesional que DEBE incluir:

1. **Descripción del sujeto y escena**: Pose, expresión, vestuario, ambiente
2. **Iluminación específica**: Tipo de luz (softbox, natural, etc.), ángulo (45°, cenital, etc.), temperatura de color (5200K, 3200K, etc.), contraste y ratio de iluminación
3. **Configuración de cámara**: Sensor (full-frame), focal (85mm, 50mm, etc.), apertura (f/1.4, f/2.8), velocidad de obturación, ISO, distancia al sujeto
4. **Composición y encuadre**: Plano (medio, primer plano), orientación (vertical 9:16, horizontal), regla de tercios, profundidad de campo
5. **Post-procesamiento**: Grading de color, contraste, grain cinematográfico, LUTs
6. **Keywords técnicos**: Ultra-realistic, cinematic, HDR, professional photography, etc.

El prompt debe ser preciso, profesional y listo para usar en Gemini Imagen 3, Midjourney o DALL-E. Escribe SOLO el prompt final, sin explicaciones adicionales.`;

      result = await model.generateContent(fullPrompt);
    }

    const response = await result.response;
    const text = response.text();

    // Enviar como texto plano
    return res.status(200).send(text);

  } catch (error) {
    console.error('❌ Error en Gemini:', error);
    return res.status(500).json({ 
      error: 'Error al procesar la solicitud con Gemini',
      details: error.message 
    });
  }
}