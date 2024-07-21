import React, { useContext, useEffect, useState } from "react";
import { followUser, unfollowUser } from "../../../helpers/userHelpers";
import UserContext from "../../context/UserContext";
import LoaderContext from "../../context/LoaderContext";
import UserCard from "../UserCard";

const Followers = ({ follower, getUserInfo }) => {
  const [isCurrentUserFollow, setIsCurrentUserFollow] = useState(false);

  const { currentUserInfo } = useContext(UserContext);
  const { setLoading } = useContext(LoaderContext);

  useEffect(() => {
    setIsCurrentUserFollow(follower.followers.includes(currentUserInfo._id));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleFollowUser = async () => {
    setLoading(true);
    try {
      await followUser(follower._id, currentUserInfo);
      setIsCurrentUserFollow(true);
      await getUserInfo();
    } catch (e) {
      throw new Error("follow user failed " + e);
    } finally {
      setLoading(false);
    }
  };

  const handleUnfollowUser = async () => {
    setLoading(true);
    try {
      await unfollowUser(follower._id);
      setIsCurrentUserFollow(false);
      await getUserInfo();
    } catch (e) {
      throw new Error("unfollow user failed " + e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <UserCard
      user={follower}
      handleFollowUser={handleFollowUser}
      handleUnfollowUser={handleUnfollowUser}
      isFollowed={isCurrentUserFollow}
    />
  );
};

export default Followers;
