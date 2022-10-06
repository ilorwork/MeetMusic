import { Button } from "@mui/material";
import axios from "axios";
import React, { useState } from "react";
import style from "./PeopleSideList.module.css";

const PeopleYouFollow = ({
  user,
  getPeopleYouMayKnow = () => {},
  getPeopleYouFollow,
}) => {
  const unfollowUser = async () => {
    const token = localStorage.getItem("token");
    try {
      await axios.patch(
        "http://localhost:7000/users/user/unfollow",
        { _id: user._id },
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
      throw new Error("unfollow another user failed " + e);
    }
  };

  return (
    <>
      <div className={style.personCard}>
        <img
          className={style.personPic}
          width={70}
          height={70}
          src={user.profilePic}
          alt="user profile pic"
        />
        <span className={style.personName}>
          {user.firstName} {user.lastName}
        </span>
        <Button
          style={{ background: "rgb(209, 46, 100)" }}
          variant="contained"
          onClick={unfollowUser}
        >
          Unfollow
        </Button>
      </div>
    </>
  );
};

export default PeopleYouFollow;
