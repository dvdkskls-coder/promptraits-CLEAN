import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-b from-[#1a1a1a] to-[#0d0d0d] border-t border-amber-900/20">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Brand Column */}
          <div className="col-span-1">
            {/* Logo Real de Promptraits */}
            <div className="mb-4">
              <img src="/logo.svg" alt="Promptraits" className="w-40 h-auto" />
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Genera prompts ultra-realistas para IA con precisión técnica profesional.
            </p>
            
            {/* Redes Sociales - Instagram y Telegram */}
            <div className="mt-4 flex space-x-3">
              {/* Instagram */}
              <a 
                href="https://www.instagram.com/sr_waly/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-amber-500 transition-colors"
                aria-label="Instagram"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
              
              {/* Telegram */}
              <a 
                href="https://t.me/+nyMJxze9il4wZGJk" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-amber-500 transition-colors"
                aria-label="Telegram"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.14.18-.357.295-.6.295-.002 0-.003 0-.005 0l.213-3.054 5.56-5.022c.24-.213-.054-.334-.373-.121l-6.869 4.326-2.96-.924c-.64-.203-.658-.64.135-.954l11.566-4.458c.538-.196 1.006.128.832.941z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Product Column */}
          <div className="col-span-1">
            <h3 className="text-white font-semibold mb-4">Producto</h3>
            <ul className="space-y-2">
              <li>
                <a href="#features" className="text-gray-400 hover:text-amber-500 transition-colors text-sm">
                  Características
                </a>
              </li>
              <li>
                <a href="#pricing" className="text-gray-400 hover:text-amber-500 transition-colors text-sm">
                  Planes y Precios
                </a>
              </li>
              <li>
                <a href="#examples" className="text-gray-400 hover:text-amber-500 transition-colors text-sm">
                  Ejemplos
                </a>
              </li>
              <li>
                <a href="#guide" className="text-gray-400 hover:text-amber-500 transition-colors text-sm">
                  Guía de Uso
                </a>
              </li>
            </ul>
          </div>

          {/* Legal Column */}
          <div className="col-span-1">
            <h3 className="text-white font-semibold mb-4">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/legal/aviso-legal" className="text-gray-400 hover:text-amber-500 transition-colors text-sm">
                  Aviso Legal
                </Link>
              </li>
              <li>
                <Link to="/legal/privacidad" className="text-gray-400 hover:text-amber-500 transition-colors text-sm">
                  Política de Privacidad
                </Link>
              </li>
              <li>
                <Link to="/legal/terminos" className="text-gray-400 hover:text-amber-500 transition-colors text-sm">
                  Términos y Condiciones
                </Link>
              </li>
              <li>
                <Link to="/legal/cookies" className="text-gray-400 hover:text-amber-500 transition-colors text-sm">
                  Política de Cookies
                </Link>
              </li>
              <li>
                <Link to="/legal/reembolsos" className="text-gray-400 hover:text-amber-500 transition-colors text-sm">
                  Reembolsos
                </Link>
              </li>
            </ul>
          </div>

          {/* Support Column */}
          <div className="col-span-1">
            <h3 className="text-white font-semibold mb-4">Soporte</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/faq" className="text-gray-400 hover:text-amber-500 transition-colors text-sm">
                  Preguntas Frecuentes
                </Link>
              </li>
              <li>
                <Link to="/contacto" className="text-gray-400 hover:text-amber-500 transition-colors text-sm">
                  Contacto
                </Link>
              </li>
              <li>
                <a href="mailto:soporte@promptraits.com" className="text-gray-400 hover:text-amber-500 transition-colors text-sm">
                  soporte@promptraits.com
                </a>
              </li>
              <li>
                <a href="#status" className="text-gray-400 hover:text-amber-500 transition-colors text-sm inline-flex items-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
                  Estado del Servicio
                </a>
              </li>
            </ul>
          </div>

        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-amber-900/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-gray-400 text-sm text-center md:text-left">
              © {currentYear} <span className="text-amber-500 font-semibold">Promptraits by Sr. Waly</span>. Todos los derechos reservados.
            </div>
            <div className="flex items-center space-x-6 text-sm">
              <span className="text-gray-500">Hecho con</span>
              <span className="text-red-500 animate-pulse">❤️</span>
              <span className="text-gray-500">en España</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
