const express = require("express");
const postController = require("../controllers/postController");
const { verifyUser } = require("../middleware/userVerification");
const router = express.Router();

router.post("/", verifyUser, postController.createPost);
router.get("/", postController.getAllPosts);
router.put("/", verifyUser, postController.editPost);
router.delete("/", verifyUser, postController.deletePost);
// router.get("/userposts", postController.getPostsByUser);

// router.patch("/like", postController.like);
// todo: comment and shared post

module.exports = router;


