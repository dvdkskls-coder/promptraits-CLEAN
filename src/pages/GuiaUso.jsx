import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Play, Check, AlertCircle } from 'lucide-react';

const GuiaUso = () => {
  const [activeStep, setActiveStep] = useState(null);

  const toggleStep = (index) => {
    setActiveStep(activeStep === index ? null : index);
  };

  const guiaCompleta = [
    {
      numero: "01",
      titulo: "Registro y Primeros Pasos",
      descripcion: "Crea tu cuenta y familiarízate con la plataforma",
      color: "from-amber-500 to-amber-600",
      pasos: [
        {
          titulo: "Crear tu cuenta",
          contenido: "Haz clic en 'Comenzar Gratis' o 'Registrarse' en la página principal. Completa el formulario con tu email y contraseña. Recibirás un email de confirmación - haz clic en el enlace para activar tu cuenta.",
          tips: ["Usa un email válido para recibir notificaciones", "Guarda tu contraseña de forma segura"]
        },
        {
          titulo: "Verifica tu cuenta",
          contenido: "Revisa tu bandeja de entrada y busca el email de Promptraits. Si no lo ves, revisa la carpeta de spam. Haz clic en el enlace de verificación para activar tu cuenta.",
          tips: ["El enlace expira en 24 horas", "Revisa también la carpeta de promociones"]
        },
        {
          titulo: "Explora tu panel",
          contenido: "Una vez dentro, familiarízate con tu panel de usuario. En la parte superior verás tus créditos disponibles y tu plan actual. En el menú lateral encontrarás acceso al generador, historial y configuración.",
          tips: ["Los usuarios Free empiezan con 3 créditos", "Puedes cambiar de plan en cualquier momento"]
        }
      ]
    },
    {
      numero: "02",
      titulo: "Tu Primer Prompt",
      descripcion: "Genera tu primer prompt profesional paso a paso",
      color: "from-amber-600 to-amber-700",
      pasos: [
        {
          titulo: "Accede al Generador",
          contenido: "Desde tu panel, haz clic en 'Generador' o en el botón 'Nuevo Prompt'. Verás la interfaz principal dividida en dos secciones: a la izquierda la imagen de referencia (opcional) y a la derecha el área de texto donde aparecerá tu prompt.",
          tips: ["Puedes usar el generador sin subir imagen", "La imagen de referencia ayuda a la IA a entender mejor tu visión"]
        },
        {
          titulo: "Sube una imagen de referencia (opcional)",
          contenido: "Si tienes una imagen que quieres usar como referencia, haz clic en el área de 'Subir imagen' o arrastra y suelta tu archivo. Formatos aceptados: JPG, PNG, WebP. Tamaño máximo: 5MB.",
          tips: ["Las imágenes nítidas dan mejores resultados", "No es obligatorio subir imagen"]
        },
        {
          titulo: "Completa la descripción básica",
          contenido: "En la sección 'Características Básicas', describe al sujeto de tu retrato: edad aproximada, género, color y estilo de cabello, vestimenta principal. Cuanto más específico seas, mejor será el resultado.",
          tips: ["Sé descriptivo pero conciso", "Menciona detalles distintivos importantes"]
        },
        {
          titulo: "Selecciona un estilo",
          contenido: "Elige uno de los estilos predefinidos: Corporativo, Editorial, Natural, Cinematográfico, etc. Cada estilo aplica automáticamente configuraciones optimizadas de iluminación, composición y color.",
          tips: ["Puedes modificar el estilo después de seleccionarlo", "Los estilos son un excelente punto de partida"]
        },
        {
          titulo: "Genera tu prompt",
          contenido: "Haz clic en el botón 'Generar Prompt'. En pocos segundos verás aparecer tu prompt profesional en el área de texto. El sistema consumirá 1 crédito de tu cuenta.",
          tips: ["El prompt aparece listo para copiar", "Se guarda automáticamente en tu historial"]
        }
      ]
    },
    {
      numero: "03",
      titulo: "Herramientas PRO (Suscriptores)",
      descripcion: "Aprovecha al máximo las funciones avanzadas",
      color: "from-yellow-500 to-amber-600",
      pasos: [
        {
          titulo: "Tipos de Toma",
          contenido: "Selecciona el encuadre perfecto: Primer Plano (close-up para retratos íntimos), Plano Medio (muestra desde la cintura), o Cuerpo Completo (figura completa visible). Cada tipo cambia la composición del prompt.",
          tips: ["Primer plano es ideal para retratos corporativos", "Cuerpo completo funciona mejor para moda"]
        },
        {
          titulo: "Ángulos de Cámara",
          contenido: "Controla la perspectiva: Ángulo Normal (altura de ojos), Contrapicado (desde abajo, da poder), Picado (desde arriba, más íntimo), o Cenital (vista de arriba). El ángulo afecta dramáticamente la sensación de la imagen.",
          tips: ["Contrapicado hace parecer más imponente al sujeto", "Picado crea una sensación más vulnerable"]
        },
        {
          titulo: "Esquemas de Iluminación",
          contenido: "Elige esquemas profesionales: Rembrandt (dramático con triángulo de luz), Butterfly (glamouroso frontal), Loop (versátil 45°), Split (dramático medio rostro), Broad (ilumina lado ancho), o Short (ilumina lado estrecho).",
          tips: ["Rembrandt es clásico para retratos", "Loop es el más versátil para principiantes"]
        },
        {
          titulo: "Lentes y Filtros",
          contenido: "Selecciona el objetivo perfecto: 50mm (natural), 85mm (retrato profesional), 35mm (contexto), 24mm (dramático angular). Añade filtros como Soft Focus, B&W, Warm, Cool o Vintage para efectos especiales.",
          tips: ["85mm es el estándar para retratos profesionales", "Los filtros son sutiles pero efectivos"]
        },
        {
          titulo: "Vista Previa en Tiempo Real",
          contenido: "Todas las opciones PRO que selecciones aparecen automáticamente en el área de texto. Puedes ver cómo cada elección modifica el prompt final antes de generar.",
          tips: ["Experimenta con diferentes combinaciones", "Las selecciones se aplican instantáneamente"]
        }
      ]
    },
    {
      numero: "04",
      titulo: "Gestión de Prompts",
      descripcion: "Organiza y reutiliza tus creaciones",
      color: "from-orange-500 to-amber-600",
      pasos: [
        {
          titulo: "Accede a tu Historial",
          contenido: "Haz clic en 'Historial' en el menú principal. Verás todos los prompts que has generado ordenados por fecha, del más reciente al más antiguo. Cada entrada muestra el prompt completo y la fecha de creación.",
          tips: ["El historial se guarda automáticamente", "No hay límite de almacenamiento para suscriptores PRO"]
        },
        {
          titulo: "Copiar prompts guardados",
          contenido: "Encuentra el prompt que quieres reutilizar y haz clic en el botón 'Copiar'. El texto se copiará a tu portapapeles listo para pegar en Midjourney, Stable Diffusion o donde necesites.",
          tips: ["Puedes copiar prompts ilimitadas veces", "El historial es privado y solo visible para ti"]
        },
        {
          titulo: "Eliminar prompts",
          contenido: "Si quieres limpiar tu historial, usa el botón 'Eliminar' junto a cada prompt. La eliminación es permanente, así que asegúrate antes de confirmar.",
          tips: ["Los prompts eliminados no se pueden recuperar", "Copia los prompts importantes antes de eliminar"]
        },
        {
          titulo: "Buscar en el historial",
          contenido: "Usa la barra de búsqueda en la parte superior del historial para encontrar prompts específicos por palabras clave, estilo o cualquier término que recuerdes.",
          tips: ["La búsqueda es instantánea", "Busca por elementos clave como 'corporativo' o 'cinematográfico'"]
        }
      ]
    },
    {
      numero: "05",
      titulo: "Créditos y Suscripciones",
      descripcion: "Administra tu cuenta y créditos",
      color: "from-amber-700 to-orange-600",
      pasos: [
        {
          titulo: "Revisa tus créditos",
          contenido: "En la esquina superior derecha de tu panel verás siempre tus créditos disponibles. Los créditos de suscripción se renuevan automáticamente cada mes el día de tu fecha de renovación.",
          tips: ["Free: 3 créditos/mes", "PRO: 60 créditos/mes", "PRO Premium: 300 créditos/mes"]
        },
        {
          titulo: "Comprar créditos adicionales",
          contenido: "Si te quedas sin créditos antes de tu renovación, haz clic en 'Comprar Créditos'. Elige un paquete: 10, 30, 60 o 100 créditos. Los créditos adicionales nunca caducan.",
          tips: ["Los paquetes grandes tienen descuento", "Créditos adicionales no afectan tu renovación mensual"]
        },
        {
          titulo: "Actualizar tu plan",
          contenido: "Haz clic en 'Mi Plan' o 'Actualizar Plan' para ver las opciones disponibles. Puedes cambiar de Free a PRO, de PRO a PRO Premium, o cancelar tu suscripción en cualquier momento.",
          tips: ["Los cambios se aplican en el próximo ciclo", "Puedes probar PRO durante 7 días gratis"]
        },
        {
          titulo: "Gestionar suscripción",
          contenido: "En la sección 'Mi Cuenta', encontrarás toda la información de tu suscripción: plan actual, fecha de renovación, método de pago y opciones para actualizar o cancelar.",
          tips: ["Sin compromisos de permanencia", "Cancela cuando quieras"]
        }
      ]
    },
    {
      numero: "06",
      titulo: "Usar tus Prompts en IA",
      descripcion: "Cómo aplicar los prompts generados en diferentes plataformas",
      color: "from-yellow-600 to-orange-500",
      pasos: [
        {
          titulo: "Para Midjourney",
          contenido: "Copia tu prompt generado. Ve a Discord y abre el servidor de Midjourney. En cualquier canal habilitado, escribe /imagine y pega tu prompt completo. Los parámetros (--ar, --style, --v, etc.) ya están incluidos en el prompt.",
          tips: ["Asegúrate de estar en un canal de bot", "Los parámetros Midjourney ya vienen optimizados"]
        },
        {
          titulo: "Para Stable Diffusion",
          contenido: "Copia el prompt y pégalo en el campo 'Prompt' de tu interfaz de Stable Diffusion (Automatic1111, ComfyUI, etc.). Los prompts de Promptraits funcionan perfectamente sin modificaciones.",
          tips: ["Ajusta Steps a 30-50 para mejores resultados", "CFG Scale entre 7-12 es ideal"]
        },
        {
          titulo: "Para Leonardo.ai",
          contenido: "Copia el prompt y pégalo en Leonardo. Selecciona el modelo 'Photoreal' o 'Leonardo Diffusion XL'. Los prompts están optimizados para resultados fotorealistas.",
          tips: ["Usa el modelo Photoreal para retratos", "Ajusta Resolution según tu plan"]
        },
        {
          titulo: "Ajustes y refinamiento",
          contenido: "Si el resultado no es exactamente lo que esperabas, puedes modificar el prompt original en Promptraits y regenerar. Pequeños cambios en la descripción pueden dar resultados muy diferentes.",
          tips: ["Prueba diferentes esquemas de iluminación", "Ajusta la descripción física si es necesario"]
        }
      ]
    }
  ];

  const troubleshooting = [
    {
      problema: "No recibo el email de verificación",
      solucion: "Revisa tu carpeta de spam y promociones. Si han pasado más de 5 minutos, ve a tu cuenta y solicita un nuevo email de verificación. Asegúrate de que el email que ingresaste sea correcto."
    },
    {
      problema: "Mi crédito se consumió pero no obtuve el prompt",
      solucion: "Esto puede ocurrir por un error temporal. Revisa tu historial de prompts - es probable que esté allí. Si no aparece, contacta a soporte con la fecha y hora del error para reembolsar tu crédito."
    },
    {
      problema: "Las herramientas PRO no aparecen",
      solucion: "Verifica que tu suscripción PRO esté activa en 'Mi Cuenta'. Si acabas de suscribirte, cierra sesión y vuelve a entrar para actualizar tu estado de usuario."
    },
    {
      problema: "El prompt no funciona bien en Midjourney/SD",
      solucion: "Asegúrate de copiar el prompt completo incluyendo todos los parámetros. Si los resultados no coinciden con lo esperado, intenta modificar ligeramente la descripción o cambiar el estilo en Promptraits."
    },
    {
      problema: "No puedo subir mi imagen de referencia",
      solucion: "Verifica que tu imagen sea JPG, PNG o WebP y que no supere 5MB. Si es muy grande, usa una herramienta online para reducir el tamaño sin perder calidad significativa."
    }
  ];

  const shortcuts = [
    { accion: "Copiar prompt actual", teclas: "Ctrl/Cmd + C" },
    { accion: "Generar nuevo prompt", teclas: "Ctrl/Cmd + Enter" },
    { accion: "Ir al historial", teclas: "Ctrl/Cmd + H" },
    { accion: "Abrir ajustes PRO", teclas: "Ctrl/Cmd + P" },
    { accion: "Borrar todo", teclas: "Ctrl/Cmd + K" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0d0d0d] via-[#1a1a1a] to-[#0d0d0d]">
      <div className="container mx-auto px-4 py-20">
        
        {/* Hero */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Guía de <span className="text-amber-500">Uso</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Todo lo que necesitas saber para dominar Promptraits y crear prompts profesionales 
            desde el primer momento. Guía completa paso a paso.
          </p>
        </div>

        {/* Video Tutorial Placeholder */}
        <div className="mb-20 max-w-4xl mx-auto">
          <div className="bg-gradient-to-r from-amber-900/20 to-amber-800/20 rounded-2xl p-12 border border-amber-900/30 text-center">
            <Play className="w-20 h-20 text-amber-500 mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-white mb-4">Video Tutorial</h2>
            <p className="text-gray-300 mb-6">
              ¿Prefieres aprender viendo? Mira nuestro video tutorial de 5 minutos
            </p>
            <button className="bg-amber-600 hover:bg-amber-700 text-white font-bold py-3 px-8 rounded-xl transition-colors">
              Ver Video Tutorial
            </button>
          </div>
        </div>

        {/* Guía Paso a Paso */}
        <div className="space-y-6 mb-20">
          {guiaCompleta.map((seccion, index) => (
            <div 
              key={index}
              className="bg-[#1a1a1a] rounded-2xl border border-amber-900/20 overflow-hidden"
            >
              {/* Header de la sección */}
              <div 
                className="cursor-pointer p-8 hover:bg-[#0d0d0d] transition-colors"
                onClick={() => toggleStep(index)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-6">
                    <div className={`bg-gradient-to-r ${seccion.color} w-16 h-16 rounded-xl flex items-center justify-center text-white text-2xl font-bold`}>
                      {seccion.numero}
                    </div>
                    <div>
                      <h2 className="text-3xl font-bold text-white mb-2">
                        {seccion.titulo}
                      </h2>
                      <p className="text-gray-400">{seccion.descripcion}</p>
                    </div>
                  </div>
                  <div className="text-amber-500">
                    {activeStep === index ? (
                      <ChevronUp className="w-8 h-8" />
                    ) : (
                      <ChevronDown className="w-8 h-8" />
                    )}
                  </div>
                </div>
              </div>

              {/* Contenido expandible */}
              {activeStep === index && (
                <div className="px-8 pb-8 space-y-6">
                  {seccion.pasos.map((paso, pasoIndex) => (
                    <div 
                      key={pasoIndex}
                      className="bg-[#0d0d0d] rounded-xl p-6 border border-amber-900/10"
                    >
                      <div className="flex items-start gap-4">
                        <div className="bg-amber-600 w-8 h-8 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                          {pasoIndex + 1}
                        </div>
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-white mb-3">
                            {paso.titulo}
                          </h3>
                          <p className="text-gray-300 leading-relaxed mb-4">
                            {paso.contenido}
                          </p>
                          {paso.tips && paso.tips.length > 0 && (
                            <div className="bg-amber-900/20 rounded-lg p-4 border border-amber-500/20">
                              <p className="text-amber-500 font-semibold mb-2 flex items-center">
                                <Check className="w-4 h-4 mr-2" />
                                Tips:
                              </p>
                              <ul className="space-y-2">
                                {paso.tips.map((tip, tipIndex) => (
                                  <li key={tipIndex} className="text-gray-300 text-sm flex items-start">
                                    <span className="text-amber-500 mr-2">•</span>
                                    <span>{tip}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Atajos de Teclado */}
        <div className="bg-[#1a1a1a] rounded-2xl p-8 border border-amber-900/20 mb-20">
          <h2 className="text-4xl font-bold text-white text-center mb-8">
            Atajos de Teclado
          </h2>
          <div className="grid md:grid-cols-2 gap-4 max-w-4xl mx-auto">
            {shortcuts.map((shortcut, index) => (
              <div 
                key={index}
                className="flex items-center justify-between bg-[#0d0d0d] rounded-lg p-4"
              >
                <span className="text-gray-300">{shortcut.accion}</span>
                <kbd className="bg-amber-900/30 text-amber-300 px-4 py-2 rounded border border-amber-500/30 font-mono text-sm">
                  {shortcut.teclas}
                </kbd>
              </div>
            ))}
          </div>
        </div>

        {/* Solución de Problemas */}
        <div className="mb-20">
          <h2 className="text-4xl font-bold text-white text-center mb-12">
            Solución de Problemas Comunes
          </h2>
          <div className="space-y-4 max-w-4xl mx-auto">
            {troubleshooting.map((item, index) => (
              <div 
                key={index}
                className="bg-[#1a1a1a] rounded-xl p-6 border border-amber-900/20"
              >
                <div className="flex items-start gap-4">
                  <AlertCircle className="w-6 h-6 text-orange-400 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="text-xl font-bold text-white mb-3">
                      {item.problema}
                    </h3>
                    <p className="text-gray-300 leading-relaxed">
                      {item.solucion}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Soporte */}
        <div className="bg-gradient-to-r from-amber-900/20 to-amber-800/20 rounded-2xl p-8 md:p-12 border border-amber-900/30 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            ¿Necesitas Ayuda Adicional?
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Nuestro equipo de soporte está disponible para ayudarte con cualquier duda o problema que tengas
          </p>
          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <a 
              href="mailto:contacto@promptraits.com"
              className="bg-amber-600 hover:bg-amber-700 text-white font-bold py-4 px-8 rounded-xl transition-colors inline-flex items-center justify-center"
            >
              Enviar Email a Soporte
            </a>
            <a 
              href="/faq"
              className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-4 px-8 rounded-xl transition-colors inline-flex items-center justify-center"
            >
              Ver Preguntas Frecuentes
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GuiaUso;
