const { createServer } = require('http');
const express = require('express');
const logger = require('morgan');
const HttpError = require('./errors/http');
const graphql = require('./middlewares/graphql');
const { optionalAuth } = require('./middlewares/auth');
const config = require('./config');
const { createSocketServer } = require('./socket');
require('./relations');


const app = express();
const server = createServer(app);
const io = createSocketServer(server);

app.use(logger('dev'));
app.use('/api', optionalAuth, graphql);

app.use((err, req, res, next) => {
  const e = new HttpError(500);
  res.status(e.status).json(e.json);
  next();
});

server.listen(config.PORT, () => {
  console.log(`Server listening on localhost:${config.PORT}`);
});
