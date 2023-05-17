/* eslint-disable func-names */
/* eslint-disable no-else-return */
const validator = require("validator");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const UnauthErr = require("../errors/UnauthErr");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      minlength: [2, "Минимальная длина поля 'name' - 2"],
      maxlength: [30, "Максимальная длина поля 'name' - 30"],
      default: "Жак-Ив Кусто",
    },
    about: {
      type: String,
      minlength: [2, "Минимальная длина поля 'name' - 2"],
      maxlength: [30, "Максимальная длина поля 'name' - 30"],
      default: "Исследователь",
    },
    avatar: {
      type: String,
      default:
        "https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png",
      validate: {
        // validator: (v) => validator.isURL(v),
        // eslint-disable-next-line object-shorthand
        validator: function (v) {
          return /https*:\/\/[w{3}.]?[\S]+#?\.[\S]+/i.test(v);
        },
        message: "Некорректный URL",
      },
    },
    email: {
      type: String,
      required: [true, "Поле 'email' должно быть заполнено"],
      unique: true,
      validate: {
        validator: (v) => validator.isEmail(v),
        message: "Некорректный email",
      },
    },
    password: {
      type: String,
      required: [true, "Поле 'password' должно быть заполнено"],
      select: false,
    },
  },
  { versionKey: false },
);

userSchema.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email })
    .select("+password")
    .then((user) => {
      if (!user) {
        return Promise.reject(new UnauthErr("Неправильные почта или пароль"));
      } else {
        return bcrypt.compare(password, user.password).then((matched) => {
          if (!matched) {
            return Promise.reject(
              new UnauthErr("Неправильные почта или пароль"),
            );
          // eslint-disable-next-line no-else-return
          } else {
            return user;
          }
        });
      }
    });
};
module.exports = mongoose.model("user", userSchema);
