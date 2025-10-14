import React, { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'
import { User, CreditCard, History, Settings, Trash2, Lock, ArrowLeft, Calendar, FileText } from 'lucide-react'

export default function Profile({ onBack }) {
  const { user, profile, signOut } = useAuth()
  const [activeTab, setActiveTab] = useState(window.App_profileTab || 'profile');
  
  // Actualizar pestaña cuando se recibe desde UserMenu
  React.useEffect(() => {
    if (window.App_profileTab) {
      setActiveTab(window.App_profileTab)
      delete window.App_profileTab
    }
  }, [])

  const [promptHistory, setPromptHistory] = useState([])
  const [loading, setLoading] = useState(false)
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [message, setMessage] = useState({ type: '', text: '' })

  // Cargar historial de prompts
  useEffect(() => {
    if (activeTab === 'history') {
      loadPromptHistory()
    }
  }, [activeTab])

  const loadPromptHistory = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('prompt_history')
        .select('*')
        .eq('user_id', user.id)
        .order('generated_at', { ascending: false })
        .limit(50)

      if (error) throw error
      setPromptHistory(data || [])
    } catch (error) {
      console.error('Error loading history:', error)
      setMessage({ type: 'error', text: 'Error al cargar el historial' })
    } finally {
      setLoading(false)
    }
  }

  const handleChangePassword = async (e) => {
    e.preventDefault()
    
    if (newPassword !== confirmPassword) {
      setMessage({ type: 'error', text: 'Las contraseñas no coinciden' })
      return
    }

    if (newPassword.length < 6) {
      setMessage({ type: 'error', text: 'La contraseña debe tener al menos 6 caracteres' })
      return
    }

    try {
      setLoading(true)
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      })

      if (error) throw error

      setMessage({ type: 'success', text: 'Contraseña actualizada correctamente' })
      setNewPassword('')
      setConfirmPassword('')
    } catch (error) {
      setMessage({ type: 'error', text: error.message })
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteAccount = async () => {
    if (!window.confirm('¿Estás seguro de que quieres eliminar tu cuenta? Esta acción no se puede deshacer.')) {
      return
    }

    const confirmation = window.prompt('Escribe "ELIMINAR" para confirmar:')
    if (confirmation !== 'ELIMINAR') {
      return
    }

    try {
      setLoading(true)
      
      const { error: deleteError } = await supabase
        .from('profiles')
        .delete()
        .eq('id', user.id)

      if (deleteError) throw deleteError

      await signOut()
      
      alert('Tu cuenta ha sido eliminada')
    } catch (error) {
      setMessage({ type: 'error', text: 'Error al eliminar la cuenta' })
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const deletePrompt = async (promptId) => {
    try {
      const { error } = await supabase
        .from('prompt_history')
        .delete()
        .eq('id', promptId)

      if (error) throw error

      setPromptHistory(promptHistory.filter(p => p.id !== promptId))
      setMessage({ type: 'success', text: 'Prompt eliminado' })
    } catch (error) {
      setMessage({ type: 'error', text: 'Error al eliminar el prompt' })
    }
  }

  const getPlanColor = () => {
    switch (profile?.plan) {
      case 'pro':
        return 'from-blue-500 to-cyan-500'
      case 'premium':
        return 'from-purple-500 to-pink-500'
      default:
        return 'from-gray-500 to-gray-600'
    }
  }

  const getPlanName = () => {
    switch (profile?.plan) {
      case 'pro':
        return 'PRO'
      case 'premium':
        return 'PREMIUM'
      default:
        return 'FREE'
    }
  }

  return (
    <div className="min-h-screen bg-[#0D0D0D] pt-32 px-4 pb-20">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={onBack}
            className="flex items-center space-x-2 text-gray-400 hover:text-white transition"
          >
            <ArrowLeft size={20} />
            <span>Volver</span>
          </button>
          <h1 className="text-3xl font-bold">Mi Perfil</h1>
          <div className="w-20"></div>
        </div>

        {/* Mensajes */}
        {message.text && (
          <div className={`mb-6 p-4 rounded-lg ${
            message.type === 'success' 
              ? 'bg-green-500/10 border border-green-500/30 text-green-400' 
              : 'bg-red-500/10 border border-red-500/30 text-red-400'
          }`}>
            {message.text}
          </div>
        )}

        {/* Tabs */}
        <div className="flex space-x-2 mb-8 overflow-x-auto">
          <button
            onClick={() => setActiveTab('profile')}
            className={`px-6 py-3 rounded-lg font-semibold transition-all whitespace-nowrap ${
              activeTab === 'profile' 
                ? 'bg-white/10 text-white' 
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <User size={18} className="inline mr-2" />
            Perfil
          </button>
          <button
            onClick={() => setActiveTab('credits')}
            className={`px-6 py-3 rounded-lg font-semibold transition-all whitespace-nowrap ${
              activeTab === 'credits' 
                ? 'bg-white/10 text-white' 
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <CreditCard size={18} className="inline mr-2" />
            Créditos
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`px-6 py-3 rounded-lg font-semibold transition-all whitespace-nowrap ${
              activeTab === 'history' 
                ? 'bg-white/10 text-white' 
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <History size={18} className="inline mr-2" />
            Historial
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`px-6 py-3 rounded-lg font-semibold transition-all whitespace-nowrap ${
              activeTab === 'settings' 
                ? 'bg-white/10 text-white' 
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Settings size={18} className="inline mr-2" />
            Configuración
          </button>
        </div>

        {/* Content */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
          
          {/* TAB: PERFIL */}
          {activeTab === 'profile' && (
            <div className="space-y-6">
              <div className="flex items-center space-x-6">
                <div className="w-24 h-24 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 flex items-center justify-center">
                  <User size={48} className="text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold mb-2">{user?.email?.split('@')[0]}</h2>
                  <p className="text-gray-400 mb-3">{user?.email}</p>
                  <div className={`inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r ${getPlanColor()} text-white font-bold`}>
                    Plan {getPlanName()}
                  </div>
                </div>
              </div>

              <div className="border-t border-white/10 pt-6">
                <h3 className="text-lg font-bold mb-4">Información de la cuenta</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Fecha de registro:</span>
                    <span className="text-gray-200">
                      {new Date(user?.created_at).toLocaleDateString('es-ES')}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Créditos disponibles:</span>
                    <span className="text-cyan-400 font-bold">{profile?.credits || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Plan actual:</span>
                    <span className="text-gray-200">{getPlanName()}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB: CRÉDITOS */}
          {activeTab === 'credits' && (
            <div className="space-y-6">
              <div className="text-center py-12">
                <div className="w-32 h-32 mx-auto mb-6 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 flex items-center justify-center">
                  <span className="text-5xl font-bold text-white">{profile?.credits || 0}</span>
                </div>
                <h3 className="text-2xl font-bold mb-2">Créditos Disponibles</h3>
                <p className="text-gray-400 mb-6">
                  Cada generación de prompt consume 1 crédito
                </p>
                
                {profile?.plan === 'free' && (
                  <button
                    onClick={() => {
                      onBack()
                      setTimeout(() => {
                        document.getElementById('planes')?.scrollIntoView({ behavior: 'smooth' })
                      }, 100)
                    }}
                    className="inline-block bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-8 py-3 rounded-full font-bold hover:shadow-xl hover:shadow-cyan-500/20 transition-all"
                  >
                    Actualizar a PRO
                  </button>
                )}
              </div>
            </div>
          )}

          {/* TAB: HISTORIAL */}
          {activeTab === 'history' && (
            <div className="space-y-4">
              <h3 className="text-xl font-bold mb-4">Historial de Prompts Generados</h3>
              
              {loading ? (
                <div className="text-center py-12 text-gray-400">Cargando...</div>
              ) : promptHistory.length === 0 ? (
                <div className="text-center py-12 text-gray-400">
                  <FileText size={48} className="mx-auto mb-4 opacity-50" />
                  <p>Aún no has generado ningún prompt</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {promptHistory.map((item) => (
                    <div key={item.id} className="bg-black/30 border border-white/10 rounded-lg p-4 hover:border-cyan-500/30 transition-colors">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center space-x-2 text-sm text-gray-400">
                          <Calendar size={16} />
                          <span>{new Date(item.generated_at).toLocaleString('es-ES')}</span>
                        </div>
                        <button
                          onClick={() => deletePrompt(item.id)}
                          className="text-red-400 hover:text-red-300 transition"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                      <p className="text-gray-300 text-sm mb-2 line-clamp-3">
                        {item.prompt_text}
                      </p>
                      {(item.preset_used || item.scenario_used) && (
                        <div className="flex flex-wrap gap-2 mt-2">
                          {item.preset_used && (
                            <span className="text-xs px-2 py-1 bg-purple-500/20 text-purple-400 rounded">
                              {item.preset_used}
                            </span>
                          )}
                          {item.scenario_used && (
                            <span className="text-xs px-2 py-1 bg-cyan-500/20 text-cyan-400 rounded">
                              {item.scenario_used}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB: CONFIGURACIÓN */}
          {activeTab === 'settings' && (
            <div className="space-y-8">
              
              {/* Cambiar Contraseña */}
              <div>
                <h3 className="text-xl font-bold mb-4 flex items-center space-x-2">
                  <Lock size={20} />
                  <span>Cambiar Contraseña</span>
                </h3>
                <form onSubmit={handleChangePassword} className="space-y-4 max-w-md">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Nueva Contraseña
                    </label>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-gray-300 focus:ring-2 focus:ring-cyan-500 focus:outline-none"
                      placeholder="Mínimo 6 caracteres"
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
                      placeholder="Repite la contraseña"
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-6 py-3 rounded-lg font-bold hover:shadow-xl hover:shadow-cyan-500/20 transition-all disabled:opacity-50"
                  >
                    {loading ? 'Actualizando...' : 'Actualizar Contraseña'}
                  </button>
                </form>
              </div>

              <div className="border-t border-white/10 pt-8">
                <h3 className="text-xl font-bold mb-4 text-red-400 flex items-center space-x-2">
                  <Trash2 size={20} />
                  <span>Zona Peligrosa</span>
                </h3>
                <p className="text-gray-400 mb-4">
                  Una vez eliminada tu cuenta, no hay vuelta atrás. Por favor, asegúrate de que esto es lo que quieres.
                </p>
                <button
                  onClick={handleDeleteAccount}
                  disabled={loading}
                  className="bg-red-500/10 border border-red-500/30 text-red-400 px-6 py-3 rounded-lg font-bold hover:bg-red-500/20 transition-all disabled:opacity-50"
                >
                  Eliminar Cuenta Permanentemente
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}