import axios from "axios";

const API_URL = "https://lungora.runasp.net/api/Auth";

// تسجيل الدخول
export const loginUser = async (values) => {
  return await axios.post(`${API_URL}/Login`, values);
};

// تسجيل الخروج (اختياري إذا كان API يدعم ذلك)
export const logoutUser = async () => {
  return await axios.post(`${API_URL}/Logout`);
};

// التحقق من صلاحية التوكن
export const verifyToken = async (token) => {
  return await axios.get(`${API_URL}/Verify`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};
