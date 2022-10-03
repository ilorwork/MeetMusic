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
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCurrentUserInfo } from "../helpers/userHelpers";
import style from "./CreateNewPost.module.css";
// import NewPostModal from "./NewPostModal";
// import Box from "@mui/material/Box";
// import Button from "@mui/material/Button";
// import Typography from "@mui/material/Typography";
// import Modal from "@mui/material/Modal";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import AudioFileIcon from "@mui/icons-material/AudioFile";
import { v4 as uuid } from "uuid";

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
  const [uploadedImages, setUploadedImages] = useState([
    "https://cdn-icons-png.flaticon.com/512/149/149071.png",
  ]);

  const navigate = useNavigate();

  useEffect(() => {
    getUserInfo();
  }, []);

  useEffect(() => {
    console.log(uploadedImages);
  }, [uploadedImages]);

  const getUserInfo = async () => {
    try {
      const info = await getCurrentUserInfo();
      setUserInfo(info);
    } catch (err) {
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
      <Modal
        open={isOpen}
        onClose={() => setIsOpen(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={modalStyle}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Create New Post
          </Typography>
          <TextField placeholder="Write some text" />
          <ImageList cols={3} rowHeight={164}>
            {uploadedImages.map((img) => (
              <ImageListItem key={uuid()}>
                <img
                  src={img}
                  //   srcSet={img}
                  //   loading="lazy"
                />
              </ImageListItem>
            ))}
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
                onChange={(e) =>
                  setUploadedImages((prev) => [...prev, e.target.value])
                }
              />
              <AddPhotoAlternateIcon />
            </IconButton>
            <Button>
              <AudioFileIcon />
            </Button>
          </div>
        </Box>
      </Modal>
    </>
  );
};

export default CreateNewPost;
