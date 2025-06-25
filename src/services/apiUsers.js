import axiosInstance from "./axiosInstance";

// ✅ Get all users
export const getUsers = async () => {
  try {
    const res = await axiosInstance.get("/Auth/GetAllUsersAsync");
    if (res.data?.isSuccess && res.data.result && Array.isArray(res.data.result?.users)) {
      const formattedUsers = res.data.result.users.map(user => ({
        id: user.userId,
        name: user.fullName,
        email: user.email,
        status: user.isActive ? "Active" : "Not Active",
        date: new Date(user.createdDate).toLocaleDateString('en-GB'),
        imageUser: user.imageUser,
        roles: user.roles,
        createdDate: user.createdDate,
        isActive: user.isActive
      }));
      return formattedUsers;
    }
    console.error("No users found or invalid response structure");
    return [];
  } catch (error) {
    console.error("Error fetching all users:", error);
    throw new Error("Something went wrong while fetching users. Please try again later.");
  }
};

// ✅ Update user
// ✅ Fixed updateUser function
export const updateUser = async (id, userData) => {
  try {
    const params = new URLSearchParams();
    params.append("FullName", userData.name || "");
    params.append("Email", userData.email || "");
    params.append("IsActive", userData.status === "Active");

    if (userData.roles && Array.isArray(userData.roles)) {
      userData.roles.forEach((role) => params.append("Roles", role || ""));
    } else {
      params.append("Roles", "User");
    }

    const formData = new FormData();
    if (userData.imageUser instanceof File) {
      formData.append("ImageUser", userData.imageUser);
    }

    const res = await axiosInstance.put(
      `/Auth/EditUser/${id}?${params.toString()}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    if (res.data?.isSuccess) {
      // ✅ إرجاع البيانات المحدثة فقط (بدون إنشاء تاريخ جديد)
      const updatedFields = {
        name: userData.name,
        email: userData.email,
        status: userData.status,
        roles: userData.roles || ["User"],
        isActive: userData.status === "Active"
      };
      
      // إضافة الصورة فقط إذا تم تحديثها
      if (userData.imageUser instanceof File) {
        // في الحالة الحقيقية، يجب أن تحصل على رابط الصورة الجديد من الاستجابة
        updatedFields.imageUser = userData.imageUser;
      }
      
      return { 
        ...updatedFields, 
        message: res.data.result?.Message || "User updated successfully." 
      };
    }
    throw new Error(res.data.result?.Message || "Failed to update user.");
  } catch (error) {
    console.error("Error updating user:", error.response?.data, error.response?.status);
    throw new Error(error.response?.data?.result?.Message || error.message || `Something went wrong while updating user with ID ${id}. Please try again later.`);
  }
};

// ✅ Delete user
export const deleteUser = async (id) => {
  try {
    const res = await axiosInstance.delete(`/Auth/RemoveUser/${id}`);
    const data = res?.data;
    
    if (data?.isSuccess) {
      return { message: data.result?.message || "This Account Removed it" };
    }
    throw new Error(data?.result?.message || "Failed to delete user.");
  } catch (error) {
    const errData = error.response?.data;
    if (errData?.isSuccess) {
      console.warn("Server says success but Axios threw error. Continuing...");
      return { message: errData.result?.message || "This Account Removed it" };
    }
    console.error("Error deleting user:", errData || error.message);
    throw new Error(
      errData?.result?.message || error.message || "Unknown error deleting user"
    );
  }
};