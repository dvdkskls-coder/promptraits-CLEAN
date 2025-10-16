import Stripe from 'stripe'
import { createClient } from '@supabase/supabase-js'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: '2022-11-15' })
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY)

// Helper para obtener el origen público (puedes definir NEXT_PUBLIC_ORIGIN en Vercel)
const PUBLIC_ORIGIN = process.env.NEXT_PUBLIC_ORIGIN || `https://www.promptraits.com`

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { priceId, userId, email, type, planId = '', credits = 0, successUrl, cancelUrl } = req.body || {}

    if (!priceId) return res.status(400).json({ error: 'Missing priceId' })
    if (!userId) return res.status(400).json({ error: 'Missing userId' })

    const baseSuccess = successUrl || `${PUBLIC_ORIGIN}/success`
    const baseCancel = cancelUrl || `${PUBLIC_ORIGIN}/cancel`

    const sessionParams = {
      payment_method_types: ['card'],
      customer_email: email || undefined,
      client_reference_id: userId,
      metadata: {
        userId,
        planId: planId || '',
        credits: String(credits || 0),
        type: type || ''
      },
      success_url: `${baseSuccess}?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: baseCancel,
      allow_promotion_codes: true
    }

    let session
    if (type === 'subscription') {
      session = await stripe.checkout.sessions.create({
        ...sessionParams,
        mode: 'subscription',
        line_items: [{ price: priceId, quantity: 1 }]
      })
    } else {
      session = await stripe.checkout.sessions.create({
        ...sessionParams,
        mode: 'payment',
        line_items: [{ price: priceId, quantity: 1 }]
      })
    }

    // Opcional: guarda un registro en Supabase (audit) - no obligatorio
    try {
      await supabase.from('stripe_sessions').insert([{
        id: session.id,
        user_id: userId,
        price_id: priceId,
        mode: type || 'payment',
        metadata: session.metadata || {}
      }])
    } catch (e) {
      // No bloquear el flujo por fallos de logging
      console.warn('Could not log stripe_session in Supabase:', e.message || e)
    }

    return res.status(200).json({ sessionId: session.id })
  } catch (err) {
    console.error('create-checkout-session error:', err)
    return res.status(500).json({ error: err.message || 'Server error' })
  }
}