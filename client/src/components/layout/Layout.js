import React, { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import Header from "./Header";
import { getCurrentUserInfo } from "../../helpers/userHelpers";
import UserContext from "./UserContext";

const Layout = () => {
  const [currentUserInfo, setIsCurrentUserInfo] = useState({});

  useEffect(() => {
    getCurrentUser();
  }, []);

  const getCurrentUser = async () => {
    const info = await getCurrentUserInfo(false);
    setIsCurrentUserInfo(info);
  };

  return (
    <UserContext.Provider value={{ currentUserInfo }}>
      <Header />
      <Outlet />
    </UserContext.Provider>
  );
};

export default Layout;
