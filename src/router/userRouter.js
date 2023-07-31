const express = require("express");

const router = express.Router();

const userExists = require('../middlewares/userExists');
const isUser = require('../middlewares/isUser');
const canEdit = require('../middlewares/canEdit');
const validator = require('../middlewares/validator');
const { postUser, deleteUser } = require("../controllers/users");

router.post("/register", validator(), postUser);
router.delete("/users/:idUser", isUser, canEdit, deleteUser);

module.exports = router;
