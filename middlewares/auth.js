const UnauthErr = require("../errors/UnauthErr");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = process.env;

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || authorization.startsWith("Bearer ")) {
    return next(new UnauthErr("Необходима авторизация"));
  } else {
    const tokenFromHeaders = authorization.replace("Bearer ", "");
    let payload;

    try {
      payload = jwt.verify(tokenFromHeaders, JWT_SECRET);
    } catch (err) {
      return next(new UnauthErr("Необходима авторизация"));
    }
    req.user = payload;
    next();
  }
};
