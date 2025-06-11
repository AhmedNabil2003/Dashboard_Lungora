/* eslint-disable no-unused-vars */
import { useState, useContext } from "react";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";
import { ThemeContext } from "../context/ThemeContext"; 
import DoctorList from "../features/doctors/DoctorList";
import DoctorForm from "../features/doctors/DoctorForm";
import { useDoctors } from "../features/doctors/useDoctors";
import { useCategories } from "../features/categories/useCategories";
import WorkingHoursEditor from "../features/doctors/WorkingHoursEditor";

const ManageDoctors = () => {
  const { theme } = useContext(ThemeContext);
  const { doctors, loading, error, addDoctor, updateDoctor, deleteDoctor } = useDoctors();
  const { categories, loading: categoriesLoading, error: categoriesError } = useCategories();
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isWorkingHoursOpen, setIsWorkingHoursOpen] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [deleteDoctorId, setDeleteDoctorId] = useState(null);

  const handleAddDoctor = () => {
    setSelectedDoctor(null);
    setIsFormModalOpen(true);
  };

  const handleEditDoctor = (doctor) => {
    console.log("Editing doctor:", doctor);
    setSelectedDoctor({
      ...doctor,
      categoryId: doctor.category ? doctor.category.id : null,
    });
    setIsFormModalOpen(true);
  };

  const handleDeleteDoctor = (id) => {
    setDeleteDoctorId(id);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await deleteDoctor(deleteDoctorId);
      toast.success("Doctor deleted successfully!");
    } catch (error) {
      toast.error("Failed to delete doctor");
      console.error(error);
    } finally {
      setIsDeleteModalOpen(false);
      setDeleteDoctorId(null);
    }
  };

  const handleEditWorkingHours = (doctor) => {
    setSelectedDoctor(doctor);
    setIsWorkingHoursOpen(true);
  };

  const handleSaveDoctor = async (doctorData) => {
    try {
      const categoryObject = categories.find((cat) => cat.id === doctorData.categoryId);

      if (!doctorData.categoryId) {
        toast.error("Please select a category");
        return;
      }

      const updatedDoctorData = {
        ...doctorData,
        category: categoryObject,
      };

      console.log("Saving doctor with category ID:", doctorData.categoryId);
      console.log("Category object:", categoryObject);

      if (selectedDoctor && selectedDoctor.id) {
        await updateDoctor({
          ...selectedDoctor,
          ...updatedDoctorData,
        });
        toast.success("Doctor updated successfully!");
      } else {
        await addDoctor(updatedDoctorData);
        toast.success("Doctor added successfully!");
      }

      setIsFormModalOpen(false);
      setSelectedDoctor(null);
    } catch (error) {
      toast.error(error.message || "Error saving doctor data");
      console.error(error);
    }
  };

  if (loading || categoriesLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div
          className={`animate-spin rounded-full h-12 w-12 border-b-2 ${
            theme === "light" ? "border-sky-600" : "border-sky-300"
          }`}
        ></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div
          className={`${
            theme === "light" ? "bg-red-50 text-red-600" : "bg-red-900 text-red-200"
          } p-4 rounded-lg`}
        >
          Error loading doctors: {error}
        </div>
      </div>
    );
  }

  if (categoriesError) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div
          className={`${
            theme === "light" ? "bg-red-50 text-red-600" : "bg-red-900 text-red-200"
          } p-4 rounded-lg`}
        >
          Error loading categories: {categoriesError}
        </div>
      </div>
    );
  }

  return (
    <motion.div
      className={`flex justify-center items-start min-h-screen ${
        theme === "light"
          ? "bg-gradient-to-br from-gray-50 to-gray-100"
          : "bg-gradient-to-br from-gray-800 to-gray-900"
      } p-4`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className={`w-full max-w-7xl ${
          theme === "light" ? "bg-white text-gray-800" : "bg-gray-800 text-gray-100"
        } p-6 sm:p-4 rounded-2xl shadow-2xl flex flex-col space-y-4`}
        initial={{ y: 20 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="overflow-x-auto">
          <DoctorList
            doctors={doctors}
            onEdit={handleEditDoctor}
            onDelete={handleDeleteDoctor}
            onAddDoctor={handleAddDoctor}
            onEditWorkingHours={handleEditWorkingHours}
            categories={categories}
            theme={theme} 
          />
        </div>
      </motion.div>

      {/* Doctor Add/Edit Modal */}
      {isFormModalOpen && (
        <DoctorForm
          isOpen={isFormModalOpen}
          onClose={() => setIsFormModalOpen(false)}
          onSave={handleSaveDoctor}
          title={selectedDoctor ? "Edit Doctor" : "Add New Doctor"}
          doctor={selectedDoctor}
          categories={categories}
          theme={theme} 
        />
      )}

      {/* Delete Confirmation Modal */}
     {isDeleteModalOpen && (
  <motion.div
    className="fixed inset-0 flex items-center justify-center z-50"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
  >
    <motion.div
      className={`w-72 overflow-hidden rounded-xl shadow-2xl ${
        theme === "light" ? "bg-white text-gray-800" : "bg-gray-800 text-gray-200"
      }`}
      initial={{ scale: 0.8, y: 30, opacity: 0 }}
      animate={{ scale: 1, y: 0, opacity: 1 }}
      exit={{ scale: 0.8, y: 30, opacity: 0 }}
      transition={{ type: "spring", stiffness: 350 }}
    >
      {/* Modal header */}
      <div
        className={`p-4 ${
          theme === "light" ? "bg-sky-600 text-white" : "bg-gray-700 text-white"
        }`}
      >
        <h2 className="text-lg font-semibold flex items-center">
          <i className="fa-solid fa-trash-alt mr-2"></i>
          Confirm Deletion
        </h2>
      </div>

      {/* Modal body */}
      <div className="p-5">
        <p
          className={`text-gray-600 ${
            theme === "dark" ? "text-gray-300" : "text-gray-600"
          }`}
        >
          Are you sure you want to delete this doctor?
        </p>

        {/* Action buttons */}
        <div className="mt-6 flex justify-end space-x-3">
          <motion.button
            onClick={() => setIsDeleteModalOpen(false)}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg cursor-pointer hover:bg-gray-300 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Cancel
          </motion.button>
          <motion.button
            onClick={confirmDelete}
            className={`px-4 py-2 rounded-lg cursor-pointer hover:bg-red-700 transition-colors ${
              theme === "light" ? "bg-red-500 text-white" : "bg-red-700 text-gray-100"
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Delete
          </motion.button>
        </div>
      </div>
    </motion.div>
  </motion.div>
)}

      {/* Working Hours Editor Modal */}
      {isWorkingHoursOpen && (
        <WorkingHoursEditor
          isOpen={isWorkingHoursOpen}
          onClose={() => setIsWorkingHoursOpen(false)}
          doctor={selectedDoctor}
          theme={theme} 
        />
      )}
    </motion.div>
  );
};

export default ManageDoctors;