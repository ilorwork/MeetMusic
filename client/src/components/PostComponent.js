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
  CardMedia,
  IconButton,
  Menu,
  MenuItem,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import axios from "axios";

const PostComponent = ({ post, getPosts }) => {
  const [anchorPostSettings, setAnchorPostSettings] = useState(null);

  const handleDeletePost = async () => {
    const token = localStorage.getItem("token");

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
      {post.postImage && (
        <CardMedia
          component="img"
          height="300"
          image={post.postImage}
          alt="post image"
        ></CardMedia>
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
