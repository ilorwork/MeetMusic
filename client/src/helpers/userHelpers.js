import axios from "axios";
import config from "../config/config.json";

const base_url = config.base_url;

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

const editUser = async (fieldsToUpdate) => {
  const token = localStorage.getItem("token");
  try {
    const res = await axios.put(`${config.base_url}/users/`, fieldsToUpdate, {
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

const getPeopleYouMayKnow = async () => {
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
  login,
  getCurrentUserInfo,
  editUser,
  getPeopleYouMayKnow,
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
