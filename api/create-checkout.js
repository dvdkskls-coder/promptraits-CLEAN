import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Price IDs de Stripe - ACTUALIZADOS CON IDS REALES
const PRICE_IDS = {
  'pro': 'price_1SIP64IO8cBGyY9CC4BtGdhN',           // Suscripción PRO 6.99€/mes
  'premium': 'price_1SIP6tIO8cBGyY9CyiW8Qwd0',       // Suscripción PREMIUM 19.99€/mes
  'credits-20': 'price_1SIP97IO8cBGyY9CLmnYtOwl',    // Pack 20 créditos 3.99€
  'credits-50': 'price_1SIP9TIO8cBGyY9CBW1j64eb',    // Pack 50 créditos 8.99€
  'credits-100': 'price_1SIP9yIO8cBGyY9CrndCyvTO',   // Pack 100 créditos 15.99€
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { planId, userId, userEmail } = req.body;

    if (!planId || !userId || !userEmail) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const priceId = PRICE_IDS[planId];
    if (!priceId) {
      return res.status(400).json({ error: 'Invalid plan ID' });
    }

    const isSubscription = planId === 'pro' || planId === 'premium';

    // ← CAMBIAR A TU DOMINIO CUSTOM
    const baseUrl = 'https://promptraits.com';

    const session = await stripe.checkout.sessions.create({
      mode: isSubscription ? 'subscription' : 'payment',
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      customer_email: userEmail,
      client_reference_id: userId,
      metadata: {
        userId,
        planId,
      },
      success_url: `${baseUrl}?payment=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}?payment=cancelled`,
    });

    console.log('✅ Sesión de checkout creada:', session.id);

    res.status(200).json({ 
      sessionId: session.id, 
      url: session.url 
    });
  } catch (error) {
    console.error('❌ Error en Stripe checkout:', error);
    res.status(500).json({ error: error.message });
  }
}