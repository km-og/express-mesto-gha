const { errUnauth } = require("../errors/error");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = process.env;

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || authorization.startsWith("Bearer ")) {
    return res.status(errUnauth).send({ message: "Необходима авторизация" });
  } else {
    const tokenFromHeaders = authorization.replace("Bearer ", "");
    let payload;

    try {
      payload = jwt.verify(tokenFromHeaders, JWT_SECRET);
    } catch (err) {
      return res.status(errUnauth).send({ message: "Необходима авторизация" });
    }
    req.user = payload;
    next();
  }
};
