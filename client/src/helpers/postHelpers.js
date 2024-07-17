import axios from "axios";

const base_url = process.env.REACT_APP_BASE_URL;

const createPost = async (newPost) => {
  const token = localStorage.getItem("token");
  try {
    await axios.post(`${base_url}/posts/`, newPost, {
      withCredentials: true,
      headers: {
        authorization: token,
      },
    });
  } catch (e) {
    throw e;
  }
};

const editPost = async (updatedPost) => {
  const token = localStorage.getItem("token");
  try {
    await axios.put(`${base_url}/posts/`, updatedPost, {
      withCredentials: true,
      headers: {
        authorization: token,
      },
    });
  } catch (e) {
    throw e;
  }
};

const deletePost = async (postId) => {
  const token = localStorage.getItem("token");
  try {
    await axios.delete(`${base_url}/posts/`, {
      withCredentials: true,
      headers: {
        authorization: token,
      },
      data: {
        _id: postId,
      },
    });
  } catch (e) {
    throw e;
  }
};

const getPostById = async (postId) => {
  const token = localStorage.getItem("token");
  try {
    const res = await axios.get(`${base_url}/posts/post`, {
      withCredentials: true,
      headers: {
        authorization: token,
      },
      params: { postId },
    });
    return res.data;
  } catch (e) {
    throw e;
  }
};

const getCurrentUserPosts = async () => {
  const token = localStorage.getItem("token");
  try {
    const res = await axios.get(`${base_url}/posts/current-user-posts`, {
      withCredentials: true,
      headers: {
        authorization: token,
      },
    });
    return res.data;
  } catch (e) {
    throw e;
  }
};

const getHomePosts = async () => {
  const token = localStorage.getItem("token");
  try {
    const res = await axios.get(`${base_url}/posts/`, {
      withCredentials: true,
      headers: {
        authorization: token,
      },
    });
    return res.data;
  } catch (e) {
    throw e;
  }
};

const getPostsByUserId = async (userId) => {
  try {
    const res = await axios.post(`${base_url}/posts/user-posts`, {
      _id: userId,
    });
    return res.data;
  } catch (e) {
    throw e;
  }
};

const getPostComments = async (postId) => {
  const token = localStorage.getItem("token");
  try {
    const res = await axios.post(
      `${base_url}/comments/post-comments/`,
      {
        _id: postId,
      },
      {
        withCredentials: true,
        headers: {
          authorization: token,
        },
      }
    );
    return res.data;
  } catch (e) {
    throw e;
  }
};

const getCommentReplies = async (commentId) => {
  const token = localStorage.getItem("token");
  try {
    const res = await axios.post(
      `${base_url}/comments-to-comments/comment-comments/`,
      {
        _id: commentId,
      },
      {
        withCredentials: true,
        headers: {
          authorization: token,
        },
      }
    );
    return res.data;
  } catch (e) {
    throw e;
  }
};

const getReplyReplies = async (replyId) => {
  const token = localStorage.getItem("token");
  try {
    const res = await axios.post(
      `${base_url}/comments-to-comments/comment-comments/`,
      {
        _id: replyId,
      },
      {
        withCredentials: true,
        headers: {
          authorization: token,
        },
      }
    );
    return res.data;
  } catch (e) {
    throw e;
  }
};

const createComment = async (newComment) => {
  const token = localStorage.getItem("token");
  try {
    await axios.post(`${base_url}/comments/`, newComment, {
      withCredentials: true,
      headers: {
        authorization: token,
      },
    });
  } catch (e) {
    throw e;
  }
};

const editComment = async (commentId, editedContent) => {
  const token = localStorage.getItem("token");
  try {
    await axios.put(
      `${base_url}/comments/`,
      {
        _id: commentId,
        content: editedContent,
      },
      {
        withCredentials: true,
        headers: {
          authorization: token,
        },
      }
    );
  } catch (e) {
    throw e;
  }
};

const deleteComment = async (commentId, postId) => {
  const token = localStorage.getItem("token");
  try {
    await axios.delete(`${base_url}/comments/`, {
      withCredentials: true,
      headers: {
        authorization: token,
      },
      data: {
        _id: commentId,
        postId: postId,
      },
    });
  } catch (e) {
    throw e;
  }
};

const createReply = async (newReply) => {
  const token = localStorage.getItem("token");
  try {
    await axios.post(`${base_url}/comments-to-comments/`, newReply, {
      withCredentials: true,
      headers: {
        authorization: token,
      },
    });
  } catch (e) {
    throw e;
  }
};

const editReply = async (replyId, editedContent) => {
  const token = localStorage.getItem("token");
  try {
    await axios.put(
      `${base_url}/comments-to-comments/`,
      {
        _id: replyId,
        content: editedContent,
      },
      {
        withCredentials: true,
        headers: {
          authorization: token,
        },
      }
    );
  } catch (e) {
    throw e;
  }
};

const deleteReply = async (replyId, commentId) => {
  const token = localStorage.getItem("token");
  try {
    await axios.delete(`${base_url}/comments-to-comments/`, {
      withCredentials: true,
      headers: {
        authorization: token,
      },
      data: {
        _id: replyId,
        commentId: commentId,
      },
    });
  } catch (e) {
    throw e;
  }
};

const checkIsUserLikeThePost = async (postId) => {
  const token = localStorage.getItem("token");
  try {
    const res = await axios.post(
      `${base_url}/likes/has-liked`,
      {
        postId: postId,
      },
      {
        withCredentials: true,
        headers: {
          authorization: token,
        },
      }
    );
    return res.data.isUserLikeThePost;
  } catch (e) {
    throw e;
  }
};

const likePost = async (postId) => {
  const token = localStorage.getItem("token");
  try {
    await axios.post(
      `${base_url}/likes/`,
      { postId: postId },
      {
        withCredentials: true,
        headers: {
          authorization: token,
        },
      }
    );
  } catch (e) {
    throw e;
  }
};

const unlikePost = async (postId) => {
  const token = localStorage.getItem("token");
  try {
    await axios.delete(`${base_url}/likes/`, {
      withCredentials: true,
      headers: {
        authorization: token,
      },
      data: {
        postId: postId,
      },
    });
  } catch (e) {
    throw e;
  }
};

const textValidation = (e, text) => {
  e.preventDefault();
  return !!text.trim().length;
};

const linkifyLinksWithinText = (text) => {
  // Regular expression to find URLs within the text
  const urlRegex = /(https?:\/\/[^\s]+)/g;

  // Replace URLs with clickable links
  const textWithLinks = text.replace(urlRegex, (url) => {
    return `<a href="${url}" target="_blank">${url}</a>`;
  });

  return textWithLinks;
};

export {
  createPost,
  editPost,
  deletePost,
  getPostById,
  getCurrentUserPosts,
  getHomePosts,
  getPostsByUserId,
  getPostComments,
  getCommentReplies,
  getReplyReplies,
  createComment,
  editComment,
  deleteComment,
  createReply,
  editReply,
  deleteReply,
  checkIsUserLikeThePost,
  likePost,
  unlikePost,
  textValidation,
  linkifyLinksWithinText,
};
