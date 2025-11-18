import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { Category } from "@/src/services/category-service";

interface TagListProps {
  tags: Category[];
}

export function TagList({ tags }: TagListProps) {
  if (tags.length === 0) {
    return (
      <div className="py-8 text-center text-sm text-muted-foreground">
        Nenhuma tag encontrada.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {tags.map((tag) => (
        <Card key={tag.id}>
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
        </Card>
      ))}
    </div>
  );
}
