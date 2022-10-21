const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
  content: { type: String, required: true },
  creator: { type: mongoose.Types.ObjectId, ref: "User", required: true },
  timeOfCreation: Date,
  postId: { type: mongoose.Types.ObjectId, ref: "Post", required: true },
  commentsToCommentCount: { type: Number, default: 0 },
});

const CommentModel = mongoose.model("Comment", commentSchema);

module.exports = CommentModel;
