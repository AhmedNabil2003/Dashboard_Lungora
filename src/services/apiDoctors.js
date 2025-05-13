import axiosInstance from "./axiosInstance";

// ✅ Get all doctors
export const getAllDoctors = async () => {
  try {
    const res = await axiosInstance.get("/Doctor/GetAllDoctors");
    return res.data.result.doctors;  // Return the doctor data from the response
  } catch (error) {
    console.error("Error fetching all doctors:", error);
    throw error;
  }
};

// ✅ Get a single doctor by ID
export const getDoctorById = async (id) => {
  try {
    const res = await axiosInstance.get(`/Doctor/GetDoctorById/${id}`);
    return res.data.result.doctor;  // Return doctor data for the specified ID
  } catch (error) {
    console.error(`Error fetching doctor with ID ${id}:`, error);
    throw error;
  }
};

// ✅ Create a new doctor (multipart/form-data)
export const editDoctor = async (id, formData) => {
  try {
    let headers = {};
    let payload = formData;

    if (formData instanceof FormData) {
      // تأكد من أن formData يحتوي على id و categoryId
      if (!formData.has("id")) formData.append("id", id);
      if (formData.has("categoryId")) {
        formData.append("categoryId", formData.get("categoryId")); // إضافة categoryId إلى formData إذا كانت موجودة
      }

      headers["Content-Type"] = "multipart/form-data";
    } else {
      payload = { ...formData, id };
      if (formData.categoryId) {
        payload.categoryId = formData.categoryId; // التأكد من إرسال categoryId عند التحديث
      }
      headers["Content-Type"] = "application/json";
    }

    const res = await axiosInstance.put(`/Doctor/EditDoctor/${id}`, payload, { headers });
    console.log("Form data being sent:", formData);
    return res.data; // Return updated doctor data
  } catch (error) {
    console.error(`Error editing doctor with ID ${id}:`, error);
    throw error;
  }
  
};

// ✅ Create a new doctor (multipart/form-data)
export const createDoctor = async (formData) => {
  try {
    const res = await axiosInstance.post("/Doctor/CreateDoctor", formData, {
      headers: {
        "Content-Type": formData instanceof FormData ? "multipart/form-data" : "application/json",  // Ensure to set the correct content type for file uploads
      },
    });
    return res.data;  // Return response data
  } catch (error) {
    console.error("Error creating doctor:", error);
    throw error;
  }
};
// ✅ Remove a doctor by ID
export const removeDoctor = async (id) => {
  try {
    const res = await axiosInstance.delete(`/Doctor/RemoveDoctor/${id}`);
    return res.data;  // Return success message or data
  } catch (error) {
    console.error(`Error removing doctor with ID ${id}:`, error);
    throw error;
  }
};


// Get doctor working hours
export const getDoctorWorkingHours = async (doctorId) => {
  try {
    const res = await axiosInstance.get(`/WorkingHour/GetWorkingHourDoctorId/${doctorId}`)

    // Check if the result is an array or a single object
    let workingHours = res.data.result
    if (!Array.isArray(workingHours)) {
      // If it's a single object, convert it to an array
      workingHours = [workingHours]
    }

    return workingHours
  } catch (error) {
    console.error(`Error fetching working hours for doctor ${doctorId}:`, error)
    throw error
  }
}

// Create doctor working hours
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
    const res = await axiosInstance.put(`/WorkingHour/EditWorkingHour/${id}`, workingHourData);
    return res.data.result;
  } catch (error) {
    console.error(`Error editing working hours with ID ${id}:`, error);
    throw error;
  }
};

export const getWorkingHourById = async (id) => {
  try {
    const res = await axiosInstance.get(`/WorkingHour/GetWorkingHourById/${id}`);
    return res.data.result;
  } catch (error) {
    console.error(`Error fetching working hour with ID ${id}:`, error);
    throw error;
  }
};

// Delete doctor working hours
export const removeDoctorWorkingHours = async (id) => {
  try {
    const res = await axiosInstance.delete(`/WorkingHour/RemoveWorkingHour/${id}`)
    return res.data
  } catch (error) {
    console.error(`Error removing working hours with ID ${id}:`, error)
    throw error
  }
}
