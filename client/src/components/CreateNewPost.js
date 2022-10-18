import React, { useEffect, useState } from "react";
import {
  Avatar,
  Button,
  Card,
  Box,
  Typography,
  Modal,
  TextField,
  IconButton,
  ImageList,
  ImageListItem,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { getCurrentUserInfo } from "../helpers/userHelpers";
import style from "./CreateNewPost.module.css";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import AudioFileIcon from "@mui/icons-material/AudioFile";
import { v4 as uuid } from "uuid";
import axios from "axios";

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

const CreateNewPost = ({ getAllPosts }) => {
  const [userInfo, setUserInfo] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [postText, setPostText] = useState("");
  const [postImage, setPostImage] = useState("");
  const [postAudio, setPostAudio] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    getUserInfo();
  }, []);

  const getUserInfo = async () => {
    try {
      const info = await getCurrentUserInfo();
      setUserInfo(info);
    } catch (e) {
      if (e.response.status === 401) {
        navigate("/login");
      } else throw e;
    }
  };

  const handleCreatePost = async () => {
    if (!postText && !postImage && !postAudio) return;

    const token = localStorage.getItem("token");
    const newPost = { postText, postImage, postAudio };

    try {
      await axios.post("http://localhost:7000/posts/", newPost, {
        withCredentials: true,
        headers: {
          authorization: token,
        },
      });

      setPostAudio("");
      setPostImage("");
      setPostText("");
      setIsOpen(false);
      getAllPosts();
    } catch (e) {
      if (e.response.status === 401) {
        navigate("/login");
      } else throw e;
    }
  };

  const handleAssetSelection = (e, setStateFunc) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (reader.readyState === 2) {
        setStateFunc(reader.result);
      }
    };

    reader.readAsDataURL(e.target.files[0]);
  };

  return (
    <>
      <Card className={style.createNewPostCard}>
        <Avatar
          alt="user profileic"
          sx={{ width: 50, height: 50 }}
          src={userInfo.profilePic}
        />
        <Button
          className={style.createNewPostBtn}
          variant="outlined"
          onClick={() => setIsOpen(true)}
        >
          Create new post
        </Button>
      </Card>
      <Modal open={isOpen} onClose={() => setIsOpen(false)}>
        <Box sx={modalStyle}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Create New Post
          </Typography>
          <TextField
            placeholder="Write some text"
            value={postText}
            onChange={(e) => setPostText(e.target.value)}
          />
          {/* {postImage && <img src={postImage} className={style.postImage} />} */}
          <ImageList cols={2} rowHeight={164}>
            {postImage && (
              <ImageListItem>
                <img
                  src={postImage}
                  //   srcSet={img}
                  //   loading="lazy"
                />
              </ImageListItem>
            )}
          </ImageList>
          {postAudio && (
            <audio controls>
              <source src={postAudio} />
            </audio>
          )}
          <div>
            <IconButton
              color="primary"
              aria-label="upload picture"
              component="label"
            >
              <input
                hidden
                accept="image/*"
                type="file"
                onChange={(e) => handleAssetSelection(e, setPostImage)}
              />
              <AddPhotoAlternateIcon />
            </IconButton>
            <IconButton
              color="primary"
              aria-label="upload audio"
              component="label"
            >
              <input
                hidden
                accept="audio/*"
                type="file"
                onChange={(e) => handleAssetSelection(e, setPostAudio)}
              />
              <AudioFileIcon />
            </IconButton>
            <Button
              variant="contained"
              color="secondary"
              onClick={handleCreatePost}
            >
              Create post
            </Button>
          </div>
        </Box>
      </Modal>
    </>
  );
};

export default CreateNewPost;
