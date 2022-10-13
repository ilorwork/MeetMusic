import React, { useState } from "react";
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import {
    IconButton,
    Menu, MenuItem
} from '@mui/material';
import MoreVertIcon from "@mui/icons-material/MoreVert";
import axios from "axios";

const CommentComponent = ({ comment, post, getCommentsOfPost, commentsCount, setCommentsCount }) => {
    const [anchorCommentSettings, setAnchorCommentSettings] = useState(null);

    const handleDeleteComment = async () => {
        const token = localStorage.getItem("token");
        try {
            const res = await axios.delete("http://localhost:7000/comments/",
                {
                    withCredentials: true,
                    headers: {
                        authorization: token,
                    },
                    data: {
                        _id: comment._id,
                        postId: post._id
                    },
                });
            console.log(res.data);
            getCommentsOfPost();
            setCommentsCount(commentsCount - 1);
            setAnchorCommentSettings(null);
        } catch (e) {
            console.log("delete comment failed " + e);
        }

    };
    return (
        <Box sx={{
            px: 2, py: 1, display: 'flex', justifyContent: 'space-between'
        }}>

            {comment.creator.profilePic ? (
                <Avatar src={comment.creator.profilePic} />
            ) : (
                <Avatar sx={{ bgcolor: "rgb(38, 165, 165)" }}>
                    {`${comment.creator.firstName.charAt(0).toUpperCase()}${comment.creator.lastName.charAt(0).toUpperCase()}`}
                </Avatar>
            )}

            <Grid container sx={{
                border: "solid rgb(38, 165, 165) 1px", borderRadius: 4, ml: 1, p: 1,
                fontSize: 10, background: '#eee'
            }}>
                <Grid item>
                </Grid>
                <Grid item xs>
                    <Typography>{comment.content}</Typography>
                </Grid>
            </Grid>
            <IconButton
                onClick={(e) => setAnchorCommentSettings(e.currentTarget)}
            >
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
            </Menu>
        </Box>
    )
}


export default CommentComponent;





