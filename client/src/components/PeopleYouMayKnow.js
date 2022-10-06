import React from "react";
import { Button } from "@mui/material";
import style from "./PeopleSideList.module.css";
import { useNavigate } from "react-router-dom";

const PeopleYouMayKnow = ({ user }) => {
  const navigate = useNavigate();

  const navToUserPage = () => {
    console.log("id", user._id);
    navigate(`user_profile/${user._id}`);
  };

  return (
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
      <Button style={{ background: "rgb(38, 165, 165)" }} variant="contained">
        Follow
      </Button>
    </div>
  );
};

export default PeopleYouMayKnow;
