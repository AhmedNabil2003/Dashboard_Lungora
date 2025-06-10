import { useState, useEffect } from "react";
import { Clock, Plus, Trash, Save, X, Edit } from "lucide-react";
import {
  getDoctorWorkingHours,
  createDoctorWorkingHours,
  removeDoctorWorkingHours,
  editDoctorWorkingHours,
  getWorkingHourById,
} from "../../services/apiDoctors";
import { toast } from "react-hot-toast";

const WorkingHoursEditor = ({ isOpen, onClose, doctor, theme }) => {
  const [workingHours, setWorkingHours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [newWorkingHour, setNewWorkingHour] = useState({
    doctorId: doctor?.id,
    dayOfWeek: "Monday",
    startTime: "09:00",
    endTime: "17:00",
  });

  const daysOfWeek = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  // Fetch working hours
  useEffect(() => {
    const fetchWorkingHours = async () => {
      if (!doctor?.id) return;

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

    if (isOpen) {
      fetchWorkingHours();
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
    // Validate the working hour
    if (workingHour.startTime >= workingHour.endTime) {
      toast.error("End time must be after start time");
      return false;
    }

    // Check for overlap with existing hours for the same day, excluding the current one being edited
    const sameDay = existingHours.filter(
      (hour) =>
        hour.dayOfWeek === workingHour.dayOfWeek &&
        (isEditing ? hour.id !== editingId : true)
    );

    const hasOverlap = sameDay.some((hour) => {
      return (
        (workingHour.startTime >= hour.startTime &&
          workingHour.startTime < hour.endTime) ||
        (workingHour.endTime > hour.startTime &&
          workingHour.endTime <= hour.endTime) ||
        (workingHour.startTime <= hour.startTime &&
          workingHour.endTime >= hour.endTime)
      );
    });

    if (hasOverlap) {
      toast.error("Working hours cannot overlap for the same day");
      return false;
    }

    return true;
  };

  const handleAddWorkingHour = async () => {
    try {
      if (!validateWorkingHour(newWorkingHour, workingHours)) {
        return;
      }

      const response = await createDoctorWorkingHours(newWorkingHour);
      setWorkingHours([...workingHours, response]);
      toast.success("Working hour added successfully");

      // Reset form
      resetForm();
    } catch (error) {
      console.error("Error adding working hour:", error);
      toast.error("Failed to add working hour");
    }
  };

  const handleEditWorkingHour = async () => {
    try {
      if (!validateWorkingHour(newWorkingHour, workingHours)) {
        return;
      }

      const response = await editDoctorWorkingHours(editingId, newWorkingHour);

      // Update the working hours list
      setWorkingHours(
        workingHours.map((hour) => (hour.id === editingId ? response : hour))
      );

      toast.success("Working hour updated successfully");

      // Reset form
      resetForm();
    } catch (error) {
      console.error("Error updating working hour:", error);
      toast.error("Failed to update working hour");
    }
  };

  const handleDeleteWorkingHour = async (id) => {
    try {
      await removeDoctorWorkingHours(id);
      setWorkingHours(workingHours.filter((hour) => hour.id !== id));

      // If deleting the one being edited, reset the form
      if (editingId === id) {
        resetForm();
      }

      toast.success("Working hour removed successfully");
    } catch (error) {
      console.error("Error deleting working hour:", error);
      toast.error("Failed to delete working hour");
    }
  };

  const handleStartEdit = async (id) => {
    try {
      const workingHour = await getWorkingHourById(id);
      if (workingHour) {
        setNewWorkingHour({
          doctorId: doctor?.id,
          dayOfWeek: workingHour.dayOfWeek,
          startTime: workingHour.startTime.substring(0, 5),
          endTime: workingHour.endTime.substring(0, 5),
        });
        setIsEditing(true);
        setEditingId(id);
      }
    } catch (error) {
      console.error("Error fetching working hour details:", error);
      toast.error("Failed to load working hour details");
    }
  };

  const handleCancelEdit = () => {
    resetForm();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewWorkingHour({ ...newWorkingHour, [name]: value });
  };

  return (
    <div className="fixed inset-0 flex justify-center items-center z-50 ">
      <div
        className={`p-3 rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto ${
          theme === "light" ? "bg-white" : "bg-gray-800"
        }`}
      >
        <div className="flex justify-between items-center mb-2.5">
          <h2
            className={`text-base font-bold flex items-center ${
              theme === "light" ? "text-sky-600" : "text-sky-300"
            }`}
          >
            <Clock
              className={`mr-1.5 h-4 w-4 ${
                theme === "light" ? "text-sky-500" : "text-sky-300"
              }`}
            />
            Working Hours for {doctor?.name}
          </h2>
          <button
            onClick={onClose}
            className={`${
              theme === "light"
                ? "text-gray-400 hover:text-gray-600"
                : "text-gray-500 hover:text-gray-300"
            }`}
          >
            <X size={16} />
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center py-6">
            <div
              className={`animate-spin rounded-full h-6 w-6 border-b-2 ${
                theme === "light" ? "border-sky-600" : "border-sky-300"
              }`}
            ></div>
          </div>
        ) : (
          <>
            {/* Current Working Hours */}
            <div className="mb-3">
              <h3
                className={`text-[10px] font-medium ${
                  theme === "light" ? "text-gray-700" : "text-gray-300"
                } mb-1.5`}
              >
                Current Schedule
              </h3>
              {workingHours.length === 0 ? (
                <p
                  className={`text-[9px] italic ${
                    theme === "light" ? "text-gray-500" : "text-gray-400"
                  }`}
                >
                  No working hours specified
                </p>
              ) : (
                <div
                  className={`rounded-md divide-y ${
                    theme === "light"
                      ? "bg-gray-50 divide-gray-100"
                      : "bg-gray-700 divide-gray-600"
                  }`}
                >
                  {workingHours
                    .sort((a, b) => {
                      // Sort by day of week first
                      const dayOrder =
                        daysOfWeek.indexOf(a.dayOfWeek) -
                        daysOfWeek.indexOf(b.dayOfWeek);
                      if (dayOrder !== 0) return dayOrder;
                      // Then by start time
                      return a.startTime.localeCompare(b.startTime);
                    })
                    .map((hour) => (
                      <div
                        key={hour.id}
                        className={`grid grid-cols-[1fr,auto] items-center p-1.5 ${
                          theme === "light"
                            ? "hover:bg-gray-100"
                            : "hover:bg-gray-600"
                        }`}
                      >
                        <div>
                          <span
                            className={`font-medium text-[10px] ${
                              theme === "light"
                                ? "text-sky-700"
                                : "text-sky-200"
                            }`}
                          >
                            {hour.dayOfWeek}
                          </span>
                          <div
                            className={`text-[9px] ${
                              theme === "light"
                                ? "text-gray-600"
                                : "text-gray-400"
                            }`}
                          >
                            {hour.startTime.substring(0, 5)} -{" "}
                            {hour.endTime.substring(0, 5)}
                          </div>
                        </div>
                        <div className="flex space-x-0.5">
                          <button
                            onClick={() => handleStartEdit(hour.id)}
                            className={`${
                              theme === "light"
                                ? "text-sky-500 hover:text-sky-700"
                                : "text-sky-300 hover:text-sky-400"
                            } p-0.5`}
                          >
                            <Edit size={14} />
                          </button>
                          <button
                            onClick={() => handleDeleteWorkingHour(hour.id)}
                            className={`${
                              theme === "light"
                                ? "text-red-500 hover:text-red-700"
                                : "text-red-300 hover:text-red-400"
                            } p-0.5`}
                          >
                            <Trash size={14} />
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>

            {/* Add/Edit Working Hour Form */}
            <div
              className={`border-t pt-3 ${
                theme === "light" ? "border-gray-200" : "border-gray-600"
              }`}
            >
              <h3
                className={`text-[10px] font-medium ${
                  theme === "light" ? "text-gray-700" : "text-gray-300"
                } mb-1.5`}
              >
                {isEditing ? "Edit Schedule" : "Add New Schedule"}
              </h3>
              <div className="space-y-2">
                <div>
                  <label
                    htmlFor="dayOfWeek"
                    className={`block text-[10px] font-medium ${
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
                    className={`mt-0.5 block w-full px-1.5 py-0.5 text-[10px] border rounded-md focus:outline-none focus:ring-1 focus:ring-sky-500 ${
                      theme === "light"
                        ? "bg-white border-gray-300"
                        : "bg-gray-800 border-gray-600 text-gray-200"
                    }`}
                  >
                    {daysOfWeek.map((day) => (
                      <option key={day} value={day}>
                        {day}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-1.5">
                  <div>
                    <label
                      htmlFor="startTime"
                      className={`block text-[10px] font-medium ${
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
                      className={`mt-0.5 block w-full px-1.5 py-0.5 text-[10px] border rounded-md focus:outline-none focus:ring-1 focus:ring-sky-500 ${
                        theme === "light"
                          ? "bg-white border-gray-300"
                          : "bg-gray-800 border-gray-600 text-gray-200"
                      }`}
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="endTime"
                      className={`block text-[10px] font-medium ${
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
                      className={`mt-0.5 block w-full px-1.5 py-0.5 text-[10px] border rounded-md focus:outline-none focus:ring-1 focus:ring-sky-500 ${
                        theme === "light"
                          ? "bg-white border-gray-300"
                          : "bg-gray-800 border-gray-600 text-gray-200"
                      }`}
                    />
                  </div>
                </div>

                {isEditing ? (
                  <div className="flex space-x-1.5">
                    <button
                      onClick={handleEditWorkingHour}
                      className={`flex-1 flex items-center justify-center ${
                        theme === "light"
                          ? "bg-sky-600 hover:bg-sky-700"
                          : "bg-sky-700 hover:bg-sky-800"
                      } text-white py-1.5 px-2 rounded-md transition duration-200 text-[10px]`}
                    >
                      <Save size={12} className="mr-1" /> Update
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      className={`flex-1 flex items-center justify-center ${
                        theme === "light"
                          ? "bg-gray-400 hover:bg-gray-500"
                          : "bg-gray-600 hover:bg-gray-700"
                      } text-white py-1.5 px-2 rounded-md transition duration-200 text-[10px]`}
                    >
                      <X size={12} className="mr-1" /> Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={handleAddWorkingHour}
                    className={`flex items-center justify-center w-full ${
                      theme === "light"
                        ? "bg-sky-600 hover:bg-sky-700"
                        : "bg-sky-700 hover:bg-sky-800"
                    } text-white py-1.5 px-2 rounded-md transition duration-200 text-[10px]`}
                  >
                    <Plus size={12} className="mr-1" /> Add Working Hour
                  </button>
                )}
              </div>
            </div>

            {/* Actions */}
            <div
              className={`flex justify-end mt-3 pt-2 border-t ${
                theme === "light" ? "border-gray-200" : "border-gray-600"
              }`}
            >
              <button
                onClick={onClose}
                className={`${
                  theme === "light"
                    ? "bg-gray-400 hover:bg-gray-500"
                    : "bg-gray-600 hover:bg-gray-700"
                } text-white px-2.5 py-1 rounded-md transition duration-200 flex items-center text-[10px]`}
              >
                <Save size={12} className="mr-1" /> Done
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default WorkingHoursEditor;