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

const CreateNewPost = () => {
  const [userInfo, setUserInfo] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [postText, setPostText] = useState("");
  const [postImage, setPostImage] = useState("");
  const [uploadedImageFile, setUploadedImageFile] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    getUserInfo();
  }, []);

  useEffect(() => {
    if (!uploadedImageFile) return;

    uploadImageToCloudinary(uploadedImageFile);
  }, [uploadedImageFile]);

  const uploadImageToCloudinary = async (img) => {
    try {
      const formData = new FormData();
      formData.append("file", img);
      formData.append("upload_preset", "fyqj9lqs");

      const res = await axios.post(
        "https://api.cloudinary.com/v1_1/dhbgvkcez/image/upload",
        formData
      );
      setPostImage(res.data.url);
      // TODO: Clear the image from the cloudinary on cancel
    } catch (e) {
      console.error("Upload image to cloudinary has failed");
    }
  };

  const getUserInfo = async () => {
    try {
      const info = await getCurrentUserInfo();
      setUserInfo(info);
    } catch (err) {
      navigate("/login");
    }
  };

  const handleCreatePost = async () => {
    if (!postText && !postImage) return;

    const token = localStorage.getItem("token");
    const newPost = { postText, postImage };

    try {
      await axios.post("http://localhost:7000/posts/", newPost, {
        withCredentials: true,
        headers: {
          authorization: token,
        },
      });

      setPostText("");
      setPostImage("");
      setIsOpen(false);
    } catch (e) {
      navigate("/login");
    }
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
                onChange={(e) => setUploadedImageFile(e.target.files[0])}
              />
              <AddPhotoAlternateIcon />
            </IconButton>
            <Button>
              <AudioFileIcon />
            </Button>
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
