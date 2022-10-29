import axios from "axios";
import config from "../config/config.json";

const base_url = config.base_url;

const getAllNotifications = async () => {
  const token = localStorage.getItem("token");

  try {
    const res = await axios.get(`${base_url}/notifications`, {
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

const readNotification = async (notificationId) => {
  const token = localStorage.getItem("token");

  try {
    await axios.put(
      `${base_url}/notifications/notification`,
      { isBeingRead: true },
      {
        withCredentials: true,
        headers: {
          authorization: token,
        },
        params: { notificationId: notificationId },
      }
    );
  } catch (e) {
    throw e;
  }
};

export { getAllNotifications, readNotification };
