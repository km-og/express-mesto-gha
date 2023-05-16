const cardsRouter = require("express").Router();

const {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCards,
} = require("../controllers/cards");
const {
  createCardValidation,
  cardValidation,
} = require("../middlewares/validation");

cardsRouter.get("/", getCards);
cardsRouter.post("/", createCardValidation, createCard);
cardsRouter.delete("/:cardId", cardValidation, deleteCard);
cardsRouter.put("/:cardId/likes", cardValidation, likeCard);
cardsRouter.delete("/:cardId/likes", cardValidation, dislikeCards);

module.exports = cardsRouter;
