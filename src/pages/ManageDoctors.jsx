/* eslint-disable no-unused-vars */
import { useState, useContext } from "react"
import { motion } from "framer-motion"
import { toast } from "react-hot-toast"
import { ThemeContext } from "../context/themeContext"
import DoctorList from "../features/doctors/doctorList"
import DoctorForm from "../features/doctors/doctorAddForm"
import { useDoctors } from "../features/doctors/useDoctors"
import { useCategories } from "../features/categories/useCategories"
import WorkingHoursEditor from "../features/doctors/workingHoursEditor"

const ManageDoctors = () => {
  const { theme } = useContext(ThemeContext)
  const { doctors, loading, error, addDoctor, updateDoctor, deleteDoctor } = useDoctors()
  const { categories, loading: categoriesLoading, error: categoriesError } = useCategories()
  const [isFormModalOpen, setIsFormModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [isWorkingHoursOpen, setIsWorkingHoursOpen] = useState(false)
  const [selectedDoctor, setSelectedDoctor] = useState(null)
  const [deleteDoctorId, setDeleteDoctorId] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleAddDoctor = () => {
    setSelectedDoctor(null)
    setIsFormModalOpen(true)
  }

  const handleEditDoctor = (doctor) => {
    console.log("Editing doctor:", doctor)

    // Prepare doctor data for editing
    const doctorForEdit = {
      ...doctor,
      categoryId: doctor.category ? doctor.category.id : doctor.categoryId || null,
    }

    console.log("Doctor prepared for edit:", doctorForEdit)
    setSelectedDoctor(doctorForEdit)
    setIsFormModalOpen(true)
  }

  const handleDeleteDoctor = (id) => {
    setDeleteDoctorId(id)
    setIsDeleteModalOpen(true)
  }

  const confirmDelete = async () => {
    try {
      setIsSubmitting(true)
      await deleteDoctor(deleteDoctorId)
      toast.success("Doctor deleted successfully!")
    } catch (error) {
      toast.error(error.message || "Failed to delete doctor")
      console.error(error)
    } finally {
      setIsSubmitting(false)
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
      setIsSubmitting(true)

      // Validate required fields
      if (!doctorData.categoryId) {
        toast.error("Please select a category")
        return
      }

      console.log("Saving doctor with data:", doctorData)

      let savedDoctor
      if (selectedDoctor && selectedDoctor.id) {
        // Update existing doctor
        const updateData = {
          ...selectedDoctor,
          ...doctorData,
          id: selectedDoctor.id, // Ensure ID is preserved
        }

        console.log("Updating doctor with data:", updateData)
        savedDoctor = await updateDoctor(updateData)
        toast.success("Doctor updated successfully!")
      } else {
        // Add new doctor
        console.log("Adding new doctor with data:", doctorData)
        savedDoctor = await addDoctor(doctorData)
        toast.success("Doctor added successfully!")
      }

      console.log("Saved doctor result:", savedDoctor)

      setIsFormModalOpen(false)
      setSelectedDoctor(null)

      // Return the saved doctor for any additional processing
      return savedDoctor
    } catch (error) {
      const errorMessage = error.message || "Error saving doctor data"
      toast.error(errorMessage)
      console.error("Save doctor error:", error)
      throw error // Re-throw to let the form handle it
    } finally {
      setIsSubmitting(false)
    }
  }

  // Handle refresh functionality
  const handleRefresh = () => {
    window.location.reload()
  }

  if (loading || categoriesLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div
          className={`animate-spin rounded-full h-12 w-12 border-b-2 ${
            theme === "light" ? "border-sky-600" : "border-sky-300"
          }`}
        ></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen space-y-4">
        <div className={`${theme === "light" ? "bg-red-50 text-red-600" : "bg-red-900 text-red-200"} p-4 rounded-lg`}>
          Error loading doctors: {error}
        </div>
        <button
          onClick={handleRefresh}
          className={`px-4 py-2 rounded-lg ${
            theme === "light" ? "bg-sky-600 hover:bg-sky-700" : "bg-sky-700 hover:bg-sky-800"
          } text-white transition-colors`}
        >
          Retry
        </button>
      </div>
    )
  }

  if (categoriesError) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen space-y-4">
        <div className={`${theme === "light" ? "bg-red-50 text-red-600" : "bg-red-900 text-red-200"} p-4 rounded-lg`}>
          Error loading categories: {categoriesError}
        </div>
        <button
          onClick={handleRefresh}
          className={`px-4 py-2 rounded-lg ${
            theme === "light" ? "bg-sky-600 hover:bg-sky-700" : "bg-sky-700 hover:bg-sky-800"
          } text-white transition-colors`}
        >
          Retry
        </button>
      </div>
    )
  }

  return (
    <motion.div
      className={`flex justify-center items-start min-h-screen ${
        theme === "light" ? "bg-gradient-to-br from-gray-50 to-gray-100" : "bg-gradient-to-br from-gray-800 to-gray-900"
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
            isLoading={loading}
          />
        </div>
      </motion.div>

      {/* Doctor Add/Edit Modal */}
      {isFormModalOpen && (
        <DoctorForm
          isOpen={isFormModalOpen}
          onClose={() => {
            if (!isSubmitting) {
              setIsFormModalOpen(false)
              setSelectedDoctor(null)
            }
          }}
          onSave={handleSaveDoctor}
          title={selectedDoctor ? "Edit Doctor" : "Add New Doctor"}
          doctor={selectedDoctor}
          categories={categories}
          theme={theme}
          isSubmitting={isSubmitting}
        />
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <motion.div
          className="fixed inset-0 flex items-center justify-center z-50 bg-black/50"
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
            <div className={`p-4 ${theme === "light" ? "bg-sky-600 text-white" : "bg-gray-700 text-white"}`}>
              <h2 className="text-lg font-semibold flex items-center">
                <i className="fa-solid fa-trash-alt mr-2"></i>
                Confirm Deletion
              </h2>
            </div>

            {/* Modal body */}
            <div className="p-5">
              <p className={`text-gray-600 ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>
                Are you sure you want to delete this doctor? This action cannot be undone.
              </p>

              {/* Action buttons */}
              <div className="mt-6 flex justify-end space-x-3">
                <motion.button
                  onClick={() => !isSubmitting && setIsDeleteModalOpen(false)}
                  disabled={isSubmitting}
                  className={`px-4 py-2 bg-gray-200 text-gray-800 rounded-lg cursor-pointer hover:bg-gray-300 transition-colors ${
                    isSubmitting ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                  whileHover={!isSubmitting ? { scale: 1.05 } : {}}
                  whileTap={!isSubmitting ? { scale: 0.95 } : {}}
                >
                  Cancel
                </motion.button>
                <motion.button
                  onClick={confirmDelete}
                  disabled={isSubmitting}
                  className={`px-4 py-2 rounded-lg cursor-pointer hover:bg-red-700 transition-colors flex items-center ${
                    theme === "light" ? "bg-red-500 text-white" : "bg-red-700 text-gray-100"
                  } ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""}`}
                  whileHover={!isSubmitting ? { scale: 1.05 } : {}}
                  whileTap={!isSubmitting ? { scale: 0.95 } : {}}
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin h-4 w-4 mr-2" viewBox="0 0 24 24">
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                          fill="none"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      Deleting...
                    </>
                  ) : (
                    "Delete"
                  )}
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
  )
}

export default ManageDoctors
