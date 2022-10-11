const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    content: String,
    creator: { type: mongoose.Types.ObjectId, ref: 'User', required: true },
    timeOfCreation: { type: Date, default: Date.now() },
    postId: { type: mongoose.Types.ObjectId, ref: 'Post', required: true }
});

const CommentModel = mongoose.model("Comment", commentSchema);

module.exports = CommentModel;