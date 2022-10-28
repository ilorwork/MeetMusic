import axios from "axios";
import React, {
  useEffect,
  //  useRef, 
  useState
} from "react";
import style from "./Home.module.css";
import Following from "./Following";
import PeopleYouMayKnow from "./PeopleYouMayKnow";
import PostComponent from "./PostComponent";
import { v4 as uuid } from "uuid";
import CreateNewPost from "./CreateNewPost";
import { getCurrentUserInfo } from "../helpers/userHelpers";
import config from "../config/config.json";
// import useLazyLoading from "react-simple-lazy-loading";

const Home = () => {
  // const loadingRef = useRef(null);
  // const options = {
  //   refTriger: loadingRef,
  //   rootMargin: "100px",
  //   threshold: 1.0,
  //   url: `${config.base_url}/posts/`
  // }


  // const { data, loading, page } = useLazyLoading(options);

  // useEffect(() => {
  //   console.log(data, loading, page);
  // }, [data]);

  const [user, setUser] = useState("");
  const [posts, setPosts] = useState([]);
  const [peopleUserMayKnow, setPeopleUserMayKnow] = useState([]);

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
        `${config.base_url}/posts/`,
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
      `${config.base_url}/users/user/people-user-may-know`,
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
          <PostComponent post={post} getPosts={getPosts}
            getPeopleYouMayKnow={getPeopleYouMayKnow} getUserInfo={getUserInfo} key={uuid()} />
        ))}
        {/* <div ref={loadingRef} sx={{ height: "200px", background: "red" }}></div> */}
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
