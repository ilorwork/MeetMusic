import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Avatar from "@mui/material/Avatar";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import PublicIcon from "@mui/icons-material/Public";
import LocationCityIcon from "@mui/icons-material/LocationCity";
import EventIcon from "@mui/icons-material/Event";
import style from "./CurrentUserProfile.module.css";
import PostComponent from "./PostComponent";
import PersonIcon from "@mui/icons-material/Person";
import WcIcon from "@mui/icons-material/Wc";
import EditIcon from "@mui/icons-material/Edit";
import { Button, IconButton, Tooltip } from "@mui/material";
import { getCurrentUserInfo } from "../helpers/userHelpers";
import { v4 as uuid } from "uuid";
import Followers from "./Followers";
import Following from "./Following";
import config from "../config/config.json";

const CurrentUserProfile = () => {
  const [user, setUser] = useState("");
  const [userPosts, setUserPosts] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    getInfo();
    getUserPosts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getInfo = async () => {
    try {
      const currentUserInfo = await getCurrentUserInfo(true);
      setUser(currentUserInfo);
    } catch (e) {
      if (e.response.status === 401) {
        navigate("/login");
      } else throw e;
    }
  };

  const getUserPosts = async () => {
    const token = localStorage.getItem("token");
    const res = await axios.get(`${config.base_url}/posts/current-user-posts`, {
      withCredentials: true,
      headers: {
        authorization: token,
      },
    });
    setUserPosts(res.data);
  };

  const calculateAge = () =>
    (
      (new Date() - new Date(user.birthDate).getTime()) /
      (365.25 * 24 * 60 * 60 * 1000)
    ).toFixed(1);

  const handleEditProfile = () => {};

  const handlePicChange = (e) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (reader.readyState === 2) {
        updateUser({ profilePic: reader.result });
      }
    };

    reader.readAsDataURL(e.target.files[0]);
  };

  const updateUser = async (fieldsToUpdate) => {
    const token = localStorage.getItem("token");
    const res = await axios.put(`${config.base_url}/users/`, fieldsToUpdate, {
      withCredentials: true,
      headers: {
        authorization: token,
      },
    });
    setUser(res.data);
  };

  return (
    <>
      <div className={style.profilePageContainer}>
        <Card className={style.profileInfoCard}>
          <input
            hidden
            accept="image/*"
            id="icon-button-file"
            type="file"
            onChange={handlePicChange}
          />
          <label htmlFor="icon-button-file">
            <Tooltip title="Click to replace">
              <IconButton component="span">
                <Avatar
                  alt="user profile pic"
                  sx={{ width: 250, height: 250 }}
                  src={user.profilePic}
                />
              </IconButton>
            </Tooltip>
          </label>
          <CardContent className={style.profileInfoContent}>
            <div className={style.profileHeader}>
              <h1>
                {user.firstName} {user.lastName}
              </h1>
              <Button
                className={style.editProfileBtn}
                size="small"
                onClick={handleEditProfile}
              >
                <EditIcon />
              </Button>
            </div>

            <div className={style.personalInfoContainer}>
              <Typography className={style.typographyRow}>
                <PublicIcon />
                {user.country}
              </Typography>
              <Typography className={style.typographyRow}>
                <LocationCityIcon />
                {user.city}
              </Typography>
              <Typography className={style.typographyRow}>
                <EventIcon />
                {new Date(user.birthDate).toLocaleDateString()}
              </Typography>
              <Typography className={style.typographyRow}>
                <PersonIcon />
                {calculateAge()}
              </Typography>
              <Typography className={style.typographyRow}>
                <WcIcon />
                {user.gender}
              </Typography>
            </div>
            <div className={style.socialInfoContainer}>
              <Typography color="text.secondary">
                {user.followers?.length} followers
              </Typography>
              <Typography color="text.secondary">
                {userPosts?.length} posts
              </Typography>
              <Typography color="text.secondary">
                {user.following?.length} following
              </Typography>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className={style.homePage}>
        <div className={style.peopleYouMayKnow}>
          <h1 className={style.titleOfPeopleYouMayKnow}>Followers</h1>
          {user.followers?.map((follower) => (
            <Followers key={uuid()} follower={follower} getUserInfo={getInfo} />
          ))}
        </div>
        <div className={style.containerPostComponents}>
          {userPosts.map((post) => (
            <PostComponent key={uuid()} post={post} getPosts={getUserPosts} />
          ))}
        </div>
        <div className={style.peopleYouFollow}>
          <h1 className={style.titleOfPeopleYouFollow}>Following</h1>
          {user.following?.map((followed) => (
            <Following key={uuid()} followed={followed} getUserInfo={getInfo} />
          ))}
        </div>
      </div>
    </>
  );
};

export default CurrentUserProfile;
