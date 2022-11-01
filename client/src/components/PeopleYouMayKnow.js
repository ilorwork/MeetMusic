import React, { useContext } from "react";
import { Button } from "@mui/material";
import style from "./PeopleSideList.module.css";
import { useNavigate } from "react-router-dom";
import { followUser } from "../helpers/userHelpers";
import UserContext from "./layout/UserContext";
import LoaderContext from "./context/LoaderContext";

const PeopleYouMayKnow = ({
  user,
  getPeopleYouMayKnow,
  getUserInfo,
  getPosts,
}) => {
  const { currentUserInfo } = useContext(UserContext);
  const { setLoading } = useContext(LoaderContext);

  const navigate = useNavigate();

  const navToUserPage = () => {
    navigate(`user-profile/${user._id}`);
  };

  const handleFollowUser = async () => {
    setLoading(true);
    try {
      await followUser(user._id, currentUserInfo);
      getPeopleYouMayKnow();
      await getUserInfo();
      getPosts();
    } catch (e) {
      throw new Error("follow user failed " + e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className={style.personCard}>
        <button className={style.userProfileBtn} onClick={navToUserPage}>
          <img
            className={style.personPic}
            width={70}
            height={70}
            src={user.profilePic}
            alt="user profile pic"
          />
        </button>
        <span className={style.personName}>
          <div>{user.firstName}</div>
          <div>{user.lastName}</div>
        </span>
        <Button
          className={style.followButton}
          style={{ background: "rgb(209, 46, 100)", fontSize: 10 }}
          variant="contained"
          onClick={handleFollowUser}
        >
          Follow
        </Button>
      </div>
    </>
  );
};

export default PeopleYouMayKnow;
