"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import type { User } from "@/src/server/services/user-service";
import { getUserByEmail, createUser } from "@/src/server/services/user-service";
import {
  signInWithGooglePopup,
  signOutFromFirebase,
} from "@/src/server/firebase/auth";

interface AuthContextType {
  user: User | null;
  signIn: (email: string, name: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
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

  const persistUser = (userData: User) => {
    setUser(userData);
    if (typeof window !== "undefined") {
      localStorage.setItem(CURRENT_USER_STORAGE_KEY, JSON.stringify(userData));
    }
  };

  const upsertUserByEmail = async (email: string, name: string) => {
    let userData = await getUserByEmail(email);
    if (!userData) {
      userData = await createUser(email, name);
    }
    return userData;
  };

  const signIn = async (email: string, name: string) => {
    setIsLoading(true);
    try {
      const userData = await upsertUserByEmail(email, name);
      persistUser(userData);
    } catch (error) {
      console.error("Erro ao fazer sign in:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signInWithGoogle = async () => {
    setIsLoading(true);
    try {
      const googleProfile = await signInWithGooglePopup();
      if (!googleProfile.email) {
        throw new Error("Conta Google sem email disponível");
      }

      const fallbackName =
        googleProfile.name || googleProfile.email.split("@")[0] || "Usuário";
      const userData = await upsertUserByEmail(
        googleProfile.email,
        fallbackName
      );
      persistUser(userData);
    } catch (error) {
      console.error("Erro ao autenticar com Google:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = () => {
    setUser(null);
    if (typeof window !== "undefined") {
      localStorage.removeItem(CURRENT_USER_STORAGE_KEY);
    }
    signOutFromFirebase().catch((error) => {
      console.error("Erro ao deslogar do Firebase:", error);
    });
  };

  return (
    <AuthContext.Provider
      value={{ user, signIn, signInWithGoogle, signOut, isLoading }}
    >
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
