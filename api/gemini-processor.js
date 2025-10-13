export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  try {
    const { prompt, referenceImage, mimeType } = req.body;

    if (!prompt && !referenceImage) {
      return res.status(400).json({ error: 'Debes proporcionar un prompt o una imagen' });
    }

    const API_KEY = process.env.GEMINI_API_KEY;
    
    if (!API_KEY) {
      console.error('❌ API key no configurada');
      return res.status(500).json({ error: 'API key no configurada' });
    }

    console.log('✅ Procesando con Gemini 2.5 Flash...');

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

    // Usar la API v1 con gemini-2.5-flash
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [{ text: fullPrompt }]
          }]
        })
      }
    );

    const data = await response.json();
    
    if (!response.ok) {
      console.error('❌ Error de Gemini:', data);
      return res.status(response.status).json({ 
        error: 'Error al procesar con Gemini',
        details: data.error?.message || 'Error desconocido'
      });
    }

    const text = data.candidates[0].content.parts[0].text;
    
    console.log('✅ Prompt generado exitosamente');
    return res.status(200).send(text);

  } catch (error) {
    console.error('❌ Error:', error.message);
    
    return res.status(500).json({ 
      error: 'Error al procesar la solicitud',
      details: error.message 
    });
  }
}