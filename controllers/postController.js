const PostModel = require("../models/postModel");
const UserModel = require("../models/userModel");
const { cloudinary } = require("../utils/cloudinary");

const createPost = async (req, res) => {
  try {
    req.body.creator = req.user._id;

    if (req.body.originPost) {
      const post = await PostModel.findOne({ _id: req.body.originPost });
      post.sharedCount += 1;
      post.save();
    }

    if (req.body.postImages) {
      const urls = await Promise.all(
        req.body.postImages.map(async (img) => {
          const uploadedImgRes = await cloudinary.uploader.upload(img);
          return uploadedImgRes.secure_url;
        })
      );
      req.body.postImages = urls;
    }

    if (req.body.postAudio) {
      const uploadedAudioRes = await cloudinary.uploader.upload(
        req.body.postAudio,
        { resource_type: "video" }
      );

      req.body.postAudio = uploadedAudioRes.secure_url;
    }
    const newPost = await PostModel.create(req.body);
    await newPost.save();
    return res.status(201).json(newPost);
  } catch (e) {
    res.status(500).json("post creation failed " + e);
  }
};

const getPostById = async (req, res) => {
  try {
    const post = await PostModel.findOne({ _id: req.query.postId }).populate(
      "creator"
    );
    if (!post)
      return res.status(404).json(`Post ${req.query.postId} not exist`);
    return res.status(200).json(post);
  } catch (e) {
    return res.status(500).json(`Get post by id failed ${e}`);
  }
};

const getPosts = async (req, res) => {
  const page = req.query.page;
  let limit = 4;

  try {
    const currentUser = await UserModel.findOne({ email: req.user.email });

    const usersToInclude = currentUser.following;
    usersToInclude.push(currentUser._id);

    const postsCount = await PostModel.count({
      creator: {
        $in: usersToInclude,
      },
    });

    // const pagesToSkip = page - 1;
    // const skip =
    //   pagesToSkip !== 0 ? postsCount - pagesToSkip * limit : postsCount - limit;

    const skip = postsCount - page * limit;
    if (skip < 0) skip = 0;

    const cUserAndHisFollowingPosts = await PostModel.find({
      creator: {
        $in: usersToInclude,
      },
    })
      .skip(skip)
      .limit(limit)
      .populate("creator");

    if (cUserAndHisFollowingPosts.length === limit) limit = 1;

    cUserAndHisFollowingPosts.reverse();

    const creatorsToExclude = usersToInclude.map((userId) => {
      return { creator: { $ne: userId } };
    });

    const count = await PostModel.count({
      $and: creatorsToExclude,
    });

    let rendomIndex = Math.floor(Math.random() * count);
    if (rendomIndex + limit > count && rendomIndex - limit >= 0)
      rendomIndex -= limit;

    const randomPeopleUMKPosts = await PostModel.find({
      $and: creatorsToExclude,
    })
      .skip(rendomIndex)
      .limit(limit)
      .populate("creator");

    randomPeopleUMKPosts.reverse();

    const allPosts = cUserAndHisFollowingPosts.concat(randomPeopleUMKPosts);
    return res.status(200).json(allPosts);
  } catch (e) {
    res.status(500).json(`Failed to get posts ${e}`);
  }
};

const getPostsOfCurrentUser = async (req, res) => {
  try {
    const userPosts = await PostModel.find({
      creator: req.user._id,
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
      return res.status(403).json("Can't delete other's posts");

    if (postToDelete.postImages.length) {
      postToDelete.postImages.forEach((img) => {
        const imgPublicId = img.split("/").pop().split(".")[0];
        cloudinary.uploader.destroy(imgPublicId);
      });
    }

    if (postToDelete.postAudio) {
      const audPublicId = postToDelete.postAudio.split("/").pop().split(".")[0];
      cloudinary.uploader.destroy(audPublicId, {
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
    const postToEdit = await PostModel.findOne({ _id: req.body });
    if (req.user._id != postToEdit.creator) {
      return res.status(403).json("Can't edit other's posts");
    }

    const postImagesFromClient = req.body.postImages;
    if (
      postImagesFromClient &&
      JSON.stringify(postToEdit.postImages) !==
        JSON.stringify(postImagesFromClient)
    ) {
      const imagesToDestroy = postToEdit.postImages.filter(
        (img) => !postImagesFromClient.includes(img)
      );
      imagesToDestroy?.forEach((img) => {
        const imgPublicId = img.split("/").pop().split(".")[0];
        cloudinary.uploader.destroy(imgPublicId);
      });
      const imagesToUpload = postImagesFromClient.filter(
        (img) => !postToEdit.postImages.includes(img)
      );
      const urls = await Promise.all(
        imagesToUpload?.map(async (img) => {
          const uploadedImgRes = await cloudinary.uploader.upload(img);
          return uploadedImgRes.secure_url;
        })
      );

      req.body.postImages = postImagesFromClient.filter((img) =>
        postToEdit.postImages.includes(img)
      );
      req.body.postImages = [...req.body.postImages, ...urls];
      postToEdit.postImages = req.body.postImages;
    }

    if (
      req.body.postAudio !== undefined &&
      JSON.stringify(postToEdit.postAudio) !==
        JSON.stringify(req.body.postAudio)
    ) {
      const audPublicId = postToEdit.postAudio.split("/").pop().split(".")[0];
      cloudinary.uploader.destroy(audPublicId, {
        resource_type: "video",
      });
      if (req.body.postAudio.length) {
        const uploadedAudioRes = await cloudinary.uploader.upload(
          req.body.postAudio,
          { resource_type: "video" }
        );
        req.body.postAudio = uploadedAudioRes.secure_url;
      }
      postToEdit.postAudio = req.body.postAudio;
    }

    if (
      req.body.postText !== undefined &&
      JSON.stringify(postToEdit.postText) !== JSON.stringify(req.body.postText)
    ) {
      postToEdit.postText = req.body.postText;
    }

    if (!postToEdit.isEdited) {
      postToEdit.isEdited = true;
    }

    await postToEdit.save();
    return res.status(200).json(postToEdit);
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
  getPosts,
  getPostById,
  getPostsOfCurrentUser,
  getPostsOfUser,
  createPost,
  deletePost,
  editPost,
  addLike,
  removeLike,
};
