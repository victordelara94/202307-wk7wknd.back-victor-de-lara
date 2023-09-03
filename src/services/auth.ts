import bcrypt from 'bcrypt';
import createDebug from 'debug';
import jwt from 'jsonwebtoken';
import { HttpError } from '../types/http.error.type.js';
import { TokenPayload } from '../types/token.type.js';
const debug = createDebug('SN:auth');
export class Auth {
  private static secret = 'secret';

  static hash(passwd: string): Promise<string> {
    const saltRounds = 10;
    return bcrypt.hash(passwd, saltRounds);
  }

  static compare(passwd: string, hash: string): Promise<boolean> {
    return bcrypt.compare(passwd, hash);
  }

  static signJWT(payload: TokenPayload): string {
    debug('sign');
    const token = jwt.sign(payload, Auth.secret);
    return token;
  }

  static verifyJWTGettingPayload(token: string): TokenPayload {
    try {
      const result = jwt.verify(token, Auth.secret);

      if (typeof result === 'string') {
        throw new HttpError(498, 'Invalid token', result, {
          cause: 'Not verified user',
        });
      }

      return result as TokenPayload;
    } catch (error) {
      throw new HttpError(498, 'Invalid token', (error as Error).message, {
        cause: 'Not verified user',
      });
    }
  }
}
