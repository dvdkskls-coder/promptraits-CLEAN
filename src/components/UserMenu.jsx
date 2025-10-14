import React, { useState, useRef, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { User, CreditCard, History, Settings, LogOut, ChevronDown } from 'lucide-react'

export default function UserMenu() {
  const [isOpen, setIsOpen] = useState(false)
  const { user, profile, signOut } = useAuth()
  const menuRef = useRef(null)

  // Cerrar el menú si se hace clic fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSignOut = async () => {
    try {
      await signOut()
      window.location.href = '/'
    } catch (error) {
      console.error('Error al cerrar sesión:', error)
    }
  }

  const getPlanBadgeColor = () => {
    switch (profile?.plan) {
      case 'pro':
        return 'bg-gradient-to-r from-blue-500 to-cyan-500'
      case 'premium':
        return 'bg-gradient-to-r from-purple-500 to-pink-500'
      default:
        return 'bg-gray-600'
    }
  }

  const getPlanName = () => {
    switch (profile?.plan) {
      case 'pro':
        return 'Pro'
      case 'premium':
        return 'Premium'
      default:
        return 'Free'
    }
  }

  return (
    <div className="relative" ref={menuRef}>
      {/* Botón del menú */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-3 px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 transition-all border border-white/10"
      >
        {/* Avatar */}
        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 flex items-center justify-center">
          <User size={18} className="text-white" />
        </div>

        {/* Info del usuario */}
        <div className="hidden md:flex flex-col items-start">
          <span className="text-sm font-semibold text-gray-200">
            {user?.email?.split('@')[0]}
          </span>
          <span className="text-xs text-gray-400">
            {profile?.credits || 0} créditos
          </span>
        </div>

        {/* Icono de dropdown */}
        <ChevronDown
          size={16}
          className={`text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-[#1a1a1a] border border-white/10 rounded-xl shadow-2xl overflow-hidden z-50">
          {/* Header del menú */}
          <div className="p-4 bg-gradient-to-r from-cyan-500/10 to-blue-600/10 border-b border-white/10">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 flex items-center justify-center">
                <User size={24} className="text-white" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-gray-200 truncate">
                  {user?.email}
                </p>
                <div className="flex items-center space-x-2 mt-1">
                  <span className={`text-xs px-2 py-0.5 rounded-full text-white ${getPlanBadgeColor()}`}>
                    {getPlanName()}
                  </span>
                  <span className="text-xs text-gray-400">
                    {profile?.credits || 0} créditos
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Opciones del menú */}
          <div className="py-2">
            <button
              onClick={() => {
                setIsOpen(false)
                if (window.App_navigateToProfile) {
                  window.App_navigateToProfile()
                }
              }}
              className="w-full flex items-center space-x-3 px-4 py-3 hover:bg-white/5 transition-colors"
            >
              <User size={18} className="text-cyan-400" />
              <span className="text-gray-300">Mi Perfil</span>
            </button>

            <button
              onClick={() => {
                setIsOpen(false)
                if (window.App_navigateToProfile) {
                  window.App_navigateToProfile('credits')
                }
              }}
              className="w-full flex items-center space-x-3 px-4 py-3 hover:bg-white/5 transition-colors"
            >
              <CreditCard size={18} className="text-green-400" />
              <div className="flex-1 flex items-center justify-between">
                <span className="text-gray-300">Créditos</span>
                <span className="text-sm font-bold text-cyan-400">
                  {profile?.credits || 0}
                </span>
              </div>
            </button>

            <button
              onClick={() => {
                setIsOpen(false)
                if (window.App_navigateToProfile) {
                  window.App_navigateToProfile('history')
                }
              }}
              className="w-full flex items-center space-x-3 px-4 py-3 hover:bg-white/5 transition-colors"
            >
              <History size={18} className="text-blue-400" />
              <span className="text-gray-300">Historial</span>
            </button>

            <button
              onClick={() => {
                setIsOpen(false)
                if (window.App_navigateToProfile) {
                  window.App_navigateToProfile('settings')
                }
              }}
              className="w-full flex items-center space-x-3 px-4 py-3 hover:bg-white/5 transition-colors"
            >
              <Settings size={18} className="text-gray-400" />
              <span className="text-gray-300">Configuración</span>
            </button>
          </div>

          {/* Cerrar sesión */}
          <div className="border-t border-white/10 py-2">
            <button
              onClick={handleSignOut}
              className="w-full flex items-center space-x-3 px-4 py-3 hover:bg-red-500/10 transition-colors"
            >
              <LogOut size={18} className="text-red-400" />
              <span className="text-red-400">Cerrar Sesión</span>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}