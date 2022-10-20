import React, { useEffect, useState } from "react";
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
import CreateCommentToComment from "./CreateCommentToComment";
import { v4 as uuid } from "uuid";

const CommentToCommentComponent = ({ commentToComment, comment, getCommentsOfComment,
    commentsToCommentCount, setCommentsToCommentCount, paddingXForCommentToComment }) => {
    const [anchorCommentToCommentSettings, setAnchorCommentToCommentSettings] = useState(null);
    const [isCommentOfCommentToCommentOpen, setIsCommentOfCommentToCommentOpen] = useState(false);
    const [commentsOfCommentToComment, setCommentsOfCommentToComment] = useState([]);
    const [commentsOfCommentToCommentCount, setCommentsOfCommentToCommentCount] = useState(commentToComment.commentsToCommentCount);
    const [paddingXForCurrentCommentToComment, setPaddingXForCurrentCommentToComment] = useState(paddingXForCommentToComment);

    useEffect(() => {
        getCommentsOfCommentToComment();
        setPaddingXForCurrentCommentToComment(paddingXForCommentToComment + 4);
    }, []);

    const getCommentsOfCommentToComment = async () => {
        const token = localStorage.getItem("token");
        try {
            const res = await axios.post("http://localhost:7000/comments-to-comments/comment-comments/",
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

    }

    const handleDeleteCommentToComment = async () => {
        const token = localStorage.getItem("token");
        try {
            const res = await axios.delete("http://localhost:7000/comments-to-comments/",
                {
                    withCredentials: true,
                    headers: {
                        authorization: token,
                    },
                    data: {
                        _id: commentToComment._id,
                        commentId: comment._id
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
            <Box sx={{
                pl: paddingXForCurrentCommentToComment, pr: 2, pt: 1, display: 'flex', justifyContent: 'space-between'
            }}>
                <Avatar src={commentToComment.creator.profilePic} />
                <Grid container sx={{
                    border: "solid rgb(38, 165, 165) 1px", borderRadius: 4, ml: 1, p: 1,
                    fontSize: 8, background: '#efe'
                }}>
                    <Grid item>
                    </Grid>
                    <Grid item xs>
                        <Typography>{commentToComment.content}</Typography>
                    </Grid>
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
                    <MenuItem onClick={() => setAnchorCommentToCommentSettings(null)}>
                        <Typography>Edit Comment</Typography>
                    </MenuItem>
                    <MenuItem onClick={handleDeleteCommentToComment}>
                        <Typography color={"error"}>Delete Comment</Typography>
                    </MenuItem>
                    <MenuItem
                        onClick={() => setIsCommentOfCommentToCommentOpen(!isCommentOfCommentToCommentOpen)}
                    >
                        <Typography color={"blue"}>{isCommentOfCommentToCommentOpen ? "Hide reply's option" : "Reply to comment"}</Typography>
                    </MenuItem>
                </Menu>
            </Box>
            <p style={{ fontSize: 10, margin: "0 0 3px 0" }}>{commentToComment.timeOfCreation}</p>
            {isCommentOfCommentToCommentOpen && <CreateCommentToComment
                comment={commentToComment}
                getCommentsOfComment={getCommentsOfCommentToComment} commentsToCommentCount={commentsOfCommentToCommentCount}
                setCommentsToCommentCount={setCommentsOfCommentToCommentCount} paddingXForCommentToComment={paddingXForCurrentCommentToComment} />}
            {isCommentOfCommentToCommentOpen &&
                commentsOfCommentToComment.map((commentOfCommentToComment) => <CommentToCommentComponent
                    commentToComment={commentOfCommentToComment} comment={commentToComment}
                    getCommentsOfComment={getCommentsOfCommentToComment} commentsToCommentCount={commentsOfCommentToCommentCount}
                    setCommentsToCommentCount={setCommentsOfCommentToCommentCount} paddingXForCommentToComment={paddingXForCurrentCommentToComment} key={uuid()} />)}
        </>
    )
}


export default CommentToCommentComponent;




