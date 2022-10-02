const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
    postText: { type: String, required: true },
    postImage: String,
    postAudio: String,
    likesCount: { type: Number, required: true },
    commentsCount: { type: Number, required: true },
    sharedCount: { type: Number, required: true },
    creator: { type: mongoose.Types.ObjectId, required: true },
    timeOfCreation: { type: Date, required: true }
});

const Post = mongoose.model("Post", postSchema);
module.exports = Post;
