import { useState, useEffect } from 'react';
import { getDoctorById, createDoctor, updateDoctor, deleteDoctor, getAllDoctors } from '../../services/apiDoctors'; // Make sure the correct imports

const useDoctors = (id) => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [doctor, setDoctor] = useState(null);
  // Fetch all doctors on page load
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        setLoading(true);
        if (id) {
          const data = await getDoctorById(id);
          setDoctor(data);
        } else {
          const data = await getAllDoctors();
          setDoctors(data);
        }
      } catch (error) {
        console.error('Error fetching doctor(s):', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, [id]); // Empty dependency array to run only once

  // Add a new doctor
  const addDoctor = async (newDoctor) => {
    try {
      const data = await createDoctor(newDoctor); // Send doctor data to API
      setDoctors([...doctors, data]);
    } catch (error) {
      console.error('Error adding doctor:', error);
    }
  };

  // Edit doctor details
  const editDoctor = async (updatedDoctor) => {
    try {
      const data = await updateDoctor(updatedDoctor.id, updatedDoctor); // Update doctor data in API
      setDoctors(
        doctors.map((doctor) => (doctor.id === updatedDoctor.id ? data : doctor))
      );
    } catch (error) {
      console.error('Error updating doctor:', error);
    }
  };

  // Delete a doctor
  const removeDoctor = async (id) => {
    try {
      await deleteDoctor(id); // Delete doctor from API
      setDoctors(doctors.filter((doctor) => doctor.id !== id));
    } catch (error) {
      console.error('Error deleting doctor:', error);
    }
  };

  return {
    doctor,
    doctors,
    loading,
    addDoctor,
    editDoctor,
    removeDoctor,
  };
};

export default useDoctors;
