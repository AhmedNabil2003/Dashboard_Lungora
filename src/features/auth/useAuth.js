import { useState, useEffect, useContext } from "react";
import { loginUser, getUserData, refreshToken, logoutSingle } from "../../services/apiAuth";
import {
  saveToLocalStorage,
  saveToSessionStorage,
  removeTokenFromStorage,
  storeToken,
} from "../../hooks/useLocalStorage";
import AuthContext from "../../context/authContext";
import toast from "react-hot-toast";
import axiosInstance from "../../services/axiosInstance";

const getTokenFromStorage = () => {
  return localStorage.getItem("token") || sessionStorage.getItem("token");
};

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const { setToken, updateToken } = useContext(AuthContext);

  const login = async ({ email, password, rememberMe }) => {
    try {
      const response = await loginUser({ email, password, rememberMe });
      const { token, refreshToken, userInfo } = response;

      if (!token) throw new Error("No token received from server");

      storeToken(token, rememberMe);
      if (rememberMe) {
        saveToLocalStorage("token", token);
        saveToLocalStorage("refreshToken", refreshToken);
        localStorage.setItem("rememberMe", "true");
      } else {
        saveToSessionStorage("token", token);
        saveToSessionStorage("refreshToken", refreshToken);
        localStorage.setItem("rememberMe", "false");
      }

      setToken(token);
      setUser(userInfo);
      localStorage.setItem("isAuthenticated", "true");
      toast.success("✅ Login successful");

      return userInfo;
    } catch (error) {
      toast.error("Login failed");
      console.error("Login failed:", error);
      throw error;
    }
  };

  const addAdmin = async (userData) => {
    try {
      const response = await axiosInstance.post(`/Auth/AddAdmin`, userData);

      if (response.data.statusCode === 201) {
        toast.success(response.data.result.message || "Admin created successfully");
        return response.data.result;
      } else {
        throw new Error("Failed to create admin");
      }
    } catch (error) {
      let errorMessage = "Failed to create admin";

      if (error.response?.data?.status === 400 && error.response.data.errors) {
        const errors = error.response.data.errors;
        const errorMessages = Object.values(errors).flat().join("\n");
        errorMessage = errorMessages || errorMessage;
      } else if (error.response?.data?.statusCode === 400 && error.response.data.errors) {
        errorMessage = error.response.data.errors.join("\n") || errorMessage;
      }

      toast.error(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const logout = async () => {
    try {
      await logoutSingle();
    } catch (err) {
      console.warn("Failed to logout from server:", err);
    }

    removeTokenFromStorage("token");
    removeTokenFromStorage("refreshToken");

    setUser(null);
    setToken(null);

    sessionStorage.clear();
    localStorage.removeItem("rememberMe");
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("refreshToken");
    localStorage.removeItem("isAuthenticated");
  };

  useEffect(() => {
    let isMounted = true;

    const token = getTokenFromStorage();
    if (token) {
      setToken(token);
      getUserData()
        .then((res) => {
          if (isMounted) {
            setUser(res.data?.result || null);
            setLoading(false);
          }
        })
        .catch((err) => {
          if (isMounted) {
            console.warn("Failed to verify user:", err);
            logout();
          }
        });
    } else {
      setLoading(false);
    }

    const interval = setInterval(async () => {
      const currentToken = getTokenFromStorage();
      if (currentToken) {
        try {
          const { token: newToken } = await refreshToken();
          updateToken(newToken);
          console.log("🔁 Token auto-refreshed");
        } catch (err) {
          console.warn("⛔ Failed to auto-refresh token", err);
          logout();
        }
      }
    }, 50000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Remove token from dependencies

  return { user, loading, login, logout, addAdmin };
};