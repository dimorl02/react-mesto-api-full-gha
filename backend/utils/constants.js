const regExp = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/;
const { NODE_ENV, SECRET_SERVER_KEY } = process.env;

// Секретный ключ для разработки и отладки приложения:
const SECRET_KEY_DEV = 'dev-secret-key';

module.exports = {
  SECRET_SERVER_KEY,
  SECRET_KEY_DEV,
  regExp,
  NODE_ENV,
};
