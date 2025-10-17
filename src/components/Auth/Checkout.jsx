export default function Checkout({ onClose }) {
  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-[200]">
      <div className="bg-[#111] border border-white/10 rounded-xl p-6 max-w-sm w-full">
        <h3 className="text-xl font-bold mb-4">Checkout (stub)</h3>
        <p className="text-gray-400 mb-4">Aquí abrirá Stripe en la versión completa.</p>
        <button onClick={onClose} className="px-4 py-2 rounded bg-white/10">Cerrar</button>
      </div>
    </div>
  );
}
