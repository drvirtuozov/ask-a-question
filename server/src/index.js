import express from 'express';
import logger from 'morgan';
import bodyParser from 'body-parser';
import HttpError from './errors/http';
import db from './db';
import graphql from './middlewares/graphql';
import { optionalAuth } from './middlewares/auth';
import config from './config';


const app = express();

app.use(logger('dev'));
app.use(bodyParser.json());
app.use('/graphql', graphql);

app.use((err, req, res, next) => {
  if (err.name === 'UnauthorizedError') {
    let err = new HttpError(401, 'Invalid token');
    res.status(err.status).json(err.json);
  }
});

app.listen(config.PORT, () => {
  console.log('Server listening on localhost:' + config.PORT);
});
