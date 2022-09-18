const UserModel = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

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

const verifyUser = (req, res, next) => {
  const token = req.headers["authorization"];
  if (token === undefined) return res.sendStatus(401);

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

const login = async (req, res) => {
  try {
    const user = await UserModel.findOne({ email: req.body.email });

    if (!user) return res.status(404).json("user not found");

    const isCorrect = await bcrypt.compare(req.body.password, user.password);
    if (!isCorrect) res.sendStatus(401);

    const accessToken = jwt.sign(
      { email: user.email },
      process.env.ACCESS_TOKEN_SECRET
    );
    res.json({ accessToken });
  } catch (e) {
    return res.status(500).json(`Login proccess failed ${e}`);
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

module.exports = { getAllUsers, createUser, login, verifyUser, getFollowing };
