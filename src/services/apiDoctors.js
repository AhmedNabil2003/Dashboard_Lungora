import axiosInstance from "./axiosInstance";


export const getAllDoctors = async () => {
  const res = await axiosInstance.get("/Doctor/GetAllDoctorsWithMobile");
  console.log(res.data.result.doctor);
  return res.data.result.doctor;
};

export const getDoctorById = async (id) => {
  const res = await axiosInstance.get(`${res}/${id}`);
  return res.data;
};

export const createDoctor = async (data) => {
  const res = await axiosInstance.post( data);
  return res.data;
};

export const updateDoctor = async (id, data) => {
  const res = await axiosInstance.put(`${data}/${id}`, data);
  return res.data;
};

export const deleteDoctor = async (id) => {
  const res = await axiosInstance.delete(`${res}/${id}`);
  return res.data;
};
