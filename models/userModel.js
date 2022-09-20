const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  birthDate: { type: Date, required: true },
  gender: { type: String, enum: ["male", "female"], required: true },
  country: String,
  city: String,
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  profilePic: String,
  role: { type: String, enum: ["user", "admin"], required: true },
  following: [{ type: mongoose.Types.ObjectId, ref: "User" }],
  followers: [{ type: mongoose.Types.ObjectId, ref: "User" }],
  //   posts: [posts],
  //   sharedPosts: [sharedPosts],
});

const User = mongoose.model("User", userSchema);

User.syncIndexes();
// (async () => {
//   await User.syncIndexes();
// })();

module.exports = User;
