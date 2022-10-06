import { Button } from "@mui/material";
import axios from "axios";
import React, { useState } from "react";
import style from "./PeopleSideList.module.css";

const PeopleYouFollow = ({ user }) => {
  const [isUnFollow, setIsUnFollow] = useState(false);

  const unFollowTheUser = async () => {
    const token = localStorage.getItem("token");
    const idOfUserFollowed = user._id;
    try {
      await axios.patch("http://localhost:7000/users/user/unfollow",
        { _id: idOfUserFollowed },
        {
          withCredentials: true,
          headers: {
            authorization: token,
          },
        });
      setIsUnFollow(true);
    } catch (e) {
      throw new Error("unfollow another user failed " + e);
    }
  }

  return (
    <>
      {!isUnFollow &&
        <div className={style.personCard}>
          <img
            className={style.personPic}
            width={70}
            height={70}
            src={user.profilePic}
            alt="user profile pic"
          />
          <span className={style.personName}>{user.firstName} {user.lastName}</span>
          <Button style={{ background: "rgb(209, 46, 100)" }} variant="contained"
            onClick={() => unFollowTheUser()}>
            Unfollow
          </Button>
        </div>}
    </>
  );
};

export default PeopleYouFollow;
