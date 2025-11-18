import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Trash2 } from "lucide-react";
import type { Category } from "@/src/services/category-service";

interface TagListProps {
  tags: Category[];
  onItemClick?: (id: string) => void;
  onDelete?: (id: string) => void;
}

export function TagList({ tags, onItemClick, onDelete }: TagListProps) {
  if (tags.length === 0) {
    return (
      <div className="py-8 text-center text-sm text-muted-foreground">
        No tags found.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {tags.map((tag) => (
        <Card
          key={tag.id}
          className={`relative ${
            onItemClick
              ? "cursor-pointer transition-colors hover:bg-accent"
              : ""
          }`}
          onClick={() => onItemClick?.(tag.id)}
        >
          <CardHeader>
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <CardTitle>{tag.title}</CardTitle>
                {tag.description && (
                  <CardDescription className="mt-1">
                    {tag.description}
                  </CardDescription>
                )}
              </div>
              {tag.color && (
                <div
                  className="h-8 w-8 rounded-md border border-border"
                  style={{ backgroundColor: tag.color }}
                  aria-label={`Cor da tag ${tag.title}`}
                />
              )}
            </div>
          </CardHeader>
          {onDelete && (
            <CardContent>
              <div className="flex items-center justify-end">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(tag.id);
                  }}
                  className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                  aria-label="Remover tag"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </CardContent>
          )}
        </Card>
      ))}
    </div>
  );
}
