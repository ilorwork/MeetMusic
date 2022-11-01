import React, { useContext, useEffect, useState } from "react";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import style from "./PostComponent.module.css";
import ChatBubbleIcon from "@mui/icons-material/ChatBubble";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import ScreenShareIcon from "@mui/icons-material/ScreenShare";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import {
  Avatar,
  Button,
  CardActions,
  CardContent,
  IconButton,
  ImageList,
  ImageListItem,
  Menu,
  MenuItem,
  Modal,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import { useNavigate } from "react-router-dom";
import CommentComponent from "./CommentComponent";
import { v4 as uuid } from "uuid";
import CreateNewComment from "./CreateNewComment";
import UserContext from "./layout/UserContext";
import { followUser, notifyUser } from "../helpers/userHelpers";
import Textarea from "@mui/joy/Textarea";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import AudioFileIcon from "@mui/icons-material/AudioFile";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  checkIsUserLikeThePost,
  createPost,
  deletePost,
  editPost,
  getPostById,
  getPostComments,
  likePost,
  unlikePost,
} from "../helpers/postHelpers";
import SharedPost from "./SharedPost";
import LoaderContext from "./context/LoaderContext";

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  border: "2px solid #000",
  borderRadius: 2,
  boxShadow: 24,
  p: 4,
};

const PostComponent = ({
  post,
  getPosts,
  getPeopleYouMayKnow,
  getUserInfo,
  isUserProfilePage = false,
}) => {
  const [anchorPostSettings, setAnchorPostSettings] = useState(null);
  const [isCommentOpen, setIsCommentOpen] = useState(false);
  const [commentsOfPost, setCommentsOfPost] = useState([]);
  const [commentsCount, setCommentsCount] = useState(post.commentsCount);
  const [likesCount, setLikesCount] = useState(post.likesCount);
  const [isUserLikeThePost, setIsUserLikeThePost] = useState(false);

  const [isInEditingMode, setIsInEditingMode] = useState(false);
  const [postText, setPostText] = useState(post.postText);
  const [postImages, setPostImages] = useState(post.postImages);
  const [postAudio, setPostAudio] = useState(post.postAudio);
  const [isEdited, setIsEdited] = useState(post.isEdited);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [sharedPostText, setSharedPostText] = useState("");
  const [isSharePostOpen, setIsSharePostOpen] = useState(false);

  const { currentUserInfo } = useContext(UserContext);
  const { setLoading } = useContext(LoaderContext);

  useEffect(() => {
    getCommentsOfPost();
    getDataIsUserLikeThePost();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleFollowUser = async () => {
    setLoading(true);
    try {
      await followUser(post.creator._id, currentUserInfo);
      getPeopleYouMayKnow();
      await getUserInfo();
      getPosts();
    } catch (e) {
      throw new Error("follow user failed " + e);
    } finally {
      setLoading(false);
    }
  };

  const getDataIsUserLikeThePost = async () => {
    try {
      const isLiked = await checkIsUserLikeThePost(post._id);
      setIsUserLikeThePost(isLiked);
    } catch (e) {
      console.error("get data is user like the post failed " + e);
    }
  };

  const addLike = async () => {
    try {
      await likePost(post._id);
      setIsUserLikeThePost(!isUserLikeThePost);
      setLikesCount(likesCount + 1);

      if (post.creator._id === currentUserInfo._id) return;
      notifyUser(
        post.creator._id,
        `${currentUserInfo.firstName} ${currentUserInfo.lastName} liked your post`
      );
    } catch (e) {
      console.error("Like post failed " + e);
    }
  };

  const removeLike = async () => {
    try {
      await unlikePost(post._id);
      setIsUserLikeThePost(!isUserLikeThePost);
      setLikesCount(likesCount - 1);
    } catch (e) {
      console.error("unlike failed " + e);
    }
  };

  const getCommentsOfPost = async () => {
    try {
      const postComments = await getPostComments(post._id);
      setCommentsOfPost(postComments);
    } catch (e) {
      console.error("get post comments failed " + e);
    }
  };

  const navigate = useNavigate();

  const handleDeletePost = async () => {
    setLoading(true);
    setIsDeleteModalOpen(false);
    try {
      await deletePost(post._id);

      getPosts();
      setAnchorPostSettings(null);
    } catch (e) {
      if (e.response.status === 401) {
        navigate("/login");
      } else throw e;
    } finally {
      setLoading(false);
    }
  };

  const getImagesCols = () => {
    if (postImages.length < 3) return postImages.length;
    else return 3;
  };

  const handleImageSelection = (e) => {
    if (postImages.length > 8) return;

    const reader = new FileReader();
    reader.onload = () => {
      if (reader.readyState === 2) {
        setPostImages([...postImages, reader.result]);
      }
    };

    reader.readAsDataURL(e.target.files[0]);
  };

  const handleAudioSelection = (e) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (reader.readyState === 2) setPostAudio(reader.result);
    };

    reader.readAsDataURL(e.target.files[0]);
  };

  const handleDeleteImg = (img) => {
    setPostImages(postImages.filter((currentImg) => currentImg !== img));
  };

  const handleDeleteAudio = () => {
    setPostAudio("");
  };

  const handleEditPost = async () => {
    if (!postText.trim().length && !postImages.length && !postAudio) return;
    if (
      postText === post.postText &&
      postImages === post.postImages &&
      postAudio === post.postAudio
    ) {
      setIsInEditingMode(false);
      return;
    }

    const updatedPost = { _id: post._id, postText, postImages, postAudio };
    try {
      await editPost(updatedPost);
      setIsInEditingMode(false);
      setIsEdited(true);
    } catch (e) {
      console.error("edit post failed " + e);
    }
  };

  const handleSharePost = async () => {
    setLoading(true);
    setIsSharePostOpen(false);
    const originPost = post.originPost ? post.originPost : post._id;
    const sharedPost = { postText: sharedPostText, originPost: originPost };

    try {
      await createPost(sharedPost);

      setSharedPostText("");
      getPosts();

      setLoading(false);

      let creator;
      if (post.originPost) {
        const originPostObj = await getPostById(post.originPost);
        creator = originPostObj.creator._id;
      } else {
        creator = post.creator._id;
      }

      if (creator === currentUserInfo._id) return;

      notifyUser(
        creator,
        `${currentUserInfo.firstName} ${currentUserInfo.lastName} shared your post`
      );
    } catch (e) {
      if (e.response.status === 401) {
        navigate("/login");
      } else throw e;
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 2 }}>
      <Card sx={{ mt: 2 }}>
        <CardHeader
          avatar={
            <button
              className={style.profileBtn}
              onClick={() => navigate(`/user-profile/${post.creator._id}`)}
            >
              <Avatar src={post.creator.profilePic} />
            </button>
          }
          title={`${post.creator.firstName} ${post.creator.lastName}`}
          subheader={new Date(post.timeOfCreation).toLocaleString()}
          action={
            <>
              <div className={style.threePoints}>
                {currentUserInfo._id === post.creator._id && (
                  <IconButton
                    onClick={(e) => setAnchorPostSettings(e.currentTarget)}
                  >
                    <MoreVertIcon />
                  </IconButton>
                )}

                {!post.creator.followers.includes(currentUserInfo._id) &&
                  post.creator._id !== currentUserInfo._id &&
                  !isUserProfilePage && (
                    <Button
                      style={{
                        background: "rgb(209, 46, 100)",
                        fontSize: 8,
                        padding: 4,
                      }}
                      variant="contained"
                      onClick={handleFollowUser}
                    >
                      Follow
                    </Button>
                  )}
              </div>
              {isEdited && (
                <span
                  style={{
                    width: 60,
                    fontWeight: "bold",
                    fontSize: 14,
                    marginTop: 10,
                    color: "#92a5de",
                  }}
                >
                  edited
                </span>
              )}
              <Menu
                anchorEl={anchorPostSettings}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "right",
                }}
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                open={Boolean(anchorPostSettings)}
                onClose={() => setAnchorPostSettings(null)}
              >
                <MenuItem
                  onClick={() => {
                    setIsInEditingMode(true);
                    setAnchorPostSettings(null);
                  }}
                >
                  <Typography>Edit Post</Typography>
                </MenuItem>

                <MenuItem onClick={() => setIsDeleteModalOpen(true)}>
                  <Typography color={"error"}>Delete Post</Typography>
                </MenuItem>
              </Menu>
            </>
          }
        ></CardHeader>
        <Modal
          open={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
        >
          <Box sx={modalStyle} className={style.deletePostModal}>
            <Typography variant="h6" component="h2">
              Are You Sure?
            </Typography>
            <div className={style.modalBtns}>
              <Button
                variant="contained"
                style={{ background: "rgb(209, 46, 100)" }}
                onClick={handleDeletePost}
              >
                Yes
              </Button>
              <Button
                variant="contained"
                style={{ background: "rgb(19, 137, 137)" }}
                onClick={() => setIsDeleteModalOpen(false)}
              >
                No
              </Button>
            </div>
          </Box>
        </Modal>
        {isInEditingMode && (
          <Box>
            <Textarea
              placeholder="Write some text"
              value={postText}
              onChange={(e) => setPostText(e.target.value)}
            />
            {postImages && (
              <ImageList cols={postImages.length < 5 ? 2 : 3} rowHeight={164}>
                {postImages.map((img) => (
                  <div key={uuid()} style={{ border: "solid gray 1px" }}>
                    <Button
                      onClick={() => {
                        handleDeleteImg(img);
                      }}
                      style={{ fontSize: 10, color: "red" }}
                      variant="outlined"
                      startIcon={<DeleteIcon color="error" />}
                    >
                      Remove image
                    </Button>
                    <ImageListItem sx={{ overflow: "hidden" }}>
                      <img src={img} alt="post img" />
                    </ImageListItem>
                  </div>
                ))}
              </ImageList>
            )}
            {postAudio && (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  border: "solid gray 1px",
                }}
              >
                <Button
                  onClick={() => {
                    handleDeleteAudio();
                  }}
                  sx={{ fontSize: 10, color: "red" }}
                  variant="outlined"
                  startIcon={<DeleteIcon color="error" />}
                >
                  Remove audio
                </Button>
                <audio controls>
                  <source src={postAudio} />
                </audio>
              </div>
            )}
            {!post.originPost && (
              <div>
                {postImages.length <= 8 && (
                  <IconButton
                    sx={{ fontSize: 16 }}
                    color="primary"
                    aria-label="upload picture"
                    component="label"
                  >
                    <input
                      hidden
                      accept="image/*"
                      type="file"
                      onChange={handleImageSelection}
                    />
                    <AddPhotoAlternateIcon />
                    Upload Image
                  </IconButton>
                )}

                {!postAudio && (
                  <IconButton
                    sx={{ fontSize: 16 }}
                    title="Upload Audio"
                    color="primary"
                    aria-label="upload audio"
                    component="label"
                  >
                    <input
                      hidden
                      accept="audio/*"
                      type="file"
                      onChange={handleAudioSelection}
                    />
                    <AudioFileIcon />
                    Upload Audio
                  </IconButton>
                )}
              </div>
            )}
            <Button
              variant="contained"
              sx={{ width: 200, mt: 5 }}
              style={{ background: "rgb(19 137 137)" }}
              onClick={handleEditPost}
            >
              Edit post
            </Button>
          </Box>
        )}

        {!isInEditingMode && (
          <CardContent>
            {postText && <Box>{postText}</Box>}
            {postImages.length !== 0 && (
              <ImageList
                cols={getImagesCols()}
                rowHeight={getImagesCols() < 2 ? 400 : 200}
              >
                {postImages.map((img) => (
                  <ImageListItem sx={{ overflow: "hidden" }} key={uuid()}>
                    <img src={img} alt="post img" />
                  </ImageListItem>
                ))}
              </ImageList>
            )}
            {postAudio && (
              <audio controls>
                <source src={postAudio} />
              </audio>
            )}
          </CardContent>
        )}
        {post.originPost && <SharedPost postId={post.originPost} />}

        <Box className={style.footerIndecators}>
          <div>{likesCount} Likes</div>
          <div>{commentsCount} Comments</div>
          <div>{post.sharedCount} Shares</div>
        </Box>
        <CardActions className={style.actionsContainer}>
          {!isUserLikeThePost && (
            <IconButton onClick={addLike}>
              <ThumbUpIcon color="inherit" />
            </IconButton>
          )}
          {isUserLikeThePost && (
            <IconButton onClick={removeLike}>
              <ThumbUpIcon style={{ color: "rgb(209, 46, 100)" }} />
            </IconButton>
          )}
          {!isCommentOpen && (
            <IconButton onClick={() => setIsCommentOpen(!isCommentOpen)}>
              <ChatBubbleIcon color="inherit" />
            </IconButton>
          )}
          {isCommentOpen && (
            <IconButton onClick={() => setIsCommentOpen(!isCommentOpen)}>
              <ChatBubbleIcon style={{ color: "#92a5de" }} />
            </IconButton>
          )}
          <IconButton onClick={() => setIsSharePostOpen(true)}>
            <ScreenShareIcon />
          </IconButton>
          <Modal
            open={isSharePostOpen}
            onClose={() => setIsSharePostOpen(false)}
          >
            <Paper className={style.shareModal}>
              <Typography style={{ fontWeight: "bold", fontSize: 17 }}>
                You can add some text before sharing
              </Typography>
              <TextField
                label="Write some text"
                multiline
                autoFocus
                sx={{ width: 300 }}
                value={sharedPostText}
                onChange={(e) => setSharedPostText(e.target.value)}
              />

              <Button
                variant="contained"
                style={{ background: "rgb(209, 46, 100)" }}
                sx={{ my: 3 }}
                onClick={handleSharePost}
              >
                Share
              </Button>
            </Paper>
          </Modal>
        </CardActions>
        {isCommentOpen && (
          <CreateNewComment
            post={post}
            getCommentsOfPost={getCommentsOfPost}
            commentsCount={commentsCount}
            setCommentsCount={setCommentsCount}
          />
        )}
        {isCommentOpen &&
          commentsOfPost.map((comment) => (
            <CommentComponent
              comment={comment}
              post={post}
              getCommentsOfPost={getCommentsOfPost}
              commentsCount={commentsCount}
              setCommentsCount={setCommentsCount}
              key={uuid()}
            />
          ))}
      </Card>
    </div>
  );
};

export default PostComponent;
