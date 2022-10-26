import React, { useEffect, useState } from "react";
import {
  Avatar,
  Button,
  Card,
  Box,
  Modal,
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
import axios from "axios";
import { v4 as uuid } from "uuid";
import Textarea from "@mui/joy/Textarea";
import RemoveIcon from '@mui/icons-material/Remove';

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 450,
  bgcolor: "background.paper",
  border: "2px solid #000",
  borderRadius: 2,
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  const handleRemoveImg = (img) => {
    setPostImages(postImages.filter(currentImg => currentImg !== img));
  }

  const handleRemoveAudio = () => {
    setPostAudio("");
  }

  const handleCreatePost = async () => {
    if (!postText && !postImages.length && !postAudio) return;

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
    if (postImages.length > 8) return;

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
        <button
          className={style.profileBtn}
          onClick={() => navigate("current-user-profile")}
        >
          <Avatar
            alt="user profileic"
            sx={{ width: 50, height: 50 }}
            src={userInfo.profilePic}
          />
        </button>
        <Button
          className={style.createNewPostBtn}
          sx={{ ml: 1 }}
          variant="outlined"
          onClick={() => setIsOpen(true)}
        >
          Create new post
        </Button>
      </Card>
      <Modal open={isOpen} onClose={() => setIsOpen(false)}>
        <Box sx={modalStyle}>
          <Textarea
            placeholder="Write some text"
            value={postText}
            onChange={(e) => setPostText(e.target.value)}
          />
          {postImages && (
            <ImageList cols={postImages.length < 5 ? 2 : 3} rowHeight={164}>
              {postImages.map((img) => (
                <div key={uuid()}>
                  <Tooltip title="remove Image">
                    <Button
                      onClick={() => { handleRemoveImg(img) }}
                      style={{
                        marginBottom: -30, zIndex: 1, width: 10, border: "none"
                      }}
                      variant="outlined"
                      startIcon={<RemoveIcon color="error" style={{ fontSize: 30 }} />}
                    >
                    </Button>
                  </Tooltip>

                  <ImageListItem sx={{ overflow: "hidden" }} >
                    <img src={img} alt="post img" />
                  </ImageListItem>
                </div>
              ))}
            </ImageList>
          )}

          {postAudio && (
            <div style={{
              display: "flex", justifyContent: "center", alignItems: "center", border: "none"
            }}>
              <Tooltip title="remove audio">
                <Button
                  style={{
                    marginRight: -70, marginBottom: 40, zIndex: 1, width: 10, border: "none"
                  }}
                  onClick={() => { handleRemoveAudio() }}
                  sx={{ fontSize: 10, color: "red" }}
                  variant="outlined"
                  startIcon={<RemoveIcon color="error" style={{ fontSize: 30 }} />}
                >
                </Button>
              </Tooltip>

              <audio controls>
                <source src={postAudio} />
              </audio>
            </div>
          )}

          <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
            <div style={{
              padding: "0 48px 0 0"
            }}>
              {postImages.length <= 8 && <Tooltip title="Upload Image">
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
              </Tooltip>}

              {!postAudio && <Tooltip title="Upload Audio">
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
              </Tooltip>}
            </div>
            <Button
              variant="contained"
              style={{ background: "rgb(209, 46, 100)" }}
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
