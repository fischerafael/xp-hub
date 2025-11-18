export interface Category {
  id: string;
  title: string;
  description?: string;
  color?: string;
  ownerId: string;
}

const STORAGE_KEY = "categories";

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
 * Busca todas as categorias de um owner específico
 */
export async function getCategoriesByOwnerId(
  ownerId: string
): Promise<Category[]> {
  try {
    if (typeof window === "undefined") {
      return [];
    }

    const stored = localStorage.getItem(STORAGE_KEY);
    let allCategories: Category[];

    if (!stored) {
      // Se não há dados no localStorage, inicializa com as categorias padrão
      allCategories = initialCategories;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(allCategories));
    } else {
      allCategories = JSON.parse(stored);
    }

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
    if (typeof window === "undefined") {
      return null;
    }

    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      return null;
    }

    const allCategories: Category[] = JSON.parse(stored);
    const category = allCategories.find((cat) => cat.id === id);
    return category || null;
  } catch (error) {
    console.error("Erro ao buscar categoria:", error);
    return null;
  }
}

/**
 * Adiciona uma nova categoria ao localStorage
 * Gera automaticamente id
 */
export async function addCategory(
  category: Omit<Category, "id">
): Promise<Category> {
  try {
    if (typeof window === "undefined") {
      throw new Error("localStorage não está disponível");
    }

    const newCategory: Category = {
      ...category,
      id: crypto.randomUUID(),
    };

    const stored = localStorage.getItem(STORAGE_KEY);
    const allCategories: Category[] = stored ? JSON.parse(stored) : [];

    allCategories.push(newCategory);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(allCategories));

    return newCategory;
  } catch (error) {
    console.error("Erro ao adicionar categoria:", error);
    throw error;
  }
}

/**
 * Atualiza uma categoria existente no localStorage
 */
export async function editCategory(
  id: string,
  category: Partial<Omit<Category, "id">>
): Promise<Category> {
  try {
    if (typeof window === "undefined") {
      throw new Error("localStorage não está disponível");
    }

    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      throw new Error("Categoria não encontrada");
    }

    const allCategories: Category[] = JSON.parse(stored);
    const index = allCategories.findIndex((cat) => cat.id === id);

    if (index === -1) {
      throw new Error("Categoria não encontrada");
    }

    // Preservar id, atualizar apenas os campos fornecidos
    const updatedCategory: Category = {
      ...allCategories[index],
      ...category,
      id: allCategories[index].id,
    };

    allCategories[index] = updatedCategory;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(allCategories));

    return updatedCategory;
  } catch (error) {
    console.error("Erro ao editar categoria:", error);
    throw error;
  }
}

/**
 * Remove uma categoria do localStorage pelo id
 */
export async function removeCategory(id: string): Promise<void> {
  try {
    if (typeof window === "undefined") {
      throw new Error("localStorage não está disponível");
    }

    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      return;
    }

    const allCategories: Category[] = JSON.parse(stored);
    const filteredCategories = allCategories.filter((cat) => cat.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredCategories));
  } catch (error) {
    console.error("Erro ao remover categoria:", error);
    throw error;
  }
}
