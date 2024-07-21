import React, { useContext, useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardMedia,
  IconButton,
  Tooltip,
  Typography,
} from "@mui/material";
import style from "../auth/RecentConnectionCard.module.css";
import { useNavigate } from "react-router-dom";
import PersonAddDisabledIcon from "@mui/icons-material/PersonAddDisabled";
import PersonAddAltIcon from "@mui/icons-material/PersonAddAlt";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import UserContext from "../context/UserContext";

const UserCard = ({
  user,
  handleFollowUser,
  handleUnfollowUser,
  isFollowed,
}) => {
  const [isCurrentUser, setIsCurrentUser] = useState(false);

  const { currentUserInfo } = useContext(UserContext);

  const navigate = useNavigate();

  useEffect(() => {
    if (user._id === currentUserInfo._id) {
      setIsCurrentUser(true);
      return;
    }
  }, []);

  const navToUserPage = () => {
    navigate(`/user-profile/${user._id}`);
  };

  return (
    <>
      <div className={style.containsCard}>
        {isFollowed && !isCurrentUser && (
          <Tooltip title="Unfollow">
            <IconButton
              onClick={handleUnfollowUser}
              style={{
                marginBottom: -40,
                marginLeft: -120,
                zIndex: 1,
                border: "none",
              }}
            >
              <PersonAddDisabledIcon
                style={{
                  color: "rgb(19 137 137 / 0.91)",
                  fontSize: 20,
                  background: "rgb(230, 240, 255)",
                  borderRadius: 2.5,
                }}
              />
            </IconButton>
          </Tooltip>
        )}
        {!isFollowed && !isCurrentUser && (
          <Tooltip title="Follow">
            <IconButton
              onClick={handleFollowUser}
              style={{
                marginBottom: -40,
                marginLeft: -120,
                zIndex: 1,
                border: "none",
              }}
            >
              <PersonAddAltIcon
                style={{
                  color: "rgb(209, 46, 100)",
                  fontSize: 20,
                  background: "rgb(230, 240, 255)",
                  borderRadius: 2.5,
                }}
              />
            </IconButton>
          </Tooltip>
        )}
        {isCurrentUser && (
          <Tooltip title="You">
            <IconButton
              onClick={navToUserPage}
              style={{
                marginBottom: -40,
                marginLeft: -120,
                zIndex: 1,
                border: "none",
              }}
            >
              <PersonOutlineIcon
                style={{
                  color: "gray",
                  fontSize: 20,
                  background: "rgb(230, 240, 255)",
                  borderRadius: 2.5,
                }}
              />
            </IconButton>
          </Tooltip>
        )}
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
