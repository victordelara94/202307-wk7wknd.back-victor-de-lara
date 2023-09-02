/* eslint-disable no-unused-vars */
export interface Repository<User> {
  getAll(): Promise<User[]>;
  getById(id: string): Promise<User>;
  create(newData: Omit<User, 'id'>): Promise<User>;
  search({ key, value }: { key: string; value: unknown }): Promise<User[]>;
  update(id: string, newData: Partial<User>): Promise<User>;
  delete(id: string): Promise<void>;
}
