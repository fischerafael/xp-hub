"use client";

import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

export function DateSelector() {
  const [selectedDate, setSelectedDate] = useState(new Date());

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("pt-BR", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const goToPreviousDay = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() - 1);
    setSelectedDate(newDate);
  };

  const goToNextDay = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + 1);
    setSelectedDate(newDate);
  };

  return (
    <div className="flex items-center justify-between gap-4">
      <div className="flex items-center gap-2">
        <Button variant="outline" size="icon" onClick={goToPreviousDay}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <div className="min-w-[200px] text-center text-sm font-medium">
          {formatDate(selectedDate)}
        </div>
        <Button variant="outline" size="icon" onClick={goToNextDay}>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
