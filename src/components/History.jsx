import React from 'react';
import { useAuth } from '../contexts/AuthContext';

export default function History() {
  const { user } = useAuth();

  return (
    <section className="py-24 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold text-center mb-8">
          Historial de <span className="text-[var(--primary)]">Prompts</span>
        </h1>
        
        {user ? (
          <div className="bg-white/5 border border-white/10 rounded-lg p-8">
            <p className="text-center text-gray-400">
              Aquí aparecerán tus prompts generados
            </p>
          </div>
        ) : (
          <div className="bg-white/5 border border-white/10 rounded-lg p-8 text-center">
            <p className="text-gray-400">Inicia sesión para ver tu historial</p>
          </div>
        )}
      </div>
    </section>
  );
}
