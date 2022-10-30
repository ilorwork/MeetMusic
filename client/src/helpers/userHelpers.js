import axios from "axios";
import config from "../config/config.json";

const base_url = config.base_url;

const register = async (newUser) => {
  try {
    const res = await axios.post(`${base_url}/users`, newUser);
    return res.data;
  } catch (e) {
    throw e;
  }
};

const login = async (email, password) => {
  try {
    const res = await axios.post(
      `${base_url}/users/login`,
      { email, password },
      {
        withCredentials: true,
      }
    );

    localStorage.setItem("token", res.headers.authorization);

    setRecentConnection(res.data);
  } catch (e) {
    throw e;
  }
};

const setRecentConnection = (newUser) => {
  let recentConnections = [];
  if (localStorage.getItem("recentConnections")) {
    recentConnections = JSON.parse(localStorage.getItem("recentConnections"));

    const alreadyExist = recentConnections.find(
      (user) => user.email === newUser.email
    );
    if (alreadyExist) return;

    if (recentConnections.length === 3) recentConnections.pop();
  }

  recentConnections.unshift(newUser);
  localStorage.setItem("recentConnections", JSON.stringify(recentConnections));
};

const logout = async () => {
  try {
    await axios.delete(`${base_url}/users/logout`, {
      withCredentials: true,
    });
  } catch (e) {
    throw e;
  }
};

const getCurrentUserInfo = async (populated = false) => {
  const token = localStorage.getItem("token");

  try {
    const res = await axios.get(`${base_url}/users/current-user`, {
      withCredentials: true,
      headers: {
        authorization: token,
      },
      params: { populated },
    });
    return res.data;
  } catch (e) {
    throw e;
  }
};

const getUserInfoById = async (userId) => {
  try {
    const res = await axios.post(`${base_url}/users/user`, {
      _id: userId,
    });
    return res.data;
  } catch (e) {
    throw e;
  }
};

const editUser = async (fieldsToUpdate) => {
  const token = localStorage.getItem("token");
  try {
    const res = await axios.put(`${base_url}/users/`, fieldsToUpdate, {
      withCredentials: true,
      headers: {
        authorization: token,
      },
    });

    return res.data;
  } catch (e) {
    throw e;
  }
};

const getPeopleYouMayKnowHelper = async () => {
  const token = localStorage.getItem("token");

  try {
    const res = await axios.get(`${base_url}/users/user/people-user-may-know`, {
      withCredentials: true,
      headers: {
        authorization: token,
      },
    });

    return res.data;
  } catch (e) {
    throw e;
  }
};

const getCurrentUserFollowing = async () => {
  const token = localStorage.getItem("token");

  try {
    const res = await axios.get(`${base_url}/users/current-user/following`, {
      withCredentials: true,
      headers: {
        authorization: token,
      },
    });

    return res.data;
  } catch (e) {
    throw e;
  }
};

const getCurrentUserFollowers = async () => {
  const token = localStorage.getItem("token");

  try {
    const res = await axios.get(`${base_url}/users/current-user/followers`, {
      withCredentials: true,
      headers: {
        authorization: token,
      },
    });

    return res.data;
  } catch (e) {
    throw e;
  }
};

const followUser = async (userId, currentUserInfo) => {
  const token = localStorage.getItem("token");
  try {
    await axios.patch(
      `${base_url}/users/user/follow`,
      { _id: userId },
      {
        withCredentials: true,
        headers: {
          authorization: token,
        },
      }
    );
  } catch (e) {
    throw e;
  }

  notifyUser(
    userId,
    `${currentUserInfo.firstName} ${currentUserInfo.lastName} started following you`
  );
};

const unfollowUser = async (userId) => {
  const token = localStorage.getItem("token");
  try {
    await axios.patch(
      `${base_url}/users/user/unfollow`,
      { _id: userId },
      {
        withCredentials: true,
        headers: {
          authorization: token,
        },
      }
    );
  } catch (e) {
    throw e;
  }
};

const notifyUser = async (userId, notificationContent) => {
  const token = localStorage.getItem("token");
  try {
    await axios.post(
      `${base_url}/notifications`,
      {
        userToNote: userId,
        content: notificationContent,
      },
      {
        withCredentials: true,
        headers: {
          authorization: token,
        },
      }
    );
  } catch (e) {
    throw e;
  }
};

const getUserInfo = async (userId) => {
  try {
    const res = await axios.post(`${base_url}/users/user`, {
      _id: userId,
    });

    return res.data;
  } catch (e) {
    throw e;
  }
};

const getUserFollowing = async (userId) => {
  try {
    const res = await axios.post(`${base_url}/users/user/following`, {
      _id: userId,
    });

    return res.data;
  } catch (e) {
    throw e;
  }
};

const getUserFollowers = async (userId) => {
  try {
    const res = await axios.post(`${base_url}/users/user/followers`, {
      _id: userId,
    });

    return res.data;
  } catch (e) {
    throw e;
  }
};

const getAllUsers = async () => {
  try {
    const res = await axios.get(`${base_url}/users/`);
    return res.data;
  } catch (e) {
    throw e;
  }
};

export {
  register,
  login,
  logout,
  getCurrentUserInfo,
  getUserInfoById,
  editUser,
  getPeopleYouMayKnowHelper,
  getCurrentUserFollowing,
  getCurrentUserFollowers,
  followUser,
  unfollowUser,
  notifyUser,
  getUserInfo,
  getUserFollowing,
  getUserFollowers,
  getAllUsers,
};
