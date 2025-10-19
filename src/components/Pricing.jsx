import { Check, Sparkles, Zap, Crown } from 'lucide-react';

const PLANS = [
  {
    id: 'free',
    name: 'FREE',
    price: 0,
    period: '',
    credits: 5,
    pricePerCredit: '—',
    features: [
      '5 créditos al registrarte',
      'Acceso a galería pública',
      '3 plantillas básicas',
      'Soporte por email'
    ],
    cta: 'Empezar gratis',
    popular: false,
    icon: Sparkles
  },
  {
    id: 'pro',
    name: 'PRO',
    price: 6.99,
    period: '/mes',
    credits: 60,
    pricePerCredit: '0,12€',
    features: [
      '60 créditos/mes',
      'Rollover hasta 120 créditos',
      'Todas las plantillas PRO',
      'Prioridad en cola',
      'Soporte 24-48h',
      '+20 créditos el primer mes'
    ],
    cta: 'Empezar ahora',
    popular: false,
    icon: Zap
  },
  {
    id: 'premium',
    name: 'PREMIUM',
    price: 19.99,
    period: '/mes',
    credits: 300,
    pricePerCredit: '0,07€',
    badge: 'Mejor valor',
    features: [
      '300 créditos/mes',
      'Rollover hasta 900 créditos',
      'Batch generator (múltiples prompts)',
      'Estilos exclusivos Premium',
      'Prioridad máxima en cola',
      '-10% en packs de recarga',
      'Soporte prioritario (<12h)',
      'Acceso anticipado a nuevas features'
    ],
    cta: 'Ir a Premium',
    popular: true,
    icon: Crown
  }
];

const PACKS = [
  { credits: 20, price: 3.99, pricePerCredit: '0,20€' },
  { credits: 50, price: 8.99, pricePerCredit: '0,18€' },
  { credits: 100, price: 15.99, pricePerCredit: '0,16€' }
];

export default function Pricing({ onSelectPlan, currentPlan = 'free' }) {
  return (
    <div className="max-w-7xl mx-auto px-4 py-16">
      {/* Header */}
      <div className="text-center mb-16">
        <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] bg-clip-text text-transparent">
          Planes diseñados para creadores
        </h2>
        <p className="text-xl text-gray-400 max-w-2xl mx-auto">
          Hasta <span className="text-[var(--primary)] font-bold">10× más barato</span> que la competencia.
          Sin compromisos, cancela cuando quieras.
        </p>
      </div>

      {/* Plans Grid */}
      <div className="grid md:grid-cols-3 gap-8 mb-20">
        {PLANS.map((plan) => {
          const Icon = plan.icon;
          const isCurrent = currentPlan === plan.id;
          
          return (
            <div
              key={plan.id}
              className={`relative rounded-2xl p-8 ${
                plan.popular
                  ? 'bg-gradient-to-b from-[var(--primary)]/20 to-[var(--surface)] border-2 border-[var(--primary)]'
                  : 'bg-[var(--surface)] border border-[var(--border)]'
              } transition-transform hover:scale-105`}
            >
              {/* Badge */}
              {plan.badge && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] text-white px-4 py-1 rounded-full text-sm font-bold">
                    {plan.badge}
                  </span>
                </div>
              )}

              {/* Icon */}
              <div className="flex items-center justify-center mb-6">
                <div className={`p-3 rounded-xl ${
                  plan.popular ? 'bg-[var(--primary)]/20' : 'bg-white/5'
                }`}>
                  <Icon className="w-8 h-8 text-[var(--primary)]" />
                </div>
              </div>

              {/* Plan name */}
              <h3 className="text-2xl font-bold text-center mb-2">{plan.name}</h3>

              {/* Price */}
              <div className="text-center mb-2">
                <span className="text-5xl font-bold">{plan.price}€</span>
                <span className="text-gray-400">{plan.period}</span>
              </div>

              {/* Credits info */}
              <div className="text-center mb-6">
                <p className="text-gray-400 text-sm">
                  {plan.credits} créditos {plan.period && '/ mes'}
                </p>
                <p className="text-[var(--primary)] text-xs font-semibold">
                  {plan.pricePerCredit} por crédito
                </p>
              </div>

              {/* CTA Button */}
              <button
                onClick={() => onSelectPlan(plan.id)}
                disabled={isCurrent}
                className={`w-full py-3 rounded-xl font-bold mb-6 transition ${
                  isCurrent
                    ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                    : plan.popular
                    ? 'bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] text-white hover:opacity-90'
                    : 'bg-white/10 text-white hover:bg-white/20'
                }`}
              >
                {isCurrent ? 'Plan actual' : plan.cta}
              </button>

              {/* Features */}
              <ul className="space-y-3">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-[var(--primary)] flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-gray-300">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>

      {/* Packs de recarga */}
      <div className="max-w-4xl mx-auto">
        <h3 className="text-3xl font-bold text-center mb-8">
          Packs de recarga
        </h3>
        <p className="text-center text-gray-400 mb-8">
          ¿Necesitas créditos extra? Compra packs individuales sin suscripción.
        </p>

        <div className="grid md:grid-cols-3 gap-6">
          {PACKS.map((pack) => (
            <div
              key={pack.credits}
              className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-6 text-center hover:border-[var(--primary)] transition"
            >
              <p className="text-3xl font-bold mb-2">{pack.credits} créditos</p>
              <p className="text-2xl font-bold text-[var(--primary)] mb-2">
                {pack.price}€
              </p>
              <p className="text-sm text-gray-400 mb-4">
                {pack.pricePerCredit} por crédito
              </p>
              <button
                onClick={() => onSelectPlan('pack_' + pack.credits)}
                className="w-full py-2 rounded-lg bg-white/10 hover:bg-white/20 transition font-semibold"
              >
                Comprar ahora
              </button>
            </div>
          ))}
        </div>

        <p className="text-center text-sm text-gray-500 mt-6">
          💡 Tip: Las suscripciones tienen mejor precio por crédito y rollover incluido
        </p>
      </div>

      {/* Garantía */}
      <div className="mt-16 text-center">
        <p className="text-gray-400">
          ✅ Garantía de 7 días • 🔒 Pago seguro con Stripe • 🚫 Cancela cuando quieras
        </p>
      </div>
    </div>
  );
}