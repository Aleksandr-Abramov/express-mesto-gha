const User = require("../models/user");

const getUsers = async (req, res) => {
  try {
    const users = await User.find({});
    res.status(200).send(users);
  } catch (err) {
    res.status(500).send({ message: "произошла ошибка на сервере" });
  }
};

const getUserById = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById({ _id: userId });
    if (!user) {
      res.status(404).send({ message: `Пользователь по указанному _id${userId} не найден.` });
      return;
    }
    res.status(200).send(user);
  } catch (err) {
    if (err.kind === "ObjectId") {
      res.status(404).send({ message: "данные не корректны", ...err });
      return;
    }
    res.status(500).send({ message: "произошла ошибка на сервере" });
  }
};

const createUser = async (req, res) => {
  try {
    const { name, about, avatar } = await req.body;
    const user = await User.create({ name, about, avatar });
    res.status(200).send(user);
  } catch (err) {
    if (err.name === "ValidationError") {
      res
        .status(400)
        .send({ message: "Не удалось создать пользователя, данные не корректны", ...err });
      return;
    }
    res.status(500).send({ message: "произошла ошибка на сервере" });
  }
};

const changeUser = async (req, res) => {
  const { name, about } = req.body;
  const id = req.user._id;

  try {
    if (!id) {
      res.status(404).send({ message: `Пользователь по указанному _id ${id} не найден.` });
      return;
    }
    if (!name && about) {
      res.status(400).send({ message: "Необходимо заполнить оба поля" });
      return;
    }
    const user = await User.findByIdAndUpdate(
      { _id: id },
      { name: name, about: about },
      { new: true, runValidators: true },
    );
    res.status(200).send(user);
  } catch (err) {
    if (err) {
      res
        .status(400)
        .send({ message: "Переданы некорректные данные при обновлении профиля.", ...err });
      return;
    }
    res.status(500).send({ message: "произошла ошибка на сервере" });
  }
};

const changeAvatar = async (req, res) => {
  try {
    const { avatar } = req.body;
    const id = req.params;

    if (!id) {
      res.status(404).send({ message: `Пользователь по указанному _id${id} не найден.` });
    }
    const avtarData = await User.findByIdAndUpdate(
      { _id: id },
      { avatar: avatar },
      { new: true, runValidators: true },
    );
    res.status(200).send(avtarData);
  } catch (err) {
    if (err) {
      res
        .status(400)
        .send({ message: "Переданы некорректные данные при обновлении аватара.", ...err });
    }
    res.status(500).send({ message: "произошла ошибка на сервере" });
  }
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  changeUser,
  changeAvatar,
};
