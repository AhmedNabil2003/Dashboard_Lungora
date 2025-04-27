import React, { useState } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import DoctorForm from '../features/doctors/DoctorForm';
import DoctorList from '../features/doctors/DoctorList';

const ManageDoctors = () => {
  const [doctors, setDoctors] = useState([
    { 
      id: 1, 
      name: 'Dr. Ahmed Mostafa', 
      emailDoctor: 'AhmedMostafa@gmail.com', 
      phone: '1234567890', 
      teliphone: '01012345678',
      experienceYears: 10, 
      location: 'Cairo, Egypt', 
      whatsAppLink: 'https://wa.me/1234567890', 
      imageDoctor: 'https://via.placeholder.com/100', 
      createdAt: '2023-08-01', 
      status: 'Active', 
      specialization: 'Cardiologist',
      about: 'Expert in heart surgery', 
      locationLink: 'https://maps.google.com?q=Cairo', 
      numOfPatients: 2000
    },
    { 
      id: 2, 
      name: 'Dr. Mona Ali', 
      emailDoctor: 'monaali@gmail.com', 
      phone: '0987654321', 
      teliphone: '01298765432',
      experienceYears: 5, 
      location: 'Alexandria, Egypt', 
      whatsAppLink: 'https://wa.me/0987654321', 
      imageDoctor: 'https://via.placeholder.com/100', 
      createdAt: '2023-07-15',
      status: 'Not Available', 
      specialization: 'Neurologist',
      about: 'Specialized in brain disorders',
      locationLink: 'https://maps.google.com?q=Alexandria',
      numOfPatients: 500
    },
  ]);

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [editDoctor, setEditDoctor] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newDoctor, setNewDoctor] = useState({
    name: '', emailDoctor: '', phone: '', teliphone: '', experienceYears: '', location: '', whatsAppLink: '', imageDoctor: '', createdAt: '', specialization: '', status: '', about: '', locationLink: '', numOfPatients: ''
  });
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteDoctorId, setDeleteDoctorId] = useState(null);

  const handleFilterChange = (e) => {
    setStatusFilter(e.target.value);
  };

  const filteredDoctors = doctors.filter((doctor) => {
    const searchMatch =
      doctor.name.toLowerCase().includes(search.toLowerCase()) ||
      doctor.emailDoctor.toLowerCase().includes(search.toLowerCase()) ||
      doctor.phone.includes(search) ||
      doctor.teliphone.includes(search) ||
      doctor.whatsAppLink.includes(search);
  
    const statusMatch = statusFilter ? doctor.status === statusFilter : true;
  
    return searchMatch && statusMatch;
  });

  const handleAddDoctor = (newDoctor) => {
    const newId = doctors.length + 1;
    setDoctors([...doctors, { id: newId, ...newDoctor, createdAt: new Date().toISOString().split('T')[0], status: 'Active' }]);
    setIsAddModalOpen(false);
    setNewDoctor({
      name: '', emailDoctor: '', phone: '', teliphone: '', experienceYears: '', location: '', whatsAppLink: '', imageDoctor: '', createdAt: '', specialization: '', status: 'Active', about: '', locationLink: '', numOfPatients: ''
    });
    toast.success('Doctor added successfully!');
  };

  const handleSaveEdit = () => {
    setDoctors(doctors.map((doctor) => (doctor.id === editDoctor.id ? editDoctor : doctor)));
    setIsEditModalOpen(false);
    toast.success('Doctor updated successfully!');
  };

  const handleDelete = (id) => {
    setDeleteDoctorId(id);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    setDoctors(doctors.filter((doctor) => doctor.id !== deleteDoctorId));
    setIsDeleteModalOpen(false);
    setDeleteDoctorId(null);
    toast.success('Doctor deleted successfully!');
  };

  const cancelDelete = () => {
    setIsDeleteModalOpen(false);
    setDeleteDoctorId(null);
  };

  return (
    <motion.div className="flex justify-center items-start min-h-screen bg-gradient-to-br from-white-300 to-white-200 p-4">
      <motion.div
        className="w-full max-w-7xl bg-white p-6 sm:p-4 rounded-2xl shadow-2xl flex flex-col space-y-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div className="overflow-x-auto">
          <DoctorList
            filteredDoctors={filteredDoctors}
            onEdit={(doctor) => {
              setEditDoctor(doctor);
              setIsEditModalOpen(true);
            }}
            onDelete={handleDelete}
            onSearch={(value) => setSearch(value)}
            onFilter={handleFilterChange}
            onAddDoctor={() => setIsAddModalOpen(true)}
          />
        </div>
      </motion.div>

      {/* نافذة إضافة أو تعديل الطبيب */}
      <DoctorForm
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={handleAddDoctor}
        title="Add Doctor"
        doctor={newDoctor}
      />
      <DoctorForm
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSave={handleSaveEdit}
        title="Edit Doctor"
        doctor={editDoctor} // Pass editDoctor to ensure correct values
      />
      
      {/* نافذة التأكيد للحذف */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-2xl mb-4 text-center">Are you sure you want to delete this doctor?</h2>
            <div className="space-x-4 flex justify-center">
              <button
                onClick={confirmDelete}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
              >
                Yes, Delete
              </button>
              <button
                onClick={cancelDelete}
                className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700"
              >
                No, Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default ManageDoctors;
