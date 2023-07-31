const express = require("express");

const router = express.Router();

// const userExists = require('../middlewares/userExists');
// const isUser = require('../middlewares/isUser');
// const validator = require('../middlewares/validator');
const { postUser } = require("../controllers/users");

router.post("/register", postUser);

module.exports = router;
