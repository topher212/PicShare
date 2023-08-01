const express = require("express");

//enrutador
const router = express.Router();

const entryExists = require("../middlewares/entryExists");

//Middleware - necesita ser usuario logueado para algunas cosas
const isUser = require("../middlewares/isUser");

// //middleware de editar entry
// const canEdit = require("../middlewares/canEdit");

//traemos las entries
const { 
    addPhoto, 
    likeEntry,
    deleteEntry 
} = require("../controllers/entries");


router.post("/entries/:id_user/photos", isUser, addPhoto);
router.post("/entries/:id_entry/votes", isUser, entryExists, likeEntry);
router.delete("/entries/:idEntry", deleteEntry);


module.exports = router;
