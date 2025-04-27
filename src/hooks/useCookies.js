import Cookies from 'js-cookie';

// دالة لتخزين التوكن في الكوكيز
export const setToken = (token, refreshToken, rememberMe) => {
  const expiryTime = rememberMe ? 30 : 1 / 48;  // 30 يومًا إذا كان "تذكرني" مفعلًا، أو نصف ساعة إذا لم يكن.
  Cookies.set('token', token, { expires: expiryTime });  // تخزين التوكن
  Cookies.set('refreshToken', refreshToken, { expires: 7 });  // تخزين الريفريش توكن لمدة 7 أيام
  Cookies.set('rememberMe', rememberMe);  // تخزين حالة "تذكرني"
};

// دالة لاسترجاع التوكن من الكوكيز
export const getToken = () => {
  return Cookies.get('token');
};

// دالة لاسترجاع الريفريش توكن من الكوكيز
export const getRefreshToken = () => {
  return Cookies.get('refreshToken');
};

// دالة لحذف التوكن والريفريش توكن من الكوكيز
export const removeToken = () => {
  Cookies.remove('token');
  Cookies.remove('refreshToken');
  Cookies.remove('rememberMe');
};

// دالة لتخزين قيمة "تذكرني" في الكوكيز
export const setRememberMe = (rememberMe) => {
  Cookies.set('rememberMe', rememberMe);
};

// دالة لاسترجاع قيمة "تذكرني" من الكوكيز
export const getRememberMe = () => {
  return Cookies.get('rememberMe') === 'true';
};
