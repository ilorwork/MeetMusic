const express = require("express");
const userController = require("../controllers/userController");
const router = express.Router();
const { verifyUser } = require("../middleware/userVerification");

router.get("/", userController.getAllUsers);
router.post("/", userController.createUser);
router.put("/", verifyUser, userController.editUser);
router.post("/login", userController.login);
router.delete("/logout", userController.logout);
router.get("/current-user", verifyUser, userController.getCurrentUser);
// TODO: change to get and pass id via params
router.post("/user/id", verifyUser, userController.getUserById);
router.get(
  "/user/people-user-may-know",
  verifyUser,
  userController.getPeopleUserMayKnow
);
router.get("/user/following", verifyUser, userController.getFollowing);

module.exports = router;
