export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  
  try {
    const API_KEY = process.env.GEMINI_API_KEY;
    
    if (!API_KEY) {
      return res.status(500).json({ error: 'API key no configurada' });
    }

    // Listar modelos disponibles en v1
    const responseV1 = await fetch(
      `https://generativelanguage.googleapis.com/v1/models?key=${API_KEY}`
    );
    const dataV1 = await responseV1.json();

    // Listar modelos disponibles en v1beta
    const responseV1Beta = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models?key=${API_KEY}`
    );
    const dataV1Beta = await responseV1Beta.json();

    return res.status(200).json({ 
      v1: dataV1,
      v1beta: dataV1Beta
    });

  } catch (error) {
    return res.status(500).json({ 
      error: error.message 
    });
  }
}