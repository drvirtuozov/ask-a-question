import path from 'path';
import express from 'express';
import logger from 'morgan';
import bodyParser from 'body-parser';
import users from './routes/api/users';
import auth from './routes/api/auth';
import questions from './routes/api/questions';
import answers from './routes/api/answers';
import likes from './routes/api/likes';
import HttpError from './errors/http';
import './db';

const PORT = process.env.PORT || 8080;
const app = express();

app.use(logger('dev'));
app.use(bodyParser.json());
app.use('/api/auth', auth);
app.use('/api/users', users);
app.use('/api/questions', questions);
app.use('/api/answers', answers);
app.use('/api/likes', likes);

app.use((err, req, res, next) => {
  if (err.name === 'UnauthorizedError') {
    let err = new HttpError(401, 'Invalid token');
    res.status(err.status).json(err.json);
  }
});

app.listen(PORT, () => {
  console.log('Server listening on localhost:' + PORT);
});
