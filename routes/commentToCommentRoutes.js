const express = require('express');
const commentToCommentController = require("../controllers/commentToCommentController");
const { verifyUser } = require("../middleware/userVerification");
const router = express.Router();

router.post("/", verifyUser, commentToCommentController.createCommentToComment);
router.post("/comment-comments", verifyUser, commentToCommentController.getCommentsOfComment);
router.put("/", verifyUser, commentToCommentController.editCommentToComment);
router.delete("/", verifyUser, commentToCommentController.deleteCommentToComment);

module.exports = router;