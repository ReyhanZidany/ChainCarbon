import axios from "axios";

const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL ||
  (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"
    ? "http://localhost:5000/api"
    : `http://${window.location.hostname}:5000/api`);

const STATIC_BASE_URL =
  process.env.REACT_APP_STATIC_BASE_URL ||
  (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"
    ? "http://localhost:5000"
    : `http://${window.location.hostname}:5000`);

    const API = axios.create({
      baseURL: API_BASE_URL, 
      timeout: 90000, 
      headers: {
        "Content-Type": "application/json",
      },
    });

API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (
      error.code === "ECONNREFUSED" ||
      error.message.includes("Network Error")
    ) {
      console.error("Backend server is not running!");
    }
    return Promise.reject(error);
  }
);

export default API;
export { STATIC_BASE_URL };