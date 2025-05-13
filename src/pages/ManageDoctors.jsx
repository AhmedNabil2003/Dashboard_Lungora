import { useState } from "react"
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion"
import { toast } from "react-hot-toast"
import DoctorList from "../features/doctors/DoctorList"
import DoctorForm from "../features/doctors/DoctorForm"
import {useDoctors} from "../features/doctors/useDoctors"
import {useCategories} from "../features/categories/useCategories"
import WorkingHoursEditor from "../features/doctors/WorkingHoursEditor"

const ManageDoctors = () => {
  const { doctors, loading, error, addDoctor, updateDoctor, deleteDoctor } = useDoctors()
  const { categories, loading: categoriesLoading, error: categoriesError } = useCategories()
  const [isFormModalOpen, setIsFormModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [isWorkingHoursOpen, setIsWorkingHoursOpen] = useState(false)
  const [selectedDoctor, setSelectedDoctor] = useState(null)
  const [deleteDoctorId, setDeleteDoctorId] = useState(null)


  const handleAddDoctor = () => {
    setSelectedDoctor(null)
    setIsFormModalOpen(true)
  }

  const handleEditDoctor = (doctor) => {
    console.log("Editing doctor:", doctor);
    setSelectedDoctor({
    ...doctor,
    categoryId: doctor.category ? doctor.category.id : null,  // Ensure the categoryId is set
  });
  setIsFormModalOpen(true);
  }

  const handleDeleteDoctor = (id) => {
    setDeleteDoctorId(id)
    setIsDeleteModalOpen(true)
  }

  const confirmDelete = async () => {
    try {
      await deleteDoctor(deleteDoctorId)
      toast.success("Doctor deleted successfully!")
    } catch (error) {
      toast.error("Failed to delete doctor")
      console.error(error)
    } finally {
      setIsDeleteModalOpen(false)
      setDeleteDoctorId(null)
    }
  }

  const handleEditWorkingHours = (doctor) => {
    setSelectedDoctor(doctor)
    setIsWorkingHoursOpen(true) 
  }

const handleSaveDoctor = async (doctorData) => {
  try {
    // Find category object based on categoryId
    const categoryObject = categories.find(cat => cat.id === doctorData.categoryId);
    
    if (!doctorData.categoryId) {
      toast.error("Please select a category");
      return;
    }
    
    // Create a clean copy of the data with the category reference
    const updatedDoctorData = {
      ...doctorData,
      category: categoryObject, // Include the full category object for UI updates
    };
    
    console.log("Saving doctor with category ID:", doctorData.categoryId);
    console.log("Category object:", categoryObject);
    
    if (selectedDoctor && selectedDoctor.id) {
      // Update existing doctor
      await updateDoctor({ 
        ...selectedDoctor, 
        ...updatedDoctorData,
      });
      toast.success("Doctor updated successfully!");
    } else {
      // Add new doctor
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



  if (loading|| categoriesLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-600"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="bg-red-50 text-red-600 p-4 rounded-lg">Error loading doctors: {error}</div>
      </div>
    )
  }
  if (categoriesError) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="bg-red-50 text-red-600 p-4 rounded-lg">Error loading categories: {categoriesError}</div>
      </div>
    )
  }

  return (
    <motion.div
      className="flex justify-center items-start min-h-screen bg-gradient-to-br from-white-300 to-white-200 p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className="w-full max-w-7xl bg-white p-6 sm:p-4 rounded-2xl shadow-2xl flex flex-col space-y-4"
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
        />
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 flex justify-center items-center z-50 ">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-xl mb-4 text-center">Are you sure you want to delete this doctor?</h2>
            <div className="space-x-4 flex justify-center">
              <button onClick={confirmDelete} className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700">
                Yes, Delete
              </button>
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700"
              >
                No, Cancel
              </button>
            </div>
          </div>
        </div>
      )}
       {isWorkingHoursOpen && (
        <WorkingHoursEditor
          isOpen={isWorkingHoursOpen}
          onClose={() => setIsWorkingHoursOpen(false)}
          doctor={selectedDoctor}
        />
      )}
    </motion.div>
  )
}

export default ManageDoctors
