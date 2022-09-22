const jwt = require("jsonwebtoken");
// const { UNAUTHORIZED401 } = require("../utils/constants");
const Unauthorized401 = require("../utils/errors/Unauthorized401");

const auth = (req, res, next) => {
  const { token } = req.cookies;
  if (!token) {
    // return res
    //   .status(UNAUTHORIZED401)
    //   .send({ message: "Необходима авторизация" });
    // return next(new Unauthorized401("Необходима авторизация"));
    return next(new Unauthorized401("Необходима авторизация", 401));
  }
  // const token = userJwt.replace("Bearer ", "");
  let payload;
  try {
    payload = jwt.verify(token, "SECRET");
  } catch (err) {
    // return res
    //   .status(UNAUTHORIZED401)
    //   .send({ message: "Необходима авторизация" });
    return next(new Unauthorized401("Необходима авторизация", 401));
  }
  req.user = payload;
  return next();
};

module.exports = auth;
