import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

const AuthCtx = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState({ credits: 0, plan: "free" });
  const [loading, setLoading] = useState(true);

  const fetchProfile = async (uid) => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", uid)
        .single();
      if (error) throw error;
      setProfile(data || { credits: 0, plan: "free" });
      return data;
    } catch (err) {
      console.error("Error fetching profile:", err);
      setProfile({ credits: 0, plan: "free" });
      return null;
    }
  };

  useEffect(() => {
    let mounted = true;
    (async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!mounted) return;
      setUser(session?.user ?? null);
      if (session?.user) await fetchProfile(session.user.id);
      setLoading(false);
    })();

    const { data: sub } = supabase.auth.onAuthStateChange(
      async (_evt, session) => {
        setUser(session?.user ?? null);
        if (session?.user) await fetchProfile(session.user.id);
        else setProfile({ credits: 0, plan: "free" });
      }
    );

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
          error:
            "Por favor confirma tu email antes de iniciar sesión. Revisa tu bandeja de entrada.",
        };
      }

      // Esperar a cargar el perfil
      if (data.user) {
        await fetchProfile(data.user.id);
      }

      return { success: true, data };
    } catch (error) {
      console.error("Login error:", error);
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
        },
      });

      if (error) throw error;

      // Mensaje de éxito con instrucciones
      return {
        success: true,
        data,
        message: "Cuenta creada. Revisa tu email para confirmar tu cuenta.",
      };
    } catch (error) {
      console.error("Signup error:", error);
      return { success: false, error: error.message };
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setProfile({ credits: 0, plan: "free" });
  };

  const resendConfirmationEmail = async (email) => {
    try {
      const { error } = await supabase.auth.resend({
        type: "signup",
        email: email,
      });
      if (error) throw error;
      return { success: true, message: "Email de confirmación reenviado." };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  return (
    <AuthCtx.Provider
      value={{
        user,
        profile,
        loading,
        signIn,
        signUp,
        signOut,
        fetchProfile,
        resendConfirmationEmail,
      }}
    >
      {children}
    </AuthCtx.Provider>
  );
}

export const useAuth = () => useContext(AuthCtx);

import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import AIGenerator from "../AIGenerator.jsx";
import { AuthContext } from "../../contexts/AuthContext.jsx";

const mockAuthContext = {
  user: { id: "user_123", email: "test@example.com" },
  credits: 10,
  isSubscribed: false,
  loading: false,
};

describe("AIGenerator Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("debería renderizar el formulario correctamente", () => {
    render(
      <AuthContext.Provider value={mockAuthContext}>
        <AIGenerator />
      </AuthContext.Provider>
    );

    expect(screen.getByPlaceholderText(/escribe el tema/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /generar/i })
    ).toBeInTheDocument();
  });

  it("debería mostrar los créditos disponibles", () => {
    render(
      <AuthContext.Provider value={mockAuthContext}>
        <AIGenerator />
      </AuthContext.Provider>
    );

    expect(screen.getByText(/10.*créditos/i)).toBeInTheDocument();
  });

  it("debería deshabilitar el botón generar si no hay tema", () => {
    render(
      <AuthContext.Provider value={mockAuthContext}>
        <AIGenerator />
      </AuthContext.Provider>
    );

    const button = screen.getByRole("button", { name: /generar/i });
    expect(button).toBeDisabled();
  });

  it("debería habilitar el botón cuando se escribe un tema", () => {
    render(
      <AuthContext.Provider value={mockAuthContext}>
        <AIGenerator />
      </AuthContext.Provider>
    );

    const input = screen.getByPlaceholderText(/escribe el tema/i);
    fireEvent.change(input, { target: { value: "Retrato de mujer" } });

    const button = screen.getByRole("button", { name: /generar/i });
    expect(button).not.toBeDisabled();
  });

  it("debería mostrar error si no hay créditos", () => {
    const noCreditsContext = { ...mockAuthContext, credits: 0 };

    render(
      <AuthContext.Provider value={noCreditsContext}>
        <AIGenerator />
      </AuthContext.Provider>
    );

    expect(screen.getByText(/sin créditos/i)).toBeInTheDocument();
  });

  it("debería llamar a la API al generar prompt", async () => {
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve({
            success: true,
            prompt: "Prompt generado profesionalmente",
          }),
      })
    );

    render(
      <AuthContext.Provider value={mockAuthContext}>
        <AIGenerator />
      </AuthContext.Provider>
    );

    const input = screen.getByPlaceholderText(/escribe el tema/i);
    fireEvent.change(input, { target: { value: "Retrato de mujer" } });

    const button = screen.getByRole("button", { name: /generar/i });
    fireEvent.click(button);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining("/api/gemini-processor"),
        expect.any(Object)
      );
    });
  });

  it("debería mostrar el prompt generado", async () => {
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve({
            success: true,
            prompt: "Prompt generado profesionalmente",
          }),
      })
    );

    render(
      <AuthContext.Provider value={mockAuthContext}>
        <AIGenerator />
      </AuthContext.Provider>
    );

    const input = screen.getByPlaceholderText(/escribe el tema/i);
    fireEvent.change(input, { target: { value: "Retrato de mujer" } });

    const button = screen.getByRole("button", { name: /generar/i });
    fireEvent.click(button);

    await waitFor(() => {
      expect(
        screen.getByText(/Prompt generado profesionalmente/i)
      ).toBeInTheDocument();
    });
  });

  it("debería mostrar error si la API falla", async () => {
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: false,
        json: () =>
          Promise.resolve({
            error: "Error al generar prompt",
          }),
      })
    );

    render(
      <AuthContext.Provider value={mockAuthContext}>
        <AIGenerator />
      </AuthContext.Provider>
    );

    const input = screen.getByPlaceholderText(/escribe el tema/i);
    fireEvent.change(input, { target: { value: "Retrato de mujer" } });

    const button = screen.getByRole("button", { name: /generar/i });
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByText(/error/i)).toBeInTheDocument();
    });
  });

  it("debería permitir copiar el prompt generado", async () => {
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve({
            success: true,
            prompt: "Prompt generado profesionalmente",
          }),
      })
    );

    Object.assign(navigator, {
      clipboard: {
        writeText: vi.fn(() => Promise.resolve()),
      },
    });

    render(
      <AuthContext.Provider value={mockAuthContext}>
        <AIGenerator />
      </AuthContext.Provider>
    );

    const input = screen.getByPlaceholderText(/escribe el tema/i);
    fireEvent.change(input, { target: { value: "Retrato de mujer" } });

    const button = screen.getByRole("button", { name: /generar/i });
    fireEvent.click(button);

    await waitFor(() => {
      const copyButton = screen.getByRole("button", { name: /copiar/i });
      fireEvent.click(copyButton);
      expect(navigator.clipboard.writeText).toHaveBeenCalledWith(
        "Prompt generado profesionalmente"
      );
    });
  });
});
