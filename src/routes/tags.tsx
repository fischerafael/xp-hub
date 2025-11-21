"use client";

import { Button } from "@/components/ui/button";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { TagList } from "@/components/tag-list";
import { AddCategoryModal } from "@/components/add-category-modal";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getCategoriesByOwnerId,
  removeCategory,
  getCategoryById,
} from "@/src/services/category-api";
import { useState, useEffect } from "react";
import { useAuth } from "@/src/contexts/auth-context";
import { useRouter } from "next/navigation";

export function TagsPage() {
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(
    null
  );
  const queryClient = useQueryClient();

  // Redirecionar para home se não houver usuário logado
  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/");
    }
  }, [user, authLoading, router]);

  const ownerId = user?.email || "";

  const { data: categories = [], isLoading } = useQuery({
    queryKey: ["categories", ownerId],
    queryFn: () => getCategoriesByOwnerId(ownerId),
    enabled: !!ownerId,
  });

  const handleAddCategory = () => {
    setEditingCategoryId(null);
    setIsModalOpen(true);
  };

  const handleItemClick = (id: string) => {
    setEditingCategoryId(id);
    setIsModalOpen(true);
  };

  const handleModalClose = (open: boolean) => {
    setIsModalOpen(open);
    if (!open) {
      setEditingCategoryId(null);
    }
  };

  const handleCategoryAdded = () => {
    // Invalidar a query para atualizar a lista
    queryClient.invalidateQueries({ queryKey: ["categories", ownerId] });
  };

  const handleCategoryDeleted = async (id: string) => {
    try {
      await removeCategory(id);
      // Invalidar a query para atualizar a lista
      queryClient.invalidateQueries({ queryKey: ["categories", ownerId] });
    } catch (error) {
      console.error("Erro ao remover categoria:", error);
    }
  };

  return (
    <div className="flex min-h-screen justify-between flex-col">
      <div className="mx-auto w-full max-w-4xl px-4">
        <Header />
        <main className="py-6">
          <div className="mb-6">
            <div className="flex items-center justify-between">
              <h1 className="text-lg font-semibold">
                Tags ({categories.length})
              </h1>
              <Button onClick={handleAddCategory}>Add</Button>
            </div>
          </div>
          {authLoading || isLoading ? (
            <div className="py-8 text-center text-sm text-muted-foreground">
              Loading...
            </div>
          ) : !user ? (
            <div className="py-8 text-center text-sm text-muted-foreground">
              Redirecionando...
            </div>
          ) : (
            <TagList
              tags={categories}
              onItemClick={handleItemClick}
              onDelete={handleCategoryDeleted}
            />
          )}
        </main>
      </div>
      <Footer />
      <AddCategoryModal
        open={isModalOpen}
        onOpenChange={handleModalClose}
        ownerId={ownerId}
        onSuccess={handleCategoryAdded}
        editCategoryId={editingCategoryId || undefined}
        onLoadCategory={getCategoryById}
      />
    </div>
  );
}
