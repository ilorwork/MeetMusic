import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Avatar from "@mui/material/Avatar";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import PublicIcon from "@mui/icons-material/Public";
import LocationCityIcon from "@mui/icons-material/LocationCity";
import style from "./CurrentUserProfile.module.css";
import PostComponent from "../posts/PostComponent";
import PersonIcon from "@mui/icons-material/Person";
import WcIcon from "@mui/icons-material/Wc";
import EditIcon from "@mui/icons-material/Edit";
import { Box, Button, IconButton, Modal, Tooltip } from "@mui/material";
import { editUser, getCurrentUserInfo } from "../../helpers/userHelpers";
import { v4 as uuid } from "uuid";
import Followers from "./usersLists/Followers";
import Following from "./usersLists/Following";
import EditUser from "./EditUser";
import { getCurrentUserPosts } from "../../helpers/postHelpers";
import LoaderContext from "../context/LoaderContext";

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  maxWidth: 450,
  bgcolor: "background.paper",
  border: "2px solid #000",
  borderRadius: 2,
  boxShadow: 24,
  p: 3,
};

const CurrentUserProfile = () => {
  const [user, setUser] = useState("");
  const [userPosts, setUserPosts] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  const navigate = useNavigate();
  const { setLoading } = useContext(LoaderContext);

  useEffect(() => {
    setLoading(true);
    getInfo();
    getUserPosts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getInfo = async () => {
    try {
      const currentUserInfo = await getCurrentUserInfo(true);
      setUser(currentUserInfo);
    } catch (e) {
      if (e.response.status === 401) {
        navigate("/login");
      } else throw e;
    }
  };

  const getUserPosts = async () => {
    const userPosts = await getCurrentUserPosts();
    setUserPosts(userPosts);
    setLoading(false);
  };

  const calculateAge = () =>
    (
      (new Date() - new Date(user.birthDate).getTime()) /
      (365.25 * 24 * 60 * 60 * 1000)
    ).toFixed(1);

  const handleEditProfile = () => {
    setIsOpen(true);
  };

  const handlePicChange = (e) => {
    const reader = new FileReader();
    reader.onload = async () => {
      if (reader.readyState === 2) {
        const updatedUser = await editUser({ profilePic: reader.result });
        setUser(updatedUser);
      }
    };

    reader.readAsDataURL(e.target.files[0]);
  };

  return (
    <>
      <div className={style.profilePageContainer}>
        <div className={style.wrapsLeftSide}>
          <Card className={style.profileInfoCard}>
            <input
              hidden
              accept="image/*"
              id="icon-button-file"
              type="file"
              onChange={handlePicChange}
            />
            <label htmlFor="icon-button-file">
              <Tooltip title="Click to replace">
                <IconButton component="span">
                  <Avatar
                    className={style.userImg}
                    alt="user profile pic"
                    src={user.profilePic}
                  />
                </IconButton>
              </Tooltip>
            </label>
            <CardContent className={style.profileInfoContent}>
              <div className={style.profileHeader}>
                <h1>
                  {user.firstName} {user.lastName}
                </h1>
                <Tooltip title="Edit Info">
                  <Button
                    className={style.editProfileBtn}
                    size="small"
                    onClick={handleEditProfile}
                  >
                    <EditIcon />
                  </Button>
                </Tooltip>
              </div>

              <div className={style.personalInfoContainer}>
                <Typography className={style.typographyRow}>
                  <WcIcon />
                  {user.gender}
                </Typography>
                <Typography className={style.typographyRow}>
                  <PersonIcon />
                  {calculateAge()}
                </Typography>
                {user.country && (
                  <Typography className={style.typographyRow}>
                    <PublicIcon />
                    {user.country}
                  </Typography>
                )}
                {user.city && (
                  <Typography className={style.typographyRow}>
                    <LocationCityIcon />
                    {user.city}
                  </Typography>
                )}
              </div>
              <div className={style.socialInfoContainer}>
                <Typography className={style.userInfo} color="text.secondary">
                  {user.followers?.length} followers
                </Typography>
                <Typography className={style.userInfo} color="text.secondary">
                  {userPosts?.length} posts
                </Typography>
                <Typography className={style.userInfo} color="text.secondary">
                  {user.following?.length} following
                </Typography>
              </div>
            </CardContent>
          </Card>

          <Modal open={isOpen} onClose={() => setIsOpen(false)}>
            <Box sx={modalStyle}>
              <EditUser user={user} setUser={setUser} setIsOpen={setIsOpen} />
            </Box>
          </Modal>

          <div className={style.homePage}>
            <div className={style.peopleYouMayKnow}>
              <h2 className={style.sectionTitle}>Followers</h2>
              <div className={style.usersListWrapper}>
                {user.followers?.map((follower) => (
                  <Followers
                    key={uuid()}
                    follower={follower}
                    getUserInfo={getInfo}
                  />
                ))}
              </div>
            </div>
            <div className={style.peopleYouFollow}>
              <h2 className={style.sectionTitle}>Following</h2>
              <div className={style.usersListWrapper}>
                {user.following?.map((followed) => (
                  <Following
                    key={uuid()}
                    followed={followed}
                    getUserInfo={getInfo}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className={style.wrapsRightSide}>
          <div className={style.containerPostComponents}>
            <h2 className={style.sectionTitle}>Your Posts</h2>
            {userPosts.map((post) => (
              <PostComponent key={uuid()} post={post} getPosts={getUserPosts} />
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default CurrentUserProfile;
