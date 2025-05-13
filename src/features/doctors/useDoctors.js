import { useState, useEffect } from 'react';
import { getAllDoctors, getDoctorById, createDoctor, editDoctor, removeDoctor } from '../../services/apiDoctors';

export const useDoctors = (id) => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [doctor, setDoctor] = useState(null);
  const [error, setError] = useState(null);

  // Fetch doctors when component mounts or the id changes
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
        setError("Error fetching doctor(s)");
        console.error("Error fetching doctor(s):", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, [id]);

  // Add a new doctor
  const addDoctor = async (doctorData) => {
    try {
      // Check if categoryId exists
      if (!doctorData.categoryId) {
        console.error("categoryId is missing or empty");
        throw new Error("Category selection is required");
      }

      const formData = new FormData();
      
      // Add all fields to FormData
      Object.keys(doctorData).forEach(key => {
        // Special handling for image file
        if (key === 'imageDoctor' && doctorData[key] instanceof File) {
          formData.append(key, doctorData[key]);
        } 
        // Skip category object but keep categoryId
        else if (key !== 'category' && doctorData[key] !== null && doctorData[key] !== undefined) {
          formData.append(key, doctorData[key]);
        }
      });

      // Explicitly add categoryId to ensure it's included
      formData.append("categoryId", doctorData.categoryId);
      
      // Log what's being sent (for debugging)
      console.log("Creating doctor with categoryId:", doctorData.categoryId);
      
      const response = await createDoctor(formData);
      
      // Update local state with the new doctor
      const newDoctor = response.result || response;
      setDoctors(prev => [...prev, newDoctor]);
      
      return newDoctor;
    } catch (error) {
      setError('Error adding doctor');
      console.error('Error adding doctor:', error);
      throw error;
    }
  };

  // Update doctor
  const updateDoctor = async (updatedDoctor) => {
    try {
      // Check if categoryId exists
      if (!updatedDoctor.categoryId) {
        console.error("categoryId is missing or empty");
        throw new Error("Category selection is required");
      }

      const formData = new FormData();
      
      // Add all fields to FormData except id and category object
      Object.keys(updatedDoctor).forEach(key => {
        if (key !== 'id' && key !== 'category') {
          if (key === 'imageDoctor' && updatedDoctor[key] instanceof File) {
            formData.append(key, updatedDoctor[key]);
          } else if (updatedDoctor[key] !== null && updatedDoctor[key] !== undefined) {
            formData.append(key, updatedDoctor[key]);
          }
        }
      });

      // Explicitly add categoryId to ensure it's included
      formData.append("categoryId", updatedDoctor.categoryId);
      
      // Log what's being sent (for debugging)
      console.log("Updating doctor with ID:", updatedDoctor.id);
      console.log("Using categoryId:", updatedDoctor.categoryId);
      
      const response = await editDoctor(updatedDoctor.id, formData);
      
      // Update local state with the updated doctor
      const updatedDoctorData = response.result || response;
      setDoctors(prev =>
        prev.map(doctor => doctor.id === updatedDoctor.id ? updatedDoctorData : doctor)
      );
      
      return updatedDoctorData;
    } catch (error) {
      setError('Error updating doctor');
      console.error('Error updating doctor:', error);
      throw error;
    }
  };

  // Remove a doctor by ID
  const deleteDoctor = async (doctorId) => {
    try {
      await removeDoctor(doctorId);
      // Remove the doctor from the list automatically
      setDoctors(prev => prev.filter(doctor => doctor.id !== doctorId));
    } catch (error) {
      setError('Error deleting doctor');
      console.error('Error deleting doctor:', error);
      throw error;
    }
  };

  return {
    doctor,
    doctors,
    loading,
    error,
    addDoctor,
    updateDoctor,
    deleteDoctor,
  };
};

export default useDoctors;