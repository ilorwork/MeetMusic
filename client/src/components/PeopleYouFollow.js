import { Button } from "@mui/material";
import React from "react";
import style from "./PeopleSideList.module.css";

const PeopleYouFollow = () => {
  return (
    <div className={style.personCard}>
      <img
        className={style.personPic}
        width={70}
        height={70}
        src="https://images.unsplash.com/photo-1600486913747-55e5470d6f40?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80"
        alt="man"
      />
      <span className={style.personName}>Miki Cohen</span>
      <Button style={{ background: "rgb(209, 46, 100)" }} variant="contained">
        Unfollow
      </Button>
    </div>
  );
};

export default PeopleYouFollow;
