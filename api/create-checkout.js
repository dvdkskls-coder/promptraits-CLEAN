import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Price IDs de Stripe (estos debes crearlos en tu dashboard de Stripe)
const PRICE_IDS = {
  'pro': 'price_1QRv3xIO8cBGyY9CXj5JC0gX',           // Suscripción PRO 6.99€/mes
  'premium': 'price_1QRv4XIO8cBGyY9C9Kk13S84',       // Suscripción PREMIUM 19.99€/mes
  'credits-20': 'price_1QRv5jIO8cBGyY9CLjjFyU3l',    // Pack 20 créditos 3.99€
  'credits-50': 'price_1QRv6HIO8cBGyY9CMM1kDc8g',    // Pack 50 créditos 8.99€
  'credits-100': 'price_1QRv6kIO8cBGyY9CXQmZpH2Y',   // Pack 100 créditos 15.99€
};

export default async function handler(req, res) {
  // Solo permitir POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { planId, userId, userEmail } = req.body;

    // Validar datos
    if (!planId || !userId || !userEmail) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const priceId = PRICE_IDS[planId];
    if (!priceId) {
      return res.status(400).json({ error: 'Invalid plan ID' });
    }

    // Determinar si es suscripción o pago único
    const isSubscription = planId === 'pro' || planId === 'premium';

    // Crear sesión de Stripe Checkout
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
      success_url: `https://promptraits-clean.vercel.app/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `https://promptraits-clean.vercel.app/pricing`,
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