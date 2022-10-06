const express = require("express");
const postController = require("../controllers/postController");
const { verifyUser } = require("../middleware/userVerification");
const router = express.Router();

router.get("/", postController.getAllPosts);
router.get(
  "/current-user-posts",
  verifyUser,
  postController.getPostsOfCurrentUser
);
router.post("/user-posts", verifyUser, postController.getPostsOfUser);
router.post("/", verifyUser, postController.createPost);
router.put("/", verifyUser, postController.editPost);
router.delete("/", verifyUser, postController.deletePost);
router.patch("/add-like", verifyUser, postController.addLike);
router.patch("/remove-like", verifyUser, postController.removeLike);

// todo: comment and shared post

module.exports = router;
