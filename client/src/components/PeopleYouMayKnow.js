import React, { useState } from "react";
import { Button } from "@mui/material";
import style from "./PeopleSideList.module.css";
import axios from "axios";

const PeopleYouMayKnow = ({ user }) => {
  const [isFollow, setIsFollow] = useState(false);

  const followTheUser = async () => {
    const token = localStorage.getItem("token");
    const idOfUserFollowed = user._id;
    try {
      await axios.patch("http://localhost:7000/users/user/follow",
        { _id: idOfUserFollowed },
        {
          withCredentials: true,
          headers: {
            authorization: token,
          },
        });
      setIsFollow(true);
    } catch (e) {
      throw new Error("follow another user failed " + e);
    }
  }

  return (
    <>
      {!isFollow && <div className={style.personCard}>
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
        <Button style={{ background: "rgb(38, 165, 165)" }} variant="contained"
          onClick={() => followTheUser()}>
          Follow
        </Button>
      </div>}
    </>
  );
};

export default PeopleYouMayKnow;
