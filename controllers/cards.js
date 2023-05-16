const Card = require("../models/card");
const handleCardError = require("../middlewares/errors");
const BadReqErr = require("../errors/BadReqErr");
const NotFoundErr = require("../errors/notFoundErr");
const ForbiddenErr = require("../errors/ForbiddenErr");

const getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => {
      res.send({ data: cards });
    })
    .catch((err) => {
      if (err.name === "DocumentNotFoundError") {
        next(new NotFoundErr("Карточки не найдены"));
      } else {
        next(err);
      }
    });
};

const createCard = (req, res, next) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => {
      res.status(201).send({ data: card });
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        next(new BadReqErr("Переданы некорректные данные карточки"));
      } else {
        next(err);
      }
    });
};

const deleteCard = (req, res, next) => {
  Card.findById(req.params.cardId)
    .orFail()
    .then((card) => {
      if (req.user._id === card.owner.toString()) {
        res.send({ data: card });
        card.deleteOne(req.params.cardId);
      } else {
        throw new ForbiddenErr("Доступ к запрошенному ресурсу запрещен");
      }
    })
    .catch((err) => {
      handleCardError(err, res);
    });
};

const likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  )
    .orFail()
    .then((like) => {
      res.send({ data: like });
    })
    .catch((err) => {
      if (err.name === "CastError") {
        next(new BadReqErr("Переданы некорректные данные карточки"));
      } else {
        next(err);
      }
    });
};

const dislikeCards = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true }
  )
    .orFail()
    .then((dislike) => {
      res.send({ data: dislike });
    })
    .catch((err) => {
      if (err.name === "CastError") {
        next(new BadReqErr("Переданы некорректные данные карточки"));
      } else {
        next(err);
      }
    });
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCards,
};
