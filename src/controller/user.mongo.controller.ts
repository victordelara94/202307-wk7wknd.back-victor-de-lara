/* eslint-disable no-unused-vars */
import createDebug from 'debug';
import { NextFunction, Request, Response } from 'express';
import { User } from '../entities/user';
import { Repository } from '../repository/repository';
import { Auth } from '../services/auth';
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

    // Login(){

    // }
    // getAll();
    // getById();
    // update();
    // delete();
  }
}
