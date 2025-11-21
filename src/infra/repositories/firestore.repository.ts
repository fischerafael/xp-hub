import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { firestore } from "@/src/infra/firebase/config";
import type { Repository } from "./repository.interface";

/**
 * Implementação de Repository usando Firestore
 * Encapsula toda a lógica de persistência no Firestore
 */
export class FirestoreRepository<T extends { id: string }>
  implements Repository<T>
{
  private collectionName: string;

  constructor(collectionName: string) {
    this.collectionName = collectionName;
  }

  /**
   * Obtém a referência da coleção
   */
  private getCollection() {
    return collection(firestore, this.collectionName);
  }

  /**
   * Obtém a referência de um documento específico
   */
  private getDocRef(id: string) {
    return doc(firestore, this.collectionName, id);
  }

  /**
   * Busca todos os itens da coleção
   */
  async getAll(): Promise<T[]> {
    try {
      const collectionRef = this.getCollection();
      const querySnapshot = await getDocs(collectionRef);

      const items: T[] = [];
      querySnapshot.forEach((docSnapshot) => {
        const data = docSnapshot.data();
        items.push({
          id: docSnapshot.id,
          ...data,
        } as T);
      });

      return items;
    } catch (error) {
      console.error(
        `Erro ao buscar todos os itens de ${this.collectionName}:`,
        error
      );
      throw error;
    }
  }

  /**
   * Busca um item pelo id
   */
  async getById(id: string): Promise<T | null> {
    try {
      const docRef = this.getDocRef(id);
      const docSnapshot = await getDoc(docRef);

      if (!docSnapshot.exists()) {
        return null;
      }

      const data = docSnapshot.data();
      return {
        id: docSnapshot.id,
        ...data,
      } as T;
    } catch (error) {
      console.error(
        `Erro ao buscar item ${id} de ${this.collectionName}:`,
        error
      );
      throw error;
    }
  }

  /**
   * Cria um novo item (gera id automaticamente)
   */
  async create(item: Omit<T, "id">): Promise<T> {
    try {
      const newId = crypto.randomUUID();
      const newItem = {
        ...item,
        id: newId,
      } as T;

      const docRef = this.getDocRef(newId);
      await setDoc(docRef, item);

      return newItem;
    } catch (error) {
      console.error(`Erro ao criar item em ${this.collectionName}:`, error);
      throw error;
    }
  }

  /**
   * Cria um item com um ID específico (útil para seed/migração)
   */
  async createWithId(item: T): Promise<T> {
    try {
      const docRef = this.getDocRef(item.id);
      const docSnapshot = await getDoc(docRef);

      // Verificar se já existe um item com esse ID
      if (docSnapshot.exists()) {
        throw new Error(`Item com id ${item.id} já existe`);
      }

      // Remover o id do objeto antes de salvar (o id é o documento ID no Firestore)
      const { id, ...data } = item;
      await setDoc(docRef, data);

      return item;
    } catch (error) {
      console.error(
        `Erro ao criar item com id ${item.id} em ${this.collectionName}:`,
        error
      );
      throw error;
    }
  }

  /**
   * Atualiza um item existente
   */
  async update(id: string, updates: Partial<Omit<T, "id">>): Promise<T> {
    try {
      const docRef = this.getDocRef(id);
      const docSnapshot = await getDoc(docRef);

      if (!docSnapshot.exists()) {
        throw new Error(`Item com id ${id} não encontrado`);
      }

      await updateDoc(docRef, updates as Record<string, unknown>);

      const currentData = docSnapshot.data();
      const updatedItem = {
        id: docSnapshot.id,
        ...currentData,
        ...updates,
      } as T;

      return updatedItem;
    } catch (error) {
      console.error(
        `Erro ao atualizar item ${id} de ${this.collectionName}:`,
        error
      );
      throw error;
    }
  }

  /**
   * Remove um item pelo id
   */
  async delete(id: string): Promise<void> {
    try {
      const docRef = this.getDocRef(id);
      await deleteDoc(docRef);
    } catch (error) {
      console.error(
        `Erro ao deletar item ${id} de ${this.collectionName}:`,
        error
      );
      throw error;
    }
  }

  /**
   * Busca itens que atendem a um predicado
   * Nota: Para queries mais complexas, considere usar queries do Firestore diretamente
   */
  async findBy(predicate: (item: T) => boolean): Promise<T[]> {
    try {
      const allItems = await this.getAll();
      return allItems.filter(predicate);
    } catch (error) {
      console.error(
        `Erro ao buscar itens com predicado em ${this.collectionName}:`,
        error
      );
      throw error;
    }
  }
}
