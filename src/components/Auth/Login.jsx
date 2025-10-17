export default function Login({ onClose, onSwitchToRegister }) {
  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-[200]">
      <div className="bg-[#111] border border-white/10 rounded-xl p-6 max-w-sm w-full">
        <h3 className="text-xl font-bold mb-4">Login (stub)</h3>
        <div className="flex gap-2">
          <button onClick={onClose} className="px-4 py-2 rounded bg-white/10">Cerrar</button>
          <button onClick={onSwitchToRegister} className="px-4 py-2 rounded bg-white/10">Ir a registro</button>
        </div>
      </div>
    </div>
  );
}
