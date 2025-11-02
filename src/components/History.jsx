import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { Copy, Trash2, Calendar, Sparkles, Check } from 'lucide-react';

export default function History() {
  const { user } = useAuth();
  const [prompts, setPrompts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState(null);

  useEffect(() => {
    if (user) {
      loadHistory();
    }
  }, [user]);

  const loadHistory = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('prompt_history')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      setPrompts(data || []);
    } catch (err) {
      console.error('Error loading history:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async (prompt) => {
    try {
      await navigator.clipboard.writeText(prompt.prompt_text);
      setCopiedId(prompt.id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      alert('Error al copiar el prompt');
    }
  };

  const handleDelete = async (promptId) => {
    if (!confirm('¿Eliminar este prompt del historial?')) return;

    try {
      const { error } = await supabase
        .from('prompt_history')
        .delete()
        .eq('id', promptId);

      if (error) throw error;
      
      // Actualizar lista local
      setPrompts(prompts.filter(p => p.id !== promptId));
    } catch (err) {
      alert('Error al eliminar: ' + err.message);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!user) {
    return (
      <section className="py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-center mb-8">
            Historial de <span className="text-[var(--primary)]">Prompts</span>
          </h1>
          <div className="bg-white/5 border border-white/10 rounded-lg p-8 text-center">
            <p className="text-gray-400">Inicia sesión para ver tu historial</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-24 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold text-center mb-8">
          Historial de <span className="text-[var(--primary)]">Prompts</span>
        </h1>

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--primary)]"></div>
          </div>
        ) : prompts.length === 0 ? (
          <div className="bg-white/5 border border-white/10 rounded-lg p-8 text-center">
            <Sparkles className="w-16 h-16 text-gray-500 mx-auto mb-4" />
            <p className="text-gray-400 text-lg mb-2">
              Aún no has generado ningún prompt
            </p>
            <p className="text-gray-500 text-sm">
              Usa el Generador IA para crear tu primer prompt profesional
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {prompts.map((prompt) => (
              <div
                key={prompt.id}
                className="bg-white/5 border border-white/10 rounded-lg p-6 hover:bg-white/10 transition"
              >
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <Calendar className="w-4 h-4" />
                    {formatDate(prompt.created_at)}
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleCopy(prompt)}
                      className="p-2 hover:bg-white/10 rounded-lg transition"
                      title="Copiar prompt"
                    >
                      {copiedId === prompt.id ? (
                        <Check className="w-4 h-4 text-green-400" />
                      ) : (
                        <Copy className="w-4 h-4 text-gray-400" />
                      )}
                    </button>
                    <button
                      onClick={() => handleDelete(prompt.id)}
                      className="p-2 hover:bg-red-500/10 rounded-lg transition"
                      title="Eliminar"
                    >
                      <Trash2 className="w-4 h-4 text-red-400" />
                    </button>
                  </div>
                </div>

                <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap">
                  {prompt.prompt_text}
                </p>

                {prompt.platform && (
                  <div className="mt-3 inline-flex items-center px-2 py-1 bg-[var(--primary)]/10 rounded text-xs text-[var(--primary)]">
                    {prompt.platform === 'nano-banana' ? '🍌 Nano-Banana' : '🎨 Midjourney'}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
