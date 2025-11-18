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
} from "@/src/services/category-service";
import { useState } from "react";

const OWNER_ID = "user-1"; // TODO: Substituir por autenticação real

export function TagsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(
    null
  );
  const queryClient = useQueryClient();

  const { data: categories = [], isLoading } = useQuery({
    queryKey: ["categories", OWNER_ID],
    queryFn: () => getCategoriesByOwnerId(OWNER_ID),
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
    queryClient.invalidateQueries({ queryKey: ["categories", OWNER_ID] });
  };

  const handleCategoryDeleted = async (id: string) => {
    try {
      await removeCategory(id);
      // Invalidar a query para atualizar a lista
      queryClient.invalidateQueries({ queryKey: ["categories", OWNER_ID] });
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
          {isLoading ? (
            <div className="py-8 text-center text-sm text-muted-foreground">
              Loading...
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
        ownerId={OWNER_ID}
        onSuccess={handleCategoryAdded}
        editCategoryId={editingCategoryId || undefined}
        onLoadCategory={getCategoryById}
      />
    </div>
  );
}
