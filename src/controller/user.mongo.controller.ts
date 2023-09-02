/* eslint-disable no-unused-vars */
import createDebug from 'debug';
import { NextFunction, Request, Response } from 'express';
import { User } from '../entities/user';
import { Repository } from '../repository/repository';
import { Auth } from '../services/auth';
import { HttpError } from '../types/http.error.type';
import { TokenPayload } from '../types/token.type';
const debug = createDebug('SN:Controller:UserController');
export class UserMongoController {
  constructor(private repo: Repository<User>) {
    debug('instantiate');
  }

  async register(req: Request, res: Response, next: NextFunction) {
    try {
      req.body.password = await Auth.hash(req.body.password);
      const data = this.repo.create(req.body);
      res.status(201);
      res.json(data);
    } catch (error) {
      next(error);
    }
  }

  async Login(req: Request, res: Response, next: NextFunction) {
    const { userName, password } = req.body;
    const error = new HttpError(401, 'UnAuthorized', 'Login unauthorized');
    try {
      const data = await this.repo.search({ key: 'userName', value: userName });
      if (!data.length) throw error;
      const payload: TokenPayload = {
        userName: data[0].userName,
        id: data[0].id,
      };
      const token = await Auth.signJWT(payload);
      res.json({ user: data[0], token });
    } catch (error) {
      next(error);
    }
  }
  // GetAll();
  // getById();
  // update();
  // delete();
}
