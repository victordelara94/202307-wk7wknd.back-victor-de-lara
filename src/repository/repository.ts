/* eslint-disable no-unused-vars */
export interface Repository<T> {
  getAll(): Promise<T[]>;
  getById(id: string): Promise<T>;
  create(newData: Omit<T, 'id'>): Promise<T>;
  search({ key, value }: { key: string; value: unknown }): Promise<T>;
  update(id: string, newData: Partial<T>): Promise<T>;
  delete(id: string): Promise<void>;
}
