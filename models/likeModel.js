const mongoose = require("mongoose");

const likeSchema = new mongoose.Schema({
    creator: { type: mongoose.Types.ObjectId, ref: 'User', required: true },
    postId: { type: mongoose.Types.ObjectId, ref: 'Post', required: true },
})

const LikeModel = mongoose.model("Like", likeSchema);
module.exports = LikeModel;