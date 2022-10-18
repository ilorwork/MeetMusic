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
  Tooltip,
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
  width: 450,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

const CreateNewPost = ({ getAllPosts }) => {
  const [userInfo, setUserInfo] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [postText, setPostText] = useState("");
  const [postImages, setPostImages] = useState([]);
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
    if (!postText && !postImages && !postAudio) return;

    const token = localStorage.getItem("token");
    const newPost = { postText, postImages, postAudio };

    try {
      await axios.post("http://localhost:7000/posts/", newPost, {
        withCredentials: true,
        headers: {
          authorization: token,
        },
      });

      setPostAudio("");
      setPostImages([]);
      setPostText("");
      setIsOpen(false);
      getAllPosts();
    } catch (e) {
      if (e.response.status === 401) {
        navigate("/login");
      } else throw e;
    }
  };

  const handleImageSelection = (e) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (reader.readyState === 2) {
        setPostImages([...postImages, reader.result]);
      }
    };

    reader.readAsDataURL(e.target.files[0]);
  };

  const handleAudioSelection = (e) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (reader.readyState === 2) setPostAudio(reader.result);
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
          {postImages && (
            <ImageList cols={postImages.length < 5 ? 2 : 3} rowHeight={164}>
              {postImages.map((img) => (
                <ImageListItem key={uuid()}>
                  <img src={img} />
                </ImageListItem>
              ))}
            </ImageList>
          )}
          {postAudio && (
            <audio controls>
              <source src={postAudio} />
            </audio>
          )}
          <div>
            <Tooltip title="Upload Image">
              <IconButton
                color="primary"
                aria-label="upload picture"
                component="label"
              >
                <input
                  hidden
                  accept="image/*"
                  type="file"
                  onChange={handleImageSelection}
                />
                <AddPhotoAlternateIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Upload Audio">
              <IconButton
                color="primary"
                aria-label="upload audio"
                component="label"
              >
                <input
                  hidden
                  accept="audio/*"
                  type="file"
                  onChange={handleAudioSelection}
                />
                <AudioFileIcon />
              </IconButton>
            </Tooltip>
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
