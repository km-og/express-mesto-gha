const cardsRouter = require("express").Router();

const {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCards,
} = require("../controllers/cards");

cardsRouter.get("/", getCards);
cardsRouter.post("/", createCard);
cardsRouter.delete("/:cardId", deleteCard);
cardsRouter.put("/:cardId/likes", likeCard);
cardsRouter.delete("/:cardId/likes", dislikeCards);

module.exports = cardsRouter;
