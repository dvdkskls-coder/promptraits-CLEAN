import React from 'react';
import { useParams, Link } from 'react-router-dom';

const LegalPages = () => {
  const { page } = useParams();

  const pageContent = {
    'aviso-legal': <AvisoLegal />,
    'privacidad': <Privacidad />,
    'terminos': <Terminos />,
    'cookies': <Cookies />,
    'reembolsos': <Reembolsos />,
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0a0a] to-[#1a1a1a]">
      <div className="max-w-4xl mx-auto px-4 py-16">
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

        {/* Content */}
        <div className="bg-[#1a1a1a] rounded-2xl border border-amber-900/20 p-8 md:p-12">
          {pageContent[page] || <NotFound />}
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// AVISO LEGAL
// ============================================================================
const AvisoLegal = () => (
  <div className="prose prose-invert prose-amber max-w-none">
    <h1 className="text-4xl font-bold bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent mb-8">
      Aviso Legal
    </h1>
    
    <p className="text-gray-300 text-sm mb-8">
      Última actualización: {new Date().toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}
    </p>

    <section className="mb-8">
      <h2 className="text-2xl font-semibold text-white mb-4">1. Identificación del Titular</h2>
      <div className="bg-[#0d0d0d] border border-amber-900/20 rounded-lg p-6 text-gray-300">
        <p className="mb-2"><strong className="text-amber-500">Titular:</strong> [Tu Nombre/Razón Social]</p>
        <p className="mb-2"><strong className="text-amber-500">NIF/CIF:</strong> [Tu NIF/CIF]</p>
        <p className="mb-2"><strong className="text-amber-500">Domicilio:</strong> [Tu Dirección Completa]</p>
        <p className="mb-2"><strong className="text-amber-500">Email:</strong> <a href="mailto:legal@promptraits.com" className="text-amber-400 hover:text-amber-300">legal@promptraits.com</a></p>
        <p><strong className="text-amber-500">Web:</strong> <a href="https://promptraits.com" className="text-amber-400 hover:text-amber-300">promptraits.com</a></p>
      </div>
    </section>

    <section className="mb-8">
      <h2 className="text-2xl font-semibold text-white mb-4">2. Objeto del Servicio</h2>
      <p className="text-gray-300 leading-relaxed">
        Promptraits es una plataforma web que ofrece un servicio de generación automática de prompts 
        ultra-realistas para sistemas de inteligencia artificial generativa de imágenes. El servicio 
        permite a los usuarios crear descripciones técnicas profesionales basadas en fotografía 
        cinematográfica y editorial.
      </p>
    </section>

    <section className="mb-8">
      <h2 className="text-2xl font-semibold text-white mb-4">3. Condiciones de Uso</h2>
      <ul className="space-y-3 text-gray-300">
        <li className="flex items-start">
          <span className="text-amber-500 mr-2">•</span>
          <span>El acceso y uso de esta plataforma implica la aceptación de los presentes términos legales.</span>
        </li>
        <li className="flex items-start">
          <span className="text-amber-500 mr-2">•</span>
          <span>El usuario se compromete a hacer un uso adecuado del servicio conforme a la legislación vigente.</span>
        </li>
        <li className="flex items-start">
          <span className="text-amber-500 mr-2">•</span>
          <span>Queda prohibido cualquier uso fraudulento, ilegal o que vulnere derechos de terceros.</span>
        </li>
      </ul>
    </section>

    <section className="mb-8">
      <h2 className="text-2xl font-semibold text-white mb-4">4. Propiedad Intelectual e Industrial</h2>
      <p className="text-gray-300 leading-relaxed mb-4">
        Todos los contenidos de esta plataforma (textos, diseños, gráficos, código, logotipos, etc.) 
        son propiedad de Promptraits o de sus legítimos propietarios y están protegidos por las leyes 
        de propiedad intelectual e industrial.
      </p>
      <div className="bg-amber-900/10 border-l-4 border-amber-500 p-4 rounded">
        <p className="text-amber-200 font-semibold mb-2">Importante sobre los prompts generados:</p>
        <p className="text-gray-300 text-sm">
          Los prompts generados por nuestro sistema son de propiedad del usuario que los genera. 
          El usuario tiene pleno derecho a utilizarlos comercialmente sin restricciones.
        </p>
      </div>
    </section>

    <section className="mb-8">
      <h2 className="text-2xl font-semibold text-white mb-4">5. Limitación de Responsabilidad</h2>
      <p className="text-gray-300 leading-relaxed">
        Promptraits no se hace responsable de:
      </p>
      <ul className="space-y-2 text-gray-300 mt-4">
        <li className="flex items-start">
          <span className="text-amber-500 mr-2">•</span>
          <span>Los resultados obtenidos al utilizar los prompts en plataformas de terceros (Midjourney, Stable Diffusion, etc.)</span>
        </li>
        <li className="flex items-start">
          <span className="text-amber-500 mr-2">•</span>
          <span>El uso indebido que terceros puedan hacer de los prompts generados</span>
        </li>
        <li className="flex items-start">
          <span className="text-amber-500 mr-2">•</span>
          <span>Interrupciones temporales del servicio por mantenimiento o causas de fuerza mayor</span>
        </li>
      </ul>
    </section>

    <section className="mb-8">
      <h2 className="text-2xl font-semibold text-white mb-4">6. Legislación Aplicable</h2>
      <p className="text-gray-300 leading-relaxed">
        Las presentes condiciones se rigen por la legislación española. Para cualquier controversia, 
        las partes se someten a los Juzgados y Tribunales del domicilio del usuario consumidor.
      </p>
    </section>

    <section>
      <h2 className="text-2xl font-semibold text-white mb-4">7. Contacto</h2>
      <p className="text-gray-300 leading-relaxed">
        Para cualquier consulta relacionada con este aviso legal, puede contactarnos en:{' '}
        <a href="mailto:legal@promptraits.com" className="text-amber-400 hover:text-amber-300">
          legal@promptraits.com
        </a>
      </p>
    </section>
  </div>
);

// ============================================================================
// POLÍTICA DE PRIVACIDAD
// ============================================================================
const Privacidad = () => (
  <div className="prose prose-invert prose-amber max-w-none">
    <h1 className="text-4xl font-bold bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent mb-8">
      Política de Privacidad
    </h1>
    
    <p className="text-gray-300 text-sm mb-8">
      Última actualización: {new Date().toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}
    </p>

    <section className="mb-8">
      <h2 className="text-2xl font-semibold text-white mb-4">1. Responsable del Tratamiento</h2>
      <div className="bg-[#0d0d0d] border border-amber-900/20 rounded-lg p-6 text-gray-300">
        <p className="mb-2"><strong className="text-amber-500">Responsable:</strong> [Tu Nombre/Razón Social]</p>
        <p className="mb-2"><strong className="text-amber-500">NIF/CIF:</strong> [Tu NIF/CIF]</p>
        <p className="mb-2"><strong className="text-amber-500">Email:</strong> <a href="mailto:privacidad@promptraits.com" className="text-amber-400 hover:text-amber-300">privacidad@promptraits.com</a></p>
      </div>
    </section>

    <section className="mb-8">
      <h2 className="text-2xl font-semibold text-white mb-4">2. Datos que Recopilamos</h2>
      
      <div className="bg-green-900/10 border-l-4 border-green-500 p-4 rounded mb-6">
        <p className="text-green-200 font-semibold mb-2">✓ NO almacenamos imágenes</p>
        <p className="text-gray-300 text-sm">
          Las imágenes de referencia que subes se procesan únicamente para analizar características 
          técnicas y se eliminan inmediatamente. NO guardamos ninguna fotografía en nuestros servidores.
        </p>
      </div>

      <h3 className="text-xl font-semibold text-amber-400 mb-3">Datos que SÍ recopilamos:</h3>
      <ul className="space-y-3 text-gray-300">
        <li className="flex items-start">
          <span className="text-amber-500 mr-2">•</span>
          <span><strong>Datos de cuenta:</strong> email, nombre de usuario, contraseña encriptada</span>
        </li>
        <li className="flex items-start">
          <span className="text-amber-500 mr-2">•</span>
          <span><strong>Datos de pago:</strong> procesados por Stripe (nosotros NO almacenamos datos de tarjetas)</span>
        </li>
        <li className="flex items-start">
          <span className="text-amber-500 mr-2">•</span>
          <span><strong>Prompts generados:</strong> guardamos los prompts de texto que generas para tu historial</span>
        </li>
        <li className="flex items-start">
          <span className="text-amber-500 mr-2">•</span>
          <span><strong>Datos de uso:</strong> créditos consumidos, planes contratados, fecha de registro</span>
        </li>
        <li className="flex items-start">
          <span className="text-amber-500 mr-2">•</span>
          <span><strong>Datos técnicos:</strong> dirección IP, navegador, sistema operativo (para seguridad)</span>
        </li>
      </ul>
    </section>

    <section className="mb-8">
      <h2 className="text-2xl font-semibold text-white mb-4">3. Finalidad del Tratamiento</h2>
      <p className="text-gray-300 mb-4">Utilizamos tus datos para:</p>
      <ul className="space-y-2 text-gray-300">
        <li className="flex items-start">
          <span className="text-amber-500 mr-2">•</span>
          <span>Gestionar tu cuenta de usuario y proporcionar el servicio</span>
        </li>
        <li className="flex items-start">
          <span className="text-amber-500 mr-2">•</span>
          <span>Procesar pagos y gestionar suscripciones</span>
        </li>
        <li className="flex items-start">
          <span className="text-amber-500 mr-2">•</span>
          <span>Guardar tu historial de prompts generados</span>
        </li>
        <li className="flex items-start">
          <span className="text-amber-500 mr-2">•</span>
          <span>Enviar comunicaciones relacionadas con el servicio</span>
        </li>
        <li className="flex items-start">
          <span className="text-amber-500 mr-2">•</span>
          <span>Mejorar nuestro servicio mediante análisis anónimos de uso</span>
        </li>
      </ul>
    </section>

    <section className="mb-8">
      <h2 className="text-2xl font-semibold text-white mb-4">4. Base Jurídica</h2>
      <p className="text-gray-300 leading-relaxed">
        El tratamiento de tus datos se basa en:
      </p>
      <ul className="space-y-2 text-gray-300 mt-4">
        <li className="flex items-start">
          <span className="text-amber-500 mr-2">•</span>
          <span><strong>Ejecución del contrato:</strong> necesitamos tus datos para prestarte el servicio</span>
        </li>
        <li className="flex items-start">
          <span className="text-amber-500 mr-2">•</span>
          <span><strong>Consentimiento:</strong> para comunicaciones de marketing (opcional)</span>
        </li>
        <li className="flex items-start">
          <span className="text-amber-500 mr-2">•</span>
          <span><strong>Interés legítimo:</strong> para mejorar el servicio y prevenir fraudes</span>
        </li>
      </ul>
    </section>

    <section className="mb-8">
      <h2 className="text-2xl font-semibold text-white mb-4">5. Conservación de Datos</h2>
      <div className="grid md:grid-cols-2 gap-4 text-gray-300">
        <div className="bg-[#0d0d0d] border border-amber-900/20 rounded-lg p-4">
          <h4 className="text-amber-400 font-semibold mb-2">Imágenes subidas</h4>
          <p className="text-sm">Se eliminan <strong className="text-white">inmediatamente</strong> tras el análisis</p>
        </div>
        <div className="bg-[#0d0d0d] border border-amber-900/20 rounded-lg p-4">
          <h4 className="text-amber-400 font-semibold mb-2">Datos de cuenta</h4>
          <p className="text-sm">Mientras la cuenta esté activa + 1 año tras baja</p>
        </div>
        <div className="bg-[#0d0d0d] border border-amber-900/20 rounded-lg p-4">
          <h4 className="text-amber-400 font-semibold mb-2">Prompts generados</h4>
          <p className="text-sm">Mientras la cuenta esté activa o hasta que los elimines</p>
        </div>
        <div className="bg-[#0d0d0d] border border-amber-900/20 rounded-lg p-4">
          <h4 className="text-amber-400 font-semibold mb-2">Datos de facturación</h4>
          <p className="text-sm">6 años (obligación legal fiscal)</p>
        </div>
      </div>
    </section>

    <section className="mb-8">
      <h2 className="text-2xl font-semibold text-white mb-4">6. Destinatarios de los Datos</h2>
      <p className="text-gray-300 mb-4">Compartimos tus datos únicamente con:</p>
      <ul className="space-y-3 text-gray-300">
        <li className="flex items-start">
          <span className="text-amber-500 mr-2">•</span>
          <div>
            <strong className="text-white">Stripe:</strong> Procesador de pagos (cumple PCI-DSS y RGPD)
            <p className="text-sm text-gray-400 mt-1">Para gestionar cobros y suscripciones</p>
          </div>
        </li>
        <li className="flex items-start">
          <span className="text-amber-500 mr-2">•</span>
          <div>
            <strong className="text-white">Supabase:</strong> Proveedor de base de datos (servidores en UE)
            <p className="text-sm text-gray-400 mt-1">Para almacenar tu cuenta y prompts</p>
          </div>
        </li>
        <li className="flex items-start">
          <span className="text-amber-500 mr-2">•</span>
          <div>
            <strong className="text-white">Google Gemini API:</strong> Procesamiento de análisis de imágenes
            <p className="text-sm text-gray-400 mt-1">Las imágenes NO se almacenan, solo se procesan temporalmente</p>
          </div>
        </li>
      </ul>
    </section>

    <section className="mb-8">
      <h2 className="text-2xl font-semibold text-white mb-4">7. Tus Derechos (RGPD)</h2>
      <div className="bg-amber-900/10 border border-amber-500/30 rounded-lg p-6">
        <p className="text-amber-200 mb-4">Tienes derecho a:</p>
        <div className="grid md:grid-cols-2 gap-3 text-gray-300 text-sm">
          <div className="flex items-start">
            <span className="text-amber-500 mr-2">✓</span>
            <span><strong>Acceso:</strong> Consultar qué datos tenemos</span>
          </div>
          <div className="flex items-start">
            <span className="text-amber-500 mr-2">✓</span>
            <span><strong>Rectificación:</strong> Corregir datos incorrectos</span>
          </div>
          <div className="flex items-start">
            <span className="text-amber-500 mr-2">✓</span>
            <span><strong>Supresión:</strong> Eliminar tu cuenta y datos</span>
          </div>
          <div className="flex items-start">
            <span className="text-amber-500 mr-2">✓</span>
            <span><strong>Portabilidad:</strong> Exportar tus prompts</span>
          </div>
          <div className="flex items-start">
            <span className="text-amber-500 mr-2">✓</span>
            <span><strong>Oposición:</strong> Rechazar ciertos tratamientos</span>
          </div>
          <div className="flex items-start">
            <span className="text-amber-500 mr-2">✓</span>
            <span><strong>Limitación:</strong> Restringir el procesamiento</span>
          </div>
        </div>
        <p className="text-gray-300 mt-4">
          Para ejercer tus derechos: <a href="mailto:privacidad@promptraits.com" className="text-amber-400 hover:text-amber-300">privacidad@promptraits.com</a>
        </p>
      </div>
    </section>

    <section className="mb-8">
      <h2 className="text-2xl font-semibold text-white mb-4">8. Seguridad</h2>
      <p className="text-gray-300 leading-relaxed mb-4">
        Implementamos medidas de seguridad técnicas y organizativas para proteger tus datos:
      </p>
      <ul className="space-y-2 text-gray-300">
        <li className="flex items-start">
          <span className="text-amber-500 mr-2">•</span>
          <span>Cifrado SSL/TLS en todas las comunicaciones</span>
        </li>
        <li className="flex items-start">
          <span className="text-amber-500 mr-2">•</span>
          <span>Contraseñas hasheadas con algoritmos seguros</span>
        </li>
        <li className="flex items-start">
          <span className="text-amber-500 mr-2">•</span>
          <span>Copias de seguridad periódicas</span>
        </li>
        <li className="flex items-start">
          <span className="text-amber-500 mr-2">•</span>
          <span>Acceso restringido a datos personales</span>
        </li>
      </ul>
    </section>

    <section>
      <h2 className="text-2xl font-semibold text-white mb-4">9. Contacto</h2>
      <p className="text-gray-300 leading-relaxed">
        Para cualquier duda sobre privacidad, contacta con:{' '}
        <a href="mailto:privacidad@promptraits.com" className="text-amber-400 hover:text-amber-300">
          privacidad@promptraits.com
        </a>
      </p>
      <p className="text-gray-400 text-sm mt-4">
        También puedes presentar una reclamación ante la Agencia Española de Protección de Datos (AEPD).
      </p>
    </section>
  </div>
);

// ============================================================================
// TÉRMINOS Y CONDICIONES
// ============================================================================
const Terminos = () => (
  <div className="prose prose-invert prose-amber max-w-none">
    <h1 className="text-4xl font-bold bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent mb-8">
      Términos y Condiciones de Uso
    </h1>
    
    <p className="text-gray-300 text-sm mb-8">
      Última actualización: {new Date().toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}
    </p>

    <section className="mb-8">
      <h2 className="text-2xl font-semibold text-white mb-4">1. Aceptación de los Términos</h2>
      <p className="text-gray-300 leading-relaxed">
        Al acceder y utilizar Promptraits, aceptas estos Términos y Condiciones en su totalidad. 
        Si no estás de acuerdo, no utilices el servicio.
      </p>
    </section>

    <section className="mb-8">
      <h2 className="text-2xl font-semibold text-white mb-4">2. Descripción del Servicio</h2>
      <p className="text-gray-300 leading-relaxed mb-4">
        Promptraits proporciona un servicio automatizado de generación de prompts técnicos para IA 
        generativa de imágenes. El servicio incluye:
      </p>
      <ul className="space-y-2 text-gray-300">
        <li className="flex items-start">
          <span className="text-amber-500 mr-2">•</span>
          <span>Análisis opcional de imágenes de referencia (no almacenadas)</span>
        </li>
        <li className="flex items-start">
          <span className="text-amber-500 mr-2">•</span>
          <span>Generación de prompts ultra-realistas con especificaciones técnicas</span>
        </li>
        <li className="flex items-start">
          <span className="text-amber-500 mr-2">•</span>
          <span>Historial personal de prompts generados</span>
        </li>
        <li className="flex items-start">
          <span className="text-amber-500 mr-2">•</span>
          <span>Sistema de créditos y suscripciones mensuales</span>
        </li>
      </ul>
    </section>

    <section className="mb-8">
      <h2 className="text-2xl font-semibold text-white mb-4">3. Registro y Cuenta de Usuario</h2>
      <div className="space-y-4 text-gray-300">
        <p><strong className="text-white">3.1. Requisitos:</strong></p>
        <ul className="space-y-2 ml-4">
          <li className="flex items-start">
            <span className="text-amber-500 mr-2">•</span>
            <span>Debes ser mayor de 18 años</span>
          </li>
          <li className="flex items-start">
            <span className="text-amber-500 mr-2">•</span>
            <span>Proporcionar información veraz y actualizada</span>
          </li>
          <li className="flex items-start">
            <span className="text-amber-500 mr-2">•</span>
            <span>Mantener la confidencialidad de tu contraseña</span>
          </li>
        </ul>

        <p className="mt-4"><strong className="text-white">3.2. Responsabilidad:</strong></p>
        <p>Eres responsable de todas las actividades realizadas desde tu cuenta.</p>
      </div>
    </section>

    <section className="mb-8">
      <h2 className="text-2xl font-semibold text-white mb-4">4. Sistema de Créditos y Suscripciones</h2>
      
      <div className="bg-[#0d0d0d] border border-amber-900/20 rounded-lg p-6 mb-4">
        <h3 className="text-xl font-semibold text-amber-400 mb-3">Créditos:</h3>
        <ul className="space-y-2 text-gray-300 text-sm">
          <li className="flex items-start">
            <span className="text-amber-500 mr-2">•</span>
            <span>1 crédito = 1 prompt generado</span>
          </li>
          <li className="flex items-start">
            <span className="text-amber-500 mr-2">•</span>
            <span>Los créditos NO caducan mientras tu cuenta esté activa</span>
          </li>
          <li className="flex items-start">
            <span className="text-amber-500 mr-2">•</span>
            <span>Los créditos NO son reembolsables ni transferibles</span>
          </li>
          <li className="flex items-start">
            <span className="text-amber-500 mr-2">•</span>
            <span>Si cancelas tu cuenta, pierdes los créditos restantes</span>
          </li>
        </ul>
      </div>

      <div className="bg-[#0d0d0d] border border-amber-900/20 rounded-lg p-6">
        <h3 className="text-xl font-semibold text-amber-400 mb-3">Suscripciones:</h3>
        <ul className="space-y-2 text-gray-300 text-sm">
          <li className="flex items-start">
            <span className="text-amber-500 mr-2">•</span>
            <span>Se renuevan automáticamente cada mes</span>
          </li>
          <li className="flex items-start">
            <span className="text-amber-500 mr-2">•</span>
            <span>Puedes cancelar en cualquier momento desde tu perfil</span>
          </li>
          <li className="flex items-start">
            <span className="text-amber-500 mr-2">•</span>
            <span>Al cancelar, mantienes acceso hasta el fin del periodo pagado</span>
          </li>
          <li className="flex items-start">
            <span className="text-amber-500 mr-2">•</span>
            <span>Los créditos mensuales se resetean cada ciclo (no acumulan)</span>
          </li>
        </ul>
      </div>
    </section>

    <section className="mb-8">
      <h2 className="text-2xl font-semibold text-white mb-4">5. Pagos y Facturación</h2>
      <p className="text-gray-300 leading-relaxed mb-4">
        Los pagos se procesan mediante Stripe. Al realizar un pago:
      </p>
      <ul className="space-y-2 text-gray-300">
        <li className="flex items-start">
          <span className="text-amber-500 mr-2">•</span>
          <span>Aceptas que se cargue el importe en tu método de pago</span>
        </li>
        <li className="flex items-start">
          <span className="text-amber-500 mr-2">•</span>
          <span>Los precios incluyen IVA cuando aplique</span>
        </li>
        <li className="flex items-start">
          <span className="text-amber-500 mr-2">•</span>
          <span>Podemos modificar precios con 30 días de antelación</span>
        </li>
        <li className="flex items-start">
          <span className="text-amber-500 mr-2">•</span>
          <span>Recibirás factura por email tras cada cobro</span>
        </li>
      </ul>
    </section>

    <section className="mb-8">
      <h2 className="text-2xl font-semibold text-white mb-4">6. Propiedad Intelectual</h2>
      
      <div className="bg-green-900/10 border-l-4 border-green-500 p-4 rounded mb-4">
        <p className="text-green-200 font-semibold mb-2">✓ Los prompts generados SON TUYOS</p>
        <p className="text-gray-300 text-sm">
          Tienes plena propiedad y derechos de uso comercial sobre todos los prompts que generes. 
          Puedes usarlos en cualquier plataforma sin restricciones.
        </p>
      </div>

      <div className="bg-[#0d0d0d] border border-amber-900/20 rounded-lg p-4">
        <p className="text-amber-400 font-semibold mb-2">La plataforma es nuestra:</p>
        <p className="text-gray-300 text-sm">
          El código, diseño, marca y tecnología de Promptraits son propiedad exclusiva del titular. 
          No puedes copiar, modificar o distribuir ningún elemento de la plataforma.
        </p>
      </div>
    </section>

    <section className="mb-8">
      <h2 className="text-2xl font-semibold text-white mb-4">7. Uso Aceptable</h2>
      <p className="text-gray-300 mb-4">Queda PROHIBIDO:</p>
      <ul className="space-y-2 text-gray-300">
        <li className="flex items-start">
          <span className="text-red-500 mr-2">✗</span>
          <span>Usar el servicio para fines ilegales o inmorales</span>
        </li>
        <li className="flex items-start">
          <span className="text-red-500 mr-2">✗</span>
          <span>Intentar hackear, modificar o vulnerar la seguridad</span>
        </li>
        <li className="flex items-start">
          <span className="text-red-500 mr-2">✗</span>
          <span>Compartir tu cuenta con terceros</span>
        </li>
        <li className="flex items-start">
          <span className="text-red-500 mr-2">✗</span>
          <span>Realizar ingeniería inversa del sistema</span>
        </li>
        <li className="flex items-start">
          <span className="text-red-500 mr-2">✗</span>
          <span>Sobrecargar el servicio con solicitudes masivas automatizadas</span>
        </li>
      </ul>
    </section>

    <section className="mb-8">
      <h2 className="text-2xl font-semibold text-white mb-4">8. Limitación de Responsabilidad</h2>
      <div className="bg-amber-900/10 border border-amber-500/30 rounded-lg p-6">
        <p className="text-amber-200 mb-4">Promptraits NO se responsabiliza de:</p>
        <ul className="space-y-2 text-gray-300 text-sm">
          <li className="flex items-start">
            <span className="text-amber-500 mr-2">•</span>
            <span>Los resultados obtenidos al usar los prompts en otras plataformas de IA</span>
          </li>
          <li className="flex items-start">
            <span className="text-amber-500 mr-2">•</span>
            <span>Cambios en las políticas de terceros (Midjourney, Stable Diffusion, etc.)</span>
          </li>
          <li className="flex items-start">
            <span className="text-amber-500 mr-2">•</span>
            <span>Interrupciones temporales del servicio por mantenimiento</span>
          </li>
          <li className="flex items-start">
            <span className="text-amber-500 mr-2">•</span>
            <span>Pérdidas económicas derivadas del uso de los prompts</span>
          </li>
        </ul>
        <p className="text-gray-400 text-sm mt-4">
          El servicio se proporciona "tal cual" sin garantías de ningún tipo.
        </p>
      </div>
    </section>

    <section className="mb-8">
      <h2 className="text-2xl font-semibold text-white mb-4">9. Cancelación y Suspensión</h2>
      <div className="space-y-4 text-gray-300">
        <p><strong className="text-white">9.1. Por tu parte:</strong></p>
        <p className="ml-4">Puedes cancelar tu cuenta en cualquier momento desde la configuración.</p>

        <p><strong className="text-white">9.2. Por nuestra parte:</strong></p>
        <p className="ml-4">Podemos suspender o cancelar tu cuenta si:</p>
        <ul className="space-y-2 ml-8">
          <li className="flex items-start">
            <span className="text-amber-500 mr-2">•</span>
            <span>Incumples estos términos</span>
          </li>
          <li className="flex items-start">
            <span className="text-amber-500 mr-2">•</span>
            <span>Detectamos actividad fraudulenta</span>
          </li>
          <li className="flex items-start">
            <span className="text-amber-500 mr-2">•</span>
            <span>Hay impagos en tu suscripción</span>
          </li>
        </ul>
      </div>
    </section>

    <section className="mb-8">
      <h2 className="text-2xl font-semibold text-white mb-4">10. Modificaciones del Servicio</h2>
      <p className="text-gray-300 leading-relaxed">
        Nos reservamos el derecho a modificar, suspender o discontinuar el servicio (o cualquier parte) 
        en cualquier momento, con o sin previo aviso. No seremos responsables frente a ti ni frente a 
        terceros por cualquier modificación, suspensión o discontinuación del servicio.
      </p>
    </section>

    <section className="mb-8">
      <h2 className="text-2xl font-semibold text-white mb-4">11. Modificaciones de los Términos</h2>
      <p className="text-gray-300 leading-relaxed">
        Podemos actualizar estos términos ocasionalmente. Te notificaremos cambios importantes por email. 
        El uso continuado del servicio tras los cambios constituye aceptación de los nuevos términos.
      </p>
    </section>

    <section>
      <h2 className="text-2xl font-semibold text-white mb-4">12. Contacto</h2>
      <p className="text-gray-300 leading-relaxed">
        Para consultas sobre estos términos:{' '}
        <a href="mailto:legal@promptraits.com" className="text-amber-400 hover:text-amber-300">
          legal@promptraits.com
        </a>
      </p>
    </section>
  </div>
);

// ============================================================================
// POLÍTICA DE COOKIES
// ============================================================================
const Cookies = () => (
  <div className="prose prose-invert prose-amber max-w-none">
    <h1 className="text-4xl font-bold bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent mb-8">
      Política de Cookies
    </h1>
    
    <p className="text-gray-300 text-sm mb-8">
      Última actualización: {new Date().toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}
    </p>

    <section className="mb-8">
      <h2 className="text-2xl font-semibold text-white mb-4">1. ¿Qué son las cookies?</h2>
      <p className="text-gray-300 leading-relaxed">
        Las cookies son pequeños archivos de texto que se almacenan en tu dispositivo cuando visitas 
        un sitio web. Nos permiten recordar tus preferencias y mejorar tu experiencia de usuario.
      </p>
    </section>

    <section className="mb-8">
      <h2 className="text-2xl font-semibold text-white mb-4">2. Cookies que utilizamos</h2>
      
      <div className="space-y-4">
        <div className="bg-[#0d0d0d] border border-green-500/30 rounded-lg p-5">
          <div className="flex items-start justify-between mb-3">
            <h3 className="text-lg font-semibold text-green-400">Cookies Técnicas (Esenciales)</h3>
            <span className="text-xs bg-green-900/30 text-green-300 px-3 py-1 rounded-full">Obligatorias</span>
          </div>
          <p className="text-gray-300 text-sm mb-3">
            Son necesarias para el funcionamiento del sitio web. Sin ellas, el servicio no funciona.
          </p>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-amber-400 border-b border-amber-900/20">
                <th className="text-left py-2">Cookie</th>
                <th className="text-left py-2">Propósito</th>
                <th className="text-left py-2">Duración</th>
              </tr>
            </thead>
            <tbody className="text-gray-300">
              <tr className="border-b border-gray-800">
                <td className="py-2 font-mono text-xs">session_token</td>
                <td className="py-2">Mantener tu sesión activa</td>
                <td className="py-2">1 día</td>
              </tr>
              <tr className="border-b border-gray-800">
                <td className="py-2 font-mono text-xs">auth_token</td>
                <td className="py-2">Autenticación de usuario</td>
                <td className="py-2">30 días</td>
              </tr>
              <tr className="border-b border-gray-800">
                <td className="py-2 font-mono text-xs">csrf_token</td>
                <td className="py-2">Seguridad contra ataques</td>
                <td className="py-2">Sesión</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="bg-[#0d0d0d] border border-blue-500/30 rounded-lg p-5">
          <div className="flex items-start justify-between mb-3">
            <h3 className="text-lg font-semibold text-blue-400">Cookies de Preferencias</h3>
            <span className="text-xs bg-blue-900/30 text-blue-300 px-3 py-1 rounded-full">Opcionales</span>
          </div>
          <p className="text-gray-300 text-sm mb-3">
            Guardan tus configuraciones y preferencias personales.
          </p>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-amber-400 border-b border-amber-900/20">
                <th className="text-left py-2">Cookie</th>
                <th className="text-left py-2">Propósito</th>
                <th className="text-left py-2">Duración</th>
              </tr>
            </thead>
            <tbody className="text-gray-300">
              <tr className="border-b border-gray-800">
                <td className="py-2 font-mono text-xs">theme_preference</td>
                <td className="py-2">Tema oscuro/claro (si aplica)</td>
                <td className="py-2">1 año</td>
              </tr>
              <tr className="border-b border-gray-800">
                <td className="py-2 font-mono text-xs">language</td>
                <td className="py-2">Idioma preferido</td>
                <td className="py-2">1 año</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="bg-[#0d0d0d] border border-purple-500/30 rounded-lg p-5">
          <div className="flex items-start justify-between mb-3">
            <h3 className="text-lg font-semibold text-purple-400">Cookies Analíticas</h3>
            <span className="text-xs bg-purple-900/30 text-purple-300 px-3 py-1 rounded-full">Opcionales</span>
          </div>
          <p className="text-gray-300 text-sm mb-3">
            Nos ayudan a entender cómo usas el sitio para mejorarlo (si tienes Google Analytics).
          </p>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-amber-400 border-b border-amber-900/20">
                <th className="text-left py-2">Cookie</th>
                <th className="text-left py-2">Propósito</th>
                <th className="text-left py-2">Duración</th>
              </tr>
            </thead>
            <tbody className="text-gray-300">
              <tr className="border-b border-gray-800">
                <td className="py-2 font-mono text-xs">_ga</td>
                <td className="py-2">Google Analytics - Visitantes únicos</td>
                <td className="py-2">2 años</td>
              </tr>
              <tr className="border-b border-gray-800">
                <td className="py-2 font-mono text-xs">_gid</td>
                <td className="py-2">Google Analytics - Sesiones</td>
                <td className="py-2">24 horas</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>

    <section className="mb-8">
      <h2 className="text-2xl font-semibold text-white mb-4">3. Cookies de Terceros</h2>
      <div className="space-y-3 text-gray-300">
        <div className="bg-[#0d0d0d] border border-amber-900/20 rounded-lg p-4">
          <h4 className="text-amber-400 font-semibold mb-2">Stripe (Procesador de Pagos)</h4>
          <p className="text-sm">
            Utiliza sus propias cookies para procesar pagos de forma segura. 
            Consulta su política en: <a href="https://stripe.com/privacy" target="_blank" rel="noopener" className="text-amber-400 hover:text-amber-300">stripe.com/privacy</a>
          </p>
        </div>
        <div className="bg-[#0d0d0d] border border-amber-900/20 rounded-lg p-4">
          <h4 className="text-amber-400 font-semibold mb-2">Google Analytics (si lo usas)</h4>
          <p className="text-sm">
            Para análisis de tráfico web. 
            Más información: <a href="https://policies.google.com/technologies/cookies" target="_blank" rel="noopener" className="text-amber-400 hover:text-amber-300">policies.google.com/technologies/cookies</a>
          </p>
        </div>
      </div>
    </section>

    <section className="mb-8">
      <h2 className="text-2xl font-semibold text-white mb-4">4. Gestión de Cookies</h2>
      <p className="text-gray-300 mb-4">Puedes controlar y eliminar cookies de varias maneras:</p>
      
      <div className="bg-amber-900/10 border-l-4 border-amber-500 p-4 rounded mb-4">
        <h4 className="text-amber-200 font-semibold mb-2">Desde tu navegador:</h4>
        <ul className="space-y-2 text-gray-300 text-sm">
          <li className="flex items-start">
            <span className="text-amber-500 mr-2">•</span>
            <span><strong>Chrome:</strong> Configuración → Privacidad y seguridad → Cookies</span>
          </li>
          <li className="flex items-start">
            <span className="text-amber-500 mr-2">•</span>
            <span><strong>Firefox:</strong> Opciones → Privacidad y seguridad → Cookies</span>
          </li>
          <li className="flex items-start">
            <span className="text-amber-500 mr-2">•</span>
            <span><strong>Safari:</strong> Preferencias → Privacidad → Cookies</span>
          </li>
          <li className="flex items-start">
            <span className="text-amber-500 mr-2">•</span>
            <span><strong>Edge:</strong> Configuración → Privacidad → Cookies</span>
          </li>
        </ul>
      </div>

      <div className="bg-red-900/10 border-l-4 border-red-500 p-4 rounded">
        <p className="text-red-200 font-semibold mb-2">⚠️ Importante:</p>
        <p className="text-gray-300 text-sm">
          Si desactivas las cookies técnicas, algunas funciones del sitio dejarán de funcionar, 
          especialmente el inicio de sesión y el historial de prompts.
        </p>
      </div>
    </section>

    <section className="mb-8">
      <h2 className="text-2xl font-semibold text-white mb-4">5. Banner de Consentimiento</h2>
      <p className="text-gray-300 leading-relaxed">
        La primera vez que visitas Promptraits, mostramos un banner donde puedes aceptar o rechazar 
        cookies opcionales (analíticas y de preferencias). Las cookies técnicas se instalan 
        automáticamente porque son necesarias para el servicio.
      </p>
    </section>

    <section>
      <h2 className="text-2xl font-semibold text-white mb-4">6. Contacto</h2>
      <p className="text-gray-300 leading-relaxed">
        Para dudas sobre cookies:{' '}
        <a href="mailto:privacidad@promptraits.com" className="text-amber-400 hover:text-amber-300">
          privacidad@promptraits.com
        </a>
      </p>
    </section>
  </div>
);

// ============================================================================
// POLÍTICA DE REEMBOLSOS
// ============================================================================
const Reembolsos = () => (
  <div className="prose prose-invert prose-amber max-w-none">
    <h1 className="text-4xl font-bold bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent mb-8">
      Política de Reembolsos
    </h1>
    
    <p className="text-gray-300 text-sm mb-8">
      Última actualización: {new Date().toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}
    </p>

    <section className="mb-8">
      <h2 className="text-2xl font-semibold text-white mb-4">1. Periodo de Desistimiento (Consumidores UE)</h2>
      <div className="bg-green-900/10 border-l-4 border-green-500 p-5 rounded mb-4">
        <p className="text-green-200 font-semibold mb-3">✓ Derecho de Desistimiento: 14 días</p>
        <p className="text-gray-300 text-sm leading-relaxed">
          Si eres consumidor residente en la Unión Europea, tienes derecho a desistir de tu compra 
          en un plazo de 14 días naturales desde la fecha de contratación, sin necesidad de justificación.
        </p>
      </div>
      <p className="text-gray-400 text-sm italic">
        Conforme a la Directiva 2011/83/UE y legislación española aplicable.
      </p>
    </section>

    <section className="mb-8">
      <h2 className="text-2xl font-semibold text-white mb-4">2. Excepciones al Derecho de Desistimiento</h2>
      <div className="bg-red-900/10 border-l-4 border-red-500 p-5 rounded">
        <p className="text-red-200 font-semibold mb-3">⚠️ NO hay reembolso si:</p>
        <ul className="space-y-2 text-gray-300 text-sm">
          <li className="flex items-start">
            <span className="text-red-400 mr-2">✗</span>
            <span>Has consumido créditos o generado prompts durante el periodo de desistimiento</span>
          </li>
          <li className="flex items-start">
            <span className="text-red-400 mr-2">✗</span>
            <span>Han transcurrido más de 14 días desde la compra</span>
          </li>
          <li className="flex items-start">
            <span className="text-red-400 mr-2">✗</span>
            <span>Se trata de una renovación automática de suscripción (puedes cancelar antes)</span>
          </li>
        </ul>
        <p className="text-gray-400 text-xs mt-4">
          Al usar el servicio (generar prompts), renuncias expresamente a tu derecho de desistimiento 
          según el artículo 103.c de la Ley General para la Defensa de Consumidores y Usuarios.
        </p>
      </div>
    </section>

    <section className="mb-8">
      <h2 className="text-2xl font-semibold text-white mb-4">3. Reembolso por Packs de Créditos</h2>
      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-[#0d0d0d] border border-green-500/30 rounded-lg p-5">
          <h3 className="text-lg font-semibold text-green-400 mb-3">✓ Reembolsable</h3>
          <ul className="space-y-2 text-gray-300 text-sm">
            <li className="flex items-start">
              <span className="text-green-500 mr-2">•</span>
              <span>Pack comprado hace menos de 14 días</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-500 mr-2">•</span>
              <span>NO has usado ningún crédito del pack</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-500 mr-2">•</span>
              <span>No has generado ningún prompt</span>
            </li>
          </ul>
          <p className="text-green-300 text-xs mt-4 font-semibold">
            → Reembolso 100% del importe pagado
          </p>
        </div>

        <div className="bg-[#0d0d0d] border border-red-500/30 rounded-lg p-5">
          <h3 className="text-lg font-semibold text-red-400 mb-3">✗ NO Reembolsable</h3>
          <ul className="space-y-2 text-gray-300 text-sm">
            <li className="flex items-start">
              <span className="text-red-500 mr-2">•</span>
              <span>Han pasado más de 14 días</span>
            </li>
            <li className="flex items-start">
              <span className="text-red-500 mr-2">•</span>
              <span>Ya has usado aunque sea 1 crédito</span>
            </li>
            <li className="flex items-start">
              <span className="text-red-500 mr-2">•</span>
              <span>Has generado prompts con el pack</span>
            </li>
          </ul>
          <p className="text-red-300 text-xs mt-4 font-semibold">
            → Sin derecho a reembolso
          </p>
        </div>
      </div>
    </section>

    <section className="mb-8">
      <h2 className="text-2xl font-semibold text-white mb-4">4. Reembolso por Suscripciones</h2>
      <div className="space-y-4">
        <div className="bg-[#0d0d0d] border border-amber-900/20 rounded-lg p-5">
          <h3 className="text-amber-400 font-semibold mb-3">Primera Suscripción (Nuevo Usuario):</h3>
          <ul className="space-y-2 text-gray-300 text-sm">
            <li className="flex items-start">
              <span className="text-amber-500 mr-2">•</span>
              <span>Tienes 14 días para solicitar reembolso</span>
            </li>
            <li className="flex items-start">
              <span className="text-amber-500 mr-2">•</span>
              <span>Solo si NO has usado créditos ni generado prompts</span>
            </li>
            <li className="flex items-start">
              <span className="text-amber-500 mr-2">•</span>
              <span>Reembolso 100% del primer mes</span>
            </li>
          </ul>
        </div>

        <div className="bg-[#0d0d0d] border border-amber-900/20 rounded-lg p-5">
          <h3 className="text-amber-400 font-semibold mb-3">Renovaciones Automáticas:</h3>
          <ul className="space-y-2 text-gray-300 text-sm">
            <li className="flex items-start">
              <span className="text-red-500 mr-2">✗</span>
              <span><strong className="text-white">NO son reembolsables</strong> (ya tuviste tu periodo de prueba)</span>
            </li>
            <li className="flex items-start">
              <span className="text-amber-500 mr-2">•</span>
              <span>Puedes cancelar en cualquier momento antes de la renovación</span>
            </li>
            <li className="flex items-start">
              <span className="text-amber-500 mr-2">•</span>
              <span>Al cancelar, mantienes acceso hasta el fin del periodo pagado</span>
            </li>
          </ul>
        </div>
      </div>
    </section>

    <section className="mb-8">
      <h2 className="text-2xl font-semibold text-white mb-4">5. Cómo Solicitar un Reembolso</h2>
      <div className="bg-amber-900/10 border-l-4 border-amber-500 p-5 rounded">
        <ol className="space-y-3 text-gray-300">
          <li className="flex items-start">
            <span className="text-amber-500 font-bold mr-3">1.</span>
            <div>
              <strong className="text-white">Envía un email a:</strong>{' '}
              <a href="mailto:reembolsos@promptraits.com" className="text-amber-400 hover:text-amber-300">
                reembolsos@promptraits.com
              </a>
            </div>
          </li>
          <li className="flex items-start">
            <span className="text-amber-500 font-bold mr-3">2.</span>
            <div>
              <strong className="text-white">Incluye:</strong>
              <ul className="mt-2 space-y-1 ml-4 text-sm">
                <li>• Tu email de cuenta</li>
                <li>• ID de transacción (lo encuentras en tu historial de pagos)</li>
                <li>• Motivo de la solicitud (opcional)</li>
              </ul>
            </div>
          </li>
          <li className="flex items-start">
            <span className="text-amber-500 font-bold mr-3">3.</span>
            <span>Revisaremos tu solicitud en <strong className="text-white">48 horas laborables</strong></span>
          </li>
          <li className="flex items-start">
            <span className="text-amber-500 font-bold mr-3">4.</span>
            <span>Si se aprueba, el reembolso se procesa en <strong className="text-white">5-7 días laborables</strong></span>
          </li>
        </ol>
      </div>
    </section>

    <section className="mb-8">
      <h2 className="text-2xl font-semibold text-white mb-4">6. Reembolsos por Error o Problema Técnico</h2>
      <p className="text-gray-300 leading-relaxed mb-4">
        Si experimentas problemas técnicos que impiden el uso del servicio:
      </p>
      <ul className="space-y-2 text-gray-300">
        <li className="flex items-start">
          <span className="text-amber-500 mr-2">•</span>
          <span>Contacta a soporte lo antes posible: <a href="mailto:soporte@promptraits.com" className="text-amber-400 hover:text-amber-300">soporte@promptraits.com</a></span>
        </li>
        <li className="flex items-start">
          <span className="text-amber-500 mr-2">•</span>
          <span>Describe el problema con capturas si es posible</span>
        </li>
        <li className="flex items-start">
          <span className="text-amber-500 mr-2">•</span>
          <span>Evaluaremos caso por caso y ofreceremos reembolso o compensación si procede</span>
        </li>
      </ul>
    </section>

    <section className="mb-8">
      <h2 className="text-2xl font-semibold text-white mb-4">7. Cancelación de Suscripciones</h2>
      <div className="bg-blue-900/10 border-l-4 border-blue-500 p-5 rounded">
        <h4 className="text-blue-200 font-semibold mb-3">Para cancelar tu suscripción:</h4>
        <ol className="space-y-2 text-gray-300 text-sm">
          <li className="flex items-start">
            <span className="text-blue-500 mr-2">1.</span>
            <span>Ve a tu Perfil → Configuración → Suscripción</span>
          </li>
          <li className="flex items-start">
            <span className="text-blue-500 mr-2">2.</span>
            <span>Haz clic en "Cancelar Suscripción"</span>
          </li>
          <li className="flex items-start">
            <span className="text-blue-500 mr-2">3.</span>
            <span>Confirma la cancelación</span>
          </li>
          <li className="flex items-start">
            <span className="text-blue-500 mr-2">4.</span>
            <span>Mantendrás acceso hasta el final del periodo pagado</span>
          </li>
        </ol>
        <p className="text-blue-300 text-sm mt-4">
          ✓ No se realizarán más cargos automáticos tras cancelar
        </p>
      </div>
    </section>

    <section>
      <h2 className="text-2xl font-semibold text-white mb-4">8. Contacto</h2>
      <p className="text-gray-300 leading-relaxed mb-4">
        Para consultas sobre reembolsos o cancelaciones:
      </p>
      <div className="bg-[#0d0d0d] border border-amber-900/20 rounded-lg p-5 text-gray-300">
        <p className="mb-2">
          <strong className="text-amber-500">Reembolsos:</strong>{' '}
          <a href="mailto:reembolsos@promptraits.com" className="text-amber-400 hover:text-amber-300">
            reembolsos@promptraits.com
          </a>
        </p>
        <p className="mb-2">
          <strong className="text-amber-500">Soporte técnico:</strong>{' '}
          <a href="mailto:soporte@promptraits.com" className="text-amber-400 hover:text-amber-300">
            soporte@promptraits.com
          </a>
        </p>
        <p>
          <strong className="text-amber-500">Horario:</strong> Lunes a Viernes, 9:00 - 18:00 (CET)
        </p>
      </div>
    </section>
  </div>
);

// ============================================================================
// NOT FOUND
// ============================================================================
const NotFound = () => (
  <div className="text-center py-16">
    <h1 className="text-4xl font-bold text-white mb-4">Página no encontrada</h1>
    <p className="text-gray-400 mb-8">La página legal que buscas no existe.</p>
    <Link 
      to="/" 
      className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-600 text-black font-semibold rounded-lg hover:from-amber-600 hover:to-amber-700 transition-all"
    >
      Volver al inicio
    </Link>
  </div>
);

export default LegalPages;
