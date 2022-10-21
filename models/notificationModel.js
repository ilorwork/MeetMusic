const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
  userToNote: { type: mongoose.Types.ObjectId, ref: "User", required: true },
  timeOfCreation: { type: Date, default: Date.now() },
  content: { type: String, required: true },
  isBeingRead: { type: Boolean, default: false },
});

const NotificationModel = mongoose.model("Notification", notificationSchema);
module.exports = NotificationModel;
