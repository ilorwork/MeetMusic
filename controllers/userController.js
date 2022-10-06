const UserModel = require("../models/userModel");
const bcrypt = require("bcrypt");
const {
  generateAccessTokenHeader,
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
    if (!isCorrect) return res.status(401).json("Wrong password");

    generateAccessTokenHeader(req, res, user);
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

  res.clearCookie("refreshToken");
  return res.status(200).json("User logged out succesfully");
};

const getUser = async (req, res) => {
  try {
    const user = await UserModel.findOne({ email: req.user.email });
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
    const populatedUser = await user.populate({ path: 'following' });
    return res.status(200).json(populatedUser.following);
  } catch (e) {
    return res.status(500).json(`get following failed ${e}`);
  }
};

const follow = async (req, res) => {
  try {
    const user = await UserModel.findOne({ email: req.user.email });
    const idOfUserFollowed = req.body._id;
    user.following.unshift(idOfUserFollowed);
    await user.save();

    const userFollowed = await UserModel.findOne({ _id: idOfUserFollowed });
    userFollowed.followers.unshift(user._id);
    await userFollowed.save();

    return res.status(200).json({ followingOfUser: user.following, followersOfUserFollowed: userFollowed.followers });
  } catch (e) {
    return res.status(500).json("follow another user failed " + e);
  }
}

const unfollow = async (req, res) => {
  try {
    const user = await UserModel.findOne({ email: req.user.email });
    const idOfUserfollowed = req.body._id;
    user.following = user.following.filter((objIdOfUser) => objIdOfUser != idOfUserfollowed);
    await user.save();

    const idOfUser = user._id;
    const userFollowed = await UserModel.findOne({ _id: idOfUserfollowed });
    const indexOfDelete = userFollowed.followers.indexOf(idOfUser);
    userFollowed.followers.splice(indexOfDelete, 1);
    await userFollowed.save();

    return res.status(200).json({ followingOfUser: user.following, followersOfUserFollowed: userFollowed.followers });
  } catch (e) {
    return res.status(500).json("unfollow another user failed " + e);
  }
}

const getFollowers = async (req, res) => {
  try {
    const user = await UserModel.findOne({ email: req.user.email });
    const populatedUser = await user.populate({ path: 'followers' });
    return res.status(200).json(populatedUser.followers);
  } catch (e) {
    return res.status(500).json(`get followers failed ${e}`);
  }
}

module.exports = {
  getAllUsers,
  createUser,
  login,
  logout,
  getUser,
  getPeopleUserMayKnow,
  getFollowing,
  follow,
  unfollow,
  getFollowers
}
