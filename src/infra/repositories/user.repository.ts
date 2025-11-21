import { FirestoreRepository } from "./firestore.repository";
import type { User } from "@/src/services/user-service";

/**
 * Repository específico para User usando Firestore
 */
export const userRepository = new FirestoreRepository<User>("users");
