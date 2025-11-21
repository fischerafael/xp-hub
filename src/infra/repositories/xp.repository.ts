import { FirestoreRepository } from "./firestore.repository";
import type { XP } from "@/components/xp-list";

/**
 * Repository específico para XP usando Firestore
 */
export const xpRepository = new FirestoreRepository<XP>("xps");
