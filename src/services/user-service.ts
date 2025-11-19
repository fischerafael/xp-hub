export interface User {
  email: string;
  name: string;
  createdAt: string;
}

const STORAGE_KEY = "users";

/**
 * Busca um usuário pelo email
 */
export async function getUserByEmail(email: string): Promise<User | null> {
  try {
    if (typeof window === "undefined") {
      return null;
    }

    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      return null;
    }

    const allUsers: User[] = JSON.parse(stored);
    const user = allUsers.find((u) => u.email === email);
    return user || null;
  } catch (error) {
    console.error("Erro ao buscar usuário:", error);
    return null;
  }
}

/**
 * Cria um novo usuário
 */
export async function createUser(email: string, name: string): Promise<User> {
  try {
    if (typeof window === "undefined") {
      throw new Error("localStorage não está disponível");
    }

    // Verificar se o usuário já existe
    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      throw new Error("Usuário com este email já existe");
    }

    const newUser: User = {
      email,
      name,
      createdAt: new Date().toISOString(),
    };

    const stored = localStorage.getItem(STORAGE_KEY);
    const allUsers: User[] = stored ? JSON.parse(stored) : [];

    allUsers.push(newUser);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(allUsers));

    return newUser;
  } catch (error) {
    console.error("Erro ao criar usuário:", error);
    throw error;
  }
}
