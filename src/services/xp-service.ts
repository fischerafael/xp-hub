import type { XP } from "@/components/xp-list";

const STORAGE_KEY = "xps";

/**
 * Busca todos os XPs de um owner específico
 */
export async function getXpByOwnerId(ownerId: string): Promise<XP[]> {
  try {
    if (typeof window === "undefined") {
      return [];
    }

    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      return [];
    }

    const allXPs: XP[] = JSON.parse(stored);
    return allXPs.filter((xp) => xp.ownerId === ownerId);
  } catch (error) {
    console.error("Erro ao buscar XPs:", error);
    return [];
  }
}

/**
 * Adiciona um novo XP ao localStorage
 * Gera automaticamente id e createdAt
 */
export async function addXp(xp: Omit<XP, "id" | "createdAt">): Promise<XP> {
  try {
    if (typeof window === "undefined") {
      throw new Error("localStorage não está disponível");
    }

    const newXP: XP = {
      ...xp,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    };

    const stored = localStorage.getItem(STORAGE_KEY);
    const allXPs: XP[] = stored ? JSON.parse(stored) : [];

    allXPs.push(newXP);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(allXPs));

    return newXP;
  } catch (error) {
    console.error("Erro ao adicionar XP:", error);
    throw error;
  }
}

/**
 * Busca um XP específico pelo id
 */
export async function getItemById(id: string): Promise<XP | null> {
  try {
    if (typeof window === "undefined") {
      return null;
    }

    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      return null;
    }

    const allXPs: XP[] = JSON.parse(stored);
    const xp = allXPs.find((xp) => xp.id === id);
    return xp || null;
  } catch (error) {
    console.error("Erro ao buscar XP:", error);
    return null;
  }
}

/**
 * Atualiza um XP existente no localStorage
 */
export async function editXp(
  id: string,
  xp: Partial<Omit<XP, "id" | "createdAt">>
): Promise<XP> {
  try {
    if (typeof window === "undefined") {
      throw new Error("localStorage não está disponível");
    }

    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      throw new Error("XP não encontrado");
    }

    const allXPs: XP[] = JSON.parse(stored);
    const index = allXPs.findIndex((xp) => xp.id === id);

    if (index === -1) {
      throw new Error("XP não encontrado");
    }

    // Preservar id e createdAt, atualizar apenas os campos fornecidos
    const updatedXP: XP = {
      ...allXPs[index],
      ...xp,
      id: allXPs[index].id,
      createdAt: allXPs[index].createdAt,
    };

    allXPs[index] = updatedXP;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(allXPs));

    return updatedXP;
  } catch (error) {
    console.error("Erro ao editar XP:", error);
    throw error;
  }
}

/**
 * Remove um XP do localStorage pelo id
 */
export async function removeXp(id: string): Promise<void> {
  try {
    if (typeof window === "undefined") {
      throw new Error("localStorage não está disponível");
    }

    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      return;
    }

    const allXPs: XP[] = JSON.parse(stored);
    const filteredXPs = allXPs.filter((xp) => xp.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredXPs));
  } catch (error) {
    console.error("Erro ao remover XP:", error);
    throw error;
  }
}
