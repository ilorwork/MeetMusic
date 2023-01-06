const LikeModel = require("../models/likeModel");
const PostModel = require("../models/postModel");

const addLike = async (req, res) => {
  try {
    req.body.creator = req.user._id;

    const newLike = await LikeModel.create(req.body);

    const likedPost = await PostModel.findOne({ _id: req.body.postId });
    likedPost.likesCount += 1;

    await likedPost.save();

    return res
      .status(201)
      .json({ newLike: newLike, postLikesAmount: likedPost.likesCount });
  } catch (e) {
    res.status(500).json("add like failed " + e);
  }
};

const removeLike = async (req, res) => {
  try {
    req.body.creator = req.user._id;

    const removedLike = await LikeModel.deleteOne({
      creator: req.body.creator,
      postId: req.body.postId,
    });

    const unLikedPost = await PostModel.findOne({ _id: req.body.postId });
    unLikedPost.likesCount -= 1;

    await unLikedPost.save();

    return res.status(200).json({
      removedLike: removedLike,
      postLikesAmount: unLikedPost.likesCount,
    });
  } catch (e) {
    return res.status(500).json("remove like failed " + e);
  }
};

const isUserLikeThePost = async (req, res) => {
  try {
    req.body.creator = req.user._id;

    const isUserLikeThePost = await LikeModel.findOne({
      creator: req.body.creator,
      postId: req.body.postId,
    });

    if (isUserLikeThePost) {
      return res.status(200).json({ isUserLikeThePost: true });
    } else {
      return res.status(200).json({ isUserLikeThePost: false });
    }
  } catch (e) {
    return res.status(500).json("the test is user like the post failed " + e);
  }
};

module.exports = {
  addLike,
  removeLike,
  isUserLikeThePost,
};
