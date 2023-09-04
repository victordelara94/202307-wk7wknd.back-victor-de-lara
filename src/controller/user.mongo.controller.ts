/* eslint-disable no-unused-vars */
import createDebug from 'debug';
import { NextFunction, Request, Response } from 'express';
import { User } from '../entities/user.js';
import { Repository } from '../repository/repository.js';
import { Auth } from '../services/auth.js';
import { HttpError } from '../types/http.error.type.js';
import { TokenPayload } from '../types/token.type.js';
const debug = createDebug('SN:Controller:UserController');
export class UserMongoController {
  constructor(private repo: Repository<User>) {
    debug('instantiate');
  }

  async register(req: Request, res: Response, next: NextFunction) {
    try {
      req.body.password = await Auth.hash(req.body.password);
      const data = await this.repo.create(req.body);
      res.status(201);
      res.json(data);
    } catch (error) {
      next(error);
    }
  }

  async login(req: Request, res: Response, next: NextFunction) {
    const { userName, password } = req.body;
    const error = new HttpError(401, 'UnAuthorized', 'Login unauthorized');
    try {
      debug('presearch');
      const data = await this.repo.search({ key: 'userName', value: userName });

      if (!data.length) throw error;
      if (!(await Auth.compare(password, data[0].password))) {
        throw error;
      }

      const payload: TokenPayload = {
        userName: data[0].userName,
        id: data[0].id,
      };

      const token = await Auth.signJWT(payload);
      res.json({ user: data[0].userName, token });
    } catch (error) {
      next(error);
    }
  }

  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await this.repo.getAll();
      res.json(data);
    } catch (error) {
      next(error);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await this.repo.getById(req.params.id);
      res.json(data);
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      if (req.body.password) {
        req.body.password = await Auth.hash(req.body.password);
      }

      const data = await this.repo.update(req.body.validatedId, req.body);

      res.status(201);
      res.json(data);
    } catch (error) {
      next(error);
    }
  }

  async addFriends(req: Request, res: Response, next: NextFunction) {
    try {
      const friend = await this.repo.getById(req.body.id);

      const user = await this.repo.getById(req.body.validatedId);

      const actualFriend = user.friends.find(
        (item) => (item.id as unknown as Buffer).toString('hex') === friend.id
      );
      if (actualFriend) {
        throw new Error('Friend already on the list');
      }

      user.friends.push(friend);
      user.enemies = user.enemies.filter(
        (item) => (item.id as unknown as Buffer).toString('hex') !== friend.id
      );
      this.repo.update(req.body.validatedId, user);

      res.json(friend);
    } catch (error) {
      next(error);
    }
  }

  async addEnemies(req: Request, res: Response, next: NextFunction) {
    try {
      const enemy = await this.repo.getById(req.body.id);

      const user = await this.repo.getById(req.body.validatedId);

      const actualEnemy = user.enemies.find(
        (item) => (item.id as unknown as Buffer).toString('hex') === enemy.id
      );
      if (actualEnemy) {
        throw new Error('Friend already on the list');
      }

      user.enemies.push(enemy);
      user.friends = user.friends.filter(
        (item) => (item.id as unknown as Buffer).toString('hex') !== enemy.id
      );
      this.repo.update(req.body.validatedId, user);

      res.json(enemy);
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      await this.repo.delete(req.body.validatedId);
      res.status(204);
      res.json({});
    } catch (error) {
      next(error);
    }
  }
}
