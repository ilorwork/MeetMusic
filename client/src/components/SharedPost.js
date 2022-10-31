import React, { useEffect, useState } from "react";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import style from "./PostComponent.module.css";
import { Avatar, CardContent, ImageList, ImageListItem } from "@mui/material";
import { Box } from "@mui/system";
import { useNavigate } from "react-router-dom";
import { v4 as uuid } from "uuid";
import { getPostById } from "../helpers/postHelpers";

const SharedPost = ({ postId }) => {
  const [post, setPost] = useState({});
  const [postImages, setPostImages] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    getPost();
  }, []);

  useEffect(() => {
    if (JSON.stringify(post) === "{}") return;
    setPostImages(post.postImages);
  }, [post]);

  const getPost = async () => {
    const postInfo = await getPostById(postId);
    setPost(postInfo);
  };

  const getImagesCols = () => {
    if (postImages.length < 3) return postImages.length;
    else return 3;
  };

  return (
    <div style={{ padding: 14 }}>
      <Card sx={{ mt: 2, border: 1 }}>
        <CardHeader
          avatar={
            <button
              className={style.profileBtn}
              onClick={() => navigate(`/user-profile/${post.creator._id}`)}
            >
              <Avatar src={post?.creator?.profilePic} />
            </button>
          }
          title={`${post?.creator?.firstName} ${post?.creator?.lastName}`}
          subheader={new Date(post?.timeOfCreation).toLocaleString()}
          action={<div className={style.sharedSign}>shared</div>}
        ></CardHeader>

        <CardContent>
          {post?.postText && <Box>{post?.postText}</Box>}
          {postImages.length !== 0 && (
            <ImageList
              cols={getImagesCols()}
              rowHeight={getImagesCols() < 2 ? 400 : 200}
            >
              {postImages.map((img) => (
                <ImageListItem sx={{ overflow: "hidden" }} key={uuid()}>
                  <img src={img} alt="post img" />
                </ImageListItem>
              ))}
            </ImageList>
          )}
          {post?.postAudio && (
            <audio controls>
              <source src={post?.postAudio} />
            </audio>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SharedPost;
