const express = require("express");
const router = express.Router();
const { verifyUser } = require("../middleware/userVerification");
const {
  createNotification,
  getUserNotifications,
} = require("../controllers/notificationController");

router.post("/", verifyUser, createNotification);
router.get("/", verifyUser, getUserNotifications);

module.exports = router;
