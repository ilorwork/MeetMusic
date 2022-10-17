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
import PostComponent from "./PostComponent";
import Followers from "./Followers";
import Following from "./Following";
import PersonIcon from "@mui/icons-material/Person";
import WcIcon from "@mui/icons-material/Wc";
import { v4 as uuid } from "uuid";

const UserProfile = () => {
  const [user, setUser] = useState("");
  const [userPosts, setUserPosts] = useState([]);

  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    getUserInfo();
    getUserPosts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const getUserInfo = async () => {
    try {
      const res = await axios.post("http://localhost:7000/users/user", {
        _id: id,
      });

      setUser(res.data);
    } catch (e) {
      if (e.response.status === 401) {
        navigate("/login");
      } else throw e;
    }
  };

  const getUserPosts = async () => {
    const res = await axios.post("http://localhost:7000/posts/user-posts", {
      _id: id,
    });

    setUserPosts(res.data);
  };

  const calculateAge = () =>
    (
      (new Date() - new Date(user.birthDate).getTime()) /
      (365.25 * 24 * 60 * 60 * 1000)
    ).toFixed(1);

  return (
    <>
      <div className={style.profilePageContainer}>
        <Card className={style.profileInfoCard}>
          <Avatar
            alt="user profile pic"
            sx={{ width: 250, height: 250 }}
            src={user.profilePic}
          />

          <CardContent className={style.profileInfoContent}>
            <div className={style.profileHeader}>
              <h1>
                {user.firstName} {user.lastName}
              </h1>
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
            <Followers
              key={uuid()}
              follower={follower}
              getUserInfo={getUserInfo}
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
          {user.following?.map((followed) => (
            <Following
              followed={followed}
              getUserInfo={getUserInfo}
              key={uuid()}
            />
          ))}
        </div>
      </div>
    </>
  );
};

export default UserProfile;
