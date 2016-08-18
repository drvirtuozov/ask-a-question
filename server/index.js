import path from 'path';
import express from 'express';
import favicon from 'serve-favicon';
import logger from 'morgan';
import bodyParser from 'body-parser';
import webpack from 'webpack';
import webpackMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';
import webpackConfig from '../webpack.config.dev';
import users from './routes/api/users';
import auth from './routes/api/auth';
import questions from './routes/api/questions';
import likes from './routes/api/likes';
import HttpError from './errors/http';
import './db';

const compiler = webpack(webpackConfig); 
const app = express();

//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());

app.use(webpackMiddleware(compiler, {
  hot: true,
  publicPath: webpackConfig.output.publicPath,
  noInfo: true
}));
app.use(webpackHotMiddleware(compiler));

app.use('/api/auth', auth);
app.use('/api/users', users);
app.use('/api/questions', questions);
app.use('/api/likes', likes);
app.use((err, req, res, next) => {
  if (err.name === 'UnauthorizedError') {
    let err = new HttpError(401, 'Invalid token');
    res.status(err.status).json(err.json);
  }
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(process.env.PORT, () => {
  console.log('Server listening on localhost:' + process.env.PORT);
});
