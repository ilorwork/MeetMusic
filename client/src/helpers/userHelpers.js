import axios from "axios";

const base_url = "http://localhost:7000";

const getCurrentUserInfo = async () => {
  const token = localStorage.getItem("token");

  try {
    const res = await axios.get(`${base_url}/users/current-user`, {
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

const followUser = async (userId) => {
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

export {
  getCurrentUserInfo,
  getPeopleYouMayKnow,
  getCurrentUserFollowing,
  getCurrentUserFollowers,
  followUser,
  unfollowUser,
  getUserInfo,
  getUserFollowing,
  getUserFollowers,
};
