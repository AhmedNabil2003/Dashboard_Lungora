import toast from "react-hot-toast";
import axiosInstance from "./axiosInstance"; // استبدل axios بـ axiosInstance

// جلب جميع الأقسام
export const getAllCategories = async () => {
  try {
    const res = await axiosInstance.get("/Category/GetAllCategories");

    if (res.data && res.data.isSuccess && res.data.result && Array.isArray(res.data.result.category)) {
      console.log("Categories data received:", res.data.result.category);
      return res.data.result.category;
    }

    console.log("Categories API response structure:", res.data);
    return [];
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw new Error("Something went wrong while fetching categories.");
  }
};

// إنشاء قسم جديد
export const createCategory = async (data) => {
  try {
    const payload = { categoryName: data.name };
    console.log("Sending data to API:", payload);
    const res = await axiosInstance.post("/Category/CreateCategory", payload);
    return res.data;
  } catch (error) {
    console.error("Error creating category:", error);
    if (error.response) {
      console.error("Error Response from API:", error.response.data);
      toast.error(error.response.data.message || "Failed to create category.");
    } else {
      toast.error("Something went wrong while creating the category.");
    }
    throw new Error(error.message || "Something went wrong while creating the category.");
  }
};

// تعديل قسم
export const updateCategory = async (id, name) => {
  try {
    if (!name.trim()) {
      throw new Error("Category name cannot be empty.");
    }
    const payload = { id, categoryName: name };

    const res = await axiosInstance.put(`/Category/EditCategory/${id}`, payload);
    return res.data;
  } catch (error) {
    console.error(`Error updating category ${id}:`, error);
    throw new Error(error.message || "Something went wrong while updating category ${id}.");
  }
};

// حذف قسم
export const deleteCategory = async (id) => {
  try {
    const res = await axiosInstance.delete(`/Category/RemoveCategory/${id}`);
    return res.data;
  } catch (error) {
    console.error(`Error deleting category ${id}:`, error);
    throw new Error(error.message || `Something went wrong while deleting category ${id}.`);
  }
};
