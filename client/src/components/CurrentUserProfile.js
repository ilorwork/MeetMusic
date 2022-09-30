import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const CurrentUserProfile = () => {
  const [userInfo, setUserInfo] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    getUserInfo();
  }, []);

  const getUserInfo = async () => {
    const token = localStorage.getItem("token");

    try {
      const res = await axios.get("http://localhost:7000/users/user", {
        withCredentials: true,
        headers: {
          authorization: token,
        },
      });
      setUserInfo(res.data);
    } catch (err) {
      navigate("/login");
    }
  };

  return <div>{userInfo.firstName}</div>;
};

export default CurrentUserProfile;
