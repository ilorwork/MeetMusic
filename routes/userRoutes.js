const express = require("express");
const userController = require("../controllers/userController");
const router = express.Router();
const {
  verifyUser,
  genAccessTokenByRefreshToken,
} = require("../middleware/userVerification");

router.get("/", userController.getAllUsers);
router.post("/", userController.createUser);
router.post("/login", userController.login);
// router.post("/token", genAccessTokenByRefreshToken);
router.delete("/logout", userController.logout);
router.post("/user/following", verifyUser, userController.getFollowing);

module.exports = router;
