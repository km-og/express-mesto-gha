const usersRouter = require("./users");
const cardsRouter = require("./cards");

const router = require("express").Router();

router.use("/users", usersRouter);
router.use("/cards", cardsRouter);

module.exports = router;
