import React, { useState } from 'react'
import { loadStripe } from '@stripe/stripe-js'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import { X, CreditCard, Crown, Sparkles, Check } from 'lucide-react'

const publishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY


if (!publishableKey) {
  console.error('❌ VITE_STRIPE_PUBLISHABLE_KEY no está definida')
}

const stripePromise = publishableKey ? loadStripe(publishableKey) : null

export default function Checkout({ onClose }) {
  const { user, profile, refreshProfile } = useAuth()
  const [loading, setLoading] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState(null)

  const plans = [
    {
      id: 'pro',
      name: 'PRO',
      price: '6.99',
      credits: 60,
      priceId: import.meta.env.VITE_STRIPE_PRICE_PRO,
      icon: <Crown className="w-6 h-6" />,
      color: 'from-blue-500 to-cyan-500',
      features: [
        '60 créditos mensuales',
        'Historial completo',
        'Presets PRO',
        'Escenarios avanzados',
        'Rollover 2 meses',
        'Soporte prioritario'
      ]
    },
    {
      id: 'premium',
      name: 'PREMIUM',
      price: '19.99',
      credits: 300,
      priceId: import.meta.env.VITE_STRIPE_PRICE_PREMIUM,
      icon: <Sparkles className="w-6 h-6" />,
      color: 'from-purple-500 to-pink-500',
      popular: true,
      features: [
        '300 créditos mensuales',
        'Historial ilimitado',
        'Todos los presets',
        'Acceso anticipado a nuevos estilos',
        'Rollover 3 meses',
        'Soporte VIP 24/7',
        'Análisis de calidad',
        'Sin límite de generaciones/hora'
      ]
    }
  ]

  const packs = [
    { id: 'pack20', name: '20 Créditos', price: '3.99', credits: 20, priceId: import.meta.env.VITE_STRIPE_PRICE_PACK_20 },
    { id: 'pack50', name: '50 Créditos', price: '8.99', credits: 50, priceId: import.meta.env.VITE_STRIPE_PRICE_PACK_50 },
    { id: 'pack100', name: '100 Créditos', price: '15.99', credits: 100, priceId: import.meta.env.VITE_STRIPE_PRICE_PACK_100 }
  ]

  const handleCheckout = async (priceId, type, planId = null, credits = 0) => {
  if (!user) {
    alert('Debes iniciar sesión para continuar')
    return
  }

  setLoading(true)

  

  try {
    // Crear Checkout Session
    const response = await fetch('/api/create-checkout-session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        priceId,
        userId: user.id,
        email: user.email,
        type,
        planId,
        credits,
        successUrl: `${window.location.origin}/success`,
        cancelUrl: `${window.location.origin}/cancel`
      })

    })

    const session = await response.json()

    if (session.error) {
      throw new Error(session.error)
    }

    if (!session.url) {
      throw new Error('No se recibió URL de Stripe')
    }

    // Redirigir directamente con la URL
    window.location.href = session.url

  } catch (error) {
    console.error('Error al procesar el pago:', error)
    alert('Error al procesar el pago. Inténtalo de nuevo.')
    setLoading(false)
  }
}

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[100] p-4 overflow-y-auto">
      <div className="bg-[#1a1a1a] border border-white/10 rounded-2xl p-8 max-w-6xl w-full max-h-[90vh] overflow-y-auto relative">
        
        {/* Botón cerrar */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition"
        >
          <X size={24} />
        </button>

        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-2">Actualiza tu Plan</h2>
          <p className="text-gray-400">Elige el plan que mejor se adapte a tus necesidades</p>
        </div>

        {/* PLANES DE SUSCRIPCIÓN */}
        <div className="mb-12">
          <h3 className="text-xl font-bold mb-6 text-center">Planes Mensuales</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {plans.map((plan) => (
              <div
                key={plan.id}
                className={`relative rounded-2xl p-8 border-2 transition-all ${
                  selectedPlan === plan.id
                    ? 'border-cyan-500 shadow-2xl shadow-cyan-500/20'
                    : 'border-white/10 hover:border-white/20'
                } ${plan.popular ? 'ring-2 ring-purple-500/50' : ''}`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-1 rounded-full text-sm font-bold">
                    Mejor Valor ⭐
                  </div>
                )}

                <div className="text-center mb-6">
                  <div className={`w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r ${plan.color} flex items-center justify-center`}>
                    {plan.icon}
                  </div>
                  <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                  <div className="text-4xl font-bold mb-1">€{plan.price}</div>
                  <div className="text-sm text-gray-400">por mes</div>
                  <div className="text-cyan-400 font-bold mt-2">{plan.credits} créditos/mes</div>
                  <div className="text-xs text-gray-500 mt-1">
                    (€{(parseFloat(plan.price) / plan.credits).toFixed(3)}/crédito)
                  </div>
                </div>

                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start space-x-2">
                      <Check className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-300 text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault()
                    handleCheckout(plan.priceId, 'subscription', plan.id, plan.credits)
                  }}
                  disabled={loading || profile?.plan === plan.id}
                  className={`w-full py-3 rounded-lg font-bold transition-all ${
                    profile?.plan === plan.id
                      ? 'bg-gray-600 cursor-not-allowed'
                      : `bg-gradient-to-r ${plan.color} hover:shadow-xl hover:shadow-cyan-500/20`
                  }`}
                >
                  {profile?.plan === plan.id ? 'Plan Actual' : loading ? 'Procesando...' : 'Suscribirse Ahora'}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* PACKS DE CRÉDITOS */}
        <div className="border-t border-white/10 pt-8">
          <h3 className="text-xl font-bold mb-4 text-center">Packs de Créditos</h3>
          <p className="text-gray-400 text-center mb-6 text-sm">
            Compra créditos adicionales sin suscripción mensual
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {packs.map((pack) => (
              <div
                key={pack.id}
                className="bg-white/5 border border-white/10 rounded-xl p-6 hover:border-cyan-500/50 transition-all"
              >
                <div className="flex items-center justify-between mb-4">
                  <CreditCard className="w-8 h-8 text-cyan-400" />
                  <span className="text-2xl font-bold">€{pack.price}</span>
                </div>
                <div className="text-lg font-bold mb-2">{pack.name}</div>
                <div className="text-sm text-gray-400 mb-4">
                  €{(parseFloat(pack.price) / pack.credits).toFixed(3)}/crédito
                </div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault()
                    handleCheckout(pack.priceId, 'pack', null, pack.credits)
                  }}
                  disabled={loading}
                  className="w-full bg-white/10 hover:bg-white/20 text-white py-2 rounded-lg font-semibold transition-all"
                >
                  {loading ? 'Procesando...' : 'Comprar'}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>✅ Pago seguro con Stripe • Cancela cuando quieras</p>
        </div>
      </div>
    </div>
  )
}