import React, { useContext, useEffect, useState } from "react";
import style from "./Home.module.css";
import Following from "./Following";
import PeopleYouMayKnow from "./PeopleYouMayKnow";
import PostComponent from "./PostComponent";
import { v4 as uuid } from "uuid";
import CreateNewPost from "./CreateNewPost";
import {
  getCurrentUserInfo,
  getPeopleYouMayKnowHelper,
} from "../helpers/userHelpers";
import { getHomePosts } from "../helpers/postHelpers";
import LoaderContext from "./context/LoaderContext";

const Home = () => {
  const [user, setUser] = useState("");
  const [posts, setPosts] = useState([]);
  const [peopleUserMayKnow, setPeopleUserMayKnow] = useState([]);

  const { setLoading } = useContext(LoaderContext);

  useEffect(() => {
    setLoading(true);
    getUserInfo();
    getPosts();
    getPeopleYouMayKnow();
  }, []);

  const getUserInfo = async () => {
    const info = await getCurrentUserInfo(true);
    setUser(info);
  };

  const getPosts = async () => {
    try {
      const posts = await getHomePosts();
      setPosts(posts);
    } catch (e) {
      console.error("get posts is failed " + e);
    } finally {
      setLoading(false);
    }
  };

  const getPeopleYouMayKnow = async () => {
    const people = await getPeopleYouMayKnowHelper();
    setPeopleUserMayKnow(people);
  };

  return (
    <div className={style.homePage}>
      <div className={style.peopleYouMayKnow}>
        <h2 className={style.sectionTitle}>People you may know</h2>
        <div className={style.usersListWrapper}>
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
      </div>
      <div className={style.containerPostComponents}>
        <CreateNewPost getPosts={getPosts} />

        {posts.map((post) => (
          <PostComponent
            post={post}
            getPosts={getPosts}
            getPeopleYouMayKnow={getPeopleYouMayKnow}
            getUserInfo={getUserInfo}
            key={uuid()}
          />
        ))}
      </div>
      <div className={style.peopleYouFollow}>
        <h2 className={style.sectionTitle}>People you follow</h2>
        <div className={style.usersListWrapper}>
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
    </div>
  );
};

export default Home;
