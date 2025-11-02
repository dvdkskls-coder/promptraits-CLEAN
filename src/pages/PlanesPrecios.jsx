import React, { useState } from 'react';
import { Check, X, Zap, Crown, Gift } from 'lucide-react';

const PlanesPrecios = () => {
  const plans = [
    {
      name: "Free",
      icon: <Gift className="w-8 h-8" />,
      price: "0",
      credits: "3",
      creditsRenewal: "3 créditos al mes",
      description: "Perfecto para probar la plataforma",
      color: "from-gray-600 to-gray-700",
      buttonText: "Comenzar Gratis",
      buttonStyle: "bg-gray-600 hover:bg-gray-700",
      features: [
        { text: "3 créditos mensuales", included: true },
        { text: "Generador básico de prompts", included: true },
        { text: "Historial de prompts", included: true },
        { text: "Estilos predefinidos básicos", included: true },
        { text: "Herramientas PRO", included: false },
        { text: "Presets premium", included: false },
        { text: "Soporte prioritario", included: false }
      ]
    },
    {
      name: "PRO",
      icon: <Zap className="w-8 h-8" />,
      price: "6.99",
      credits: "60",
      creditsRenewal: "60 créditos al mes",
      description: "Para creadores que necesitan más potencia",
      color: "from-amber-600 to-amber-700",
      buttonText: "Comenzar PRO",
      buttonStyle: "bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800",
      popular: true,
      features: [
        { text: "60 créditos mensuales", included: true },
        { text: "Todas las herramientas PRO", included: true },
        { text: "Control fotográfico avanzado", included: true },
        { text: "Tipos de toma y ángulos", included: true },
        { text: "Esquemas de iluminación", included: true },
        { text: "Lentes profesionales", included: true },
        { text: "Acceso a presets PRO", included: true },
        { text: "Historial ilimitado", included: true },
        { text: "Soporte por email", included: true }
      ]
    },
    {
      name: "PRO Premium",
      icon: <Crown className="w-8 h-8" />,
      price: "19.99",
      credits: "300",
      creditsRenewal: "300 créditos al mes",
      description: "Para profesionales y equipos creativos",
      color: "from-yellow-500 to-orange-600",
      buttonText: "Comenzar Premium",
      buttonStyle: "bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700",
      features: [
        { text: "300 créditos mensuales", included: true },
        { text: "Todo lo incluido en PRO", included: true },
        { text: "Créditos adicionales con descuento", included: true },
        { text: "Acceso anticipado a nuevas funciones", included: true },
        { text: "Soporte prioritario", included: true },
        { text: "Presets exclusivos premium", included: true },
        { text: "Exportación de presets personalizados", included: true }
      ]
    }
  ];

  const creditPacks = [
    {
      credits: 10,
      price: "2.99",
      pricePerCredit: "0.30",
      color: "from-amber-500 to-amber-600"
    },
    {
      credits: 30,
      price: "7.99",
      pricePerCredit: "0.27",
      color: "from-amber-600 to-amber-700",
      discount: "10% descuento"
    },
    {
      credits: 60,
      price: "13.99",
      pricePerCredit: "0.23",
      color: "from-yellow-500 to-amber-600",
      discount: "23% descuento",
      popular: true
    },
    {
      credits: 100,
      price: "19.99",
      pricePerCredit: "0.20",
      color: "from-yellow-500 to-orange-600",
      discount: "33% descuento"
    }
  ];

  const faqs = [
    {
      question: "¿Qué es un crédito?",
      answer: "Un crédito equivale a una generación de prompt. Cada vez que generas un prompt profesional con nuestro sistema, se consume 1 crédito de tu cuenta."
    },
    {
      question: "¿Los créditos caducan?",
      answer: "Los créditos de suscripción se renuevan cada mes. Los créditos adicionales comprados no caducan nunca y permanecen en tu cuenta hasta que los uses."
    },
    {
      question: "¿Puedo cambiar de plan en cualquier momento?",
      answer: "Sí, puedes actualizar o degradar tu plan cuando quieras. Los cambios se aplicarán en tu próximo ciclo de facturación."
    },
    {
      question: "¿Qué son las herramientas PRO?",
      answer: "Las herramientas PRO incluyen controles avanzados de fotografía: tipos de toma, ángulos de cámara, esquemas de iluminación profesional, selección de lentes, filtros y técnicas de color grading cinematográfico."
    },
    {
      question: "¿Puedo cancelar mi suscripción?",
      answer: "Por supuesto. Puedes cancelar tu suscripción en cualquier momento desde tu panel de usuario. Seguirás teniendo acceso hasta el final de tu periodo de facturación actual."
    },
    {
      question: "¿Ofrecen descuentos para estudiantes o educadores?",
      answer: "Sí, ofrecemos descuentos especiales para estudiantes y educadores. Contáctanos en contacto@promptraits.com con tu acreditación educativa."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0d0d0d] via-[#1a1a1a] to-[#0d0d0d]">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Planes y <span className="text-amber-500">Precios</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
            Elige el plan perfecto para tus necesidades. Todos los planes incluyen 
            acceso completo a la plataforma y actualizaciones gratuitas.
          </p>
        </div>

        {/* Plans Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-20 max-w-7xl mx-auto">
          {plans.map((plan, index) => (
            <div 
              key={index}
              className={`relative bg-[#1a1a1a] rounded-2xl p-8 border ${
                plan.popular 
                  ? 'border-amber-500 shadow-2xl shadow-amber-500/20 transform scale-105' 
                  : 'border-amber-900/20'
              } hover:border-amber-500/50 transition-all duration-300`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-gradient-to-r from-amber-600 to-amber-700 text-white px-6 py-2 rounded-full text-sm font-bold">
                    MÁS POPULAR
                  </span>
                </div>
              )}

              <div className={`bg-gradient-to-r ${plan.color} w-16 h-16 rounded-xl flex items-center justify-center text-white mb-6`}>
                {plan.icon}
              </div>

              <h3 className="text-3xl font-bold text-white mb-2">{plan.name}</h3>
              <p className="text-gray-400 mb-6">{plan.description}</p>

              <div className="mb-6">
                <div className="flex items-baseline">
                  <span className="text-5xl font-bold text-white">{plan.price}€</span>
                  <span className="text-gray-400 ml-2">/mes</span>
                </div>
                <div className="text-amber-500 font-semibold mt-2">{plan.creditsRenewal}</div>
              </div>

              <button className={`w-full ${plan.buttonStyle} text-white font-bold py-4 rounded-xl transition-all duration-300 mb-8`}>
                {plan.buttonText}
              </button>

              <div className="space-y-4">
                {plan.features.map((feature, featureIndex) => (
                  <div key={featureIndex} className="flex items-start">
                    {feature.included ? (
                      <Check className="w-5 h-5 text-green-400 mr-3 flex-shrink-0 mt-0.5" />
                    ) : (
                      <X className="w-5 h-5 text-gray-600 mr-3 flex-shrink-0 mt-0.5" />
                    )}
                    <span className={feature.included ? "text-gray-300" : "text-gray-600"}>
                      {feature.text}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Credit Packs Section */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4">
              ¿Necesitas más créditos?
            </h2>
            <p className="text-xl text-gray-300">
              Compra paquetes adicionales de créditos que nunca caducan
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
            {creditPacks.map((pack, index) => (
              <div 
                key={index}
                className={`relative bg-[#1a1a1a] rounded-xl p-6 border ${
                  pack.popular 
                    ? 'border-amber-500 shadow-xl shadow-amber-500/20' 
                    : 'border-amber-900/20'
                } hover:border-amber-500/50 transition-all duration-300`}
              >
                {pack.discount && (
                  <div className="absolute -top-3 -right-3">
                    <span className="bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                      {pack.discount}
                    </span>
                  </div>
                )}

                <div className={`bg-gradient-to-r ${pack.color} w-12 h-12 rounded-lg flex items-center justify-center text-white mb-4`}>
                  <Zap className="w-6 h-6" />
                </div>

                <div className="text-4xl font-bold text-white mb-2">{pack.credits}</div>
                <div className="text-gray-400 mb-4">créditos</div>

                <div className="flex items-baseline mb-4">
                  <span className="text-3xl font-bold text-white">{pack.price}€</span>
                </div>

                <div className="text-sm text-gray-400 mb-6">
                  {pack.pricePerCredit}€ por crédito
                </div>

                <button className={`w-full bg-gradient-to-r ${pack.color} text-white font-bold py-3 rounded-lg hover:opacity-90 transition-opacity`}>
                  Comprar
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Benefits Section */}
        <div className="bg-gradient-to-r from-amber-900/20 to-amber-800/20 rounded-2xl p-8 md:p-12 border border-amber-900/30 mb-20">
          <h2 className="text-4xl font-bold text-white text-center mb-12">
            Todos los planes incluyen
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-amber-500 mb-4">✓</div>
              <h3 className="text-xl font-bold text-white mb-2">Sin compromisos</h3>
              <p className="text-gray-300">Cancela cuando quieras</p>
            </div>
            <div className="text-center">
              <div className="text-amber-500 mb-4">✓</div>
              <h3 className="text-xl font-bold text-white mb-2">Actualizaciones gratis</h3>
              <p className="text-gray-300">Mejoras continuas incluidas</p>
            </div>
            <div className="text-center">
              <div className="text-amber-500 mb-4">✓</div>
              <h3 className="text-xl font-bold text-white mb-2">Soporte técnico</h3>
              <p className="text-gray-300">Ayuda cuando la necesites</p>
            </div>
            <div className="text-center">
              <div className="text-amber-500 mb-4">✓</div>
              <h3 className="text-xl font-bold text-white mb-2">Seguridad garantizada</h3>
              <p className="text-gray-300">Tus datos protegidos</p>
            </div>
          </div>
        </div>

        {/* FAQs */}
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold text-white text-center mb-12">
            Preguntas Frecuentes
          </h2>
          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <div 
                key={index}
                className="bg-[#1a1a1a] rounded-xl p-6 border border-amber-900/20"
              >
                <h3 className="text-xl font-bold text-amber-500 mb-3">
                  {faq.question}
                </h3>
                <p className="text-gray-300 leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center mt-20">
          <h2 className="text-4xl font-bold text-white mb-6">
            ¿Listo para comenzar?
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Únete a miles de creadores que ya están generando prompts profesionales con Promptraits
          </p>
          <button className="bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white font-bold py-4 px-12 rounded-xl text-lg transition-all duration-300 transform hover:scale-105">
            Comenzar Gratis
          </button>
        </div>
      </div>
    </div>
  );
};

export default PlanesPrecios;
