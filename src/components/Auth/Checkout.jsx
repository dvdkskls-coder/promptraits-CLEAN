import { useState } from 'react';
import { X, CreditCard, Shield } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { getPriceId, getPlanInfo } from '../../config/stripe';

export default function Checkout({ onClose, selectedPlan = 'pro' }) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const planInfo = getPlanInfo(selectedPlan);
  const priceId = getPriceId(selectedPlan);

  const handleCheckout = async () => {
    if (!user) {
      setError('Debes iniciar sesión para continuar');
      return;
    }

    if (!priceId) {
      setError('Plan no válido');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      console.log('🛒 Iniciando checkout:', { priceId, selectedPlan });

      const response = await fetch('https://jvftvymefnqtgwzbdctn.supabase.co/functions/v1/create-checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`
        },
        body: JSON.stringify({
          priceId,
          userId: user.id,
          email: user.email,
          successUrl: `${window.location.origin}?checkout=success`,
          cancelUrl: `${window.location.origin}?checkout=cancel`
        })
      });

      const data = await response.json();
      console.log('📦 Respuesta del servidor:', data);

      if (data.error) {
        throw new Error(data.error);
      }

      if (data.url) {
        console.log('✅ Redirigiendo a Stripe Checkout...');
        window.location.href = data.url;
      } else {
        throw new Error('No se recibió URL de checkout');
      }
    } catch (err) {
      console.error('❌ Error al crear checkout:', err);
      setError(err.message || 'Error al procesar el pago');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl max-w-md w-full p-8 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] rounded-2xl flex items-center justify-center mx-auto mb-4">
            <CreditCard className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl font-bold mb-2">
            {selectedPlan.startsWith('pack_') ? 'Comprar créditos' : 'Suscripción'}
          </h2>
          <p className="text-gray-400">
            {selectedPlan.startsWith('pack_') ? 'Pago único' : 'Pago mensual recurrente'}
          </p>
        </div>

        {planInfo && (
          <div className="bg-white/5 rounded-xl p-6 mb-6">
            <div className="flex justify-between items-center mb-4">
              <span className="text-lg font-semibold">
                {selectedPlan.startsWith('pack_') 
                  ? `Pack de ${planInfo.credits} créditos`
                  : `Plan ${selectedPlan.toUpperCase()}`
                }
              </span>
              <span className="text-2xl font-bold text-[var(--primary)]">
                {planInfo.price}€
              </span>
            </div>
            <div className="space-y-2 text-sm text-gray-400">
              <p>✓ {planInfo.credits} créditos</p>
              {planInfo.rolloverLimit && (
                <p>✓ Rollover hasta {planInfo.rolloverLimit} créditos</p>
              )}
              {selectedPlan === 'pro' && <p>✓ +20 créditos bonus primer mes</p>}
              {selectedPlan === 'premium' && <p>✓ -10% en packs de recarga</p>}
            </div>
          </div>
        )}

        {error && (
          <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-4 mb-6">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}

        <button
          onClick={handleCheckout}
          disabled={loading}
          className="w-full py-4 rounded-xl bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] text-white font-bold text-lg hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Procesando...' : 'Ir al pago seguro'}
        </button>

        <div className="mt-6 flex items-center justify-center gap-2 text-sm text-gray-400">
          <Shield className="w-4 h-4" />
          <span>Pago 100% seguro con Stripe</span>
        </div>

        <p className="text-center text-xs text-gray-500 mt-4">
          Al continuar, aceptas nuestros términos y condiciones. 
          Puedes cancelar tu suscripción en cualquier momento.
        </p>
      </div>
    </div>
  );
}
