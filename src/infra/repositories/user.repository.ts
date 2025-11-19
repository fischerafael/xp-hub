import { LocalStorageRepository } from "./local-storage.repository";
import type { User } from "@/src/services/user-service";

/**
 * Repository específico para User usando localStorage
 */
export const userRepository = new LocalStorageRepository<User>("users");
