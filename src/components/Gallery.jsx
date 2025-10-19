import React from 'react';

export default function Gallery() {
  return (
    <section className="py-24 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold text-center mb-8">
          Galería de <span className="text-[var(--primary)]">Retratos</span>
        </h1>
        <p className="text-center text-gray-400 mb-12">
          Explora nuestra colección de retratos generados con IA
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white/5 border border-white/10 rounded-lg p-6 text-center">
            <p className="text-gray-400">Próximamente: Galería de ejemplos</p>
          </div>
        </div>
      </div>
    </section>
  );
}
