import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

export default async function handler(req, res) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Credentials', true)
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT')
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  )

  if (req.method === 'OPTIONS') {
    res.status(200).end()
    return
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { priceId, userId, email, type, planId, credits, successUrl, cancelUrl } = req.body || {}

  // Validar Secret Key
  if (!process.env.STRIPE_SECRET_KEY) {
    console.error('❌ STRIPE_SECRET_KEY no está definida')
    return res.status(500).json({ error: 'Stripe no está configurado en el servidor' })
  }

  try {
    const creditsStr = String(credits ?? 0)
    const clientRef = userId || undefined
    const PUBLIC_ORIGIN = process.env.NEXT_PUBLIC_ORIGIN || 'https://www.promptraits.com'
    const baseSuccess = successUrl || `${PUBLIC_ORIGIN}/success`
    const baseCancel = cancelUrl || `${PUBLIC_ORIGIN}/cancel`

    const sessionParams = {
      payment_method_types: ['card'],
      mode: type === 'subscription' ? 'subscription' : 'payment',
      line_items: [
        {
          price: priceId,
          quantity: 1
        }
      ],
      customer_email: email || undefined,
      client_reference_id: clientRef,
      metadata: {
        userId: userId || '',
        type: type || '',
        planId: planId || '',
        credits: creditsStr
      },
      success_url: `${baseSuccess}?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: baseCancel,
      allow_promotion_codes: true
    }

    // PATCH: si es suscripción añadir metadata dentro de subscription_data
    if (type === 'subscription') {
      sessionParams.subscription_data = {
        metadata: {
          userId: userId || '',
          planId: planId || ''
        }
      }
    }

    const session = await stripe.checkout.sessions.create(sessionParams)

    // Devolver URL directa y sessionId
    res.status(200).json({
      sessionId: session.id,
      url: session.url || null
    })
  } catch (error) {
    console.error('❌ Error creating checkout session:', error)
    res.status(500).json({ error: error.message })
  }
}