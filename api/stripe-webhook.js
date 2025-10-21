import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

export const config = {
  api: {
    bodyParser: false,
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
    event = stripe.webhooks.constructEvent(buf, sig, webhookSecret);
  } catch (err) {
    console.error('❌ Error verificando webhook:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('📨 Evento recibido:', event.type);
  console.log('🆔 Event ID:', event.id);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

  try {
    switch (event.type) {
      // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
      // PAGO ÚNICO (COMPRA DE CRÉDITOS)
      // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
      case 'checkout.session.completed': {
        const session = event.data.object;
        
        console.log('📦 Session mode:', session.mode);
        console.log('👤 User ID:', session.client_reference_id);
        console.log('🎯 Plan ID:', session.metadata.planId);

        // Solo procesar si es pago único (no suscripción)
        if (session.mode === 'payment') {
          const userId = session.client_reference_id;
          const planId = session.metadata.planId;

          if (!userId || !planId) {
            console.error('❌ Faltan datos: userId o planId');
            return res.status(400).json({ error: 'Missing userId or planId' });
          }

          // Determinar cantidad de créditos según el pack
          let creditsToAdd = 0;
          if (planId === 'credits-20') creditsToAdd = 20;
          else if (planId === 'credits-50') creditsToAdd = 50;
          else if (planId === 'credits-100') creditsToAdd = 100;

          console.log('💰 Créditos a añadir:', creditsToAdd);

          if (creditsToAdd > 0) {
            // Obtener créditos actuales CON LOG
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

            console.log('📊 Créditos actuales:', currentCredits);
            console.log('➕ Sumando:', creditsToAdd);
            console.log('🎯 Total nuevo:', newCredits);

            // Actualizar créditos CON LOG
            const { data: updateData, error: updateError } = await supabase
              .from('profiles')
              .update({ credits: newCredits })
              .eq('id', userId)
              .select();

            if (updateError) {
              console.error('❌ Error actualizando créditos:', updateError);
              return res.status(500).json({ error: updateError.message });
            } else {
              console.log('✅ Créditos actualizados correctamente');
              console.log('📄 Datos actualizados:', updateData);
            }
          } else {
            console.warn('⚠️ planId no reconocido:', planId);
          }
        } else {
          console.log('ℹ️ Es suscripción, omitiendo...');
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

        console.log('📅 Procesando suscripción...');
        console.log('🆔 Customer ID:', customerId);

        // Obtener email del cliente
        const customer = await stripe.customers.retrieve(customerId);
        const email = customer.email;

        console.log('📧 Email:', email);

        // Buscar usuario por email
        const { data: userData, error: userError } = await supabase
          .from('profiles')
          .select('id, credits')
          .eq('email', email)
          .single();

        if (userError) {
          console.error('❌ Usuario no encontrado:', userError);
          return res.status(404).json({ error: 'User not found' });
        }

        if (userData) {
          const priceId = subscription.items.data[0].price.id;
          let newPlan = 'free';
          let creditsToAdd = 0;

          console.log('💳 Price ID:', priceId);

          // Determinar plan y créditos según Price ID
          if (priceId === 'price_1SIP64IO8cBGyY9CC4BtGdhN') {
            newPlan = 'pro';
            creditsToAdd = 60;
          } else if (priceId === 'price_1SIP6tIO8cBGyY9CyiW8Qwd0') {
            newPlan = 'premium';
            creditsToAdd = 300;
          }

          console.log('📦 Plan:', newPlan);
          console.log('💰 Créditos a añadir:', creditsToAdd);

          const currentCredits = userData.credits || 0;
          const newCredits = currentCredits + creditsToAdd;

          console.log('📊 Créditos actuales:', currentCredits);
          console.log('🎯 Total nuevo:', newCredits);

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

        const { data: profile } = await supabase
          .from('profiles')
          .select('id, credits')
          .eq('subscription_id', subscription.id)
          .single();

        if (profile) {
          console.log('📊 Créditos actuales (se mantienen):', profile.credits);

          const { error } = await supabase
            .from('profiles')
            .update({
              plan: 'free',
              subscription_id: null,
              subscription_status: 'canceled',
              // NO tocar credits, se mantienen
            })
            .eq('id', profile.id);

          if (error) {
            console.error('❌ Error cancelando suscripción:', error);
          } else {
            console.log('✅ Plan revertido a FREE (créditos conservados)');
          }
        }
        break;
      }

      default:
        console.log(`ℹ️ Evento no manejado: ${event.type}`);
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

async function buffer(req) {
  const chunks = [];
  for await (const chunk of req) {
    chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
  }
  return Buffer.concat(chunks);
}