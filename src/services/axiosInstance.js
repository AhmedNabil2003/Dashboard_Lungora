import axios from "axios";
import { isRememberMe, storeToken } from "../hooks/useLocalStorage";
import toast from "react-hot-toast";

const BASE_URL = "https://lungora.runasp.net/api";

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    accept: "*/*",
    "Content-Type": "application/json",
  },
  withCredentials: true,
});


axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

let isRefreshing = false;
let refreshSubscribers = [];

const onRefreshed = (token) => {
  refreshSubscribers.forEach((callback) => callback(token));
  refreshSubscribers = [];
};

const subscribeTokenRefresh = (callback) => {
  refreshSubscribers.push(callback);
};

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";

    if (error.response?.status === 401 && !originalRequest._retry && isAuthenticated) {
      originalRequest._retry = true;

      if (isRefreshing) {
        return new Promise((resolve) => {
          subscribeTokenRefresh((newToken) => {
            originalRequest.headers["Authorization"] = `Bearer ${newToken}`;
            resolve(axiosInstance(originalRequest));
          });
        });
      }

      isRefreshing = true;

      try {
        const response = await axios.get(`${BASE_URL}/Auth/refreshToken`, {
          withCredentials: true,
        });

        const { token, refreshToken } = response.data?.result || {};

        if (!token || !refreshToken) {
          throw new Error("Token not received.");
        }

        storeToken(token, isRememberMe());
        isRefreshing = false;
        onRefreshed(token);

        originalRequest.headers["Authorization"] = `Bearer ${token}`;
        return axiosInstance(originalRequest);
      } catch (err) {
        isRefreshing = false;
        refreshSubscribers = [];

        toast.error("⛔ Session has expired, please log in again.");
        localStorage.removeItem("token");
        sessionStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("isAuthenticated");

        window.location.href = "/";
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);


export default axiosInstance;
