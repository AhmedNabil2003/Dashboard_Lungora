import axios from "axios";

const BASE_URL = "https://lungora.runasp.net/api/Article";

export const getAllArticles = async () => {
  try {
    const res = await axios.get(`${BASE_URL}/GetAllArticles`);
    return res.data;
  } catch (error) {
    console.error("Error fetching articles:", error);
    throw error;
  }
};

export const getArticleById = async (id) => {
  try {
    const res = await axios.get(`${BASE_URL}/GetArticleById/${id}`);
    return res.data;
  } catch (error) {
    console.error(`Error fetching article ${id}:`, error);
    throw error;
  }
};

export const getArticlesByCategory = async (categoryId) => {
  try {
    const res = await axios.get(`${BASE_URL}/GetArticlesByCategory/${categoryId}`);
    return res.data;
  } catch (error) {
    console.error(`Error fetching articles for category ${categoryId}:`, error);
    throw error;
  }
};

export const createArticle = async (data) => {
  try {
    const res = await axios.post(`${BASE_URL}/CreateArticle`, data);
    return res.data;
  } catch (error) {
    console.error("Error creating article:", error);
    throw error;
  }
};

export const updateArticle = async (id, data) => {
  try {
    // تضمين الـ ID في البيانات المرسلة، حسب احتياجات API
    const payload = { ...data, id };
    const res = await axios.put(`${BASE_URL}/EditArticle`, payload);
    return res.data;
  } catch (error) {
    console.error(`Error updating article ${id}:`, error);
    throw error;
  }
};

export const deleteArticle = async (id) => {
  try {
    const res = await axios.delete(`${BASE_URL}/RemoveArticle/${id}`);
    return res.data;
  } catch (error) {
    console.error(`Error deleting article ${id}:`, error);
    throw error;
  }
};