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
import config from "../../config/config.json";

const Header = () => {
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [anchorNotice, setAnchorNotice] = useState(null);
  const [allUsers, setAllUsers] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [autoVal, setAutoVal] = useState("");

  const navigate = useNavigate();

  const unreadCount = notifications.filter((n) => !n.isBeingRead).length;

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

    const res = await axios.get(`${config.base_url}/notifications`, {
      withCredentials: true,
      headers: {
        authorization: token,
      },
    });

    setNotifications(res.data);
  };

  const handleProfileClicked = () => {
    setAnchorElUser(null);
    navigate("current-user-profile");
  };

  const handleLogout = async () => {
    setAnchorElUser(null);

    try {
      await axios.delete(`${config.base_url}/users/logout`, {
        withCredentials: true,
      });
    } catch (e) {
      console.error("Failed to logout " + e);
    } finally {
      localStorage.removeItem("token");
      navigate("/login");
    }
  };

  const handleReadingNotification = async (notificationId) => {
    const token = localStorage.getItem("token");
    setAnchorNotice(null);
    try {
      await axios.put(
        `${config.base_url}/notifications/notification`,
        { isBeingRead: true },
        {
          withCredentials: true,
          headers: {
            authorization: token,
          },
          params: { notificationId: notificationId },
        }
      );

      const updatedNotifications = notifications.map((n) => {
        if (n._id === notificationId) n.isBeingRead = true;

        return n;
      });

      setNotifications(updatedNotifications);
    } catch (e) {
      console.error("Failed to read notification " + e);
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
          freeSolo
          inputValue={autoVal}
          disableClearable
          options={allUsers}
          onBlur={() => setAutoVal("")}
          onChange={() => setAutoVal("")}
          getOptionLabel={(option) => `${option.firstName} ${option.lastName}`}
          renderOption={(props, option) => (
            <UserSearchCard
              {...props}
              key={uuid()}
              user={option}
              setAutoVal={setAutoVal}
            />
          )}
          renderInput={(params) => (
            <TextField
              onChange={(e) => setAutoVal(e.target.value)}
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
            <Tooltip title={unreadCount ? `${unreadCount} Unread Notifications` : `Notifications`}>
              <Badge badgeContent={unreadCount} color="secondary">
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
                  key={uuid()}
                  style={{
                    background: notification.isBeingRead ? "white" : "#f7dadd",
                  }}
                  onClick={() => handleReadingNotification(notification._id)}
                >
                  <Typography>{notification.content}</Typography>
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
                <Typography>Log out</Typography>
              </MenuItem>
            </Menu>
          </Box>
        </div>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
