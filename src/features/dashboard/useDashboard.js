import { useState, useEffect } from "react";
import {
  getAllDoctors,
  getDoctorById,
  createDoctor,
  updateDoctor,
  deleteDoctor,
} from "../../services/apiDoctors";

export const useDoctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchDoctors = async () => {
    setLoading(true);
    const data = await getAllDoctors();
    setDoctors(data);
    setLoading(false);
  };

  const addDoctor = async (doctor) => {
    await createDoctor(doctor);
    fetchDoctors();
  };

  const editDoctor = async (id, doctor) => {
    await updateDoctor(id, doctor);
    fetchDoctors();
  };

  const removeDoctor = async (id) => {
    await deleteDoctor(id);
    fetchDoctors();
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  return { doctors, loading, fetchDoctors, addDoctor, editDoctor, removeDoctor };
};
