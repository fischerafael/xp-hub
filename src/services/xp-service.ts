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
    // Carregar todos os XPs do owner
    const allXPs = await xpRepository.findBy((xp) => xp.ownerId === ownerId);

    // Aplicar filtros
    let filtered = allXPs;

    // Filtro por range de datas (se fornecido)
    if (options?.startDate && options?.endDate) {
      filtered = filtered.filter((xp) => {
        const xpDate = new Date(xp.createdAt);
        return xpDate >= options.startDate! && xpDate <= options.endDate!;
      });
    }

    // Filtro por categorias (se fornecido)
    if (options?.categoryTitles && options.categoryTitles.length > 0) {
      filtered = filtered.filter((xp) => {
        return options.categoryTitles!.some((catTitle) =>
          xp.tags.includes(catTitle)
        );
      });
    }

    // Ordenar por createdAt (mais recente primeiro)
    filtered.sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return dateB - dateA;
    });

    return filtered;
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
