import { isRememberMe, storeToken } from "../hooks/useLocalStorage";
import axiosInstance from "./axiosInstance";
import toast from "react-hot-toast";

// Login user
export const loginUser = async (values) => {
  try {
    const response = await axiosInstance.post(`/Auth/Login`, values, { withCredentials: true });
    
    if (!response.data.isSuccess) {
      toast.error("Login failed. Please check your credentials.");
      return null;
    }
    
    const { token, refreshToken, refreshTokenExpiration } = response.data.result;

    if (token && refreshToken) {
      // Store tokens based on rememberMe preference
      storeToken(token, values.rememberMe);
      storeToken(refreshToken, values.rememberMe, true);

      // Set authentication flag
      localStorage.setItem("isAuthenticated", "true");
      
      return { token, refreshToken, refreshTokenExpiration, userInfo: { email: values.email } };
    } else {
      toast.error("Failed to log in. Please check your credentials.");
      return null;
    }
  } catch (error) {
    console.error("Login failed:", error);
    const errorMessage = error.response?.data?.errors?.[0] || "Login failed. Please try again.";
    toast.error(errorMessage);
    throw error;
  }
};

// Register new user
export const registerUser = async (userData) => {
  try {
    const response = await axiosInstance.post(`/Auth/Register`, userData);
    
    if (response.data.isSuccess) {
      toast.success("Registration successful!");
    }
    
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.errors?.[0] || "Registration failed";
    toast.error(errorMessage);
    throw error;
  }
};

// Request password reset
export const forgotPassword = async (email) => {
  try {
    const response = await axiosInstance.post(`/Auth/ForgotPassword`, { email });
    
    if (response.data.isSuccess) {
      toast.success("Password reset email sent. Please check your inbox.");
    } else {
      toast.error(response.data.errors?.[0] || "Failed to send reset email");
    }
    
    return response.data;
  } catch (error) {
    toast.error("Failed to process password reset request");
    throw error;
  }
};

// Verify reset code
export const verifyResetCode = async (code) => {
  try {
    const response = await axiosInstance.post(`/Auth/VerifyResetCode`, { code });
    
    if (response.data.isSuccess) {
      toast.success("Code verified successfully");
    } else {
      toast.error(response.data.errors?.[0] || "Invalid verification code");
    }
    
    return response.data;
  } catch (error) {
    toast.error("Failed to verify reset code");
    throw error;
  }
};

// Reset password
export const resetPassword = async (data) => {
  try {
    const response = await axiosInstance.post(`/Auth/ResetPassword`, data);
    
    if (response.data.isSuccess) {
      toast.success("Password reset successful! You can now log in with your new password.");
    } else {
      toast.error(response.data.errors?.[0] || "Failed to reset password");
    }
    
    return response.data;
  } catch (error) {
    toast.error("Failed to reset password");
    throw error;
  }
};

// Change password
export const changePassword = async (data) => {
  return await axiosInstance.post(`/Auth/ChangePassword`, data);
};

// Get user data
export const getUserData = async () => {
  const res = await axiosInstance.get(`/Auth/GetDataUser`);
  console.log("User data response:", res.data.result);
  if(res.data && res.data.result && res.data.isSuccess){
  return res.data.result;
}else {
  throw new Error("Failed to get user data");
}
};

// Edit user info
export const editUserInfo = async (data) => {
  const formData = new FormData();
  
  formData.append('FullName', data.name);
  if (data.avatar) {
    formData.append('ImageUser', data.avatar); 
  }

  try {
    const response = await axiosInstance.post(`/Auth/EditInfo`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data', 
      },
    });
    return response.data;
  // eslint-disable-next-line no-unused-vars
  } catch (error) {
    throw new Error('Error updating user info');
  }
};
// Logout from all devices
export const logoutAll = async () => {
  try {
    const response = await axiosInstance.post(`/Auth/LogOutAll`);
    
    if (response.data.isSuccess) {
      toast.success("Logged out from all devices");
    }
    
    return response.data;
  } catch (error) {
    toast.error("Failed to logout from all devices");
    throw error;
  }
};

// Logout from current device
export const logoutSingle = async () => {
  try {
    const response = await axiosInstance.post(`/Auth/LogOutSingle`);
    
    if (response.data.isSuccess) {
      toast.success("Logged out successfully");
    }
    
    return response.data;
  } catch (error) {
    console.error("Logout error:", error);
    // Still clear local tokens even if server logout fails
    return { isSuccess: true };
  }
};

// Refresh token
export const refreshToken = async () => {
  try {
    const response = await axiosInstance.get("/Auth/refreshToken", {
      withCredentials: true,
    });

    if (!response.data.isSuccess) {
      throw new Error("Failed to refresh token");
    }

    const { token, refreshToken } = response.data.result;

    if (!token || !refreshToken) {
      throw new Error("Failed to receive token or refresh token");
    }

    // Store tokens according to rememberMe preference
    storeToken(token, isRememberMe());
    storeToken(refreshToken, isRememberMe(), true);

    return { token, refreshToken };
  } catch (error) {
    console.error("Refresh token error:", error);
    throw error;
  }
};

// Revoke token
export const revokeToken = async () => {
  try {
    const response = await axiosInstance.post(`/Auth/revokeToken`);

    if (response.data.isSuccess) {
      toast.success("Token revoked successfully");
    } else {
      toast.error("Failed to revoke token");
    }

    return response.data;
  } catch (error) {
    toast.error("Failed to revoke token");
    throw error;
  }
};