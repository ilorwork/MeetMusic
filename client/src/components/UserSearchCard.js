import React from "react";
import { useNavigate } from "react-router-dom";
import style from "./UserSearchCard.module.css";

const UserSearchCard = ({ user }) => {
  const navigate = useNavigate();

  const navToUserPage = () => {
    navigate(`user-profile/${user._id}`);
    navigate(0);
    // window.location.reload();
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
