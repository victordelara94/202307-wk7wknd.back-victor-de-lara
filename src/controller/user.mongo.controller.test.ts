import { NextFunction, Request, Response } from 'express';
import { User } from '../entities/user.js';
import { Repository } from '../repository/repository.js';
import { Auth } from '../services/auth.js';
import { UserMongoController } from './user.mongo.controller.js';
describe('Givent the instantiate USerMongoController', () => {
  describe('When all is ok', () => {
    const mockNext = jest.fn() as NextFunction;

    const mockRepo: Repository<User> = {
      create: jest.fn(),
      getAll: jest.fn(),
      getById: jest.fn(),
      search: jest.fn().mockResolvedValue([
        {
          userName: '',
          id: '',
        },
      ]),
      update: jest.fn(),
      delete: jest.fn(),
    };

    const mockUserMongoController = new UserMongoController(mockRepo);
    test('Then if we use register method', async () => {
      const mockData = { id: 'test', userName: 'test' };

      (mockRepo.create as jest.Mock).mockReturnValue({
        id: 'test',
        userName: 'test',
      });
      const mockReq = {
        body: {
          password: 'test',
        },
      } as Request;
      const mockResponse = {
        status: Number,
        json: jest.fn(),
      } as unknown as Response;

      await mockUserMongoController.register(mockReq, mockResponse, mockNext);
      expect(mockResponse.json).toHaveBeenCalledWith(mockData);
    });
    test('Then if we use login method', async () => {
      Auth.compare = await jest.fn().mockReturnValue(true);
      Auth.signJWT = await jest.fn().mockResolvedValue('testToken');

      const mockReq = {
        body: {
          userName: 'test',
          password: 'test',
        },
      } as Request;
      const mockResponse = {
        json: jest.fn(),
      } as unknown as Response;

      await mockUserMongoController.login(mockReq, mockResponse, mockNext);
      expect(await mockRepo.search).toHaveBeenCalled();
      expect(mockResponse.json).toHaveBeenCalled();
    });
    test('Then if we use login method and not find the userName', async () => {
      (mockRepo.search as jest.Mock).mockResolvedValue([]);
      const mockReq = {
        body: {
          userName: 'test',
          password: 'test',
        },
      } as Request;
      const mockResponse = {
        json: jest.fn(),
      } as unknown as Response;

      await mockUserMongoController.login(mockReq, mockResponse, mockNext);
    });
    test('Then if we use login method, with not the correct password', async () => {
      Auth.compare = jest.fn().mockResolvedValue(false);

      const mockReq = {
        body: {
          userName: 'test',
          password: 'test',
        },
      } as Request;
      const mockResponse = {
        json: jest.fn(),
      } as unknown as Response;

      await mockUserMongoController.login(mockReq, mockResponse, mockNext);
    });
    test('Then if we use getAll method', async () => {
      const aData = [{ id: 'test', userName: 'test' }];

      (mockRepo.getAll as jest.Mock).mockResolvedValue(aData);
      const mockReq = {} as Request;
      const mockResponse = {
        json: jest.fn(),
      } as unknown as Response;

      await mockUserMongoController.getAll(mockReq, mockResponse, mockNext);
      expect(await mockRepo.getAll).toHaveBeenCalled();
      expect(mockResponse.json).toHaveBeenCalledWith(aData);
    });
    test('Then if we use getById method', async () => {
      const mockData = { id: 'test', userName: 'test' };
      (mockRepo.getById as jest.Mock).mockResolvedValue(mockData);
      const mockReq = {
        params: { id: 'test' },
      } as unknown as Request;
      const mockResponse = {
        json: jest.fn(),
      } as unknown as Response;

      await mockUserMongoController.getById(mockReq, mockResponse, mockNext);
      expect(mockRepo.getById).toHaveBeenCalled();
      expect(mockResponse.json).toHaveBeenCalledWith(mockData);
    });
    test('Then if we use update method', async () => {
      const mockData = { id: 'test', userName: 'test' };
      Auth.hash = await jest.fn().mockReturnValue('hash');
      (mockRepo.update as jest.Mock).mockResolvedValue(mockData);
      const mockReq = {
        body: { password: 'test', validatedId: 'test' },
      } as unknown as Request;
      const mockResponse = {
        json: jest.fn(),
        status: Number,
      } as unknown as Response;

      await mockUserMongoController.update(mockReq, mockResponse, mockNext);
      expect(mockRepo.update).toHaveBeenCalled();
      expect(mockResponse.json).toHaveBeenCalled();
    });
    test('Then if we use addFriends method with a User who are actually a friend', async () => {
      const friend = { id: 'test' };
      const User = {
        friends: [{ id: 'test' }],
        enemies: [{ id: 'test2' }],
      };
      (mockRepo.getById as jest.Mock).mockResolvedValueOnce(friend);
      (mockRepo.getById as jest.Mock).mockResolvedValueOnce(User);
      const mockReq = {
        body: { id: 'test', validatedId: 'test' },
      } as unknown as Request;
      const mockResponse = {
        json: jest.fn(),
      } as unknown as Response;

      await mockUserMongoController.addFriends(mockReq, mockResponse, mockNext);
      expect(mockRepo.getById).toHaveBeenCalled();
    });
    test.only('Then if we use addFriends method with a User who are not actually a friend', async () => {
      const friend = { id: 'test1' };
      const User = {
        id: { id: 'test' },
        friends: [{ id: 'test' }],
        enemies: [{ id: 'test2' }],
      };
      (mockRepo.getById as jest.Mock).mockResolvedValueOnce(friend);
      (mockRepo.getById as jest.Mock).mockResolvedValueOnce(User);
      const mockReq = {
        body: { id: 'test', validatedId: 'test' },
      } as unknown as Request;
      const mockResponse = {
        json: jest.fn(),
      } as unknown as Response;

      await mockUserMongoController.addFriends(mockReq, mockResponse, mockNext);
      expect(mockRepo.getById).toHaveBeenCalled();
      expect(mockRepo.update).toHaveBeenCalled();
      expect(mockResponse.json).toHaveBeenCalled();
    });
    test('Then if we use addEnemies method with a User who are actually a enemy', async () => {
      const enemy = { id: 'test' };
      const User = {
        id: 'test3',
        enemies: [{ id: 'test' }],
        friends: [{ id: 'test2' }],
      };
      (mockRepo.getById as jest.Mock).mockResolvedValueOnce(enemy);
      (mockRepo.getById as jest.Mock).mockResolvedValueOnce(User);
      const mockReq = {
        body: { id: 'test', validatedId: 'test3' },
      } as unknown as Request;
      const mockResponse = {
        json: jest.fn(),
        status: Number,
      } as unknown as Response;

      await mockUserMongoController.addEnemies(mockReq, mockResponse, mockNext);
      expect(mockRepo.getById).toHaveBeenCalled();
    });
    test('Then if we use addEnemies method with a User who are not actually a friend', async () => {
      Auth.hash = await jest.fn().mockReturnValue('hash');
      const enemy = { id: 'test1' };
      const User = {
        friends: [{ id: 'test' }],
        enemies: [{ id: 'test2' }],
      };
      (mockRepo.getById as jest.Mock).mockResolvedValueOnce(enemy);
      (mockRepo.getById as jest.Mock).mockResolvedValueOnce(User);
      const mockReq = {
        body: { id: 'test', validatedId: 'test' },
      } as unknown as Request;
      const mockResponse = {
        json: jest.fn(),
        status: Number,
      } as unknown as Response;

      await mockUserMongoController.addEnemies(mockReq, mockResponse, mockNext);
      expect(mockRepo.getById).toHaveBeenCalled();
      expect(mockRepo.update).toHaveBeenCalled();
      expect(mockResponse.json).toHaveBeenCalled();
    });
    test('Then if we use delete method', async () => {
      const mockReq = {
        body: { validateId: '' },
      } as Request;

      const mockResponse = {
        json: jest.fn(),
        status: Number,
      } as unknown as Response;

      await mockUserMongoController.delete(mockReq, mockResponse, mockNext);
      expect(await mockRepo.delete).toHaveBeenCalled();
      expect(mockResponse.json).toHaveBeenCalledWith({});
    });
  });
  describe('When are errors', () => {
    const mockNext = jest.fn() as NextFunction;

    const mockRepo: Repository<User> = {
      create: jest.fn().mockRejectedValue(new Error('Create Error')),
      getAll: jest.fn().mockRejectedValue(new Error('GetAll Error')),
      getById: jest.fn().mockRejectedValue(new Error('GetById Error')),
      search: jest.fn().mockRejectedValue(new Error('Search Error')),
      update: jest.fn().mockRejectedValue(new Error('Update Error')),
      delete: jest.fn().mockRejectedValue(new Error('Delete Error')),
    };
    const mockUserMongoController = new UserMongoController(mockRepo);
    test('Then if we use register, next should called with error', async () => {
      const mockReq = {
        body: {
          password: 'test',
        },
      } as Request;
      const mockResponse = {
        status: Number,
        json: jest.fn(),
      } as unknown as Response;

      await mockUserMongoController.register(mockReq, mockResponse, mockNext);
      expect(mockNext).toHaveBeenCalledWith(new Error('Create Error'));
    });

    test('Then if we use login method,next should called with error', async () => {
      Auth.compare = await jest.fn().mockReturnValue(true);
      Auth.signJWT = await jest.fn().mockResolvedValue('testToken');

      const mockReq = {
        body: {
          userName: 'test',
          password: 'test',
        },
      } as Request;
      const mockResponse = {
        json: jest.fn(),
      } as unknown as Response;

      await mockUserMongoController.login(mockReq, mockResponse, mockNext);
      expect(mockNext).toHaveBeenCalledWith(new Error('Create Error'));
    });
    test('Then if we use getAll method,next should called with error', async () => {
      const mockReq = {} as Request;
      const mockResponse = {} as unknown as Response;

      await mockUserMongoController.getAll(mockReq, mockResponse, mockNext);
      expect(mockNext).toHaveBeenCalledWith(new Error('GetAll Error'));
    });
    test('Then if we use getById method,next should called with error', async () => {
      const mockReq = { params: { id: 'tets' } } as unknown as Request;
      const mockResponse = {} as unknown as Response;

      await mockUserMongoController.getById(mockReq, mockResponse, mockNext);

      expect(mockNext).toHaveBeenCalledWith(new Error('GetById Error'));
    });
    test('Then if we use update method,next should called with error', async () => {
      const mockReq = {
        body: { password: 'test', validatedId: 'test' },
      } as unknown as Request;
      const mockResponse = {} as unknown as Response;

      await mockUserMongoController.update(mockReq, mockResponse, mockNext);

      expect(mockNext).toHaveBeenCalledWith(new Error('Update Error'));
    });
    test('Then if we use addFriends method,next should called with error', async () => {
      const mockReq = {
        body: { id: 'test' },
      } as unknown as Request;
      const mockResponse = {} as unknown as Response;

      await mockUserMongoController.addFriends(mockReq, mockResponse, mockNext);

      expect(mockNext).toHaveBeenCalledWith(new Error('GetById Error'));
    });
    test('Then if we use addenemies method,next should called with error', async () => {
      const mockReq = {
        body: { id: 'test' },
      } as unknown as Request;
      const mockResponse = {} as unknown as Response;

      await mockUserMongoController.addEnemies(mockReq, mockResponse, mockNext);

      expect(mockNext).toHaveBeenCalledWith(new Error('GetById Error'));
    });
    test('Then if we use delete method,next should called with error', async () => {
      const mockReq = { body: { validatedId: 'test' } } as Request;
      const mockResponse = {} as unknown as Response;

      await mockUserMongoController.delete(mockReq, mockResponse, mockNext);
      expect(mockNext).toHaveBeenCalledWith(new Error('Delete Error'));
    });
  });
});
