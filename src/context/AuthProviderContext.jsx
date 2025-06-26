import { createContext, useEffect, useState } from "react";
import {
  clearAuthStorage,
  getTokenFromStorage,
  isRememberMe,
  storeToken,
} from "../hooks/useLocalStorage";
import { logoutSingle } from "../services/apiAuth";

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const storedToken = getTokenFromStorage("token"); 
    if (storedToken) {
      setToken(storedToken); 
    }
    setIsLoading(false);
  }, []);

  const logout = async () => {
    try {
      await logoutSingle(); 
    } catch (err) {
      console.error("❌ error logout", err);
    } finally {
      clearAuthStorage();
      setToken(null); 
      localStorage.removeItem("isAuthenticated");
    }
  };

  const updateToken = (newToken) => {
    storeToken(newToken, isRememberMe());
    setToken(newToken); 
  };

  return (
    <AuthContext.Provider value={{ token, isLoading,setToken, logout, updateToken }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
