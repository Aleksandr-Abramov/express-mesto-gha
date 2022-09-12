const Cards = require("../models/card");
const {
  HTTP200OK,
  SERVER500ERR,
  NOT404FOUND,
  BAD400REQUEST,
} = require("../utils/constants");

const getCards = async (req, res) => {
  try {
    const cards = await Cards.find({});
    res.status(HTTP200OK).send(cards);
  } catch (err) {
    res.status(SERVER500ERR).send({ message: "Произошла ошибка на сервере" });
  }
};

const createCard = async (req, res) => {
  try {
    const owner = req.user._id;
    const { name, link } = req.body;
    const card = await Cards.create({ name, link, owner });
    res.status(HTTP200OK).send(card);
  } catch (err) {
    if (err.name === "ValidationError") {
      res.status(BAD400REQUEST).send({ message: "Переданны некорректные данные" });
      return;
    }
    res.status(SERVER500ERR).send({ message: "Произошла ошибка на сервере" });
  }
};

const deleteCard = async (req, res) => {
  try {
    const { cardId } = req.params;
    const delCard = await Cards.findByIdAndRemove(cardId);
    if (!delCard) {
      res.status(NOT404FOUND).send({ message: `Карточка с указанным _id${cardId} не найдена.` });
      return;
    }
    res.status(HTTP200OK).send(delCard);
  } catch (err) {
    if (err.name === "CastError") {
      res.status(BAD400REQUEST).send({ message: "Переданны некорректные данные" });
      return;
    }
    res.status(SERVER500ERR).send({ message: "Произошла ошибка на сервере" });
  }
};

const setLike = async (req, res) => {
  try {
    const { cardId } = req.params;
    const userId = req.user._id;
    const addLike = await Cards.findByIdAndUpdate(
      { _id: cardId },
      { $addToSet: { likes: userId } },
      { new: true },
    );
    if (!addLike) {
      res.status(NOT404FOUND).send({ message: `Передан несуществующий _id ${cardId} карточки.` });
      return;
    }
    res.status(HTTP200OK).send(addLike);
  } catch (err) {
    if (err.kind === "ObjectId") {
      res.status(BAD400REQUEST).send({ message: "Переданы несуществующий данные" });
      return;
    }
    res.status(SERVER500ERR).send({ message: "Произошла ошибка на сервере" });
  }
};

const deliteLike = async (req, res) => {
  try {
    const { cardId } = req.params;
    const userId = req.user._id;
    const delLike = await Cards.findByIdAndUpdate(
      { _id: cardId },
      { $pull: { likes: userId } },
      { new: true },
    );
    if (!delLike) {
      res.status(NOT404FOUND).send({ message: `Передан несуществующий _id ${cardId} карточки.` });
      return;
    }
    res.status(HTTP200OK).send(delLike);
  } catch (err) {
    if (err.kind === "ObjectId") {
      res.status(BAD400REQUEST).send({ message: "Переданы несуществующий данные" });
      return;
    }
    res.status(SERVER500ERR).send({ message: "Произошла ошибка на сервере" });
  }
};

module.exports = {
  createCard,
  getCards,
  deleteCard,
  setLike,
  deliteLike,
};
