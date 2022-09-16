const UserModel = require("../models/userModel");
const bcrypt = require("bcrypt");

const getAllUsers = async (req, res) => {
  try {
    const allUsers = await UserModel.find({});
    return res.status(200).json(allUsers);
  } catch (e) {
    return res.status(500).json(`Failed to fetch users ${e}`);
  }
};

const createUser = async (req, res) => {
  try {
    const newUser = await UserModel.create(req.body);

    newUser.password = await bcrypt.hash(newUser.password, 10);
    await newUser.save();

    newUser.password = "Unable to send sensitive data";
    return res.status(200).json(newUser);
  } catch (e) {
    return res.status(500).json(`User creation has failed ${e}`);
  }
};

const login = async (req, res) => {
  try {
    const user = await UserModel.findOne({ email: req.body.email });

    if (!user) return res.status(404).json("user not found");

    const isCorrect = await bcrypt.compare(req.body.password, user.password);
    if (!isCorrect) res.status(401).json("Unauthorized");

    return res.status(200).json("Allowed");
  } catch (e) {
    return res.status(500).json(`internal error has accured ${e}`);
  }
};

module.exports = { getAllUsers, createUser, login };
