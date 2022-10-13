import React, { useState } from 'react';
import Box from '@mui/joy/Box';
import Button from '@mui/joy/Button';
import FormControl from '@mui/joy/FormControl';
import Textarea from '@mui/joy/Textarea';
import axios from 'axios';

const CreateNewComment = ({ post, getCommentsOfPost, commentsCount, setCommentsCount }) => {
    const [contentOfComment, setContentOfComment] = useState("");
    const handleCreatingNewComment = async () => {
        if (!contentOfComment) return;

        const newComment = {
            content: contentOfComment,
            postId: post._id
        }
        const token = localStorage.getItem("token");
        try {
            const res = await axios.post("http://localhost:7000/comments/", newComment,
                {
                    withCredentials: true,
                    headers: {
                        authorization: token,
                    },
                });
            setContentOfComment("");
            getCommentsOfPost();
            setCommentsCount(commentsCount + 1);
        } catch (e) {
            console.log("comment creation failed " + e);
        }
    }

    return (
        <FormControl>
            <Textarea
                value={contentOfComment}
                onChange={(e) => setContentOfComment(e.target.value)}
                variant="standard"
                placeholder="Write a comment..."
                endDecorator={
                    <Box
                        sx={{
                            display: 'flex',
                            borderColor: 'rgb(38, 165, 165)',
                            flex: 'auto',
                            justifyContent: 'end',
                        }}
                    >
                        <Button sx={{ background: "rgb(209, 46, 101)", color: "white" }} variant={"contained"}
                            onClick={handleCreatingNewComment}>Send</Button>
                    </Box>
                }
                sx={{
                    minWidth: 200,
                }} />
        </FormControl>
    )
}

export default CreateNewComment;