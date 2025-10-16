import Stripe from 'stripe'
import { buffer } from 'micro'
import { createClient } from '@supabase/supabase-js'

export const config = {
  api: {
    bodyParser: false
  }
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', { apiVersion: '2022-11-15' })
const supabaseAdmin = createClient(
  process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
)

// Helper: add credits safely via RPC grant_credits
async function addCredits(userId, amount) {
  const n = Number(amount || 0)
  if (!userId || !Number.isFinite(n) || n === 0) return
  const { error } = await supabaseAdmin.rpc('grant_credits', {
    user_id_param: userId,
    amount_param: Math.trunc(n)
  })
  if (error) throw error
}

// Helper: set plan
async function setPlan(userId, plan) {
  if (!userId || !plan) return
  const { error } = await supabaseAdmin
    .from('profiles')
    .update({ plan })
    .eq('id', userId)
  if (error) throw error
}

export default async function handler(req, res) {
  // Minimal CORS
  res.setHeader('Access-Control-Allow-Credentials', 'true')
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Stripe-Signature, Content-Type')

  if (req.method === 'OPTIONS') return res.status(200).end()
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  let event = null
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET
  const sig = req.headers['stripe-signature']

  try {
    if (webhookSecret && sig) {
      // Use raw body to verify signature
      const buf = await buffer(req)
      try {
        event = stripe.webhooks.constructEvent(buf, sig, webhookSecret)
      } catch (e) {
        // Fallback: if a body with an event id was sent, retrieve it from Stripe
        if (req.body?.id) {
          event = await stripe.events.retrieve(req.body.id)
        } else {
          throw e
        }
      }
    } else if (req.body?.id) {
      // No signing secret configured -> try to fetch event by id
      event = await stripe.events.retrieve(req.body.id)
    } else {
      // Last resort: accept parsed body (not recommended)
      event = req.body || null
    }
  } catch (err) {
    console.error('❌ Webhook verification failed:', err?.message || err)
    return res.status(400).json({ error: `Webhook Error: ${err?.message || String(err)}` })
  }

  if (!event) return res.status(400).json({ error: 'Could not resolve Stripe event' })

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object
        const meta = session.metadata || {}
        const mode = session.mode // 'payment' or 'subscription'
        const userId = meta.userId || session.client_reference_id || null
        const credits = meta.credits ? Number(meta.credits) : 0
        const planId = meta.planId || null
        const type = meta.type || mode

        if (!userId) console.warn('⚠️ checkout.session.completed without userId metadata')

        if (type === 'subscription') {
          if (planId === 'pro') {
            await setPlan(userId, 'pro')
            await addCredits(userId, credits || 60)
          } else if (planId === 'premium') {
            await setPlan(userId, 'premium')
            await addCredits(userId, credits || 300)
          } else {
            console.log('Subscription completed but no planId provided in metadata')
          }
        } else {
          if (credits > 0) await addCredits(userId, credits)
        }
        break
      }

      case 'invoice.payment_succeeded': {
        const invoice = event.data.object
        const subscriptionId = invoice.subscription
        const customerEmail = invoice.customer_email

        let subscription = null
        if (subscriptionId) {
          try {
            subscription = await stripe.subscriptions.retrieve(subscriptionId)
          } catch (e) {
            console.warn('⚠️ Could not retrieve subscription:', e?.message || e)
          }
        }

        const planId = subscription?.metadata?.planId || null
        const userIdFromSub = subscription?.metadata?.userId || null

        const priceId = invoice.lines?.data?.[0]?.price?.id
        const stripePricePro = process.env.STRIPE_PRICE_PRO || process.env.VITE_STRIPE_PRICE_PRO
        const stripePricePremium = process.env.STRIPE_PRICE_PREMIUM || process.env.VITE_STRIPE_PRICE_PREMIUM

        const isPro = priceId && stripePricePro && priceId === stripePricePro
        const isPremium = priceId && stripePricePremium && priceId === stripePricePremium

        let creditsToAdd = 0
        if (planId === 'pro' || isPro) creditsToAdd = 60
        if (planId === 'premium' || isPremium) creditsToAdd = 300

        let resolvedUserId = userIdFromSub
        if (!resolvedUserId && customerEmail) {
          try {
            const { data, error } = await supabaseAdmin.auth.admin.listUsers()
            if (!error) {
              const users = data?.users || []
              const match = users.find(u => u.email?.toLowerCase() === customerEmail.toLowerCase())
              resolvedUserId = match?.id || null
            } else {
              console.warn('Could not list users via Supabase admin:', error)
            }
          } catch (e) {
            console.warn('Error listing users via Supabase admin:', e?.message || e)
          }
        }

        if (resolvedUserId && creditsToAdd > 0) {
          await addCredits(resolvedUserId, creditsToAdd)
        }
        break
      }

      default:
        // ignore other events
        break
    }

    return res.status(200).json({ received: true })
  } catch (err) {
    console.error('❌ Webhook handler error:', err)
    return res.status(500).json({ error: err?.message || String(err) })
  }
}
