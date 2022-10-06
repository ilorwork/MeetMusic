import axios from "axios";

export const getCurrentUserInfo = async () => {
  const token = localStorage.getItem("token");

  try {
    const res = await axios.get("http://localhost:7000/users/current-user", {
      withCredentials: true,
      headers: {
        authorization: token,
      },
    });
    return res.data;
  } catch (err) {
    throw err;
  }
};
