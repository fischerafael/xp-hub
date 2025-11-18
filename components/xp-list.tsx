import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Trash2 } from "lucide-react";

export interface XP {
  id: string;
  title: string;
  description?: string;
  tags: string[];
  createdAt: string;
  duration?: number;
  ownerId: string;
}

interface XPListProps {
  xps: XP[];
  onDelete?: (id: string) => void;
}

export function XPList({ xps, onDelete }: XPListProps) {
  const formatTime = (timeString: string) => {
    const date = new Date(timeString);
    return date.toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDuration = (minutes?: number) => {
    if (!minutes) return null;
    if (minutes < 60) return `${minutes}min`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}min` : `${hours}h`;
  };

  if (xps.length === 0) {
    return (
      <div className="py-8 text-center text-sm text-muted-foreground">
        Nenhum XP encontrado para este dia.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {xps.map((xp) => (
        <Card key={xp.id} className="relative">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <CardTitle>{xp.title}</CardTitle>
                {xp.description && (
                  <CardDescription className="mt-1">
                    {xp.description}
                  </CardDescription>
                )}
              </div>
              <div className="text-right text-xs text-muted-foreground">
                {formatTime(xp.createdAt)}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap items-center gap-2">
              {xp.tags.map((tag, index) => (
                <span
                  key={index}
                  className="rounded-md bg-secondary px-2 py-1 text-xs text-secondary-foreground"
                >
                  {tag}
                </span>
              ))}
              {xp.duration && (
                <span className="ml-auto text-xs text-muted-foreground">
                  {formatDuration(xp.duration)}
                </span>
              )}
            </div>
          </CardContent>
          {onDelete && (
            <button
              onClick={() => onDelete(xp.id)}
              className="absolute bottom-4 right-4 rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
              aria-label="Remover XP"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          )}
        </Card>
      ))}
    </div>
  );
}
