const express = require("express");
const userController = require("../controllers/userController");
const router = express.Router();
const { verifyUser } = require("../middleware/userVerification");

router.get("/", userController.getAllUsers);
router.post("/", userController.createUser);
router.post("/login", userController.login);
router.delete("/logout", userController.logout);
router.get("/user", verifyUser, userController.getUser);
router.get(
  "/user/people-user-may-know",
  verifyUser,
  userController.getPeopleUserMayKnow
);
router.get("/user/following", verifyUser, userController.getFollowing);
router.patch("/user/follow", verifyUser, userController.follow);
router.patch("/user/unfollow", verifyUser, userController.unfollow);
router.get("/user/followers", verifyUser, userController.getFollowers);

module.exports = router;
