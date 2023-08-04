const express = require("express");

const router = express.Router();

const userExists = require("../middlewares/userExists");
const isUser = require("../middlewares/isUser");
const validatorFiles = require("../middlewares/validatorFiles");
const validatorInfoUser = require("../middlewares/validatorInfoUser");
const canDeleteUser = require("../middlewares/canDeleteUser");
const deleteOldAvatar = require("../middlewares/deleteOldAvatar");
const canEditUser = require("../middlewares/canEditUser");

const {
  postUser,
  deleteUser,
  loginUser,
  seeUserProfile,
  addNewAvatar,
  editUser,
} = require("../controllers/users");

router.post("/register", validatorInfoUser, postUser);
router.post("/login", loginUser);
router.post("/users/avatar", isUser, validatorFiles, deleteOldAvatar, addNewAvatar);
router.get("/users/:idUser", userExists, seeUserProfile);
router.delete("/users/:idUser", isUser, canDeleteUser, deleteUser);
router.put("/users/:idUser", isUser, userExists, canEditUser, validatorInfoUser, editUser);

module.exports = router;
