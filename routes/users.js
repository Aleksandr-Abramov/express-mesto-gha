const routerUsers = require("express").Router();
const express = require("express");
const {
  getUsers,
  getUserById,
  createUser,
  changeUser,
  changeAvatar,
} = require("../controllers/users");

routerUsers.get("/users", getUsers);
routerUsers.get("/users/:userId/", getUserById);
routerUsers.post("/users", express.json(), createUser);
routerUsers.patch("/users/me/avatar", express.json(), changeAvatar);
routerUsers.patch("/users/me/", express.json(), changeUser);

module.exports = routerUsers;
