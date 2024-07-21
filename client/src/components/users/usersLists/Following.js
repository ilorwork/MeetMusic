import React, { useContext, useEffect, useState } from "react";
import { followUser, unfollowUser } from "../../../helpers/userHelpers";
import { useNavigate } from "react-router-dom";
import UserContext from "../../context/UserContext";
import LoaderContext from "../../context/LoaderContext";
import UserCard from "../UserCard";

const Following = ({
  followed,
  getUserInfo,
  getPeopleYouMayKnow = () => {},
  getPosts = () => {},
}) => {
  const [isCurrentUserFollow, setIsCurrentUserFollow] = useState(true);

  const { currentUserInfo } = useContext(UserContext);
  const { setLoading } = useContext(LoaderContext);

  const navigate = useNavigate();

  useEffect(() => {
    setIsCurrentUserFollow(followed.followers.includes(currentUserInfo._id));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleFollowUser = async () => {
    setLoading(true);
    try {
      await followUser(followed._id, currentUserInfo);
      getPeopleYouMayKnow();
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
      await unfollowUser(followed._id);
      getPeopleYouMayKnow();
      await getUserInfo();
      getPosts();
    } catch (e) {
      throw new Error("unfollow user failed " + e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <UserCard
      user={followed}
      handleFollowUser={handleFollowUser}
      handleUnfollowUser={handleUnfollowUser}
      isFollowed={isCurrentUserFollow}
    />
  );
};

export default Following;
