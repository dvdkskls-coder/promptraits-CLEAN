import React, { useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { X } from 'lucide-react'

export default function Register({ onClose, onSwitchToLogin }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)
  const { signUp } = useAuth()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden')
      return
    }

    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres')
      return
    }

    setLoading(true)

    try {
      await signUp(email, password)
      setSuccess(true)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
        <div className="bg-[#1a1a1a] border border-white/10 rounded-2xl p-8 max-w-md w-full relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-white transition"
          >
            <X size={24} />
          </button>

          <h2 className="text-3xl font-bold mb-6 text-center text-green-400">
            ¡Registro Exitoso!
          </h2>

          <p className="text-gray-300 text-center mb-6">
            Hemos enviado un email de confirmación a <strong>{email}</strong>.
            Por favor, revisa tu bandeja de entrada y haz clic en el enlace para activar tu cuenta.
          </p>

          <button
            onClick={onSwitchToLogin}
            className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white py-3 rounded-lg font-bold hover:shadow-xl hover:shadow-cyan-500/20 transition-all"
          >
            Ir a Iniciar Sesión
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
      <div className="bg-[#1a1a1a] border border-white/10 rounded-2xl p-8 max-w-md w-full relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition"
        >
          <X size={24} />
        </button>

        <h2 className="text-3xl font-bold mb-6 text-center">Crear Cuenta</h2>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 mb-4">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-gray-300 focus:ring-2 focus:ring-cyan-500 focus:outline-none"
              placeholder="tu@email.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Contraseña
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-gray-300 focus:ring-2 focus:ring-cyan-500 focus:outline-none"
              placeholder="••••••••"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Confirmar Contraseña
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-gray-300 focus:ring-2 focus:ring-cyan-500 focus:outline-none"
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white py-3 rounded-lg font-bold hover:shadow-xl hover:shadow-cyan-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Creando cuenta...' : 'Registrarse'}
          </button>
        </form>

        <p className="text-center text-gray-400 mt-6">
          ¿Ya tienes cuenta?{' '}
          <button
            onClick={onSwitchToLogin}
            className="text-cyan-400 hover:text-cyan-300 font-semibold"
          >
            Inicia sesión
          </button>
        </p>
      </div>
    </div>
  )
}