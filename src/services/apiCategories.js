import axios from "axios";

const BASE_URL = "https://lungora.runasp.net/api/Category";

export const getAllCategories = async () => {
  try {
    const res = await axios.get(`${BASE_URL}/GetAllCategories`);
    return res.data;
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw error;
  }
};

export const getCategoryById = async (id) => {
  try {
    const res = await axios.get(`${BASE_URL}/GetCategoryById/${id}`);
    return res.data;
  } catch (error) {
    console.error(`Error fetching category ${id}:`, error);
    throw error;
  }
};

export const createCategory = async (data) => {
  try {
    const res = await axios.post(`${BASE_URL}/CreateCategory`, data);
    return res.data;
  } catch (error) {
    console.error("Error creating category:", error);
    throw error;
  }
};

export const updateCategory = async (id, data) => {
  try {
    // تضمين الـ ID في البيانات المرسلة، حسب احتياجات API
    const payload = { ...data, id };
    const res = await axios.put(`${BASE_URL}/EditCategory`, payload);
    return res.data;
  } catch (error) {
    console.error(`Error updating category ${id}:`, error);
    throw error;
  }
};

export const deleteCategory = async (id) => {
  try {
    const res = await axios.delete(`${BASE_URL}/RemoveCategory/${id}`);
    return res.data;
  } catch (error) {
    console.error(`Error deleting category ${id}:`, error);
    throw error;
  }
};