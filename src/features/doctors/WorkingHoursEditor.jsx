import { useState, useEffect } from "react";
import { Clock, Plus, Trash, Save, X, Edit } from "lucide-react";
import { getDoctorWorkingHours, removeDoctorWorkingHours, editDoctorWorkingHours, createDoctorWorkingHours, getWorkingHourById } from "../../services/apiDoctors";
import { toast } from "react-hot-toast";

const WorkingHoursEditor = ({ isOpen, onClose, doctor, theme, initialWorkingHours }) => {
  const [workingHours, setWorkingHours] = useState(initialWorkingHours || []);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [newWorkingHour, setNewWorkingHour] = useState({
    doctorId: doctor?.id,
    dayOfWeek: "Monday",
    startTime: "09:00",
    endTime: "17:00",
  });

  const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

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
        setWorkingHours(hours || []);
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
      dayOfWeek: "Monday",
      startTime: "09:00",
      endTime: "17:00",
    });
    setIsEditing(false);
    setEditingId(null);
  };

  const validateWorkingHour = (workingHour, existingHours) => {
    if (workingHour.startTime >= workingHour.endTime) {
      toast.error("End time must be after start time");
      return false;
    }

    const sameDay = existingHours.filter(
      (hour) => hour.dayOfWeek === workingHour.dayOfWeek && (isEditing ? hour.id !== editingId : true),
    );

    const hasOverlap = sameDay.some((hour) => {
      return (
        (workingHour.startTime >= hour.startTime && workingHour.startTime < hour.endTime) ||
        (workingHour.endTime > hour.startTime && workingHour.endTime <= hour.endTime) ||
        (workingHour.startTime <= hour.startTime && workingHour.endTime >= hour.endTime)
      );
    });

    if (hasOverlap) {
      toast.error("Working hours cannot overlap for the same day");
      return false;
    }

    return true;
  };

  const handleAddWorkingHour = async () => {
    if (!validateWorkingHour(newWorkingHour, workingHours)) {
      return;
    }

    if (doctor?.id) {
      console.log("Doctor ID:", doctor.id);
      try {
        const response = await createDoctorWorkingHours({
          ...newWorkingHour,
          doctorId: doctor.id,
        });
        setWorkingHours([...workingHours, response]);
        toast.success("Working hour added successfully");
      } catch (error) {
        console.error("Error adding working hour:", error);
        toast.error("Failed to add working hour");
      }
    } else {
      const newHour = { ...newWorkingHour, id: Date.now().toString() };
      setWorkingHours([...workingHours, newHour]);
      toast.success("Working hour added to form");
    }

    resetForm();
  };

const handleEditWorkingHour = async () => {
  if (!validateWorkingHour(newWorkingHour, workingHours)) {
    return;
  }
  if (doctor?.id) {
    console.log("Doctor ID:", doctor.id, "Editing ID:", editingId);
    console.log("newWorkingHour:", newWorkingHour);
    try {
      if (!newWorkingHour.dayOfWeek) {
        toast.error("Please select a day of the week");
        return;
      }
      if (!newWorkingHour.startTime || !newWorkingHour.endTime) {
        toast.error("Please select start and end times");
        return;
      }
      // Normalize time format to HH:mm
      const normalizedStartTime = newWorkingHour.startTime.split(":").slice(0, 2).join(":");
      const normalizedEndTime = newWorkingHour.endTime.split(":").slice(0, 2).join(":");
      const response = await editDoctorWorkingHours(editingId, {
        doctorId: doctor.id,
        dayOfWeek: newWorkingHour.dayOfWeek,
        startTime: normalizedStartTime,
        endTime: normalizedEndTime,
      });
      setWorkingHours(workingHours.map((hour) => (hour.id === editingId ? response : hour)));
      toast.success("Working hour updated successfully");
    } catch (error) {
      console.error("Error updating working hour:", error);
      toast.error("Failed to update working hour");
    }
  } else {
    setWorkingHours(
      workingHours.map((hour) => (hour.id === editingId ? { ...newWorkingHour, id: editingId } : hour)),
    );
    toast.success("Working hour updated in form");
  }
  resetForm();
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
      const workingHour = await getWorkingHourById(id);
      if (workingHour) {
        setNewWorkingHour({
          doctorId: doctor?.id,
          dayOfWeek: workingHour.dayOfWeek,
          startTime: workingHour.startTime,
          endTime: workingHour.endTime,
        });
        setIsEditing(true);
        setEditingId(id);
      }
    } catch (error) {
      console.error("Error fetching working hour for edit:", error);
      toast.error("Failed to load working hour for editing");
    }
  };

  const handleCancelEdit = () => {
    resetForm();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewWorkingHour({ ...newWorkingHour, [name]: value });
  };

  const handleDone = () => {
    onClose(workingHours);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/30 p-2 sm:p-4">
      <div
        className={`rounded-lg shadow-xl w-full max-w-3xl max-h-[85vh] ${
          theme === "light" ? "bg-white" : "bg-gray-800"
        }`}
      >
        {/* Modal Header */}
        <div
          className={`flex justify-between items-center p-4 border-b ${
            theme === "light" ? "bg-white border-gray-200" : "bg-gray-800 border-gray-600"
          }`}
        >
          <h2 className={`text-xl font-bold flex items-center ${theme === "light" ? "text-sky-600" : "text-sky-300"}`}>
            <Clock className={`mr-2 h-5 w-5 ${theme === "light" ? "text-sky-500" : "text-sky-300"}`} />
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
                <h3 className={`text-sm font-medium ${theme === "light" ? "text-gray-700" : "text-gray-300"}`}>
                  Current Schedule
                </h3>
                {workingHours.length === 0 ? (
                  <div
                    className={`text-center py-6 rounded border-2 border-dashed ${
                      theme === "light" ? "border-gray-300 text-gray-500" : "border-gray-600 text-gray-400"
                    }`}
                  >
                    <Clock
                      className={`w-8 h-8 mx-auto mb-2 ${theme === "light" ? "text-gray-400" : "text-gray-500"}`}
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
                      .sort((a, b) => {
                        const dayOrder = daysOfWeek.indexOf(a.dayOfWeek) - daysOfWeek.indexOf(b.dayOfWeek);
                        if (dayOrder !== 0) return dayOrder;
                        return a.startTime.localeCompare(b.startTime);
                      })
                      .map((hour) => (
                        <div
                          key={hour.id}
                          className={`flex items-center justify-between p-3 border-b last:border-b-0 ${
                            theme === "light" ? "border-gray-200 hover:bg-gray-50" : "border-gray-600 hover:bg-gray-700"
                          }`}
                        >
                          <div className="flex-1">
                            <div
                              className={`font-medium text-sm ${theme === "light" ? "text-sky-700" : "text-sky-200"}`}
                            >
                              {hour.dayOfWeek}
                            </div>
                            <div className={`text-xs ${theme === "light" ? "text-gray-600" : "text-gray-400"}`}>
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
                <h3 className={`text-sm font-medium ${theme === "light" ? "text-gray-700" : "text-gray-300"}`}>
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
                        theme === "light" ? "bg-white border-gray-300" : "bg-gray-800 border-gray-600 text-gray-200"
                      }`}
                    >
                      {daysOfWeek.map((day) => (
                        <option key={day} value={day}>
                          {day}
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
                          theme === "light" ? "bg-white border-gray-300" : "bg-gray-800 border-gray-600 text-gray-200"
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
                          theme === "light" ? "bg-white border-gray-300" : "bg-gray-800 border-gray-600 text-gray-200"
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
                        onClick={handleCancelEdit}
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

                {/* Quick Add Buttons */}
                <div className="space-y-2">
                  <h4 className={`text-xs font-medium ${theme === "light" ? "text-gray-700" : "text-gray-300"}`}>
                    Quick Add
                  </h4>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => {
                        setNewWorkingHour({
                          ...newWorkingHour,
                          startTime: "09:00",
                          endTime: "17:00",
                        });
                      }}
                      className={`px-2 py-1 text-xs rounded border transition-colors ${
                        theme === "light"
                          ? "border-gray-300 text-gray-600 hover:bg-gray-50"
                          : "border-gray-600 text-gray-400 hover:bg-gray-700"
                      }`}
                    >
                      9 AM - 5 PM
                    </button>
                    <button
                      onClick={() => {
                        setNewWorkingHour({
                          ...newWorkingHour,
                          startTime: "08:00",
                          endTime: "16:00",
                        });
                      }}
                      className={`px-2 py-1 text-xs rounded border transition-colors ${
                        theme === "light"
                          ? "border-gray-300 text-gray-600 hover:bg-gray-50"
                          : "border-gray-600 text-gray-400 hover:bg-gray-700"
                      }`}
                    >
                      8 AM - 4 PM
                    </button>
                    <button
                      onClick={() => {
                        setNewWorkingHour({
                          ...newWorkingHour,
                          startTime: "10:00",
                          endTime: "18:00",
                        });
                      }}
                      className={`px-2 py-1 text-xs rounded border transition-colors ${
                        theme === "light"
                          ? "border-gray-300 text-gray-600 hover:bg-gray-50"
                          : "border-gray-600 text-gray-400 hover:bg-gray-700"
                      }`}
                    >
                      10 AM - 6 PM
                    </button>
                    <button
                      onClick={() => {
                        setNewWorkingHour({
                          ...newWorkingHour,
                          startTime: "14:00",
                          endTime: "22:00",
                        });
                      }}
                      className={`px-2 py-1 text-xs rounded border transition-colors ${
                        theme === "light"
                          ? "border-gray-300 text-gray-600 hover:bg-gray-50"
                          : "border-gray-600 text-gray-400 hover:bg-gray-700"
                      }`}
                    >
                      2 PM - 10 PM
                    </button>
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
              className={`flex items-center space-x-1 px-4 py-2 rounded text-white text-sm transition-colors ${
                theme === "light" ? "bg-gray-400 hover:bg-gray-500" : "bg-gray-600 hover:bg-gray-700"
              }`}
            >
              <Save size={14} />
              <span>Done</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkingHoursEditor;