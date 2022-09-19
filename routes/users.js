const routerUsers = require("express").Router();
const { celebrate, Joi } = require("celebrate");
const auth = require("../middlewares/auth");

const {
  getUsers,
  getUserById,
  createUser,
  changeUser,
  changeAvatar,
  login,
  infoUser,
} = require("../controllers/users");

routerUsers.get("/users", auth, getUsers);
routerUsers.get("/users/me/", auth, infoUser);
routerUsers.get("/users/:userId/", auth, celebrate({
  params: Joi.object().keys({
    userId: Joi.string().alphanum().length(24),
  }),
}), getUserById);
routerUsers.patch("/users/me/avatar", auth, celebrate({
  body: Joi.object().keys({
    avatar: Joi.string(),
  }),
}), changeAvatar);
routerUsers.patch("/users/me/", auth, celebrate({
  body: Joi.object().keys({
    name: Joi.string().max(30).min(2),
    about: Joi.string().max(30).min(2),
  }),
}), changeUser);

routerUsers.post("/users/signup", celebrate({
  body: Joi.object().keys({
    name: Joi.string().max(30).min(2),
    about: Joi.string().max(30).min(2),
    avatar: Joi.string(),
    email: Joi.string().email(),
    password: Joi.string().min(3),
  }),
}), createUser);
routerUsers.post("/users/signin", celebrate({
  body: Joi.object().keys({
    email: Joi.string().max(30).min(2),
    password: Joi.string().max(30).min(2),
  }),
}), login);

module.exports = routerUsers;
