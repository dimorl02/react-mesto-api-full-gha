const SUCCESSFULL_ANSWER = 201;
const allowedCors = [
  'localhost:3000',
  'localhost:3001',
  'http://localhost:3000',
  'https://localhost:3000',
  'http://mesto.dimorl02.nomoredomainsrocks.ru',
  'https://mesto.dimorl02.nomoredomainsrocks.ru',
  'http://api.mesto.dimorl02.nomoredomainsrocks.ru',
  'https://api.mesto.dimorl02.nomoredomainsrocks.ru',
];
const DEFAULT_ALLOWED_METHODS = 'GET,HEAD,PUT,PATCH,POST,DELETE';

module.exports = {
  SUCCESSFULL_ANSWER, URL_VALIDATE, allowedCors, DEFAULT_ALLOWED_METHODS,
};