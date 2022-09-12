const routerCards = require("express").Router();

const {
  createCard,
  getCards,
  deleteCard,
  setLike,
  deliteLike,
} = require("../controllers/cards");

routerCards.get("/cards", getCards);
routerCards.post("/cards", createCard);
routerCards.delete("/cards/:cardId", deleteCard);
routerCards.put("/cards/:cardId/likes", setLike);
routerCards.delete("/cards/:cardId/likes", deliteLike);

module.exports = routerCards;
