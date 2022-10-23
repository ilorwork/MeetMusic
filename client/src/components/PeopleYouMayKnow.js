import React from "react";
import { Button } from "@mui/material";
import style from "./PeopleSideList.module.css";
import { useNavigate } from "react-router-dom";
import { followUser } from "../helpers/userHelpers";

const PeopleYouMayKnow = ({ user, getPeopleYouMayKnow, getUserInfo }) => {
  const navigate = useNavigate();

  const navToUserPage = () => {
    navigate(`user-profile/${user._id}`);
  };

  const handleFollowUser = async () => {
    try {
      await followUser(user._id);
      getPeopleYouMayKnow();
      getUserInfo();
    } catch (e) {
      throw new Error("follow user failed " + e);
    }
  };

  return (
    <>
      <div className={style.personCard}>
        <button className={style.userProfileBtn} onClick={navToUserPage}>
          <img
            className={style.personPic}
            width={70}
            height={70}
            src={user.profilePic}
            alt="user profile pic"
          />
        </button>
        <span className={style.personName}>
          {user.firstName} {user.lastName}
        </span>
        <Button
          style={{ background: "rgb(209, 46, 100)", fontSize: 10 }}
          variant="contained"
          onClick={handleFollowUser}
        >
          Follow
        </Button>
      </div>
    </>
  );
};

export default PeopleYouMayKnow;
