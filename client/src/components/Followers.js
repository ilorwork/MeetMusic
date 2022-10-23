import { Button } from "@mui/material";
import React, { useEffect, useState } from "react";
import style from "./PeopleSideList.module.css";
import {
  getCurrentUserInfo,
  followUser,
  unfollowUser,
} from "../helpers/userHelpers";
import { useNavigate } from "react-router-dom";

const Followers = ({ follower, getUserInfo }) => {
  const [isCurrentUserFollow, setIsCurrentUserFollow] = useState(false);
  const [isCurrentUser, setIsCurrentUser] = useState(false);
  const [currentUserId, setCurrentUserId] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    getCurrentUserId();
  }, []);

  useEffect(() => {
    if (!currentUserId) return;
    if (follower._id === currentUserId) {
      setIsCurrentUser(true);
      return;
    }
    setIsCurrentUserFollow(follower.followers.includes(currentUserId));
  }, [currentUserId]);

  const getCurrentUserId = async () => {
    const userInfo = await getCurrentUserInfo();
    setCurrentUserId(userInfo._id);
  };

  const handleFollowUser = async () => {
    try {
      await followUser(follower._id);
      setIsCurrentUserFollow(true);
      getUserInfo();
    } catch (e) {
      throw new Error("follow user failed " + e);
    }
  };

  const handleUnfollowUser = async () => {
    try {
      await unfollowUser(follower._id);
      setIsCurrentUserFollow(false);
      getUserInfo();
    } catch (e) {
      throw new Error("unfollow user failed " + e);
    }
  };

  const navToUserPage = () => {
    navigate(`/user-profile/${follower._id}`);
  };

  return (
    <div className={style.personCard}>
      <button className={style.userProfileBtn} onClick={navToUserPage}>
        <img
          className={style.personPic}
          width={70}
          height={70}
          src={follower.profilePic}
          alt="user profile pic"
        />
      </button>
      <span className={style.personName}>
        {follower.firstName} {follower.lastName}
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

export default Followers;
