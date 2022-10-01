import React from "react";
import { Button } from "@mui/material";
import style from "./PeopleSideList.module.css";

const PeopleYouMayKnow = ({ user }) => {
  return (
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
      <Button style={{ background: "rgb(38, 165, 165)" }} variant="contained">
        Follow
      </Button>
    </div>
  );
};

export default PeopleYouMayKnow;
