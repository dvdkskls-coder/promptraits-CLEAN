export default async function handler(req, res) {
  // CORS simple para previews/local
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  try {
    const API_KEY = process.env.GEMINI_API_KEY;
    if (!API_KEY) return res.status(500).json({ error: 'Falta GEMINI_API_KEY' });

    const body = req.body || {};
    const {
      prompt = '',
      preset = '',
      scenario = '',
      sliders = null,
      referenceImage,     // base64 puro o dataURL
      mimeType = null,
      analyzeQuality = false,
      applySuggestions = false,
      currentPrompt = '',
      suggestions = []
    } = body;

    // Texto de entrada para el modelo (aplicar sugerencias o componer preset+escenario+idea)
    const userIdea = applySuggestions
      ? `${currentPrompt}\n\nMejorar con estas sugerencias:\n- ${[].concat(suggestions || []).join('\n- ')}`
      : [preset, scenario, prompt].filter(Boolean).join(' ').trim();

    // Partes para Gemini
    const parts = [];
    const systemInstruction = [
      'Eres experto en fotografía y prompts. Devuelve UN ÚNICO prompt listo para copiar, en español.',
      'Incluye estilo, iluminación, objetivo (mm), apertura (f/), composición, textura, color y detalles técnicos.',
      'Combina preset/escenario/idea sin redundancias.',
      'Si hay imagen de referencia, úsala como guía (no la describas literalmente).',
      'CRÍTICO: Devuelve solo el prompt final, sin explicaciones.'
    ].join(' ');
    parts.push({ text: `${systemInstruction}\n\nEntrada del usuario:\n${userIdea}` });

    // Imagen opcional
    if (referenceImage) {
      let mt = mimeType;
      let b64 = referenceImage;
      const m = /^data:(image\/[a-zA-Z0-9.+-]+);base64,(.+)$/.exec(referenceImage);
      if (m) { mt = m[1]; b64 = m[2]; }
      if (!mt) mt = 'image/png';
      parts.push({ inlineData: { mimeType: mt, data: b64 } });
    }

    // Llamada REST (Gemini 1.5 flash)
    const url = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=' + encodeURIComponent(API_KEY);
    const r = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type':'application/json' },
      body: JSON.stringify({ contents: [{ role: 'user', parts }] })
    });

    if (!r.ok) {
      const errText = await r.text().catch(()=> '');
      return res.status(r.status).json({ error: 'Gemini error', details: errText });
    }

    const data = await r.json();
    const generatedPrompt = (data?.candidates?.[0]?.content?.parts || [])
      .map(p => p.text || '')
      .join(' ')
      .trim();

    // Análisis de calidad simple (heurístico) – como el backup devolvía un objeto
    let qualityAnalysis = null;
    if (analyzeQuality) {
      const txt = generatedPrompt.toLowerCase();
      const included = [];
      const suggestionsOut = [];

      if (/\b(35|50|85|105|135)\s*mm\b/.test(txt)) included.push('Longitud focal especificada');
      else suggestionsOut.push('Añadir longitud focal (ej. 85mm)');

      if (/f\/\s?(1\.\d|2(\.\d)?|4(\.\d)?)/.test(txt)) included.push('Apertura indicada');
      else suggestionsOut.push('Indicar apertura (ej. f/1.8)');

      if (/(rembrandt|split|butterfly|loop|high-key|low-key|rim light|backlight|contraluz|contra luz)/.test(txt)) included.push('Técnica de iluminación');
      else suggestionsOut.push('Añadir técnica de iluminación (Rembrandt, High-Key, etc.)');

      if (/(regla de los tercios|bokeh|depth of field|profundidad de campo|plano medio|primer plano)/.test(txt)) included.push('Composición y DOF');
      else suggestionsOut.push('Ajustar composición/DOF (regla de los tercios, bokeh)');

      if (/(kodak|portra|cinematic|film grain|analog|cinestill|teal and orange|monocromo|monochrome)/.test(txt)) included.push('Tratamiento/color/film');
      else suggestionsOut.push('Definir look de color o tratamiento (cinematic/film)');

      const score = Math.max(4, Math.min(10, included.length + 5));
      qualityAnalysis = { score, included, suggestions: suggestionsOut };
    }

    return res.status(200).json({ prompt: generatedPrompt || 'No se recibió respuesta del generador.', qualityAnalysis });
  } catch (e) {
    console.error('[gemini-processor] error', e);
    return res.status(500).json({ error: e.message || 'Generator error' });
  }
}
