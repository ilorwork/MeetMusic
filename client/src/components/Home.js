import axios from "axios";
import React, { useEffect, useState } from "react";
import style from "./Home.module.css";
import Following from "./Following";
import PeopleYouMayKnow from "./PeopleYouMayKnow";
import PostComponent from "./PostComponent";
import { v4 as uuid } from "uuid";
import CreateNewPost from "./CreateNewPost";
import { getCurrentUserInfo } from "../helpers/userHelpers";

const Home = () => {
  const [user, setUser] = useState("");
  const [allPosts, setAllPosts] = useState([]);
  const [peopleUserMayKnow, setPeopleUserMayKnow] = useState([]);

  useEffect(() => {
    getUserInfo();
    getAllPosts();
    getPeopleYouMayKnow();
  }, []);

  const getUserInfo = async () => {
    const info = await getCurrentUserInfo(true);
    setUser(info);
  };

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

  return (
    <div className={style.homePage}>
      <div className={style.peopleYouMayKnow}>
        <h1 className={style.titleOfPeopleYouMayKnow}>People you may know</h1>
        {peopleUserMayKnow.map((user) => (
          <PeopleYouMayKnow
            user={user}
            getPeopleYouMayKnow={getPeopleYouMayKnow}
            getUserInfo={getUserInfo}
            key={uuid()}
          />
        ))}
      </div>
      <div className={style.containerPostComponents}>
        <CreateNewPost getAllPosts={getAllPosts} />

        {allPosts.map((post) => (
          <PostComponent post={post} getPosts={getAllPosts} key={uuid()} />
        ))}
      </div>
      <div className={style.peopleYouFollow}>
        <h1 className={style.titleOfPeopleYouFollow}>People you follow</h1>
        {user.following?.map((followed) => (
          <Following
            key={uuid()}
            followed={followed}
            getUserInfo={getUserInfo}
            getPeopleYouMayKnow={getPeopleYouMayKnow}
          />
        ))}
      </div>
    </div>
  );
};

export default Home;
