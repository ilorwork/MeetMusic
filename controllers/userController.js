const serverResponse = require("../helpers/serverResponse");
const User = require("../models/userModel");
const bcrypt = require("bcrypt");

const getAllUsers = async (req, res) => {
  try {
    const allUsers = await User.find({});
    return serverResponse(res, 200, allUsers);
  } catch (error) {
    return serverResponse(res, 500, {
      message: "internal error has accured " + e,
    });
  }
};

const createUser = async (req, res) => {
  try {
    const newUser = new User({ ...req.body });

    newUser.password = await bcrypt.hash(newUser.password, 10);
    await newUser.save();

    newUser.password = "Unable to send sensitive data";
    return serverResponse(res, 201, newUser);
  } catch (e) {
    return serverResponse(res, 500, {
      message: "internal error occured " + e,
    });
  }
};

const login = async (req, res) => {
  try {
    const user = await User.find({ email: req.body.email });
    if (!user.length) return serverResponse(res, 404, "user not found");
    if (user.length > 1) return serverResponse(res, 500, "email not uniq");

    const isCorrect = await bcrypt.compare(req.body.password, user[0].password);
    if (!isCorrect) return serverResponse(res, 401, "Unauthorized");

    return serverResponse(res, 200, "Allowed");
  } catch (e) {
    return serverResponse(res, 500, {
      message: "internal error occured " + e,
    });
  }
};

module.exports = { getAllUsers, createUser, login };
