const NotificationModel = require("../models/notificationModel");
const UserModel = require("../models/userModel");

const createNotification = async (req, res) => {
  try {
    const newNotification = await NotificationModel.create(req.body);

    await newNotification.save();

    return res.status(201).json(newNotification);
  } catch (e) {
    return res.status(500).json(`Notification creation failed ${e}`);
  }
};

const getUserNotifications = async (req, res) => {
  try {
    const userNotifications = await NotificationModel.find({
      userToNote: req.user._id,
    });

    return res.status(200).json(userNotifications);
  } catch (e) {
    return res.status(500).json(`get user notifications failed ${e}`);
  }
};

module.exports = { createNotification, getUserNotifications };
