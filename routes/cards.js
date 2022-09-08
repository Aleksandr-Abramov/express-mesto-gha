const routerCards = require("express").Router();
const express = require("express");

const {
  createCard,
  getCards,
  deleteCard,
  setLike,
  deliteLike,
} = require("../controllers/cards");

// routerCards.get("/", express.json(), (req, res) => {
//   res.send(console.log("dsadsa"));
// });
routerCards.get("/cards", getCards);
routerCards.post("/cards", express.json(), createCard);
routerCards.delete("/cards/:cardId", deleteCard);
routerCards.put("/cards/:cardId/likes", setLike);
routerCards.delete("/cards/:cardId/likes", deliteLike);

module.exports = routerCards;
