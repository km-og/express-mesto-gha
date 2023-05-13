const {
  errBadReq,
  errNotFound,
  errServer,
  errConflict,
  errUnauth,
} = require("../errors/error");

const handleCardError = (err, res) => {
  if (err.name === "ValidationError" || err.name === "CastError") {
    return res.status(errBadReq).send({
      message: "Переданы некорректные данные карточки",
    });
  }
  if (err.name === "DocumentNotFoundError" || err.name === "Error") {
    return res
      .status(errNotFound)
      .send({ message: "Карточка с указанным _id не найден" });
  }
  return res.status(errServer).send({ message: "На сервере произошла ошибка" });
};

const handleUserError = (err, res) => {
  if (err.name === "ValidationError" || err.name === "CastError") {
    return res.status(errBadReq).send({
      message: "Переданы некорректные данные пользователя",
    });
  }
  if (err.name === "DocumentNotFoundError" || err.name === "Error") {
    return res
      .status(errNotFound)
      .send({ message: "Пользователь с указанным _id не найден" });
  }
  if (err.name === "Unauthorized" || err.code === 11000) {
    return res
      .status(errConflict)
      .send({ message: "Пользователь с таким email уже существует" });
  }

  return res.status(errServer).send({ message: "На сервере произошла ошибка" });
};

module.exports = { handleCardError, handleUserError };
