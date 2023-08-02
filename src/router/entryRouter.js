const express = require("express");

//enrutador
const router = express.Router();

//Middlewares
const isUser = require("../middlewares/isUser");
const userExists = require("../middlewares/userExists");
const entryExists = require("../middlewares/entryExists");
const commentExists = require("../middlewares/commentExists");
const canEditEntry = require("../middlewares/canEditEntry");
const canEditComment = require("../middlewares/canEditComment");


//traemos las entries
const { addPhoto,
        likeEntry,
        deleteEntry,
        searchPhotoDescr,
        addAvatar,
        commentEntry,
        editComment,
        deleteComment        
} = require("../controllers/entries");


router.get("/entries/photos/search?", searchPhotoDescr);
router.post("/entries/:idUser/avatar", isUser, userExists, addAvatar);
router.post("/entries/:idUser/photos", userExists, isUser, addPhoto);
router.post("/entries/:idEntry/votes", userExists, isUser, entryExists, likeEntry);
router.post("/entries/:idEntry/comment", userExists, isUser, entryExists, commentEntry);
router.put("/entries/:idEntry/comment/:idComment", userExists, isUser, entryExists, commentExists, canEditComment, editComment)
router.delete("/entries/:idEntry/comment/:idComment", userExists, isUser, entryExists, commentExists, canEditComment, deleteComment);
router.delete("/entries/:idEntry", userExists, isUser, entryExists, canEditEntry, deleteEntry);

module.exports = router;