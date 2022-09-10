const Cards = require("../models/card");

const getCards = async (req, res) => {
  try {
    const cards = await Cards.find({});
    res.status(200).send(cards);
  } catch (err) {
    res.status(500).send({ message: "Произошла ошибка на сервере" });
  }
};

const createCard = async (req, res) => {
  try {
    const owner = req.user._id;
    const { name, link } = req.body;
    const card = await Cards.create({ name, link, owner });
    res.status(200).send(card);
  } catch (err) {
    if (err.name === "ValidationError") {
      res.status(400).send({ message: "Переданны некорректные данные", ...err });
      return;
    }
    res.status(500).send({ message: "Произошла ошибка на сервере" });
  }
};

const deleteCard = async (req, res) => {
  try {
    const { cardId } = req.params;
    const cardTrue = await Cards.findById({ _id: cardId });
    if (!cardTrue) {
      res.status(404).send({ message: `Карточка с указанным _id${cardId} не найдена.` });
      return;
    }
    const delCard = await Cards.findByIdAndRemove(cardTrue);
    // if (!delCard) {
    //   res.status(400).send({ message: `Карточка с указанным _id${cardId} не найдена.` });
    //   return;
    // }
    res.status(200).send(delCard);
  } catch (err) {
    if (err.name === "CastError") {
      res.status(400).send({ message: "Переданны некорректные данные", ...err });
      return;
    }
    res.status(500).send({ message: "Произошла ошибка на сервере" });
  }
};

const setLike = async (req, res) => {
  try {
    const { cardId } = req.params;
    const userId = req.user._id;
    const cardTrue = await Cards.findById({ _id: cardId });
    if (!cardTrue) {
      res.status(404).send({ message: `Передан несуществующий _id ${cardId} карточки.` });
      return;
    }
    const addLike = await Cards.findByIdAndUpdate(
      { _id: cardId },
      { $addToSet: { likes: userId } },
      { new: true },
    );
    res.status(200).send(addLike);
  } catch (err) {
    if (err.kind === "ObjectId") {
      res.status(400).send({ message: "Переданы несуществующий данные", ...err });
      return;
    }
    res.status(500).send({ message: "Произошла ошибка на сервере" });
  }
};

const deliteLike = async (req, res) => {
  try {
    const { cardId } = req.params;
    const userId = req.user._id;
    const cardTrue = await Cards.findById({ _id: cardId });
    if (!cardTrue) {
      res.status(404).send({ message: `Передан несуществующий _id ${cardId} карточки.` });
      return;
    }
    const delLike = await Cards.findByIdAndUpdate(
      { _id: cardId },
      { $pull: { likes: userId } },
      { new: true },
    );
    res.status(200).send(delLike);
  } catch (err) {
    if (err.kind === "ObjectId") {
      res.status(400).send({ message: "Переданы несуществующий данные", ...err });
      return;
    }
    res.status(500).send({ message: "Произошла ошибка на сервере" });
  }
};

const page404 = (req, res) => {
  res.status(404).send({ message: "ошибка 404, страницы не существует" });
};

module.exports = {
  createCard,
  getCards,
  deleteCard,
  setLike,
  deliteLike,
  page404,
};
