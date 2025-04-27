import { useState, useEffect, useContext } from "react";
import { loginUser, getUserData, refreshToken, logoutSingle } from "../../services/apiAuth";
import {
  saveToLocalStorage,
  saveToSessionStorage,
  removeTokenFromStorage,
  storeToken,
} from "../../hooks/useLocalStorage";
import AuthContext from "../../context/AuthContext";
import toast from "react-hot-toast";

// استرجاع التوكن من التخزين
const getTokenFromStorage = () => {
  return localStorage.getItem("token") || sessionStorage.getItem("token");
};

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const { setToken,updateToken } = useContext(AuthContext);

  // ✅ تسجيل الدخول
  const login = async ({ email, password, rememberMe }) => {
    try {
      const response = await loginUser({ email, password, rememberMe });
      const { token, refreshToken, userInfo } = response;

      if (!token) throw new Error("لم يتم استلام توكن من السيرفر");

      // تخزين التوكن في التخزين المحلي أو الجلسة
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

      // تعيين التوكن وتحديث بيانات المستخدم
      setToken(token);
      setUser(userInfo);
      localStorage.setItem("isAuthenticated", "true");
      // إشعار بنجاح التوكن
      toast.success("✅ تم تسجيل الدخول بنجاح");

      return userInfo;
    } catch (error) {
      toast.error("❌ فشل أثناء تسجيل الدخول:");
      console.error("❌ فشل أثناء تسجيل الدخول:", error);
      throw error;
    }
  };

  // ✅ تسجيل الخروج
  const logout = async () => {
    try {
      await logoutSingle();
    } catch (err) {
      console.warn("فشل في تسجيل الخروج من السيرفر:", err);
    }

    // إزالة التوكن والبيانات المخزنة
    removeTokenFromStorage("token");
    removeTokenFromStorage("refreshToken");

    setUser(null);
    setToken(null);

    // مسح الجلسة والتخزين المحلي
    sessionStorage.clear();
    localStorage.removeItem("rememberMe");
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("refreshToken");
    localStorage.removeItem("isAuthenticated");
  };

  // ✅ التحقق من التوكن عند تحميل التطبيق
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
  
    // ✅ تحديث التوكن كل 50 ثانية فقط إذا كان موجودًا
    const interval = setInterval(async () => {
      if (token) {
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
  // eslint-disable-next-line react-hooks/exhaustive-deps, no-undef
  }, [token]);
  

  return { user, loading, login, logout };
};
