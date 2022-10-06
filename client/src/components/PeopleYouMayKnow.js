import React, { useState } from "react";
import { Button } from "@mui/material";
import style from "./PeopleSideList.module.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const PeopleYouMayKnow = ({
  user,
  getPeopleYouMayKnow,
  getPeopleYouFollow,
}) => {
const navigate = useNavigate();

const navToUserPage = () => {
    console.log("id", user._id);
    navigate(`user_profile/${user._id}`);
  };

  const followTheUser = async () => {
    const token = localStorage.getItem("token");
    const idOfUserFollowed = user._id;
    try {
      await axios.patch(
        "http://localhost:7000/users/user/follow",
        { _id: idOfUserFollowed },
        {
          withCredentials: true,
          headers: {
            authorization: token,
          },
        }
      );
      getPeopleYouMayKnow();
      getPeopleYouFollow();
    } catch (e) {
      throw new Error("follow another user failed " + e);
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
          style={{ background: "rgb(38, 165, 165)" }}
          variant="contained"
          onClick={followTheUser}
        >
          Follow
        </Button>
      </div>
    </>
  );
};

export default PeopleYouMayKnow;
