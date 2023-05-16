const usersRouter = require("express").Router();
const {
  getUsers,
  getUserById,
  updateProfile,
  updateAvatar,
  getUserInfo,
} = require("../controllers/users");
const {
  getUserByIdValidation,
  getUserInfoValidation,
  updateProfileValidation,
  updateAvatarValidation,
} = require("../middlewares/validation");

usersRouter.get("/", getUsers);
usersRouter.get("/me", getUserInfoValidation, getUserInfo);
usersRouter.get("/:userId", getUserByIdValidation, getUserById);
usersRouter.patch("/me", updateProfileValidation, updateProfile);
usersRouter.patch("/me/avatar", updateAvatarValidation, updateAvatar);

module.exports = usersRouter;
