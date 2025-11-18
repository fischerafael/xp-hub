"use client";

import { Button } from "@/components/ui/button";
import { DateSelector } from "@/components/date-selector";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { XPList, type XP } from "@/components/xp-list";

// Dados mockados de XPs
const mockXPs: XP[] = [
  {
    id: "1",
    title: "Implementação de autenticação",
    description: "Criação do sistema de login e registro de usuários",
    tags: ["backend", "autenticação", "segurança"],
    createdAt: new Date().toISOString(),
    duration: 120,
  },
  {
    id: "2",
    title: "Refatoração de componentes",
    tags: ["frontend", "react"],
    createdAt: new Date(Date.now() - 3600000).toISOString(),
    duration: 45,
  },
  {
    id: "3",
    title: "Reunião de planejamento",
    description: "Discussão sobre as próximas features do projeto",
    tags: ["reunião", "planejamento"],
    createdAt: new Date(Date.now() - 7200000).toISOString(),
  },
  {
    id: "4",
    title: "Testes unitários",
    tags: ["testes", "qualidade"],
    createdAt: new Date(Date.now() - 10800000).toISOString(),
    duration: 90,
  },
];

export function AppPage() {
  const handleAddXP = () => {
    // TODO: Implementar adição de XP
    console.log("Add XP clicked");
  };

  return (
    <div className="flex min-h-screen justify-between flex-col">
      <div className="mx-auto w-full max-w-4xl px-4">
        <Header />
        <main className="py-6">
          <div className="mb-6 flex items-center justify-between gap-4">
            <DateSelector />
            <Button onClick={handleAddXP}>Add XP</Button>
          </div>
          <XPList xps={mockXPs} />
        </main>
      </div>
      <Footer />
    </div>
  );
}
