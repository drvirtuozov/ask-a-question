import expressJwt from 'express-jwt';
import config from '../config';

export const auth = expressJwt({
  secret: config.jwtSecret,
  getToken
});

export const optionalAuth = expressJwt({
  secret: config.jwtSecret,
  credentialsRequired: false,
  getToken
});

function getToken(req) {
  if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
    let token = req.headers.authorization.split(' ')[1];
    req.user = req.user || {};
    req.user.token = token;
    return token;
  }
  
  return null;
}

export default auth;

