import type { Repository } from "./repository.interface";

/**
 * Implementação de Repository usando localStorage
 * Encapsula toda a lógica de persistência no localStorage
 */
export class LocalStorageRepository<T extends { id: string }>
  implements Repository<T>
{
  private storageKey: string;

  constructor(storageKey: string) {
    this.storageKey = storageKey;
  }

  /**
   * Verifica se o localStorage está disponível (client-side)
   */
  private isAvailable(): boolean {
    return typeof window !== "undefined";
  }

  /**
   * Carrega todos os itens do localStorage
   */
  private loadAll(): T[] {
    if (!this.isAvailable()) {
      return [];
    }

    try {
      const stored = localStorage.getItem(this.storageKey);
      if (!stored) {
        return [];
      }
      return JSON.parse(stored) as T[];
    } catch (error) {
      console.error(`Erro ao carregar dados de ${this.storageKey}:`, error);
      return [];
    }
  }

  /**
   * Salva todos os itens no localStorage
   */
  private saveAll(items: T[]): void {
    if (!this.isAvailable()) {
      throw new Error("localStorage não está disponível");
    }

    try {
      localStorage.setItem(this.storageKey, JSON.stringify(items));
    } catch (error) {
      console.error(`Erro ao salvar dados em ${this.storageKey}:`, error);
      throw error;
    }
  }

  async getAll(): Promise<T[]> {
    return this.loadAll();
  }

  async getById(id: string): Promise<T | null> {
    const items = this.loadAll();
    return items.find((item) => item.id === id) || null;
  }

  async create(item: Omit<T, "id">): Promise<T> {
    const newItem = {
      ...item,
      id: crypto.randomUUID(),
    } as T;

    const items = this.loadAll();
    items.push(newItem);
    this.saveAll(items);

    return newItem;
  }

  /**
   * Cria um item com um ID específico (útil para seed/migração)
   */
  async createWithId(item: T): Promise<T> {
    const items = this.loadAll();

    // Verificar se já existe um item com esse ID
    if (items.some((existing) => existing.id === item.id)) {
      throw new Error(`Item com id ${item.id} já existe`);
    }

    items.push(item);
    this.saveAll(items);

    return item;
  }

  async update(id: string, updates: Partial<Omit<T, "id">>): Promise<T> {
    const items = this.loadAll();
    const index = items.findIndex((item) => item.id === id);

    if (index === -1) {
      throw new Error(`Item com id ${id} não encontrado`);
    }

    const updatedItem = {
      ...items[index],
      ...updates,
      id: items[index].id, // Preservar o id original
    } as T;

    items[index] = updatedItem;
    this.saveAll(items);

    return updatedItem;
  }

  async delete(id: string): Promise<void> {
    const items = this.loadAll();
    const filteredItems = items.filter((item) => item.id !== id);
    this.saveAll(filteredItems);
  }

  async findBy(predicate: (item: T) => boolean): Promise<T[]> {
    const items = this.loadAll();
    return items.filter(predicate);
  }
}
