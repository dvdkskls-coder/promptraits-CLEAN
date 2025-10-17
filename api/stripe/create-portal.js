import Stripe from 'stripe';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    const { customerId, returnUrl } = req.body || {};
    if (!customerId) return res.status(400).json({ error: 'Missing customerId' });

    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: returnUrl || req.headers.origin,
    });
    res.status(200).json({ url: session.url });
  } catch (e) {
    console.error('create-portal error:', e);
    res.status(500).json({ error: e.message });
  }
}