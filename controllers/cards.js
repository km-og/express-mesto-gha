const Card = require("../models/card");
const handleCardError = require("../middlewares/errors");

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
  console.log(req.user);
  Card.create({ name, link, owner: req.user._id })
    .then((card) => {
      res.status(201).send({ data: card });
    })
    .catch((err) => {
      handleCardError(err, res);
    });
};

const deleteCard = (req, res) => {
  Card.findById(req.params.cardId)
    .orFail()
    .then((card) => {
      if (req.user._id === card.owner.toString()) {
        res.send({ data: card });
        card.deleteOne(req.params.cardId);
      } else {
        const error = new Error("Произошла ошибка");
        throw error;
      }
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
    .orFail()
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
    .orFail()
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
