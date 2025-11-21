/**
 * Interface genérica para acesso a dados
 * Permite trocar a implementação de persistência sem alterar os services
 */
export interface Repository<T extends { id: string }> {
  /**
   * Busca todos os itens
   */
  getAll(): Promise<T[]>;

  /**
   * Busca um item pelo id
   */
  getById(id: string): Promise<T | null>;

  /**
   * Cria um novo item (gera id automaticamente)
   */
  create(item: Omit<T, "id">): Promise<T>;

  /**
   * Atualiza um item existente
   */
  update(id: string, item: Partial<Omit<T, "id">>): Promise<T>;

  /**
   * Remove um item pelo id
   */
  delete(id: string): Promise<void>;

  /**
   * Busca itens que atendem a um predicado
   */
  findBy(predicate: (item: T) => boolean): Promise<T[]>;
}
