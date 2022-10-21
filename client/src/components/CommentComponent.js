import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import { IconButton, Menu, MenuItem } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import axios from "axios";
import CreateCommentToComment from "./CreateCommentToComment";
import CommentToCommentComponent from "./CommentToCommentComponent";
import { v4 as uuid } from "uuid";

const CommentComponent = ({
  comment,
  post,
  getCommentsOfPost,
  commentsCount,
  setCommentsCount,
}) => {
  const [anchorCommentSettings, setAnchorCommentSettings] = useState(null);
  const [isCommentToCommentOpen, setIsCommentToCommentOpen] = useState(false);
  const [commentsOfComment, setCommentsOfComment] = useState([]);
  const [commentsToCommentCount, setCommentsToCommentCount] = useState(
    comment.commentsToCommentCount
  );

  const paddingXSourceForCommentToComment = 2;

  useEffect(() => {
    getCommentsOfComment();
  }, []);

  const getCommentsOfComment = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await axios.post(
        "http://localhost:7000/comments-to-comments/comment-comments/",
        {
          _id: comment._id,
        },
        {
          withCredentials: true,
          headers: {
            authorization: token,
          },
        }
      );
      setCommentsOfComment(res.data);
    } catch (e) {
      console.log("get comments of comment failed " + e);
    }
  };

  const handleDeleteComment = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await axios.delete("http://localhost:7000/comments/", {
        withCredentials: true,
        headers: {
          authorization: token,
        },
        data: {
          _id: comment._id,
          postId: post._id,
        },
      });
      getCommentsOfPost();
      setCommentsCount(commentsCount - 1);
      setAnchorCommentSettings(null);
    } catch (e) {
      console.log("delete comment failed " + e);
    }
  };

  return (
    <>
      <Box
        sx={{
          px: 2,
          pt: 1,
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <Avatar src={comment.creator.profilePic} />
        <Grid
          container
          sx={{
            border: "solid rgb(209, 46, 101) 1px",
            borderRadius: 4,
            ml: 1,
            p: 1,
            fontSize: 10,
            background: "#eee",
          }}
        >
          <Grid item xs>
            <Typography>{comment.content}</Typography>
          </Grid>
        </Grid>
        <IconButton onClick={(e) => setAnchorCommentSettings(e.currentTarget)}>
          <MoreVertIcon />
        </IconButton>

        <Menu
          anchorEl={anchorCommentSettings}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "right",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          open={Boolean(anchorCommentSettings)}
          onClose={() => setAnchorCommentSettings(null)}
        >
          <MenuItem onClick={() => setAnchorCommentSettings(null)}>
            <Typography>Edit Comment</Typography>
          </MenuItem>
          <MenuItem onClick={handleDeleteComment}>
            <Typography color={"error"}>Delete Comment</Typography>
          </MenuItem>
          <MenuItem
            onClick={() => setIsCommentToCommentOpen(!isCommentToCommentOpen)}
          >
            <Typography color={"blue"}>
              {isCommentToCommentOpen
                ? "Hide reply's option"
                : "Reply to comment"}
            </Typography>
          </MenuItem>
        </Menu>
      </Box>
      <p style={{ fontSize: 10, margin: "0 0 12px 0" }}>
        {comment.timeOfCreation}
      </p>
      {isCommentToCommentOpen && (
        <CreateCommentToComment
          comment={comment}
          getCommentsOfComment={getCommentsOfComment}
          commentsToCommentCount={commentsToCommentCount}
          setCommentsToCommentCount={setCommentsToCommentCount}
          paddingXForCommentToComment={paddingXSourceForCommentToComment}
        />
      )}
      {isCommentToCommentOpen &&
        commentsOfComment.map((commentToComment) => (
          <CommentToCommentComponent
            commentToComment={commentToComment}
            comment={comment}
            getCommentsOfComment={getCommentsOfComment}
            commentsToCommentCount={commentsToCommentCount}
            setCommentsToCommentCount={setCommentsToCommentCount}
            paddingXForCommentToComment={paddingXSourceForCommentToComment}
            key={uuid()}
          />
        ))}
    </>
  );
};

export default CommentComponent;
