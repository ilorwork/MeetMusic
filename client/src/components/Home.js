import axios from "axios";
import React, { useEffect, useState, useContext } from "react";
import style from "./Home.module.css";
import Following from "./Following";
import PeopleYouMayKnow from "./PeopleYouMayKnow";
import PostComponent from "./PostComponent";
import { v4 as uuid } from "uuid";
import CreateNewPost from "./CreateNewPost";
import { getCurrentUserInfo } from "../helpers/userHelpers";
import UserContext from "./layout/UserContext";

const Home = () => {
  const [user, setUser] = useState("");
  const [posts, setPosts] = useState([]);
  const [peopleUserMayKnow, setPeopleUserMayKnow] = useState([]);

  const { currentUserInfo } = useContext(UserContext);

  useEffect(() => {
    getUserInfo();
    getPosts();
    getPeopleYouMayKnow();
  }, []);

  const getUserInfo = async () => {
    const info = await getCurrentUserInfo(true);
    setUser(info);
  };

  const getPosts = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await axios.get(
        "http://localhost:7000/posts/",
        {
          withCredentials: true,
          headers: {
            authorization: token,
          },
        }
      );
      setPosts(res.data);
    } catch (e) {
      console.error("get posts is failed " + e);
    }
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
            getPosts={getPosts}
          />
        ))}
      </div>
      <div className={style.containerPostComponents}>
        <CreateNewPost getPosts={getPosts} />

        {posts.map((post) => (
          <PostComponent post={post} getPosts={getPosts} key={uuid()} />
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
            getPosts={getPosts}
          />
        ))}
      </div>
    </div>
  );
};

export default Home;
