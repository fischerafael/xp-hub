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
