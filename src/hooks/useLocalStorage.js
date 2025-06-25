export const saveToLocalStorage = (key, value) => {
  try {
    const valueToStore =
      typeof value === "object" ? JSON.stringify(value) : value;
    localStorage.setItem(key, valueToStore);
  } catch (error) {
    console.error("❌ فشل في الحفظ داخل localStorage:", error);
  }
};

export const saveToSessionStorage = (key, value) => {
  try {
    const valueToStore =
      typeof value === "object" ? JSON.stringify(value) : value;
    sessionStorage.setItem(key, valueToStore);
  } catch (error) {
    console.error("❌ فشل في الحفظ داخل sessionStorage:", error);
  }
};

export const getTokenFromStorage = (key) => {
  try {
    let value = localStorage.getItem(key);
    if (!value) {
      value = sessionStorage.getItem(key);
    }
    return value && value.startsWith("{") ? JSON.parse(value) : value;
  } catch (error) {
    console.error("❌ فشل في استرجاع التوكن:", error);
    return null;
  }
};

export const removeTokenFromStorage = (key) => {
  try {
    localStorage.removeItem(key);
    sessionStorage.removeItem(key);
  } catch (error) {
    console.error("❌ فشل في حذف التوكن:", error);
  }
};

export const storeToken = (
  token,
  rememberMe = false,
  isRefreshToken = false
) => {
  if (isRefreshToken) {
    console.log("Storing refresh token...");
  } else {
    if (rememberMe) {
      saveToLocalStorage("token", token, false);
      saveToLocalStorage("rememberMe", true, false);
    } else {
      saveToSessionStorage("token", token, true);
      saveToLocalStorage("rememberMe", false, false);
    }
  }
};

export const isRememberMe = () => {
  return localStorage.getItem("rememberMe") === "true";
};

export const clearAuthStorage = () => {
  try {
    localStorage.removeItem("token");
    sessionStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("rememberMe");
  } catch (error) {
    console.error("❌ فشل في مسح البيانات:", error);
  }
};

export const isTokenPresent = (key) => {
  return getTokenFromStorage(key) !== null;
};
