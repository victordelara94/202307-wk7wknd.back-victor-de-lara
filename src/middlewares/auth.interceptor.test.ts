import { NextFunction, Request, Response } from 'express';
import { UserMongoRepository } from '../repository/user.mongo.repository';
import { Auth } from '../services/auth';
import { AuthInterceptor } from './auth.interceptor';

describe('Given the class AuthInterceptor', () => {
  const interceptor = new AuthInterceptor();
  describe('When we use authorizate', () => {
    test('Then if all is ok', () => {
      const mockReq = {
        get: jest.fn().mockReturnValue('a b'),
        body: { validatedId: '' },
      } as unknown as Request;
      Auth.verifyJWTGettingPayload = jest.fn().mockReturnValue({ id: '' });
      const mockRes = {} as Response;
      const mockNext = jest.fn();
      interceptor.authorizate(mockReq, mockRes, mockNext);
      expect(mockNext).toHaveBeenCalled();
    });
    test('Then if are errors', () => {
      const mockReq = {
        get: jest.fn().mockReturnValue(undefined),
        body: { validatedId: '' },
      } as unknown as Request;
      Auth.verifyJWTGettingPayload = jest.fn().mockReturnValue({ id: '' });
      const mockRes = {} as Response;
      const mockNext = jest.fn() as NextFunction;
      interceptor.authorizate(mockReq, mockRes, mockNext);
      expect(mockNext).toHaveBeenCalledWith(Error('No token provided'));
    });
    describe('When we use authentication', () => {
      const mockRepo: UserMongoRepository = {
        getById: jest.fn().mockReturnValue({ id: '1' }),
        getAll: jest.fn(),
        create: jest.fn(),
        search: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
      };
      test('Then if all is ok', () => {
        const mockReq = {
          body: { validatedId: '1' },
        } as unknown as Request;

        const mockRes = {} as Response;
        const mockNext = jest.fn() as NextFunction;
        interceptor.authentication(mockReq, mockRes, mockNext);
        expect(mockRepo.getById).toHaveBeenCalled();
        expect(mockNext).toHaveBeenCalled();
      });
      // Test('Then if are errors', () => {
      //   const mockReq = {
      //     get: jest.fn().mockReturnValue(undefined),
      //     body: { validatedId: '' },
      //   } as unknown as Request;
      //   Auth.verifyJWTGettingPayload = jest.fn().mockReturnValue({ id: '' });
      //   const mockRes = {} as Response;
      //   const mockNext = jest.fn();
      //   interceptor.authorizate(mockReq, mockRes, mockNext);
      // });
    });
  });
});
