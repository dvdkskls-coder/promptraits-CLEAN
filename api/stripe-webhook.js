import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

// Configuración para Vercel
export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Leer el body raw como chunks
  const chunks = [];
  for await (const chunk of req) {
    chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
  }
  const body = Buffer.concat(chunks);
  const signature = req.headers['stripe-signature'];

  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('🔐 Verificando webhook...');
  console.log('📦 Body length:', body.length);
  console.log('✍️  Signature:', signature ? 'presente' : '❌ FALTA');
  console.log('🔑 Secret configurado:', webhookSecret ? 'SÍ' : '❌ NO');

  // Validaciones previas
  if (!signature) {
    console.error('❌ Falta header stripe-signature');
    return res.status(400).json({ error: 'Missing stripe-signature' });
  }

  if (!webhookSecret) {
    console.error('❌ STRIPE_WEBHOOK_SECRET no configurado');
    return res.status(500).json({ error: 'Webhook secret not configured' });
  }

  let event;

  try {
    // Construir evento verificando firma
    event = stripe.webhooks.constructEvent(
      body.toString('utf8'), // ← Convertir a string UTF-8
      signature,
      webhookSecret
    );

    console.log('✅ Firma verificada OK');
    console.log('📨 Evento:', event.type);
    console.log('🆔 ID:', event.id);
  } catch (err) {
    console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.error('❌ ERROR EN VERIFICACIÓN:', err.message);
    console.error('🔍 Tipo de error:', err.type);
    console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    return res.status(400).json({ 
      error: `Webhook verification failed: ${err.message}` 
    });
  }

  // Procesar eventos
  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;

        console.log('💳 Checkout completado');
        console.log('   Mode:', session.mode);
        console.log('   User ID:', session.client_reference_id);
        console.log('   Plan ID:', session.metadata?.planId);

        if (session.mode === 'payment') {
          const userId = session.client_reference_id;
          const planId = session.metadata?.planId;

          if (!userId || !planId) {
            console.error('❌ Faltan metadatos');
            return res.status(400).json({ error: 'Missing metadata' });
          }

          // Determinar créditos
          let creditsToAdd = 0;
          if (planId === 'credits-20') creditsToAdd = 20;
          else if (planId === 'credits-50') creditsToAdd = 50;
          else if (planId === 'credits-100') creditsToAdd = 100;

          if (creditsToAdd === 0) {
            console.error('❌ planId desconocido:', planId);
            return res.status(400).json({ error: 'Unknown plan' });
          }

          console.log('💰 Añadiendo', creditsToAdd, 'créditos');

          // Obtener créditos actuales
          const { data: profile, error: fetchError } = await supabase
            .from('profiles')
            .select('credits')
            .eq('id', userId)
            .single();

          if (fetchError) {
            console.error('❌ Error fetch:', fetchError);
            return res.status(500).json({ error: fetchError.message });
          }

          const currentCredits = profile?.credits || 0;
          const newCredits = currentCredits + creditsToAdd;

          console.log('📊 Créditos:', currentCredits, '→', newCredits);

          // Actualizar
          const { error: updateError } = await supabase
            .from('profiles')
            .update({ credits: newCredits })
            .eq('id', userId);

          if (updateError) {
            console.error('❌ Error update:', updateError);
            return res.status(500).json({ error: updateError.message });
          }

          console.log('✅ CRÉDITOS ACTUALIZADOS');
        }
        break;
      }

      case 'customer.subscription.created':
      case 'customer.subscription.updated': {
        const subscription = event.data.object;
        const customerId = subscription.customer;

        console.log('📅 Procesando suscripción...');

        const customer = await stripe.customers.retrieve(customerId);
        const email = customer.email;

        console.log('📧 Email:', email);

        // Buscar usuario por email
        const { data: userData, error: userError } = await supabase
          .from('profiles')
          .select('id, credits, plan')
          .eq('email', email)
          .single();

        if (userError || !userData) {
          console.error('❌ Usuario no encontrado para email:', email);
          return res.status(404).json({ error: 'User not found' });
        }

        console.log('👤 Usuario encontrado:', userData.id);
        console.log('📊 Plan actual:', userData.plan);
        console.log('💰 Créditos actuales:', userData.credits);

        const priceId = subscription.items.data[0].price.id;
        let newPlan = 'free';
        let creditsToAdd = 0;

        if (priceId === 'price_1SIP64IO8cBGyY9CC4BtGdhN') {
          newPlan = 'pro';
          creditsToAdd = 60;
        } else if (priceId === 'price_1SIP6tIO8cBGyY9CyiW8Qwd0') {
          newPlan = 'premium';
          creditsToAdd = 300;
        }

        // IMPORTANTE: Sumar créditos, NO reemplazar
        const currentCredits = userData.credits || 0;
        const newCredits = currentCredits + creditsToAdd;

        console.log('🎯 Nuevo plan:', newPlan);
        console.log('📊 Créditos: %d + %d = %d', currentCredits, creditsToAdd, newCredits);

        const { data: updateData, error: updateError } = await supabase
          .from('profiles')
          .update({
            plan: newPlan,
            credits: newCredits, // ← SUMAR, no reemplazar
            subscription_id: subscription.id,
            subscription_status: subscription.status,
          })
          .eq('id', userData.id)
          .select();

        if (updateError) {
          console.error('❌ Error actualizando suscripción:', updateError);
          return res.status(500).json({ error: updateError.message });
        }

        console.log('✅ Suscripción actualizada correctamente');
        console.log('📄 Datos actualizados:', updateData);
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object;

        console.log('🚫 Cancelación:', subscription.id);

        const { data: profile } = await supabase
          .from('profiles')
          .select('id')
          .eq('subscription_id', subscription.id)
          .single();

        if (profile) {
          await supabase
            .from('profiles')
            .update({
              plan: 'free',
              subscription_id: null,
              subscription_status: 'canceled',
            })
            .eq('id', profile.id);

          console.log('✅ PLAN REVERTIDO A FREE');
        }
        break;
      }

      default:
        console.log('ℹ️ Evento no manejado:', event.type);
    }

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('✅ WEBHOOK PROCESADO');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    return res.status(200).json({ received: true });
  } catch (error) {
    console.error('❌ Error procesando:', error);
    return res.status(500).json({ error: error.message });
  }
}