import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';

export default function Login({ onClose, onSwitchToRegister }) {
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const { success, error: authError } = await signIn(email, password);

    if (success) {
      onClose();
    } else {
      setError(authError || 'Error al iniciar sesión');
    }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-[200]">
      <div className="bg-[#111] border border-white/10 rounded-xl p-6 max-w-sm w-full">
        <h3 className="text-xl font-bold mb-4">Iniciar Sesión</h3>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded text-white"
              required
            />
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-1">Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded text-white"
              required
            />
          </div>

          {error && (
            <div className="text-red-400 text-sm">{error}</div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full px-4 py-2 rounded bg-[color:var(--primary)] text-black font-bold hover:opacity-90 disabled:opacity-50"
          >
            {loading ? 'Iniciando...' : 'Iniciar Sesión'}
          </button>
        </form>

        <div className="flex gap-2 mt-4">
          <button onClick={onClose} className="flex-1 px-4 py-2 rounded bg-white/10 text-sm">
            Cancelar
          </button>
          <button onClick={onSwitchToRegister} className="flex-1 px-4 py-2 rounded bg-white/10 text-sm">
            Crear cuenta
          </button>
        </div>
      </div>
    </div>
  );
}