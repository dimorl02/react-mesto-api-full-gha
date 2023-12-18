const jwt = require('jsonwebtoken');
const AuthError = require('../errors/AuthError');
const {
  NODE_ENV,
  SECRET_SERVER_KEY,
  SECRET_KEY_DEV,
} = require('../utils/constants');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  const bearer = 'Bearer ';
  if (!authorization || !authorization.startsWith(bearer)) {
    return next(new AuthError('Неправильная почта или пароль'));
  }
  const token = authorization.replace(bearer, '');
  let payload;

  try {
    payload = jwt.verify(
      token,
      NODE_ENV === 'production' ? SECRET_SERVER_KEY : SECRET_KEY_DEV,
    );
  } catch (err) {
    return next(new AuthError('Неправильная почта или пароль'));
  }
  req.user = payload;

  return next();
};
