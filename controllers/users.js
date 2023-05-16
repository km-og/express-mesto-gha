const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { NODE_ENV, JWT_SECRET } = process.env;

const BadReqErr = require("../errors/BadReqErr");
const ConflictErr = require("../errors/ConflictErr");
const NotFoundErr = require("../errors/NotFoundErr");

const getUsers = (req, res, next) => {
  User.find({})
    .then((users) => {
      res.send({ data: users });
    })
    .catch((err) => {
      next(err);
    });
};

const getUserById = (req, res, next) => {
  User.findById(req.params.userId)
    .orFail()
    .then((user) => {
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === "DocumentNotFoundError") {
        next(new NotFoundErr("Пользователь с указанным _id не найден"));
      } else {
        next(err);
      }
    });
};

const createUser = (req, res, next) => {
  const { name, about, avatar, email, password } = req.body;
  bcrypt
    .hash(password, 10)
    .then((hash) =>
      User.create({ name, about, avatar, email, password: hash })
        .then((user) => {
          res.status(201).send({ data: name, about, avatar, email });
        })
        .catch((err) => {
          if (err.name === "ValidationError") {
            next(new BadReqErr("Переданы некорректные данные пользователя"));
          }
          if (err.name === "Unauthorized" || err.code === 11000) {
            next(new ConflictErr("Пользователь с таким email уже существует"));
          } else {
            next(err);
          }
        })
    )
    .catch((err) => {
      next(err);
    });
};

const updateProfile = (req, res, next) => {
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
      if (err.name === "ValidationError" || err.name === "CastError") {
        next(new BadReqErr("Переданы некорректные данные пользователя"));
      } else {
        next(err);
      }
    });
};

const updateAvatar = (req, res, next) => {
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
      if (err.name === "ValidationError" || err.name === "CastError") {
        next(new BadReqErr("Переданы некорректные данные пользователя"));
      } else {
        next(err);
      }
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === "production"
          ? JWT_SECRET
          : "a5b861a3d23e39525138d34dcfa6288856578fdbccefbb36e9acbf1c7889d908",
        {
          expiresIn: "7d",
        }
      );
      res.send({ token });
      // res.cookie("jwt", token, {
      //   httpOnly: true,
      // });
    })
    .catch((err) => {
      next(err);
    });
};

const getUserInfo = (req, res, next) => {
  User.findById(req.user._id)
    .orFail()
    .then((user) => {
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === "DocumentNotFoundError") {
        next(new NotFoundErr("Пользователь с указанным _id не найден"));
      } else {
        next(err);
      }
    });
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateProfile,
  updateAvatar,
  login,
  getUserInfo,
};
