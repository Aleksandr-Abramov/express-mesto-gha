const routerCards = require("express").Router();
const express = require("express");

const {
  createCard,
  getCards,
  deleteCard,
  setLike,
  deliteLike,
  page404,
} = require("../controllers/cards");

routerCards.get("/cards", getCards);
routerCards.post("/cards", express.json(), createCard);
routerCards.delete("/cards/:cardId", deleteCard);
routerCards.put("/cards/:cardId/likes", setLike);
routerCards.delete("/cards/:cardId/likes", deliteLike);
routerCards.patch("/404", page404);

module.exports = routerCards;
