import createDebug from 'debug';
import { NextFunction, Request, Response } from 'express';
import { UserMongoRepository } from '../repository/user.mongo.repository.js';
import { Auth } from '../services/auth.js';
import { HttpError } from '../types/http.error.type.js';
const debug = createDebug('SN:Middleware:auth');

debug('Loaded');
export class AuthInterceptor {
  authorizate(req: Request, _res: Response, next: NextFunction) {
    try {
      const token = req.get('Authorization')?.split(' ')[1];
      if (!token)
        throw new HttpError(498, 'Invalid token', 'No token provided');
      const { id } = Auth.verifyJWTGettingPayload(token);
      req.body.validatedId = id;
      debug('authorizate');
      next();
    } catch (error) {
      next(error);
    }
  }

  async authentication(req: Request, _res: Response, next: NextFunction) {
    const userID = req.body.validatedId;

    try {
      const repo = new UserMongoRepository();
      const user = await repo.getById(userID);

      if (user.id !== userID) {
        const error = new HttpError(403, 'Forbidden', 'Not same user');
        next(error);
      }

      next();
    } catch (error) {
      next(error);
    }
  }
}
