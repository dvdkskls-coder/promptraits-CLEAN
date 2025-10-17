export default function Profile({ onBack, onOpenCheckout, onOpenRegister, onOpenPortal }) {
  return (
    <main className="pt-32 px-4 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Mi Perfil (stub)</h1>
      <div className="flex gap-3 mb-8">
        <button onClick={onBack} className="px-4 py-2 rounded bg-white/10">Volver</button>
        <button onClick={onOpenCheckout} className="px-4 py-2 rounded bg-white/10">Comprar créditos</button>
        <button onClick={onOpenRegister} className="px-4 py-2 rounded bg-white/10">Crear cuenta</button>
        <button onClick={onOpenPortal} className="px-4 py-2 rounded bg-white/10">Portal de facturación</button>
      </div>
      <p className="text-gray-400">Aquí irá el perfil real (historial, etc.).</p>
    </main>
  );
}
