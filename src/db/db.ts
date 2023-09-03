import createDebug from 'debug';
import mongoose from 'mongoose';
const debug = createDebug('SN:db');
export const dbConnect = () => {
  const uri = `mongodb+srv://vdelaraafd:iXVs18X6h5rnfJZ6@cluster0.wyzrngt.mongodb.net/?retryWrites=true&w=majority`;
  debug('db');
  return mongoose.connect(uri);
};
