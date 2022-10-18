import React, { useState } from "react";
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
import { v4 as uuid } from "uuid";

const PostComponent = ({ post, getPosts }) => {
  const [anchorPostSettings, setAnchorPostSettings] = useState(null);

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
          post.creator.profilePic ? (
            <Avatar src={post.creator.profilePic} />
          ) : (
            <Avatar sx={{ bgcolor: "rgb(38, 165, 165)" }}>MC</Avatar>
          )
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
      {post.postImages && (
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
        <div>{post.likesCount} Likes</div>
        <div>{post.commentsCount} Comments</div>
        <div>{post.sharedCount} Shares</div>
      </Box>
      <CardActions className={style.actionsContainer}>
        <IconButton>
          <ThumbUpIcon />
        </IconButton>
        <IconButton>
          <ChatBubbleIcon />
        </IconButton>
        <IconButton>
          <ScreenShareIcon />
        </IconButton>
      </CardActions>
    </Card>
  );
};

export default PostComponent;
