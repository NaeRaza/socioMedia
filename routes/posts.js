const express = require('express');
const verifyToken = require("../middleware/auth")
const {createPost, getFeedPosts, getUserPosts, likePost} = require('../controllers/posts')
const router = express.Router();
const multer = require("multer")
const path = require("path")

//Configuration du stockages des fichiers uploader
const storage = multer.diskStorage({
    destination : 'uploads/',
    filename : (req, file, cb) => {
        const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
        const ext = path.extname(file.originalname);
        cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
    },
})

const upload = multer({storage});

//Create
router.post("/create", verifyToken, upload.single("image"), createPost)

//Read
router.get("/", verifyToken, getFeedPosts)
router.get("/:userId/posts", verifyToken, getUserPosts)

//Update
router.patch("/id:id/like", verifyToken, likePost)

module.exports = router