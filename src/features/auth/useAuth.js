import { useState, useEffect } from "react";
import { loginUser, getUser } from "../../services/apiAuth";
import { saveToLocalStorage, getFromLocalStorage, removeFromLocalStorage } from "../../hooks/useLocalStorage";

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // تسجيل الدخول وحفظ token
  const login = async (email, password) => {
    try {
      const { token, user } = await loginUser(email, password);
      saveToLocalStorage("token", token);
      setUser(user);
      return user;
    } catch (error) {
      console.error("خطأ أثناء تسجيل الدخول", error);
      throw error;
    }
  };

  // تسجيل الخروج وحذف token
  const logout = () => {
    removeFromLocalStorage("token");
    setUser(null);
  };

  // التحقق من token عند تحميل التطبيق
  useEffect(() => {
    const token = getFromLocalStorage("token");
    if (token) {
      getUser(token)
        .then((userData) => {
          setUser(userData);
        })
        .catch(() => logout());
    }
    setLoading(false);
  }, []);

  return { user, loading, login, logout };
};
