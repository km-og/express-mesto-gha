const usersRouter = require("./users");
const cardsRouter = require("./cards");

const router = require("express").Router();

router.use("/users", usersRouter);
router.use("/cards", cardsRouter);
router.use("*", (req, res) => {
  res.status(404).send({ message: "Данная страница не сущесвует" });
});

module.exports = router;
