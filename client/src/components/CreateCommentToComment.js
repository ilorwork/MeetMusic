import React, { useContext, useState } from "react";
import Box from "@mui/joy/Box";
import Button from "@mui/joy/Button";
import FormControl from "@mui/joy/FormControl";
import Textarea from "@mui/joy/Textarea";
import axios from "axios";
import { notifyUser } from "../helpers/userHelpers";
import UserContext from "./layout/UserContext";

const CreateCommentToComment = ({
  comment,
  getCommentsOfComment,
  commentsToCommentCount,
  setCommentsToCommentCount,
  paddingXForCommentToComment,
}) => {
  const [contentOfCommentToComment, setContentOfCommentToComment] =
    useState("");

  const { currentUserInfo } = useContext(UserContext);

  const handleCreatingCommentToComment = async () => {
    if (!contentOfCommentToComment) return;

    const newCommentToComment = {
      content: contentOfCommentToComment,
      timeOfCreation: Date.now(),
      commentId: comment._id,
    };

    const token = localStorage.getItem("token");
    try {
      await axios.post(
        "http://localhost:7000/comments-to-comments/",
        newCommentToComment,
        {
          withCredentials: true,
          headers: {
            authorization: token,
          },
        }
      );

      setContentOfCommentToComment("");
      getCommentsOfComment();
      setCommentsToCommentCount(commentsToCommentCount + 1);

      if (comment.creator._id === currentUserInfo._id) return;
      notifyUser(
        comment.creator._id,
        `${currentUserInfo.firstName} ${currentUserInfo.lastName} replyed to your comment`
      );
    } catch (e) {
      console.log("comment to comment creation failed " + e);
    }
  };

  return (
    <FormControl sx={{ pl: paddingXForCommentToComment }}>
      <Textarea
        value={contentOfCommentToComment}
        onChange={(e) => setContentOfCommentToComment(e.target.value)}
        variant="standard"
        placeholder="Write a comment to comment..."
        onKeyDown={(e) => {
          if (e.key === "Enter") handleCreatingCommentToComment();
        }}
        endDecorator={
          <Box
            sx={{
              display: "flex",
              flex: "auto",
              justifyContent: "end",
            }}
          >
            <Button
              sx={{
                background: "rgb(38, 165, 165)",
                color: "white",
                p: 1,
                fontSize: 10,
              }}
              variant={"contained"}
              onClick={handleCreatingCommentToComment}
            >
              Send
            </Button>
          </Box>
        }
        sx={{
          minWidth: 200,
        }}
      />
    </FormControl>
  );
};

export default CreateCommentToComment;
