export default function Profile({ onBack, onOpenCheckout, onOpenRegister, onOpenPortal }) {
  return (
    <main className="pt-32 px-4 max-w-3xl mx-auto">
      <div className="bg-white/5 border border-white/10 rounded-xl p-6">
        <h2 className="text-2xl font-bold mb-4">Mi Perfil</h2>
        <div className="flex flex-wrap gap-3">
          <button onClick={onBack} className="px-4 py-2 bg-white/10 rounded-lg hover:bg-white/20 transition">
             Volver
          </button>
          {onOpenCheckout && (
            <button onClick={onOpenCheckout} className="px-4 py-2 bg-[color:var(--primary)] text-black rounded-lg font-semibold hover:opacity-90 transition">
              Comprar créditos
            </button>
          )}
          {onOpenRegister && (
            <button onClick={onOpenRegister} className="px-4 py-2 bg-white/10 rounded-lg hover:bg-white/20 transition">
              Crear cuenta
            </button>
          )}
          {onOpenPortal && (
            <button onClick={onOpenPortal} className="px-4 py-2 bg-white/10 rounded-lg hover:bg-white/20 transition">
              Portal de facturación
            </button>
          )}
        </div>
      </div>
    </main>
  );
}

export { Profile };
