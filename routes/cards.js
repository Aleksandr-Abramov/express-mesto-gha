const routerCards = require("express").Router();
const { celebrate, Joi } = require("celebrate");
const auth = require("../middlewares/auth");

const {
  createCard,
  getCards,
  deleteCard,
  setLike,
  deliteLike,
} = require("../controllers/cards");

routerCards.get("/cards", auth, getCards);
routerCards.post("/cards", auth, celebrate({
  body: Joi.object().keys({
    name: Joi
      .string()
      .alphanum()
      .max(30)
      .min(2)
      .required(),
    link: Joi
      .string()
      .pattern(/https?:\/\/(w{3})?[a-z0-9-]+\.[a-z0-9\S]{2,}/)
      .required(),
  }),
}), createCard);
routerCards.delete("/cards/:cardId", auth, celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().alphanum().length(24),
  }),
}), deleteCard);
routerCards.put("/cards/:cardId/likes", auth, celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().alphanum().length(24),
  }),
}), setLike);
routerCards.delete("/cards/:cardId/likes", auth, celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().alphanum().length(24),
  }),
}), deliteLike);
module.exports = routerCards;
