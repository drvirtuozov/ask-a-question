import express from 'express';
import logger from 'morgan';
import HttpError from './errors/http';
import graphql from './middlewares/graphql';
import { optionalAuth } from './middlewares/auth';
import config from './config';
import './relations';


const app = express();

app.use(logger('dev'));
app.use('/api', optionalAuth, graphql);

app.use((err, req, res, next) => {
  let e = new HttpError(500);
  res.status(e.status).json(e.json);
});

app.listen(config.PORT, () => {
  console.log(`Server listening on localhost:${config.PORT}`);
});
