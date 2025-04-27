// ✅ حفظ في localStorage
export const saveToLocalStorage = (key, value) => {
  try {
    const valueToStore = typeof value === "object" ? JSON.stringify(value) : value;
    localStorage.setItem(key, valueToStore);
  } catch (error) {
    console.error("❌ فشل في الحفظ داخل localStorage:", error);
  }
};

// ✅ حفظ في sessionStorage
export const saveToSessionStorage = (key, value) => {
  try {
    const valueToStore = typeof value === "object" ? JSON.stringify(value) : value;
    sessionStorage.setItem(key, valueToStore);
  } catch (error) {
    console.error("❌ فشل في الحفظ داخل sessionStorage:", error);
  }
};

// ✅ استرجاع التوكن من localStorage أو sessionStorage
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
// ✅ حذف التوكن من المكانين
export const removeTokenFromStorage = (key) => {
  try {
    localStorage.removeItem(key);
    sessionStorage.removeItem(key);
  } catch (error) {
    console.error("❌ فشل في حذف التوكن:", error);
  }
};

// ✅ تخزين التوكن تلقائيًا حسب rememberMe
export const storeToken = (token, rememberMe = false, isRefreshToken = false) => {
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

// ✅ معرفة إذا كان rememberMe مفعّل
export const isRememberMe = () => {
  return localStorage.getItem("rememberMe") === "true";
};

// ✅ حذف كل شيء متعلق بالتوكن عند تسجيل الخروج
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