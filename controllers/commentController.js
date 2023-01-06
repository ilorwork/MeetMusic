const PostModel = require("../models/postModel");
const CommentModel = require("../models/commentModel");
const timeAgo = require("../helpers/calculationTime");

const createComment = async (req, res) => {
  try {
    req.body.creator = req.user._id;

    const newComment = await CommentModel.create(req.body);

    const postCommented = await PostModel.findOne({ _id: req.body.postId });
    postCommented.commentsCount++;
    await postCommented.save();

    return res.status(201).json({
      newComment: newComment,
      commentsCount: postCommented.commentsCount,
    });
  } catch (e) {
    res.status(500).json("comment creation failed " + e);
  }
};

const getCommentsOfPost = async (req, res) => {
  try {
    const commentsOfPost = await CommentModel.find({ postId: req.body._id })
      .populate("creator")
      .lean();
    commentsOfPost.forEach((comment) => {
      comment.timeOfCreation = timeAgo(comment.timeOfCreation);
    });
    commentsOfPost.reverse();

    return res.status(200).json(commentsOfPost);
  } catch (e) {
    return res.status(500).json("get comments of post failed " + e);
  }
};

const deleteComment = async (req, res) => {
  try {
    const commentToDelete = await CommentModel.findOne({
      _id: req.body._id,
    }).populate("creator");
    if (req.user.email !== commentToDelete.creator.email) {
      return res.status(403).json("Can't delete other's comments");
    }
    const deletedComment = await CommentModel.deleteOne({ _id: req.body._id });

    const postCommented = await PostModel.findOne({ _id: req.body.postId });
    postCommented.commentsCount--;
    await postCommented.save();

    return res.status(200).json({
      deletedComment: deletedComment,
      commentsCount: postCommented.commentsCount,
    });
  } catch (e) {
    return res.status(500).json("delete comment failed " + e);
  }
};

const editComment = async (req, res) => {
  try {
    const commentToEdit = await CommentModel.findOne({
      _id: req.body._id,
    }).populate("creator");

    if (req.user.email !== commentToEdit.creator.email) {
      return res.status(403).json("Can't edit other's comments");
    }

    commentToEdit.content = req.body.content;
    if (!commentToEdit.isEdited) {
      commentToEdit.isEdited = true;
    }

    await commentToEdit.save();
    return res.status(200).json({
      editedComment: commentToEdit,
    });
  } catch (e) {
    return res.status(500).json("edit comment failed " + e);
  }
};

module.exports = {
  createComment,
  getCommentsOfPost,
  deleteComment,
  editComment,
};
