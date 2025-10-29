import { User, Settings, LogOut, Crown } from "lucide-react";
import { useState } from "react";

export default function UserMenu({ credits = 0, plan = 'free', onNavigate }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition"
      >
        <User className="w-5 h-5" />
        <div className="text-left hidden md:block">
          <div className="text-sm font-semibold">{plan === 'pro' ? 'PRO' : 'FREE'}</div>
          <div className="text-xs text-muted">{credits} créditos</div>
        </div>
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-64 bg-[color:var(--surface)] border border-[color:var(--border)] rounded-xl shadow-xl z-50 overflow-hidden">
            <div className="p-4 border-b border-white/10">
              <div className="flex items-center gap-2 mb-2">
                {plan === 'pro' && <Crown className="w-4 h-4 text-[color:var(--primary)]" />}
                <span className="font-semibold">Plan {plan === 'pro' ? 'PRO' : 'FREE'}</span>
              </div>
              <p className="text-sm text-muted">{credits} créditos disponibles</p>
            </div>

            <button
              onClick={() => {
                setIsOpen(false);
                onNavigate?.('profile');
              }}
              className="w-full px-4 py-3 flex items-center gap-3 hover:bg-white/5 transition text-left"
            >
              <Settings className="w-5 h-5" />
              <span>Mi perfil</span>
            </button>

            <button
              onClick={() => {
                console.log('🔴 UserMenu: Logout clicked');
                setIsOpen(false);
                onNavigate?.('logout'); // ✅ CAMBIO: Llamar a onNavigate en vez de solo hacer log
              }}
              className="w-full px-4 py-3 flex items-center gap-3 hover:bg-white/5 transition text-left border-t border-white/10"
            >
              <LogOut className="w-5 h-5" />
              <span>Cerrar sesión</span>
            </button>
          </div>
        </>
      )}
    </div>
  );
}
