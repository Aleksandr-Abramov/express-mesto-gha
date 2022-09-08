const User = require("../models/user");

const getUsers = async (req, res) => {
  try {
    const users = await User.find({});
    res.status(200).send(users);
  } catch (err) {
    if (err.kind === "ObjectId") {
      res.status(404).send({ message: `${err} пользователь не найден!` });
      return;
    }
    res.status(500).send({ message: "произошла ошибка на сервере" });
  }
};

const getUserById = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById({ _id: userId });
    res.status(200).send(user);
  } catch (err) {
    if (err.kind === "ObjectId") {
      res.status(404).send({ message: `${err} пользователь не найден!` });
      return;
    }
    res.status(500).send({ message: "произошла ошибка на сервере" });
  }
};

// const createUser = async (req, res) => {
//   try {
//     const { name, about, avatar } = req.body;
//     const user = await User.create({ name, about, avatar });
//     res.status(200).send(user);
//   } catch (err) {

//   }

//   // User.create({ name, about, avatar })
//   //   .then((user) => res.send({ data: user }))
//   //   .catch((err) => res.status(400).send({ message: `${err} не смогли создать пользователя` }));
// };

const changeUser = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate({ _id: req.user._id }, { name: name, about: about }, { new: true })
    .then((userData) => res.send(userData))
    .catch((err) => res.status(400).send({ message: `${err} не смогли обновить профайл` }));
};

const changeAvatar = (req, res) => {
  const { avatar } = req.body;
  const id = req.user._id;
  User.findByIdAndUpdate({ _id: id }, { avatar: avatar }, { new: true })
    .then((newAvatar) => res.send(newAvatar))
    .catch((err) => res.status(400).send({ message: `${err} не смогли обновить поле аватар` }));
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  changeUser,
  changeAvatar,
};
