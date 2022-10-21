import { Button } from "@mui/material";
import React, { useEffect, useState } from "react";
import style from "./PeopleSideList.module.css";
import {
  getCurrentUserInfo,
  followUser,
  unfollowUser,
} from "../helpers/userHelpers";

const Followers = ({ follower, getUserInfo }) => {
  const [isCurrentUserFollow, setIsCurrentUserFollow] = useState(false);
  const [currentUserId, setCurrentUserId] = useState("");

  useEffect(() => {
    getCurrentUserId();
  }, []);

  useEffect(() => {
    if (!currentUserId) return;
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

  return (
    <div className={style.personCard}>
      <img
        className={style.personPic}
        width={70}
        height={70}
        src={follower.profilePic}
        alt="user profile pic"
      />
      <span className={style.personName}>
        {follower.firstName} {follower.lastName}
      </span>
      {isCurrentUserFollow && (
        <Button
          style={{ background: "rgb(209, 46, 100)", fontSize: 10 }}
          variant="contained"
          onClick={handleUnfollowUser}
        >
          UnFollow
        </Button>
      )}
      {!isCurrentUserFollow && (
        <Button
          style={{ background: "rgb(38, 165, 165)", fontSize: 10 }}
          variant="contained"
          onClick={handleFollowUser}
        >
          Follow
        </Button>
      )}
    </div>
  );
};

export default Followers;
