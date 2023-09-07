import createDebug from 'debug';
import { createServer } from 'http';
import { app } from './app.js';

import { dbConnect } from './db/db.js';

const debug = createDebug('SN:index');
const PORT = process.env.PORT || 3000;

const server = createServer(app);
dbConnect()
  .then((mongoose) => {
    server.listen(PORT);
    debug('Connected to DB:', mongoose.connection.db.databaseName);
  })
  .catch((error) => {
    server.emit('error', error);
  });

server.on('listening', () => {
  console.log(`Listening on port ${PORT}`);
});
server.on('error', (error) => {
  console.log(`Error,${error.message} `);
});
