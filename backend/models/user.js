const mongoose = require('mongoose');
var validator = require('validator');
const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator: validator.isEmail,
      },
    },

    password: {
      type: String,
      required: true,
      select: false,
    },

    name: {
      type: String,
      default: 'Жак-Ив Кусто',
      minlength: 2,
      maxlength: 30,
      required: true,
    },
    about: {
      type: String,
      default: 'Путешественник',
      minlength: 2,
      maxlength: 30,
      required: true,
    },
    avatar: {
      type: String,
      default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
      required: true,
    },
  },
);

const User = mongoose.model('user', userSchema);

module.exports = { User };