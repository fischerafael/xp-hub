import { userRepository } from "@/src/server/repositories/user.repository";

export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: string;
}

/**
 * Busca um usuário pelo email
 */
export async function getUserByEmail(email: string): Promise<User | null> {
  try {
    const users = await userRepository.findBy((user) => user.email === email);
    return users[0] || null;
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
    // Verificar se o usuário já existe
    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      throw new Error("Usuário com este email já existe");
    }

    // Criar usuário com createdAt (o repository gera o id automaticamente)
    const newUser = await userRepository.create({
      email,
      name,
      createdAt: new Date().toISOString(),
    });

    return newUser;
  } catch (error) {
    console.error("Erro ao criar usuário:", error);
    throw error;
  }
}
