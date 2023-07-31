const express = require("express");

//enrutador
const router = express.Router();

// //middleware de entryExists
// const entryExists = require("../middlewares/entryExists");

// //Middleware - necesita ser usuario logueado para algunas cosas
// const isUser = require("../middlewares/isUser");

// //middleware de editar entry
// const canEdit = require("../middlewares/canEdit");

//traemos las entries
const { addPhoto } = require("../controllers/entries");

// // endpoints
//post addphotoentry
router.post("/entries/:id_User/photos", addPhoto);

module.exports = router;
