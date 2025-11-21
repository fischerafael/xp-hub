"use client";

import { useState, useEffect, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
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
import { Combobox } from "@/components/ui/combobox";
import { addXp, editXp } from "@/src/server/services/xp-service";
import { getCategoriesByOwnerId } from "@/src/server/services/category-service";
import type { XP } from "@/components/xp-list";

interface AddXPModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  ownerId: string;
  onSuccess?: () => void;
  editItemId?: string;
  onLoadItem?: (id: string) => Promise<XP | null>;
}

export function AddXPModal({
  open,
  onOpenChange,
  ownerId,
  onSuccess,
  editItemId,
  onLoadItem,
}: AddXPModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [duration, setDuration] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isEditing = !!editItemId;

  // Load item data when editing
  useEffect(() => {
    if (open && editItemId && onLoadItem) {
      setIsLoading(true);
      onLoadItem(editItemId)
        .then((item) => {
          if (item) {
            setTitle(item.title);
            setDescription(item.description || "");
            setTags(item.tags || []);
            setDuration(item.duration ? (item.duration / 60).toString() : "");
          }
        })
        .catch((err) => {
          console.error("Error loading item:", err);
          setError("Error loading item data");
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else if (open && !editItemId) {
      // Clear form when opening for new item
      setTitle("");
      setDescription("");
      setTags([]);
      setDuration("");
      setError(null);
    }
  }, [open, editItemId, onLoadItem]);

  // Fetch categories from service
  const { data: categories = [] } = useQuery({
    queryKey: ["categories", ownerId],
    queryFn: () => getCategoriesByOwnerId(ownerId),
  });

  // Transform categories to tagOptions format
  const tagOptions = useMemo(() => {
    return categories.map((category) => ({
      value: category.title,
      label: category.title,
    }));
  }, [categories]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Basic validation
    if (!title.trim()) {
      setError("Title is required");
      return;
    }

    setIsSubmitting(true);

    try {
      // Convert duration from hours (0.25 = 15 min) to minutes
      let durationMinutes: number | undefined;
      if (duration) {
        const durationHours = parseFloat(duration);
        // Validate it's a multiple of 0.25 (multiply by 4 and check if it's an integer)
        if (
          Math.abs(Math.round(durationHours * 4) - durationHours * 4) > 0.001
        ) {
          setError("Duration must be a multiple of 0.25 (15 minutes)");
          setIsSubmitting(false);
          return;
        }
        durationMinutes = Math.round(durationHours * 60);
      }

      // Prepare XP data (without id and createdAt)
      const xpData: Omit<XP, "id" | "createdAt"> = {
        title: title.trim(),
        description: description.trim() || undefined,
        tags: tags,
        duration: durationMinutes,
        ownerId,
      };

      if (isEditing && editItemId) {
        await editXp(editItemId, xpData);
      } else {
        await addXp(xpData);
      }

      // Clear form
      setTitle("");
      setDescription("");
      setTags([]);
      setDuration("");
      setError(null);

      // Close modal and call success callback
      onOpenChange(false);
      onSuccess?.();
    } catch (err) {
      setError(
        isEditing
          ? "Error updating XP. Please try again."
          : "Error creating XP. Please try again."
      );
      console.error(isEditing ? "Error editing XP:" : "Error adding XP:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!isSubmitting && !isLoading) {
      onOpenChange(newOpen);
      if (!newOpen) {
        // Clear form on close
        setTitle("");
        setDescription("");
        setTags([]);
        setDuration("");
        setError(null);
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit XP" : "Add XP"}</DialogTitle>
          <DialogDescription>
            Fill in the experience data. The title is required.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            {isLoading ? (
              <div className="py-8 text-center text-sm text-muted-foreground">
                Loading...
              </div>
            ) : (
              <>
                <div className="space-y-2">
                  <Label htmlFor="title">
                    Title <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Ex: Learned React Hooks"
                    required
                    disabled={isSubmitting}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe your experience..."
                    className="flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                    disabled={isSubmitting}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tags">Tags</Label>
                  <Combobox
                    options={tagOptions}
                    value={tags}
                    onChange={setTags}
                    placeholder="Select tags..."
                    disabled={isSubmitting}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="duration">Duration (hours)</Label>
                  <Input
                    id="duration"
                    type="number"
                    step="0.25"
                    min="0.25"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    placeholder="Ex: 0.25 (15 min), 0.5 (30 min), 1.0 (60 min)"
                    disabled={isSubmitting}
                  />
                  <p className="text-xs text-muted-foreground">
                    Multiples of 0.25 (0.25 = 15 minutes)
                  </p>
                </div>

                {error && (
                  <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
                    {error}
                  </div>
                )}
              </>
            )}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
              disabled={isSubmitting || isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting || isLoading}>
              {isSubmitting
                ? isEditing
                  ? "Updating..."
                  : "Creating..."
                : isEditing
                ? "Update XP"
                : "Create XP"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
