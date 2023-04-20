import React, { useState } from "react";
import {
  Button,
  Card,
  CardContent,
  CardMedia,
  IconButton,
  Modal,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import style from "./RecentConnectionCard.module.css";
import { login } from "../helpers/userHelpers";
import { useNavigate } from "react-router-dom";
import PersonOffOutlinedIcon from "@mui/icons-material/PersonOffOutlined";

const UserCard = ({ user, setRecentUsers }) => {
  const navigate = useNavigate();

  const navToUserPage = () => {
    navigate(`user-profile/${user._id}`);
  };

  return (
    <>
      <div className={style.containsCard}>
        <Tooltip title="Unfollow">
          <IconButton
            onClick={() => {}}
            style={{
              marginBottom: -40,
              marginLeft: -120,
              zIndex: 1,
              border: "none",
            }}
          >
            <PersonOffOutlinedIcon
              style={{
                color: "white",
                fontSize: 20,
                background: "gray",
              }}
            />
          </IconButton>
        </Tooltip>
        <Card className={style.card} sx={{ width: 150 }}>
          <CardMedia
            component="img"
            height="150"
            image={`${user.profilePic}`}
            alt="user profile pic"
            sx={{ cursor: "pointer" }}
            onClick={navToUserPage}
          ></CardMedia>
          <CardContent
            sx={{
              height: 20,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Typography sx={{ fontSize: 16 }}>
              {`${user.firstName} ${user.lastName}`}
            </Typography>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default UserCard;
