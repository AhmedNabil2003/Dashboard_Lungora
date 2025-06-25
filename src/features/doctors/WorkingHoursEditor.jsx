import { useState, useEffect } from "react";
import { Clock, Plus, Trash, Save, X, Edit } from "lucide-react";
import { getDoctorWorkingHours, removeDoctorWorkingHours, editDoctorWorkingHours, createDoctorWorkingHours, getWorkingHourById } from "../../services/apiDoctors";
import { toast } from "react-hot-toast";

// Map day names to integers (0=Sunday, 1=Monday, ..., 6=Saturday)
const daysOfWeek = [
  { name: "Sunday", value: 0 },
  { name: "Monday", value: 1 },
  { name: "Tuesday", value: 2 },
  { name: "Wednesday", value: 3 },
  { name: "Thursday", value: 4 },
  { name: "Friday", value: 5 },
  { name: "Saturday", value: 6 },
];

// Convert time string (HH:mm:ss) to (HH:mm) for input fields
const formatTimeForInput = (timeStr) => {
  if (!timeStr) return "00:00";
  const parts = timeStr.split(":");
  return `${parts[0]}:${parts[1]}`;
};

// Convert time input (HH:mm) to (HH:mm:ss) for API
const formatTimeForAPI = (timeStr) => {
  if (!timeStr) return "00:00:00";
  const parts = timeStr.split(":");
  return `${parts[0]}:${parts[1]}:00`;
};

const WorkingHoursEditor = ({ isOpen, onClose, doctor, theme, initialWorkingHours }) => {
  const [workingHours, setWorkingHours] = useState(initialWorkingHours || []);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [newWorkingHour, setNewWorkingHour] = useState({
    doctorId: doctor?.id,
    dayOfWeek: 1, // Default to Monday
    startTime: "09:00",
    endTime: "17:00",
  });

  // Fetch working hours only if doctor exists
  useEffect(() => {
    const fetchWorkingHours = async () => {
      if (!doctor?.id) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const hours = await getDoctorWorkingHours(doctor.id);
        
        // Format times for display (convert HH:mm:ss to HH:mm for input fields)
        const formattedHours = hours.map((hour) => ({
          ...hour,
          startTime: formatTimeForInput(hour.startTime),
          endTime: formatTimeForInput(hour.endTime),
        }));
        
        setWorkingHours(formattedHours || []);
      } catch (error) {
        console.error("Error fetching working hours:", error);
        toast.error("Failed to load working hours");
      } finally {
        setLoading(false);
      }
    };

    if (isOpen && doctor?.id) {
      fetchWorkingHours();
    } else {
      setLoading(false);
    }
  }, [doctor?.id, isOpen]);

  if (!isOpen) return null;

  const resetForm = () => {
    setNewWorkingHour({
      doctorId: doctor?.id,
      dayOfWeek: 1, // Default to Monday
      startTime: "09:00",
      endTime: "17:00",
    });
    setIsEditing(false);
    setEditingId(null);
  };

  const validateWorkingHour = (workingHour, existingHours) => {
    // Ensure times are in HH:mm:ss format
    const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/;
    if (!timeRegex.test(workingHour.startTime) || !timeRegex.test(workingHour.endTime)) {
      toast.error("Invalid time format. Use HH:mm:ss (e.g., 09:00:00)");
      console.error("Invalid time format:", { startTime: workingHour.startTime, endTime: workingHour.endTime });
      return false;
    }

    // Convert times to Date objects for comparison
    const start = new Date(`1970-01-01T${workingHour.startTime}Z`);
    const end = new Date(`1970-01-01T${workingHour.endTime}Z`);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      toast.error("Invalid time values");
      console.error("Invalid time values:", { startTime: workingHour.startTime, endTime: workingHour.endTime });
      return false;
    }

    // Ensure endTime is at least 1 minute later than startTime
    if (end - start <= 0) {
      toast.error("End time must be later than start time");
      console.error("Time validation failed:", { startTime: workingHour.startTime, endTime: workingHour.endTime });
      return false;
    }

    const sameDay = existingHours.filter(
      (hour) => hour.dayOfWeek === workingHour.dayOfWeek && (isEditing ? hour.id !== editingId : true),
    );

    const hasOverlap = sameDay.some((hour) => {
      const hourStart = new Date(`1970-01-01T${formatTimeForAPI(hour.startTime)}Z`);
      const hourEnd = new Date(`1970-01-01T${formatTimeForAPI(hour.endTime)}Z`);
      return (
        (start >= hourStart && start < hourEnd) ||
        (end > hourStart && end <= hourEnd) ||
        (start <= hourStart && end >= hourEnd)
      );
    });

    if (hasOverlap) {
      toast.error("Working hours cannot overlap for the same day");
      return false;
    }

    return true;
  };

  const handleAddWorkingHour = async () => {
    // Format times to HH:mm:ss before validation
    const formattedWorkingHour = {
      ...newWorkingHour,
      startTime: formatTimeForAPI(newWorkingHour.startTime),
      endTime: formatTimeForAPI(newWorkingHour.endTime),
    };

    if (!validateWorkingHour(formattedWorkingHour, workingHours)) {
      return;
    }

    if (doctor?.id) {
      try {
        const payload = {
          doctorId: doctor.id,
          dayOfWeek: newWorkingHour.dayOfWeek,
          startTime: formatTimeForAPI(newWorkingHour.startTime),
          endTime: formatTimeForAPI(newWorkingHour.endTime),
        };
        
        const response = await createDoctorWorkingHours(payload);
        
        setWorkingHours([
          ...workingHours,
          {
            ...response,
            startTime: formatTimeForInput(response.startTime),
            endTime: formatTimeForInput(response.endTime),
          },
        ]);
        toast.success("Working hour added successfully");
        resetForm();
      } catch (error) {
        console.error("Error adding working hour:", error);
        toast.error(error.message || "Failed to add working hour");
      }
    } else {
      const newHour = {
        ...newWorkingHour,
        id: Date.now().toString(),
        startTime: formatTimeForInput(newWorkingHour.startTime),
        endTime: formatTimeForInput(newWorkingHour.endTime),
      };
      setWorkingHours([...workingHours, newHour]);
      toast.success("Working hour added to form");
      resetForm();
    }
  };

  const handleEditWorkingHour = async () => {
    // Format times to HH:mm:ss before validation
    const formattedWorkingHour = {
      ...newWorkingHour,
      startTime: formatTimeForAPI(newWorkingHour.startTime),
      endTime: formatTimeForAPI(newWorkingHour.endTime),
    };

    if (!validateWorkingHour(formattedWorkingHour, workingHours)) {
      return;
    }

    if (doctor?.id && editingId) {
      try {
        const payload = {
          dayOfWeek: newWorkingHour.dayOfWeek,
          startTime: formatTimeForAPI(newWorkingHour.startTime),
          endTime: formatTimeForAPI(newWorkingHour.endTime),
        };
        
        const response = await editDoctorWorkingHours(editingId, payload);
        
        setWorkingHours(
          workingHours.map((hour) =>
            hour.id === editingId
              ? {
                  ...response,
                  startTime: formatTimeForInput(response.startTime),
                  endTime: formatTimeForInput(response.endTime),
                }
              : hour,
          ),
        );
        toast.success("Working hour updated successfully");
        resetForm();
      } catch (error) {
        console.error("Error updating working hour:", error);
        toast.error(error.message || "Failed to update working hour");
      }
    } else {
      setWorkingHours(
        workingHours.map((hour) =>
          hour.id === editingId
            ? {
                ...newWorkingHour,
                id: editingId,
                startTime: formatTimeForInput(newWorkingHour.startTime),
                endTime: formatTimeForInput(newWorkingHour.endTime),
              }
            : hour,
        ),
      );
      toast.success("Working hour updated in form");
      resetForm();
    }
  };

  const handleDeleteWorkingHour = async (id) => {
    if (doctor?.id) {
      try {
        await removeDoctorWorkingHours(id);
        setWorkingHours(workingHours.filter((hour) => hour.id !== id));
        toast.success("Working hour removed successfully");
      } catch (error) {
        console.error("Error deleting working hour:", error);
        toast.error("Failed to delete working hour");
      }
    } else {
      setWorkingHours(workingHours.filter((hour) => hour.id !== id));
      toast.success("Working hour removed from form");
    }

    if (editingId === id) {
      resetForm();
    }
  };

  const handleStartEdit = async (id) => {
    try {
      let hour = workingHours.find((h) => h.id === id);
      
      // If not found in local state, fetch from API
      if (!hour && doctor?.id) {
        hour = await getWorkingHourById(id);
        hour = {
          ...hour,
          startTime: formatTimeForInput(hour.startTime),
          endTime: formatTimeForInput(hour.endTime),
        };
      }
      
      if (hour) {
        setNewWorkingHour({
          doctorId: doctor?.id,
          dayOfWeek: hour.dayOfWeek,
          startTime: hour.startTime,
          endTime: hour.endTime,
        });
        setIsEditing(true);
        setEditingId(id);
      }
    } catch (error) {
      console.error("Error fetching working hour for edit:", error);
      toast.error("Failed to load working hour for editing");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewWorkingHour({
      ...newWorkingHour,
      [name]: name === "dayOfWeek" ? parseInt(value, 10) : value,
    });
  };

  const handleDone = () => {
    // Convert times back to API format before passing to parent
    const formattedHours = workingHours.map((hour) => ({
      ...hour,
      startTime: formatTimeForAPI(hour.startTime),
      endTime: formatTimeForAPI(hour.endTime),
    }));
    onClose(formattedHours);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/30 p-2 sm:p-4">
      <div
        className={`rounded-lg shadow-xl w-full max-w-3xl max-h-[85vh] overflow-y-auto ${
          theme === "light" ? "bg-white" : "bg-gray-800"
        }`}
      >
        {/* Modal Header */}
        <div
          className={`flex justify-between items-center p-4 border-b ${
            theme === "light" ? "border-gray-200" : "border-gray-600"
          }`}
        >
          <h2
            className={`text-xl font-bold flex items-center ${
              theme === "light" ? "text-sky-600" : "text-sky-300"
            }`}
          >
            <Clock className={`mr-2 h-5 w-5`} />
            Working Hours - Dr. {doctor?.name || "New Doctor"}
          </h2>
          <button
            onClick={handleDone}
            className={`p-1 rounded-full transition-colors ${
              theme === "light"
                ? "text-gray-400 hover:text-gray-600 hover:bg-gray-100"
                : "text-gray-500 hover:text-gray-300 hover:bg-gray-700"
            }`}
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-4">
          {loading ? (
            <div className="flex justify-center py-8">
              <div
                className={`animate-spin rounded-full h-6 w-6 border-b-2 ${
                  theme === "light" ? "border-sky-600" : "border-sky-300"
                }`}
              ></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left Column - Current Working Hours */}
              <div className="space-y-3">
                <h3
                  className={`text-sm font-medium ${
                    theme === "light" ? "text-gray-700" : "text-gray-300"
                  }`}
                >
                  Current Schedule
                </h3>
                {workingHours.length === 0 ? (
                  <div
                    className={`text-center py-6 rounded border-2 border-dashed ${
                      theme === "light" ? "border-gray-300 text-gray-500" : "border-gray-600 text-gray-400"
                    }`}
                  >
                    <Clock
                      className={`mx-auto mb-2 h-8 w-8 ${
                        theme === "light" ? "text-gray-400" : "text-gray-500"
                      }`}
                    />
                    <p className="text-xs">No working hours specified</p>
                  </div>
                ) : (
                  <div
                    className={`rounded border max-h-64 overflow-y-auto ${
                      theme === "light" ? "border-gray-200" : "border-gray-600"
                    }`}
                  >
                    {workingHours
                      .sort((a, b) => a.dayOfWeek - b.dayOfWeek || a.startTime.localeCompare(b.startTime))
                      .map((hour) => (
                        <div
                          key={hour.id}
                          className={`flex items-center justify-between p-3 border-b last:border-b-0 ${
                            theme === "light" ? "border-gray-200 hover:bg-gray-50" : "border-gray-600 hover:bg-gray-700"
                          }`}
                        >
                          <div>
                            <div
                              className={`text-sm font-medium ${
                                theme === "light" ? "text-sky-700" : "text-sky-200"
                              }`}
                            >
                              {daysOfWeek.find((day) => day.value === hour.dayOfWeek)?.name}
                            </div>
                            <div
                              className={`text-xs ${theme === "light" ? "text-gray-600" : "text-gray-400"}`}
                            >
                              {hour.startTime} - {hour.endTime}
                            </div>
                          </div>
                          <div className="flex space-x-1">
                            <button
                              onClick={() => handleStartEdit(hour.id)}
                              className={`p-1.5 rounded transition-colors ${
                                theme === "light"
                                  ? "text-sky-500 hover:text-sky-700 hover:bg-sky-50"
                                  : "text-sky-300 hover:text-sky-400 hover:bg-sky-900"
                              }`}
                              title="Edit"
                            >
                              <Edit size={14} />
                            </button>
                            <button
                              onClick={() => handleDeleteWorkingHour(hour.id)}
                              className={`p-1.5 rounded transition-colors ${
                                theme === "light"
                                  ? "text-red-500 hover:text-red-700 hover:bg-red-50"
                                  : "text-red-300 hover:text-red-400 hover:bg-red-900"
                              }`}
                              title="Delete"
                            >
                              <Trash size={14} />
                            </button>
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </div>

              {/* Right Column - Add/Edit Form */}
              <div className="space-y-4">
                <h3
                  className={`text-sm font-medium ${
                    theme === "light" ? "text-gray-700" : "text-gray-300"
                  }`}
                >
                  {isEditing ? "Edit Schedule" : "Add New Schedule"}
                </h3>

                <div className="space-y-3">
                  {/* Day Selection */}
                  <div>
                    <label
                      htmlFor="dayOfWeek"
                      className={`block text-xs font-medium mb-1 ${
                        theme === "light" ? "text-gray-700" : "text-gray-300"
                      }`}
                    >
                      Day of Week
                    </label>
                    <select
                      id="dayOfWeek"
                      name="dayOfWeek"
                      value={newWorkingHour.dayOfWeek}
                      onChange={handleChange}
                      className={`w-full px-3 py-2 text-sm border rounded focus:outline-none focus:ring-2 focus:ring-sky-500 ${
                        theme === "light"
                          ? "bg-white border-gray-300 text-gray-900"
                          : "bg-gray-800 border-gray-600 text-gray-200"
                      }`}
                    >
                      {daysOfWeek.map((day) => (
                        <option key={day.value} value={day.value}>
                          {day.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Time Selection */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label
                        htmlFor="startTime"
                        className={`block text-xs font-medium mb-1 ${
                          theme === "light" ? "text-gray-700" : "text-gray-300"
                        }`}
                      >
                        Start Time
                      </label>
                      <input
                        type="time"
                        id="startTime"
                        name="startTime"
                        value={newWorkingHour.startTime}
                        onChange={handleChange}
                        className={`w-full px-3 py-2 text-sm border rounded focus:outline-none focus:ring-2 focus:ring-sky-500 ${
                          theme === "light"
                            ? "bg-white border-gray-300 text-gray-900"
                            : "bg-gray-800 border-gray-600 text-gray-200"
                        }`}
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="endTime"
                        className={`block text-xs font-medium mb-1 ${
                          theme === "light" ? "text-gray-700" : "text-gray-300"
                        }`}
                      >
                        End Time
                      </label>
                      <input
                        type="time"
                        id="endTime"
                        name="endTime"
                        value={newWorkingHour.endTime}
                        onChange={handleChange}
                        className={`w-full px-3 py-2 text-sm border rounded focus:outline-none focus:ring-2 focus:ring-sky-500 ${
                          theme === "light"
                            ? "bg-white border-gray-300 text-gray-900"
                            : "bg-gray-800 border-gray-600 text-gray-200"
                        }`}
                      />
                    </div>
                  </div>

                  {/* Action Buttons */}
                  {isEditing ? (
                    <div className="flex space-x-2">
                      <button
                        onClick={handleEditWorkingHour}
                        className={`flex-1 flex items-center justify-center py-2 px-3 rounded text-white text-sm transition-colors ${
                          theme === "light" ? "bg-sky-600 hover:bg-sky-700" : "bg-sky-700 hover:bg-sky-800"
                        }`}
                      >
                        <Save size={14} className="mr-1" /> Update
                      </button>
                      <button
                        onClick={resetForm}
                        className={`flex-1 flex items-center justify-center py-2 px-3 rounded text-white text-sm transition-colors ${
                          theme === "light" ? "bg-gray-400 hover:bg-gray-500" : "bg-gray-600 hover:bg-gray-700"
                        }`}
                      >
                        <X size={14} className="mr-1" /> Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={handleAddWorkingHour}
                      className={`w-full flex items-center justify-center py-2 px-3 rounded text-white text-sm transition-colors ${
                        theme === "light" ? "bg-sky-600 hover:bg-sky-700" : "bg-sky-700 hover:bg-sky-800"
                      }`}
                    >
                      <Plus size={14} className="mr-1" /> Add Working Hour
                    </button>
                  )}
                </div>

                {/* Quick Time Buttons */}
                <div className="space-y-2">
                  <h4
                    className={`text-xs font-medium ${
                      theme === "light" ? "text-gray-700" : "text-gray-300"
                    }`}
                  >
                    Quick Add
                  </h4>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { start: "09:00", end: "17:00" },
                      { start: "08:00", end: "16:00" },
                      { start: "10:00", end: "18:00" },
                      { start: "14:00", end: "22:00" },
                    ].map((time, idx) => (
                      <button
                        key={idx}
                        onClick={() =>
                          setNewWorkingHour({
                            ...newWorkingHour,
                            startTime: time.start,
                            endTime: time.end,
                          })
                        }
                        className={`px-2 py-1 text-xs rounded border transition-colors ${
                          theme === "light"
                            ? "border-gray-300 text-gray-600 hover:bg-gray-50"
                            : "border-gray-600 text-gray-400 hover:bg-gray-700"
                        }`}
                      >
                        {time.start} - {time.end}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Footer Actions */}
          <div
            className={`flex justify-end space-x-2 mt-6 pt-4 border-t ${
              theme === "light" ? "border-gray-200" : "border-gray-600"
            }`}
          >
            <button
              onClick={handleDone}
              className={`flex items-center px-4 py-2 rounded text-white text-sm transition-colors ${
                theme === "light" ? "bg-gray-400 hover:bg-gray-500" : "bg-gray-600 hover:bg-gray-700"
              }`}
            >
              <Save size={14} className="mr-1" /> Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkingHoursEditor;