import { useState, useEffect } from "react"
import {
  getAllDoctors,
  getDoctorById,
  createDoctor,
  editDoctor,
  removeDoctor,
  checkDoctorExists,
  createMultipleDoctorWorkingHours,
} from "../../services/apiDoctors"

export const useDoctors = (id) => {
  const [doctors, setDoctors] = useState([])
  const [loading, setLoading] = useState(true)
  const [doctor, setDoctor] = useState(null)
  const [error, setError] = useState(null)

  // Fetch doctors when component mounts or the id changes
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        setLoading(true)
        setError(null)
        if (id) {
          const data = await getDoctorById(id)
          setDoctor(data)
        } else {
          const data = await getAllDoctors()
          setDoctors(Array.isArray(data) ? data : [])
        }
      } catch (error) {
        setError("Error fetching doctor(s)")
        console.error("Error fetching doctor(s):", error)
      } finally {
        setLoading(false)
      }
    }

    fetchDoctors()
  }, [id])

  // Add a new doctor - ENHANCED VERSION WITH DUPLICATE CHECK AND WORKING HOURS
  const addDoctor = async (doctorData) => {
    try {
      console.log("Adding doctor with data:", doctorData)

      const requiredFields = [
        "name",
        "emailDoctor",
        "phone",
        "teliphone",
        "location",
        "about",
        "whatsAppLink",
        "categoryId",
      ]
      const missingFields = requiredFields.filter(
        (field) => !doctorData[field] || doctorData[field].toString().trim() === "",
      )

      if (missingFields.length > 0) {
        throw new Error(`Missing required fields: ${missingFields.join(", ")}`)
      }

      // Validate categoryId is a valid number
      if (!doctorData.categoryId || isNaN(Number(doctorData.categoryId))) {
        throw new Error("Valid category selection is required")
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(doctorData.emailDoctor)) {
        throw new Error("Invalid email format")
      }

      // Check for existing doctor before attempting to create
      console.log("Checking for existing doctor...")
      const existingDoctor = await checkDoctorExists(doctorData.emailDoctor, doctorData.phone)
      if (existingDoctor) {
        if (existingDoctor.emailDoctor?.toLowerCase() === doctorData.emailDoctor?.toLowerCase()) {
          throw new Error(
            `A doctor with email "${doctorData.emailDoctor}" already exists. Please use a different email address.`,
          )
        }
        if (existingDoctor.phone === doctorData.phone) {
          throw new Error(
            `A doctor with phone number "${doctorData.phone}" already exists. Please use a different phone number.`,
          )
        }
      }

      // Extract working hours from doctor data
      const workingHours = doctorData.workingHours || []

      const processedData = {
        ...doctorData,
        experianceYears: Number(doctorData.experianceYears) || 0,
        numOfPatients: Number(doctorData.numOfPatients) || 0,
        latitude: Number(doctorData.latitude) || 30.0444,
        longitude: Number(doctorData.longitude) || 31.2357,
        categoryId: Number(doctorData.categoryId),
      }

      // Remove working hours from doctor data before sending to API
      delete processedData.workingHours

      console.log("Processed doctor data:", processedData)

      const response = await createDoctor(processedData)
      const newDoctor = response.result?.doctor || response.result || response

      if (!newDoctor) {
        throw new Error("Invalid response from server")
      }

      console.log("Doctor created successfully:", newDoctor)

      // If working hours were provided, create them
      if (workingHours.length > 0 && newDoctor.id) {
        try {
          console.log("Creating working hours for doctor:", newDoctor.id, workingHours)
          const workingHoursResult = await createMultipleDoctorWorkingHours(newDoctor.id, workingHours)

          if (workingHoursResult.errors && workingHoursResult.errors.length > 0) {
            console.warn("Some working hours failed to create:", workingHoursResult.errors)
            // You might want to show a warning to the user here
          }

          console.log("Working hours created successfully:", workingHoursResult.results)
        } catch (workingHoursError) {
          console.error("Error creating working hours:", workingHoursError)

        }
      }

      // Update local state
      setDoctors((prev) => [...prev, { ...newDoctor, workingHours }])
      return { ...newDoctor, workingHours }
    } catch (error) {
      console.error("Full error details:", {
        message: error.message,
        response: error.response?.data,
        stack: error.stack,
      })

      const errorMessage = error.message || "Error adding doctor"
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }

  // Update doctor - IMPROVED VERSION WITH WORKING HOURS
  const updateDoctor = async (updatedDoctor) => {
    try {
      // Validate required fields
      if (!updatedDoctor.id) {
        throw new Error("Doctor ID is required for update")
      }

      if (!updatedDoctor.categoryId || isNaN(Number(updatedDoctor.categoryId))) {
        throw new Error("Valid category selection is required")
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(updatedDoctor.emailDoctor)) {
        throw new Error("Invalid email format")
      }

      // Check for existing doctor with same email/phone (excluding current doctor)
      console.log("Checking for existing doctor during update...")
      const existingDoctor = await checkDoctorExists(updatedDoctor.emailDoctor, updatedDoctor.phone)
      if (existingDoctor && existingDoctor.id !== updatedDoctor.id) {
        if (existingDoctor.emailDoctor?.toLowerCase() === updatedDoctor.emailDoctor?.toLowerCase()) {
          throw new Error(
            `Another doctor with email "${updatedDoctor.emailDoctor}" already exists. Please use a different email address.`,
          )
        }
        if (existingDoctor.phone === updatedDoctor.phone) {
          throw new Error(
            `Another doctor with phone number "${updatedDoctor.phone}" already exists. Please use a different phone number.`,
          )
        }
      }

      // Extract working hours from doctor data
      const workingHours = updatedDoctor.workingHours || []

      const doctorDataForAPI = {
        name: updatedDoctor.name?.trim(),
        numOfPatients: Number(updatedDoctor.numOfPatients) || 0,
        about: updatedDoctor.about?.trim(),
        emailDoctor: updatedDoctor.emailDoctor?.trim(),
        phone: updatedDoctor.phone?.trim(),
        teliphone: updatedDoctor.teliphone?.trim(),
        experianceYears: Number(updatedDoctor.experianceYears) || 0,
        location: updatedDoctor.location?.trim(),
        locationLink: updatedDoctor.locationLink || "",
        whatsAppLink: updatedDoctor.whatsAppLink?.trim(),
        latitude: Number(updatedDoctor.latitude) || 30.0444,
        longitude: Number(updatedDoctor.longitude) || 31.2357,
        categoryId: Number(updatedDoctor.categoryId),
        imageDoctor: updatedDoctor.imageDoctor,
      }

      console.log("Updating doctor with ID:", updatedDoctor.id)
      console.log("Doctor data for API:", doctorDataForAPI)

      const response = await editDoctor(updatedDoctor.id, doctorDataForAPI)

      // Handle response
      let updatedDoctorData = response.result?.doctor || response.result || response

      console.log("Received updated doctor data:", updatedDoctorData)

      // If response doesn't contain proper data, fetch from server
      if (!updatedDoctorData || !updatedDoctorData.id) {
        console.log("Fetching updated doctor data from server...")
        try {
          updatedDoctorData = await getDoctorById(updatedDoctor.id)
        } catch (fetchError) {
          console.error("Failed to fetch doctor after update:", fetchError)
          updatedDoctorData = { ...updatedDoctor }
        }
      }

      // Ensure we have all required fields
      const finalDoctorData = {
        id: updatedDoctor.id,
        name: updatedDoctorData.name || updatedDoctor.name || "Unknown",
        emailDoctor: updatedDoctorData.emailDoctor || updatedDoctor.emailDoctor || "",
        phone: updatedDoctorData.phone || updatedDoctor.phone || "",
        teliphone: updatedDoctorData.teliphone || updatedDoctor.teliphone || "",
        experianceYears: Number(updatedDoctorData.experianceYears || updatedDoctor.experianceYears) || 0,
        numOfPatients: Number(updatedDoctorData.numOfPatients || updatedDoctor.numOfPatients) || 0,
        location: updatedDoctorData.location || updatedDoctor.location || "",
        about: updatedDoctorData.about || updatedDoctor.about || "",
        whatsAppLink: updatedDoctorData.whatsAppLink || updatedDoctor.whatsAppLink || "",
        locationLink: updatedDoctorData.locationLink || updatedDoctor.locationLink || "",
        imageDoctor: updatedDoctorData.imageDoctor || updatedDoctor.imageDoctor || "",
        latitude: Number(updatedDoctorData.latitude || updatedDoctor.latitude) || 30.0444,
        longitude: Number(updatedDoctorData.longitude || updatedDoctor.longitude) || 31.2357,
        categoryId: Number(updatedDoctorData.categoryId || updatedDoctor.categoryId),
        category: updatedDoctorData.category || updatedDoctor.category || null,
        workingHours: workingHours,
        ...updatedDoctorData,
      }

      console.log("Final doctor data for state update:", finalDoctorData)

      // Update local state
      setDoctors((prev) => prev.map((doctor) => (doctor.id === updatedDoctor.id ? finalDoctorData : doctor)))

      if (doctor && doctor.id === updatedDoctor.id) {
        setDoctor(finalDoctorData)
      }

      return finalDoctorData
    } catch (error) {
      const errorMessage = error.message || "Error updating doctor"
      setError(errorMessage)
      console.error("Error updating doctor:", error)
      throw new Error(errorMessage)
    }
  }

  // Remove a doctor by ID
  const deleteDoctor = async (doctorId) => {
    try {
      if (!doctorId) {
        throw new Error("Doctor ID is required")
      }

      await removeDoctor(doctorId)

      // Update local state
      setDoctors((prev) => prev.filter((doctor) => doctor.id !== doctorId))

      if (doctor && doctor.id === doctorId) {
        setDoctor(null)
      }
    } catch (error) {
      const errorMessage = error.message || "Error deleting doctor"
      setError(errorMessage)
      console.error("Error deleting doctor:", error)
      throw new Error(errorMessage)
    }
  }

  return {
    doctor,
    doctors,
    loading,
    error,
    addDoctor,
    updateDoctor,
    deleteDoctor,
  }
}

export default useDoctors
