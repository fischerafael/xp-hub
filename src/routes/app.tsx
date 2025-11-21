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
  getXpByOwnerIdWithFilters,
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

  const { data: filteredXPs = [], isLoading } = useQuery({
    queryKey: [
      "xps",
      ownerId,
      selectedDate.toISOString(),
      [...selectedCategoryTitles].sort().join(","),
    ],
    queryFn: () =>
      getXpByOwnerIdWithFilters(ownerId, {
        date: selectedDate,
        categoryTitles:
          selectedCategoryTitles.length > 0
            ? selectedCategoryTitles
            : undefined,
      }),
    enabled: !!ownerId,
  });

  const { data: categories = [] } = useQuery({
    queryKey: ["categories", ownerId],
    queryFn: () => getCategoriesByOwnerId(ownerId),
    enabled: !!ownerId,
  });

  // Filtrar XPs pelo título (filtro que permanece no frontend)
  const titleFilteredXPs = useMemo(() => {
    if (!titleFilter.trim()) {
      return filteredXPs;
    }

    return filteredXPs.filter((xp) => {
      const titleMatch = xp.title
        .toLowerCase()
        .includes(titleFilter.toLowerCase());
      return titleMatch;
    });
  }, [filteredXPs, titleFilter]);

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
    queryClient.invalidateQueries({ queryKey: ["xps"] });
  };

  const handleXPDeleted = async (id: string) => {
    try {
      await removeXp(id);
      queryClient.invalidateQueries({ queryKey: ["xps"] });
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
    const titles = titleFilteredXPs.map((xp) => `- ${xp.title}`).join("\n");
    try {
      await navigator.clipboard.writeText(titles);
    } catch (error) {
      console.error("Erro ao copiar títulos:", error);
    }
  };

  const totalDuration = useMemo(() => {
    return titleFilteredXPs.reduce((total, xp) => {
      return total + (xp.duration || 0);
    }, 0);
  }, [titleFilteredXPs]);

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
                xps={titleFilteredXPs}
                onDelete={handleXPDeleted}
                onItemClick={handleItemClick}
              />
              {titleFilteredXPs.length > 0 && (
                <div className="mt-0 flex items-center justify-between border-t pt-4">
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>
                      {titleFilteredXPs.length} XP
                      {titleFilteredXPs.length !== 1 ? "s" : ""}
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
