import React, { useState } from 'react';
import { ALL_PROMPTS } from '../data/prompts.js';

export default function Gallery() {
  const [selectedCategory, setSelectedCategory] = useState('todos');

  const categories = [
    { id: 'todos', name: 'Todos' },
    { id: 'hombre', name: 'Hombre' },
    { id: 'mujer', name: 'Mujer' },
    { id: 'mascotas', name: 'Mascotas' },
    { id: 'halloween', name: 'Halloween' },
    { id: 'pareja', name: 'Parejas' }
  ];

  const filteredPrompts = selectedCategory === 'todos' 
    ? ALL_PROMPTS 
    : ALL_PROMPTS.filter(p => p.category === selectedCategory);

  return (
    <section className="py-24 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Hero */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            Galería de <span className="text-[var(--primary)]">Retratos</span>
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Explora nuestra colección de prompts profesionales para crear retratos únicos con IA
          </p>
        </div>

        {/* Tabs de categorías */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-6 py-2 rounded-full font-semibold transition-all ``}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Grid de prompts */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPrompts.map((prompt) => (
            <div
              key={prompt.id}
              className="group bg-white/5 border border-white/10 rounded-xl overflow-hidden hover:border-[var(--primary)]/50 transition-all"
            >
              {/* Imagen */}
              <div className="relative aspect-square overflow-hidden bg-black/40">
                <img
                  src={prompt.image}
                  alt={prompt.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                {prompt.isPro && (
                  <div className="absolute top-3 right-3 bg-[var(--primary)] text-black px-3 py-1 rounded-full text-xs font-bold">
                    PRO
                  </div>
                )}
              </div>

              {/* Contenido */}
              <div className="p-5">
                <h3 className="font-bold text-lg mb-2 text-white">{prompt.title}</h3>
                <p className="text-sm text-gray-400 mb-4">{prompt.description}</p>
                
                <button className="w-full bg-[var(--primary)]/10 hover:bg-[var(--primary)]/20 text-[var(--primary)] font-semibold py-2 rounded-lg transition-all">
                  Ver Prompt
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredPrompts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400">No hay prompts en esta categoría todavía.</p>
          </div>
        )}
      </div>
    </section>
  );
}
