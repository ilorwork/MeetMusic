const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  postText: { type: String, default: "" },
  postImage: { type: String, default: "" },
  postAudio: { type: String, default: "" },
  likesCount: { type: Number, default: 0 },
  commentsCount: { type: Number, default: 0 },
  sharedCount: { type: Number, default: 0 },
  creator: { type: mongoose.Types.ObjectId, ref: "User", required: true },
  timeOfCreation: { type: Date, default: Date.now() },
});

const PostModel = mongoose.model("Post", postSchema);
module.exports = PostModel;
