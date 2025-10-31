import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Contacto = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [status, setStatus] = useState('idle'); // idle, sending, success, error

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('sending');

    // Aquí integrarías con tu backend o servicio de email
    // Por ahora, simulamos el envío
    try {
      // Ejemplo con mailto (básico)
      const mailtoLink = `mailto:soporte@promptraits.com?subject=${encodeURIComponent(formData.subject)}&body=${encodeURIComponent(
        `Nombre: ${formData.name}\nEmail: ${formData.email}\n\nMensaje:\n${formData.message}`
      )}`;
      window.location.href = mailtoLink;
      
      setStatus('success');
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (error) {
      setStatus('error');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0a0a] to-[#1a1a1a]">
      <div className="max-w-6xl mx-auto px-4 py-16">
        {/* Back Button */}
        <Link 
          to="/" 
          className="inline-flex items-center text-amber-500 hover:text-amber-400 mb-8 transition-colors"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Volver al inicio
        </Link>

        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent mb-4">
            Contacta con Nosotros
          </h1>
          <p className="text-gray-400 text-lg">
            ¿Tienes preguntas? Estamos aquí para ayudarte
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div className="bg-[#1a1a1a] rounded-2xl border border-amber-900/20 p-8">
            <h2 className="text-2xl font-bold text-white mb-6">Envíanos un mensaje</h2>
            
            {status === 'success' && (
              <div className="mb-6 p-4 bg-green-900/20 border border-green-500/30 rounded-lg">
                <p className="text-green-300 flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  ¡Mensaje enviado! Te responderemos pronto.
                </p>
              </div>
            )}

            {status === 'error' && (
              <div className="mb-6 p-4 bg-red-900/20 border border-red-500/30 rounded-lg">
                <p className="text-red-300">
                  Hubo un error. Por favor, escríbenos directamente a soporte@promptraits.com
                </p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Name */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                  Nombre completo *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-[#0d0d0d] border border-amber-900/20 rounded-lg text-white placeholder-gray-500 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors"
                  placeholder="Tu nombre"
                />
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-[#0d0d0d] border border-amber-900/20 rounded-lg text-white placeholder-gray-500 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors"
                  placeholder="tu@email.com"
                />
              </div>

              {/* Subject */}
              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-300 mb-2">
                  Asunto *
                </label>
                <select
                  id="subject"
                  name="subject"
                  required
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-[#0d0d0d] border border-amber-900/20 rounded-lg text-white focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors"
                >
                  <option value="">Selecciona un tema</option>
                  <option value="soporte">Soporte Técnico</option>
                  <option value="facturacion">Facturación y Pagos</option>
                  <option value="reembolso">Solicitud de Reembolso</option>
                  <option value="sugerencia">Sugerencias y Feedback</option>
                  <option value="comercial">Consulta Comercial / Enterprise</option>
                  <option value="legal">Cuestiones Legales</option>
                  <option value="otro">Otro</option>
                </select>
              </div>

              {/* Message */}
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-2">
                  Mensaje *
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  value={formData.message}
                  onChange={handleChange}
                  rows="6"
                  className="w-full px-4 py-3 bg-[#0d0d0d] border border-amber-900/20 rounded-lg text-white placeholder-gray-500 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors resize-none"
                  placeholder="Cuéntanos en qué podemos ayudarte..."
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={status === 'sending'}
                className="w-full px-6 py-4 bg-gradient-to-r from-amber-500 to-amber-600 text-black font-semibold rounded-lg hover:from-amber-600 hover:to-amber-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {status === 'sending' ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Enviando...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                    Enviar mensaje
                  </>
                )}
              </button>

              <p className="text-sm text-gray-400 text-center">
                Responderemos en 24-48 horas laborables
              </p>
            </form>
          </div>

          {/* Contact Info */}
          <div className="space-y-6">
            {/* Email Cards */}
            <div className="bg-[#1a1a1a] rounded-2xl border border-amber-900/20 p-6">
              <div className="flex items-start">
                <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-amber-600 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-semibold text-white mb-2">Soporte General</h3>
                  <a href="mailto:soporte@promptraits.com" className="text-amber-400 hover:text-amber-300 transition-colors">
                    soporte@promptraits.com
                  </a>
                  <p className="text-gray-400 text-sm mt-1">Para consultas técnicas y ayuda</p>
                </div>
              </div>
            </div>

            <div className="bg-[#1a1a1a] rounded-2xl border border-amber-900/20 p-6">
              <div className="flex items-start">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-semibold text-white mb-2">Facturación</h3>
                  <a href="mailto:facturacion@promptraits.com" className="text-amber-400 hover:text-amber-300 transition-colors">
                    facturacion@promptraits.com
                  </a>
                  <p className="text-gray-400 text-sm mt-1">Pagos, facturas y suscripciones</p>
                </div>
              </div>
            </div>

            <div className="bg-[#1a1a1a] rounded-2xl border border-amber-900/20 p-6">
              <div className="flex items-start">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-semibold text-white mb-2">Ventas Enterprise</h3>
                  <a href="mailto:ventas@promptraits.com" className="text-amber-400 hover:text-amber-300 transition-colors">
                    ventas@promptraits.com
                  </a>
                  <p className="text-gray-400 text-sm mt-1">Planes personalizados y empresas</p>
                </div>
              </div>
            </div>

            <div className="bg-[#1a1a1a] rounded-2xl border border-amber-900/20 p-6">
              <div className="flex items-start">
                <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-semibold text-white mb-2">Legal y Privacidad</h3>
                  <a href="mailto:legal@promptraits.com" className="text-amber-400 hover:text-amber-300 transition-colors">
                    legal@promptraits.com
                  </a>
                  <p className="text-gray-400 text-sm mt-1">Asuntos legales y RGPD</p>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div className="bg-gradient-to-r from-amber-900/20 to-amber-800/20 rounded-2xl border border-amber-500/30 p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Enlaces Rápidos</h3>
              <div className="space-y-2">
                <Link to="/faq" className="text-amber-400 hover:text-amber-300 transition-colors block">
                  → Preguntas Frecuentes
                </Link>
                <Link to="/legal/privacidad" className="text-amber-400 hover:text-amber-300 transition-colors block">
                  → Política de Privacidad
                </Link>
                <Link to="/legal/reembolsos" className="text-amber-400 hover:text-amber-300 transition-colors block">
                  → Política de Reembolsos
                </Link>
                <a href="#guide" className="text-amber-400 hover:text-amber-300 transition-colors block">
                  → Guía de Uso
                </a>
              </div>
            </div>

            {/* Hours */}
            <div className="bg-[#1a1a1a] rounded-2xl border border-amber-900/20 p-6">
              <h3 className="text-lg font-semibold text-white mb-3">Horario de Atención</h3>
              <div className="space-y-2 text-gray-300 text-sm">
                <div className="flex justify-between">
                  <span>Lunes - Viernes:</span>
                  <span className="text-amber-400">9:00 - 18:00 CET</span>
                </div>
                <div className="flex justify-between">
                  <span>Sábados - Domingos:</span>
                  <span className="text-gray-500">Cerrado</span>
                </div>
                <p className="text-xs text-gray-400 mt-3 pt-3 border-t border-gray-800">
                  * Los mensajes enviados fuera del horario se responderán el siguiente día laborable
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contacto;
