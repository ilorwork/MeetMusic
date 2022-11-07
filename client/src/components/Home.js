import React, { useContext, useEffect, useRef, useState } from "react";
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
  const [page, setPage] = useState(1);
  const [inView, setInView] = useState(false);
  const loadingRef = useRef({});

  const { setLoading } = useContext(LoaderContext);

  useEffect(() => {
    setLoading(true);
    getUserInfo();
    getPosts();
    getPeopleYouMayKnow();
  }, []);

  useEffect(() => {
    if (page === 1) return;
    setLoading(true);
    getPosts();
  }, [page]);

  const getUserInfo = async () => {
    const info = await getCurrentUserInfo(true);
    setUser(info);
  };

  const getPosts = async () => {
    try {
      const postsArr = await getHomePosts(page);
      setPosts([...posts, ...postsArr]);
      setInView(false);
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

  const isScrolledIntoView = (el) => {
    if (inView) return;
    const emptyObj = {};
    if (el === emptyObj) return;
    var rect = el.getBoundingClientRect();
    var elemTop = rect.top;
    var elemBottom = rect.bottom;
    // Only completely visible elements return true:
    var isVisible = elemTop >= 0 && elemBottom <= window.innerHeight;
    // Partially visible elements return true:
    //isVisible = elemTop < window.innerHeight && elemBottom >= 0;
    console.log(isVisible);

    if (isVisible) {
      setInView(true);
      setPage((prev) => prev + 1);
    }
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
      <div
        onScroll={() => isScrolledIntoView(loadingRef.current)}
        className={style.containerPostComponents}
      >
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
        <div ref={loadingRef} className={style.trigger}></div>
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
