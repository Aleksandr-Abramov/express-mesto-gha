const jwt = require("jsonwebtoken");
const { UNAUTHORIZED401 } = require("../utils/constants");

const auth = (req, res, next) => {
  const { token } = req.cookies;
  if (!token) {
    // return res
    //   .status(UNAUTHORIZED401)
    //   .send({ message: "Необходима авторизация" });
    next(new UNAUTHORIZED401("Необходима авторизация"));
  }
  // const token = userJwt.replace("Bearer ", "");
  let payload;
  try {
    payload = jwt.verify(token, "SECRET");
  } catch (err) {
    // return res
    //   .status(UNAUTHORIZED401)
    //   .send({ message: "Необходима авторизация" });
    next(new UNAUTHORIZED401("Необходима авторизация"));
  }
  req.user = payload;
  return next();
};

module.exports = auth;
