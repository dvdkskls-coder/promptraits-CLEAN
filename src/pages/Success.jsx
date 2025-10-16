import React, { useEffect } from 'react'
import { Check } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'

export default function Success() {
  const { refreshProfile } = useAuth()

  useEffect(() => {
    // Recargar perfil para mostrar nuevos créditos
    refreshProfile()
  }, [])

  const handleGoHome = () => {
    window.location.href = '/'
  }

  const handleGoToGenerator = () => {
    window.location.href = '/#generador'
  }

  return (
    <div className="min-h-screen bg-[#0D0D0D] flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white/5 border border-white/10 rounded-2xl p-8 text-center">
        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-500/20 flex items-center justify-center">
          <Check className="w-10 h-10 text-green-400" />
        </div>
        
        <h1 className="text-3xl font-bold mb-4">¡Pago Exitoso!</h1>
        
        <p className="text-gray-400 mb-8">
          Tu suscripción ha sido activada correctamente. Ya puedes disfrutar de todos los beneficios de tu nuevo plan.
        </p>

        <div className="space-y-3">
          <button
            onClick={handleGoToGenerator}
            className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-8 py-3 rounded-full font-bold hover:shadow-xl hover:shadow-cyan-500/20 transition-all"
          >
            Empezar a Generar Prompts
          </button>
          
          <button
            onClick={handleGoHome}
            className="w-full bg-white/10 hover:bg-white/20 text-white px-8 py-3 rounded-full font-bold transition-all"
          >
            Volver al Inicio
          </button>
        </div>
      </div>
    </div>
  )
}