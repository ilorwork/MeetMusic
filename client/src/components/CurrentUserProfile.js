import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Avatar from "@mui/material/Avatar";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import PublicIcon from "@mui/icons-material/Public";
import LocationCityIcon from "@mui/icons-material/LocationCity";
import EventIcon from "@mui/icons-material/Event";
import style from "./CurrentUserProfile.module.css";
import PeopleYouMayKnow from "./PeopleYouMayKnow";
import PostComponent from "./PostComponent";
import PeopleFollowYou from "./peopleFollowYou";
import PeopleYouFollow from "./PeopleYouFollow";
import PersonIcon from "@mui/icons-material/Person";
import WcIcon from "@mui/icons-material/Wc";
import EditIcon from "@mui/icons-material/Edit";
import {
  Button,
  CardActions,
  CardHeader,
  IconButton,
  Tooltip,
} from "@mui/material";
import { getCurrentUserInfo } from "../helpers/userHelpers";
import { v4 as uuid } from "uuid";

// TODO: rename to UserProgilePage
const CurrentUserProfile = () => {
  const [isCurrentUser, setIsCurrentUser] = useState(false);
  const [user, setUser] = useState("");
  const [poepleYouFollow, setPeopleYouFollow] = useState([]);
  const [followers, setFollowers] = useState([]);
  const [userPosts, setUserPosts] = useState([]);

  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (!id) return;
    getUserInfo();
  }, []);

  useEffect(() => {
    if (!user) return;
    getUserPosts();
  }, [user]);

  const getUserInfo = async () => {
    console.log("userId", id);
    try {
      if (id === "current_user") {
        const currntUserInfo = await getCurrentUserInfo();
        setIsCurrentUser(true);
        setUser(currntUserInfo);
        getPeopleYouFollow();
      } else {
        const token = localStorage.getItem("token");
        const res = await axios.post(
          "http://localhost:7000/users/user/id",
          { _id: id },
          {
            withCredentials: true,
            headers: {
              authorization: token,
            },
          }
        );
        setUser(res.data);
        getPeopleUserFollow(res.data._id);
      }
      getFollowers();
    } catch (e) {
      navigate("/login");
    }
  };

  const getUserPosts = async () => {
    const token = localStorage.getItem("token");
    const res = await axios.post(
      "http://localhost:7000/posts/user-posts",
      { _id: user._id },
      {
        withCredentials: true,
        headers: {
          authorization: token,
        },
      }
    );
    setUserPosts(res.data);
  };

  const calculateAge = () =>
    // https://stackoverflow.com/questions/4060004/calculate-age-given-the-birth-date-in-the-format-yyyymmdd
    Math.floor(
      (new Date() - new Date(user.birthDate).getTime()) /
        (365.25 * 24 * 60 * 60 * 1000)
    );

  const handleEditProfile = () => {};

  const getPeopleYouFollow = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await axios.get(
        "http://localhost:7000/users/current-user/following",
        {
          withCredentials: true,
          headers: {
            authorization: token,
          },
        }
      );
      setPeopleYouFollow(res.data);
    } catch (e) {
      throw new Error("get people you follow failed " + e);
    }
  };

  const getPeopleUserFollow = async (id) => {
    const token = localStorage.getItem("token");
    try {
      const res = await axios.post(
        "http://localhost:7000/users/user/following",
        { _id: id },
        {
          withCredentials: true,
          headers: {
            authorization: token,
          },
        }
      );
      setPeopleYouFollow(res.data);
    } catch (e) {
      throw new Error("get people you follow failed " + e);
    }
  };

  //TODO: remove duplication with Home
  const getFollowers = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await axios.get(
        "http://localhost:7000/users/current-user/followers",
        {
          withCredentials: true,
          headers: {
            authorization: token,
          },
        }
      );
      setFollowers(res.data);
    } catch (e) {
      throw new Error("get followers failed " + e);
    }
  };

  const handlePicChange = (e) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (reader.readyState === 2) {
        editUser({ profilePic: reader.result });
      }
    };

    reader.readAsDataURL(e.target.files[0]);
  };

  const editUser = async (data) => {
    const token = localStorage.getItem("token");
    const res = await axios.put("http://localhost:7000/users/", data, {
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
          {isCurrentUser && (
            <input
              hidden
              accept="image/*"
              id="icon-button-file"
              type="file"
              onChange={handlePicChange}
            />
          )}
          <label htmlFor="icon-button-file">
            <Tooltip title="Click to replace">
              <IconButton
                // color="primary"
                // aria-label="upload picture"
                component="span"
              >
                <Avatar
                  alt="user profileic"
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
              {isCurrentUser && (
                <Button
                  className={style.editProfileBtn}
                  size="small"
                  onClick={handleEditProfile}
                >
                  <EditIcon />
                </Button>
              )}
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
          {followers.map((folower) => (
            <PeopleFollowYou
              user={folower}
              getPeopleYouFollow={getPeopleYouFollow}
              getFollowers={getFollowers}
              userInfo={user}
              key={uuid()}
            />
          ))}
        </div>
        <div className={style.containerPostComponents}>
          {userPosts.map((post) => (
            <PostComponent post={post} key={uuid()} />
          ))}
        </div>
        <div className={style.peopleYouFollow}>
          <h1 className={style.titleOfPeopleYouFollow}>Following</h1>
          {poepleYouFollow.map((user) => (
            <PeopleYouFollow
              user={user}
              getPeopleYouFollow={getPeopleYouFollow}
              key={uuid()}
            />
          ))}
        </div>
      </div>
    </>
  );
};

export default CurrentUserProfile;
