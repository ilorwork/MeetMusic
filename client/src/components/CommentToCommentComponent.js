import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import { IconButton, Menu, MenuItem } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import axios from "axios";
import CreateCommentToComment from "./CreateCommentToComment";
import { v4 as uuid } from "uuid";
import { getCurrentUserInfo } from "../helpers/userHelpers";
import Textarea from "@mui/joy/Textarea";
import config from "../config/config.json";

const CommentToCommentComponent = ({
  commentToComment,
  comment,
  getCommentsOfComment,
  commentsToCommentCount,
  setCommentsToCommentCount,
  paddingXForCommentToComment,
}) => {
  const [currentUserId, setCurrentUserId] = useState("");
  const [anchorCommentToCommentSettings, setAnchorCommentToCommentSettings] =
    useState(null);

  const [
    isCreateCommentOfCommentToCommentOpen,
    setIsCreateCommentOfCommentToCommentOpen,
  ] = useState(false);
  const [
    isCommentsOfCommentToCommentOpen,
    setIsCommentsOfCommentToCommentOpen,
  ] = useState(false);

  const [commentsOfCommentToComment, setCommentsOfCommentToComment] = useState(
    []
  );
  const [commentsOfCommentToCommentCount, setCommentsOfCommentToCommentCount] =
    useState(commentToComment.commentsToCommentCount);

  const [isInEditingMode, setIsInEditingMode] = useState(false);
  const [editedContent, setEditedContent] = useState(commentToComment.content);
  const [isEdited, setIsEdited] = useState(commentToComment.isEdited);

  const [
    paddingXForCurrentCommentToComment,
    setPaddingXForCurrentCommentToComment,
  ] = useState(paddingXForCommentToComment);

  useEffect(() => {
    getCurrentUserId();
    getCommentsOfCommentToComment();
    setPaddingXForCurrentCommentToComment(paddingXForCommentToComment + 4);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getCurrentUserId = async () => {
    const userInfo = await getCurrentUserInfo();
    setCurrentUserId(userInfo._id);
  };

  const getCommentsOfCommentToComment = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await axios.post(
        `${config.base_url}/comments-to-comments/comment-comments/`,
        {
          _id: commentToComment._id,
        },
        {
          withCredentials: true,
          headers: {
            authorization: token,
          },
        }
      );
      setCommentsOfCommentToComment(res.data);
    } catch (e) {
      console.log("get comments of comment to comment failed " + e);
    }
  };

  const handleEditCommentToComment = async () => {
    if (editedContent === commentToComment.content) {
      setIsInEditingMode(false);
    } else {
      const token = localStorage.getItem("token");
      try {
        await axios.put(
          `${config.base_url}/comments-to-comments/`,
          {
            _id: commentToComment._id,
            content: editedContent,
          },
          {
            withCredentials: true,
            headers: {
              authorization: token,
            },
          }
        );
        setIsInEditingMode(false);
        setIsEdited(true);
      } catch (e) {
        console.log("edit comment to comment failed " + e);
      }
    }
  };

  const validationFunction = () => {
    let nonSpaceCharacters = 0;
    const contentDividedBySpaces = editedContent.split(" ");
    contentDividedBySpaces.forEach((cell) => {
      if (cell) {
        nonSpaceCharacters++;
      }
    });
    if (nonSpaceCharacters > 0) return true;
    return false;
  };

  const handleDeleteCommentToComment = async () => {
    const token = localStorage.getItem("token");
    try {
      await axios.delete(`${config.base_url}/comments-to-comments/`, {
        withCredentials: true,
        headers: {
          authorization: token,
        },
        data: {
          _id: commentToComment._id,
          commentId: comment._id,
        },
      });
      getCommentsOfComment();
      setCommentsToCommentCount(commentsToCommentCount - 1);
      setAnchorCommentToCommentSettings(null);
    } catch (e) {
      console.log("delete comment to comment failed " + e);
    }
  };
  return (
    <>
      <Box
        sx={{
          pl: paddingXForCurrentCommentToComment,
          pr: 2,
          pt: 1,
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <Avatar src={commentToComment.creator.profilePic} />
        <Grid
          container
          sx={{
            border: "solid rgb(38, 165, 165) 1px",
            borderRadius: 4,
            ml: 1,
            p: 1,
            fontSize: 8,
            background: "#efe",
          }}
        >
          <Grid item></Grid>
          <Grid item xs>
            {!isInEditingMode && <Typography>{editedContent}</Typography>}
            {isInEditingMode && (
              <Textarea
                fullWidth
                value={editedContent}
                onChange={(e) => setEditedContent(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && validationFunction())
                    handleEditCommentToComment();
                }}
              ></Textarea>
            )}
          </Grid>
          {isEdited && (
            <Grid
              item
              width={30}
              fontWeight={200}
              fontSize={10}
              color={"rgb(38, 165, 165)"}
            >
              edited
            </Grid>
          )}
        </Grid>
        <IconButton
          onClick={(e) => setAnchorCommentToCommentSettings(e.currentTarget)}
        >
          <MoreVertIcon />
        </IconButton>

        <Menu
          anchorEl={anchorCommentToCommentSettings}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "right",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          open={Boolean(anchorCommentToCommentSettings)}
          onClose={() => setAnchorCommentToCommentSettings(null)}
        >
          {currentUserId === commentToComment.creator._id && (
            <MenuItem
              onClick={() => {
                setIsInEditingMode(true);
                setAnchorCommentToCommentSettings(null);
              }}
            >
              <Typography>Edit Comment</Typography>
            </MenuItem>
          )}
          {currentUserId === commentToComment.creator._id && (
            <MenuItem onClick={handleDeleteCommentToComment}>
              <Typography color={"error"}>Delete Comment</Typography>
            </MenuItem>
          )}

          <MenuItem
            onClick={() => {
              setIsCreateCommentOfCommentToCommentOpen(
                !isCreateCommentOfCommentToCommentOpen
              );
              setAnchorCommentToCommentSettings(null);
            }}
          >
            <Typography color={"green"}>
              {isCreateCommentOfCommentToCommentOpen
                ? "Hide reply's option"
                : "Reply to comment"}
            </Typography>
          </MenuItem>
          <MenuItem
            onClick={() => {
              setIsCommentsOfCommentToCommentOpen(
                !isCommentsOfCommentToCommentOpen
              );
              setAnchorCommentToCommentSettings(null);
            }}
          >
            {commentsOfCommentToCommentCount > 0 && (
              <Typography color={"blue"}>
                {isCommentsOfCommentToCommentOpen
                  ? `Hide ${commentsOfCommentToCommentCount} replies`
                  : `show ${commentsOfCommentToCommentCount} replies`}
              </Typography>
            )}
          </MenuItem>
        </Menu>
      </Box>
      <p
        style={{
          fontSize: 10,
          margin: "0 0 3px 0",
          paddingLeft: 8 * paddingXForCurrentCommentToComment,
        }}
      >
        {commentToComment.timeOfCreation}
      </p>
      {isCreateCommentOfCommentToCommentOpen && (
        <CreateCommentToComment
          comment={commentToComment}
          getCommentsOfComment={getCommentsOfCommentToComment}
          commentsToCommentCount={commentsOfCommentToCommentCount}
          setCommentsToCommentCount={setCommentsOfCommentToCommentCount}
          paddingXForCommentToComment={paddingXForCurrentCommentToComment}
          setIsCommentsToCommentOpen={setIsCommentsOfCommentToCommentOpen}
        />
      )}
      {isCommentsOfCommentToCommentOpen &&
        commentsOfCommentToComment.map((commentOfCommentToComment) => (
          <CommentToCommentComponent
            commentToComment={commentOfCommentToComment}
            comment={commentToComment}
            getCommentsOfComment={getCommentsOfCommentToComment}
            commentsToCommentCount={commentsOfCommentToCommentCount}
            setCommentsToCommentCount={setCommentsOfCommentToCommentCount}
            paddingXForCommentToComment={paddingXForCurrentCommentToComment}
            key={uuid()}
          />
        ))}
    </>
  );
};

export default CommentToCommentComponent;
