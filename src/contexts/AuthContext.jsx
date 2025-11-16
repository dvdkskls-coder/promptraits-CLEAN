import { createContext, useState, useEffect, useContext } from "react";
import { supabase } from "../lib/supabase";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true); // Empieza en true

  // Lógica de carga robusta
  useEffect(() => {
    setLoading(true);
    console.log("AuthContext: Iniciando. Verificando sesión...");

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      console.log("AuthContext: onAuthStateChange disparado.");

      setUser(session?.user ?? null);

      if (session?.user) {
        console.log("AuthContext: Sesión encontrada. Cargando perfil...");
        await loadProfile(session.user.id);
      } else {
        console.log("AuthContext: Sin sesión. Limpiando perfil.");
        setProfile(null);
      }

      console.log("AuthContext: Carga finalizada.");
      setLoading(false); // Solo se pone en false DESPUÉS de cargar el perfil
    });

    return () => subscription.unsubscribe();
  }, []); // Se ejecuta solo una vez al montar

  async function loadProfile(userId) {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (error) throw error;

      console.log("AuthContext: Perfil cargado:", data);
      setProfile(data); // Establece el perfil
    } catch (error) {
      console.error("Error loading profile:", error);
      setProfile(null); // Asegurarse de limpiar si hay error
    }
  }

  // Función para recargar el perfil
  async function refreshProfile() {
    if (!user) return { success: false, error: "No user logged in" };

    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (error) throw error;
      setProfile(data);
      return { success: true };
    } catch (error) {
      console.error("Error refreshing profile:", error);
      return { success: false, error: error.message };
    }
  }

  // Función para consumir créditos
  async function consumeCredits(amount) {
    if (!user || !profile) {
      throw new Error("Usuario o Perfil no cargado");
    }

    const newCredits = profile.credits - amount;
    if (newCredits < 0) {
      throw new Error("Créditos insuficientes");
    }

    try {
      const { error } = await supabase
        .from("profiles")
        .update({ credits: newCredits })
        .eq("id", user.id);

      if (error) throw error;

      setProfile((prev) => ({ ...prev, credits: newCredits }));
      return { success: true, newBalance: newCredits };
    } catch (error) {
      console.error("❌ Error en consumeCredits:", error);
      await refreshProfile(); // Re-sincronizar
      throw new Error("No se pudieron consumir los créditos.");
    }
  }

  // Función para guardar en el historial
  async function savePromptToHistory(promptText, options, imageUrl = null) {
    if (!user) throw new Error("Usuario no autenticado");

    try {
      const { data, error } = await supabase
        .from("prompt_history")
        .insert({
          user_id: user.id,
          prompt: promptText,
          options: options,
          image_url: imageUrl,
          created_at: new Date().toISOString(),
        })
        .select();

      if (error) throw error;
      return data[0];
    } catch (error) {
      console.error("Error guardando en el historial:", error);
      throw new Error("No se pudo guardar el prompt en el historial.");
    }
  }

  // ... (tus funciones signIn, signUp, signOut, resendConfirmation no cambian) ...
  async function signIn(email, password) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      if (data.user && !data.user.email_confirmed_at) {
        await supabase.auth.signOut();
        throw new Error("Por favor confirma tu email antes de iniciar sesión");
      }

      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async function signUp(email, password) {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) throw error;

      return {
        success: true,
        message: "Revisa tu email para confirmar tu cuenta",
        user: data.user,
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async function signOut() {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      setUser(null);
      setProfile(null);

      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async function resendConfirmation(email) {
    try {
      const { error } = await supabase.auth.resend({
        type: "signup",
        email,
      });

      if (error) throw error;

      return { success: true, message: "Email de confirmación reenviado" };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  const value = {
    user,
    profile,
    loading,
    signIn,
    signUp,
    signOut,
    resendConfirmation,
    refreshProfile,
    consumeCredits,
    savePromptToHistory,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Hook para usar el contexto
export function useAuth() {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error("useAuth debe ser usado dentro de un AuthProvider");
  }

  return context;
}
