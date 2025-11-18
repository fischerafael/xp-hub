"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { addXp } from "@/src/services/xp-service";
import type { XP } from "@/components/xp-list";

interface AddXPModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  ownerId: string;
  onSuccess?: () => void;
}

export function AddXPModal({
  open,
  onOpenChange,
  ownerId,
  onSuccess,
}: AddXPModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");
  const [duration, setDuration] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validação básica
    if (!title.trim()) {
      setError("O título é obrigatório");
      return;
    }

    setIsSubmitting(true);

    try {
      // Converter tags de string (vírgula) para array
      const tagsArray = tags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag.length > 0);

      // Preparar dados da XP (sem id e createdAt)
      const xpData: Omit<XP, "id" | "createdAt"> = {
        title: title.trim(),
        description: description.trim() || undefined,
        tags: tagsArray,
        duration: duration ? parseInt(duration, 10) : undefined,
        ownerId,
      };

      await addXp(xpData);

      // Limpar formulário
      setTitle("");
      setDescription("");
      setTags("");
      setDuration("");
      setError(null);

      // Fechar modal e chamar callback de sucesso
      onOpenChange(false);
      onSuccess?.();
    } catch (err) {
      setError("Erro ao criar XP. Tente novamente.");
      console.error("Erro ao adicionar XP:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!isSubmitting) {
      onOpenChange(newOpen);
      if (!newOpen) {
        // Limpar formulário ao fechar
        setTitle("");
        setDescription("");
        setTags("");
        setDuration("");
        setError(null);
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Adicionar XP</DialogTitle>
          <DialogDescription>
            Preencha os dados da experiência. O título é obrigatório.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title">
                Título <span className="text-destructive">*</span>
              </Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ex: Aprendi React Hooks"
                required
                disabled={isSubmitting}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descrição</Label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Descreva sua experiência..."
                className="flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                disabled={isSubmitting}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tags">Tags</Label>
              <Input
                id="tags"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="Ex: react, hooks, javascript (separadas por vírgula)"
                disabled={isSubmitting}
              />
              <p className="text-xs text-muted-foreground">
                Separe as tags por vírgula
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="duration">Duração (minutos)</Label>
              <Input
                id="duration"
                type="number"
                min="1"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                placeholder="Ex: 30"
                disabled={isSubmitting}
              />
            </div>

            {error && (
              <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
                {error}
              </div>
            )}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Criando..." : "Criar XP"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
