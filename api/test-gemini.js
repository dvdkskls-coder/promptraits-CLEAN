export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Solo GET' });
  }

  try {
    const API_KEY = process.env.GEMINI_API_KEY;
    
    if (!API_KEY) {
      return res.status(500).json({ error: 'API key no configurada' });
    }

    // Hacer petición directa a la API
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: "Genera un prompt de fotografía profesional"
            }]
          }]
        })
      }
    );

    const data = await response.json();
    
    if (!response.ok) {
      console.error('Error de API:', data);
      return res.status(response.status).json({ 
        error: 'Error de Gemini API',
        details: data 
      });
    }

    const text = data.candidates[0].content.parts[0].text;
    return res.status(200).json({ success: true, text });

  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ 
      error: error.message,
      stack: error.stack 
    });
  }
}