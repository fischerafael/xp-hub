"use client";

import { useState, useEffect } from "react";
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
import { addCategory, editCategory } from "@/lib/category-api";
import type { Category } from "@/src/server/services/category-service";

interface AddCategoryModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  ownerId: string;
  onSuccess?: () => void;
  editCategoryId?: string;
  onLoadCategory?: (id: string) => Promise<Category | null>;
}

export function AddCategoryModal({
  open,
  onOpenChange,
  ownerId,
  onSuccess,
  editCategoryId,
  onLoadCategory,
}: AddCategoryModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [color, setColor] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isEditing = !!editCategoryId;

  // Load category data when editing
  useEffect(() => {
    if (open && editCategoryId && onLoadCategory) {
      setIsLoading(true);
      onLoadCategory(editCategoryId)
        .then((category) => {
          if (category) {
            setTitle(category.title);
            setDescription(category.description || "");
            setColor(category.color || "");
          }
        })
        .catch((err) => {
          console.error("Error loading category:", err);
          setError("Error loading category data");
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else if (open && !editCategoryId) {
      // Clear form when opening for new category
      setTitle("");
      setDescription("");
      setColor("");
      setError(null);
    }
  }, [open, editCategoryId, onLoadCategory]);

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
      // Prepare category data (without id)
      const categoryData: Omit<Category, "id"> = {
        title: title.trim(),
        description: description.trim() || undefined,
        color: color.trim() || undefined,
        ownerId,
      };

      if (isEditing && editCategoryId) {
        await editCategory(editCategoryId, categoryData);
      } else {
        await addCategory(ownerId, categoryData);
      }

      // Clear form
      setTitle("");
      setDescription("");
      setColor("");
      setError(null);

      // Close modal and call success callback
      onOpenChange(false);
      onSuccess?.();
    } catch (err) {
      setError(
        isEditing
          ? "Error updating category. Please try again."
          : "Error creating category. Please try again."
      );
      console.error(
        isEditing ? "Error editing category:" : "Error adding category:",
        err
      );
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
        setColor("");
        setError(null);
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Edit Category" : "Add Category"}
          </DialogTitle>
          <DialogDescription>
            Fill in the category data. The title is required.
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
                    placeholder="Ex: react, javascript, typescript"
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
                    placeholder="Describe the category..."
                    className="flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                    disabled={isSubmitting}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="color">Color</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      id="color"
                      type="color"
                      value={color || "#000000"}
                      onChange={(e) => setColor(e.target.value)}
                      className="h-10 w-20 cursor-pointer"
                      disabled={isSubmitting}
                    />
                    <Input
                      type="text"
                      value={color}
                      onChange={(e) => setColor(e.target.value)}
                      placeholder="#000000"
                      className="flex-1"
                      disabled={isSubmitting}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Optional. Choose a color for this category.
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
                ? "Update Category"
                : "Create Category"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
