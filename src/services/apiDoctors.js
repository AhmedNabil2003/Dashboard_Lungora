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

// Create a new doctor - Keep as FormData (assuming create endpoint uses FormData)
export const createDoctor = async (formData) => {
  try {
    console.log("Creating doctor...")

    if (formData instanceof FormData) {
      console.log("FormData contents:")
      for (const [key, value] of formData.entries()) {
        console.log(`${key}:`, value)
      }
    }

    const res = await axiosInstance.post("/Doctor/CreateDoctor", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })

    console.log("Create doctor response:", res.data)
    return res.data
  } catch (error) {
    console.error("Error creating doctor:", error)
    console.error("Error response:", error.response?.data)
    throw error
  }
}

// Edit doctor - CORRECTED VERSION based on API documentation
export const editDoctor = async (id, doctorData) => {
  try {
    console.log("Editing doctor with ID:", id)
    console.log("Doctor data:", doctorData)

    // Prepare query parameters (all fields except image)
    const queryParams = new URLSearchParams()

    // Add all required query parameters
    if (doctorData.name) queryParams.append("Name", doctorData.name)
    if (doctorData.numOfPatients !== undefined) queryParams.append("NumOfPatients", doctorData.numOfPatients.toString())
    if (doctorData.about) queryParams.append("About", doctorData.about)
    if (doctorData.emailDoctor) queryParams.append("EmailDoctor", doctorData.emailDoctor)
    if (doctorData.phone) queryParams.append("Phone", doctorData.phone)
    if (doctorData.teliphone) queryParams.append("Teliphone", doctorData.teliphone)
    if (doctorData.experianceYears !== undefined)
      queryParams.append("ExperianceYears", doctorData.experianceYears.toString())
    if (doctorData.location) queryParams.append("Location", doctorData.location)
    if (doctorData.locationLink) queryParams.append("LocationLink", doctorData.locationLink)
    if (doctorData.whatsAppLink) queryParams.append("WhatsAppLink", doctorData.whatsAppLink)
    if (doctorData.latitude !== undefined) queryParams.append("Latitude", doctorData.latitude.toString())
    if (doctorData.longitude !== undefined) queryParams.append("Longitude", doctorData.longitude.toString())
    if (doctorData.categoryId) queryParams.append("CategoryId", doctorData.categoryId.toString())

    console.log("Query parameters:", queryParams.toString())

    // Prepare FormData for image only
    const formData = new FormData()
    if (doctorData.imageDoctor && doctorData.imageDoctor instanceof File) {
      formData.append("ImageDoctor", doctorData.imageDoctor)
      console.log("Added image to FormData:", doctorData.imageDoctor.name)
    }

    // Make the request with query parameters and FormData body
    const url = `/Doctor/EditDoctor/${id}?${queryParams.toString()}`
    console.log("Request URL:", url)

    const res = await axiosInstance.put(url, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })

    console.log("Edit doctor response:", res.data)
    return res.data
  } catch (error) {
    console.error(`Error editing doctor with ID ${id}:`, error)
    console.error("Error response:", error.response?.data)
    throw error
  }
}

// Alternative version using axios params option
export const editDoctorAlternative = async (id, doctorData) => {
  try {
    console.log("Editing doctor with ID:", id)
    console.log("Doctor data:", doctorData)

    // Prepare query parameters object
    const params = {}

    if (doctorData.name) params.Name = doctorData.name
    if (doctorData.numOfPatients !== undefined) params.NumOfPatients = doctorData.numOfPatients
    if (doctorData.about) params.About = doctorData.about
    if (doctorData.emailDoctor) params.EmailDoctor = doctorData.emailDoctor
    if (doctorData.phone) params.Phone = doctorData.phone
    if (doctorData.teliphone) params.Teliphone = doctorData.teliphone
    if (doctorData.experianceYears !== undefined) params.ExperianceYears = doctorData.experianceYears
    if (doctorData.location) params.Location = doctorData.location
    if (doctorData.locationLink) params.LocationLink = doctorData.locationLink
    if (doctorData.whatsAppLink) params.WhatsAppLink = doctorData.whatsAppLink
    if (doctorData.latitude !== undefined) params.Latitude = doctorData.latitude
    if (doctorData.longitude !== undefined) params.Longitude = doctorData.longitude
    if (doctorData.categoryId) params.CategoryId = doctorData.categoryId

    console.log("Query parameters object:", params)

    // Prepare FormData for image only
    const formData = new FormData()
    if (doctorData.imageDoctor && doctorData.imageDoctor instanceof File) {
      formData.append("ImageDoctor", doctorData.imageDoctor)
      console.log("Added image to FormData:", doctorData.imageDoctor.name)
    }

    // Make the request using axios params option
    const res = await axiosInstance.put(`/Doctor/EditDoctor/${id}`, formData, {
      params: params,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })

    console.log("Edit doctor response:", res.data)
    return res.data
  } catch (error) {
    console.error(`Error editing doctor with ID ${id}:`, error)
    console.error("Error response:", error.response?.data)
    throw error
  }
}

// Remove a doctor by ID
export const removeDoctor = async (id) => {
  try {
    const res = await axiosInstance.delete(`/Doctor/RemoveDoctor/${id}`)
    console.log("Remove doctor response:", res.data)
    return res.data
  } catch (error) {
    console.error(`Error removing doctor with ID ${id}:`, error)
    throw error
  }
}

// Working hours functions remain the same...
export const getDoctorWorkingHours = async (doctorId) => {
  try {
    const res = await axiosInstance.get(`/WorkingHour/GetWorkingHourDoctorId/${doctorId}`)
    let workingHours = res.data.result
    if (!Array.isArray(workingHours)) {
      workingHours = [workingHours]
    }
    return workingHours
  } catch (error) {
    console.error(`Error fetching working hours for doctor ${doctorId}:`, error)
    throw error
  }
}

export const createDoctorWorkingHours = async (workingHourData) => {
  try {
    const res = await axiosInstance.post("/WorkingHour/CreateWorkingHour", workingHourData)
    return res.data.result
  } catch (error) {
    console.error("Error creating working hours:", error)
    throw error
  }
}

export const editDoctorWorkingHours = async (id, workingHourData) => {
  try {
    const res = await axiosInstance.put(`/WorkingHour/EditWorkingHour/${id}`, workingHourData)
    return res.data.result
  } catch (error) {
    console.error(`Error editing working hours with ID ${id}:`, error)
    throw error
  }
}

export const getWorkingHourById = async (id) => {
  try {
    const res = await axiosInstance.get(`/WorkingHour/GetWorkingHourById/${id}`)
    return res.data.result
  } catch (error) {
    console.error(`Error fetching working hour with ID ${id}:`, error)
    throw error
  }
}

export const removeDoctorWorkingHours = async (id) => {
  try {
    const res = await axiosInstance.delete(`/WorkingHour/RemoveWorkingHour/${id}`)
    return res.data
  } catch (error) {
    console.error(`Error removing working hours with ID ${id}:`, error)
    throw error
  }
}
