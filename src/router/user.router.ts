import createDebug from 'debug';
import { Router as createRouter } from 'express';
import { UserMongoController } from '../controller/user.mongo.controller.js';
import { AuthInterceptor } from '../middlewares/auth.Interceptor.js';
import { UserMongoRepository } from '../repository/user.mongo.repository.js';

const debug = createDebug('SN:Router:UsersRouter');
const userInterceptor = new AuthInterceptor();
export const userRouter = createRouter();
const repo = new UserMongoRepository();
debug('Loaded');
const userController = new UserMongoController(repo);
userRouter.get(
  '/',
  userInterceptor.authorizate.bind(userInterceptor),
  userController.getAll.bind(userController)
);
userRouter.get(
  '/:id',
  userInterceptor.authorizate.bind(userInterceptor),
  userController.getById.bind(userController)
);

userRouter.post('/register', userController.register.bind(userController));

userRouter.patch('/login', userController.login.bind(userController));

userRouter.patch(
  '/profile',
  userInterceptor.authorizate.bind(userInterceptor),
  userInterceptor.authentication.bind(userInterceptor),
  userController.update.bind(userController)
);
userRouter.patch(
  '/friends',
  userInterceptor.authorizate.bind(userInterceptor),
  userInterceptor.authentication.bind(userInterceptor),
  userController.addPeopleWhoLike.bind(userController)
);
userRouter.patch(
  '/enemies',
  userInterceptor.authorizate.bind(userInterceptor),
  userInterceptor.authentication.bind(userInterceptor),
  userController.addPeopleWhoHate.bind(userController)
);

userRouter.delete(
  '/profile',
  userInterceptor.authorizate.bind(userInterceptor),
  userInterceptor.authentication.bind(userInterceptor),
  userController.delete.bind(userController)
);
