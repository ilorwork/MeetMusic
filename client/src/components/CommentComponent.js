import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import { IconButton, Menu, MenuItem } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import CreateCommentToComment from "./CreateCommentToComment";
import CommentToCommentComponent from "./CommentToCommentComponent";
import { v4 as uuid } from "uuid";
import { getCurrentUserInfo } from "../helpers/userHelpers";
import Textarea from "@mui/joy/Textarea";
import {
  deleteComment,
  editComment,
  getCommentReplies,
  textValidation,
} from "../helpers/postHelpers";

const CommentComponent = ({
  comment,
  post,
  getCommentsOfPost,
  commentsCount,
  setCommentsCount,
}) => {
  const [currentUserId, setCurrentUserId] = useState("");
  const [anchorCommentSettings, setAnchorCommentSettings] = useState(null);

  const [isCreateCommentToCommentOpen, setIsCreateCommentToCommentOpen] =
    useState(false);
  const [isCommentsToCommentOpen, setIsCommentsToCommentOpen] = useState(false);

  const [commentsOfComment, setCommentsOfComment] = useState([]);
  const [commentsToCommentCount, setCommentsToCommentCount] = useState(
    comment.commentsToCommentCount
  );

  const [isInEditingMode, setIsInEditingMode] = useState(false);
  const [editedContent, setEditedContent] = useState(comment.content);
  const [isEdited, setIsEdited] = useState(comment.isEdited);

  const paddingXSourceForCommentToComment = 2;

  useEffect(() => {
    getCurrentUserId();
    getCommentsOfComment();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getCurrentUserId = async () => {
    const userInfo = await getCurrentUserInfo();
    setCurrentUserId(userInfo._id);
  };

  const getCommentsOfComment = async () => {
    try {
      const replies = await getCommentReplies(comment._id);
      setCommentsOfComment(replies);
    } catch (e) {
      console.error("get replies failed " + e);
    }
  };

  const handleEditComment = async () => {
    if (editedContent === comment.content) {
      setIsInEditingMode(false);
    } else {
      try {
        await editComment(comment._id, editedContent);
        setIsInEditingMode(false);
        setIsEdited(true);
      } catch (e) {
        console.error("edit comment failed " + e);
      }
    }
  };

  const handleDeleteComment = async () => {
    try {
      await deleteComment(comment._id, post._id);
      getCommentsOfPost();
      setCommentsCount(commentsCount - 1);
      setAnchorCommentSettings(null);
    } catch (e) {
      console.error("delete comment failed " + e);
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
            {!isInEditingMode && <Typography>{editedContent}</Typography>}
            {isInEditingMode && (
              <Textarea
                fullwidth="true"
                value={editedContent}
                onChange={(e) => setEditedContent(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && textValidation(e, editedContent))
                    handleEditComment();
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
              color={"rgb(209, 46, 101)"}
            >
              edited
            </Grid>
          )}
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
          {currentUserId === comment.creator._id && (
            <MenuItem
              onClick={() => {
                setIsInEditingMode(true);
                setAnchorCommentSettings(null);
              }}
            >
              <Typography>Edit Comment</Typography>
            </MenuItem>
          )}
          {currentUserId === comment.creator._id && (
            <MenuItem onClick={handleDeleteComment}>
              <Typography color={"error"}>Delete Comment</Typography>
            </MenuItem>
          )}
          <MenuItem
            onClick={() => {
              setIsCreateCommentToCommentOpen(!isCreateCommentToCommentOpen);
              setAnchorCommentSettings(null);
            }}
          >
            <Typography color={"green"}>
              {isCreateCommentToCommentOpen
                ? "Hide reply's option"
                : "Reply to comment"}
            </Typography>
          </MenuItem>
          <MenuItem
            onClick={() => {
              setIsCommentsToCommentOpen(!isCommentsToCommentOpen);
              setAnchorCommentSettings(null);
            }}
          >
            {commentsToCommentCount > 0 && (
              <Typography color={"blue"}>
                {isCommentsToCommentOpen
                  ? `Hide ${commentsToCommentCount} replies`
                  : `show ${commentsToCommentCount} replies`}
              </Typography>
            )}
          </MenuItem>
        </Menu>
      </Box>
      <p style={{ fontSize: 10, margin: "0 0 12px 0" }}>
        {comment.timeOfCreation}
      </p>
      {isCreateCommentToCommentOpen && (
        <CreateCommentToComment
          comment={comment}
          getCommentsOfComment={getCommentsOfComment}
          commentsToCommentCount={commentsToCommentCount}
          setCommentsToCommentCount={setCommentsToCommentCount}
          paddingXForCommentToComment={paddingXSourceForCommentToComment}
          setIsCommentsToCommentOpen={setIsCommentsToCommentOpen}
        />
      )}
      {isCommentsToCommentOpen &&
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
