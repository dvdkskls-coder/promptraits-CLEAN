import React from 'react';
import { useAuth } from '../contexts/AuthContext';

export default function Generator() {
  const { user, profile } = useAuth();

  return (
    <section className="py-24 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold text-center mb-8">
          Generador de <span className="text-[var(--primary)]">Prompts IA</span>
        </h1>
        
        {user ? (
          <div className="bg-white/5 border border-white/10 rounded-lg p-8">
            <p className="text-center text-gray-400 mb-4">
              Tienes <span className="text-[var(--primary)] font-bold">{profile?.credits || 0}</span> créditos
            </p>
            <p className="text-center text-gray-500">
              Generador en desarrollo...
            </p>
          </div>
        ) : (
          <div className="bg-white/5 border border-white/10 rounded-lg p-8 text-center">
            <p className="text-gray-400">Inicia sesión para usar el generador</p>
          </div>
        )}
      </div>
    </section>
  );
}
