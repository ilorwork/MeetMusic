import React, { useContext, useState } from "react";
import Box from "@mui/joy/Box";
import Button from "@mui/joy/Button";
import FormControl from "@mui/joy/FormControl";
import Textarea from "@mui/joy/Textarea";
import UserContext from "./layout/UserContext";
import { notifyUser } from "../helpers/userHelpers";
import { createComment } from "../helpers/postHelpers";

const CreateNewComment = ({
  post,
  getCommentsOfPost,
  commentsCount,
  setCommentsCount,
}) => {
  const [contentOfComment, setContentOfComment] = useState("");

  const { currentUserInfo } = useContext(UserContext);

  const handleCreatingNewComment = async () => {
    const newComment = {
      content: contentOfComment,
      timeOfCreation: Date.now(),
      postId: post._id,
    };

    try {
      await createComment(newComment);
      setContentOfComment("");
      getCommentsOfPost();
      setCommentsCount(commentsCount + 1);

      if (post.creator._id === currentUserInfo._id) return;
      notifyUser(
        post.creator._id,
        `${currentUserInfo.firstName} ${currentUserInfo.lastName} commented on your post`
      );
    } catch (e) {
      console.error("comment creation failed " + e);
    }
  };

  const validationFunction = (e) => {
    e.preventDefault();
    let nonSpaceCharacters = 0;
    const contentDividedBySpaces = contentOfComment.split(" ");
    contentDividedBySpaces.forEach((cell) => {
      if (cell) {
        nonSpaceCharacters++;
      }
    });
    if (nonSpaceCharacters > 0) return true;
    return false;
  };

  return (
    <FormControl>
      <Textarea
        value={contentOfComment}
        onChange={(e) => setContentOfComment(e.target.value)}
        variant="standard"
        placeholder="Write a comment..."
        onKeyDown={(e) => {
          if (e.key === "Enter" && validationFunction(e))
            handleCreatingNewComment();
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
              sx={{ background: "rgb(209, 46, 101)", color: "white" }}
              variant={"contained"}
              onClick={handleCreatingNewComment}
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

export default CreateNewComment;
