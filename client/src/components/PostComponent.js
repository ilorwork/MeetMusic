import React, { useEffect, useState } from "react";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import style from "./PostComponent.module.css";
import ChatBubbleIcon from "@mui/icons-material/ChatBubble";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import ScreenShareIcon from "@mui/icons-material/ScreenShare";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import {
  Avatar,
  CardActions,
  CardContent,
  CardMedia,
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

const PostComponent = ({ post, getPosts }) => {
  const [anchorPostSettings, setAnchorPostSettings] = useState(null);
  const [isCommentOpen, setIsCommentOpen] = useState(false);
  const [commentsOfPost, setCommentsOfPost] = useState([]);
  const [commentsCount, setCommentsCount] = useState(post.commentsCount);
  const [likesCount, setLikesCount] = useState(post.likesCount);
  const [isUserLikeThePost, setIsUserLikeThePost] = useState(false);

  useEffect(() => {
    getCommentsOfPost();
    getDataIsUserLikeThePost();
  }, []);

  const getDataIsUserLikeThePost = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await axios.post(
        "http://localhost:7000/likes/has-liked",
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
      const res = await axios.post(
        "http://localhost:7000/likes/",
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
    } catch (e) {
      console.error("add like failed " + e);
    }
  };

  const removeLike = async () => {
    const token = localStorage.getItem("token");
    try {
      await axios.delete("http://localhost:7000/likes/", {
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
        "http://localhost:7000/comments/post-comments/",
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
      await axios.delete("http://localhost:7000/posts/", {
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
    if (post.postImages.length < 3) return post.postImages.length;
    else return 3;
  };

  return (
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
            <IconButton onClick={(e) => setAnchorPostSettings(e.currentTarget)}>
              <MoreVertIcon />
            </IconButton>
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
              <MenuItem onClick={() => setAnchorPostSettings(null)}>
                <Typography>Edit Post</Typography>
              </MenuItem>
              <MenuItem onClick={handleDeletePost}>
                <Typography color={"error"}>Delete Post</Typography>
              </MenuItem>
            </Menu>
          </>
        }
      ></CardHeader>
      {post.postText && <CardContent>{post.postText}</CardContent>}
      {post.postImages.length != 0 && (
        <ImageList cols={getImagesCols()} rowHeight={300}>
          {post.postImages.map((img) => (
            <ImageListItem key={uuid()}>
              <img src={img} />
            </ImageListItem>
          ))}
        </ImageList>
      )}
      {post.postAudio && (
        <audio controls>
          <source src={post.postAudio} />
        </audio>
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
        <IconButton onClick={() => setIsCommentOpen(!isCommentOpen)}>
          <ChatBubbleIcon />
        </IconButton>
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
  );
};

export default PostComponent;
