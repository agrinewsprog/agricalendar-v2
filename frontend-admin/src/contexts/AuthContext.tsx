"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { authService, type AdminUser } from "@/lib/api";

interface AuthContextType {
  user: AdminUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (
    email: string,
    password: string
  ) => Promise<{ success: boolean; message: string }>;
  logout: () => Promise<void>;
  verifyAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Verificar autenticación al cargar
  useEffect(() => {
    verifyAuth();
  }, []);

  const verifyAuth = async () => {
    try {
      setIsLoading(true);
      const storedToken = authService.getStoredToken();

      if (!storedToken) {
        setIsLoading(false);
        return;
      }

      const response = await authService.verifyToken();

      if (response.success && response.data) {
        setUser(response.data.user);
        setToken(response.data.token);
      } else {
        // Token inválido, limpiar
        authService.clearAuth();
        setUser(null);
        setToken(null);
      }
    } catch (error) {
      console.error("Error verificando autenticación:", error);
      authService.clearAuth();
      setUser(null);
      setToken(null);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const response = await authService.login(email, password);

      if (response.success && response.data) {
        const { user: userData, token: userToken } = response.data;

        // Guardar en localStorage
        authService.saveAuth(userData, userToken);

        // Actualizar estado
        setUser(userData);
        setToken(userToken);

        return { success: true, message: response.message || "Login exitoso" };
      } else {
        return {
          success: false,
          message: response.message || "Error de login",
        };
      }
    } catch (error: any) {
      console.error("Error en login:", error);
      return {
        success: false,
        message: error.response?.data?.message || "Error de conexión",
      };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);
      await authService.logout();
    } catch (error) {
      console.error("Error en logout:", error);
    } finally {
      // Limpiar estado local independientemente del resultado
      authService.clearAuth();
      setUser(null);
      setToken(null);
      setIsLoading(false);
    }
  };

  const isAuthenticated = !!user && !!token;

  const value: AuthContextType = {
    user,
    token,
    isAuthenticated,
    isLoading,
    login,
    logout,
    verifyAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth debe ser usado dentro de un AuthProvider");
  }
  return context;
}

export default AuthContext;
