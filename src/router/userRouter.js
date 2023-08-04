const express = require("express");

const router = express.Router();

const userExists = require("../middlewares/userExists");
const isUser = require("../middlewares/isUser");
const validator = require("../middlewares/validator");
const canDeleteUser = require("../middlewares/canDeleteUser");
const avatarExists = require("../middlewares/avatarExists");

const {
  postUser,
  deleteUser,
  loginUser,
  seeUserProfile,
  addAndChangeAvatar,
} = require("../controllers/users");

router.post("/register", validator, postUser);
router.post("/login", loginUser);
router.post("/users/avatar", isUser, validator, avatarExists, addAndChangeAvatar);
router.get("/users/:idUser", userExists, seeUserProfile);
router.delete("/users/:idUser", isUser, canDeleteUser, deleteUser);

module.exports = router;