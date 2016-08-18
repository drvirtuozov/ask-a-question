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
  let auth = req.headers.authorization.split(' ');
    
  if (req.headers.authorization && auth[0] === 'Bearer') {
    let token = auth[1];
    req.user.token = token;
    return token;
  }
}

export default auth;

