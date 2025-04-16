import axios from "axios";

const API_URL = "http/history";

export const getUserHistory = async (userId) => {
  const res = await axios.get(`${API_URL}/user/${userId}`);
  return res.data;
};

export const getAllHistory = async () => {
  const res = await axios.get(API_URL);
  return res.data;
};

export const deleteHistory = async (id) => {
  const res = await axios.delete(`${API_URL}/${id}`);
  return res.data;
};
