"use client";

import { useState } from "react";
import { Filter, X } from "lucide-react";
import * as PopoverPrimitive from "@radix-ui/react-popover";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Category } from "@/src/services/category-service";

const Popover = PopoverPrimitive.Root;
const PopoverTrigger = PopoverPrimitive.Trigger;
const PopoverContent = PopoverPrimitive.Content;

interface FilterMenuProps {
  titleFilter: string;
  onTitleFilterChange: (value: string) => void;
  selectedCategoryTitles: string[];
  onCategoryToggle: (categoryTitle: string) => void;
  categories: Category[];
}

export function FilterMenu({
  titleFilter,
  onTitleFilterChange,
  selectedCategoryTitles,
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
        align="end"
      >
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">
              Filtrar por título
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
              Filtrar por categoria
            </label>
            <div className="max-h-[300px] overflow-auto space-y-1">
              {categories.map((category) => {
                const isSelected = selectedCategoryTitles.includes(
                  category.title
                );
                return (
                  <button
                    key={category.id}
                    type="button"
                    onClick={() => onCategoryToggle(category.title)}
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
  selectedCategoryTitles: string[];
  onRemove: (categoryTitle: string) => void;
  categories: Category[];
}

export function SelectedCategories({
  selectedCategoryTitles,
  onRemove,
  categories,
}: SelectedCategoriesProps) {
  if (selectedCategoryTitles.length === 0) {
    return null;
  }

  const selectedCategories = categories.filter((cat) =>
    selectedCategoryTitles.includes(cat.title)
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
            onClick={() => onRemove(category.title)}
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
