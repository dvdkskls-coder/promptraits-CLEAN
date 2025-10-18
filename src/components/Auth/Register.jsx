import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';

export default function Register({ onClose, onSwitchToLogin }) {
  const { signUp } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    setLoading(true);
    const { success: signUpSuccess, error: authError } = await signUp(email, password);

    if (signUpSuccess) {
      setSuccess(true);
      setTimeout(() => onSwitchToLogin(), 2000);
    } else {
      setError(authError || 'Error al registrarse');
    }
    setLoading(false);
  };

  if (success) {
    return (
      <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-[200]">
        <div className="bg-[#111] border border-white/10 rounded-xl p-6 max-w-sm w-full text-center">
          <h3 className="text-xl font-bold mb-4 text-green-400">¡Cuenta creada!</h3>
          <p className="text-gray-400">Revisa tu email para confirmar tu cuenta.</p>
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
              minLength={6}
              required
            />
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-1">Confirmar Contraseña</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded text-white"
              minLength={6}
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
            {loading ? 'Creando cuenta...' : 'Crear Cuenta'}
          </button>
        </form>

        <div className="flex gap-2 mt-4">
          <button onClick={onClose} className="flex-1 px-4 py-2 rounded bg-white/10 text-sm">
            Cancelar
          </button>
          <button onClick={onSwitchToLogin} className="flex-1 px-4 py-2 rounded bg-white/10 text-sm">
            Ya tengo cuenta
          </button>
        </div>
      </div>
    </div>
  );
}