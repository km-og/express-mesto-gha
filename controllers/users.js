const User = require("../models/user");
const { errBadReq, errNotFound, errServer } = require("../errors/error");

const handleUserError = (err, res) => {
  if (err.name === "ValidationError" || err.name === "CastError") {
    return res.status(errBadReq).send({
      message: "Переданы некорректные данные пользователя",
    });
  } else if (err.name === "DocumentNotFoundError" || err.name === "Error") {
    return res
      .status(errNotFound)
      .send({ message: "Пользователь с указанным _id не найден" });
  } else {
    res.status(errServer).send({ message: "На сервере произошла ошибка" });
  }
};

const getUsers = (req, res) => {
  User.find({})
    .then((users) => {
      res.send({ data: users });
    })
    .catch((err) => {
      handleUserError(err, res);
    });
};

const getUserById = (req, res) => {
  User.findById(req.params.userId)
    .orFail()
    .then((user) => {
      res.send({ data: user });
    })
    .catch((err) => {
      handleUserError(err, res);
    });
};

const createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => {
      res.status(201).send({ data: user });
    })
    .catch((err) => {
      handleUserError(err, res);
    });
};

const updateProfile = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    {
      new: true,
      runValidators: true,
    }
  )
    .orFail()
    .then((user) => {
      res.send({ data: user });
    })
    .catch((err) => {
      handleUserError(err, res);
    });
};

const updateAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    {
      new: true,
      runValidators: true,
    }
  )
    .orFail()
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      handleUserError(err, res);
    });
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateProfile,
  updateAvatar,
};
