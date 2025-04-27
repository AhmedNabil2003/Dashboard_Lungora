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
  const [token, setToken] = useState(null); // بدايةً، التوكن غير موجود
  const [isLoading, setIsLoading] = useState(true);
  // ✅ التحقق من وجود التوكن في التخزين عند تحميل الصفحة
  useEffect(() => {
    const storedToken = getTokenFromStorage("token"); // محاولة استرجاع التوكن من التخزين
    if (storedToken) {
      setToken(storedToken); // تعيين التوكن فقط إذا كان موجودًا
    }
    setIsLoading(false);
  }, []);

  // ✅ دالة تسجيل الخروج
  const logout = async () => {
    try {
      await logoutSingle(); // إرسال طلب تسجيل الخروج إلى السيرفر
    } catch (err) {
      console.error("❌ فشل أثناء محاولة تسجيل الخروج من السيرفر:", err);
    } finally {
      // مسح كل شيء من التخزين المحلي والجلسة
      clearAuthStorage();
      setToken(null); // مسح التوكن من الحالة
      localStorage.removeItem("isAuthenticated");
    }
  };

  // ✅ تحديث التوكن
  const updateToken = (newToken) => {
    storeToken(newToken, isRememberMe()); // تخزين التوكن في التخزين المناسب (محلي أو جلسة)
    setToken(newToken); // تعيين التوكن الجديد في الحالة
  };

  return (
    <AuthContext.Provider value={{ token, isLoading,setToken, logout, updateToken }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
