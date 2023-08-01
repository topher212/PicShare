const express = require("express");

//enrutador
const router = express.Router();

const entryExists = require("../middlewares/entryExists");

//Middleware - necesita ser usuario logueado para algunas cosas
const isUser = require("../middlewares/isUser");

// //middleware de editar entry
// const canEdit = require("../middlewares/canEdit");

//traemos las entries
const { addPhoto, likeEntry, deleteEntry, searchPhotoDescr } = require("../controllers/entries");

router.post("/entries/:idUser/photos", isUser, addPhoto);
router.post("/entries/:idEntry/votes", isUser, entryExists, likeEntry);
router.delete("/entries/:idEntry", deleteEntry);
router.get("/entries/photos/search?", searchPhotoDescr);

module.exports = router;
