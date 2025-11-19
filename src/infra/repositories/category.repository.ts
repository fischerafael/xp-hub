import { LocalStorageRepository } from "./local-storage.repository";
import type { Category } from "@/src/services/category-service";

/**
 * Repository específico para Category usando localStorage
 */
export const categoryRepository = new LocalStorageRepository<Category>(
  "categories"
);
