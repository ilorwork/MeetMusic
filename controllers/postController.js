const PostModel = require("../models/postModel");
const UserModel = require("../models/userModel");
const { cloudinary } = require("../utils/cloudinary");

const createPost = async (req, res) => {
  try {
    const creator = await UserModel.findOne({ email: req.user.email });
    req.body.creator = creator._id;
    if (req.body.postImage) {
      const uploadedImgRes = await cloudinary.uploader.upload(
        req.body.postImage
      );
      req.body.postImage = uploadedImgRes.url;
    }

    if (req.body.postAudio) {
      const uploadedAudioRes = await cloudinary.uploader.upload(
        req.body.postAudio,
        { resource_type: "video" }
      );

      req.body.postAudio = uploadedAudioRes.url;
    }
    const newPost = await PostModel.create(req.body);
    await newPost.save();
    return res.status(201).json(newPost);
  } catch (e) {
    res.status(500).json("post creation failed " + e);
  }
};

const getAllPosts = async (req, res) => {
  try {
    const allPostsWithCreator = await PostModel.find({}).populate("creator");
    allPostsWithCreator.reverse();
    return res.status(200).json(allPostsWithCreator);
  } catch (e) {
    res.status(500).json(`Failed to get all posts ${e}`);
  }
};

const getPostsOfCurrentUser = async (req, res) => {
  try {
    const userWhoseProfile = await UserModel.findOne({ email: req.user.email });
    const userPosts = await PostModel.find({
      creator: userWhoseProfile._id,
    }).populate("creator");

    userPosts.reverse();
    return res.status(200).json(userPosts);
  } catch (e) {
    res.status(500).json("get current user posts failed " + e);
  }
};

const getPostsOfUser = async (req, res) => {
  try {
    const userPosts = await PostModel.find({ creator: req.body._id }).populate(
      "creator"
    );
    userPosts.reverse();
    return res.status(200).json(userPosts);
  } catch (e) {
    res.status(500).json("get user posts failed " + e);
  }
};

const deletePost = async (req, res) => {
  try {
    const postToDelete = await PostModel.findOne({ _id: req.body }).populate(
      "creator"
    );
    if (req.user.email !== postToDelete.creator.email)
      return res.status(401).json("Can't delete other's posts");

    if (postToDelete.postImage) {
      const imgPublicId = postToDelete.postImage.split("/").pop().split(".")[0];
      await cloudinary.uploader.destroy(imgPublicId);
    }

    if (postToDelete.postAudio) {
      const audPublicId = postToDelete.postAudio.split("/").pop().split(".")[0];
      await cloudinary.uploader.destroy(audPublicId, {
        resource_type: "video",
      });
    }

    const deletedPost = await PostModel.deleteOne({ _id: req.body });

    return res.status(200).json(deletedPost);
  } catch (e) {
    res.status(500).json("delete post failed " + e);
  }
};

const editPost = async (req, res) => {
  try {
    // check if the userId is equal to creatorId
    const editedPost = await PostModel.findOne({ _id: req.body });
    editedPost.postText = req.body.postText;
    editedPost.postImage = req.body.postImage;
    editedPost.postAudio = req.body.postAudio;
    await editedPost.save();
    return res.status(200).json(editedPost);
  } catch (e) {
    res.status(500).json("edit post failed " + e);
  }
};

const addLike = async (req, res) => {
  try {
    const post = await PostModel.findOne({ _id: req.body });
    post.likesCount++;
    await post.save();
    return res.status(200).json(post);
  } catch (e) {
    res.status(500).json("add like failed " + e);
  }
};

const removeLike = async (req, res) => {
  try {
    const post = await PostModel.findOne({ _id: req.body });
    if (post.likesCount === 0) {
      return res
        .status(400)
        .json("The amount of likes cannot be less than zero");
    }
    post.likesCount--;
    await post.save();
    return res.status(200).json(post);
  } catch (e) {
    res.status(500).json("remove like failed " + e);
  }
};

module.exports = {
  getAllPosts,
  getPostsOfCurrentUser,
  getPostsOfUser,
  createPost,
  deletePost,
  editPost,
  addLike,
  removeLike,
};
