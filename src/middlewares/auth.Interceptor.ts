import createDebug from 'debug';
import { NextFunction, Request, Response } from 'express';
import { Auth } from '../services/auth';
import { HttpError } from '../types/http.error.type';
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
      next();
    } catch (error) {
      next(error);
    }
  }
}
