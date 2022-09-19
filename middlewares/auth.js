const jwt = require("jsonwebtoken");
const { UNAUTHORIZED401 } = require("../utils/constants");

const auth = (req, res, next) => {
  const userJwt = req.cookies.token;
  if (!userJwt || userJwt.startsWith("Bearer ")) {
    return res
      .status(UNAUTHORIZED401)
      .send({ message: "Необходима авторизация" });
  }
  const token = userJwt.replace("Bearer ", "");
  let payload;
  try {
    payload = jwt.verify(token, "SECRET");
  } catch (err) {
    return res
      .status(UNAUTHORIZED401)
      .send({ message: "Необходима авторизация" });
  }
  req.user = payload;
  return next();
};

module.exports = auth;
