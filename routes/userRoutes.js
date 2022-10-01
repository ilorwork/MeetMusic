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

module.exports = router;
