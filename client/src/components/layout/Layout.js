import React, { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import Header from "./Header";
import { getCurrentUserInfo } from "../../helpers/userHelpers";
import UserContext from "../context/UserContext";
import LoaderContext from "../context/LoaderContext";
import Loader from "../common/Loader";

const Layout = () => {
  const [currentUserInfo, setIsCurrentUserInfo] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getCurrentUser();
  }, []);

  const getCurrentUser = async () => {
    const info = await getCurrentUserInfo(false);
    setIsCurrentUserInfo(info);
  };

  return (
    <UserContext.Provider value={{ currentUserInfo }}>
      <LoaderContext.Provider value={{ setLoading }}>
        <Loader loading={loading} />
        <Header />
        <Outlet />
      </LoaderContext.Provider>
    </UserContext.Provider>
  );
};

export default Layout;
