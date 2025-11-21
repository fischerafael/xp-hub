"use client";

import { useState } from "react";
import { Filter, X } from "lucide-react";
import * as PopoverPrimitive from "@radix-ui/react-popover";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Category } from "@/src/server/services/category-service";

const Popover = PopoverPrimitive.Root;
const PopoverTrigger = PopoverPrimitive.Trigger;
const PopoverContent = PopoverPrimitive.Content;

interface FilterMenuProps {
  titleFilter: string;
  onTitleFilterChange: (value: string) => void;
  selectedCategoryIds: string[];
  onCategoryToggle: (categoryId: string) => void;
  categories: Category[];
}

export function FilterMenu({
  titleFilter,
  onTitleFilterChange,
  selectedCategoryIds,
  onCategoryToggle,
  categories,
}: FilterMenuProps) {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="icon">
          <Filter className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className={cn(
          "z-50 w-80 rounded-md border bg-popover p-4 text-popover-foreground shadow-md",
          "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0"
        )}
        align="start"
      >
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">
              Filter by title
            </label>
            <Input
              type="text"
              placeholder="Digite o título..."
              value={titleFilter}
              onChange={(e) => onTitleFilterChange(e.target.value)}
              className="w-full"
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-2 block">
              Filter by category
            </label>
            <div className="max-h-[300px] overflow-auto space-y-1">
              {categories.map((category) => {
                const isSelected = selectedCategoryIds.includes(
                  category.id
                );
                return (
                  <button
                    key={category.id}
                    type="button"
                    onClick={() => onCategoryToggle(category.id)}
                    className={cn(
                      "relative flex w-full cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground",
                      isSelected && "bg-accent"
                    )}
                  >
                    <div className="flex items-center gap-2 flex-1">
                      <div
                        className={cn(
                          "flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                          isSelected && "bg-primary text-primary-foreground"
                        )}
                      >
                        {isSelected && <Check className="h-3 w-3" />}
                      </div>
                      <span>{category.title}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}

interface SelectedCategoriesProps {
  selectedCategoryIds: string[];
  onRemove: (categoryId: string) => void;
  categories: Category[];
}

export function SelectedCategories({
  selectedCategoryIds,
  onRemove,
  categories,
}: SelectedCategoriesProps) {
  if (selectedCategoryIds.length === 0) {
    return null;
  }

  const selectedCategories = categories.filter((cat) =>
    selectedCategoryIds.includes(cat.id)
  );

  return (
    <div className="flex flex-wrap gap-2 mt-2">
      {selectedCategories.map((category) => (
        <span
          key={category.id}
          className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-secondary text-secondary-foreground text-sm"
        >
          {category.title}
          <button
            type="button"
            onClick={() => onRemove(category.id)}
            className="ml-1 rounded-sm hover:bg-secondary-foreground/20 p-0.5"
            aria-label={`Remover filtro ${category.title}`}
          >
            <X className="h-3 w-3" />
          </button>
        </span>
      ))}
    </div>
  );
}
