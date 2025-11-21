import type { Category } from "@/src/server/services/category-service";

/**
 * Busca todas as categorias de um owner
 * Para uso com useQuery do TanStack Query
 */
export async function getCategoriesByOwnerId(
  ownerId: string
): Promise<Category[]> {
  const response = await fetch("/api/categories", {
    method: "GET",
    headers: {
      "owner-id": ownerId,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch categories");
  }

  return response.json();
}

/**
 * Busca uma categoria específica pelo id
 * Para uso com useQuery do TanStack Query
 */
export async function getCategoryById(id: string): Promise<Category | null> {
  const url = new URL("/api/categories", window.location.origin);
  url.searchParams.set("id", id);

  const response = await fetch(url.toString(), {
    method: "GET",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch category");
  }

  return response.json();
}

/**
 * Adiciona uma nova categoria
 * Para uso com useMutation do TanStack Query
 */
export async function addCategory(
  ownerId: string,
  category: Omit<Category, "id">
): Promise<Category> {
  const response = await fetch("/api/categories", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "owner-id": ownerId,
    },
    body: JSON.stringify(category),
  });

  if (!response.ok) {
    throw new Error("Failed to add category");
  }

  return response.json();
}

/**
 * Atualiza uma categoria existente
 * Para uso com useMutation do TanStack Query
 */
export async function editCategory(
  id: string,
  category: Partial<Omit<Category, "id">>
): Promise<Category> {
  const url = new URL("/api/categories", window.location.origin);
  url.searchParams.set("id", id);

  const response = await fetch(url.toString(), {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(category),
  });

  if (!response.ok) {
    throw new Error("Failed to edit category");
  }

  return response.json();
}

/**
 * Remove uma categoria
 * Para uso com useMutation do TanStack Query
 */
export async function removeCategory(id: string): Promise<void> {
  const url = new URL("/api/categories", window.location.origin);
  url.searchParams.set("id", id);

  const response = await fetch(url.toString(), {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Failed to remove category");
  }
}

