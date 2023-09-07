import createDebug from 'debug';
import 'dotenv/config';
import { User } from '../entities/user.js';
import { HttpError } from '../types/http.error.type.js';
import { Repository } from './repository.js';
import { UserModel } from './user.mongo.model.js';
const debug = createDebug('SN:Repo:UserMongoRepo');

export class UserMongoRepository implements Repository<User> {
  constructor() {
    debug('intantiate');
  }

  async getAll(): Promise<User[]> {
    const data = await UserModel.find()
      .populate('friends', { userName: 1 })
      .populate('enemies', { userName: 1 })
      .exec();
    return data;
  }

  async getById(id: string): Promise<User> {
    const data = await UserModel.findById(id)
      .populate('friends', { userName: 1 })
      .populate('enemies', { userName: 1 })
      .exec();
    if (!data)
      throw new HttpError(404, 'Not Found', 'User not found', {
        cause: 'Trying getById',
      });

    return data;
  }

  async create(newData: Omit<User, 'id'>): Promise<User> {
    const data = await UserModel.create(newData);
    return data;
  }

  async search({
    key,
    value,
  }: {
    key: string;
    value: unknown;
  }): Promise<User[]> {
    const data = await UserModel.find({ [key]: value }).exec();
    if (!data)
      throw new HttpError(404, 'Not Found', 'User not found', {
        cause: 'Trying getById',
      });
    return data;
  }

  async update(id: string, newData: Partial<User>): Promise<User> {
    const data = await UserModel.findByIdAndUpdate(id, newData, {
      new: true,
    }).exec();
    if (!data)
      throw new HttpError(404, 'Not Found', 'User not found', {
        cause: 'Trying getById',
      });

    return data;
  }

  async delete(id: string): Promise<void> {
    const result = await UserModel.findByIdAndDelete(id);
    if (!result)
      throw new HttpError(404, 'Not Found', 'User not found in file system', {
        cause: 'Trying delete',
      });
  }
}
