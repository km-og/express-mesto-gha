const router = require("express").Router();
const usersRouter = require("./users");
const cardsRouter = require("./cards");
const { login, createUser } = require("../controllers/users");
const auth = require("../middlewares/auth");
const NotFoundErr = require("../errors/NotFoundErr");

router.post("/signin", login);
router.post("/signup", createUser);
router.use("/users", auth, usersRouter);
router.use("/cards", auth, cardsRouter);
router.use("*", auth, (req, res, next) => {
  if (err.name === "DocumentNotFoundError") {
    next(new NotFoundErr("Данная страница не сущесвует"));
  } else {
    next(err);
  }
});

module.exports = router;
