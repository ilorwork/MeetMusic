import axios from "axios";
import React, { useEffect, useState } from "react";
import style from "./Home.module.css";
import PeopleYouFollow from "./PeopleYouFollow";
import PeopleYouMayKnow from "./PeopleYouMayKnow";
import PostComponent from "./PostComponent";
import { v4 as uuid } from "uuid";
import CreateNewPost from "./CreateNewPost";

const Home = () => {
  const [peopleUserMayKnow, setPeopleUserMayKnow] = useState([]);

  useEffect(() => {
    getPeopleYouMayKnow();
  }, []);

  const getPeopleYouMayKnow = async () => {
    const token = localStorage.getItem("token");

    const res = await axios.get(
      "http://localhost:7000/users/user/people-user-may-know",
      {
        withCredentials: true,
        headers: {
          authorization: token,
        },
      }
    );
    setPeopleUserMayKnow(res.data);
  };

  return (
    <div className={style.homePage}>
      <div className={style.peopleYouMayKnow}>
        <h1 className={style.titleOfPeopleYouMayKnow}>People you may know</h1>
        {peopleUserMayKnow.map((user) => (
          <PeopleYouMayKnow user={user} key={uuid()} />
        ))}
      </div>
      <div className={style.containerPostComponents}>
        <CreateNewPost />
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
  );
};

export default Home;
