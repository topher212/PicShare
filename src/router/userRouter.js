const express = require("express");

const router = express.Router();

const userExists = require('../middlewares/userExists');
const isUser = require('../middlewares/isUser');
const canEdit = require('../middlewares/canEdit');
const validator = require('../middlewares/validator');
const canDeleteUser = require('../middlewares/canDeleteUser');
const { postUser, deleteUser, loginUser, seeUserProfile } = require("../controllers/users");

router.post("/register", validator(), postUser);
router.delete("/users/:idUser", isUser, canDeleteUser, deleteUser);
router.post("/login", loginUser);
router.get("/users/:idUser", userExists , seeUserProfile);

module.exports = router;
