import createDebug from 'debug';
import { NextFunction, Request, Response } from 'express';
import multer from 'multer';
const debug = createDebug('SN:Files');
export class FilesInterceptor {
  constructor() {
    debug('Instantiate');
  }

  singleFileStore(fileName: string) {
    debug('singleFileStore');
    const storage = multer.diskStorage({
      destination: './uploads',
      filename(_req, file, callback) {
        callback(null, file.originalname);
      },
    });
    const upload = multer({ storage });
    const middleware = upload.single(fileName);
    return (req: Request, res: Response, next: NextFunction) => {
      const prevBody = req.body; // Body con validatedId
      middleware(req, res, next); // Devuelve un body sin validadetId
      req.body = { ...prevBody, ...req.body }; // Le añades de neuvo el valdiatedId
      // req.body.validatedId = prevBody.validatedId;
    };
  }
}
