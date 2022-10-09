import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import CurrentUserProfile from "../components/CurrentUserProfile";
import Home from "../components/Home";
import Layout from "../components/layout/Layout";
import LogIn from "../components/LogIn";
import Register from "../components/Register";
import UserProfile from "../components/UserProfile";

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LogIn />}></Route>
        <Route path="/register" element={<Register />}></Route>
        <Route path="/" element={<Layout />}>
          <Route path="" element={<Home />}></Route>
          <Route
            path="current-user-profile"
            element={<CurrentUserProfile />}
          ></Route>
          <Route path="user-profile/:id" element={<UserProfile />}></Route>
        </Route>
      </Routes>
    </Router>
  );
};

export default AppRoutes;
