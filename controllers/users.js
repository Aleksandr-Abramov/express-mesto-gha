const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/user");
const Bad400Request = require("../utils/errors/Bad400Request");
const Http409Conflicting = require("../utils/errors/Http409Conflicting");
const Not404Found = require("../utils/errors/Not404Found");
const Server500Err = require("../utils/errors/Server500Err");
const Unauthorized401 = require("../utils/errors/Unauthorized401");

const getUsers = async (req, res, next) => {
  try {
    const users = await User.find({});
    res.send(users);
  } catch (err) {
    next(new Server500Err("произошла ошибка на сервере"));
  }
};

const getUserById = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const user = await User.findById({ _id: userId });
    if (!user) {
      next(new Not404Found(`Пользователь по указанному _id ${userId} не найден.`));
      return;
    }
    res.send(user);
  } catch (err) {
    if (err.kind === "ObjectId") {
      next(new Bad400Request("данные не корректны"));
      return;
    }
    next(new Server500Err("произошла ошибка на сервере"));
  }
};

const createUser = async (req, res, next) => {
  try {
    const {
      name,
      about,
      avatar,
      email,
      password,
    } = await req.body;
    const hashPass = await bcrypt.hash(password, 10);

    const user = await User.create({
      name: name,
      about: about,
      avatar: avatar,
      email: email,
      password: hashPass,
    });
    const resUser = {
      name: user.name,
      about: user.about,
      avatar: user.avatar,
      email: user.email,
    };
    res.send(resUser);
  } catch (err) {
    if (err.name === "ValidationError") {
      next(new Bad400Request("Не удалось создать пользователя, данные не корректны"));
      return;
    }
    if (err.code === 11000) {
      next(new Http409Conflicting("Пользователь с таким email существует"));
      return;
    }
    next(new Server500Err("произошла ошибка на сервере"));
  }
};

const login = async (req, res, next) => {
  try {
    const {
      email,
      password,
    } = req.body;
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      next(new Unauthorized401(`Не удалось найти пользоватля по email: ${email}`));
      return;
    }
    const isUserValid = await bcrypt.compare(password, user.password);
    if (!isUserValid) {
      next(new Unauthorized401("Неправельный пароль"));
      return;
    }
    const token = jwt.sign(
      { _id: user._id },
      "SECRET",
      { expiresIn: "7d" },
    );
    res.cookie("token", token, {
      maxAge: 3600000,
      httpOnly: true,
      someSite: true,
    });
    res.send({ message: "Успешный вход" }).end();
  } catch (err) {
    next(new Server500Err("произошла ошибка на сервере"));
  }
};

const changeUser = async (req, res, next) => {
  const { name, about } = req.body;
  const id = req.user._id;

  try {
    const user = await User.findByIdAndUpdate(
      { _id: id },
      { name: name, about: about },
      { new: true, runValidators: true },
    );
    res.send(user);
  } catch (err) {
    if ((err.name === "ValidationError")) {
      next(new Bad400Request("Переданы некорректные данные при обновлении профиля."));
      return;
    }
    next(new Server500Err("произошла ошибка на сервере"));
  }
};

const changeAvatar = async (req, res, next) => {
  const { avatar } = req.body;
  const id = req.user._id;

  try {
    const avtarData = await User.findByIdAndUpdate(
      { _id: id },
      { avatar: avatar },
      { new: true, runValidators: true },
    );
    if (!avtarData) {
      next(new Not404Found(`Пользователь по указанному _id${id} не найден.`));
      return;
    }
    res.send(avtarData);
  } catch (err) {
    if ((err.name === "ValidationError")) {
      next(new Bad400Request("Переданы некорректные данные при обновлении аватара."));
      return;
    }
    next(new Server500Err("произошла ошибка на сервере"));
  }
};

const infoUser = async (req, res, next) => {
  try {
    const { _id } = req.user;
    const user = await User.findById({ _id: _id });
    if (!user) {
      return next(new Not404Found(`Пользователь по указанному _id ${_id} не найден.`));
    }
    return res.send(user);
  } catch (err) {
    return next(new Server500Err("произошла ошибка на сервере"));
  }
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  changeUser,
  changeAvatar,
  login,
  infoUser,
};
