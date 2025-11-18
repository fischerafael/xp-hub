"use client";

import { Button } from "@/components/ui/button";
import { DateSelector } from "@/components/date-selector";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { XPList } from "@/components/xp-list";
import { AddXPModal } from "@/components/add-xp-modal";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getXpByOwnerId, removeXp } from "@/src/services/xp-service";
import { useState, useMemo } from "react";

const OWNER_ID = "user-1"; // TODO: Substituir por autenticação real

export function AppPage() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const queryClient = useQueryClient();

  const { data: allXPs = [], isLoading } = useQuery({
    queryKey: ["xps", OWNER_ID],
    queryFn: () => getXpByOwnerId(OWNER_ID),
  });

  // Filtrar XPs pela data selecionada
  const filteredXPs = useMemo(() => {
    const startOfDay = new Date(selectedDate);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(selectedDate);
    endOfDay.setHours(23, 59, 59, 999);

    return allXPs.filter((xp) => {
      const xpDate = new Date(xp.createdAt);
      return xpDate >= startOfDay && xpDate <= endOfDay;
    });
  }, [allXPs, selectedDate]);

  const handleAddXP = () => {
    setIsModalOpen(true);
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

  return (
    <div className="flex min-h-screen justify-between flex-col">
      <div className="mx-auto w-full max-w-4xl px-4">
        <Header />
        <main className="py-6">
          <div className="mb-6 flex items-center justify-between gap-4">
            <DateSelector
              selectedDate={selectedDate}
              onDateChange={setSelectedDate}
            />
            <Button onClick={handleAddXP}>Add XP</Button>
          </div>
          {isLoading ? (
            <div className="py-8 text-center text-sm text-muted-foreground">
              Carregando...
            </div>
          ) : (
            <XPList xps={filteredXPs} onDelete={handleXPDeleted} />
          )}
        </main>
      </div>
      <Footer />
      <AddXPModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        ownerId={OWNER_ID}
        onSuccess={handleXPAdded}
      />
    </div>
  );
}
