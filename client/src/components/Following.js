import { Button } from "@mui/material";
import React, { useEffect, useState } from "react";
import style from "./PeopleSideList.module.css";
import {
  getCurrentUserInfo,
  followUser,
  unfollowUser,
  notifyUser,
} from "../helpers/userHelpers";
import { useNavigate } from "react-router-dom";

const Following = ({
  followed,
  getUserInfo,
  getPeopleYouMayKnow = () => {},
}) => {
  const [isCurrentUserFollow, setIsCurrentUserFollow] = useState(true);
  const [isCurrentUser, setIsCurrentUser] = useState(false);
  const [currentUserId, setCurrentUserId] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    getCurrentUserId();
  }, []);

  useEffect(() => {
    if (!currentUserId) return;
    if (followed._id === currentUserId) {
      setIsCurrentUser(true);
      return;
    }
    setIsCurrentUserFollow(followed.followers.includes(currentUserId));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUserId]);

  const getCurrentUserId = async () => {
    const userInfo = await getCurrentUserInfo();
    setCurrentUserId(userInfo._id);
  };

  const handleFollowUser = async () => {
    try {
      await followUser(followed._id);
      console.log("got here");
      await notifyUser(followed._id, currentUserId + " started following you");
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
