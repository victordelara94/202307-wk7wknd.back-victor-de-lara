import createDebug from 'debug';
import { createServer } from 'http';
import { dbConnect } from './db/db.js';

const debug = createDebug('SN');
const PORT = process.env.PORT || 3000;

const server = createServer();
dbConnect()
  .then((mongoose) => {
    server.listen(PORT);
    debug('Connected to DB:', mongoose.connection.db.databaseName);
  })
  .catch((error) => {
    server.emit('error', error);
  });
