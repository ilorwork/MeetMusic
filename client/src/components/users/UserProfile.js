import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Avatar from "@mui/material/Avatar";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import PublicIcon from "@mui/icons-material/Public";
import LocationCityIcon from "@mui/icons-material/LocationCity";
import style from "./CurrentUserProfile.module.css";
import PostComponent from "../posts/PostComponent";
import Followers from "./usersLists/Followers";
import Following from "./usersLists/Following";
import PersonIcon from "@mui/icons-material/Person";
import WcIcon from "@mui/icons-material/Wc";
import { v4 as uuid } from "uuid";
import { getPostsByUserId } from "../../helpers/postHelpers";
import {
  followUser,
  getCurrentUserInfo,
  getUserInfoById,
  unfollowUser,
} from "../../helpers/userHelpers";
import { Button } from "@mui/material";
import LoaderContext from "../context/LoaderContext";

const UserProfile = () => {
  const [currentUser, setCurrentUser] = useState("");
  const [user, setUser] = useState("");
  const [userPosts, setUserPosts] = useState([]);

  const { id } = useParams();

  const navigate = useNavigate();
  const { setLoading } = useContext(LoaderContext);

  useEffect(() => {
    setLoading(true);
    getCurrentUser();
  }, []);

  useEffect(() => {
    setLoading(true);
    getUserInfo();
    getUserPosts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const getCurrentUser = async () => {
    const info = await getCurrentUserInfo();
    setCurrentUser(info);
  };

  const getUserInfo = async () => {
    try {
      const userInfo = await getUserInfoById(id);
      setUser(userInfo);
    } catch (e) {
      if (e.response.status === 401) {
        navigate("/login");
      } else throw e;
    }
  };

  const getUserPosts = async () => {
    const posts = await getPostsByUserId(id);
    setUserPosts(posts);
    setLoading(false);
  };

  const calculateAge = () =>
    (
      (new Date() - new Date(user.birthDate).getTime()) /
      (365.25 * 24 * 60 * 60 * 1000)
    ).toFixed(1);

  const handleFollowUser = async () => {
    setLoading(true);
    try {
      await followUser(user._id, currentUser);
      getCurrentUser();
      getUserInfo();
    } catch (e) {
      throw new Error("follow user failed " + e);
    } finally {
      setLoading(false);
    }
  };

  const handleUnfollowUser = async () => {
    setLoading(true);
    try {
      await unfollowUser(user._id);
      getCurrentUser();
      getUserInfo();
    } catch (e) {
      throw new Error("unfollow user failed " + e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className={style.profilePageContainer}>
        <div className={style.wrapsLeftSide}>
          <Card className={style.profileInfoCard}>
            <Avatar
              className={style.userImg}
              alt="user profile pic"
              src={user.profilePic}
            />

            <CardContent className={style.profileInfoContent}>
              <div className={style.profileHeader}>
                <h1>
                  {user.firstName} {user.lastName}
                </h1>
                {currentUser.following?.includes(id) && (
                  <Button
                    className={style.followBtns}
                    style={{ background: "rgb(19 137 137)" }}
                    variant="contained"
                    onClick={handleUnfollowUser}
                  >
                    UnFollow
                  </Button>
                )}
                {!currentUser.following?.includes(id) && (
                  <Button
                    className={style.followBtns}
                    style={{ background: "rgb(209, 46, 100)" }}
                    variant="contained"
                    onClick={handleFollowUser}
                  >
                    Follow
                  </Button>
                )}
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

          <div className={style.homePage}>
            <div className={style.peopleYouMayKnow}>
              <h2 className={style.sectionTitle}>Followers</h2>
              <div className={style.usersListWrapper}>
                {user.followers?.map((follower) => (
                  <Followers
                    key={uuid()}
                    follower={follower}
                    getUserInfo={getUserInfo}
                  />
                ))}
              </div>
            </div>
            <div className={style.peopleYouFollow}>
              <h2 className={style.sectionTitle}>Following</h2>
              <div className={style.usersListWrapper}>
                {user.following?.map((followed) => (
                  <Following
                    followed={followed}
                    getUserInfo={getUserInfo}
                    key={uuid()}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className={style.wrapsRightSide}>
          <div className={style.containerPostComponents}>
            <h2 className={style.sectionTitle}>{user.firstName}'s Posts</h2>
            {userPosts.map((post) => (
              <PostComponent
                post={post}
                isUserProfilePage={true}
                key={uuid()}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default UserProfile;
