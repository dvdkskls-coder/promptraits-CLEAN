import { createContext, useState, useEffect, useContext } from "react";
import { supabase } from "../lib/supabase";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        loadProfile(session.user.id);
      } else {
        setProfile(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  async function checkSession() {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setUser(session?.user ?? null);

      if (session?.user) {
        await loadProfile(session.user.id);
      }
    } catch (error) {
      console.error("Error checking session:", error);
    } finally {
      setLoading(false);
    }
  }

  async function loadProfile(userId) {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (error) throw error;
      setProfile(data);
    } catch (error) {
      console.error("Error loading profile:", error);
    }
  }

  // 🔄 Función para recargar el perfil (útil después de usar créditos)
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

  // ✅ CORRECCIÓN (Punto 3): Nueva función para consumir créditos (CON DEBUGGING)
  async function consumeCredits(amount) {
    console.log(`🔥 Iniciando consumeCredits con amount: ${amount}`);
    console.log("🔥 Usuario actual:", user);
    console.log("🔥 Perfil actual:", profile);

    if (!user) {
      console.error("❌ consumeCredits: Usuario no autenticado.");
      throw new Error("Usuario no autenticado");
    }
    if (!profile) {
      console.error("❌ consumeCredits: Perfil no cargado.");
      throw new Error("Perfil no cargado");
    }

    // Los usuarios PREMIUM no consumen créditos (ajusta si es diferente)
    if (profile.plan === "premium") {
      console.log("✅ consumeCredits: Usuario PREMIUM, no consume créditos.");
      return { success: true, newBalance: "ilimitado" };
    }

    const newCredits = profile.credits - amount;
    if (newCredits < 0) {
      console.error("❌ consumeCredits: Créditos insuficientes.");
      throw new Error("Créditos insuficientes");
    }

    try {
      console.log(
        `🔥 Intentando actualizar créditos a ${newCredits} para el usuario ${user.id}`
      );
      const { error } = await supabase
        .from("profiles")
        .update({ credits: newCredits })
        .eq("id", user.id);

      if (error) {
        console.error("❌ Error de Supabase al actualizar créditos:", error);
        throw error;
      }

      console.log(
        "✅ Créditos actualizados en Supabase. Actualizando estado local..."
      );
      setProfile((prev) => ({ ...prev, credits: newCredits }));

      return { success: true, newBalance: newCredits };
    } catch (error) {
      console.error(
        "❌ Error en el bloque try/catch de consumeCredits:",
        error
      );
      await refreshProfile();
      throw new Error("No se pudieron consumir los créditos.");
    }
  }

  // ✅ CORRECCIÓN (Punto 3): Nueva función para guardar en el historial
  async function savePromptToHistory(promptText, options, imageUrl = null) {
    if (!user) throw new Error("Usuario no autenticado");

    try {
      const { data, error } = await supabase
        .from("prompt_history")
        .insert({
          user_id: user.id,
          prompt: promptText,
          options: options,
          image_url: imageUrl, // Guardar la URL de la imagen si se genera
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
    consumeCredits, // ✅ Añadir nueva función
    savePromptToHistory, // ✅ Añadir nueva función
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// ✅ Hook para usar el contexto
export function useAuth() {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error("useAuth debe ser usado dentro de un AuthProvider");
  }

  return context;
}
