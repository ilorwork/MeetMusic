import React, { useContext } from "react";
import { followUser } from "../../../helpers/userHelpers";
import UserContext from "../../context/UserContext";
import LoaderContext from "../../context/LoaderContext";
import UserCard from "../UserCard";

const PeopleYouMayKnow = ({
  user,
  getPeopleYouMayKnow,
  getUserInfo,
  getPosts,
}) => {
  const { currentUserInfo } = useContext(UserContext);
  const { setLoading } = useContext(LoaderContext);

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
      <UserCard
        user={user}
        handleFollowUser={handleFollowUser}
        handleUnfollowUser={() => {}}
        isFollowed={false}
        setRecentUsers={() => {}}
      />
    </>
  );
};

export default PeopleYouMayKnow;
