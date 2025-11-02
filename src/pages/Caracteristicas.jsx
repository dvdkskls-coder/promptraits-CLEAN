import React from 'react';
import { Sparkles, Camera, Palette, Zap, Shield, History } from 'lucide-react';

const Caracteristicas = () => {
  const features = [
    {
      icon: <Sparkles className="w-8 h-8" />,
      title: "Generación Inteligente de Prompts",
      description: "Crea prompts ultra-realistas y cinematográficos con tecnología de IA avanzada. Nuestro sistema analiza tus preferencias y genera descripciones profesionales optimizadas para Midjourney y Stable Diffusion."
    },
    {
      icon: <Camera className="w-8 h-8" />,
      title: "Herramientas Profesionales PRO",
      description: "Accede a controles avanzados de fotografía: tipos de toma, ángulos de cámara, esquemas de iluminación profesional, lentes especializadas y técnicas de color grading. Todo lo que necesitas para resultados de nivel cinematográfico."
    },
    {
      icon: <Palette className="w-8 h-8" />,
      title: "Estilos y Presets Personalizables",
      description: "Elige entre docenas de estilos predefinidos o crea el tuyo propio. Desde retratos corporativos hasta fotografía editorial, pasando por estilos artísticos y cinematográficos únicos."
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Generación Instantánea",
      description: "Obtén tus prompts en segundos. Sin esperas, sin complicaciones. Simplemente selecciona tus preferencias y genera prompts profesionales al instante."
    },
    {
      icon: <History className="w-8 h-8" />,
      title: "Historial de Prompts",
      description: "Guarda automáticamente todos tus prompts generados. Accede a tu historial completo, copia prompts anteriores y gestiona tus creaciones desde tu panel de usuario."
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Privacidad y Seguridad",
      description: "Tus datos están seguros. No almacenamos ni procesamos las imágenes que generas con nuestros prompts. Solo guardamos los prompts de texto que creas en tu cuenta."
    }
  ];

  const technicalFeatures = [
    {
      category: "Control Fotográfico",
      items: [
        "Tipos de toma (Primer plano, Plano medio, Cuerpo completo)",
        "Ángulos de cámara profesionales",
        "Esquemas de iluminación cinemática",
        "Selección de lentes especializadas",
        "Configuración de filtros y efectos"
      ]
    },
    {
      category: "Personalización Avanzada",
      items: [
        "Descripción física detallada",
        "Selección de vestuario por género",
        "Ambientación y localización",
        "Expresiones emocionales",
        "Referencias de imagen (upload)"
      ]
    },
    {
      category: "Optimización de Salida",
      items: [
        "Prompts optimizados para Midjourney v7",
        "Soporte para Stable Diffusion",
        "Parámetros técnicos incluidos",
        "Color grading profesional",
        "Efectos cinematográficos avanzados"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0d0d0d] via-[#1a1a1a] to-[#0d0d0d]">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Características de <span className="text-amber-500">Promptraits</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Todo lo que necesitas para crear prompts profesionales de fotografía con IA. 
            Desde herramientas básicas hasta controles cinematográficos avanzados.
          </p>
        </div>

        {/* Main Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="bg-[#1a1a1a] rounded-xl p-8 border border-amber-900/20 hover:border-amber-500/50 transition-all duration-300 hover:transform hover:scale-105"
            >
              <div className="text-amber-500 mb-4">
                {feature.icon}
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">
                {feature.title}
              </h3>
              <p className="text-gray-400 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* Technical Features */}
        <div className="bg-[#1a1a1a] rounded-2xl p-8 md:p-12 border border-amber-900/20 mb-20">
          <h2 className="text-4xl font-bold text-white text-center mb-12">
            Características Técnicas
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {technicalFeatures.map((section, index) => (
              <div key={index} className="space-y-4">
                <h3 className="text-2xl font-bold text-amber-500 mb-6">
                  {section.category}
                </h3>
                <ul className="space-y-3">
                  {section.items.map((item, itemIndex) => (
                    <li key={itemIndex} className="flex items-start text-gray-300">
                      <span className="text-amber-500 mr-3 mt-1">✓</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Compatibility Section */}
        <div className="bg-gradient-to-r from-amber-900/20 to-amber-800/20 rounded-2xl p-8 md:p-12 border border-amber-900/30">
          <h2 className="text-4xl font-bold text-white text-center mb-8">
            Compatibilidad Total
          </h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="bg-[#1a1a1a] rounded-xl p-6">
              <h3 className="text-2xl font-bold text-amber-500 mb-4">Midjourney</h3>
              <p className="text-gray-300">
                Prompts optimizados para Midjourney v7 con parámetros específicos 
                como --style raw, --chaos, --stylize y configuraciones de realismo avanzadas.
              </p>
            </div>
            <div className="bg-[#1a1a1a] rounded-xl p-6">
              <h3 className="text-2xl font-bold text-amber-500 mb-4">Stable Diffusion</h3>
              <p className="text-gray-300">
                Soporte completo para Stable Diffusion con descripciones detalladas 
                y técnicas de prompt engineering específicas para este modelo.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Caracteristicas;
