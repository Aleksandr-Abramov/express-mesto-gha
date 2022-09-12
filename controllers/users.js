const User = require("../models/user");
const {
  HTTP200OK,
  SERVER500ERR,
  NOT404FOUND,
  BAD400REQUEST,
} = require("../utils/constants");

const getUsers = async (req, res) => {
  try {
    const users = await User.find({});
    res.status(HTTP200OK).send(users);
  } catch (err) {
    res.status(SERVER500ERR).send({ message: "произошла ошибка на сервере" });
  }
};

const getUserById = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById({ _id: userId });
    if (!user) {
      res.status(NOT404FOUND).send({ message: `Пользователь по указанному _id ${userId} не найден.` });
      return;
    }
    res.status(HTTP200OK).send(user);
  } catch (err) {
    if (err.kind === "ObjectId") {
      res.status(BAD400REQUEST).send({ message: "данные не корректны" });
      return;
    }
    res.status(SERVER500ERR).send({ message: "произошла ошибка на сервере" });
  }
};

const createUser = async (req, res) => {
  try {
    const { name, about, avatar } = await req.body;
    const user = await User.create({ name, about, avatar });
    res.status(HTTP200OK).send(user);
  } catch (err) {
    if (err.name === "ValidationError") {
      res
        .status(400)
        .send({ message: "Не удалось создать пользователя, данные не корректны" });
      return;
    }
    res.status(SERVER500ERR).send({ message: "произошла ошибка на сервере" });
  }
};

const changeUser = async (req, res) => {
  const { name, about } = req.body;
  const id = req.user._id;

  try {
    if (!name || !about) {
      res.status(BAD400REQUEST).send({ message: "Необходимо заполнить оба поля" });
      return;
    }
    const user = await User.findByIdAndUpdate(
      { _id: id },
      { name: name, about: about },
      { new: true, runValidators: true },
    );
    if (!user) {
      res.status(NOT404FOUND).send({ message: `Пользователь по указанному _id ${id} не найден.` });
      return;
    }
    res.status(HTTP200OK).send(user);
  } catch (err) {
    if ((err.name === "ValidationError")) {
      res
        .status(BAD400REQUEST)
        .send({ message: "Переданы некорректные данные при обновлении профиля." });
      return;
    }
    res.status(SERVER500ERR).send({ message: "произошла ошибка на сервере" });
  }
};

const changeAvatar = async (req, res) => {
  const { avatar } = req.body;
  const id = req.user._id;

  try {
    const avtarData = await User.findByIdAndUpdate(
      { _id: id },
      { avatar: avatar },
      { new: true, runValidators: true },
    );
    if (!avtarData) {
      res.status(NOT404FOUND).send({ message: `Пользователь по указанному _id${id} не найден.` });
      return;
    }
    res.status(HTTP200OK).send(avtarData);
  } catch (err) {
    if ((err.name === "ValidationError")) {
      res
        .status(BAD400REQUEST)
        .send({ message: "Переданы некорректные данные при обновлении аватара." });
    }
    res.status(SERVER500ERR).send({ message: "произошла ошибка на сервере" });
  }
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  changeUser,
  changeAvatar,
};
