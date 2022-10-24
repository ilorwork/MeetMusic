const express = require('express');
const commentController = require("../controllers/commentController");
const { verifyUser } = require("../middleware/userVerification");
const router = express.Router();

router.post("/", verifyUser, commentController.createComment);
router.post("/post-comments", verifyUser, commentController.getCommentsOfPost);
router.put("/", verifyUser, commentController.editComment);
router.delete("/", verifyUser, commentController.deleteComment);

module.exports = router;
