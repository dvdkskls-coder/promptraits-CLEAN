// filepath: api/generate-prompt.js
import { createClient } from '@supabase/supabase-js';
import Anthropic from '@anthropic-ai/sdk';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export default async function handler(req, res) {
  // CORS headers
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

    console.log(' Generando prompt:', { userId, theme, style });

    // Validar datos
    if (!userId || !theme) {
      return res.status(400).json({ error: 'userId y theme son requeridos' });
    }

    // Verificar créditos del usuario
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('credits')
      .eq('id', userId)
      .single();

    if (profileError) {
      console.error(' Error al obtener perfil:', profileError);
      return res.status(500).json({ error: 'Error al verificar créditos' });
    }

    if (!profile || profile.credits < 1) {
      return res.status(403).json({ 
        error: 'Créditos insuficientes',
        creditsAvailable: profile?.credits || 0 
      });
    }

    console.log(' Créditos disponibles:', profile.credits);

    // Construir prompt para Claude
    const systemPrompt = `Eres un experto en generación de prompts para DALL-E 3 y Midjourney.
Tu tarea es crear prompts detallados, visuales y efectivos basados en las indicaciones del usuario.

Reglas:
- El prompt debe ser en INGLÉS
- Debe ser descriptivo y visual
- Incluir estilo artístico si se especifica
- Incluir detalles de iluminación, composición y atmósfera
- Máximo 200 palabras
- Formato claro y directo (sin explicaciones adicionales)`;

    const userPrompt = `Genera un prompt para imagen basado en:

Tema: ${theme}
${style ? `Estilo artístico: ${style}` : ''}
${details ? `Detalles adicionales: ${details}` : ''}

Crea un prompt detallado y visual que capture perfectamente esta idea.`;

    // Llamar a Claude
    console.log(' Llamando a Claude Sonnet 4...');
    
    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 500,
      temperature: 0.8,
      system: systemPrompt,
      messages: [
        {
          role: 'user',
          content: userPrompt
        }
      ]
    });

    const generatedPrompt = message.content[0].text.trim();
    
    console.log(' Prompt generado:', generatedPrompt.substring(0, 100) + '...');

    // Descontar 1 crédito
    const { error: updateError } = await supabase
      .from('profiles')
      .update({ credits: profile.credits - 1 })
      .eq('id', userId);

    if (updateError) {
      console.error('? Error al descontar créditos:', updateError);
    } else {
      console.log('?? Crédito descontado. Nuevos créditos:', profile.credits - 1);
    }

    // Guardar en historial (tabla generated_prompts debe existir en Supabase)
    const { error: insertError } = await supabase
      .from('generated_prompts')
      .insert({
        user_id: userId,
        input_theme: theme,
        input_style: style || null,
        input_details: details || null,
        generated_prompt: generatedPrompt,
        credits_used: 1
      });

    if (insertError) {
      console.error(' Error al guardar en historial:', insertError);
    }

    // Responder
    return res.status(200).json({
      success: true,
      prompt: generatedPrompt,
      creditsRemaining: profile.credits - 1
    });

  } catch (error) {
    console.error(' Error en generate-prompt:', error);
    
    if (error.status === 429) {
      return res.status(429).json({ 
        error: 'Demasiadas solicitudes. Intenta de nuevo en 1 minuto.' 
      });
    }
    
    if (error.status === 401) {
      return res.status(500).json({ 
        error: 'Error de configuración del servicio' 
      });
    }

    return res.status(500).json({ 
      error: error.message || 'Error al generar prompt' 
    });
  }
}