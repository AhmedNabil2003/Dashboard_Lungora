import axiosInstance from "./axiosInstance";

export const getAllHistory = async () => {
  try {
    const res = await axiosInstance.get("ModelAI/GetAllHistories");
    return res.data;
  } catch (error) {
    console.error("Error fetching all histories:", error);
    throw error;
  }
};

export const getHistoryById = async (id) => {
  try {
    const res = await axiosInstance.get(`ModelAI/GetHistoryById/${id}`);
    return res.data;
  } catch (error) {
    console.error(`Error fetching history with ID ${id}:`, error);
    throw error;
  }
};

export const deleteHistory = async (id) => {
  try {
    const res = await axiosInstance.delete(`ModelAI/RemoveHistory/${id}`);
    return res.data;
  } catch (error) {
    console.error(`Error deleting history with ID ${id}:`, error);
    throw error;
  }
};
