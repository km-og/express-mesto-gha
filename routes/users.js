const usersRouter = require("express").Router();
const {
  getUsers,
  getUserById,
  updateProfile,
  updateAvatar,
  getUserInfo,
} = require("../controllers/users");

usersRouter.get("/", getUsers);
usersRouter.get("/:userId", getUserById);
usersRouter.get("/me", getUserInfo);
usersRouter.patch("/me", updateProfile);
usersRouter.patch("/me/avatar", updateAvatar);

module.exports = usersRouter;
