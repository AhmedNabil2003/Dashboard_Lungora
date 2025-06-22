import { useState, useEffect } from "react";
import { Clock, Plus, Trash, Save, X, Edit } from "lucide-react";
import { getDoctorWorkingHours, removeDoctorWorkingHours, editDoctorWorkingHours } from "../../services/apiDoctors";
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

  const daysOfWeek = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

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
    if (!validateWorkingHour(newWorkingHour, workingHours)) {
      return;
    }

    const newHour = { ...newWorkingHour, id: Date.now().toString() };
    setWorkingHours([...workingHours, newHour]);
    toast.success("Working hour added to form");
    resetForm();
  };

  const handleEditWorkingHour = async () => {
    if (!validateWorkingHour(newWorkingHour, workingHours)) {
      return;
    }

    if (doctor?.id) {
      try {
        const response = await editDoctorWorkingHours(editingId, newWorkingHour);
        setWorkingHours(
          workingHours.map((hour) => (hour.id === editingId ? response : hour))
        );
        toast.success("Working hour updated successfully");
      } catch (error) {
        console.error("Error updating working hour:", error);
        toast.error("Failed to update working hour");
      }
    } else {
      setWorkingHours(
        workingHours.map((hour) =>
          hour.id === editingId ? { ...newWorkingHour, id: editingId } : hour
        )
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

  const handleStartEdit = (id) => {
    const workingHour = workingHours.find((hour) => hour.id === id);
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
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/30 p-4 sm:p-6">
      <div
        className={`p-4 sm:p-6 rounded-lg shadow-xl w-full max-w-md sm:max-w-lg max-h-[90vh] overflow-y-auto ${
          theme === "light" ? "bg-white" : "bg-gray-800"
        }`}
      >
        <div className="flex justify-between items-center mb-4">
          <h2
            className={`text-base sm:text-lg font-bold flex items-center ${
              theme === "light" ? "text-sky-600" : "text-sky-300"
            }`}
          >
            <Clock
              className={`mr-2 h-4 w-4 sm:h-5 sm:w-5 ${
                theme === "light" ? "text-sky-500" : "text-sky-300"
              }`}
            />
            Working Hours for {doctor?.name || "New Doctor"}
          </h2>
          <button
            onClick={handleDone}
            className={`${
              theme === "light"
                ? "text-gray-400 hover:text-gray-600"
                : "text-gray-500 hover:text-gray-300"
            }`}
          >
            <X size={16} className="sm:w-5 sm:h-5" />
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center py-6">
            <div
              className={`animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-b-2 ${
                theme === "light" ? "border-sky-600" : "border-sky-300"
              }`}
            ></div>
          </div>
        ) : (
          <>
            {/* Current Working Hours */}
            <div className="mb-4">
              <h3
                className={`text-sm sm:text-base font-medium ${
                  theme === "light" ? "text-gray-700" : "text-gray-300"
                } mb-2`}
              >
                Current Schedule
              </h3>
              {workingHours.length === 0 ? (
                <p
                  className={`text-xs sm:text-sm italic ${
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
                      const dayOrder =
                        daysOfWeek.indexOf(a.dayOfWeek) -
                        daysOfWeek.indexOf(b.dayOfWeek);
                      if (dayOrder !== 0) return dayOrder;
                      return a.startTime.localeCompare(b.startTime);
                    })
                    .map((hour) => (
                      <div
                        key={hour.id}
                        className={`grid grid-cols-[1fr,auto] items-center p-2 sm:p-3 ${
                          theme === "light"
                            ? "hover:bg-gray-100"
                            : "hover:bg-gray-600"
                        }`}
                      >
                        <div>
                          <span
                            className={`font-medium text-sm sm:text-base ${
                              theme === "light"
                                ? "text-sky-700"
                                : "text-sky-200"
                            }`}
                          >
                            {hour.dayOfWeek}
                          </span>
                          <div
                            className={`text-xs sm:text-sm ${
                              theme === "light"
                                ? "text-gray-600"
                                : "text-gray-400"
                            }`}
                          >
                            {hour.startTime.substring(0, 5)} -{" "}
                            {hour.endTime.substring(0, 5)}
                          </div>
                        </div>
                        <div className="flex space-x-1 sm:space-x-2">
                          <button
                            onClick={() => handleStartEdit(hour.id)}
                            className={`${
                              theme === "light"
                                ? "text-sky-500 hover:text-sky-700"
                                : "text-sky-300 hover:text-sky-400"
                            } p-1`}
                          >
                            <Edit size={14} className="sm:w-5 sm:h-5" />
                          </button>
                          <button
                            onClick={() => handleDeleteWorkingHour(hour.id)}
                            className={`${
                              theme === "light"
                                ? "text-red-500 hover:text-red-700"
                                : "text-red-300 hover:text-red-400"
                            } p-1`}
                          >
                            <Trash size={14} className="sm:w-5 sm:h-5" />
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>

            {/* Add/Edit Working Hour Form */}
            <div
              className={`border-t pt-4 ${
                theme === "light" ? "border-gray-200" : "border-gray-600"
              }`}
            >
              <h3
                className={`text-sm sm:text-base font-medium ${
                  theme === "light" ? "text-gray-700" : "text-gray-300"
                } mb-2`}
              >
                {isEditing ? "Edit Schedule" : "Add New Schedule"}
              </h3>
              <div className="space-y-3">
                <div>
                  <label
                    htmlFor="dayOfWeek"
                    className={`block text-xs sm:text-sm font-medium ${
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
                    className={`mt-1 block w-full px-2 py-1.5 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 ${
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

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label
                      htmlFor="startTime"
                      className={`block text-xs sm:text-sm font-medium ${
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
                      className={`mt-1 block w-full px-2 py-1.5 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 ${
                        theme === "light"
                          ? "bg-white border-gray-300"
                          : "bg-gray-800 border-gray-600 text-gray-200"
                      }`}
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="endTime"
                      className={`block text-xs sm:text-sm font-medium ${
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
                      className={`mt-1 block w-full px-2 py-1.5 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 ${
                        theme === "light"
                          ? "bg-white border-gray-300"
                          : "bg-gray-800 border-gray-600 text-gray-200"
                      }`}
                    />
                  </div>
                </div>

                {isEditing ? (
                  <div className="flex space-x-2">
                    <button
                      onClick={handleEditWorkingHour}
                      className={`flex-1 flex items-center justify-center ${
                        theme === "light"
                          ? "bg-sky-600 hover:bg-sky-700"
                          : "bg-sky-700 hover:bg-sky-800"
                      } text-white py-1.5 px-3 rounded-md transition-colors text-sm`}
                    >
                      <Save size={14} className="mr-1 sm:w-5 sm:h-5" /> Update
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      className={`flex-1 flex items-center justify-center ${
                        theme === "light"
                          ? "bg-gray-400 hover:bg-gray-500"
                          : "bg-gray-600 hover:bg-gray-700"
                      } text-white py-1.5 px-3 rounded-md transition-colors text-sm`}
                    >
                      <X size={14} className="mr-1 sm:w-5 sm:h-5" /> Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={handleAddWorkingHour}
                    className={`flex items-center justify-center w-full ${
                      theme === "light"
                        ? "bg-sky-600 hover:bg-sky-700"
                        : "bg-sky-700 hover:bg-sky-800"
                      } text-white py-1.5 px-3 rounded-md transition-colors text-sm`}
                  >
                    <Plus size={14} className="mr-1 sm:w-5 sm:h-5" /> Add Working Hour
                  </button>
                )}
              </div>
            </div>

            {/* Actions */}
            <div
              className={`flex justify-end mt-4 pt-3 border-t ${
                theme === "light" ? "border-gray-200" : "border-gray-600"
              }`}
            >
              <button
                onClick={handleDone}
                className={`${
                  theme === "light"
                    ? "bg-gray-400 hover:bg-gray-500"
                    : "bg-gray-600 hover:bg-gray-700"
                } text-white px-3 py-1.5 rounded-md transition-colors flex items-center text-sm`}
              >
                <Save size={14} className="mr-1 sm:w-5 sm:h-5" /> Done
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default WorkingHoursEditor;