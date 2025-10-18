import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

const AuthCtx = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState({ credits: 0, plan: 'free' });
  const [loading, setLoading] = useState(true);

  const fetchProfile = async (uid) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', uid)
        .single();
      if (error) throw error;
      setProfile(data || { credits: 0, plan: 'free' });
    } catch {
      // Fallback seguro si no hay tabla aún
      setProfile((p) => p || { credits: 0, plan: 'free' });
    }
  };

  useEffect(() => {
    let mounted = true;
    (async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!mounted) return;
      setUser(session?.user ?? null);
      if (session?.user) await fetchProfile(session.user.id);
      setLoading(false);
    })();

    const { data: sub } = supabase.auth.onAuthStateChange(async (_evt, session) => {
      setUser(session?.user ?? null);
      if (session?.user) await fetchProfile(session.user.id);
      else setProfile({ credits: 0, plan: 'free' });
    });

    return () => sub?.subscription?.unsubscribe?.();
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setProfile({ credits: 0, plan: 'free' });
  };

  // Utilidad global para refrescar créditos/perfil
  useEffect(() => {
    window.App_refreshProfile = async () => {
      if (user?.id) await fetchProfile(user.id);
    };
    return () => { delete window.App_refreshProfile; };
  }, [user]);

  return (
    <AuthCtx.Provider value={{ user, profile, loading, signOut }}>
      {children}
    </AuthCtx.Provider>
  );
}

export const useAuth = () =>
  useContext(AuthCtx) || { user: null, profile: { credits: 0, plan: 'free' }, loading: false, signOut: () => {} };