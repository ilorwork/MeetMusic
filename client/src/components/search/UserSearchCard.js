import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import style from "./UserSearchCard.module.css";

const UserSearchCard = (props) => {
  const { user } = props;
  const navigate = useNavigate();
  const location = useLocation();

  const navToUserPage = (e) => {
    const profileEndPoint = `/user-profile/${user._id}`;
    if (location.pathname !== profileEndPoint) navigate(profileEndPoint);
    props.onClick(e);
    props.setAutoVal("");
  };

  return (
    <button className={style.personCard} onClick={navToUserPage}>
      <img
        className={style.personPic}
        width={30}
        height={30}
        src={user.profilePic}
        alt="user pic"
      />

      <span>
        {user.firstName} {user.lastName}
      </span>
    </button>
  );
};

export default UserSearchCard;
