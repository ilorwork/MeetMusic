const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  postText: { type: String, default: "" },
  postImages: [String],
  postAudio: { type: String, default: "" },
  likesCount: { type: Number, default: 0 },
  commentsCount: { type: Number, default: 0 },
  sharedCount: { type: Number, default: 0 },
  creator: { type: mongoose.Types.ObjectId, ref: "User", required: true },
  timeOfCreation: { type: Date, default: Date.now() },
  isEdited: { type: Boolean, default: false },
  originPost: { type: mongoose.Types.ObjectId, ref: "Post" },
});

const PostModel = mongoose.model("Post", postSchema);
module.exports = PostModel;
