import React, { useState } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import DoctorForm from '../features/doctors/DoctorForm';
import DoctorList from '../features/doctors/DoctorList';
import useDoctors from '../features/doctors/useDoctors'; // استيراد useDoctors

const ManageDoctors = () => {
  const { doctors, addDoctor, editDoctor, removeDoctor } = useDoctors(); // استخدام hook

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [editDoctorData, setEditDoctorData] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newDoctor] = useState({
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
    addDoctor(newDoctor); // استخدام دالة الإضافة من hook
    setIsAddModalOpen(false);
    toast.success('Doctor added successfully!');
  };

  const handleSaveEdit = () => {
    editDoctor(editDoctorData); // استخدام دالة التعديل من hook
    setIsEditModalOpen(false);
    toast.success('Doctor updated successfully!');
  };

  const handleDelete = (id) => {
    setDeleteDoctorId(id);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    removeDoctor(deleteDoctorId); // استخدام دالة الحذف من hook
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
              setEditDoctorData(doctor);
              setIsEditModalOpen(true);
            }}
            onDelete={handleDelete}
            onSearch={(value) => setSearch(value)}
            onFilter={handleFilterChange}
            onAddDoctor={() => setIsAddModalOpen(true)}
          />
        </div>
      </motion.div>

      {/* Modal for Add and Edit Doctor */}
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
        doctor={editDoctorData} // Pass editDoctorData for editing
      />

      {/* Confirmation Modal for Deleting Doctor */}
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
