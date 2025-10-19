import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { Trash2, Calendar } from 'lucide-react';

export default function PromptHistory() {
  const { user, profile } = useAuth();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchHistory();
    }
  }, [user]);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('prompt_history')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setHistory(data || []);
    } catch (err) {
      console.error('Error fetching history:', err);
    } finally {
      setLoading(false);
    }
  };

  const deletePrompt = async (id) => {
    try {
      const { error } = await supabase
        .from('prompt_history')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setHistory(history.filter(p => p.id !== id));
    } catch (err) {
      console.error('Error deleting prompt:', err);
    }
  };

  if (loading) {
    return <div className="text-center py-8">Cargando historial...</div>;
  }

  if (history.length === 0) {
    return (
      <div className="text-center py-8 text-gray-400">
        No tienes prompts guardados aún.
        {profile.plan === 'free' && (
          <p className="mt-2 text-sm">
            Los usuarios Free guardan solo los últimos 3 prompts.
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold">
          Historial de Prompts
          {profile.plan === 'free' && (
            <span className="text-sm text-gray-400 ml-2">
              (últimos 3)
            </span>
          )}
        </h3>
        <span className="text-sm text-gray-400">
          {history.length} prompt{history.length !== 1 ? 's' : ''}
        </span>
      </div>

      <div className="space-y-3">
        {history.map((prompt) => (
          <div
            key={prompt.id}
            className="bg-white/5 border border-white/10 rounded-lg p-4 hover:bg-white/10 transition"
          >
            <div className="flex justify-between items-start gap-4">
              <div className="flex-1">
                <p className="text-white mb-2">{prompt.prompt_text}</p>
                <div className="flex items-center gap-2 text-xs text-gray-400">
                  <Calendar className="w-3 h-3" />
                  {new Date(prompt.created_at).toLocaleString('es-ES', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </div>
              </div>

              {prompt.image_url && (
                <img
                  src={prompt.image_url}
                  alt="Prompt result"
                  className="w-20 h-20 object-cover rounded"
                />
              )}

              <button
                onClick={() => deletePrompt(prompt.id)}
                className="p-2 text-red-400 hover:text-red-300 hover:bg-red-400/10 rounded transition"
                title="Eliminar"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
