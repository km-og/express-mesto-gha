const validator = require("validator");
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Поле 'name' должно быть заполнено"],
      minlength: [2, "Минимальная длина поля 'name' - 2"],
      maxlength: [30, "Максимальная длина поля 'name' - 30"],
    },
    about: {
      type: String,
      minlength: [2, "Минимальная длина поля 'name' - 2"],
      maxlength: [30, "Максимальная длина поля 'name' - 30"],
      required: [true, "Поле 'name' должно быть заполнено"],
    },
    avatar: {
      type: String,
      required: [true, "Поле 'name' должно быть заполнено"],
      validate: {
        validator: (v) => validator.isURL(v),
        message: "Некорректный URL",
      },
    },
  },
  { versionKey: false },
);

module.exports = mongoose.model("user", userSchema);
