const mongoose = require("mongoose");

const commentToCommentSchema = new mongoose.Schema({
  content: { type: String, required: true },
  creator: { type: mongoose.Types.ObjectId, ref: "User", required: true },
  timeOfCreation: Date,
  commentId: { type: mongoose.Types.ObjectId, ref: "Comment", required: true },
  commentsToCommentCount: { type: Number, default: 0 },
  isEdited: { type: Boolean, default: false }
});

const CommentToCommentModel = mongoose.model(
  "CommentToComment",
  commentToCommentSchema
);

module.exports = CommentToCommentModel;
