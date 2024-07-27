import axios from "axios";

const BASE_URL = process.env.REACT_APP_BASE_URL;

console.log(BASE_URL);

export const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});
