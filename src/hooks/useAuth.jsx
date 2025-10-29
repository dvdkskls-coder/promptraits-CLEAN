import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export function useAuth() {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const refreshProfile = async () => {
    if (!user?.id) return;
    console.log('🔄 Refrescando perfil del usuario:', user.id);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      if (error) {
        console.error('❌ Error refrescando perfil:', error);
        return;
      }
      console.log('✅ Perfil actualizado:', data);
      setProfile(data);
    } catch (error) {
      console.error('❌ Error en refreshProfile:', error);
    }
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        loadProfile(session.user.id);
      } else {
        setLoading(false);
      }
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      console.log('🔐 Auth state changed:', _event);
      setUser(session?.user ?? null);
      if (session?.user) {
        loadProfile(session.user.id);
      } else {
        setProfile(null);
        setLoading(false);
      }
    });
    return () => subscription.unsubscribe();
  }, []);

  const loadProfile = async (userId) => {
    console.log('📊 Cargando perfil para:', userId);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      if (error) {
        console.error('❌ Error cargando perfil:', error);
        if (error.code === 'PGRST116') {
          console.log('📝 Perfil no existe, creando...');
          await createProfile(userId);
        }
      } else {
        console.log('✅ Perfil cargado:', data);
        setProfile(data);
      }
    } catch (error) {
      console.error('❌ Error en loadProfile:', error);
    } finally {
      setLoading(false);
    }
  };

  const createProfile = async (userId) => {
    try {
      const { data: userData } = await supabase.auth.getUser();
      const email = userData?.user?.email;

      const { data, error } = await supabase
        .from('profiles')
        .insert([
          {
            id: userId,
            email: email,
            plan: 'free',
            credits: 10,
            created_at: new Date().toISOString()
          }
        ])
        .select()
        .single();

      if (error) {
        console.error('❌ Error creando perfil:', error);
      } else {
        console.log('✅ Perfil creado:', data);
        setProfile(data);
      }
    } catch (error) {
      console.error('❌ Error en createProfile:', error);
    }
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (!error) {
      setUser(null);
      setProfile(null);
    }
    return { error };
  };

  return {
    user,
    profile,
    loading,
    signOut,
    refreshProfile,
  };
}