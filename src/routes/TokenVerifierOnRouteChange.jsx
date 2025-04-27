import { useEffect, useContext } from "react";
import { useLocation } from "react-router-dom";
import { refreshToken } from "../services/apiAuth";
import AuthContext from "../context/AuthContext";

function TokenVerifierOnRouteChange() {
  const location = useLocation();
  const { token, setToken, logout } = useContext(AuthContext);

  useEffect(() => {
    // التأكد من أن التوكن موجود قبل محاولة تحديثه
    if (token) {
      const verify = async () => {
        try {
          const newToken = await refreshToken(); // محاولة تحديث التوكن
          setToken(newToken); // تعيين التوكن الجديد في السياق
          console.log("🔁 Token refreshed on route change");
        // eslint-disable-next-line no-unused-vars
        } catch (error) {
          console.warn("⛔ Failed to refresh token on route change");
          logout(); // في حالة فشل التحديث، يجب تسجيل الخروج
        }
      };

      verify(); // تحديث التوكن عند التغيير في المسار
    }
  }, [location.pathname, token, setToken, logout]); // التأكد من أن التوكن موجود ومرن

  return null;
}

export default TokenVerifierOnRouteChange;
