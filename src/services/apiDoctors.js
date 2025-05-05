import axiosInstance from "./axiosInstance";

// ✅ Get all doctors (Mobile format)
export const getAllDoctors = async () => {
  const res = await axiosInstance.get("/Doctor/GetAllDoctorsWithMobile");
  return res.data.result.doctor;
};

// ✅ Get single doctor by ID
export const getDoctorById = async (id) => {
  const res = await axiosInstance.get(`/Doctor/GetDoctorById/${id}`);
  return res.data.result;
};

// ✅ Create a new doctor (multipart/form-data)
export const createDoctor = async (formData) => {
  const res = await axiosInstance.post("/Doctor/CreateDoctor", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
};

// ✅ Update doctor (Assuming endpoint exists — placeholder)
export const updateDoctor = async (id, formData) => {
  const res = await axiosInstance.put(`/Doctor/UpdateDoctor/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
};

// ✅ Delete doctor (Assuming endpoint exists — placeholder)
export const deleteDoctor = async (id) => {
  const res = await axiosInstance.delete(`/Doctor/DeleteDoctor/${id}`);
  return res.data;
};
