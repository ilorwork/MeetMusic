const NotificationModel = require("../models/notificationModel");

const createNotification = async (req, res) => {
  try {
    const newNotification = await NotificationModel.create(req.body);

    return res.status(201).json(newNotification);
  } catch (e) {
    return res.status(500).json(`Notification creation failed ${e}`);
  }
};

const editNotification = async (req, res) => {
  try {
    const notification = await NotificationModel.findOne({
      _id: req.query.notificationId,
    });

    const updates = Object.keys(req.body);
    updates.forEach((update) => (notification[update] = req.body[update]));
    await notification.save();

    return res.status(200).json(notification);
  } catch (e) {
    return res.status(500).json(`edit notification failed ${e}`);
  }
};

const getUserNotifications = async (req, res) => {
  try {
    const userNotifications = await NotificationModel.find({
      userToNote: req.user._id,
    });

    return res.status(200).json(userNotifications.reverse());
  } catch (e) {
    return res.status(500).json(`get user notifications failed ${e}`);
  }
};

module.exports = { createNotification, editNotification, getUserNotifications };
