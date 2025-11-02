import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import PromptHistory from '../Profile/PromptHistory';
import { CreditCard, Package, Trash2, Key, ArrowLeft } from 'lucide-react';

export default function Profile({ onNavigate, onAccountDeleted }) {
  const { user, profile, signOut } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Escuchar evento para abrir tab de historial
  useEffect(() => {
    const handleOpenTab = (e) => {
      setActiveTab(e.detail);
    };
    window.addEventListener('profile:openTab', handleOpenTab);
    return () => window.removeEventListener('profile:openTab', handleOpenTab);
  }, []);

  const handleCancelSubscription = async () => {
    if (!confirm('¿Seguro que quieres cancelar tu suscripción? Pasarás a plan Free.')) return;

    try {
      const { error } = await supabase
        .from('profiles')
        .update({ 
          plan: 'free',
          stripe_subscription_status: 'canceled'
        })
        .eq('id', user.id);

      if (error) throw error;
      alert('Suscripción cancelada. Ahora eres usuario Free.');
      window.location.reload();
    } catch (err) {
      alert('Error al cancelar suscripción: ' + err.message);
    }
  };

  const handleDeleteAccount = async () => {
    if (!confirm('⚠️ ESTO ELIMINARÁ TU CUENTA PERMANENTEMENTE. ¿Estás seguro?')) return;

    try {
      // Eliminar perfil (cascada eliminará prompts)
      await supabase.from('profiles').delete().eq('id', user.id);
      
      // Cerrar sesión
      await signOut();
      
      // Llamar callback para refrescar
      if (onAccountDeleted) {
        onAccountDeleted();
      }
    } catch (err) {
      alert('Error al eliminar cuenta: ' + err.message);
    }
  };

  return (
    <main className="pt-32 px-4 max-w-4xl mx-auto pb-20">
      <button
        onClick={() => onNavigate('home')}
        className="flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition"
      >
        <ArrowLeft className="w-4 h-4" />
        Volver
      </button>

      <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 p-6 border-b border-white/10">
          <h2 className="text-2xl font-bold mb-2">Mi Perfil</h2>
          <p className="text-gray-400">{user?.email}</p>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-white/10">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-6 py-3 font-semibold transition ${
              activeTab === 'overview'
                ? 'text-white border-b-2 border-[color:var(--primary)]'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Resumen
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`px-6 py-3 font-semibold transition ${
              activeTab === 'history'
                ? 'text-white border-b-2 border-[color:var(--primary)]'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Historial
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`px-6 py-3 font-semibold transition ${
              activeTab === 'settings'
                ? 'text-white border-b-2 border-[color:var(--primary)]'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Configuración
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Plan */}
              <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                <div className="flex items-center gap-3">
                  <Package className="w-5 h-5 text-[color:var(--primary)]" />
                  <div>
                    <p className="text-sm text-gray-400">Plan actual</p>
                    <p className="text-xl font-bold capitalize">{profile.plan}</p>
                  </div>
                </div>
                {profile.plan !== 'premium' && (
                  <button
                    onClick={() => onNavigate('pricing')}
                    className="px-4 py-2 bg-[color:var(--primary)] text-black rounded-lg font-semibold hover:opacity-90 transition"
                  >
                    Actualizar plan
                  </button>
                )}
              </div>

              {/* Créditos */}
              <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                <div className="flex items-center gap-3">
                  <CreditCard className="w-5 h-5 text-[color:var(--primary)]" />
                  <div>
                    <p className="text-sm text-gray-400">Créditos disponibles</p>
                    <p className="text-xl font-bold">{profile.credits || 0}</p>
                  </div>
                </div>
                <button
                  onClick={() => onNavigate('pricing')}
                  className="px-4 py-2 bg-white/10 rounded-lg hover:bg-white/20 transition"
                >
                  Comprar créditos
                </button>
              </div>

              {/* Cancelar suscripción */}
              {(profile.plan === 'pro' || profile.plan === 'premium') && (
                <button
                  onClick={handleCancelSubscription}
                  className="w-full px-4 py-3 bg-yellow-500/10 text-yellow-400 border border-yellow-500/30 rounded-lg hover:bg-yellow-500/20 transition"
                >
                  Cancelar suscripción
                </button>
              )}
            </div>
          )}

          {activeTab === 'history' && <PromptHistory />}

          {activeTab === 'settings' && (
            <div className="space-y-4">
              <h3 className="text-xl font-bold mb-4">Configuración de cuenta</h3>

              <button
                className="w-full px-4 py-3 bg-white/5 text-left rounded-lg hover:bg-white/10 transition flex items-center gap-3"
                onClick={() => alert('Función de cambio de contraseña próximamente')}
              >
                <Key className="w-5 h-5" />
                Cambiar contraseña
              </button>

              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="w-full px-4 py-3 bg-red-500/10 text-red-400 border border-red-500/30 rounded-lg hover:bg-red-500/20 transition flex items-center gap-3"
              >
                <Trash2 className="w-5 h-5" />
                Eliminar cuenta
              </button>

              {showDeleteConfirm && (
                <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-[300]">
                  <div className="bg-[#111] border border-red-500/30 rounded-xl p-6 max-w-md">
                    <h3 className="text-xl font-bold text-red-400 mb-4">⚠️ Eliminar cuenta</h3>
                    <p className="text-gray-300 mb-6">
                      Esta acción es <strong>permanente</strong> y eliminará todos tus datos, prompts e historial.
                    </p>
                    <div className="flex gap-3">
                      <button
                        onClick={() => setShowDeleteConfirm(false)}
                        className="flex-1 px-4 py-2 bg-white/10 rounded-lg hover:bg-white/20 transition"
                      >
                        Cancelar
                      </button>
                      <button
                        onClick={handleDeleteAccount}
                        className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                      >
                        Eliminar definitivamente
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

export { Profile };
