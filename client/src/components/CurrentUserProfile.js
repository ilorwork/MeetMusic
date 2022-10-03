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
import PeopleYouMayKnow from "./PeopleYouMayKnow";
import PostComponent from "./PostComponent";
import PeopleYouFollow from "./PeopleYouFollow";
import PersonIcon from "@mui/icons-material/Person";
import WcIcon from "@mui/icons-material/Wc";
import EditIcon from "@mui/icons-material/Edit";
import { Button, CardActions, CardHeader } from "@mui/material";
import { getCurrentUserInfo } from "../helpers/userHelpers";

const CurrentUserProfile = () => {
  const [userInfo, setUserInfo] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    getUserInfo();
  }, []);

  const getUserInfo = async () => {
    try {
      const info = await getCurrentUserInfo();
      setUserInfo(info);
    } catch (err) {
      navigate("/login");
    }
  };

  const beautifyDate = (dateAsStirng) => {
    const date = new Date(dateAsStirng);
    //https://bobbyhadz.com/blog/javascript-format-date-mm-dd-yyyy
    const beautifiedDate = [
      date.getDate(),
      date.getMonth() + 1,
      date.getFullYear(),
    ].join("/");

    return beautifiedDate;
  };

  const calculateAge = () =>
    // https://stackoverflow.com/questions/4060004/calculate-age-given-the-birth-date-in-the-format-yyyymmdd
    Math.floor(
      (new Date() - new Date(userInfo.birthDate).getTime()) /
        (365.25 * 24 * 60 * 60 * 1000)
    );

  const handleEditProfile = () => {};

  return (
    <>
      <div className={style.profilePageContainer}>
        <Card className={style.profileInfoCard}>
          <Avatar
            alt="user profileic"
            sx={{ width: 250, height: 250 }}
            src={userInfo.profilePic}
          />
          <CardContent className={style.profileInfoContent}>
            <div className={style.profileHeader}>
              <h1>
                {userInfo.firstName} {userInfo.lastName}
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
                {userInfo.country}
              </Typography>
              <Typography className={style.typographyRow}>
                <LocationCityIcon />
                {userInfo.city}
              </Typography>
              <Typography className={style.typographyRow}>
                <EventIcon />
                {beautifyDate(userInfo.birthDate)}
              </Typography>
              <Typography className={style.typographyRow}>
                <PersonIcon />
                {calculateAge()}
              </Typography>
              <Typography className={style.typographyRow}>
                <WcIcon />
                {userInfo.gender}
              </Typography>
            </div>
            <div className={style.socialInfoContainer}>
              <Typography color="text.secondary">
                {userInfo.followers?.length} followers
              </Typography>
              <Typography color="text.secondary">
                {userInfo.following?.length} following
              </Typography>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className={style.homePage}>
        <div className={style.peopleYouMayKnow}>
          <h1 className={style.titleOfPeopleYouMayKnow}>
            People following you
          </h1>
          {/* <PeopleYouMayKnow />
          <PeopleYouMayKnow />
          <PeopleYouMayKnow />
          <PeopleYouMayKnow />
          <PeopleYouMayKnow /> */}
        </div>
        <div className={style.containerPostComponents}>
          <PostComponent />
          <PostComponent />
          <PostComponent />
          <PostComponent />
          <PostComponent />
        </div>
        <div className={style.peopleYouFollow}>
          <h1 className={style.titleOfPeopleYouFollow}>People you follow</h1>
          <PeopleYouFollow />
          <PeopleYouFollow />
          <PeopleYouFollow />
          <PeopleYouFollow />
          <PeopleYouFollow />
        </div>
      </div>
    </>
  );
};

export default CurrentUserProfile;
