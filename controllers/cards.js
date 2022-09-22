const Cards = require("../models/card");
const Bad400Request = require("../utils/errors/Bad400Request");
const Not404Found = require("../utils/errors/Not404Found");
const Server500Err = require("../utils/errors/Server500Err");
const Forbidden403 = require("../utils/errors/Forbidden403");

const getCards = async (req, res, next) => {
  try {
    const cards = await Cards.find({});
    res.send(cards);
  } catch (err) {
    next(new Server500Err("Произошла ошибка на сервере"));
  }
};

const createCard = async (req, res, next) => {
  try {
    const owner = req.user._id;
    const { name, link } = req.body;
    const card = await Cards.create({ name, link, owner });
    res.send(card);
  } catch (err) {
    if (err.name === "ValidationError") {
      next(new Bad400Request("Переданны некорректные данные"));
      return;
    }
    next(new Server500Err("Произошла ошибка на сервере"));
  }
};

const deleteCard = async (req, res, next) => {
  try {
    const { cardId } = req.params;
    const { _id } = req.user;
    const card = await Cards.findById(cardId);
    if (!card) {
      next(new Not404Found(`Карточка с указанным _id${cardId} не найдена`));
      return;
    }
    if (_id !== String(card.owner._id)) {
      next(new Forbidden403("Вы не можите удалять не свою карточку"));
      return;
    }
    const delCard = await Cards.findByIdAndRemove(cardId);
    res.send(delCard);
  } catch (err) {
    if (err.name === "CastError") {
      next(new Bad400Request("Переданны некорректные данные"));
      return;
    }
    next(new Server500Err("Произошла ошибка на сервере"));
  }
};

const setLike = async (req, res, next) => {
  try {
    const { cardId } = req.params;
    const userId = req.user._id;
    const addLike = await Cards.findByIdAndUpdate(
      { _id: cardId },
      { $addToSet: { likes: userId } },
      { new: true },
    );
    if (!addLike) {
      next(new Not404Found(`Передан несуществующий _id ${cardId} карточки.`));
      return;
    }
    res.send(addLike);
  } catch (err) {
    if (err.kind === "ObjectId") {
      next(new Bad400Request("Переданы несуществующий данные"));
      return;
    }
    next(new Server500Err("Произошла ошибка на сервере"));
  }
};

const deliteLike = async (req, res, next) => {
  try {
    const { cardId } = req.params;
    const userId = req.user._id;
    const delLike = await Cards.findByIdAndUpdate(
      { _id: cardId },
      { $pull: { likes: userId } },
      { new: true },
    );
    if (!delLike) {
      next(new Not404Found(`Передан несуществующий _id ${cardId} карточки.`));
      return;
    }
    res.send(delLike);
  } catch (err) {
    if (err.kind === "ObjectId") {
      next(new Bad400Request("Переданы несуществующие данные"));
      return;
    }
    next(new Server500Err("Произошла ошибка на сервере"));
  }
};

module.exports = {
  createCard,
  getCards,
  deleteCard,
  setLike,
  deliteLike,
};
