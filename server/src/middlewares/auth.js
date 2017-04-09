const expressJwt = require('express-jwt');
const config = require('../config');


function getToken(req) {
  if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
    const token = req.headers.authorization.split(' ')[1];
    req.user = req.user || {};
    req.user.token = token;
    return token;
  }

  return null;
}

const auth = expressJwt({
  secret: config.jwtSecret,
  getToken,
});

const optionalAuth = expressJwt({
  secret: config.jwtSecret,
  credentialsRequired: false,
  getToken,
});

module.exports = {
  auth,
  optionalAuth,
};
