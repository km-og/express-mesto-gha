const router = require("express").Router();
const usersRouter = require("./users");
const cardsRouter = require("./cards");
const { login, createUser } = require("../controllers/users");
const auth = require("../middlewares/auth");

router.post("/signin", login);
router.post("/signup", createUser);
router.use("/users", auth, usersRouter);
router.use("/cards", auth, cardsRouter);
router.use("*", (req, res) => {
  res.status(404).send({ message: "Данная страница не сущесвует" });
});

module.exports = router;
