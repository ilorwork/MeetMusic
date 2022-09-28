import React from "react";
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
} from "@mui/material";
import { Box } from "@mui/system";

const PostComponent = () => {
  return (
    <>
      <Card sx={{ mt: 2 }}>
        <CardHeader
          avatar={<Avatar sx={{ bgcolor: "rgb(38, 165, 165)" }}>MC</Avatar>}
          title="Miki Cohen"
          subheader="September 14, 2016"
          action={
            <IconButton>
              <MoreVertIcon />
            </IconButton>
          }
        ></CardHeader>
        <CardContent>
          I love sky and sea I love sky and sea I love sky and sea I love sky
          and sea I love sky and sea I love sky and sea
        </CardContent>
        <CardMedia
          component="img"
          height="300"
          image="https://images.unsplash.com/photo-1570483358100-6d222cdea6ff?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=465&q=80"
          alt="sky"
        ></CardMedia>
        <Box className={style.footerIndecators}>
          <div>5 Likes</div>
          <div>13 Comments</div>
          <div>2 Shares</div>
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
    </>
  );
};

export default PostComponent;
