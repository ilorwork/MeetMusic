import axios from "axios";
import React, { useEffect, useState } from "react";
import style from "./Home.module.css";
import PeopleYouFollow from "./PeopleYouFollow";
import PeopleYouMayKnow from "./PeopleYouMayKnow";
import PostComponent from "./PostComponent";
import { v4 as uuid } from "uuid";

const Home = () => {
  const [allUsers, setAllUsers] = useState([]);

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
    setAllUsers(res.data);
  };

  return (
    <div className={style.homePage}>
      <div className={style.peopleYouMayKnow}>
        <h1 className={style.titleOfPeopleYouMayKnow}>People you may know</h1>
        {allUsers.map((user) => (
          <PeopleYouMayKnow user={user} key={uuid()} />
        ))}
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
  );
};

export default Home;
