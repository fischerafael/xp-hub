import { categoryRepository } from "@/src/infra/repositories/category.repository";
import { FirestoreRepository } from "@/src/infra/repositories/firestore.repository";

export interface Category {
  id: string;
  title: string;
  description?: string;
  color?: string;
  ownerId: string;
}

const OWNER_ID = "user-1"; // TODO: Substituir por autenticação real

/**
 * Categorias iniciais (seed) para popular o localStorage na primeira vez
 */
const initialCategories: Category[] = [
  {
    id: "1",
    title: "react",
    description: "React framework",
    color: "#61dafb",
    ownerId: OWNER_ID,
  },
  {
    id: "2",
    title: "javascript",
    description: "JavaScript language",
    color: "#f7df1e",
    ownerId: OWNER_ID,
  },
  {
    id: "3",
    title: "typescript",
    description: "TypeScript language",
    color: "#3178c6",
    ownerId: OWNER_ID,
  },
  {
    id: "4",
    title: "nextjs",
    description: "Next.js framework",
    color: "#000000",
    ownerId: OWNER_ID,
  },
  {
    id: "5",
    title: "hooks",
    description: "React hooks",
    color: "#764abc",
    ownerId: OWNER_ID,
  },
  {
    id: "6",
    title: "css",
    description: "CSS styling",
    color: "#1572b6",
    ownerId: OWNER_ID,
  },
  {
    id: "7",
    title: "html",
    description: "HTML markup",
    color: "#e34f26",
    ownerId: OWNER_ID,
  },
  {
    id: "8",
    title: "nodejs",
    description: "Node.js runtime",
    color: "#339933",
    ownerId: OWNER_ID,
  },
  {
    id: "9",
    title: "python",
    description: "Python language",
    color: "#3776ab",
    ownerId: OWNER_ID,
  },
  {
    id: "10",
    title: "git",
    description: "Git version control",
    color: "#f05032",
    ownerId: OWNER_ID,
  },
];

/**
 * Inicializa as categorias padrão se ainda não existirem dados
 */
async function initializeCategoriesIfNeeded(): Promise<void> {
  const allCategories = await categoryRepository.getAll();
  if (allCategories.length === 0) {
    // Se não há categorias, inicializa com as categorias padrão
    // Usa createWithId para manter os IDs específicos das categorias iniciais
    if (categoryRepository instanceof FirestoreRepository) {
      for (const category of initialCategories) {
        await categoryRepository.createWithId(category);
      }
    }
  }
}

/**
 * Busca todas as categorias de um owner específico
 */
export async function getCategoriesByOwnerId(
  ownerId: string
): Promise<Category[]> {
  try {
    await initializeCategoriesIfNeeded();
    const allCategories = await categoryRepository.getAll();
    return allCategories.filter((cat) => cat.ownerId === ownerId);
  } catch (error) {
    console.error("Erro ao buscar categorias:", error);
    return [];
  }
}

/**
 * Busca uma categoria específica pelo id
 */
export async function getCategoryById(id: string): Promise<Category | null> {
  try {
    return await categoryRepository.getById(id);
  } catch (error) {
    console.error("Erro ao buscar categoria:", error);
    return null;
  }
}

/**
 * Adiciona uma nova categoria
 * Gera automaticamente id
 */
export async function addCategory(
  category: Omit<Category, "id">
): Promise<Category> {
  try {
    return await categoryRepository.create(category);
  } catch (error) {
    console.error("Erro ao adicionar categoria:", error);
    throw error;
  }
}

/**
 * Atualiza uma categoria existente
 */
export async function editCategory(
  id: string,
  category: Partial<Omit<Category, "id">>
): Promise<Category> {
  try {
    return await categoryRepository.update(id, category);
  } catch (error) {
    console.error("Erro ao editar categoria:", error);
    throw error;
  }
}

/**
 * Remove uma categoria pelo id
 */
export async function removeCategory(id: string): Promise<void> {
  try {
    await categoryRepository.delete(id);
  } catch (error) {
    console.error("Erro ao remover categoria:", error);
    throw error;
  }
}
