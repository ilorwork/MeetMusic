const express = require('express');
const likeController = require("../controllers/likeController");
const { verifyUser } = require("../middleware/userVerification");
const router = express.Router();

router.post("/has-liked", verifyUser, likeController.isUserLikeThePost);
router.post("/", verifyUser, likeController.addLike);
router.delete("/", verifyUser, likeController.removeLike);

module.exports = router;
