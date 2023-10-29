const { User } = require('../models/user');
const bcrypt = require('bcryptjs');
const { ValidationError } = require('../errors/ValidationError');
const { NotFoundError } = require('../errors/NotFoundError');
const { ConflictError } = require('../errors/ConflictError');
const { InternalError } = require('../errors/InternalError');
const { SECRET_KEY = 'tokenkey' } = process.env;
const { UnauthorizedError } = require('../errors/UnauthorizedError');
const jwt = require('jsonwebtoken');

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  User.findOne({ email })
    .select('+password')
    .orFail(() => new UnauthorizedError('Пользователь с таким email не найден'))
    .then((user) => {
      bcrypt.compare(password, user.password)
        .then((matched) => {
          if (matched) {
            const token = jwt.sign({ _id: user._id }, SECRET_KEY, { expiresIn: '7d' });
            res.cookie('jwt', token, {
              maxAge: 3600000 * 24 * 7,
              httpOnly: true,
            });
            res.send({ token });
          } else {
            throw new UnauthorizedError('Неверный пароль');
          }
        })
        .catch(next);
    })
    .catch(next);
};

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send(users))
    .catch((err) => {
      next(new InternalError('Внутренняя ошибка сервера'));
    });
};

module.exports.getCurrentUser = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь не найден');
      } else {
        next(res.send(user));
      }
    })
    .catch((err) => next(err));
};


module.exports.getUser = (req, res, next) => {
  User.findById(req.params.userId)
    .orFail(() => new NotFoundError('Пользователь не найден'))
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new ValidationError('Переданные данные некорректны'));
      }
      else if (err.message === 'NotFoundError') {
        next(new NotFoundError('Пользователь не найден'));
      }
      else {
        next(new InternalError('Внутренняя ошибка сервера'));
      }
    });
};

module.exports.createUser = (req, res, next) => {
  const {
    email, password, name, about, avatar,
  } = req.body;
  bcrypt.hash(password, 10)
    .then((hashPassword) => User.create({
      name,
      about,
      avatar,
      email,
      password: hashPassword,
    }))
    .then(() => res.status(201).send({
      name, about, avatar, email,
    }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ValidationError('Переданы данные некорректны'));
      } else if (err.code === 11000) {
        next(new ConflictError('Пользователь с таким e-mail уже зарегистрирован'));
      } else { next(err); }
    });
};

module.exports.updateUserAvatar = (req, res, next) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .orFail(() => new NotFoundError('Пользователь не найден'))
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ValidationError('Переданные данные некорректны'));
      } else if (err.message === 'NotFoundError') {
        next(new ValidationError('Пользователь не найден'));
      } else {
        next(new InternalError('Внутренняя ошибка сервера'));
      }
    });
};

module.exports.updateUserProfile = (req, res, next) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .orFail(() => new NotFoundError('Пользователь не найден'))
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ValidationError('Переданные данные некорректны'));
      } else if (err.message === 'NotFoundError') {
        next(new ValidationError('Пользователь не найден'));
      } else {
        next(new InternalError('Внутренняя ошибка сервера'));
      }
    });
};
