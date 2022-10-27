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
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import CommentComponent from "./CommentComponent";
import { v4 as uuid } from "uuid";
import CreateNewComment from "./CreateNewComment";
import UserContext from "./layout/UserContext";
import { notifyUser } from "../helpers/userHelpers";
import Textarea from "@mui/joy/Textarea";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import AudioFileIcon from "@mui/icons-material/AudioFile";
import DeleteIcon from "@mui/icons-material/Delete";
import config from "../config/config.json";

const PostComponent = ({ post, getPosts }) => {
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

  const { currentUserInfo } = useContext(UserContext);

  useEffect(() => {
    getCommentsOfPost();
    getDataIsUserLikeThePost();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getDataIsUserLikeThePost = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await axios.post(
        `${config.base_url}/likes/has-liked`,
        {
          postId: post._id,
        },
        {
          withCredentials: true,
          headers: {
            authorization: token,
          },
        }
      );
      setIsUserLikeThePost(res.data.isUserLikeThePost);
    } catch (e) {
      console.error("get data is user like the post failed " + e);
    }
  };

  const addLike = async () => {
    const token = localStorage.getItem("token");
    try {
      await axios.post(
        `${config.base_url}/likes/`,
        {
          postId: post._id,
        },
        {
          withCredentials: true,
          headers: {
            authorization: token,
          },
        }
      );
      setIsUserLikeThePost(!isUserLikeThePost);
      setLikesCount(likesCount + 1);

      if (post.creator._id === currentUserInfo._id) return;
      notifyUser(
        post.creator._id,
        `${currentUserInfo.firstName} ${currentUserInfo.lastName} liked your post`
      );
    } catch (e) {
      console.error("add like failed " + e);
    }
  };

  const removeLike = async () => {
    const token = localStorage.getItem("token");
    try {
      await axios.delete(`${config.base_url}/likes/`, {
        withCredentials: true,
        headers: {
          authorization: token,
        },
        data: {
          postId: post._id,
        },
      });
      setIsUserLikeThePost(!isUserLikeThePost);
      setLikesCount(likesCount - 1);
    } catch (e) {
      console.error("remove like failed " + e);
    }
  };

  const getCommentsOfPost = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await axios.post(
        `${config.base_url}/comments/post-comments/`,
        {
          _id: post._id,
        },
        {
          withCredentials: true,
          headers: {
            authorization: token,
          },
        }
      );
      setCommentsOfPost(res.data);
    } catch (e) {
      console.error("get comments of post failed " + e);
    }
  };

  const navigate = useNavigate();

  const handleDeletePost = async () => {
    const token = localStorage.getItem("token");

    try {
      await axios.delete(`${config.base_url}/posts/`, {
        withCredentials: true,
        headers: {
          authorization: token,
        },
        data: {
          _id: post._id,
        },
      });

      getPosts();
      setAnchorPostSettings(null);
    } catch (e) {
      if (e.response.status === 401) {
        navigate("/login");
      } else throw e;
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
    if (!postText && !postImages.length && !postAudio) return;
    if (
      postText === post.postText &&
      postImages === post.postImages &&
      postAudio === post.postAudio
    ) {
      setIsInEditingMode(false);
    } else {
      const token = localStorage.getItem("token");
      const newPost = { _id: post._id, postText, postImages, postAudio };

      try {
        await axios.put(`${config.base_url}/posts/`, newPost, {
          withCredentials: true,
          headers: {
            authorization: token,
          },
        });
        setIsInEditingMode(false);
        setIsEdited(true);
      } catch (e) {
        console.log("edit post failed " + e);
      }
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
                {isEdited && (
                  <div
                    style={{
                      width: 60,
                      textAlign: "end",
                      fontWeight: "bold",
                      fontSize: 14,
                      marginTop: 10,
                      color: "#92a5de",
                    }}
                  >
                    edited
                  </div>
                )}
              </div>
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

                <MenuItem onClick={handleDeletePost}>
                  <Typography color={"error"}>Delete Post</Typography>
                </MenuItem>
              </Menu>
            </>
          }
        ></CardHeader>

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
            <Button
              variant="contained"
              sx={{ background: "rgb(19 137 137)", width: 400, mt: 5 }}
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
          <IconButton>
            <ScreenShareIcon />
          </IconButton>
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
