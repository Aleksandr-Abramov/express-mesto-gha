const express = require("express");
const mongoose = require("mongoose");
// const bodyParser = require("body-parser");
const { errors } = require("celebrate");
const cookieParser = require("cookie-parser");
const routerUsers = require("./routes/users");
const routerCards = require("./routes/cards");
const errorHendler = require("./middlewares/errorHendler");

const { NOT404FOUND } = require("./utils/constants");

const app = express();
const { PORT = 3000 } = process.env;
app.use((req, res, next) => {
  req.user = {
    _id: "5d8b8592978f8bd833ca8133",
  };

  next();
});

app.use(express.json());
app.use(cookieParser());

app.use("/", routerUsers);
app.use("/", routerCards);
app.use("/*", (req, res) => {
  res.status(NOT404FOUND).send({ message: "ошибка 404, страницы не существует" });
});
app.use(errors());
app.use(errorHendler);
async function main() {
  await mongoose.connect("mongodb://localhost:27017/mestodb", {});
  await app.listen(PORT);
  console.log(`Example app listening on port ${PORT}!`);
}
main();
