import type { XP } from "@/components/xp-list";
import { xpRepository } from "@/src/infra/repositories/xp.repository";

/**
 * Busca todos os XPs de um owner específico
 */
export async function getXpByOwnerId(ownerId: string): Promise<XP[]> {
  try {
    return await xpRepository.findBy((xp) => xp.ownerId === ownerId);
  } catch (error) {
    console.error("Erro ao buscar XPs:", error);
    return [];
  }
}

/**
 * Busca XPs de um owner específico com filtros opcionais de range de datas e categorias
 * Aplica ordenação por createdAt (mais recente primeiro)
 */
export async function getXpByOwnerIdWithFilters(
  ownerId: string,
  options?: {
    startDate?: Date;
    endDate?: Date;
    categoryTitles?: string[];
  }
): Promise<XP[]> {
  try {
    return await xpRepository.findByOwnerIdWithFilters(ownerId, options);
  } catch (error) {
    console.error("Erro ao buscar XPs com filtros:", error);
    return [];
  }
}

/**
 * Adiciona um novo XP
 * Gera automaticamente id e createdAt
 */
export async function addXp(xp: Omit<XP, "id" | "createdAt">): Promise<XP> {
  try {
    // O repository gera o id, mas precisamos gerar o createdAt
    const newXP = await xpRepository.create({
      ...xp,
      createdAt: new Date().toISOString(),
    });

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
    return await xpRepository.getById(id);
  } catch (error) {
    console.error("Erro ao buscar XP:", error);
    return null;
  }
}

/**
 * Atualiza um XP existente
 * Preserva id e createdAt automaticamente
 */
export async function editXp(
  id: string,
  xp: Partial<Omit<XP, "id" | "createdAt">>
): Promise<XP> {
  try {
    // O repository.update preserva o id automaticamente
    // Mas precisamos garantir que createdAt não seja alterado
    const existingXP = await xpRepository.getById(id);
    if (!existingXP) {
      throw new Error("XP não encontrado");
    }

    // Atualizar apenas os campos fornecidos (sem id e createdAt)
    return await xpRepository.update(id, xp);
  } catch (error) {
    console.error("Erro ao editar XP:", error);
    throw error;
  }
}

/**
 * Remove um XP pelo id
 */
export async function removeXp(id: string): Promise<void> {
  try {
    await xpRepository.delete(id);
  } catch (error) {
    console.error("Erro ao remover XP:", error);
    throw error;
  }
}
