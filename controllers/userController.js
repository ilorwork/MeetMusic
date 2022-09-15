const serverResponse = require("../helpers/serverResponse");
const User = require("../models/userModel");

const getAllUsers = async (req, res) => {
  try {
    console.log("got to get all users");
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
    console.log("got to create new user");
    const newUser = new User({ ...req.body });

    console.log("newUser", newUser);
    await newUser.save();
    newUser.password = "********";
    return serverResponse(res, 201, newUser);
  } catch (e) {
    return serverResponse(res, 500, {
      message: "internal error occured " + e,
    });
  }
};

module.exports = { getAllUsers, createUser };
