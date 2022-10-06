const UserModel = require("../models/userModel");
const bcrypt = require("bcrypt");
const {
  generateAccessTokenHeader,
  generateRefreshTokenCookie,
} = require("../middleware/userVerification");
const { cloudinary } = require("../utils/cloudinary");

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
    if (!isCorrect) return res.status(401).json("Wrong password");

    generateAccessTokenHeader(req, res, user);
    generateRefreshTokenCookie(req, res, user);

    res.status(200).json("User login succeeded");
  } catch (e) {
    return res.status(500).json(`Login proccess failed ${e}`);
  }
};

const logout = async (req, res) => {
  res.clearCookie("refreshToken");
  return res.status(200).json("User logged out succesfully");
};

const editUser = async (req, res) => {
  try {
    const user = await UserModel.findOne({ email: req.user.email });

    const updates = Object.keys(req.body);
    if (updates.includes("profilePic")) {
      if (user.profilePic.includes("cloudinary")) {
        const imgPublicId = user.profilePic.split("/").pop().split(".")[0];
        await cloudinary.uploader.destroy(imgPublicId);
      }

      const uploadedImgRes = await cloudinary.uploader.upload(
        req.body.profilePic
      );
      req.body.profilePic = `https://res.cloudinary.com/dhbgvkcez/image/upload/v${uploadedImgRes.version}/${uploadedImgRes.public_id}.${uploadedImgRes.format}`;
    }
    updates.forEach((update) => (user[update] = req.body[update]));

    await user.save();
    return res.status(200).json(user);
  } catch (e) {
    return res.status(500).json(`edit user failed ${e}`);
  }
};

const getCurrentUser = async (req, res) => {
  try {
    const user = await UserModel.findOne({ email: req.user.email });
    return res.status(200).json(user);
  } catch (e) {
    return res.status(500).json(`get user failed ${e}`);
  }
};

const getUserById = async (req, res) => {
  try {
    const user = await UserModel.findOne({ _id: req.body._id });
    return res.status(200).json(user);
  } catch (e) {
    return res.status(500).json(`get user failed ${e}`);
  }
};

const getPeopleUserMayKnow = async (req, res) => {
  try {
    const user = await UserModel.findOne({ email: req.user.email });

    const usersToExclude = user.following;
    usersToExclude.push(user._id);

    const idsToExclude = usersToExclude.map((userId) => {
      return { _id: { $ne: userId } };
    });

    const peopleUserMayKnow = await UserModel.find({ $and: idsToExclude });

    return res.status(200).json(peopleUserMayKnow);
  } catch (e) {
    return res.status(500).json(`get people user may know failed ${e}`);
  }
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
  editUser,
  getCurrentUser,
  getUserById,
  getPeopleUserMayKnow,
  getFollowing,
};
