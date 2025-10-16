import React from 'react'
import { X } from 'lucide-react'

export default function Cancel() {
  const handleGoHome = () => {
    window.location.href = '/'
  }

  const handleTryAgain = () => {
    window.location.href = '/#planes'
  }

  return (
    <div className="min-h-screen bg-[#0D0D0D] flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white/5 border border-white/10 rounded-2xl p-8 text-center">
        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-red-500/20 flex items-center justify-center">
          <X className="w-10 h-10 text-red-400" />
        </div>
        
        <h1 className="text-3xl font-bold mb-4">Pago Cancelado</h1>
        
        <p className="text-gray-400 mb-8">
          No te preocupes, no se ha realizado ningún cargo. Puedes intentarlo de nuevo cuando quieras.
        </p>

        <div className="space-y-3">
          <button
            onClick={handleTryAgain}
            className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-8 py-3 rounded-full font-bold hover:shadow-xl hover:shadow-cyan-500/20 transition-all"
          >
            Ver Planes de Nuevo
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