export interface Category {
  id: string;
  title: string;
  description?: string;
  color?: string;
  ownerId: string;
}

const OWNER_ID = "user-1"; // TODO: Substituir por autenticação real

/**
 * Busca todas as categorias de um owner específico
 * Por enquanto retorna uma lista hardcoded
 */
export async function getCategoriesByOwnerId(
  ownerId: string
): Promise<Category[]> {
  // Hardcoded categories for now
  // Will be replaced with category manager later
  const hardcodedCategories: Category[] = [
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

  return hardcodedCategories.filter((cat) => cat.ownerId === ownerId);
}
