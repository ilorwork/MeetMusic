const express = require("express");
const userController = require("../controllers/userController");
const router = express.Router();

router.get("/", userController.getAllUsers);
router.post("/", userController.createUser);
router.post("/login", userController.login);
router.post(
  "/user/following",
  userController.verifyUser,
  userController.getFollowing
);

module.exports = router;
