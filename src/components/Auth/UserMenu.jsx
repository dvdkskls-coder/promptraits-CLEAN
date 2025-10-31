import React from 'react';
import { User, History, LogOut, Gift, Crown } from 'lucide-react';

function UserMenu({ onLogout, profile, onNavigate }) {
  // Obtener plan y créditos del profile
  const plan = profile?.plan || 'free';
  const credits = profile?.credits ?? 0;
  const isPro = plan === 'pro' || plan === 'enterprise';

  return (
    <div className="absolute right-0 mt-2 w-64 bg-[color:var(--surface)] border border-[color:var(--border)] rounded-xl shadow-2xl overflow-hidden z-50">
      {/* Header con plan y créditos */}
      <div className="p-4 bg-gradient-to-r from-[color:var(--primary)]/10 to-transparent border-b border-[color:var(--border)]">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            {isPro ? (
              <>
                <Crown className="w-5 h-5 text-[color:var(--primary)]" />
                <span className="text-sm font-bold text-[color:var(--primary)] uppercase">
                  {plan === 'enterprise' ? 'Enterprise' : 'Pro'}
                </span>
              </>
            ) : (
              <span className="text-sm font-semibold text-gray-400 uppercase">
                Free
              </span>
            )}
          </div>
        </div>
        
        <div className="flex items-center justify-between bg-[color:var(--bg)] rounded-lg px-3 py-2">
          <span className="text-sm text-muted">Créditos</span>
          <div className="flex items-center">
            <Gift className="w-4 h-4 text-[color:var(--primary)] mr-1.5" />
            <span className="text-sm font-bold">{credits}</span>
          </div>
        </div>
      </div>

      {/* Menu Items */}
      <div className="py-2">
        <button
          onClick={() => onNavigate('profile')}
          className="w-full px-4 py-2.5 flex items-center space-x-3 hover:bg-[color:var(--bg)] transition-colors text-left"
        >
          <User className="w-4 h-4 text-muted" />
          <span className="text-sm">Mi Perfil</span>
        </button>

        <button
          onClick={() => onNavigate('history')}
          className="w-full px-4 py-2.5 flex items-center space-x-3 hover:bg-[color:var(--bg)] transition-colors text-left"
        >
          <History className="w-4 h-4 text-muted" />
          <span className="text-sm">Historial</span>
        </button>

        <div className="border-t border-[color:var(--border)] my-2"></div>

        <button
          onClick={onLogout}
          className="w-full px-4 py-2.5 flex items-center space-x-3 hover:bg-red-500/10 text-red-500 transition-colors text-left"
        >
          <LogOut className="w-4 h-4" />
          <span className="text-sm">Cerrar Sesión</span>
        </button>
      </div>
    </div>
  );
}

export default UserMenu;
