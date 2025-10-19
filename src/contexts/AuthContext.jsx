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
      return data;
    } catch (err) {
      console.error('Error fetching profile:', err);
      setProfile({ credits: 0, plan: 'free' });
      return null;
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

  const signIn = async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;

      // Verificar si el email está confirmado
      if (data.user && !data.user.email_confirmed_at) {
        return { 
          success: false, 
          error: 'Por favor confirma tu email antes de iniciar sesión. Revisa tu bandeja de entrada.' 
        };
      }

      // Esperar a cargar el perfil
      if (data.user) {
        await fetchProfile(data.user.id);
      }

      return { success: true, data };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: error.message };
    }
  };

  const signUp = async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        }
      });
      
      if (error) throw error;

      // Mensaje de éxito con instrucciones
      return { 
        success: true, 
        data,
        message: 'Cuenta creada. Revisa tu email para confirmar tu cuenta.' 
      };
    } catch (error) {
      console.error('Signup error:', error);
      return { success: false, error: error.message };
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setProfile({ credits: 0, plan: 'free' });
  };

  const resendConfirmationEmail = async (email) => {
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email,
      });
      if (error) throw error;
      return { success: true, message: 'Email de confirmación reenviado.' };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  return (
    <AuthCtx.Provider value={{ 
      user, 
      profile, 
      loading, 
      signIn, 
      signUp, 
      signOut, 
      fetchProfile,
      resendConfirmationEmail 
    }}>
      {children}
    </AuthCtx.Provider>
  );
}

export const useAuth = () => useContext(AuthCtx);