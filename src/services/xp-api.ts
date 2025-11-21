import type { XP } from "@/components/xp-list";

/**
 * Busca XPs de um owner com filtros opcionais
 * Para uso com useQuery do TanStack Query
 */
export async function getXpByOwnerIdWithFilters(
  ownerId: string,
  options?: {
    startDate?: Date;
    endDate?: Date;
    categoryIds?: string[];
  }
): Promise<XP[]> {
  const url = new URL("/api/xp", window.location.origin);

  if (options?.startDate) {
    url.searchParams.set("startDate", options.startDate.toISOString());
  }

  if (options?.endDate) {
    url.searchParams.set("endDate", options.endDate.toISOString());
  }

  if (options?.categoryIds && options.categoryIds.length > 0) {
    url.searchParams.set("categoryIds", options.categoryIds.join(","));
  }

  const response = await fetch(url.toString(), {
    method: "GET",
    headers: {
      "owner-id": ownerId,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch XPs");
  }

  return response.json();
}

/**
 * Busca um XP específico pelo id
 * Para uso com useQuery do TanStack Query
 */
export async function getItemById(id: string): Promise<XP | null> {
  const url = new URL("/api/xp", window.location.origin);
  url.searchParams.set("id", id);

  const response = await fetch(url.toString(), {
    method: "GET",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch XP");
  }

  return response.json();
}

/**
 * Adiciona um novo XP
 * Para uso com useMutation do TanStack Query
 */
export async function addXp(
  ownerId: string,
  xp: Omit<XP, "id" | "createdAt">
): Promise<XP> {
  const response = await fetch("/api/xp", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "owner-id": ownerId,
    },
    body: JSON.stringify(xp),
  });

  if (!response.ok) {
    throw new Error("Failed to add XP");
  }

  return response.json();
}

/**
 * Atualiza um XP existente
 * Para uso com useMutation do TanStack Query
 */
export async function editXp(
  id: string,
  xp: Partial<Omit<XP, "id" | "createdAt">>
): Promise<XP> {
  const url = new URL("/api/xp", window.location.origin);
  url.searchParams.set("id", id);

  const response = await fetch(url.toString(), {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(xp),
  });

  if (!response.ok) {
    throw new Error("Failed to edit XP");
  }

  return response.json();
}

/**
 * Remove um XP
 * Para uso com useMutation do TanStack Query
 */
export async function removeXp(id: string): Promise<void> {
  const url = new URL("/api/xp", window.location.origin);
  url.searchParams.set("id", id);

  const response = await fetch(url.toString(), {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Failed to remove XP");
  }
}
