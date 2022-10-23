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
    const user = await UserModel.findOne({ email: req.user.email });
    const userNotifications = await NotificationModel.find({
      userToNote: user._id,
    });

    return res.status(200).json(userNotifications.reverse());
  } catch (e) {
    return res.status(500).json(`get user notifications failed ${e}`);
  }
};

module.exports = { createNotification, getUserNotifications };
