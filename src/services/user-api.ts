import type { User } from "@/src/server/services/user-service";

/**
 * Busca um usuário pelo email
 * Para uso com useQuery do TanStack Query
 */
export async function getUserByEmail(email: string): Promise<User | null> {
  const url = new URL("/api/users", window.location.origin);
  url.searchParams.set("email", email);

  const response = await fetch(url.toString(), {
    method: "GET",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch user");
  }

  return response.json();
}

/**
 * Cria um novo usuário
 * Para uso com useMutation do TanStack Query
 */
export async function createUser(email: string, name: string): Promise<User> {
  const response = await fetch("/api/users", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, name }),
  });

  if (!response.ok) {
    throw new Error("Failed to create user");
  }

  return response.json();
}
