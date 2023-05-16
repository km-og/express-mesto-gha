const router = require("express").Router();
const usersRouter = require("./users");
const cardsRouter = require("./cards");
const { login, createUser } = require("../controllers/users");
const auth = require("../middlewares/auth");
const NotFoundErr = require("../errors/NotFoundErr");
const {
  signinValidation,
  signupValidation,
} = require("../middlewares/validation");

router.post("/signin", signinValidation, login);
router.post("/signup", signupValidation, createUser);
router.use("/users", auth, usersRouter);
router.use("/cards", auth, cardsRouter);
router.use("*", auth, (req, res, next) => {
  next(new NotFoundErr("Данная страница не сущесвует"));
});

module.exports = router;
