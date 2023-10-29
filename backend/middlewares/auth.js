const jwt = require('jsonwebtoken');
const { SECRET_KEY = 'tokenkey' } = process.env;
const { UnauthorizedError } = require('../errors/UnauthorizedError')


const extractBearerToken = (header) => {
  return header.replace('Bearer ', '');
};

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return new UnauthorizedError('Пользователь не авторизован')
  }

  const token = extractBearerToken(authorization);
  let payload;

  try {
    payload = jwt.verify(token, SECRET_KEY);
  } catch (err) {
    throw new UnauthorizedError('Пользователь не авторизован');
  }

  req.user = payload; // записываем пейлоуд в объект запроса

  next(); // пропускаем запрос дальше
};
