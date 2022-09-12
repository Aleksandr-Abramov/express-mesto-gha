const routerUsers = require("express").Router();

const {
  getUsers,
  getUserById,
  createUser,
  changeUser,
  changeAvatar,
} = require("../controllers/users");

routerUsers.get("/users", getUsers);
routerUsers.get("/users/:userId/", getUserById);
routerUsers.post("/users", createUser);
routerUsers.patch("/users/me/avatar", changeAvatar);
routerUsers.patch("/users/me/", changeUser);

module.exports = routerUsers;
