import axiosInstance from "./axiosInstance"

// Get all doctors
export const getAllDoctors = async () => {
  try {
    const res = await axiosInstance.get("/Doctor/GetAllDoctors")
    console.log("Get all doctors response:", res.data)
    return res.data.result?.doctors || res.data.result || res.data
  } catch (error) {
    console.error("Error fetching all doctors:", error)
    throw error
  }
}

// Get a single doctor by ID
export const getDoctorById = async (id) => {
  try {
    const res = await axiosInstance.get(`/Doctor/GetDoctorById/${id}`)
    console.log("Get doctor by ID response:", res.data)
    return res.data.result?.doctor || res.data.result || res.data
  } catch (error) {
    console.error(`Error fetching doctor with ID ${id}:`, error)
    throw error
  }
}

// Check if doctor exists by email or phone
export const checkDoctorExists = async (email, phone) => {
  try {
    const doctors = await getAllDoctors()
    const existingDoctor = doctors.find(
      (doctor) => doctor.emailDoctor?.toLowerCase() === email?.toLowerCase() || doctor.phone === phone,
    )
    return existingDoctor || null
  } catch (error) {
    console.error("Error checking doctor existence:", error)
    return null
  }
}

// Create a new doctor - ENHANCED VERSION
export const createDoctor = async (doctorData) => {
  try {
    console.log("Creating doctor with data:", doctorData)

    // Create FormData properly
    const formData = new FormData()

    // Add all required fields with proper validation
    const requiredFields = {
      Name: doctorData.name,
      EmailDoctor: doctorData.emailDoctor,
      Phone: doctorData.phone,
      Teliphone: doctorData.teliphone,
      ExperianceYears: Number(doctorData.experianceYears) || 0,
      NumOfPatients: Number(doctorData.numOfPatients) || 0,
      Location: doctorData.location,
      About: doctorData.about,
      WhatsAppLink: doctorData.whatsAppLink,
      LocationLink: doctorData.locationLink || "",
      Latitude: Number(doctorData.latitude) || 30.0444,
      Longitude: Number(doctorData.longitude) || 31.2357,
      CategoryId: Number(doctorData.categoryId),
    }

    // Validate required fields before adding to FormData
    const missingFields = []
    Object.entries(requiredFields).forEach(([key, value]) => {
      if (value === undefined || value === null || value === "") {
        if (key !== "LocationLink" && key !== "NumOfPatients") {
          // These are optional
          missingFields.push(key)
        }
      }
    })

    if (missingFields.length > 0) {
      throw new Error(`Missing required fields: ${missingFields.join(", ")}`)
    }

    // Add fields to FormData
    Object.entries(requiredFields).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        formData.append(key, value.toString())
      }
    })

    // Add image if provided
    if (doctorData.imageDoctor && doctorData.imageDoctor instanceof File) {
      formData.append("ImageDoctor", doctorData.imageDoctor)
      console.log("Added image to FormData:", doctorData.imageDoctor.name)
    }

    // Log FormData contents for debugging
    console.log("FormData contents:")
    for (const [key, value] of formData.entries()) {
      console.log(`${key}:`, value)
    }

    const res = await axiosInstance.post("/Doctor/CreateDoctor", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      timeout: 30000, // 30 seconds timeout
    })

    console.log("Create doctor response:", res.data)
    return res.data
  } catch (error) {
    console.error("Error creating doctor:", error)

    // Enhanced error handling with specific messages
    if (error.response) {
      console.error("Error response data:", error.response.data)
      console.error("Error status:", error.response.status)

      // Handle specific error cases
      if (error.response.status === 400) {
        const errorData = error.response.data
        let errorMessage = "Invalid data provided. Please check all required fields."

        // Check for specific error messages
        if (typeof errorData === "string") {
          errorMessage = errorData
        } else if (errorData?.message) {
          errorMessage = errorData.message
        } else if (errorData?.errors) {
          if (typeof errorData.errors === "string") {
            errorMessage = errorData.errors
          } else if (Array.isArray(errorData.errors)) {
            errorMessage = errorData.errors.join(", ")
          } else if (typeof errorData.errors === "object") {
            const errorMessages = Object.values(errorData.errors).flat()
            errorMessage = errorMessages.join(", ")
          }
        }

        // Handle specific duplicate doctor error
        if (
          errorMessage.toLowerCase().includes("already exists") ||
          errorMessage.toLowerCase().includes("duplicate") ||
          errorMessage.toLowerCase().includes("doctor already exists")
        ) {
          throw new Error(
            "A doctor with this email or phone number already exists. Please use different contact information.",
          )
        }

        throw new Error(errorMessage)
      } else if (error.response.status === 500) {
        throw new Error("Server error. Please try again later.")
      } else if (error.response.status === 422) {
        throw new Error("Validation error. Please check your input data.")
      }
    } else if (error.request) {
      throw new Error("Network error. Please check your internet connection and try again.")
    }

    throw new Error(error.message || "Failed to create doctor")
  }
}

// Edit a doctor - IMPROVED VERSION
export const editDoctor = async (id, doctorData) => {
  try {
    console.log("Editing doctor with ID:", id)
    console.log("Doctor data:", doctorData)

    // Validate required data
    if (!id) {
      throw new Error("Doctor ID is required")
    }

    const queryParams = new URLSearchParams()
    const fields = {
      Name: doctorData.name,
      NumOfPatients: Number(doctorData.numOfPatients) || 0,
      About: doctorData.about,
      EmailDoctor: doctorData.emailDoctor,
      Phone: doctorData.phone,
      Teliphone: doctorData.teliphone,
      ExperianceYears: Number(doctorData.experianceYears) || 0,
      Location: doctorData.location,
      LocationLink: doctorData.locationLink || "",
      WhatsAppLink: doctorData.whatsAppLink,
      Latitude: Number(doctorData.latitude) || 30.0444,
      Longitude: Number(doctorData.longitude) || 31.2357,
      CategoryId: Number(doctorData.categoryId),
    }

    // Add non-empty fields to query params
    Object.entries(fields).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        queryParams.append(key, value.toString())
      }
    })

    console.log("Query parameters:", queryParams.toString())

    const formData = new FormData()
    if (doctorData.imageDoctor && doctorData.imageDoctor instanceof File) {
      formData.append("ImageDoctor", doctorData.imageDoctor)
      console.log("Added image to FormData:", doctorData.imageDoctor.name)
    }

    const url = `/Doctor/EditDoctor/${id}?${queryParams.toString()}`
    console.log("Request URL:", url)

    const res = await axiosInstance.put(url, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      timeout: 30000, // 30 seconds timeout
    })

    console.log("Edit doctor response:", res.data)
    return res.data
  } catch (error) {
    console.error(`Error editing doctor with ID ${id}:`, error)

    if (error.response) {
      console.error("Error response:", error.response.data)
      console.error("Status code:", error.response.status)

      const errorData = error.response.data
      let errorMessage = `Failed to edit doctor (Status: ${error.response.status})`

      if (typeof errorData === "string") {
        errorMessage = errorData
      } else if (errorData?.message) {
        errorMessage = errorData.message
      } else if (errorData?.errors) {
        if (typeof errorData.errors === "string") {
          errorMessage = errorData.errors
        } else if (Array.isArray(errorData.errors)) {
          errorMessage = errorData.errors.join(", ")
        }
      }

      // Handle specific duplicate doctor error for edit
      if (errorMessage.toLowerCase().includes("already exists") || errorMessage.toLowerCase().includes("duplicate")) {
        throw new Error(
          "Another doctor with this email or phone number already exists. Please use different contact information.",
        )
      }

      throw new Error(errorMessage)
    }

    throw new Error(`Failed to edit doctor: ${error.message}`)
  }
}

// Remove a doctor by ID
export const removeDoctor = async (id) => {
  try {
    if (!id) {
      throw new Error("Doctor ID is required")
    }

    const res = await axiosInstance.delete(`/Doctor/RemoveDoctor/${id}`)
    console.log("Remove doctor response:", res.data)
    return res.data
  } catch (error) {
    console.error(`Error removing doctor with ID ${id}:`, error)

    if (error.response) {
      const errorMessage = error.response.data?.message || `Failed to remove doctor (Status: ${error.response.status})`
      throw new Error(errorMessage)
    }

    throw new Error(`Failed to remove doctor: ${error.message}`)
  }
}

// Helper function to convert day names to numbers
const dayNameToNumber = (dayName) => {
  const days = {
    Sunday: 0,
    Monday: 1,
    Tuesday: 2,
    Wednesday: 3,
    Thursday: 4,
    Friday: 5,
    Saturday: 6,
  }
  return days[dayName] ?? Number.parseInt(dayName, 10)
}

// Get doctor's working hours
export const getDoctorWorkingHours = async (doctorId) => {
  try {
    const res = await axiosInstance.get(`/WorkingHour/GetWorkingHourDoctorId/${doctorId}`)

    let workingHours = res.data.result
    if (!Array.isArray(workingHours)) {
      workingHours = [workingHours]
    }

    const normalizedHours = workingHours.map((hour) => ({
      ...hour,
      dayOfWeek: dayNameToNumber(hour.dayOfWeek),
      startTime: hour.startTime,
      endTime: hour.endTime,
    }))

    return normalizedHours
  } catch (error) {
    console.error(`Error fetching working hours for doctor ${doctorId}:`, error)
    throw error
  }
}

// Get working hour by ID
export const getWorkingHourById = async (id) => {
  try {
    const res = await axiosInstance.get(`/WorkingHour/GetWorkingHourById/${id}`)

    const hour = res.data.result
    return {
      ...hour,
      dayOfWeek: typeof hour.dayOfWeek === "string" ? dayNameToNumber(hour.dayOfWeek) : hour.dayOfWeek,
      startTime: hour.startTime,
      endTime: hour.endTime,
    }
  } catch (error) {
    console.error(`Error fetching working hour with ID ${id}:`, error)
    throw error
  }
}

// Create doctor's working hours
export const createDoctorWorkingHours = async (workingHourData) => {
  try {
    const payload = {
      dayOfWeek: workingHourData.dayOfWeek,
      startTime: workingHourData.startTime,
      endTime: workingHourData.endTime,
      doctorId: workingHourData.doctorId,
    }

    console.log("Sending to createDoctorWorkingHours:", JSON.stringify(payload, null, 2))

    const res = await axiosInstance.post("/WorkingHour/CreateWorkingHour", payload, {
      headers: {
        "Content-Type": "application/json",
      },
    })

    console.log("Create working hours response:", JSON.stringify(res.data, null, 2))

    const result = res.data.result || res.data
    return {
      ...result,
      dayOfWeek: typeof result.dayOfWeek === "string" ? dayNameToNumber(result.dayOfWeek) : result.dayOfWeek,
      startTime: result.startTime,
      endTime: result.endTime,
    }
  } catch (error) {
    console.error("Error creating working hours:", error)
    console.error("Error response:", JSON.stringify(error.response?.data, null, 2))
    console.error("Request payload:", JSON.stringify(workingHourData, null, 2))

    let errorMessage = "Failed to create working hour"
    if (error.response?.status === 409) {
      errorMessage = "A working hour for this day already exists."
    } else if (error.response?.status === 400) {
      errorMessage = error.response?.data?.errors?.[0] || "Invalid data provided."
    }

    throw new Error(errorMessage)
  }
}

// Edit doctor's working hours
export const editDoctorWorkingHours = async (id, workingHourData) => {
  try {
    const payload = {
      dayOfWeek: workingHourData.dayOfWeek,
      startTime: workingHourData.startTime,
      endTime: workingHourData.endTime,
    }

    console.log("Sending to editDoctorWorkingHours:", {
      id,
      payload: JSON.stringify(payload, null, 2),
    })

    const res = await axiosInstance.put(`/WorkingHour/EditWorkingHour/${id}`, payload, {
      headers: {
        "Content-Type": "application/json",
      },
    })

    console.log("Edit working hours response:", JSON.stringify(res.data, null, 2))

    const result = res.data.result || res.data
    return {
      ...result,
      dayOfWeek: typeof result.dayOfWeek === "string" ? dayNameToNumber(result.dayOfWeek) : result.dayOfWeek,
      startTime: result.startTime,
      endTime: result.endTime,
    }
  } catch (error) {
    console.error(`Error editing working hours with ID ${id}:`, error)
    console.error("Error response:", JSON.stringify(error.response?.data, null, 2))

    let errorMessage = "Failed to edit working hour"
    if (error.response?.status === 409) {
      errorMessage = "A working hour for this day already exists."
    } else if (error.response?.status === 400) {
      errorMessage = error.response?.data?.errors?.[0] || "Invalid data provided."
    } else if (error.response?.status === 404) {
      errorMessage = "Working hour not found."
    }

    throw new Error(errorMessage)
  }
}

// Remove doctor's working hours
export const removeDoctorWorkingHours = async (id) => {
  try {
    const res = await axiosInstance.delete(`/WorkingHour/RemoveWorkingHour/${id}`)
    return res.data
  } catch (error) {
    console.error(`Error removing working hours with ID ${id}:`, error)
    throw error
  }
}

// Create multiple working hours for a doctor - CORRECTED VERSION
export const createMultipleDoctorWorkingHours = async (doctorId, workingHours) => {
  try {
    console.log("Creating multiple working hours for doctor:", doctorId, workingHours)

    // Validate input
    if (!doctorId) {
      throw new Error("Doctor ID is required")
    }

    if (!Array.isArray(workingHours) || workingHours.length === 0) {
      console.log("No working hours to create")
      return { results: [], errors: [] }
    }

    const results = []
    const errors = []

    // Create working hours one by one to handle individual errors
    for (let i = 0; i < workingHours.length; i++) {
      const hour = workingHours[i]

      try {
        console.log(`Creating working hour ${i + 1}/${workingHours.length}:`, hour)

        const result = await createDoctorWorkingHours({
          doctorId: doctorId,
          dayOfWeek: hour.dayOfWeek,
          startTime: hour.startTime,
          endTime: hour.endTime,
        })

        results.push(result)
        console.log(`Successfully created working hour ${i + 1}:`, result)
      } catch (error) {
        console.error(`Error creating working hour ${i + 1} for day ${hour.dayOfWeek}:`, error)

        errors.push({
          hour: hour,
          dayOfWeek: hour.dayOfWeek,
          error: error.message,
          index: i,
        })
      }
    }

    console.log(`Working hours creation completed. Success: ${results.length}, Errors: ${errors.length}`)

    if (errors.length > 0) {
      console.warn("Some working hours failed to create:", errors)
    }

    return {
      results,
      errors,
      summary: {
        total: workingHours.length,
        successful: results.length,
        failed: errors.length,
      },
    }
  } catch (error) {
    console.error("Error in createMultipleDoctorWorkingHours:", error)
    throw new Error(`Failed to create working hours: ${error.message}`)
  }
}
