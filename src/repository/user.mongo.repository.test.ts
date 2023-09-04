import { UserModel } from './user.mongo.model.js';
import { UserMongoRepository } from './user.mongo.repository';

jest.mock('./user.mongo.model.js');
describe('Given the class UserMongoREpository', () => {
  let repo: UserMongoRepository;
  beforeEach(() => {
    repo = new UserMongoRepository();
  });
  describe('When we use getAll', () => {
    test('Then if all is ok', async () => {
      const mockExec = jest.fn().mockReturnValue([]);
      UserModel.find = jest.fn().mockReturnValue({
        exec: mockExec,
      });
      const result = await repo.getAll();
      expect(result).toEqual([]);
    });
  });
  describe('When we use getById', () => {
    test('Then if all is ok', async () => {
      const data = { id: 'test' };
      const mockExec = jest.fn().mockReturnValue(data);
      UserModel.findById = jest.fn().mockReturnValue({
        exec: mockExec,
      });
      const result = await repo.getById('test');
      expect(result).toEqual(data);
    });
    test('Then if are errors', async () => {
      const mockExec = jest.fn().mockReturnValue(null);
      UserModel.findById = jest.fn().mockReturnValue({
        exec: mockExec,
      });

      expect(repo.getById('')).rejects.toThrow();
    });
  });
  describe('When we use create', () => {
    test('Then if all is ok', async () => {
      const data = {
        userName: 'test',
        password: 'test',
        firstName: 'test',
        surname: 'test',
        email: 'test',
        enemies: [],
        friends: [],
        age: 3,
      };
      const dataWithId = {
        userName: 'test',
        password: 'test',
        firstName: 'test',
        surname: 'test',
        email: 'test',
        enemies: [],
        friends: [],
        age: 3,
        id: '',
      };

      UserModel.create = jest.fn().mockReturnValue(dataWithId);
      const result = await repo.create(data);
      expect(result).toEqual(dataWithId);
    });
    describe('When we use search', () => {
      const mockKey = 'userName';
      const mockValue = 'value';
      test('Then if all is ok', async () => {
        const mockAData = [{}];

        UserModel.find = jest.fn().mockReturnValue({
          exec: jest.fn().mockReturnValue(mockAData),
        });
        const result = await repo.search({ key: mockKey, value: mockValue });
        expect(result).toEqual(mockAData);
      });
      test('Then if are errors', async () => {
        const mockExec = jest.fn().mockReturnValue(null);
        UserModel.find = jest.fn().mockReturnValue({
          exec: mockExec,
        });

        expect(
          repo.search({ key: mockKey, value: mockValue })
        ).rejects.toThrow();
      });
    });
    describe('When we use update', () => {
      const mockId = '';
      const mockNewData = {};
      test('Then if all is ok', async () => {
        const mockData = {};

        UserModel.findByIdAndUpdate = jest.fn().mockReturnValue({
          exec: jest.fn().mockReturnValue(mockData),
        });
        const result = await repo.update(mockId, mockNewData);
        expect(result).toEqual(mockData);
      });
      test('Then if are errors', async () => {
        const mockExec = jest.fn().mockReturnValue(null);
        UserModel.findByIdAndUpdate = jest.fn().mockReturnValue({
          exec: mockExec,
        });

        expect(repo.update(mockId, mockNewData)).rejects.toThrow();
      });
    });
    describe('When we use delete', () => {
      const mockId = '';

      test('Then if all is ok', async () => {
        UserModel.findByIdAndDelete = jest.fn().mockReturnValue({});
        const result = await repo.delete(mockId);
        expect(result).toEqual(undefined);
      });
      test('Then if are errors', async () => {
        UserModel.findByIdAndDelete = jest.fn().mockReturnValue(null);

        expect(repo.delete(mockId)).rejects.toThrow();
      });
    });
  });
});
