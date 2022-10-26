import axios from "axios";
import config from "../config/config.json";

const base_url = config.base_url;

export const apiGet = async (endPoint) => {
  return await axios.get(endPoint);
};

export const apiPost = async (endPoint, bodyAsObj, headers) => {
  const url = base_url + endPoint;
  JSON.parse(headers)["content-type"] = "application/json";

  // If the line above works fine you can delete this commented code
  //   const headersObj = JSON.parse(headers);
  //   headersObj["content-type"] = "application/json";
  //   headers = JSON.stringify(headersObj);
  return await axios({
    url,
    method: "POST",
    data: JSON.stringify(bodyAsObj),
    headers,
  });
};

export const apiPut = async (endPoint, bodyAsObj, headers) => {
  const url = base_url + endPoint;
  JSON.parse(headers)["content-type"] = "application/json";

  return await axios({
    url,
    method: "PUT",
    data: JSON.stringify(bodyAsObj),
    headers,
  });
};

export const apiDelete = async (endPoint, bodyAsObj, headers) => {
  const url = base_url + endPoint;
  JSON.parse(headers)["content-type"] = "application/json";

  return await axios({
    url,
    method: "DELETE",
    data: JSON.stringify(bodyAsObj),
    headers,
  });
};

export const apiPetch = async (endPoint, bodyAsObj, headers) => {
  const url = base_url + endPoint;
  JSON.parse(headers)["content-type"] = "application/json";

  return await axios({
    url,
    method: "PETCH",
    data: JSON.stringify(bodyAsObj),
    headers,
  });
};
