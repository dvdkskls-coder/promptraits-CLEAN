import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';

export default function Register({ onClose, onSwitchToLogin }) {
  const { signUp } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const { success: isSuccess, error: authError, message } = await signUp(email, password);

    if (isSuccess) {
      setSuccess(true);
      // Esperar 3 segundos y cerrar
      setTimeout(() => {
        onClose();
      }, 5000);
    } else {
      setError(authError || 'Error al crear la cuenta');
    }
    setLoading(false);
  };

  if (success) {
    return (
      <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-[200]">
        <div className="bg-[#111] border border-green-500/30 rounded-xl p-6 max-w-sm w-full">
          <div className="text-center">
            <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-2 text-green-400">¡Cuenta creada!</h3>
            <p className="text-gray-300 mb-4">
              Hemos enviado un email de confirmación a:
            </p>
            <p className="text-[color:var(--primary)] font-semibold mb-4">{email}</p>
            <p className="text-sm text-gray-400">
              Revisa tu bandeja de entrada (y spam) y haz clic en el enlace para activar tu cuenta.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-[200]">
      <div className="bg-[#111] border border-white/10 rounded-xl p-6 max-w-sm w-full">
        <h3 className="text-xl font-bold mb-4">Crear Cuenta</h3>
        
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
              minLength={6}
            />
            <p className="text-xs text-gray-500 mt-1">Mínimo 6 caracteres</p>
          </div>

          {error && (
            <div className="text-red-400 text-sm bg-red-500/10 border border-red-500/30 rounded p-3">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full px-4 py-2 rounded bg-[color:var(--primary)] text-black font-bold hover:opacity-90 disabled:opacity-50"
          >
            {loading ? 'Creando cuenta...' : 'Crear cuenta'}
          </button>
        </form>

        <div className="flex gap-2 mt-4">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 rounded bg-white/10 text-sm"
          >
            Cancelar
          </button>
          <button
            onClick={onSwitchToLogin}
            className="flex-1 px-4 py-2 rounded bg-white/10 text-sm"
          >
            Ya tengo cuenta
          </button>
        </div>
      </div>
    </div>
  );
}