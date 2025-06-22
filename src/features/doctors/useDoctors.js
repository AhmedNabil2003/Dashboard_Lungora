"use client"

import { useState, useEffect } from "react"
import { getAllDoctors, getDoctorById, createDoctor, editDoctor, removeDoctor } from "../../services/apiDoctors"

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

  // Add a new doctor
  const addDoctor = async (doctorData) => {
    try {
      if (!doctorData.categoryId) {
        throw new Error("Category selection is required")
      }

      const formData = new FormData()

      // Add all fields to FormData for create (assuming create still uses FormData)
      Object.keys(doctorData).forEach((key) => {
        const value = doctorData[key]

        if (value === null || value === undefined || value === "") {
          return
        }

        if (key === "imageDoctor" && value instanceof File) {
          formData.append(key, value)
        } else if (key !== "category") {
          formData.append(key, String(value))
        }
      })

      console.log("Creating doctor with data:", Object.fromEntries(formData))

      const response = await createDoctor(formData)
      const newDoctor = response.result?.doctor || response.result || response

      if (!newDoctor || !newDoctor.id) {
        console.error("Invalid doctor data received:", newDoctor)
        throw new Error("Invalid response from server")
      }

      setDoctors((prev) => [...prev, newDoctor])
      return newDoctor
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || "Error adding doctor"
      setError(errorMessage)
      console.error("Error adding doctor:", error)
      throw new Error(errorMessage)
    }
  }

  // Update doctor - CORRECTED VERSION
  const updateDoctor = async (updatedDoctor) => {
    try {
      if (!updatedDoctor.categoryId) {
        throw new Error("Category selection is required")
      }

      if (!updatedDoctor.id) {
        throw new Error("Doctor ID is required for update")
      }

      // Prepare data object for the corrected API call
      const doctorDataForAPI = {
        name: updatedDoctor.name,
        numOfPatients: updatedDoctor.numOfPatients || 0,
        about: updatedDoctor.about,
        emailDoctor: updatedDoctor.emailDoctor,
        phone: updatedDoctor.phone,
        teliphone: updatedDoctor.teliphone,
        experianceYears: updatedDoctor.experianceYears || 0,
        location: updatedDoctor.location,
        locationLink: updatedDoctor.locationLink,
        whatsAppLink: updatedDoctor.whatsAppLink,
        latitude: updatedDoctor.latitude || 30.0444,
        longitude: updatedDoctor.longitude || 31.2357,
        categoryId: updatedDoctor.categoryId,
        imageDoctor: updatedDoctor.imageDoctor, // This will be handled separately in the API
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
          // Use the original data as fallback
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
        experianceYears: updatedDoctorData.experianceYears || updatedDoctor.experianceYears || 0,
        numOfPatients: updatedDoctorData.numOfPatients || updatedDoctor.numOfPatients || 0,
        location: updatedDoctorData.location || updatedDoctor.location || "",
        about: updatedDoctorData.about || updatedDoctor.about || "",
        whatsAppLink: updatedDoctorData.whatsAppLink || updatedDoctor.whatsAppLink || "",
        locationLink: updatedDoctorData.locationLink || updatedDoctor.locationLink || "",
        imageDoctor: updatedDoctorData.imageDoctor || updatedDoctor.imageDoctor || "",
        latitude: updatedDoctorData.latitude || updatedDoctor.latitude || 30.0444,
        longitude: updatedDoctorData.longitude || updatedDoctor.longitude || 31.2357,
        categoryId: updatedDoctorData.categoryId || updatedDoctor.categoryId || "",
        category: updatedDoctorData.category || updatedDoctor.category || null,
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
      const errorMessage = error.response?.data?.message || error.message || "Error updating doctor"
      setError(errorMessage)
      console.error("Error updating doctor:", error)
      throw new Error(errorMessage)
    }
  }

  // Remove a doctor by ID
  const deleteDoctor = async (doctorId) => {
    try {
      await removeDoctor(doctorId)
      setDoctors((prev) => prev.filter((doctor) => doctor.id !== doctorId))

      if (doctor && doctor.id === doctorId) {
        setDoctor(null)
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || "Error deleting doctor"
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
