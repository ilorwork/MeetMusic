const mongoose = require('mongoose');

const commentToCommentSchema = new mongoose.Schema({
    content: String,
    creator: { type: mongoose.Types.ObjectId, ref: 'User', required: true },
    timeOfCreation: Date,
    commentId: { type: mongoose.Types.ObjectId, ref: 'Comment', required: true },
    commentsToCommentCount: { type: Number, default: 0 }
});

const CommentToCommentModel = mongoose.model("CommentToComment", commentToCommentSchema);

module.exports = CommentToCommentModel;