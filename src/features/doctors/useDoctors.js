// useDoctors.js
import { useState, useEffect } from 'react';

const useDoctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch doctor data from API
    const fetchDoctors = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/doctors');
        const data = await response.json();
        setDoctors(data);
      } catch (error) {
        console.error('Error fetching doctors:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  const addDoctor = (newDoctor) => {
    setDoctors([...doctors, newDoctor]);
  };

  const editDoctor = (updatedDoctor) => {
    setDoctors(
      doctors.map((doctor) =>
        doctor.id === updatedDoctor.id ? updatedDoctor : doctor
      )
    );
  };

  return {
    doctors,
    loading,
    addDoctor,
    editDoctor,
  };
};

export default useDoctors;
