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
import { useState, useMemo, useEffect } from "react";
import { Copy } from "lucide-react";
import { useAuth } from "@/src/contexts/auth-context";
import { useRouter } from "next/navigation";

export function AppPage() {
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [titleFilter, setTitleFilter] = useState("");
  const [selectedCategoryTitles, setSelectedCategoryTitles] = useState<
    string[]
  >([]);
  const queryClient = useQueryClient();

  // Redirecionar para home se não houver usuário logado
  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/");
    }
  }, [user, authLoading, router]);

  const ownerId = user?.email || "";

  const { data: allXPs = [], isLoading } = useQuery({
    queryKey: ["xps", ownerId],
    queryFn: () => getXpByOwnerId(ownerId),
    enabled: !!ownerId,
  });

  const { data: categories = [] } = useQuery({
    queryKey: ["categories", ownerId],
    queryFn: () => getCategoriesByOwnerId(ownerId),
    enabled: !!ownerId,
  });

  // Filtrar XPs pela data selecionada, título e categorias
  const filteredXPs = useMemo(() => {
    const startOfDay = new Date(selectedDate);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(selectedDate);
    endOfDay.setHours(23, 59, 59, 999);

    const filtered = allXPs.filter((xp) => {
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

    // Ordenar por createdAt (mais recente primeiro)
    return filtered.sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return dateB - dateA;
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
    queryClient.invalidateQueries({ queryKey: ["xps", ownerId] });
  };

  const handleXPDeleted = async (id: string) => {
    try {
      await removeXp(id);
      // Invalidar a query para atualizar a lista
      queryClient.invalidateQueries({ queryKey: ["xps", ownerId] });
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

  const formatDuration = (minutes?: number) => {
    if (!minutes) return null;
    if (minutes < 60) return `${minutes}min`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}min` : `${hours}h`;
  };

  const handleCopyTitles = async () => {
    const titles = filteredXPs.map((xp) => `- ${xp.title}`).join("\n");
    try {
      await navigator.clipboard.writeText(titles);
    } catch (error) {
      console.error("Erro ao copiar títulos:", error);
    }
  };

  // Calcular duração total dos XPs filtrados
  const totalDuration = useMemo(() => {
    return filteredXPs.reduce((total, xp) => {
      return total + (xp.duration || 0);
    }, 0);
  }, [filteredXPs]);

  return (
    <div className="flex min-h-screen justify-between flex-col">
      <div className="mx-auto w-full max-w-4xl px-4">
        <Header />
        <main className="py-6">
          <div className="mb-6">
            <div className="flex items-center justify-between gap-4">
              <FilterMenu
                titleFilter={titleFilter}
                onTitleFilterChange={setTitleFilter}
                selectedCategoryTitles={selectedCategoryTitles}
                onCategoryToggle={handleCategoryToggle}
                categories={categories}
              />
              <DateSelector
                selectedDate={selectedDate}
                onDateChange={setSelectedDate}
              />
              <div className="flex items-center gap-2">
                <Button onClick={handleAddXP}>Add XP</Button>
              </div>
            </div>
            <SelectedCategories
              selectedCategoryTitles={selectedCategoryTitles}
              onRemove={handleCategoryRemove}
              categories={categories}
            />
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
            <>
              <XPList
                xps={filteredXPs}
                onDelete={handleXPDeleted}
                onItemClick={handleItemClick}
              />
              {filteredXPs.length > 0 && (
                <div className="mt-0 flex items-center justify-between border-t pt-4">
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>
                      {filteredXPs.length} XP
                      {filteredXPs.length !== 1 ? "s" : ""}
                    </span>
                    {totalDuration > 0 && (
                      <span>
                        Total duration: {formatDuration(totalDuration)}
                      </span>
                    )}
                  </div>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handleCopyTitles}
                    aria-label="Copiar títulos"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </>
          )}
        </main>
      </div>
      <Footer />
      <AddXPModal
        open={isModalOpen}
        onOpenChange={handleModalClose}
        ownerId={ownerId}
        onSuccess={handleXPAdded}
        editItemId={editingItemId || undefined}
        onLoadItem={getItemById}
      />
    </div>
  );
}
