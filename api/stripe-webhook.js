import Stripe from 'stripe'
import { buffer } from 'micro'
import { createClient } from '@supabase/supabase-js'

export const config = {
  api: {
    bodyParser: false
  }
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: '2022-11-15' })
const supabaseAdmin = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY)

export default async function handler(req, res) {
  // Minimal CORS for Stripe
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Stripe-Signature, Content-Type')

  if (req.method === 'OPTIONS') return res.status(200).end()
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET
  if (!webhookSecret) {
    console.error('Missing STRIPE_WEBHOOK_SECRET')
    return res.status(500).send('Missing webhook secret')
  }

  const sig = req.headers['stripe-signature']
  let event

  try {
    const buf = await buffer(req)
    event = stripe.webhooks.constructEvent(buf, sig, webhookSecret)
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message)
    return res.status(400).send(`Webhook Error: ${err.message}`)
  }

  try {
    // Handle the event types you care about
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object
      const userId = session.metadata?.userId || session.client_reference_id
      const planId = session.metadata?.planId || null
      const credits = parseInt(session.metadata?.credits || '0', 10) || 0
      const subscriptionId = session.subscription || null

      if (!userId) {
        console.warn('checkout.session.completed without userId metadata - skipping')
      } else {
        // Grant credits via RPC if needed
        if (credits > 0) {
          try {
            const { error: rpcError } = await supabaseAdmin.rpc('grant_credits', {
              user_id_param: userId,
              amount_param: credits
            })
            if (rpcError) throw rpcError
            console.log(`Granted ${credits} credits to ${userId}`)
          } catch (e) {
            console.error('Error granting credits via RPC:', e)
          }
        }

        // Update plan if provided
        if (planId) {
          try {
            const { error: updErr } = await supabaseAdmin
              .from('profiles')
              .update({ plan: planId })
              .eq('id', userId)
            if (updErr) throw updErr
            console.log(`Set plan=${planId} for ${userId}`)
          } catch (e) {
            console.error('Error updating plan in profiles:', e)
          }
        }

        // Save subscription id if present (optional)
        if (subscriptionId) {
          try {
            const { error: subErr } = await supabaseAdmin
              .from('profiles')
              .update({ subscription_id: subscriptionId })
              .eq('id', userId)
            if (subErr) throw subErr
            console.log(`Saved subscription_id for ${userId}`)
          } catch (e) {
            console.error('Error saving subscription id:', e)
          }
        }
      }
    }

    // You can add more event handlers here (invoice.payment_succeeded, customer.subscription.updated, etc.)

    return res.status(200).json({ received: true })
  } catch (err) {
    console.error('Webhook handler error:', err)
    return res.status(500).end()
  }
}
