import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AboutUs from "../components/AboutUs";
import Home from "../components/Home";
import Layout from "../components/layout/Layout";
import LogIn from "../components/LogIn";
import Register from "../components/Register";
import UserProfileProvider from "./UserProfileProvider";

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LogIn />}></Route>
        <Route path="/register" element={<Register />}></Route>
        <Route path="/about" element={<AboutUs />}></Route>
        <Route path="/" element={<Layout />}>
          <Route path="" element={<Home />}></Route>
          <Route
            path="/user-profile/:id"
            element={<UserProfileProvider />}
          ></Route>
        </Route>
        <Route path="/*" element={<h1>404 not found</h1>} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
