import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';
import { buffer } from 'micro';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

// ← CRÍTICO: Configuración de Vercel
export const config = {
  api: {
    bodyParser: false, // Desactivar para leer raw body
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  let event;

  try {
    // Leer el body raw usando micro/buffer
    const buf = await buffer(req);
    const sig = req.headers['stripe-signature'];

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🔐 Verificando firma del webhook...');
    console.log('📦 Body length:', buf.length);
    console.log('✍️  Signature:', sig ? 'presente' : 'FALTA');
    console.log('🔑 Webhook secret:', webhookSecret ? 'configurado' : 'FALTA');

    if (!sig) {
      console.error('❌ Falta header stripe-signature');
      return res.status(400).json({ error: 'Missing stripe-signature header' });
    }

    if (!webhookSecret) {
      console.error('❌ STRIPE_WEBHOOK_SECRET no está configurado');
      return res.status(500).json({ error: 'Webhook secret not configured' });
    }

    // Verificar firma
    event = stripe.webhooks.constructEvent(buf, sig, webhookSecret);
    
    console.log('✅ Firma verificada correctamente');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  } catch (err) {
    console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.error('❌ ERROR VERIFICANDO WEBHOOK:', err.message);
    console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    return res.status(400).json({ error: `Webhook Error: ${err.message}` });
  }

  console.log('📨 Evento recibido:', event.type);
  console.log('🆔 Event ID:', event.id);

  try {
    switch (event.type) {
      // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
      // PAGO ÚNICO (COMPRA DE CRÉDITOS)
      // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
      case 'checkout.session.completed': {
        const session = event.data.object;
        
        console.log('📦 Session mode:', session.mode);
        console.log('👤 User ID:', session.client_reference_id);
        console.log('🎯 Plan ID:', session.metadata?.planId);

        if (session.mode === 'payment') {
          const userId = session.client_reference_id;
          const planId = session.metadata?.planId;

          if (!userId || !planId) {
            console.error('❌ Faltan datos: userId o planId');
            return res.status(400).json({ error: 'Missing userId or planId' });
          }

          let creditsToAdd = 0;
          if (planId === 'credits-20') creditsToAdd = 20;
          else if (planId === 'credits-50') creditsToAdd = 50;
          else if (planId === 'credits-100') creditsToAdd = 100;

          console.log('💰 Créditos a añadir:', creditsToAdd);

          if (creditsToAdd > 0) {
            const { data: profile, error: fetchError } = await supabase
              .from('profiles')
              .select('credits')
              .eq('id', userId)
              .single();

            if (fetchError) {
              console.error('❌ Error obteniendo perfil:', fetchError);
              return res.status(500).json({ error: fetchError.message });
            }

            const currentCredits = profile?.credits || 0;
            const newCredits = currentCredits + creditsToAdd;

            console.log('📊 Créditos: %d → %d', currentCredits, newCredits);

            const { error: updateError } = await supabase
              .from('profiles')
              .update({ credits: newCredits })
              .eq('id', userId);

            if (updateError) {
              console.error('❌ Error actualizando créditos:', updateError);
              return res.status(500).json({ error: updateError.message });
            }

            console.log('✅ Créditos actualizados correctamente');
          }
        }
        break;
      }

      // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
      // SUSCRIPCIÓN CREADA/ACTUALIZADA
      // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
      case 'customer.subscription.created':
      case 'customer.subscription.updated': {
        const subscription = event.data.object;
        const customerId = subscription.customer;

        console.log('📅 Procesando suscripción...');

        const customer = await stripe.customers.retrieve(customerId);
        const email = customer.email;

        console.log('📧 Email:', email);

        const { data: userData, error: userError } = await supabase
          .from('profiles')
          .select('id, credits')
          .eq('email', email)
          .single();

        if (userError || !userData) {
          console.error('❌ Usuario no encontrado');
          return res.status(404).json({ error: 'User not found' });
        }

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

        const currentCredits = userData.credits || 0;
        const newCredits = currentCredits + creditsToAdd;

        console.log('📊 Plan: %s | Créditos: %d → %d', newPlan, currentCredits, newCredits);

        const { error: updateError } = await supabase
          .from('profiles')
          .update({
            plan: newPlan,
            credits: newCredits,
            subscription_id: subscription.id,
            subscription_status: subscription.status,
          })
          .eq('id', userData.id);

        if (updateError) {
          console.error('❌ Error actualizando suscripción:', updateError);
          return res.status(500).json({ error: updateError.message });
        }

        console.log('✅ Suscripción actualizada correctamente');
        break;
      }

      // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
      // SUSCRIPCIÓN CANCELADA
      // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
      case 'customer.subscription.deleted': {
        const subscription = event.data.object;

        console.log('🚫 Cancelando suscripción:', subscription.id);

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

          console.log('✅ Plan revertido a FREE');
        }
        break;
      }

      default:
        console.log('ℹ️ Evento no manejado:', event.type);
    }

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('✅ Webhook procesado correctamente');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    res.json({ received: true });
  } catch (error) {
    console.error('❌ Error procesando webhook:', error);
    res.status(500).json({ error: error.message });
  }
}