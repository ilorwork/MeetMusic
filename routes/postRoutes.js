const express = require("express");
const postController = require("../controllers/postController");
const router = express.Router();

router.post("/", postController.createPost);
router.put("/", postController.editPost);
router.delete("/", postController.deletePost);
router.get("/", postController.getAllPosts);
router.get("/userposts", postController.getPostsByUser);

router.patch("/like", postController.like);
// todo: comment and share post

module.exports = router;


