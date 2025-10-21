import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY // ← Necesitarás esta clave
);

// Webhook secret (lo obtendremos de Stripe)
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

export const config = {
  api: {
    bodyParser: false, // Importante: desactivar para verificar firma
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const buf = await buffer(req);
  const sig = req.headers['stripe-signature'];

  let event;

  try {
    // Verificar que el webhook venga de Stripe
    event = stripe.webhooks.constructEvent(buf, sig, webhookSecret);
  } catch (err) {
    console.error('❌ Error verificando webhook:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  console.log('✅ Evento recibido:', event.type);

  // Manejar diferentes tipos de eventos
  try {
    switch (event.type) {
      // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
      // PAGO ÚNICO (COMPRA DE CRÉDITOS)
      // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
      case 'checkout.session.completed': {
        const session = event.data.object;
        
        // Solo procesar si es pago único (no suscripción)
        if (session.mode === 'payment') {
          const userId = session.client_reference_id;
          const planId = session.metadata.planId;

          console.log('💰 Pago de créditos completado:', { userId, planId });

          // Determinar cantidad de créditos según el pack
          let creditsToAdd = 0;
          if (planId === 'credits-20') creditsToAdd = 20;
          else if (planId === 'credits-50') creditsToAdd = 50;
          else if (planId === 'credits-100') creditsToAdd = 100;

          if (creditsToAdd > 0) {
            // Obtener créditos actuales
            const { data: profile } = await supabase
              .from('profiles')
              .select('credits')
              .eq('id', userId)
              .single();

            const currentCredits = profile?.credits || 0;
            const newCredits = currentCredits + creditsToAdd;

            // Actualizar créditos
            const { error } = await supabase
              .from('profiles')
              .update({ credits: newCredits })
              .eq('id', userId);

            if (error) {
              console.error('❌ Error actualizando créditos:', error);
            } else {
              console.log(`✅ Créditos actualizados: ${currentCredits} → ${newCredits}`);
            }
          }
        }
        break;
      }

      // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
      // SUSCRIPCIÓN CREADA (PRO/PREMIUM)
      // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
      case 'customer.subscription.created':
      case 'customer.subscription.updated': {
        const subscription = event.data.object;
        const customerId = subscription.customer;

        // Obtener email del cliente
        const customer = await stripe.customers.retrieve(customerId);
        const email = customer.email;

        // Buscar usuario por email
        const { data: userData } = await supabase
          .from('profiles')
          .select('id')
          .eq('email', email)
          .single();

        if (userData) {
          const priceId = subscription.items.data[0].price.id;
          let newPlan = 'free';
          let creditsToAdd = 0;

          // Determinar plan y créditos según Price ID
          if (priceId === 'price_1SIP64IO8cBGyY9CC4BtGdhN') {
            newPlan = 'pro';
            creditsToAdd = 60;
          } else if (priceId === 'price_1SIP6tIO8cBGyY9CyiW8Qwd0') {
            newPlan = 'premium';
            creditsToAdd = 300;
          }

          console.log('📅 Suscripción activada:', { email, newPlan, creditsToAdd });

          // Actualizar plan y añadir créditos
          const { data: profile } = await supabase
            .from('profiles')
            .select('credits')
            .eq('id', userData.id)
            .single();

          const currentCredits = profile?.credits || 0;
          const newCredits = currentCredits + creditsToAdd;

          const { error } = await supabase
            .from('profiles')
            .update({
              plan: newPlan,
              credits: newCredits,
              subscription_id: subscription.id,
              subscription_status: subscription.status,
            })
            .eq('id', userData.id);

          if (error) {
            console.error('❌ Error actualizando suscripción:', error);
          } else {
            console.log(`✅ Plan actualizado a ${newPlan} con ${newCredits} créditos`);
          }
        }
        break;
      }

      // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
      // SUSCRIPCIÓN CANCELADA
      // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
      case 'customer.subscription.deleted': {
        const subscription = event.data.object;

        console.log('🚫 Suscripción cancelada:', subscription.id);

        // Buscar usuario por subscription_id
        const { data: profile } = await supabase
          .from('profiles')
          .select('id')
          .eq('subscription_id', subscription.id)
          .single();

        if (profile) {
          const { error } = await supabase
            .from('profiles')
            .update({
              plan: 'free',
              subscription_id: null,
              subscription_status: 'canceled',
            })
            .eq('id', profile.id);

          if (error) {
            console.error('❌ Error cancelando suscripción:', error);
          } else {
            console.log('✅ Plan revertido a FREE');
          }
        }
        break;
      }

      default:
        console.log(`ℹ️ Evento no manejado: ${event.type}`);
    }

    res.json({ received: true });
  } catch (error) {
    console.error('❌ Error procesando webhook:', error);
    res.status(500).json({ error: error.message });
  }
}

// Helper para leer el body raw
async function buffer(req) {
  const chunks = [];
  for await (const chunk of req) {
    chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
  }
  return Buffer.concat(chunks);
}