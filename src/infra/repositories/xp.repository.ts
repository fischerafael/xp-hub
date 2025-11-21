import { FirestoreRepository } from "./firestore.repository";
import type { XP } from "@/components/xp-list";
import { where, orderBy } from "firebase/firestore";

/**
 * Repository específico para XP usando Firestore
 */
class XPRepository extends FirestoreRepository<XP> {
  constructor() {
    super("xps");
  }

  /**
   * Busca XPs de um owner específico com filtros opcionais de range de datas e categorias
   * Aplica ordenação por createdAt (mais recente primeiro)
   * Usa queries do Firestore para filtrar diretamente no banco
   */
  async findByOwnerIdWithFilters(
    ownerId: string,
    options?: {
      startDate?: Date;
      endDate?: Date;
      categoryTitles?: string[];
    }
  ): Promise<XP[]> {
    // Construir constraints da query do Firestore
    const constraints: Parameters<typeof this.findByQuery>[0][] = [];

    // Sempre filtrar por ownerId
    constraints.push(where("ownerId", "==", ownerId));

    // Filtro por range de datas (se fornecido)
    // createdAt é armazenado como string ISO, então comparamos strings
    if (options?.startDate && options?.endDate) {
      const startDateStr = options.startDate.toISOString();
      const endDateStr = options.endDate.toISOString();
      constraints.push(where("createdAt", ">=", startDateStr));
      constraints.push(where("createdAt", "<=", endDateStr));
    }

    // Filtro por categorias (se fornecido)
    // array-contains-any verifica se o array tags contém pelo menos uma das categorias
    if (options?.categoryTitles && options.categoryTitles.length > 0) {
      constraints.push(
        where("tags", "array-contains-any", options.categoryTitles)
      );
    }

    // Sempre ordenar por createdAt (mais recente primeiro = descending)
    constraints.push(orderBy("createdAt", "desc"));

    // Executar query no Firestore
    return await this.findByQuery(...constraints);
  }
}

export const xpRepository = new XPRepository();
