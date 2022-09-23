const express = require("express");
const mongoose = require("mongoose");
// const bodyParser = require("body-parser");
const { errors } = require("celebrate");
const cookieParser = require("cookie-parser");
const routerUsers = require("./routes/users");
const routerCards = require("./routes/cards");
const errorHendler = require("./middlewares/errorHendler");
const auth = require("./middlewares/auth");

// const { NOT404FOUND } = require("./utils/constants");
const Not404Found = require("./utils/errors/Not404Found");

const app = express();
const { PORT = 3000 } = process.env;

app.use(express.json());
app.use(cookieParser());

app.use("/", routerUsers);
app.use("/", routerCards);
app.use("/*", auth, (req, res, next) => {
  // res.status(NOT404FOUND).send({ message: "ошибка 404, страницы не существует" });
  next(new Not404Found("ошибка 404, страницы не существует"));
});
app.use(errors());
app.use(errorHendler);
async function main() {
  await mongoose.connect("mongodb://localhost:27017/mestodb", {});
  await app.listen(PORT);
  console.log(`Example app listening on port ${PORT}!`);
}
main();
