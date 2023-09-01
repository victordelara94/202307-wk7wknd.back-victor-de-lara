import cors from 'cors';
import createDebug from 'debug';
import express, { Request, Response } from 'express';
import morgan from 'morgan';

const debug = createDebug('W6E:App');
export const app = express();

debug('Started');

app.use(morgan('dev'));
app.use(cors());

app.use(express.json());
app.use(express.static('public'));

app.get('/', (req: Request, res: Response) => {
  res.end();
});
