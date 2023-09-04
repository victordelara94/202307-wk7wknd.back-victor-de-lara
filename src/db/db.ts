import createDebug from 'debug';
import mongoose from 'mongoose';
const debug = createDebug('SN:db');
export const dbConnect = () => {
  const user = process.env.DB_USER;
  const password = process.env.DB_PASSWORD;
  const uri = `mongodb+srv://${user}:${password}@cluster0.wyzrngt.mongodb.net/?retryWrites=true&w=majority`;
  debug('db');
  return mongoose.connect(uri);
};
