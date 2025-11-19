import { LocalStorageRepository } from "./local-storage.repository";
import type { XP } from "@/components/xp-list";

/**
 * Repository específico para XP usando localStorage
 */
export const xpRepository = new LocalStorageRepository<XP>("xps");
