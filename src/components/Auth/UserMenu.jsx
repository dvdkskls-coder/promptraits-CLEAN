export default function UserMenu({ credits = 0, plan = 'free', onNavigate }) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-sm text-gray-400">Plan: <b>{plan}</b></span>
      <span className="text-sm text-gray-400">Créditos: <b>{credits}</b></span>
      <button onClick={() => onNavigate('profile')} className="px-3 py-1 rounded bg-white/10">Perfil</button>
      <button onClick={() => onNavigate('assistant')} className="px-3 py-1 rounded bg-white/10">Generador</button>
      <button onClick={() => onNavigate('gallery')} className="px-3 py-1 rounded bg-white/10">Galería</button>
      <button onClick={() => onNavigate('credits')} className="px-3 py-1 rounded bg-white/10">Créditos</button>
      <button onClick={() => onNavigate('logout')} className="px-3 py-1 rounded bg-red-500/20 text-red-300">Salir</button>
    </div>
  );
}
