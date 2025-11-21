import { FirestoreRepository } from "./firestore.repository";
import type { Category } from "@/src/server/services/category-service";

/**
 * Repository específico para Category usando Firestore
 */
export const categoryRepository = new FirestoreRepository<Category>(
  "categories"
);
