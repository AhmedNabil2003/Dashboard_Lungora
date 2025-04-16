// services/apiUsers.js
import axios from "axios";

const API_URL =  "http:/users";

// Get all users
export const getAllUsers = async () => {
  const res = await axios.get(API_URL);
  return res.data;
};

// Get user by ID
export const getUserById = async (id) => {
  const res = await axios.get(`${API_URL}/${id}`);
  return res.data;
};

// Create user
export const createUser = async (userData) => {
  const res = await axios.post(API_URL, userData);
  return res.data;
};

// Update user
export const updateUser = async (id, userData) => {
  const res = await axios.put(`${API_URL}/${id}`, userData);
  return res.data;
};

// Delete user
export const deleteUser = async (id) => {
  const res = await axios.delete(`${API_URL}/${id}`);
  return res.data;
};
