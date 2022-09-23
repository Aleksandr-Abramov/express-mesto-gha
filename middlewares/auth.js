const jwt = require("jsonwebtoken");
const Unauthorized401 = require("../utils/errors/Unauthorized401");

const auth = (req, res, next) => {
  const { token } = req.cookies;
  if (!token) {
    return next(new Unauthorized401("Необходима авторизация"));
  }
  let payload;
  try {
    payload = jwt.verify(token, "SECRET");
  } catch (err) {
    return next(new Unauthorized401("Необходима авторизация"));
  }
  req.user = payload;
  return next();
};

module.exports = auth;
