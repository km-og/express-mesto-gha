const Card = require("../models/card");
const { errBadReq, errNotFound, errServer } = require("../errors/error");

const handleCardError = (err, res) => {
  if (err.name === "ValidationError" || err.name === "CastError") {
    return res.status(errBadReq).send({
      message: "Переданы некорректные данные карточки",
    });
  } else if (err.name === "DocumentNotFoundError" || err.name === "Error") {
    return res
      .status(errNotFound)
      .send({ message: "Карточка с указанным _id не найден" });
  } else {
    res.status(errServer).send({ message: "На сервере произошла ошибка" });
  }
};

const getCards = (req, res) => {
  Card.find({})
    .then((cards) => {
      res.send({ data: cards });
    })
    .catch((err) => {
      handleCardError(err, res);
    });
};

const createCard = (req, res) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => {
      res.status(201).send({ data: card });
    })
    .catch((err) => {
      handleCardError(err, res);
    });
};

const deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .orFail()
    .then((card) => {
      res.send({ data: card });
    })
    .catch((err) => {
      handleCardError(err, res);
    });
};

const likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  )
    .then((like) => {
      res.send({ data: like });
    })
    .catch((err) => {
      handleCardError(err, res);
    });
};

const dislikeCards = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true }
  )
    .then((dislike) => {
      res.send({ data: dislike });
    })
    .catch((err) => {
      handleCardError(err, res);
    });
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCards,
};
