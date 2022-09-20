const UserModel = require("../models/userModel");
const bcrypt = require("bcrypt");
const {
  generateAccessTokenCookie,
  generateRefreshTokenCookie,
} = require("../middleware/userVerification");

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
    return res.status(201).json(newUser);
  } catch (e) {
    return res.status(500).json(`User creation failed ${e}`);
  }
};

const login = async (req, res) => {
  try {
    const user = await UserModel.findOne({ email: req.body.email });

    if (!user) return res.status(404).json("user not found");

    const isCorrect = await bcrypt.compare(req.body.password, user.password);
    // Remove message to improve security
    if (!isCorrect) res.sendStatus(401);

    generateAccessTokenCookie(req, res, user);
    generateRefreshTokenCookie(req, res, user);

    res.status(200).json("User login succeeded");
  } catch (e) {
    return res.status(500).json(`Login proccess failed ${e}`);
  }
};

const logout = async (req, res) => {
  // This validation may be useless
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) return res.status(400).json("No token provided");

  res.clearCookie("accessToken");
  res.clearCookie("refreshToken");
  return res.status(200).json("User logged out succesfully");
};

const getFollowing = async (req, res) => {
  try {
    const user = await UserModel.findOne({ email: req.user.email });

    return res.status(200).json(user.following);
  } catch (e) {
    return res.status(500).json(`get following failed ${e}`);
  }
};

module.exports = {
  getAllUsers,
  createUser,
  login,
  logout,
  getFollowing,
};
