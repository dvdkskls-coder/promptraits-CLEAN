import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const CookieBanner = () => {
  const [showBanner, setShowBanner] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [preferences, setPreferences] = useState({
    essential: true, // Siempre true, no se puede desactivar
    analytics: false,
    preferences: false
  });

  useEffect(() => {
    // Verificar si el usuario ya dio su consentimiento
    const consent = localStorage.getItem('cookie-consent');
    if (!consent) {
      // Pequeño delay para que no aparezca inmediatamente
      setTimeout(() => setShowBanner(true), 1000);
    }
  }, []);

  const handleAcceptAll = () => {
    const fullConsent = {
      essential: true,
      analytics: true,
      preferences: true,
      timestamp: new Date().toISOString()
    };
    localStorage.setItem('cookie-consent', JSON.stringify(fullConsent));
    setShowBanner(false);
    
    // Aquí puedes inicializar Google Analytics u otras cookies analíticas
    // initializeAnalytics();
  };

  const handleRejectOptional = () => {
    const minimalConsent = {
      essential: true,
      analytics: false,
      preferences: false,
      timestamp: new Date().toISOString()
    };
    localStorage.setItem('cookie-consent', JSON.stringify(minimalConsent));
    setShowBanner(false);
  };

  const handleSavePreferences = () => {
    const customConsent = {
      ...preferences,
      timestamp: new Date().toISOString()
    };
    localStorage.setItem('cookie-consent', JSON.stringify(customConsent));
    setShowBanner(false);
    
    // Inicializar cookies según preferencias
    if (preferences.analytics) {
      // initializeAnalytics();
    }
  };

  const togglePreference = (key) => {
    if (key === 'essential') return; // No se puede desactivar
    setPreferences(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  if (!showBanner) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-4 animate-fade-in">
      <div className="bg-[#1a1a1a] border border-amber-900/30 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        
        {/* Simple View */}
        {!showSettings && (
          <div className="p-6 sm:p-8">
            {/* Header */}
            <div className="flex items-start mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-amber-600 rounded-lg flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4 flex-1">
                <h2 className="text-2xl font-bold text-white mb-2">🍪 Cookies en Promptraits</h2>
                <p className="text-gray-300 text-sm leading-relaxed">
                  Usamos cookies esenciales para que el sitio funcione correctamente. También usamos cookies 
                  opcionales para mejorar tu experiencia y analizar el uso del sitio.
                </p>
              </div>
            </div>

            {/* Info Cards */}
            <div className="space-y-3 mb-6">
              <div className="bg-green-900/10 border border-green-500/30 rounded-lg p-3">
                <div className="flex items-start">
                  <svg className="w-5 h-5 text-green-400 mr-2 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <h3 className="text-green-300 font-semibold text-sm">Cookies Esenciales</h3>
                    <p className="text-gray-400 text-xs mt-1">
                      Necesarias para login, sesión y seguridad. No se pueden desactivar.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-blue-900/10 border border-blue-500/30 rounded-lg p-3">
                <div className="flex items-start">
                  <svg className="w-5 h-5 text-blue-400 mr-2 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  <div>
                    <h3 className="text-blue-300 font-semibold text-sm">Cookies Analíticas (Opcionales)</h3>
                    <p className="text-gray-400 text-xs mt-1">
                      Nos ayudan a entender cómo usas el sitio para mejorarlo. Datos anónimos.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Privacy Link */}
            <p className="text-sm text-gray-400 mb-6">
              Lee nuestra{' '}
              <Link to="/legal/cookies" className="text-amber-400 hover:text-amber-300 underline">
                Política de Cookies completa
              </Link>
              {' '}para más información.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleAcceptAll}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-600 text-black font-semibold rounded-lg hover:from-amber-600 hover:to-amber-700 transition-all"
              >
                Aceptar todas
              </button>
              <button
                onClick={handleRejectOptional}
                className="flex-1 px-6 py-3 bg-[#0d0d0d] text-gray-300 font-semibold rounded-lg border border-gray-700 hover:bg-gray-800 transition-all"
              >
                Solo esenciales
              </button>
              <button
                onClick={() => setShowSettings(true)}
                className="px-6 py-3 text-amber-400 font-semibold hover:text-amber-300 transition-colors"
              >
                Personalizar
              </button>
            </div>
          </div>
        )}

        {/* Settings View */}
        {showSettings && (
          <div className="p-6 sm:p-8">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">Preferencias de Cookies</h2>
              <button
                onClick={() => setShowSettings(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Cookie Categories */}
            <div className="space-y-4 mb-6">
              
              {/* Essential Cookies */}
              <div className="bg-[#0d0d0d] border border-green-500/30 rounded-lg p-4">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h3 className="text-white font-semibold mb-1 flex items-center">
                      <svg className="w-4 h-4 text-green-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                      Cookies Esenciales
                    </h3>
                    <p className="text-gray-400 text-sm">
                      Necesarias para autenticación, sesión y seguridad. No se pueden desactivar.
                    </p>
                  </div>
                  <div className="ml-4">
                    <div className="w-12 h-6 bg-green-500 rounded-full flex items-center justify-end px-1 cursor-not-allowed">
                      <div className="w-5 h-5 bg-white rounded-full shadow"></div>
                    </div>
                  </div>
                </div>
                <div className="text-xs text-gray-500 mt-2">
                  Ejemplos: session_token, auth_token, csrf_token
                </div>
              </div>

              {/* Analytics Cookies */}
              <div className="bg-[#0d0d0d] border border-amber-900/30 rounded-lg p-4">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h3 className="text-white font-semibold mb-1 flex items-center">
                      <svg className="w-4 h-4 text-blue-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                      Cookies Analíticas
                    </h3>
                    <p className="text-gray-400 text-sm">
                      Nos ayudan a entender cómo usas el sitio. Los datos son anónimos y agregados.
                    </p>
                  </div>
                  <button
                    onClick={() => togglePreference('analytics')}
                    className="ml-4"
                  >
                    <div className={`w-12 h-6 rounded-full flex items-center transition-all ${
                      preferences.analytics 
                        ? 'bg-amber-500 justify-end' 
                        : 'bg-gray-600 justify-start'
                    } px-1`}>
                      <div className="w-5 h-5 bg-white rounded-full shadow"></div>
                    </div>
                  </button>
                </div>
                <div className="text-xs text-gray-500 mt-2">
                  Ejemplos: _ga, _gid (Google Analytics)
                </div>
              </div>

              {/* Preference Cookies */}
              <div className="bg-[#0d0d0d] border border-amber-900/30 rounded-lg p-4">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h3 className="text-white font-semibold mb-1 flex items-center">
                      <svg className="w-4 h-4 text-purple-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      Cookies de Preferencias
                    </h3>
                    <p className="text-gray-400 text-sm">
                      Guardan tus configuraciones personales (tema, idioma, etc.).
                    </p>
                  </div>
                  <button
                    onClick={() => togglePreference('preferences')}
                    className="ml-4"
                  >
                    <div className={`w-12 h-6 rounded-full flex items-center transition-all ${
                      preferences.preferences 
                        ? 'bg-amber-500 justify-end' 
                        : 'bg-gray-600 justify-start'
                    } px-1`}>
                      <div className="w-5 h-5 bg-white rounded-full shadow"></div>
                    </div>
                  </button>
                </div>
                <div className="text-xs text-gray-500 mt-2">
                  Ejemplos: theme_preference, language
                </div>
              </div>
            </div>

            {/* Info */}
            <p className="text-sm text-gray-400 mb-6">
              Puedes cambiar estas preferencias en cualquier momento desde la configuración de tu cuenta o desde la{' '}
              <Link to="/legal/cookies" className="text-amber-400 hover:text-amber-300 underline">
                Política de Cookies
              </Link>.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleSavePreferences}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-600 text-black font-semibold rounded-lg hover:from-amber-600 hover:to-amber-700 transition-all"
              >
                Guardar preferencias
              </button>
              <button
                onClick={() => setShowSettings(false)}
                className="px-6 py-3 text-gray-400 font-semibold hover:text-white transition-colors"
              >
                Cancelar
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CookieBanner;
