"use client";

import { Button } from "@/components/ui/button";
import { DateSelector } from "@/components/date-selector";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { XPList } from "@/components/xp-list";
import { AddXPModal } from "@/components/add-xp-modal";
import { FilterMenu, SelectedCategories } from "@/components/filter-menu";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getXpByOwnerId,
  removeXp,
  getItemById,
} from "@/src/services/xp-service";
import { getCategoriesByOwnerId } from "@/src/services/category-service";
import { useState, useMemo } from "react";

const OWNER_ID = "user-1"; // TODO: Substituir por autenticação real

export function AppPage() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [titleFilter, setTitleFilter] = useState("");
  const [selectedCategoryTitles, setSelectedCategoryTitles] = useState<
    string[]
  >([]);
  const queryClient = useQueryClient();

  const { data: allXPs = [], isLoading } = useQuery({
    queryKey: ["xps", OWNER_ID],
    queryFn: () => getXpByOwnerId(OWNER_ID),
  });

  const { data: categories = [] } = useQuery({
    queryKey: ["categories", OWNER_ID],
    queryFn: () => getCategoriesByOwnerId(OWNER_ID),
  });

  // Filtrar XPs pela data selecionada, título e categorias
  const filteredXPs = useMemo(() => {
    const startOfDay = new Date(selectedDate);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(selectedDate);
    endOfDay.setHours(23, 59, 59, 999);

    return allXPs.filter((xp) => {
      // Filtro por data
      const xpDate = new Date(xp.createdAt);
      const isInDateRange = xpDate >= startOfDay && xpDate <= endOfDay;
      if (!isInDateRange) return false;

      // Filtro por título (case-insensitive substring)
      if (titleFilter.trim()) {
        const titleMatch = xp.title
          .toLowerCase()
          .includes(titleFilter.toLowerCase());
        if (!titleMatch) return false;
      }

      // Filtro por categorias (tags)
      if (selectedCategoryTitles.length > 0) {
        const hasMatchingCategory = selectedCategoryTitles.some((catTitle) =>
          xp.tags.includes(catTitle)
        );
        if (!hasMatchingCategory) return false;
      }

      return true;
    });
  }, [allXPs, selectedDate, titleFilter, selectedCategoryTitles]);

  const handleAddXP = () => {
    setEditingItemId(null);
    setIsModalOpen(true);
  };

  const handleItemClick = (id: string) => {
    setEditingItemId(id);
    setIsModalOpen(true);
  };

  const handleModalClose = (open: boolean) => {
    setIsModalOpen(open);
    if (!open) {
      setEditingItemId(null);
    }
  };

  const handleXPAdded = () => {
    // Invalidar a query para atualizar a lista
    queryClient.invalidateQueries({ queryKey: ["xps", OWNER_ID] });
  };

  const handleXPDeleted = async (id: string) => {
    try {
      await removeXp(id);
      // Invalidar a query para atualizar a lista
      queryClient.invalidateQueries({ queryKey: ["xps", OWNER_ID] });
    } catch (error) {
      console.error("Erro ao remover XP:", error);
    }
  };

  const handleCategoryToggle = (categoryTitle: string) => {
    setSelectedCategoryTitles((prev) => {
      if (prev.includes(categoryTitle)) {
        return prev.filter((title) => title !== categoryTitle);
      } else {
        return [...prev, categoryTitle];
      }
    });
  };

  const handleCategoryRemove = (categoryTitle: string) => {
    setSelectedCategoryTitles((prev) =>
      prev.filter((title) => title !== categoryTitle)
    );
  };

  return (
    <div className="flex min-h-screen justify-between flex-col">
      <div className="mx-auto w-full max-w-4xl px-4">
        <Header />
        <main className="py-6">
          <div className="mb-6">
            <div className="flex items-center justify-between gap-4">
              <DateSelector
                selectedDate={selectedDate}
                onDateChange={setSelectedDate}
              />
              <div className="flex items-center gap-2">
                <FilterMenu
                  titleFilter={titleFilter}
                  onTitleFilterChange={setTitleFilter}
                  selectedCategoryTitles={selectedCategoryTitles}
                  onCategoryToggle={handleCategoryToggle}
                  categories={categories}
                />
                <Button onClick={handleAddXP}>Add XP</Button>
              </div>
            </div>
            <SelectedCategories
              selectedCategoryTitles={selectedCategoryTitles}
              onRemove={handleCategoryRemove}
              categories={categories}
            />
          </div>
          {isLoading ? (
            <div className="py-8 text-center text-sm text-muted-foreground">
              Carregando...
            </div>
          ) : (
            <XPList
              xps={filteredXPs}
              onDelete={handleXPDeleted}
              onItemClick={handleItemClick}
            />
          )}
        </main>
      </div>
      <Footer />
      <AddXPModal
        open={isModalOpen}
        onOpenChange={handleModalClose}
        ownerId={OWNER_ID}
        onSuccess={handleXPAdded}
        editItemId={editingItemId || undefined}
        onLoadItem={getItemById}
      />
    </div>
  );
}
