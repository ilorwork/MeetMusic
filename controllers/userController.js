const UserModel = require("../models/userModel");
const bcrypt = require("bcrypt");
const {
  generateAccessTokenHeader,
  generateRefreshTokenCookie,
} = require("../middleware/userVerification");
const { cloudinary } = require("../utils/cloudinary");
const validator = require("validator");

function capitalizeFirstChar(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

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
    const isEmail = validator.isEmail(req.body.email);
    if (!isEmail) return res.status(500).json(`Invalid email`);

    const isStrong = validator.isStrongPassword(req.body.password, {
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 0,
      minSymbols: 0,
    });
    if (!isStrong) return res.status(500).json(`Password isn't strong enough`);

    req.body.password = await bcrypt.hash(req.body.password, 10);

    req.body.firstName = capitalizeFirstChar(req.body.firstName.toLowerCase());
    req.body.lastName = capitalizeFirstChar(req.body.lastName.toLowerCase());

    const newUser = await UserModel.create(req.body);

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

    res.status(200).json(user);
  } catch (e) {
    return res.status(500).json(`Login proccess failed ${e}`);
  }
};

const logout = async (req, res) => {
  res.clearCookie("refreshToken", {
    maxAge: 1000, // required to avoid firefox 'cookie already exp' warnning
    httpOnly: true,
    sameSite: "None",
    secure: true,
  });
  return res.status(200).json("User logged out succesfully");
};

const editUser = async (req, res) => {
  try {
    const user = await UserModel.findOne({ email: req.user.email })
      .populate("following")
      .populate("followers");

    const updates = Object.keys(req.body);
    if (updates.includes("profilePic")) {
      if (user.profilePic.includes("cloudinary")) {
        const imgPublicId = user.profilePic.split("/").pop().split(".")[0];
        await cloudinary.uploader.destroy(`profilePics/${imgPublicId}`);
      }

      const uploadedImgRes = await cloudinary.uploader.upload(
        req.body.profilePic,
        { folder: "profilePics" }
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
    let user;
    if (req.query.populated === "true") {
      user = await UserModel.findOne({ email: req.user.email })
        .populate("following")
        .populate("followers");
    } else {
      user = await UserModel.findOne({ email: req.user.email });
    }

    return res.status(200).json(user);
  } catch (e) {
    return res.status(500).json(`get user failed ${e}`);
  }
};

const getUserById = async (req, res) => {
  try {
    const user = await UserModel.findOne({ _id: req.body._id })
      .populate("following")
      .populate("followers");
    return res.status(200).json(user);
  } catch (e) {
    return res.status(500).json(`get user failed ${e}`);
  }
};

const getPeopleUserMayKnow = async (req, res) => {
  try {
    const currentUser = await UserModel.findOne({ email: req.user.email });

    const usersToExclude = currentUser.following;
    usersToExclude.push(currentUser._id);
    const idsToExclude = usersToExclude.map((userId) => {
      return { _id: { $ne: userId } };
    });

    let peopleUserMayKnow = await UserModel.find({
      $and: idsToExclude,
      country: currentUser.country,
    });

    if (peopleUserMayKnow.length < 5) {
      peopleUserMayKnow = await UserModel.find({ $and: idsToExclude });
    }

    return res.status(200).json(peopleUserMayKnow);
  } catch (e) {
    return res.status(500).json(`get people user may know failed ${e}`);
  }
};

const follow = async (req, res) => {
  try {
    const user = await UserModel.findOne({ email: req.user.email });
    const idOfUserFollowed = req.body._id;

    if (user._id == idOfUserFollowed) return res.sendStatus(403);
    if (user.following.includes(idOfUserFollowed)) return res.sendStatus(403);

    user.following.unshift(idOfUserFollowed);
    await user.save();

    const userFollowed = await UserModel.findOne({ _id: idOfUserFollowed });
    userFollowed.followers.unshift(user._id);
    await userFollowed.save();

    return res.status(200).json({
      followingOfUser: user.following,
      followersOfUserFollowed: userFollowed.followers,
    });
  } catch (e) {
    return res.status(500).json("follow another user failed " + e);
  }
};

const unfollow = async (req, res) => {
  try {
    const user = await UserModel.findOne({ email: req.user.email });
    const idOfUserfollowed = req.body._id;
    user.following = user.following.filter(
      (objIdOfUser) => objIdOfUser != idOfUserfollowed
    );
    await user.save();

    const idOfUser = user._id;
    const userFollowed = await UserModel.findOne({ _id: idOfUserfollowed });
    const indexOfDelete = userFollowed.followers.indexOf(idOfUser);
    userFollowed.followers.splice(indexOfDelete, 1);
    await userFollowed.save();

    return res.status(200).json({
      followingOfUser: user.following,
      followersOfUserFollowed: userFollowed.followers,
    });
  } catch (e) {
    return res.status(500).json("unfollow another user failed " + e);
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
  follow,
  unfollow,
};
