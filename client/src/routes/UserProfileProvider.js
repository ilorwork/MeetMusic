import React, { useContext } from "react";
import { useParams } from "react-router-dom";
import CurrentUserProfile from "../components/users/CurrentUserProfile";
import UserContext from "../components/context/UserContext";
import UserProfile from "../components/users/UserProfile";

const UserProfileProvider = () => {
  const { currentUserInfo } = useContext(UserContext);
  const { id } = useParams();

  if (currentUserInfo._id === id) return <CurrentUserProfile />;
  else return <UserProfile />;
};

export default UserProfileProvider;
