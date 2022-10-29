import React, { useContext } from "react";
import { useParams } from "react-router-dom";
import CurrentUserProfile from "../components/CurrentUserProfile";
import UserContext from "../components/layout/UserContext";
import UserProfile from "../components/UserProfile";

const UserProfileProvider = () => {
  const { currentUserInfo } = useContext(UserContext);
  const { id } = useParams();

  if (currentUserInfo._id === id) return <CurrentUserProfile />;
  else return <UserProfile />;
};

export default UserProfileProvider;
