const express = require("express");
const mongoose = require("mongoose");
const routerUsers = require("./routes/users");
const routerCards = require("./routes/cards");

const app = express();
const { PORT = 3000 } = process.env;

async function main() {
  await mongoose.connect("mongodb://localhost:27017/mestodb", {});
  await app.listen(PORT);
  console.log(`Example app listening on port ${PORT}!`);
}
main();

app.use((req, res, next) => {
  req.user = {
    _id: "6317488e553901f2c51766ba", // вставьте сюда _id созданного в предыдущем пункте пользователя
  };

  next();
});

app.use("/", routerUsers);
app.use("/", routerCards);
