// filepath: api/generate-prompt.js
import { GoogleGenerativeAI } from '@google/generative-ai';
import { createClient } from '@supabase/supabase-js';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

export default async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { userId, theme, style, details } = req.body;

    console.log(' Generando prompt con Gemini:', { userId, theme, style });

    // Validar
    if (!userId || !theme) {
      return res.status(400).json({ error: 'userId y theme son requeridos' });
    }

    // Verificar créditos
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('credits')
      .eq('id', userId)
      .single();

    if (profileError) {
      console.error('? Error al obtener perfil:', profileError);
      return res.status(500).json({ error: 'Error al verificar créditos' });
    }

    if (!profile || profile.credits < 1) {
      return res.status(403).json({ 
        error: 'Créditos insuficientes',
        creditsAvailable: profile?.credits || 0 
      });
    }

    console.log(' Créditos disponibles:', profile.credits);

    // Llamar a Gemini
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });

    const systemPrompt = `Eres un experto en generación de prompts para DALL-E 3 y Midjourney.

REGLAS:
- El prompt debe ser en INGLÉS
- Máximo 200 palabras
- Muy descriptivo y visual
- Incluir detalles de iluminación, composición, atmósfera
- Si se especifica estilo, inclúyelo
- Formato directo (sin explicaciones)

GENERA UN PROMPT PERFECTO BASADO EN:`;

    const userPrompt = `${systemPrompt}

Tema: ${theme}
${style ? `Estilo: ${style}` : ''}
${details ? `Detalles: ${details}` : ''}`;

    console.log(' Llamando a Gemini...');

    const result = await model.generateContent(userPrompt);
    const generatedPrompt = result.response.text().trim();

    console.log('? Prompt generado:', generatedPrompt.substring(0, 100) + '...');

    // Descontar crédito
    const { error: updateError } = await supabase
      .from('profiles')
      .update({ credits: profile.credits - 1 })
      .eq('id', userId);

    if (updateError) {
      console.error(' Error al descontar créditos:', updateError);
    } else {
      console.log(' Crédito descontado. Nuevos créditos:', profile.credits - 1);
    }

    // Guardar en historial (si existe la tabla)
    await supabase
      .from('generated_prompts')
      .insert({
        user_id: userId,
        input_theme: theme,
        input_style: style || null,
        input_details: details || null,
        generated_prompt: generatedPrompt,
        credits_used: 1
      })
      .then(() => console.log('? Guardado en historial'))
      .catch(err => console.log(' No se pudo guardar en historial:', err.message));

    // Responder
    return res.status(200).json({
      success: true,
      prompt: generatedPrompt,
      creditsRemaining: profile.credits - 1
    });

  } catch (error) {
    console.error(' Error en generate-prompt:', error);
    
    return res.status(500).json({ 
      error: error.message || 'Error al generar prompt' 
    });
  }
}