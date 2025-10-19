import React, { useState } from 'react';
import { Check, Crown, Zap } from 'lucide-react';
import AnimatedSection from './AnimatedSection';

const SUBSCRIPTION_PLANS = [
  {
    id: 'free',
    name: 'FREE',
    price: '0',
    period: '/mes',
    popular: false,
    features: [
      '5 créditos al registrarte',
      'Newsletter con consejos y trucos',
      '4 prompts exclusivos al mes',
      'Acceso a galería pública'
    ]
  },
  {
    id: 'pro',
    name: 'PRO',
    price: '6.99',
    period: '/mes',
    popular: true,
    features: [
      '60 créditos/mes',
      '3 prompts personalizados (24-48h)',
      'Revisiones incluidas',
      '8 prompts exclusivos al mes',
      'Generador IA avanzado'
    ]
  },
  {
    id: 'premium',
    name: 'PREMIUM',
    price: '19.99',
    period: '/mes',
    popular: false,
    features: [
      '300 créditos/mes',
      'Acceso al agente personalizado',
      'Asesoría 1 a 1',
      '5 prompts personalizados',
      'Soporte prioritario'
    ]
  }
];

const CREDIT_PACKS = [
  { credits: 20, price: '3.99', popular: false },
  { credits: 50, price: '8.99', popular: true },
  { credits: 100, price: '15.99', popular: false }
];

export default function Pricing({ onSelectPlan, currentPlan = 'free' }) {
  const [showCreditPacks, setShowCreditPacks] = useState(false);

  return (
    <section className="py-20 px-4">
      <div className="max-w-7xl mx-auto">
        {/* NUEVO ENCABEZADO */}
        <AnimatedSection className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-heading font-bold mb-4">
            Elige tu <span className="text-[color:var(--primary)]">Plan</span>
          </h2>
          <p className="text-lg text-gray-300 max-w-3xl mx-auto leading-relaxed">
            <span className="text-[color:var(--primary)] font-bold">¡De selfie a portada de revista!</span>{' '}
            PROMPTRAITS te da el poder: deja que la{' '}
            <span className="text-[color:var(--primary)] font-semibold">IA te guíe</span>{' '}
            para resultados{' '}
            <span className="text-[color:var(--primary)] font-semibold">mágicos</span>{' '}
            o toma tú el{' '}
            <span className="text-white font-bold">control creativo total</span>.{' '}
            Crear{' '}
            <span className="text-[color:var(--primary)] font-semibold">retratos profesionales</span>{' '}
            nunca fue tan fácil.
          </p>
        </AnimatedSection>

        {/* Toggle Planes / Créditos */}
        <div className="flex justify-center mb-12">
          <div className="inline-flex rounded-full bg-[color:var(--surface)] p-1 border border-[color:var(--border)]">
            <button
              onClick={() => setShowCreditPacks(false)}
              className={`px-6 py-2 rounded-full font-semibold transition-all ${
                !showCreditPacks
                  ? 'bg-[color:var(--primary)] text-black'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Planes Mensuales
            </button>
            <button
              onClick={() => setShowCreditPacks(true)}
              className={`px-6 py-2 rounded-full font-semibold transition-all ${
                showCreditPacks
                  ? 'bg-[color:var(--primary)] text-black'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Packs de Créditos
            </button>
          </div>
        </div>

        {/* PLANES MENSUALES */}
        {!showCreditPacks && (
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {SUBSCRIPTION_PLANS.map((plan) => (
              <AnimatedSection
                key={plan.id}
                className={`relative bg-[color:var(--surface)] rounded-2xl p-8 border-2 transition-all hover:scale-105 ${
                  plan.popular
                    ? 'border-[color:var(--primary)] shadow-lg shadow-[color:var(--primary)]/20'
                    : 'border-[color:var(--border)]'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className="bg-[color:var(--primary)] text-black px-4 py-1 rounded-full text-sm font-bold">
                      MÁS POPULAR
                    </span>
                  </div>
                )}

                <div className="text-center mb-6">
                  {plan.id === 'premium' && (
                    <Crown className="w-12 h-12 text-[color:var(--primary)] mx-auto mb-4" />
                  )}
                  <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-5xl font-bold">{plan.price}€</span>
                    <span className="text-gray-400">{plan.period}</span>
                  </div>
                </div>

                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-[color:var(--primary)] flex-shrink-0 mt-0.5" />
                      <span className="text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => onSelectPlan(plan.id)}
                  disabled={currentPlan === plan.id}
                  className={`w-full py-3 rounded-lg font-bold transition-all ${
                    currentPlan === plan.id
                      ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                      : plan.popular
                      ? 'bg-[color:var(--primary)] text-black hover:opacity-90'
                      : 'bg-white/10 text-white hover:bg-white/20'
                  }`}
                >
                  {currentPlan === plan.id ? 'Plan Actual' : 'Seleccionar Plan'}
                </button>
              </AnimatedSection>
            ))}
          </div>
        )}

        {/* PACKS DE CRÉDITOS */}
        {showCreditPacks && (
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {CREDIT_PACKS.map((pack, idx) => (
              <AnimatedSection
                key={idx}
                className={`bg-[color:var(--surface)] rounded-2xl p-8 border-2 transition-all hover:scale-105 ${
                  pack.popular
                    ? 'border-[color:var(--primary)] shadow-lg'
                    : 'border-[color:var(--border)]'
                }`}
              >
                {pack.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className="bg-[color:var(--primary)] text-black px-4 py-1 rounded-full text-sm font-bold">
                      MEJOR VALOR
                    </span>
                  </div>
                )}

                <div className="text-center mb-6">
                  <Zap className="w-12 h-12 text-[color:var(--primary)] mx-auto mb-4" />
                  <h3 className="text-3xl font-bold mb-2">{pack.credits} Créditos</h3>
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-4xl font-bold">{pack.price}€</span>
                  </div>
                  <p className="text-sm text-gray-400 mt-2">
                    {(parseFloat(pack.price) / pack.credits).toFixed(2)}€ por crédito
                  </p>
                </div>

                <button
                  onClick={() => onSelectPlan(`credits-${pack.credits}`)}
                  className="w-full py-3 rounded-lg font-bold bg-[color:var(--primary)] text-black hover:opacity-90 transition-all"
                >
                  Comprar Ahora
                </button>
              </AnimatedSection>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}