const CommentModel = require("../models/commentModel");
const CommentToCommentModel = require("../models/commentToCommentModel");
const timeAgo = require("../helpers/calculationTime");

const createCommentToComment = async (req, res) => {
  try {
    req.body.creator = req.user._id;

    const newCommentToComment = await CommentToCommentModel.create(req.body);
    await newCommentToComment.save();

    const commentCommented =
      (await CommentModel.findOne({ _id: req.body.commentId })) ||
      (await CommentToCommentModel.findOne({ _id: req.body.commentId }));
    commentCommented.commentsToCommentCount++;
    await commentCommented.save();

    return res.status(201).json({
      newComment: newCommentToComment,
      commentsToCommentCount: commentCommented.commentsToCommentCount,
    });
  } catch (e) {
    res.status(500).json("comment to comment creation failed " + e);
  }
};

const getCommentsOfComment = async (req, res) => {
  try {
    const commentsOfComment = await CommentToCommentModel.find({
      commentId: req.body._id,
    })
      .populate("creator")
      .lean();
    commentsOfComment.forEach((comment) => {
      comment.timeOfCreation = timeAgo(comment.timeOfCreation);
    });
    commentsOfComment.reverse();
    return res.status(200).json(commentsOfComment);
  } catch (e) {
    return res.status(500).json("get comments of comment failed " + e);
  }
};

const deleteCommentToComment = async (req, res) => {
  try {
    const commentToCommentToDelete = await CommentToCommentModel.findOne({
      _id: req.body._id,
    }).populate("creator");
    if (req.user.email !== commentToCommentToDelete.creator.email) {
      return res.status(403).json("Can't delete other's comments");
    }
    const deletedCommentToComment = await CommentToCommentModel.deleteOne({
      _id: req.body._id,
    });

    const commentCommented =
      (await CommentModel.findOne({ _id: req.body.commentId })) ||
      (await CommentToCommentModel.findOne({ _id: req.body.commentId }));
    commentCommented.commentsToCommentCount--;
    await commentCommented.save();

    return res.status(200).json({
      deletedCommentToComment: deletedCommentToComment,
      commentsToCommentCount: commentCommented.commentsToCommentCount,
    });
  } catch (e) {
    return res.status(500).json("delete comment to comment failed " + e);
  }
};

const editCommentToComment = async (req, res) => {
  try {
    const commentToCommentToEdit = await CommentToCommentModel.findOne({
      _id: req.body._id,
    }).populate("creator");

    if (req.user.email !== commentToCommentToEdit.creator.email) {
      return res.status(403).json("Can't edit other's comments");
    }

    commentToCommentToEdit.content = req.body.content;
    if (!commentToCommentToEdit.isEdited) {
      commentToCommentToEdit.isEdited = true;
    }

    await commentToCommentToEdit.save();
    return res.status(200).json({
      editedCommentToComment: commentToCommentToEdit,
    });
  } catch (e) {
    return res.status(500).json("edit comment to comment failed " + e);
  }
};

module.exports = {
  createCommentToComment,
  getCommentsOfComment,
  deleteCommentToComment,
  editCommentToComment,
};
