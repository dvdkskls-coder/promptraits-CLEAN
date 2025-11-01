import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleQuestion = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const faqs = [
    {
      category: "General",
      questions: [
        {
          q: "¿Qué es Promptraits?",
          a: "Promptraits es una plataforma que genera prompts ultra-realistas y técnicamente precisos para IA generativa de imágenes (Midjourney, Stable Diffusion, FLUX, etc.). Utilizamos especificaciones profesionales de fotografía cinematográfica y editorial para crear descripciones detalladas que producen resultados de alta calidad."
        },
        {
          q: "¿Para qué plataformas de IA funcionan los prompts?",
          a: "Los prompts están optimizados para funcionar con: Nano-Banana, Midjourney (especialmente V7), Stable Diffusion, FLUX, SDXL, y otras plataformas de generación de imágenes que acepten descripciones detalladas en inglés."
        },
        {
          q: "¿Necesito conocimientos técnicos de fotografía?",
          a: "No. Nuestro sistema traduce automáticamente conceptos técnicos de fotografía profesional en prompts listos para usar. Solo necesitas describir lo que quieres o subir una imagen de referencia opcional."
        }
      ]
    },
    {
      category: "Imágenes de Referencia",
      questions: [
        {
          q: "¿Debo subir una foto para generar prompts?",
          a: "No, es totalmente opcional. Puedes generar prompts describiendo lo que quieres (estilo, iluminación, ambiente, etc.) sin subir ninguna imagen. La imagen de referencia solo sirve para que el sistema analice características técnicas si lo deseas."
        },
        {
          q: "¿Qué pasa con las imágenes que subo?",
          a: "Las imágenes se procesan ÚNICAMENTE para analizar características técnicas (iluminación, composición, ángulos) y se eliminan INMEDIATAMENTE después del análisis. NO guardamos ninguna foto en nuestros servidores. Esto está certificado en nuestra Política de Privacidad."
        },
        {
          q: "¿Puedo subir fotos de personas?",
          a: "Sí, pero el sistema NO replica caras ni identidades. Solo analiza aspectos técnicos como: ángulo de la toma, tipo de iluminación, composición, distancia focal aproximada, etc. El prompt resultante describe el ESTILO fotográfico, no a la persona."
        },
        {
          q: "¿Qué tipo de imágenes funcionan mejor como referencia?",
          a: "Funcionan bien: fotografías profesionales, retratos con buena iluminación, imágenes de estudio, fotos de moda/editorial. Evita: imágenes muy oscuras, selfies borrosas, fotos con mala calidad o muy pequeñas."
        }
      ]
    },
    {
      category: "Créditos y Planes",
      questions: [
        {
          q: "¿Cómo funcionan los créditos?",
          a: "1 crédito = 1 prompt generado. Puedes comprar packs de créditos que NO caducan mientras tu cuenta esté activa, o suscribirte a un plan mensual con créditos renovables cada mes."
        },
        {
          q: "¿Los créditos caducan?",
          a: "Los créditos comprados en packs NO caducan mientras tu cuenta esté activa. Los créditos de planes mensuales se resetean cada mes (no se acumulan si no los usas)."
        },
        {
          q: "¿Qué pasa si cancelo mi suscripción?",
          a: "Mantienes acceso al servicio hasta el final del periodo pagado. Los créditos restantes del mes se pierden al finalizar. No se realizarán más cargos automáticos."
        },
        {
          q: "¿Puedo cambiar de plan?",
          a: "Sí, puedes cambiar a un plan superior en cualquier momento (se prorratea el pago). Para bajar a un plan inferior, el cambio se aplicará en la próxima renovación."
        },
        {
          q: "¿Qué plan me recomiendan?",
          a: "Para probar: Pack de 10 créditos. Para uso regular (2-3 prompts/semana): Plan Basic. Para uso intensivo o profesional: Plan Pro o Enterprise. Puedes empezar con un pack y cambiar a suscripción después."
        }
      ]
    },
    {
      category: "Uso de Prompts",
      questions: [
        {
          q: "¿Soy dueño de los prompts que genero?",
          a: "SÍ. Tienes propiedad completa y derechos de uso comercial sobre todos los prompts que generas. Puedes usarlos sin restricciones en cualquier plataforma o proyecto."
        },
        {
          q: "¿Puedo usar los prompts comercialmente?",
          a: "Sí, puedes usar los prompts para proyectos comerciales, venderlos, incluirlos en servicios, etc. Son completamente tuyos."
        },
        {
          q: "¿Los prompts garantizan resultados perfectos en otras IA?",
          a: "Los prompts están optimizados para alta calidad, pero los resultados dependen de la plataforma de IA que uses (Midjourney, Stable Diffusion, etc.). Cada IA interpreta prompts de manera ligeramente diferente. Recomendamos experimentar con diferentes versiones."
        },
        {
          q: "¿Puedo editar los prompts generados?",
          a: "¡Por supuesto! Los prompts son un punto de partida profesional. Puedes editarlos, ajustarlos o combinarlos como prefieras."
        },
        {
          q: "¿Puedo guardar mis prompts favoritos?",
          a: "Sí, todos los prompts que generas se guardan automáticamente en tu historial personal. Puedes acceder a ellos en cualquier momento desde tu panel de usuario."
        }
      ]
    },
    {
      category: "Pagos y Facturación",
      questions: [
        {
          q: "¿Qué métodos de pago aceptan?",
          a: "Aceptamos todas las tarjetas principales (Visa, Mastercard, American Express) a través de Stripe, nuestro procesador de pagos seguro y certificado PCI-DSS."
        },
        {
          q: "¿Guardan mis datos de tarjeta?",
          a: "NO. Los datos de pago son procesados y almacenados únicamente por Stripe (nivel bancario de seguridad). Nosotros nunca vemos ni guardamos información de tarjetas."
        },
        {
          q: "¿Puedo obtener factura?",
          a: "Sí, recibes automáticamente una factura por email tras cada pago. También puedes descargar todas tus facturas desde tu perfil."
        },
        {
          q: "¿Hay reembolsos?",
          a: "Sí, bajo ciertas condiciones. Tienes 14 días para solicitar reembolso si NO has usado créditos. Las renovaciones automáticas NO son reembolsables. Consulta nuestra Política de Reembolsos completa para más detalles."
        },
        {
          q: "¿Cómo cancelo mi suscripción?",
          a: "Ve a tu Perfil → Configuración → Suscripción → Cancelar. Es inmediato y sin complicaciones. Mantienes acceso hasta el fin del periodo pagado."
        }
      ]
    },
    {
      category: "Técnico",
      questions: [
        {
          q: "¿En qué idioma genera los prompts?",
          a: "Los prompts se generan en INGLÉS, que es el idioma óptimo para todas las plataformas de IA generativa (obtienen mejores resultados que en otros idiomas)."
        },
        {
          q: "¿Qué información técnica incluyen los prompts?",
          a: "Los prompts incluyen: especificaciones de cámara (distancia focal, apertura, ISO), esquemas de iluminación profesional (key light, fill, rim), composición (regla de tercios, headroom), color grading, post-procesado, y keywords técnicos de fotografía."
        },
        {
          q: "¿Funciona en móvil?",
          a: "Sí, Promptraits es totalmente responsive y funciona perfectamente en móviles, tablets y ordenadores."
        },
        {
          q: "¿Hay límite de generaciones por día?",
          a: "No hay límites de tiempo. Solo estás limitado por tus créditos disponibles. Puedes generar todos los prompts que quieras cuando tengas créditos."
        }
      ]
    },
    {
      category: "Soporte",
      questions: [
        {
          q: "¿Cómo contacto con soporte?",
          a: "Email: contacto@promptraits.com | Respondemos en 24-48 horas laborables. Para urgencias técnicas, indica 'URGENTE' en el asunto."
        },
        {
          q: "¿Ofrecen tutoriales o guías?",
          a: "Sí, tenemos una Guía Completa en PDF descargable desde tu panel que explica cómo usar los prompts en diferentes plataformas y cómo optimizar resultados."
        },
        {
          q: "¿Puedo sugerir nuevas funcionalidades?",
          a: "¡Sí! Nos encanta recibir feedback. Envía tus sugerencias a contacto@promptraits.com. Muchas funciones actuales nacieron de ideas de usuarios."
        },
        {
          q: "¿Hay descuentos para educación o uso comercial intensivo?",
          a: "Sí, ofrecemos planes Enterprise personalizados para agencias, estudios y uso educativo. Contacta con ventas@promptraits.com para más información."
        }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0a0a] to-[#1a1a1a]">
      <div className="max-w-5xl mx-auto px-4 py-16">
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
            Preguntas Frecuentes
          </h1>
          <p className="text-gray-400 text-lg">
            Todo lo que necesitas saber sobre Promptraits
          </p>
        </div>

        {/* FAQ Categories */}
        <div className="space-y-12">
          {faqs.map((category, catIndex) => (
            <div key={catIndex}>
              {/* Category Title */}
              <div className="flex items-center mb-6">
                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-amber-500/30 to-transparent"></div>
                <h2 className="text-2xl font-bold text-amber-400 mx-4">{category.category}</h2>
                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-amber-500/30 to-transparent"></div>
              </div>

              {/* Questions */}
              <div className="space-y-3">
                {category.questions.map((faq, qIndex) => {
                  const globalIndex = `${catIndex}-${qIndex}`;
                  const isOpen = openIndex === globalIndex;

                  return (
                    <div
                      key={qIndex}
                      className="bg-[#1a1a1a] rounded-xl border border-amber-900/20 overflow-hidden transition-all hover:border-amber-500/30"
                    >
                      {/* Question */}
                      <button
                        onClick={() => toggleQuestion(globalIndex)}
                        className="w-full px-6 py-4 flex items-center justify-between text-left group"
                      >
                        <span className="text-white font-semibold pr-8 group-hover:text-amber-400 transition-colors">
                          {faq.q}
                        </span>
                        <svg
                          className={`w-5 h-5 text-amber-500 transform transition-transform flex-shrink-0 ${
                            isOpen ? 'rotate-180' : ''
                          }`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>

                      {/* Answer */}
                      <div
                        className={`transition-all duration-300 ease-in-out ${
                          isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                        } overflow-hidden`}
                      >
                        <div className="px-6 pb-5 pt-2">
                          <div className="border-t border-amber-900/20 pt-4">
                            <p className="text-gray-300 leading-relaxed">
                              {faq.a}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Contact Section */}
        <div className="mt-16 bg-gradient-to-r from-amber-900/20 to-amber-800/20 rounded-2xl border border-amber-500/30 p-8 text-center">
          <h3 className="text-2xl font-bold text-white mb-3">
            ¿No encuentras tu respuesta?
          </h3>
          <p className="text-gray-300 mb-6">
            Nuestro equipo de soporte está aquí para ayudarte
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="mailto:contacto@promptraits.com"
              className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-600 text-black font-semibold rounded-lg hover:from-amber-600 hover:to-amber-700 transition-all"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Contactar Soporte
            </a>
            <Link
              to="/legal/privacidad"
              className="inline-flex items-center justify-center px-6 py-3 bg-[#1a1a1a] text-amber-400 font-semibold rounded-lg border border-amber-500/30 hover:bg-amber-900/20 transition-all"
            >
              Ver Documentación Legal
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQ;
