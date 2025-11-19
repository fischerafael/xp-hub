"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import type { User } from "@/src/services/user-service";
import { getUserByEmail, createUser } from "@/src/services/user-service";

interface AuthContextType {
  user: User | null;
  signIn: (email: string, name: string) => Promise<void>;
  signOut: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const CURRENT_USER_STORAGE_KEY = "currentUser";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Carregar usuário do localStorage na inicialização
  useEffect(() => {
    if (typeof window === "undefined") {
      setIsLoading(false);
      return;
    }

    try {
      const stored = localStorage.getItem(CURRENT_USER_STORAGE_KEY);
      if (stored) {
        const userData: User = JSON.parse(stored);
        setUser(userData);
      }
    } catch (error) {
      console.error("Erro ao carregar usuário do localStorage:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const signIn = async (email: string, name: string) => {
    try {
      // Buscar usuário existente
      let userData = await getUserByEmail(email);

      // Se não existir, criar novo usuário
      if (!userData) {
        userData = await createUser(email, name);
      }

      // Salvar no estado e localStorage
      setUser(userData);
      localStorage.setItem(CURRENT_USER_STORAGE_KEY, JSON.stringify(userData));
    } catch (error) {
      console.error("Erro ao fazer sign in:", error);
      throw error;
    }
  };

  const signOut = () => {
    setUser(null);
    if (typeof window !== "undefined") {
      localStorage.removeItem(CURRENT_USER_STORAGE_KEY);
    }
  };

  return (
    <AuthContext.Provider value={{ user, signIn, signOut, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  }
  return context;
}
