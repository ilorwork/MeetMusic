import axios from "axios";
import React, { useEffect, useState } from "react";
import style from "./Home.module.css";
import PeopleYouFollow from "./PeopleYouFollow";
import PeopleYouMayKnow from "./PeopleYouMayKnow";
import PostComponent from "./PostComponent";
import { v4 as uuid } from "uuid";
import CreateNewPost from "./CreateNewPost";

const Home = () => {
  const [allPosts, setAllPosts] = useState([]);
  const [peopleUserMayKnow, setPeopleUserMayKnow] = useState([]);
  const [poepleYouFollow, setPeopleYouFollow] = useState([]);

  useEffect(() => {
    getAllPosts();
    getPeopleYouMayKnow();
    getPeopleYouFollow();
  }, []);

  const getAllPosts = async () => {
    const res = await axios.get("http://localhost:7000/posts/");
    setAllPosts(res.data);
  };

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

  const getPeopleYouFollow = async () => {
    const token = localStorage.getItem("token");

    const res = await axios.get(
      "http://localhost:7000/users/current-user/following",
      {
        withCredentials: true,
        headers: {
          authorization: token,
        },
      }
    );
    setPeopleYouFollow(res.data);
  };

  return (
    <div className={style.homePage}>
      <div className={style.peopleYouMayKnow}>
        <h1 className={style.titleOfPeopleYouMayKnow}>People you may know</h1>
        {peopleUserMayKnow.map((user) => (
          <PeopleYouMayKnow
            user={user}
            getPeopleYouMayKnow={getPeopleYouMayKnow}
            getPeopleYouFollow={getPeopleYouFollow}
            key={uuid()}
          />
        ))}
      </div>
      <div className={style.containerPostComponents}>
        <CreateNewPost getAllPosts={getAllPosts} />

        {allPosts.map((post) => (
          <PostComponent post={post} getAllPosts={getAllPosts} key={uuid()} />
        ))}
      </div>
      <div className={style.peopleYouFollow}>
        <h1 className={style.titleOfPeopleYouFollow}>People you follow</h1>
        {poepleYouFollow.map((user) => (
          <PeopleYouFollow
            user={user}
            getPeopleYouMayKnow={getPeopleYouMayKnow}
            getPeopleYouFollow={getPeopleYouFollow}
            key={uuid()}
          />
        ))}
      </div>
    </div>
  );
};

export default Home;
