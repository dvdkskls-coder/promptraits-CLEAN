import React, { useState } from 'react';
import { Copy, Check, Sparkles, Camera, Palette, Users } from 'lucide-react';

const Ejemplos = () => {
  const [copiedIndex, setCopiedIndex] = useState(null);

  const handleCopy = (text, index) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const ejemplosPrompts = [
    {
      categoria: "Retrato Corporativo",
      icon: <Users className="w-6 h-6" />,
      descripcion: "Perfecto para LinkedIn, webs corporativas y perfiles profesionales",
      prompt: "Professional corporate headshot of a confident businesswoman in her 30s, wearing a navy blue blazer and white blouse, short brown hair styled professionally, warm genuine smile, standing against a modern office background with soft natural window light, shot with Canon EF 85mm f/1.4L lens, shallow depth of field, professional studio lighting setup with key light at 45 degrees, subtle rim light, clean and polished look, sharp focus on eyes, bokeh background, corporate photography style --ar 4:5 --style raw --v 7",
      caracteristicas: ["Iluminación profesional", "Fondo corporativo", "Lente 85mm", "Estilo pulido"],
      color: "from-amber-500 to-amber-600"
    },
    {
      categoria: "Fotografía Editorial",
      icon: <Palette className="w-6 h-6" />,
      descripcion: "Para revistas de moda, portfolios artísticos y campañas",
      prompt: "Editorial fashion portrait of a male model in his mid-20s, athletic build, styled in minimalist black designer clothing, short textured blonde hair, intense gaze directly at camera, dramatic side lighting creating strong shadows, moody atmosphere, shot with Hasselblad XCD 80mm f/1.9 lens, standing in an industrial warehouse with concrete walls and metal beams, cinematic color grading with teal and orange tones, high fashion editorial style, vogue magazine aesthetic, ultra sharp details --chaos 25 --ar 3:4 --style raw --v 7 --stylize 450",
      caracteristicas: ["Iluminación dramática", "Tono editorial", "Color grading avanzado", "Alta definición"],
      color: "from-yellow-500 to-amber-600"
    },
    {
      categoria: "Retrato Natural",
      icon: <Sparkles className="w-6 h-6" />,
      descripcion: "Estilo natural y relajado para redes sociales y uso personal",
      prompt: "Natural lifestyle portrait of a smiling woman in her late 20s, casual style wearing a cream knit sweater, long wavy brown hair, genuine warm expression, sitting in a cozy coffee shop with large windows, golden hour natural light streaming through, shot with Sony FE 50mm f/1.8 lens, soft bokeh background, warm color palette, candid feel, instagram-worthy aesthetic, authentic and approachable mood, subtle film grain --ar 4:5 --style raw --v 7",
      caracteristicas: ["Luz natural", "Ambiente casual", "Estilo lifestyle", "Colores cálidos"],
      color: "from-orange-500 to-amber-600"
    },
    {
      categoria: "Fotografía Cinematográfica",
      icon: <Camera className="w-6 h-6" />,
      descripcion: "Look cinematográfico para proyectos creativos y artísticos",
      prompt: "Cinematic portrait of a mysterious man in his 40s, wearing a dark trench coat, salt and pepper beard, intense piercing eyes, moody expression, shot in a rain-soaked urban street at night, neon signs reflecting on wet pavement, dramatic lighting with strong rim light creating silhouette effect, shot with Arri Alexa Mini and Cooke S4 50mm lens, shallow depth of field, cinematic color grading with deep blacks and vibrant highlights, film noir aesthetic, atmospheric fog, highly detailed 8K quality --chaos 20 --ar 16:9 --style raw --v 7 --stylize 500",
      caracteristicas: ["Estilo noir", "Iluminación dramática", "8K quality", "Ambiente nocturno"],
      color: "from-gray-700 to-gray-900"
    }
  ];

  const useCases = [
    {
      title: "Creadores de Contenido",
      description: "Genera avatares únicos para tus redes sociales, thumbnails de YouTube y contenido visual consistente con tu marca personal.",
      tools: ["Estilos personalizados", "Presets rápidos", "Historial de prompts"]
    },
    {
      title: "Diseñadores y Artistas",
      description: "Crea referencias visuales profesionales para tus proyectos, mockups de clientes y concept art con control total sobre iluminación y composición.",
      tools: ["Control fotográfico avanzado", "Color grading", "Lentes profesionales"]
    },
    {
      title: "Profesionales de Marketing",
      description: "Desarrolla imágenes corporativas coherentes para campañas, avatares de equipo y material promocional con estilo unificado.",
      tools: ["Plantillas corporativas", "Batch generation", "Exportación de presets"]
    },
    {
      title: "Fotógrafos",
      description: "Experimenta con diferentes estilos de iluminación, composiciones y técnicas antes de la sesión fotográfica real.",
      tools: ["Esquemas de luz", "Tipos de toma", "Ángulos de cámara"]
    }
  ];

  const beforeAfter = [
    {
      title: "Prompt Básico vs PRO",
      basic: "portrait of a woman",
      pro: "Professional corporate headshot of a confident woman in her 30s, wearing navy blue blazer, warm smile, modern office background with soft natural window light, shot with Canon EF 85mm f/1.4L lens, shallow depth of field, professional studio lighting, sharp focus on eyes --ar 4:5 --style raw --v 7",
      mejoras: [
        "Descripción detallada del sujeto",
        "Especificaciones técnicas de cámara",
        "Configuración de iluminación profesional",
        "Parámetros de calidad optimizados"
      ]
    }
  ];

  const tips = [
    {
      title: "Sé específico con la descripción",
      description: "Cuanto más detallado seas con la apariencia física, vestimenta y expresión, mejores resultados obtendrás."
    },
    {
      title: "Usa las herramientas PRO",
      description: "Los esquemas de iluminación y tipos de toma transforman completamente el resultado final."
    },
    {
      title: "Experimenta con estilos",
      description: "No tengas miedo de probar diferentes combinaciones. Los presets son un excelente punto de partida."
    },
    {
      title: "Guarda tus favoritos",
      description: "Usa el historial para guardar los prompts que mejores resultados te den y construye sobre ellos."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0d0d0d] via-[#1a1a1a] to-[#0d0d0d]">
      <div className="container mx-auto px-4 py-20">
        
        {/* Hero */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Ejemplos de <span className="text-amber-500">Prompts</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Descubre el poder de los prompts profesionales. Estos ejemplos fueron generados 
            con Promptraits y muestran la calidad que puedes lograr.
          </p>
        </div>

        {/* Ejemplos de Prompts */}
        <div className="space-y-8 mb-20">
          {ejemplosPrompts.map((ejemplo, index) => (
            <div 
              key={index}
              className="bg-[#1a1a1a] rounded-2xl p-8 border border-amber-900/20 hover:border-amber-500/50 transition-all duration-300"
            >
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center">
                  <div className={`bg-gradient-to-r ${ejemplo.color} w-12 h-12 rounded-lg flex items-center justify-center text-white mr-4`}>
                    {ejemplo.icon}
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white">{ejemplo.categoria}</h3>
                    <p className="text-gray-400">{ejemplo.descripcion}</p>
                  </div>
                </div>
                <button
                  onClick={() => handleCopy(ejemplo.prompt, index)}
                  className="bg-amber-600 hover:bg-amber-700 text-white p-3 rounded-lg transition-colors flex items-center gap-2"
                >
                  {copiedIndex === index ? (
                    <>
                      <Check className="w-5 h-5" />
                      <span className="hidden md:inline">Copiado</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-5 h-5" />
                      <span className="hidden md:inline">Copiar</span>
                    </>
                  )}
                </button>
              </div>

              <div className="bg-[#0d0d0d] rounded-xl p-6 mb-6">
                <p className="text-gray-300 leading-relaxed font-mono text-sm">
                  {ejemplo.prompt}
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                {ejemplo.caracteristicas.map((feature, featureIndex) => (
                  <span 
                    key={featureIndex}
                    className="bg-amber-900/30 text-amber-300 px-4 py-2 rounded-full text-sm border border-amber-500/30"
                  >
                    {feature}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Antes y Después */}
        <div className="mb-20">
          <h2 className="text-4xl font-bold text-white text-center mb-12">
            La Diferencia de un Prompt Profesional
          </h2>
          <div className="bg-gradient-to-r from-red-900/30 to-green-900/30 rounded-2xl p-8 border border-amber-900/30">
            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <div>
                <div className="bg-red-900/30 text-red-300 px-4 py-2 rounded-lg inline-block mb-4 font-bold">
                  ❌ Prompt Básico
                </div>
                <div className="bg-[#0d0d0d] rounded-xl p-6">
                  <p className="text-gray-300 font-mono text-sm">
                    {beforeAfter[0].basic}
                  </p>
                </div>
                <p className="text-gray-400 mt-4">
                  Resultado: Genérico, impredecible, baja calidad
                </p>
              </div>
              <div>
                <div className="bg-green-900/30 text-green-300 px-4 py-2 rounded-lg inline-block mb-4 font-bold">
                  ✅ Prompt PRO
                </div>
                <div className="bg-[#0d0d0d] rounded-xl p-6">
                  <p className="text-gray-300 font-mono text-sm">
                    {beforeAfter[0].pro}
                  </p>
                </div>
                <p className="text-gray-400 mt-4">
                  Resultado: Profesional, consistente, alta calidad
                </p>
              </div>
            </div>

            <div className="bg-[#1a1a1a] rounded-xl p-6">
              <h3 className="text-xl font-bold text-white mb-4">Mejoras incluidas en el prompt PRO:</h3>
              <ul className="grid md:grid-cols-2 gap-3">
                {beforeAfter[0].mejoras.map((mejora, index) => (
                  <li key={index} className="flex items-start text-gray-300">
                    <span className="text-green-400 mr-3">✓</span>
                    <span>{mejora}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Casos de Uso */}
        <div className="mb-20">
          <h2 className="text-4xl font-bold text-white text-center mb-12">
            ¿Quién Usa Promptraits?
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            {useCases.map((useCase, index) => (
              <div 
                key={index}
                className="bg-[#1a1a1a] rounded-xl p-8 border border-amber-900/20"
              >
                <h3 className="text-2xl font-bold text-amber-500 mb-4">
                  {useCase.title}
                </h3>
                <p className="text-gray-300 mb-6 leading-relaxed">
                  {useCase.description}
                </p>
                <div className="space-y-2">
                  <p className="text-sm text-gray-400 font-semibold mb-2">Herramientas que usarás:</p>
                  {useCase.tools.map((tool, toolIndex) => (
                    <div key={toolIndex} className="flex items-center text-gray-300">
                      <span className="text-amber-500 mr-2">→</span>
                      <span>{tool}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tips */}
        <div className="bg-gradient-to-r from-amber-900/20 to-amber-800/20 rounded-2xl p-8 md:p-12 border border-amber-900/30 mb-20">
          <h2 className="text-4xl font-bold text-white text-center mb-12">
            Consejos para Mejores Resultados
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {tips.map((tip, index) => (
              <div 
                key={index}
                className="bg-[#1a1a1a] rounded-xl p-6"
              >
                <h3 className="text-xl font-bold text-amber-500 mb-3">
                  💡 {tip.title}
                </h3>
                <p className="text-gray-300">
                  {tip.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            ¿Listo para crear tus propios prompts profesionales?
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Empieza gratis hoy y descubre cómo Promptraits transforma tus ideas en prompts de calidad profesional
          </p>
          <button className="bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white font-bold py-4 px-12 rounded-xl text-lg transition-all duration-300 transform hover:scale-105">
            Probar Ahora Gratis
          </button>
        </div>
      </div>
    </div>
  );
};

export default Ejemplos;
