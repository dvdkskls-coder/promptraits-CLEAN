import React, { useState } from 'react';
import { ALL_PROMPTS } from '../data/prompts.js';
import { Check } from 'lucide-react';

export default function Gallery() {
  const [selectedCategory, setSelectedCategory] = useState('todos');
  const [copiedId, setCopiedId] = useState(null);

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

  const handleCopyPrompt = (promptObj) => {
    navigator.clipboard.writeText(promptObj.prompt);
    setCopiedId(promptObj.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <section className="py-24 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            Galería de <span className="text-[var(--primary)]">Retratos</span>
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Explora nuestra colección de prompts profesionales para crear retratos únicos con IA
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-6 py-2 rounded-full font-semibold transition-all ${
                selectedCategory === cat.id
                  ? 'bg-[var(--primary)] text-black'
                  : 'bg-white/5 text-gray-300 hover:bg-white/10'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredPrompts.map((prompt) => (
            <div
              key={prompt.id}
              onClick={() => handleCopyPrompt(prompt)}
              className="group relative cursor-pointer overflow-hidden rounded-xl"
              style={{ aspectRatio: '4/5' }}
            >
              <img
                src={prompt.image}
                alt={prompt.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              
              {copiedId === prompt.id && (
                <div className="absolute inset-0 bg-black/80 flex items-center justify-center animate-fade-in">
                  <div className="flex items-center gap-2 text-[var(--primary)] text-xl font-bold">
                    <Check className="w-6 h-6" />
                    <span>Prompt copiado</span>
                  </div>
                </div>
              )}
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
