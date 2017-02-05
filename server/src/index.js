import path from 'path';
import express from 'express';
import logger from 'morgan';
import bodyParser from 'body-parser';
import HttpError from './errors/http';
import db from './db';
import { findUserById } from './helpers/dbmanager';

const PORT = process.env.PORT || 3001;
const app = express();

app.use(logger('dev'));
app.use(bodyParser.json());

app.use((err, req, res, next) => {
  if (err.name === 'UnauthorizedError') {
    let err = new HttpError(401, 'Invalid token');
    res.status(err.status).json(err.json);
  }
});

app.listen(PORT, () => {
  console.log('Server listening on localhost:' + PORT);
});
