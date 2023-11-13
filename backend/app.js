const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const { errors } = require('celebrate');
const errorHandler = require('./middlewares/errorHandler');
const auth  = require('./middlewares/auth');
const { login, createUser } = require('./controllers/users');
const { validateLogin, validateCreateUser } = require('./middlewares/validation');
const { allowedCors, DEFAULT_ALLOWED_METHODS } = require('./utils/constants');


const { NotFoundError } = require('./errors/NotFoundError');
cors = require('cors');

const { PORT = 3000 } = process.env;
const app = express();
app.use((req, res, next) => {
  const { origin } = req.headers; // Сохраняем источник запроса в переменную origin
  // проверяем, что источник запроса есть среди разрешённых
  const { method } = req;
  if (allowedCors.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
    if (method === 'OPTIONS') {
      // разрешаем кросс-доменные запросы любых типов (по умолчанию)
      res.header('Access-Control-Allow-Methods', DEFAULT_ALLOWED_METHODS);
      const requestHeaders = req.headers['access-control-request-headers'];
      res.header('Access-Control-Allow-Headers', requestHeaders);
      return res.end();
    }
  }
  return next();
});
mongoose.connect('mongodb://127.0.0.1:27017/mestodb', {
  useNewUrlParser: true,
}).then(() => console.log('Connected to MongoDB'));
app.use(bodyParser.json());
app.use('/signin', validateLogin, login);
app.use('/signup', validateCreateUser, createUser);
app.use(helmet());

app.use(auth);
app.use('/users', require('./routes/users'));
app.use('/cards', require('./routes/cards'));
app.use(errors());
app.use('*', (req, res, next) => {
  next(new NotFoundError('Данный путь не найден'));
});
app.use(errorHandler);
app.listen(PORT, () => {
  console.log(`App started on port ${PORT}`);
});
