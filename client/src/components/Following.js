import { Button } from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import style from "./PeopleSideList.module.css";
import { followUser, unfollowUser } from "../helpers/userHelpers";
import { useNavigate } from "react-router-dom";
import UserContext from "./layout/UserContext";

const Following = ({
  followed,
  getUserInfo,
  getPeopleYouMayKnow = () => {},
}) => {
  const [isCurrentUserFollow, setIsCurrentUserFollow] = useState(true);
  const [isCurrentUser, setIsCurrentUser] = useState(false);

  const { currentUserInfo } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (followed._id === currentUserInfo._id) {
      setIsCurrentUser(true);
      return;
    }
    setIsCurrentUserFollow(followed.followers.includes(currentUserInfo._id));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleFollowUser = async () => {
    try {
      await followUser(followed._id, currentUserInfo);
      getPeopleYouMayKnow();
      getUserInfo();
    } catch (e) {
      throw new Error("follow user failed " + e);
    }
  };

  const handleUnfollowUser = async () => {
    try {
      await unfollowUser(followed._id);
      getPeopleYouMayKnow();
      getUserInfo();
    } catch (e) {
      throw new Error("unfollow user failed " + e);
    }
  };

  const navToUserPage = () => {
    navigate(`/user-profile/${followed._id}`);
  };

  return (
    <div className={style.personCard}>
      <button className={style.userProfileBtn} onClick={navToUserPage}>
        <img
          className={style.personPic}
          width={70}
          height={70}
          src={followed.profilePic}
          alt="user profile pic"
        />
      </button>
      <span className={style.personName}>
        {followed.firstName} {followed.lastName}
      </span>
      {isCurrentUserFollow && !isCurrentUser && (
        <Button
          style={{ background: "rgb(19 137 137)", fontSize: 10 }}
          variant="contained"
          onClick={handleUnfollowUser}
        >
          UnFollow
        </Button>
      )}
      {!isCurrentUserFollow && !isCurrentUser && (
        <Button
          style={{ background: "rgb(209, 46, 100)", fontSize: 10 }}
          variant="contained"
          onClick={handleFollowUser}
        >
          Follow
        </Button>
      )}
      {isCurrentUser && (
        <Button
          style={{ background: "disable", color: "black", fontSize: 10 }}
          variant="contained"
          onClick={handleFollowUser}
          disabled
        >
          yourself
        </Button>
      )}
    </div>
  );
};

export default Following;
