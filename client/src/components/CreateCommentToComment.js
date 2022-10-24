import React, { useState } from "react";
import Box from "@mui/joy/Box";
import Button from "@mui/joy/Button";
import FormControl from "@mui/joy/FormControl";
import Textarea from "@mui/joy/Textarea";
import axios from "axios";

const CreateCommentToComment = ({
  comment,
  getCommentsOfComment,
  commentsToCommentCount,
  setCommentsToCommentCount,
  paddingXForCommentToComment,
  setIsCommentsToCommentOpen
}) => {
  const [contentOfCommentToComment, setContentOfCommentToComment] =
    useState("");

  const handleCreatingCommentToComment = async () => {
    if (!contentOfCommentToComment) return;

    const newCommentToComment = {
      content: contentOfCommentToComment,
      timeOfCreation: Date.now(),
      commentId: comment._id,
    };
    const token = localStorage.getItem("token");
    try {
      const res = await axios.post(
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
      setIsCommentsToCommentOpen(true);
    } catch (e) {
      console.log("comment to comment creation failed " + e);
    }
  };

  const validationFunction = (e) => {
    e.preventDefault();
    let nonSpaceCharacters = 0;
    const contentDividedBySpaces = contentOfCommentToComment.split(" ");
    contentDividedBySpaces.forEach((cell) => {
      if (cell) {
        nonSpaceCharacters++;
      }
    })
    if (nonSpaceCharacters > 0) return true;
    return false;
  }

  return (
    <FormControl sx={{ pl: paddingXForCommentToComment }}>
      <Textarea
        value={contentOfCommentToComment}
        onChange={(e) => setContentOfCommentToComment(e.target.value)}
        variant="standard"
        placeholder={`Reply to ${comment.creator.firstName} ${comment.creator.lastName}`}
        onKeyDown={(e) => {
          if (e.key === "Enter" && validationFunction(e)) handleCreatingCommentToComment();
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
