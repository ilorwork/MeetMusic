const express = require("express");
const router = express.Router();
const { verifyUser } = require("../middleware/userVerification");
const {
  createNotification,
  getUserNotifications,
  editNotification,
} = require("../controllers/notificationController");

router.post("/", verifyUser, createNotification);
router.put("/notification", verifyUser, editNotification);
router.get("/", verifyUser, getUserNotifications);

module.exports = router;
