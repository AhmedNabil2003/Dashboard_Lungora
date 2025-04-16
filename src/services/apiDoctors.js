import axios from "axios";

const API_URL = "http/doctors";

export const getAllDoctors = async () => {
  const res = await axios.get(API_URL);
  return res.data;
};

export const getDoctorById = async (id) => {
  const res = await axios.get(`${API_URL}/${id}`);
  return res.data;
};

export const createDoctor = async (data) => {
  const res = await axios.post(API_URL, data);
  return res.data;
};

export const updateDoctor = async (id, data) => {
  const res = await axios.put(`${API_URL}/${id}`, data);
  return res.data;
};

export const deleteDoctor = async (id) => {
  const res = await axios.delete(`${API_URL}/${id}`);
  return res.data;
};
