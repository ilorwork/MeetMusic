import React, { useState, useEffect, useContext } from "react";
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
import { getAllUsers, logout } from "../../helpers/userHelpers";
import UserSearchCard from "../UserSearchCard";
import { v4 as uuid } from "uuid";
import UserContext from "./UserContext";
import {
  getAllNotifications,
  readNotification,
} from "../../helpers/notificationHelpers";
import MenuIcon from "@mui/icons-material/Menu";

const Header = () => {
  const [anchorBurger, setAnchorBurger] = useState(null);
  const [isNoticesOpen, setIsNoticesOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [anchorNotice, setAnchorNotice] = useState(null);
  const [allUsers, setAllUsers] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [autoVal, setAutoVal] = useState("");
  const [windowWidth, setWindowWidth] = useState("");

  const navigate = useNavigate();
  const { currentUserInfo } = useContext(UserContext);

  const unreadCount = notifications.filter((n) => !n.isBeingRead).length;

  useEffect(() => {
    getAllUsersInfo();
    getUserNotifications();
    getWindowWidth();

    window.addEventListener("resize", getWindowWidth);
  }, []);

  const getWindowWidth = () => {
    const { innerWidth } = window;
    setWindowWidth(innerWidth);
  };

  const getAllUsersInfo = async () => {
    const data = await getAllUsers();
    setAllUsers(data);
  };

  const getUserNotifications = async () => {
    const allNotifications = await getAllNotifications();
    setNotifications(allNotifications);
  };

  const handleProfileClicked = () => {
    setAnchorElUser(null);
    navigate(`/user-profile/${currentUserInfo._id}`);
  };

  const handleLogout = async () => {
    setAnchorElUser(null);

    try {
      await logout();
    } catch (e) {
      console.error("Failed to logout " + e);
    } finally {
      localStorage.removeItem("token");
      navigate("/login");
    }
  };

  const handleReadingNotification = async (notificationId) => {
    setAnchorNotice(null);

    try {
      await readNotification(notificationId);

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
          {windowWidth > 768 && (
            <>
              <Box>
                <Tooltip
                  title={
                    unreadCount
                      ? `${unreadCount} Unread Notifications`
                      : `Notifications`
                  }
                >
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
                      sx={{ boxShadow: 1 }}
                      style={{
                        background: notification.isBeingRead
                          ? "white"
                          : "#f7dadd",
                        margin: 4,
                        borderRadius: 4,
                      }}
                      onClick={() =>
                        handleReadingNotification(notification._id)
                      }
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
            </>
          )}
          {windowWidth <= 768 && (
            <Box>
              <Tooltip title="Menu">
                <MenuIcon
                  className={style.burgerMenu}
                  sx={{ fontSize: 48 }}
                  onClick={(e) => setAnchorBurger(e.currentTarget)}
                />
              </Tooltip>

              <Menu
                anchorEl={anchorBurger}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "right",
                }}
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                open={Boolean(anchorBurger)}
                onClose={() => {
                  setAnchorBurger(null);
                  setIsNoticesOpen(false);
                  setIsSettingsOpen(false);
                }}
              >
                <MenuItem
                  sx={{ width: 200, display: "flex", justifyContent: "center" }}
                  onClick={() => setIsNoticesOpen(!isNoticesOpen)}
                >
                  <Typography>Notifications</Typography>
                </MenuItem>
                {isNoticesOpen && (
                  <Box className={style.boxContainer}>
                    {notifications.map((notification) => (
                      <Box
                        className={style.boxInfo}
                        key={uuid()}
                        style={{
                          background: notification.isBeingRead
                            ? "white"
                            : "#f7dadd",
                        }}
                        onClick={() =>
                          handleReadingNotification(notification._id)
                        }
                      >
                        <Typography>{notification.content}</Typography>
                      </Box>
                    ))}
                  </Box>
                )}

                <MenuItem
                  sx={{ width: 200, display: "flex", justifyContent: "center" }}
                  onClick={() => {
                    setIsSettingsOpen(!isSettingsOpen);
                  }}
                >
                  <Typography>Settings</Typography>
                </MenuItem>

                {isSettingsOpen && (
                  <Box className={style.boxContainer}>
                    <Box
                      className={style.boxInfo}
                      onClick={handleProfileClicked}
                    >
                      <Typography>Profile</Typography>
                    </Box>
                    <Box className={style.boxInfo} onClick={handleLogout}>
                      <Typography>Log out</Typography>
                    </Box>
                  </Box>
                )}
              </Menu>
            </Box>
          )}
        </div>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
