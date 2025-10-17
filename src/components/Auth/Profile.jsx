export default function Login({ onClose, onSwitchToRegister }) {
  return (
    <main className="pt-32 px-4 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Iniciar sesión</h1>
      <div className="flex gap-3 mb-8">
        <button onClick={onClose} className="px-4 py-2 rounded bg-white/10">Volver</button>
        <button onClick={onSwitchToRegister} className="px-4 py-2 rounded bg-white/10">Crear cuenta</button>
      </div>
      <p className="text-gray-400">Aquí irá el perfil real (historial, etc.).</p>
    </main>
  );
}

export { Login }; // ← opcional pero válido

export default function Register({ onClose, onSwitchToLogin }) {
  return (
    <main className="pt-32 px-4 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Crear cuenta</h1>
      <div className="flex gap-3 mb-8">
        <button onClick={onClose} className="px-4 py-2 rounded bg-white/10">Volver</button>
        <button onClick={onSwitchToLogin} className="px-4 py-2 rounded bg-white/10">Iniciar sesión</button>
      </div>
      <p className="text-gray-400">Aquí irá el perfil real (historial, etc.).</p>
    </main>
  );
}

export { Register }; // ← opcional pero válido

export default function UserMenu({ credits = 0, plan = 'free', onNavigate }) {
  return (
    <main className="pt-32 px-4 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Perfil de usuario</h1>
      <div className="flex gap-3 mb-8">
        <button onClick={onNavigate} className="px-4 py-2 rounded bg-white/10">Volver</button>
      </div>
      <p className="text-gray-400">Aquí irá el perfil real (historial, etc.).</p>
    </main>
  );
}

export { UserMenu }; // ← opcional pero válido

export default function Checkout({ onClose }) {
  return (
    <main className="pt-32 px-4 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Checkout</h1>
      <div className="flex gap-3 mb-8">
        <button onClick={onClose} className="px-4 py-2 rounded bg-white/10">Volver</button>
      </div>
      <p className="text-gray-400">Aquí irá el perfil real (historial, etc.).</p>
    </main>
  );
}

export { Checkout }; // ← opcional pero válido

export default function QualityAnalysis({ analysis, isPro, onApplySuggestions, isApplying }) {
  return (
    <main className="pt-32 px-4 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Análisis de calidad</h1>
      <div className="flex gap-3 mb-8">
        <button onClick={onApplySuggestions} className="px-4 py-2 rounded bg-white/10">Aplicar sugerencias</button>
      </div>
      <p className="text-gray-400">Aquí irá el perfil real (historial, etc.).</p>
    </main>
  );
}

export { QualityAnalysis }; // ← opcional pero válido
