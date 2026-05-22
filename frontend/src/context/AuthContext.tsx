"use client";

import { createContext, useContext, useState, ReactNode } from "react";

export interface UsuarioAutenticado {
  id: number;
  nombre: string;
  apellido: string;
  nombreUsuario: string;
  rol: string;
}

interface AuthContextType {
  usuario: UsuarioAutenticado | null;
  setUsuario: (u: UsuarioAutenticado | null) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  usuario: null,
  setUsuario: () => {},
  logout: () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [usuario, setUsuarioState] = useState<UsuarioAutenticado | null>(() => {
    if (typeof window === "undefined") return null;
    try {
      const stored = localStorage.getItem("usuario");
      return stored ? (JSON.parse(stored) as UsuarioAutenticado) : null;
    } catch {
      return null;
    }
  });

  const setUsuario = (u: UsuarioAutenticado | null) => {
    setUsuarioState(u);
    if (u) {
      localStorage.setItem("usuario", JSON.stringify(u));
    } else {
      localStorage.removeItem("usuario");
    }
  };

  const logout = () => {
    setUsuario(null);
  };

  return (
    <AuthContext.Provider value={{ usuario, setUsuario, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);