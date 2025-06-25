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

const dayNameToNumber = (dayName) => {
  const days = {
    Sunday: 0,
    Monday: 1,
    Tuesday: 2,
    Wednesday: 3,
    Thursday: 4,
    Friday: 5,
    Saturday: 6,
  };
  return days[dayName] ?? parseInt(dayName, 10);
};

// Get doctor's working hours
export const getDoctorWorkingHours = async (doctorId) => {
  try {
    const res = await axiosInstance.get(
      `/WorkingHour/GetWorkingHourDoctorId/${doctorId}`
    );
    let workingHours = res.data.result;

    if (!Array.isArray(workingHours)) {
      workingHours = [workingHours];
    }

    const normalizedHours = workingHours.map((hour) => ({
      ...hour,
      dayOfWeek: dayNameToNumber(hour.dayOfWeek),
      startTime: hour.startTime,
      endTime: hour.endTime,
    }));

    return normalizedHours;
  } catch (error) {
    console.error(
      `Error fetching working hours for doctor ${doctorId}:`,
      error
    );
    throw error;
  }
};

// Get working hour by ID
export const getWorkingHourById = async (id) => {
  try {
    const res = await axiosInstance.get(
      `/WorkingHour/GetWorkingHourById/${id}`
    );
    const hour = res.data.result;

    return {
      ...hour,
      dayOfWeek:
        typeof hour.dayOfWeek === "string"
          ? dayNameToNumber(hour.dayOfWeek)
          : hour.dayOfWeek,
      startTime: hour.startTime,
      endTime: hour.endTime,
    };
  } catch (error) {
    console.error(`Error fetching working hour with ID ${id}:`, error);
    throw error;
  }
};

// Create doctor's working hours
export const createDoctorWorkingHours = async (workingHourData) => {
  try {
    const payload = {
      dayOfWeek: workingHourData.dayOfWeek,
      startTime: workingHourData.startTime,
      endTime: workingHourData.endTime,
      doctorId: workingHourData.doctorId,
    };

    console.log(
      "Sending to createDoctorWorkingHours:",
      JSON.stringify(payload, null, 2)
    );
    const res = await axiosInstance.post(
      "/WorkingHour/CreateWorkingHour",
      payload,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    console.log(
      "Create working hours response:",
      JSON.stringify(res.data, null, 2)
    );

    const result = res.data.result || res.data;

    return {
      ...result,
      dayOfWeek:
        typeof result.dayOfWeek === "string"
          ? dayNameToNumber(result.dayOfWeek)
          : result.dayOfWeek,
      startTime: result.startTime,
      endTime: result.endTime,
    };
  } catch (error) {
    console.error("Error creating working hours:", error);
    console.error(
      "Error response:",
      JSON.stringify(error.response?.data, null, 2)
    );
    console.error("Request payload:", JSON.stringify(workingHourData, null, 2));
    let errorMessage = "Failed to create working hour";
    if (error.response?.status === 409) {
      errorMessage = "A working hour for this day already exists.";
    } else if (error.response?.status === 400) {
      errorMessage =
        error.response?.data?.errors?.[0] || "Invalid data provided.";
    }
    throw new Error(errorMessage);
  }
};

// Edit doctor's working hours
export const editDoctorWorkingHours = async (id, workingHourData) => {
  try {
    const payload = {
      dayOfWeek: workingHourData.dayOfWeek,
      startTime: workingHourData.startTime,
      endTime: workingHourData.endTime,
    };

    console.log("Sending to editDoctorWorkingHours:", {
      id,
      payload: JSON.stringify(payload, null, 2),
    });

    const res = await axiosInstance.put(
      `/WorkingHour/EditWorkingHour/${id}`,
      payload,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    console.log(
      "Edit working hours response:",
      JSON.stringify(res.data, null, 2)
    );
    const result = res.data.result || res.data;

    return {
      ...result,
      dayOfWeek:
        typeof result.dayOfWeek === "string"
          ? dayNameToNumber(result.dayOfWeek)
          : result.dayOfWeek,
      startTime: result.startTime,
      endTime: result.endTime,
    };
  } catch (error) {
    console.error(`Error editing working hours with ID ${id}:`, error);
    console.error(
      "Error response:",
      JSON.stringify(error.response?.data, null, 2)
    );
    let errorMessage = "Failed to edit working hour";
    if (error.response?.status === 409) {
      errorMessage = "A working hour for this day already exists.";
    } else if (error.response?.status === 400) {
      errorMessage =
        error.response?.data?.errors?.[0] || "Invalid data provided.";
    } else if (error.response?.status === 404) {
      errorMessage = "Working hour not found.";
    }
    throw new Error(errorMessage);
  }
};

// Remove doctor's working hours
export const removeDoctorWorkingHours = async (id) => {
  try {
    const res = await axiosInstance.delete(
      `/WorkingHour/RemoveWorkingHour/${id}`
    );
    return res.data;
  } catch (error) {
    console.error(`Error removing working hours with ID ${id}:`, error);
    throw error;
  }
};
