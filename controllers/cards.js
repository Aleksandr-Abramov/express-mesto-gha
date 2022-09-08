const Cards = require("../models/card");

const getCards = (req, res) => {
  Cards.find({})
    .then((cards) => res.send(cards))
    .catch((err) => res.status(404).send({ message: `${err} не смогли запросить карточку` }));
};

const createCard = (req, res) => {
  const owner = req.user._id;
  const { name, link } = req.body;
  Cards.create({ name, link, owner })
    .then((card) => res.send(card))
    .catch((err) => res.status(400).send({ message: `${err} не смагли создать карточку` }));
};

const deleteCard = (req, res) => {
  const { cardId } = req.params;
  Cards.findByIdAndRemove(cardId)
    .then((card) => res.send(card))
    .catch((err) => res.status(404).send({ message: `${err} не смагли удалить карточку` }));
};

const setLike = (req, res) => {
  const { cardId } = req.params;
  const userId = req.user._id;
  Cards.findByIdAndUpdate({ _id: cardId }, { $addToSet: { likes: userId } }, { new: true })
    .then((likes) => res.send(likes))
    .catch((err) => res.status(404).send({ message: `${err} добавить лайк не удалось` }));
};

const deliteLike = (req, res) => {
  const { cardId } = req.params;
  const userId = req.user._id;
  Cards.findByIdAndUpdate({ _id: cardId }, { $pull: { likes: userId } }, { new: true })
    .then((likes) => res.send(likes))
    .catch((err) => res.status(404).send({ message: `${err} добавить лайк не удалось` }));
};

module.exports = {
  createCard,
  getCards,
  deleteCard,
  setLike,
  deliteLike,
};
