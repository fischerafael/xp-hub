"use client";

import * as React from "react";
import * as PopoverPrimitive from "@radix-ui/react-popover";
import { Check, ChevronDown, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const Popover = PopoverPrimitive.Root;
const PopoverTrigger = PopoverPrimitive.Trigger;
const PopoverContent = PopoverPrimitive.Content;

interface ComboboxOption {
  value: string;
  label: string;
}

interface ComboboxProps {
  options: ComboboxOption[];
  value: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

export function Combobox({
  options,
  value,
  onChange,
  placeholder = "Select options...",
  disabled = false,
  className,
}: ComboboxProps) {
  const [open, setOpen] = React.useState(false);

  const selectedOptions = options.filter((option) => value.includes(option.value));

  const toggleOption = (optionValue: string) => {
    if (value.includes(optionValue)) {
      onChange(value.filter((v) => v !== optionValue));
    } else {
      onChange([...value, optionValue]);
    }
  };

  const removeOption = (
    optionValue: string,
    e: React.MouseEvent | React.KeyboardEvent
  ) => {
    e.stopPropagation();
    onChange(value.filter((v) => v !== optionValue));
  };

  const handleRemoveKeyDown = (
    optionValue: string,
    e: React.KeyboardEvent
  ) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      removeOption(optionValue, e);
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          disabled={disabled}
          className={cn(
            "w-full justify-between h-auto min-h-9 px-3 py-1.5 text-left font-normal",
            !value.length && "text-muted-foreground",
            className
          )}
        >
          <div className="flex flex-wrap gap-1 flex-1">
            {selectedOptions.length > 0 ? (
              selectedOptions.map((option) => (
                <span
                  key={option.value}
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-secondary text-secondary-foreground text-sm"
                >
                  {option.label}
                  <span
                    role="button"
                    tabIndex={0}
                    onClick={(e) => removeOption(option.value, e)}
                    onKeyDown={(e) => handleRemoveKeyDown(option.value, e)}
                    className="ml-1 rounded-sm hover:bg-secondary-foreground/20 p-0.5 cursor-pointer focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1"
                  >
                    <X className="h-3 w-3" />
                  </span>
                </span>
              ))
            ) : (
              <span>{placeholder}</span>
            )}
          </div>
          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className={cn(
          "z-50 w-[var(--radix-popover-trigger-width)] rounded-md border bg-popover p-1 text-popover-foreground shadow-md",
          "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0"
        )}
        align="start"
      >
        <div className="max-h-[300px] overflow-auto">
          {options.map((option) => {
            const isSelected = value.includes(option.value);
            return (
              <button
                key={option.value}
                type="button"
                onClick={() => toggleOption(option.value)}
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
                  <span>{option.label}</span>
                </div>
              </button>
            );
          })}
        </div>
      </PopoverContent>
    </Popover>
  );
}

