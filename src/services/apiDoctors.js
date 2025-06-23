import axiosInstance from "./axiosInstance";

// Get all doctors
export const getAllDoctors = async () => {
  try {
    const res = await axiosInstance.get("/Doctor/GetAllDoctors");
    console.log("Get all doctors response:", res.data);
    return res.data.result?.doctors || res.data.result || res.data;
  } catch (error) {
    console.error("Error fetching all doctors:", error);
    throw error;
  }
};

// Get a single doctor by ID
export const getDoctorById = async (id) => {
  try {
    const res = await axiosInstance.get(`/Doctor/GetDoctorById/${id}`);
    console.log("Get doctor by ID response:", res.data);
    return res.data.result?.doctor || res.data.result || res.data;
  } catch (error) {
    console.error(`Error fetching doctor with ID ${id}:`, error);
    throw error;
  }
};

// Create a new doctor
export const createDoctor = async (formData) => {
  try {
    console.log("Creating doctor...");
    if (formData instanceof FormData) {
      console.log("FormData contents:");
      for (const [key, value] of formData.entries()) {
        console.log(`${key}:`, value);
      }
    }
    const res = await axiosInstance.post("/Doctor/CreateDoctor", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    console.log("Create doctor response:", res.data);
    return res.data;
  } catch (error) {
    console.error("Error creating doctor:", error);
    console.error("Error response:", error.response?.data);
    throw error;
  }
};

// Edit a doctor
export const editDoctor = async (id, doctorData) => {
  try {
    console.log("Editing doctor with ID:", id);
    console.log("Doctor data:", doctorData);
    const queryParams = new URLSearchParams();
    const fields = {
      Name: doctorData.name,
      NumOfPatients: doctorData.numOfPatients,
      About: doctorData.about,
      EmailDoctor: doctorData.emailDoctor,
      Phone: doctorData.phone,
      Teliphone: doctorData.teliphone,
      ExperianceYears: doctorData.experianceYears,
      Location: doctorData.location,
      LocationLink: doctorData.locationLink,
      WhatsAppLink: doctorData.whatsAppLink,
      Latitude: doctorData.latitude,
      Longitude: doctorData.longitude,
      CategoryId: doctorData.categoryId,
    };
    Object.entries(fields).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        queryParams.append(key, value.toString());
      }
    });
    console.log("Query parameters:", queryParams.toString());
    const formData = new FormData();
    if (doctorData.imageDoctor && doctorData.imageDoctor instanceof File) {
      formData.append("ImageDoctor", doctorData.imageDoctor);
      console.log("Added image to FormData:", doctorData.imageDoctor.name);
    }
    const url = `/Doctor/EditDoctor/${id}?${queryParams.toString()}`;
    console.log("Request URL:", url);
    const res = await axiosInstance.put(url, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    console.log("Edit doctor response:", res.data);
    return res.data;
  } catch (error) {
    console.error(`Error editing doctor with ID ${id}:`, error);
    if (error.response) {
      console.error("Error response:", error.response.data);
      console.error("Status code:", error.response.status);
    }
    throw new Error(`Failed to edit doctor: ${error.message}`);
  }
};

// Remove a doctor by ID
export const removeDoctor = async (id) => {
  try {
    const res = await axiosInstance.delete(`/Doctor/RemoveDoctor/${id}`);
    console.log("Remove doctor response:", res.data);
    return res.data;
  } catch (error) {
    console.error(`Error removing doctor with ID ${id}:`, error);
    throw error;
  }
};

// Get doctor's working hours
export const getDoctorWorkingHours = async (doctorId) => {
  try {
    const res = await axiosInstance.get(`/WorkingHour/GetWorkingHourDoctorId/${doctorId}`);
    let workingHours = res.data.result;
    if (!Array.isArray(workingHours)) {
      workingHours = [workingHours];
    }
    return workingHours;
  } catch (error) {
    console.error(`Error fetching working hours for doctor ${doctorId}:`, error);
    throw error;
  }
};
// Create doctor's working hours
export const createDoctorWorkingHours = async (workingHourData) => {
  try {
    // Convert time format to TimeSpan string (HH:mm:ss)
    const formatTimeSpan = (timeObj) => {
      if (timeObj && timeObj.ticks) {
        const totalSeconds = timeObj.ticks / 10000000;
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = Math.floor(totalSeconds % 60);
        return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
      }
      // If it's already a string, convert to TimeSpan format
      if (typeof timeObj === 'string') {
        return timeObj.includes(':') ? `${timeObj}:00` : timeObj;
      }
      return "00:00:00";
    };

    const payload = {
      WorkingHourDTO: {
        doctorId: workingHourData.doctorId,
        dayOfWeek: workingHourData.dayOfWeek,
        startTime: formatTimeSpan(workingHourData.startTime),
        endTime: formatTimeSpan(workingHourData.endTime),
      }
    };
    
    console.log("Sending to createDoctorWorkingHours:", JSON.stringify(payload, null, 2));
    const res = await axiosInstance.post("/WorkingHour/CreateWorkingHour", payload);
    return res.data.result || res.data;
  } catch (error) {
    console.error("Error creating working hours:", error);
    console.error("Error response:", JSON.stringify(error.response?.data, null, 2));
    throw error;
  }
};

export const editDoctorWorkingHours = async (id, workingHourData) => {
  try {
    // Convert time format to TimeSpan string (HH:mm:ss)
    const formatTimeSpan = (timeObj) => {
      if (timeObj && timeObj.ticks) {
        const totalSeconds = timeObj.ticks / 10000000;
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = Math.floor(totalSeconds % 60);
        return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
      }
      // If it's already a string, convert to TimeSpan format
      if (typeof timeObj === 'string') {
        return timeObj.includes(':') ? `${timeObj}:00` : timeObj;
      }
      return "00:00:00";
    };

    const payload = {
      dto: {
        doctorId: workingHourData.doctorId,
        dayOfWeek: workingHourData.dayOfWeek,
        startTime: formatTimeSpan(workingHourData.startTime),
        endTime: formatTimeSpan(workingHourData.endTime),
      }
    };
    
    console.log("Sending to editDoctorWorkingHours:", {
      id,
      payload: JSON.stringify(payload, null, 2),
    });
    
    const res = await axiosInstance.put(`/WorkingHour/EditWorkingHour/${id}`, payload, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    
    console.log("Edit working hours response:", res.data);
    return res.data.result || res.data;
  } catch (error) {
    console.error(`Error editing working hours with ID ${id}:`, error);
    console.error("Error response:", JSON.stringify(error.response?.data, null, 2));
    
    if (error.response?.status === 409) {
      throw new Error("Cannot edit: A working hour with the same day already exists. Please delete the existing one first.");
    }
    
    throw new Error(
      `Failed to edit working hour: ${
        error.response?.data?.errors?.[0] ||
        error.response?.data?.title ||
        Object.values(error.response?.data?.errors || {}).flat().join(", ") ||
        error.message
      }`
    );
  }
};

// Get working hour by ID
export const getWorkingHourById = async (id) => {
  try {
    const res = await axiosInstance.get(`/WorkingHour/GetWorkingHourById/${id}`);
    return res.data.result;
  } catch (error) {
    console.error(`Error fetching working hour with ID ${id}:`, error);
    throw error;
  }
};

// Remove doctor's working hours
export const removeDoctorWorkingHours = async (id) => {
  try {
    const res = await axiosInstance.delete(`/WorkingHour/RemoveWorkingHour/${id}`);
    return res.data;
  } catch (error) {
    console.error(`Error removing working hours with ID ${id}:`, error);
    throw error;
  }
};