"use client";

import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { TagList } from "@/components/tag-list";
import { useQuery } from "@tanstack/react-query";
import { getCategoriesByOwnerId } from "@/src/services/category-service";

const OWNER_ID = "user-1"; // TODO: Substituir por autenticação real

export function TagsPage() {
  const { data: categories = [], isLoading } = useQuery({
    queryKey: ["categories", OWNER_ID],
    queryFn: () => getCategoriesByOwnerId(OWNER_ID),
  });

  return (
    <div className="flex min-h-screen justify-between flex-col">
      <div className="mx-auto w-full max-w-4xl px-4">
        <Header />
        <main className="py-6">
          <div className="mb-6">
            <h1 className="text-2xl font-semibold">
              Tags ({categories.length})
            </h1>
          </div>
          {isLoading ? (
            <div className="py-8 text-center text-sm text-muted-foreground">
              Loading...
            </div>
          ) : (
            <TagList tags={categories} />
          )}
        </main>
      </div>
      <Footer />
    </div>
  );
}
