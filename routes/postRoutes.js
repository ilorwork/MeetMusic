const express = require("express");
const postController = require("../controllers/postController");
const { verifyUser } = require("../middleware/userVerification");
const router = express.Router();

router.get("/", postController.getAllPosts);
router.get("/posts-by-user", verifyUser, postController.getPostsOfCurrentUser);
router.post("/", verifyUser, postController.createPost);
router.put("/", verifyUser, postController.editPost);
router.delete("/", verifyUser, postController.deletePost);
router.patch("/add-like", verifyUser, postController.addLike);
router.patch("/remove-like", verifyUser, postController.removeLike);

// todo: comment and shared post

module.exports = router;


