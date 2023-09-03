import cors from 'cors';
import createDebug from 'debug';
import express, { NextFunction, Request, Response } from 'express';
import morgan from 'morgan';
import { httpErrorMiddleware } from './middlewares/http.error.middleware.js';
import { userRouter } from './router/user.router.js';
import { HttpError } from './types/http.error.type.js';

const debug = createDebug('W6E:App');
export const app = express();

debug('Started');

app.use(morgan('dev'));
app.use(cors());

app.use(express.json());
app.use(express.static('public'));

app.use('/socialnet', userRouter);
app.use('/:id', (req: Request, res: Response, next: NextFunction) => {
  const error = new HttpError(418, "I'm a teapot", 'Invalid route');
  next(error);
});

app.use(httpErrorMiddleware);
