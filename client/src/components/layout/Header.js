import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import LibraryMusicIcon from "@mui/icons-material/LibraryMusic";
import {
  Autocomplete,
  Badge,
  Box,
  Menu,
  MenuItem,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import style from "./Header.module.css";
import NotificationsIcon from "@mui/icons-material/Notifications";
import axios from "axios";
import { getAllUsers } from "../../helpers/userHelpers";
import UserSearchCard from "../UserSearchCard";
import { v4 as uuid } from "uuid";

const Header = () => {
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [anchorNotice, setAnchorNotice] = useState(null);
  const [allUsers, setAllUsers] = useState([]);
  const [notifications, setNotifications] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    getAllUsersInfo();
    getUserNotifications();
  }, []);

  const getAllUsersInfo = async () => {
    const data = await getAllUsers();
    setAllUsers(data);
  };

  const getUserNotifications = async () => {
    const token = localStorage.getItem("token");

    const res = await axios.get("http://localhost:7000/notifications", {
      withCredentials: true,
      headers: {
        authorization: token,
      },
    });

    setNotifications(res.data.map((n) => n.content));
  };

  const handleProfileClicked = () => {
    setAnchorElUser(null);
    navigate("current-user-profile");
  };

  const handleLogout = async () => {
    setAnchorElUser(null);

    try {
      await axios.delete("http://localhost:7000/users/logout", {
        withCredentials: true,
      });
    } catch (e) {
      console.error("Failed to logout " + e);
    } finally {
      localStorage.removeItem("token");
      navigate("/login");
    }
  };

  return (
    <AppBar position="sticky" className={style.appBar}>
      <Toolbar className={style.toolBar}>
        <div className={style.wrapperMusicIcon} onClick={() => navigate("/")}>
          <Tooltip title="Home">
            <LibraryMusicIcon
              className={style.musicIcon}
              sx={{ fontSize: 48 }}
            />
          </Tooltip>
        </div>
        <Autocomplete
          // freeSolo
          options={allUsers}
          getOptionLabel={(option) => `${option.firstName} ${option.lastName}`}
          renderOption={(props, option) => (
            <UserSearchCard key={uuid()} user={option} />
          )}
          renderInput={(params) => (
            <TextField
              sx={{ width: 300, px: 2 }}
              variant="standard"
              className={style.searchField}
              {...params}
              // InputProps={{
              //   disableUnderline: true,
              // }}
              placeholder="Search People"
            />
          )}
        />
        <div className={style.wrapperIcons}>
          <Box>
            <Tooltip title="Notifications">
              <Badge badgeContent={notifications.length} color="secondary">
                <NotificationsIcon
                  onClick={(e) => setAnchorNotice(e.currentTarget)}
                  className={style.notificationsIcon}
                  sx={{ fontSize: 48 }}
                />
              </Badge>
            </Tooltip>
            <Menu
              anchorEl={anchorNotice}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "right",
              }}
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              open={Boolean(anchorNotice)}
              onClose={() => setAnchorNotice(null)}
            >
              {notifications.map((notification) => (
                <MenuItem
                  key={notification}
                  onClick={() => setAnchorNotice(null)}
                >
                  <Typography>{notification}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
          <Box>
            <Tooltip title="Settings">
              <AccountCircleIcon
                onClick={(e) => setAnchorElUser(e.currentTarget)}
                className={style.accountIcon}
                sx={{ fontSize: 48 }}
              ></AccountCircleIcon>
            </Tooltip>
            <Menu
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "right",
              }}
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              open={Boolean(anchorElUser)}
              onClose={() => setAnchorElUser(null)}
            >
              <MenuItem onClick={handleProfileClicked}>
                <Typography>Profile</Typography>
              </MenuItem>
              <MenuItem onClick={handleLogout}>
                <Typography>Logout</Typography>
              </MenuItem>
            </Menu>
          </Box>
        </div>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
