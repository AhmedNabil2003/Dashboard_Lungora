import { useState, useEffect } from "react"
import { Clock, Plus, Trash, Save, X, Edit } from "lucide-react"
import { 
  getDoctorWorkingHours, 
  createDoctorWorkingHours, 
  removeDoctorWorkingHours,
  editDoctorWorkingHours,
  getWorkingHourById
} from "../../services/apiDoctors"
import { toast } from "react-hot-toast"

const WorkingHoursEditor = ({ isOpen, onClose, doctor }) => {
  const [workingHours, setWorkingHours] = useState([])
  const [loading, setLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [newWorkingHour, setNewWorkingHour] = useState({
    doctorId: doctor?.id,
    dayOfWeek: "Monday",
    startTime: "09:00",
    endTime: "17:00",
  })

  const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]

  // Fetch working hours
  useEffect(() => {
    const fetchWorkingHours = async () => {
      if (!doctor?.id) return
      
      try {
        setLoading(true)
        const hours = await getDoctorWorkingHours(doctor.id)
        setWorkingHours(hours || [])
      } catch (error) {
        console.error("Error fetching working hours:", error)
        toast.error("Failed to load working hours")
      } finally {
        setLoading(false)
      }
    }

    if (isOpen) {
      fetchWorkingHours()
    }
  }, [doctor?.id, isOpen])

  if (!isOpen) return null

  const resetForm = () => {
    setNewWorkingHour({
      doctorId: doctor?.id,
      dayOfWeek: "Monday",
      startTime: "09:00",
      endTime: "17:00",
    })
    setIsEditing(false)
    setEditingId(null)
  }

  const validateWorkingHour = (workingHour, existingHours) => {
    // Validate the working hour
    if (workingHour.startTime >= workingHour.endTime) {
      toast.error("End time must be after start time")
      return false
    }

    // Check for overlap with existing hours for the same day, excluding the current one being edited
    const sameDay = existingHours.filter(hour => 
      hour.dayOfWeek === workingHour.dayOfWeek && 
      (isEditing ? hour.id !== editingId : true)
    )
    
    const hasOverlap = sameDay.some(hour => {
      return (
        (workingHour.startTime >= hour.startTime && workingHour.startTime < hour.endTime) ||
        (workingHour.endTime > hour.startTime && workingHour.endTime <= hour.endTime) ||
        (workingHour.startTime <= hour.startTime && workingHour.endTime >= hour.endTime)
      )
    })

    if (hasOverlap) {
      toast.error("Working hours cannot overlap for the same day")
      return false
    }

    return true
  }

  const handleAddWorkingHour = async () => {
    try {
      if (!validateWorkingHour(newWorkingHour, workingHours)) {
        return
      }

      const response = await createDoctorWorkingHours(newWorkingHour)
      setWorkingHours([...workingHours, response])
      toast.success("Working hour added successfully")

      // Reset form
      resetForm()
    } catch (error) {
      console.error("Error adding working hour:", error)
      toast.error("Failed to add working hour")
    }
  }

  const handleEditWorkingHour = async () => {
    try {
      if (!validateWorkingHour(newWorkingHour, workingHours)) {
        return
      }

      const response = await editDoctorWorkingHours(editingId, newWorkingHour)
      
      // Update the working hours list
      setWorkingHours(workingHours.map(hour => 
        hour.id === editingId ? response : hour
      ))
      
      toast.success("Working hour updated successfully")
      
      // Reset form
      resetForm()
    } catch (error) {
      console.error("Error updating working hour:", error)
      toast.error("Failed to update working hour")
    }
  }

  const handleDeleteWorkingHour = async (id) => {
    try {
      await removeDoctorWorkingHours(id)
      setWorkingHours(workingHours.filter(hour => hour.id !== id))
      
      // If deleting the one being edited, reset the form
      if (editingId === id) {
        resetForm()
      }
      
      toast.success("Working hour removed successfully")
    } catch (error) {
      console.error("Error deleting working hour:", error)
      toast.error("Failed to delete working hour")
    }
  }

  const handleStartEdit = async (id) => {
    try {
      const workingHour = await getWorkingHourById(id)
      if (workingHour) {
        setNewWorkingHour({
          doctorId: doctor?.id,
          dayOfWeek: workingHour.dayOfWeek,
          startTime: workingHour.startTime.substring(0, 5),
          endTime: workingHour.endTime.substring(0, 5),
        })
        setIsEditing(true)
        setEditingId(id)
      }
    } catch (error) {
      console.error("Error fetching working hour details:", error)
      toast.error("Failed to load working hour details")
    }
  }

  const handleCancelEdit = () => {
    resetForm()
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setNewWorkingHour({ ...newWorkingHour, [name]: value })
  }

  return (
    <div className="fixed inset-0 flex justify-center items-center z-50">
      <div className="bg-white p-4 rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold text-sky-700 flex items-center">
            <Clock className="mr-2 h-5 w-5" /> Working Hours for {doctor?.name}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={20} />
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sky-600"></div>
          </div>
        ) : (
          <>
            {/* Current Working Hours */}
            <div className="mb-4">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Current Schedule</h3>
              {workingHours.length === 0 ? (
                <p className="text-sm text-gray-500 italic">No working hours specified</p>
              ) : (
                <div className="bg-gray-50 rounded-md divide-y divide-gray-100">
                  {workingHours
                    .sort((a, b) => {
                      // Sort by day of week first
                      const dayOrder = daysOfWeek.indexOf(a.dayOfWeek) - daysOfWeek.indexOf(b.dayOfWeek)
                      if (dayOrder !== 0) return dayOrder
                      // Then by start time
                      return a.startTime.localeCompare(b.startTime)
                    })
                    .map((hour) => (
                      <div key={hour.id} className="flex justify-between items-center p-2 hover:bg-gray-100">
                        <div>
                          <span className="font-medium text-sm text-sky-700">{hour.dayOfWeek}</span>
                          <div className="text-xs text-gray-600">
                            {hour.startTime.substring(0, 5)} - {hour.endTime.substring(0, 5)}
                          </div>
                        </div>
                        <div className="flex space-x-1">
                          <button
                            onClick={() => handleStartEdit(hour.id)}
                            className="text-sky-500 hover:text-sky-700 p-1"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => handleDeleteWorkingHour(hour.id)}
                            className="text-red-500 hover:text-red-700 p-1"
                          >
                            <Trash size={16} />
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>

            {/* Add/Edit Working Hour Form */}
            <div className="border-t pt-4">
              <h3 className="text-sm font-medium text-gray-700 mb-2">
                {isEditing ? "Edit Schedule" : "Add New Schedule"}
              </h3>
              <div className="space-y-3">
                <div>
                  <label htmlFor="dayOfWeek" className="block text-xs font-medium text-gray-700">
                    Day of Week
                  </label>
                  <select
                    id="dayOfWeek"
                    name="dayOfWeek"
                    value={newWorkingHour.dayOfWeek}
                    onChange={handleChange}
                    className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500 text-sm"
                  >
                    {daysOfWeek.map((day) => (
                      <option key={day} value={day}>
                        {day}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="startTime" className="block text-xs font-medium text-gray-700">
                      Start Time
                    </label>
                    <input
                      type="time"
                      id="startTime"
                      name="startTime"
                      value={newWorkingHour.startTime}
                      onChange={handleChange}
                      className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500 text-sm"
                    />
                  </div>
                  <div>
                    <label htmlFor="endTime" className="block text-xs font-medium text-gray-700">
                      End Time
                    </label>
                    <input
                      type="time"
                      id="endTime"
                      name="endTime"
                      value={newWorkingHour.endTime}
                      onChange={handleChange}
                      className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500 text-sm"
                    />
                  </div>
                </div>

                {isEditing ? (
                  <div className="flex space-x-2">
                    <button
                      onClick={handleEditWorkingHour}
                      className="flex-1 flex items-center justify-center bg-sky-600 hover:bg-sky-700 text-white py-2 px-4 rounded-md transition duration-200"
                    >
                      <Save size={16} className="mr-1" /> Update
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      className="flex-1 flex items-center justify-center bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded-md transition duration-200"
                    >
                      <X size={16} className="mr-1" /> Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={handleAddWorkingHour}
                    className="flex items-center justify-center w-full bg-sky-600 hover:bg-sky-700 text-white py-2 px-4 rounded-md transition duration-200"
                  >
                    <Plus size={16} className="mr-1" /> Add Working Hour
                  </button>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end mt-4 pt-3 border-t border-gray-200">
              <button
                onClick={onClose}
                className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition duration-200 flex items-center text-sm"
              >
                <Save size={16} className="mr-1" /> Done
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default WorkingHoursEditor