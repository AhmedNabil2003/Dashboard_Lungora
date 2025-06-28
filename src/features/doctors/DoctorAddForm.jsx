import { useState, useEffect } from "react"
import { MapPin, Clock, AlertCircle, Plus, Trash, Edit, Save, X } from "lucide-react"
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet"
import L from "leaflet"
import "leaflet/dist/leaflet.css"

// Custom marker icon setup
const createCustomIcon = () => {
  return L.icon({
    iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
    iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
    shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  })
}

// Location picker component within the map
const LocationPicker = ({ onLocationSelect, initialPosition }) => {
  const map = useMapEvents({
    click: (e) => {
      const { lat, lng } = e.latlng
      onLocationSelect(lat, lng)
      map.flyTo([lat, lng], map.getZoom())
    },
  })

  useEffect(() => {
    if (initialPosition) {
      map.flyTo(initialPosition, map.getZoom())
    }
  }, [initialPosition, map])

  return null
}

// Working Hours Component
const WorkingHoursSection = ({ workingHours, setWorkingHours, theme, isFormDisabled }) => {
  const [isEditing, setIsEditing] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [newWorkingHour, setNewWorkingHour] = useState({
    dayOfWeek: 1, // Default to Monday
    startTime: "09:00",
    endTime: "17:00",
  })

  // Map day names to integers (0=Sunday, 1=Monday, ..., 6=Saturday)
  const daysOfWeek = [
    { name: "Sunday", value: 0 },
    { name: "Monday", value: 1 },
    { name: "Tuesday", value: 2 },
    { name: "Wednesday", value: 3 },
    { name: "Thursday", value: 4 },
    { name: "Friday", value: 5 },
    { name: "Saturday", value: 6 },
  ]

  // Convert time string (HH:mm:ss) to (HH:mm) for input fields
  const formatTimeForInput = (timeStr) => {
    if (!timeStr) return "00:00"
    const parts = timeStr.split(":")
    return `${parts[0]}:${parts[1]}`
  }

  // Convert time input (HH:mm) to (HH:mm:ss) for API
  const formatTimeForAPI = (timeStr) => {
    if (!timeStr) return "00:00:00"
    const parts = timeStr.split(":")
    return `${parts[0]}:${parts[1]}:00`
  }

  const resetForm = () => {
    setNewWorkingHour({
      dayOfWeek: 1, // Default to Monday
      startTime: "09:00",
      endTime: "17:00",
    })
    setIsEditing(false)
    setEditingId(null)
  }

  const validateWorkingHour = (workingHour, existingHours) => {
    // Convert times to Date objects for comparison
    const start = new Date(`1970-01-01T${workingHour.startTime}:00Z`)
    const end = new Date(`1970-01-01T${workingHour.endTime}:00Z`)

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return "Invalid time values"
    }

    // Ensure endTime is at least 1 minute later than startTime
    if (end - start <= 0) {
      return "End time must be later than start time"
    }

    const sameDay = existingHours.filter(
      (hour) => hour.dayOfWeek === workingHour.dayOfWeek && (isEditing ? hour.id !== editingId : true),
    )

    const hasOverlap = sameDay.some((hour) => {
      const hourStart = new Date(`1970-01-01T${hour.startTime}:00Z`)
      const hourEnd = new Date(`1970-01-01T${hour.endTime}:00Z`)

      return (
        (start >= hourStart && start < hourEnd) ||
        (end > hourStart && end <= hourEnd) ||
        (start <= hourStart && end >= hourEnd)
      )
    })

    if (hasOverlap) {
      return "Working hours cannot overlap for the same day"
    }

    return null
  }

  const handleAddWorkingHour = () => {
    const error = validateWorkingHour(newWorkingHour, workingHours)
    if (error) {
      alert(error)
      return
    }

    const newHour = {
      ...newWorkingHour,
      id: Date.now().toString(),
      startTime: formatTimeForAPI(newWorkingHour.startTime),
      endTime: formatTimeForAPI(newWorkingHour.endTime),
    }

    setWorkingHours([...workingHours, newHour])
    resetForm()
  }

  const handleEditWorkingHour = () => {
    const error = validateWorkingHour(newWorkingHour, workingHours)
    if (error) {
      alert(error)
      return
    }

    setWorkingHours(
      workingHours.map((hour) =>
        hour.id === editingId
          ? {
              ...newWorkingHour,
              id: editingId,
              startTime: formatTimeForAPI(newWorkingHour.startTime),
              endTime: formatTimeForAPI(newWorkingHour.endTime),
            }
          : hour,
      ),
    )
    resetForm()
  }

  const handleDeleteWorkingHour = (id) => {
    setWorkingHours(workingHours.filter((hour) => hour.id !== id))
    if (editingId === id) {
      resetForm()
    }
  }

  const handleStartEdit = (id) => {
    const hour = workingHours.find((h) => h.id === id)
    if (hour) {
      setNewWorkingHour({
        dayOfWeek: hour.dayOfWeek,
        startTime: formatTimeForInput(hour.startTime),
        endTime: formatTimeForInput(hour.endTime),
      })
      setIsEditing(true)
      setEditingId(id)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setNewWorkingHour({
      ...newWorkingHour,
      [name]: name === "dayOfWeek" ? Number.parseInt(value, 10) : value,
    })
  }

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Left Column - Current Working Hours */}
        <div className="space-y-2">
          <h4 className={`text-sm font-medium ${theme === "light" ? "text-gray-700" : "text-gray-300"}`}>
            Current Schedule
          </h4>
          {workingHours.length === 0 ? (
            <div
              className={`text-center py-4 rounded border-2 border-dashed ${
                theme === "light" ? "border-gray-300 text-gray-500" : "border-gray-600 text-gray-400"
              }`}
            >
              <Clock className={`mx-auto mb-2 h-6 w-6 ${theme === "light" ? "text-gray-400" : "text-gray-500"}`} />
              <p className="text-xs">No working hours specified</p>
            </div>
          ) : (
            <div
              className={`rounded border max-h-48 overflow-y-auto ${
                theme === "light" ? "border-gray-200" : "border-gray-600"
              }`}
            >
              {workingHours
                .sort((a, b) => a.dayOfWeek - b.dayOfWeek || a.startTime.localeCompare(b.startTime))
                .map((hour) => (
                  <div
                    key={hour.id}
                    className={`flex items-center justify-between p-2 border-b last:border-b-0 ${
                      theme === "light" ? "border-gray-200 hover:bg-gray-50" : "border-gray-600 hover:bg-gray-700"
                    }`}
                  >
                    <div>
                      <div className={`text-sm font-medium ${theme === "light" ? "text-sky-700" : "text-sky-200"}`}>
                        {daysOfWeek.find((day) => day.value === hour.dayOfWeek)?.name}
                      </div>
                      <div className={`text-xs ${theme === "light" ? "text-gray-600" : "text-gray-400"}`}>
                        {formatTimeForInput(hour.startTime)} - {formatTimeForInput(hour.endTime)}
                      </div>
                    </div>
                    <div className="flex space-x-1">
                      <button
                        type="button"
                        onClick={() => handleStartEdit(hour.id)}
                        disabled={isFormDisabled}
                        className={`p-1 rounded transition-colors ${
                          theme === "light"
                            ? "text-sky-500 hover:text-sky-700 hover:bg-sky-50"
                            : "text-sky-300 hover:text-sky-400 hover:bg-sky-900"
                        } ${isFormDisabled ? "opacity-50 cursor-not-allowed" : ""}`}
                        title="Edit"
                      >
                        <Edit size={12} />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteWorkingHour(hour.id)}
                        disabled={isFormDisabled}
                        className={`p-1 rounded transition-colors ${
                          theme === "light"
                            ? "text-red-500 hover:text-red-700 hover:bg-red-50"
                            : "text-red-300 hover:text-red-400 hover:bg-red-900"
                        } ${isFormDisabled ? "opacity-50 cursor-not-allowed" : ""}`}
                        title="Delete"
                      >
                        <Trash size={12} />
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>

        {/* Right Column - Add/Edit Form */}
        <div className="space-y-3">
          <h4 className={`text-sm font-medium ${theme === "light" ? "text-gray-700" : "text-gray-300"}`}>
            {isEditing ? "Edit Schedule" : "Add New Schedule"}
          </h4>
          <div className="space-y-2">
            {/* Day Selection */}
            <div>
              <label
                htmlFor="dayOfWeek"
                className={`block text-xs font-medium mb-1 ${theme === "light" ? "text-gray-700" : "text-gray-300"}`}
              >
                Day of Week
              </label>
              <select
                id="dayOfWeek"
                name="dayOfWeek"
                value={newWorkingHour.dayOfWeek}
                onChange={handleChange}
                disabled={isFormDisabled}
                className={`w-full px-2 py-1 text-sm border rounded focus:outline-none focus:ring-1 focus:ring-sky-500 ${
                  theme === "light"
                    ? "bg-white border-gray-300 text-gray-900"
                    : "bg-gray-800 border-gray-600 text-gray-200"
                } ${isFormDisabled ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                {daysOfWeek.map((day) => (
                  <option key={day.value} value={day.value}>
                    {day.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Time Selection */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label
                  htmlFor="startTime"
                  className={`block text-xs font-medium mb-1 ${theme === "light" ? "text-gray-700" : "text-gray-300"}`}
                >
                  Start Time
                </label>
                <input
                  type="time"
                  id="startTime"
                  name="startTime"
                  value={newWorkingHour.startTime}
                  onChange={handleChange}
                  disabled={isFormDisabled}
                  className={`w-full px-2 py-1 text-sm border rounded focus:outline-none focus:ring-1 focus:ring-sky-500 ${
                    theme === "light"
                      ? "bg-white border-gray-300 text-gray-900"
                      : "bg-gray-800 border-gray-600 text-gray-200"
                  } ${isFormDisabled ? "opacity-50 cursor-not-allowed" : ""}`}
                />
              </div>
              <div>
                <label
                  htmlFor="endTime"
                  className={`block text-xs font-medium mb-1 ${theme === "light" ? "text-gray-700" : "text-gray-300"}`}
                >
                  End Time
                </label>
                <input
                  type="time"
                  id="endTime"
                  name="endTime"
                  value={newWorkingHour.endTime}
                  onChange={handleChange}
                  disabled={isFormDisabled}
                  className={`w-full px-2 py-1 text-sm border rounded focus:outline-none focus:ring-1 focus:ring-sky-500 ${
                    theme === "light"
                      ? "bg-white border-gray-300 text-gray-900"
                      : "bg-gray-800 border-gray-600 text-gray-200"
                  } ${isFormDisabled ? "opacity-50 cursor-not-allowed" : ""}`}
                />
              </div>
            </div>

            {/* Action Buttons */}
            {isEditing ? (
              <div className="flex space-x-2">
                <button
                  type="button"
                  onClick={handleEditWorkingHour}
                  disabled={isFormDisabled}
                  className={`flex-1 flex items-center justify-center py-1 px-2 rounded text-white text-sm transition-colors ${
                    theme === "light" ? "bg-sky-600 hover:bg-sky-700" : "bg-sky-700 hover:bg-sky-800"
                  } ${isFormDisabled ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  <Save size={12} className="mr-1" /> Update
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  disabled={isFormDisabled}
                  className={`flex-1 flex items-center justify-center py-1 px-2 rounded text-white text-sm transition-colors ${
                    theme === "light" ? "bg-gray-400 hover:bg-gray-500" : "bg-gray-600 hover:bg-gray-700"
                  } ${isFormDisabled ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  <X size={12} className="mr-1" /> Cancel
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={handleAddWorkingHour}
                disabled={isFormDisabled}
                className={`w-full flex items-center justify-center py-1 px-2 rounded text-white text-sm transition-colors ${
                  theme === "light" ? "bg-sky-600 hover:bg-sky-700" : "bg-sky-700 hover:bg-sky-800"
                } ${isFormDisabled ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                <Plus size={12} className="mr-1" /> Add Working Hour
              </button>
            )}
          </div>

          {/* Quick Time Buttons */}
          <div className="space-y-2">
            <h5 className={`text-xs font-medium ${theme === "light" ? "text-gray-700" : "text-gray-300"}`}>
              Quick Add
            </h5>
            <div className="grid grid-cols-2 gap-1">
              {[
                { start: "09:00", end: "17:00" },
                { start: "08:00", end: "16:00" },
                { start: "10:00", end: "18:00" },
                { start: "14:00", end: "22:00" },
              ].map((time, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() =>
                    setNewWorkingHour({
                      ...newWorkingHour,
                      startTime: time.start,
                      endTime: time.end,
                    })
                  }
                  disabled={isFormDisabled}
                  className={`px-2 py-1 text-xs rounded border transition-colors ${
                    theme === "light"
                      ? "border-gray-300 text-gray-600 hover:bg-gray-50"
                      : "border-gray-600 text-gray-400 hover:bg-gray-700"
                  } ${isFormDisabled ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  {time.start} - {time.end}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const DoctorForm = ({ isOpen, onClose, onSave, title, doctor, categories, theme, isSubmitting = false }) => {
  const [formData, setFormData] = useState({
    name: "",
    emailDoctor: "",
    phone: "",
    teliphone: "",
    experianceYears: 0,
    numOfPatients: 0,
    location: "",
    about: "",
    whatsAppLink: "",
    locationLink: "",
    imageDoctor: null,
    latitude: 30.0444,
    longitude: 31.2357,
    categoryId: "",
  })

  const [workingHours, setWorkingHours] = useState([])
  const [activeTab, setActiveTab] = useState("basic")
  const [errors, setErrors] = useState({})
  const [imagePreview, setImagePreview] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState(null)

  // Map of governorate coordinates to names (for Egypt)
  const egyptGovernorates = [
    { name: "Cairo", lat: 30.0444, lng: 31.2357 },
    { name: "Alexandria", lat: 31.2001, lng: 29.9187 },
    { name: "Giza", lat: 30.0131, lng: 31.2089 },
    { name: "Sharm El Sheikh", lat: 27.9158, lng: 34.33 },
    { name: "Luxor", lat: 25.6872, lng: 32.6396 },
    { name: "Aswan", lat: 24.0889, lng: 32.8998 },
    { name: "Hurghada", lat: 27.2579, lng: 33.8116 },
    { name: "Port Said", lat: 31.2565, lng: 32.2841 },
    { name: "Suez", lat: 29.9737, lng: 32.5263 },
    { name: "Ismailia", lat: 30.5965, lng: 32.2715 },
    { name: "Mansoura", lat: 31.0409, lng: 31.3785 },
    { name: "Tanta", lat: 30.7865, lng: 31.0004 },
    { name: "Menofia", lat: 30.4313, lng: 30.7441 },
    { name: "Asyut", lat: 27.1783, lng: 31.1859 },
    { name: "Sohag", lat: 26.5591, lng: 31.6957 },
    { name: "Damanhur", lat: 31.0341, lng: 30.468 },
    { name: "Minya", lat: 28.1099, lng: 30.7503 },
    { name: "Damietta", lat: 31.4175, lng: 31.8144 },
    { name: "Beni Suef", lat: 29.0661, lng: 31.0994 },
    { name: "Fayoum", lat: 29.3084, lng: 30.8428 },
    { name: "Zagazig", lat: 30.5883, lng: 31.5019 },
  ]

  // Function to find nearest governorate
  const findNearestGovernorate = (lat, lng) => {
    let nearest = null
    let minDistance = Number.MAX_VALUE

    egyptGovernorates.forEach((gov) => {
      const distance = Math.sqrt(Math.pow(gov.lat - lat, 2) + Math.pow(gov.lng - lng, 2))
      if (distance < minDistance) {
        minDistance = distance
        nearest = gov
      }
    })

    return nearest
  }

  // Update form data when doctor changes
  useEffect(() => {
    if (doctor) {
      setFormData({
        name: doctor.name || "",
        emailDoctor: doctor.emailDoctor || "",
        phone: doctor.phone || "",
        teliphone: doctor.teliphone || "",
        experianceYears: Number(doctor.experianceYears) || 0,
        numOfPatients: Number(doctor.numOfPatients) || 0,
        location: doctor.location || "",
        about: doctor.about || "",
        whatsAppLink: doctor.whatsAppLink || "",
        locationLink: doctor.locationLink || "",
        imageDoctor: null,
        latitude: Number(doctor.latitude) || 30.0444,
        longitude: Number(doctor.longitude) || 31.2357,
        categoryId: doctor.categoryId ? String(doctor.categoryId) : "",
      })

      // Set image preview if doctor has existing image
      if (doctor.imageDoctor && typeof doctor.imageDoctor === "string") {
        setImagePreview(doctor.imageDoctor)
      }

      // Set working hours if available
      if (doctor.workingHours) {
        setWorkingHours(doctor.workingHours)
      }
    } else {
      // Reset form for new doctor
      setFormData({
        name: "",
        emailDoctor: "",
        phone: "",
        teliphone: "",
        experianceYears: 0,
        numOfPatients: 0,
        location: "",
        about: "",
        whatsAppLink: "",
        locationLink: "",
        imageDoctor: null,
        latitude: 30.0444,
        longitude: 31.2357,
        categoryId: "",
      })
      setImagePreview(null)
      setWorkingHours([])
    }

    // Reset errors when doctor changes
    setErrors({})
    setErrorMessage(null)
  }, [doctor])

  if (!isOpen) return null

  const handleChange = (e) => {
    const { name, value, type } = e.target

    if (type === "file") {
      const file = e.target.files[0]
      if (file && file.type.startsWith("image/")) {
        setFormData({ ...formData, [name]: file })
        const reader = new FileReader()
        reader.onloadend = () => {
          setImagePreview(reader.result)
        }
        reader.readAsDataURL(file)
      } else if (file) {
        setErrors((prev) => ({
          ...prev,
          imageDoctor: "Please upload a valid image file",
        }))
      }
    } else if (type === "number") {
      // Ensure numbers are properly converted
      const numValue = value === "" ? 0 : Number(value)
      setFormData({ ...formData, [name]: numValue })
    } else {
      setFormData({ ...formData, [name]: value })
    }

    // Clear error for this field
    if (errors[name]) {
      const newErrors = { ...errors }
      delete newErrors[name]
      setErrors(newErrors)
    }

    // Clear general error message when user starts typing
    if (errorMessage) {
      setErrorMessage(null)
    }
  }

  const handleLocationSelect = (lat, lng) => {
    const updatedFormData = {
      ...formData,
      latitude: Number(lat),
      longitude: Number(lng),
    }

    const googleMapsLink = `https://www.google.com/maps?q=${lat},${lng}`
    updatedFormData.locationLink = googleMapsLink

    const nearestGov = findNearestGovernorate(lat, lng)
    if (nearestGov) {
      updatedFormData.location = nearestGov.name
    }

    setFormData(updatedFormData)
  }

  const validateForm = () => {
    const newErrors = {}

    // Required field validations
    if (!formData.name?.trim()) {
      newErrors.name = "Name is required"
    }

    if (!formData.emailDoctor?.trim()) {
      newErrors.emailDoctor = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(formData.emailDoctor)) {
      newErrors.emailDoctor = "Email is invalid"
    }

    if (!formData.phone?.trim()) {
      newErrors.phone = "Phone is required"
    }

    if (!formData.teliphone?.trim()) {
      newErrors.teliphone = "Telephone is required"
    }

    // Ensure experience years is a valid number
    if (formData.experianceYears === undefined || formData.experianceYears < 0) {
      newErrors.experianceYears = "Experience years must be a non-negative number"
    }

    if (!formData.location?.trim()) {
      newErrors.location = "Location is required"
    }

    if (!formData.about?.trim()) {
      newErrors.about = "About is required"
    }

    if (!formData.whatsAppLink?.trim()) {
      newErrors.whatsAppLink = "WhatsApp Link is required"
    }

    if (!formData.categoryId || formData.categoryId === "") {
      newErrors.categoryId = "Category is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      if (validateForm()) {
        setIsLoading(true)
        setErrorMessage(null)

        // Prepare data for API - ensure all required fields are present and properly formatted
        const doctorDataForAPI = {
          name: formData.name.trim(),
          emailDoctor: formData.emailDoctor.trim(),
          phone: formData.phone.trim(),
          teliphone: formData.teliphone.trim(),
          experianceYears: Number(formData.experianceYears) || 0,
          numOfPatients: Number(formData.numOfPatients) || 0,
          location: formData.location.trim(),
          about: formData.about.trim(),
          whatsAppLink: formData.whatsAppLink.trim(),
          locationLink: formData.locationLink || "",
          latitude: Number(formData.latitude) || 30.0444,
          longitude: Number(formData.longitude) || 31.2357,
          categoryId: Number(formData.categoryId), 
          imageDoctor: formData.imageDoctor,
          workingHours: workingHours, 
        }

        console.log("Submitting form data:", doctorDataForAPI)

        const result = await onSave(doctorDataForAPI)
        console.log("Save result:", result)

        setIsLoading(false)
        onClose()
      } else {
        console.log("Form validation errors:", errors)
        // Switch to the tab with errors
        if (
          Object.keys(errors).some((key) =>
            ["name", "emailDoctor", "phone", "teliphone", "experianceYears", "categoryId"].includes(key),
          )
        ) {
          setActiveTab("basic")
        } else if (
          Object.keys(errors).some((key) => ["location", "locationLink", "latitude", "longitude"].includes(key))
        ) {
          setActiveTab("location")
        } else if (Object.keys(errors).some((key) => ["about", "whatsAppLink", "imageDoctor"].includes(key))) {
          setActiveTab("additional")
        }
      }
    } catch (error) {
      console.error("Error during form submission:", error)
      setIsLoading(false)

      // Set specific error message based on the error type
      let displayMessage = "Failed to save doctor. Please try again."

      if (error.message.includes("already exists") || error.message.includes("duplicate")) {
        displayMessage = error.message
        // Switch to basic tab to show the conflicting fields
        setActiveTab("basic")
      } else if (error.message.includes("email")) {
        displayMessage = error.message
        setActiveTab("basic")
        setErrors((prev) => ({ ...prev, emailDoctor: "This email is already in use" }))
      } else if (error.message.includes("phone")) {
        displayMessage = error.message
        setActiveTab("basic")
        setErrors((prev) => ({ ...prev, phone: "This phone number is already in use" }))
      } else {
        displayMessage = error.message || displayMessage
      }

      setErrorMessage(displayMessage)
    }
  }

  const RealMapSelector = ({ initialLat, initialLng, onLocationSelect }) => {
    const position = [initialLat || 30.0444, initialLng || 31.2357]
    const customIcon = createCustomIcon()

    return (
      <div className="w-full h-full" style={{ minHeight: "150px" }}>
        <MapContainer center={position} zoom={13} style={{ height: "100%", minHeight: "150px", width: "100%" }}>
          <TileLayer
            attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker position={position} icon={customIcon} />
          <LocationPicker onLocationSelect={onLocationSelect} initialPosition={position} />
        </MapContainer>
        <div
          className={`absolute bottom-1 left-1/2 transform -translate-x-1/2 px-1 py-0.5 rounded text-sm shadow ${
            theme === "light" ? "bg-white text-gray-700" : "bg-gray-800 text-gray-300"
          }`}
        >
          Click anywhere on map to set location
        </div>
      </div>
    )
  }

  const isFormDisabled = isLoading || isSubmitting

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/30">
      <div
        className={`p-3 rounded-lg shadow-xl w-full max-w-[320px] md:max-w-[500px] lg:max-w-[900px] max-h-[90vh] overflow-y-auto ${
          theme === "light" ? "bg-white" : "bg-gray-800"
        }`}
      >
        <div className="flex justify-between items-center mb-2">
          <h2 className={`text-sm font-bold ${theme === "light" ? "text-sky-600" : "text-sky-300"} border-b pb-1`}>
            {title}
          </h2>
          <button
            onClick={onClose}
            className={`${
              theme === "light" ? "text-gray-400 hover:text-gray-600" : "text-gray-500 hover:text-gray-300"
            } cursor-pointer text-sm ${isFormDisabled ? "opacity-50 cursor-not-allowed" : ""}`}
            disabled={isFormDisabled}
          >
            ✕
          </button>
        </div>

        {/* Loading indicator */}
        {isFormDisabled && (
          <div className="mb-2">
            <div
              className={`flex items-center justify-center py-2 px-3 rounded ${
                theme === "light" ? "bg-blue-50 text-blue-600" : "bg-blue-900 text-blue-300"
              }`}
            >
              <svg className="animate-spin h-4 w-4 mr-2" viewBox="0 0 24 24">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              {isLoading ? "Saving..." : "Processing..."}
            </div>
          </div>
        )}

        {/* Error Message Display */}
        {errorMessage && (
          <div
            className={`p-3 rounded border text-sm mb-3 flex items-start ${
              theme === "light" ? "bg-red-50 border-red-200 text-red-800" : "bg-red-900 border-red-800 text-red-200"
            }`}
          >
            <AlertCircle className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
            <div>
              <div className="font-medium mb-1">Unable to save doctor</div>
              <div className="text-xs">{errorMessage}</div>
              {errorMessage.includes("already exists") && (
                <div className="text-xs mt-2 opacity-75">
                  Please check the email and phone number fields and use different values.
                </div>
              )}
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div
            className={`flex border-b mb-2 overflow-x-auto ${theme === "light" ? "border-gray-200" : "border-gray-600"}`}
          >
            <button
              type="button"
              className={`px-2 py-0.5 text-sm ${
                activeTab === "basic"
                  ? theme === "light"
                    ? "border-b-2 border-sky-500 text-sky-600"
                    : "border-b-2 border-sky-300 text-sky-300"
                  : theme === "light"
                    ? "text-gray-500"
                    : "text-gray-400"
              } cursor-pointer ${isFormDisabled ? "opacity-50 cursor-not-allowed" : ""}`}
              onClick={() => !isFormDisabled && setActiveTab("basic")}
              disabled={isFormDisabled}
            >
              Basic
            </button>
            <button
              type="button"
              className={`px-2 py-0.5 text-sm ${
                activeTab === "location"
                  ? theme === "light"
                    ? "border-b-2 border-sky-500 text-sky-600"
                    : "border-b-2 border-sky-300 text-sky-300"
                  : theme === "light"
                    ? "text-gray-500"
                    : "text-gray-400"
              } cursor-pointer ${isFormDisabled ? "opacity-50 cursor-not-allowed" : ""}`}
              onClick={() => !isFormDisabled && setActiveTab("location")}
              disabled={isFormDisabled}
            >
              Location
            </button>
            <button
              type="button"
              className={`px-2 py-0.5 text-sm ${
                activeTab === "additional"
                  ? theme === "light"
                    ? "border-b-2 border-sky-500 text-sky-600"
                    : "border-b-2 border-sky-300 text-sky-300"
                  : theme === "light"
                    ? "text-gray-500"
                    : "text-gray-400"
              } cursor-pointer ${isFormDisabled ? "opacity-50 cursor-not-allowed" : ""}`}
              onClick={() => !isFormDisabled && setActiveTab("additional")}
              disabled={isFormDisabled}
            >
              Additional
            </button>
            <button
              type="button"
              className={`px-2 py-0.5 text-sm ${
                activeTab === "workinghours"
                  ? theme === "light"
                    ? "border-b-2 border-sky-500 text-sky-600"
                    : "border-b-2 border-sky-300 text-sky-300"
                  : theme === "light"
                    ? "text-gray-500"
                    : "text-gray-400"
              } cursor-pointer ${isFormDisabled ? "opacity-50 cursor-not-allowed" : ""}`}
              onClick={() => !isFormDisabled && setActiveTab("workinghours")}
              disabled={isFormDisabled}
            >
              Working Hours
            </button>
          </div>

          {activeTab === "basic" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
              <div className="space-y-0.5">
                <label
                  htmlFor="name"
                  className={`block text-sm font-medium ${theme === "light" ? "text-gray-700" : "text-gray-300"}`}
                >
                  Name *
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  className={`w-full px-1 py-0.5 text-sm border rounded-md focus:outline-none focus:ring-1 focus:ring-sky-500 ${
                    errors.name ? "border-red-500" : theme === "light" ? "border-gray-300" : "border-gray-600"
                  } ${theme === "light" ? "bg-white" : "bg-gray-800"} ${
                    isFormDisabled ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                  disabled={isFormDisabled}
                />
                {errors.name && <p className="text-red-500 text-xs">{errors.name}</p>}
              </div>

              <div className="space-y-0.5">
                <label
                  htmlFor="categoryId"
                  className={`block text-sm font-medium ${theme === "light" ? "text-gray-700" : "text-gray-300"}`}
                >
                  Category *
                </label>
                <select
                  id="categoryId"
                  name="categoryId"
                  value={formData.categoryId}
                  onChange={handleChange}
                  className={`w-full px-1 py-0.5 text-sm border rounded-md focus:outline-none focus:ring-1 focus:ring-sky-500 cursor-pointer transition-colors appearance-none ${
                    errors.categoryId
                      ? "border-red-500"
                      : theme === "light"
                        ? "border-gray-300 bg-white"
                        : "border-gray-600 bg-gray-800 text-gray-200"
                  } ${isFormDisabled ? "opacity-50 cursor-not-allowed" : ""}`}
                  disabled={isFormDisabled}
                >
                  <option value="" disabled className="cursor-pointer">
                    Select Category
                  </option>
                  {categories &&
                    categories.map((category) => (
                      <option
                        key={category.id}
                        value={category.id}
                        className={`cursor-pointer ${
                          theme === "light" ? "bg-white text-gray-900" : "bg-gray-800 text-gray-200"
                        }`}
                      >
                        {category.categoryName}
                      </option>
                    ))}
                </select>
                {errors.categoryId && <p className="text-red-500 text-xs">{errors.categoryId}</p>}
              </div>

              <div className="space-y-0.5">
                <label
                  htmlFor="emailDoctor"
                  className={`block text-sm font-medium ${theme === "light" ? "text-gray-700" : "text-gray-300"}`}
                >
                  Email *
                </label>
                <input
                  id="emailDoctor"
                  name="emailDoctor"
                  type="email"
                  value={formData.emailDoctor}
                  onChange={handleChange}
                  className={`w-full px-1 py-0.5 text-sm border rounded-md focus:outline-none focus:ring-1 focus:ring-sky-500 ${
                    errors.emailDoctor ? "border-red-500" : theme === "light" ? "border-gray-300" : "border-gray-600"
                  } ${theme === "light" ? "bg-white" : "bg-gray-800"} ${
                    isFormDisabled ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                  disabled={isFormDisabled}
                />
                {errors.emailDoctor && <p className="text-red-500 text-xs">{errors.emailDoctor}</p>}
              </div>

              <div className="space-y-0.5">
                <label
                  htmlFor="phone"
                  className={`block text-sm font-medium ${theme === "light" ? "text-gray-700" : "text-gray-300"}`}
                >
                  Phone *
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="text"
                  value={formData.phone}
                  onChange={handleChange}
                  className={`w-full px-1 py-0.5 text-sm border rounded-md focus:outline-none focus:ring-1 focus:ring-sky-500 ${
                    errors.phone ? "border-red-500" : theme === "light" ? "border-gray-300" : "border-gray-600"
                  } ${theme === "light" ? "bg-white" : "bg-gray-800"} ${
                    isFormDisabled ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                  disabled={isFormDisabled}
                />
                {errors.phone && <p className="text-red-500 text-xs">{errors.phone}</p>}
              </div>

              <div className="space-y-0.5">
                <label
                  htmlFor="teliphone"
                  className={`block text-sm font-medium ${theme === "light" ? "text-gray-700" : "text-gray-300"}`}
                >
                  Telephone *
                </label>
                <input
                  id="teliphone"
                  name="teliphone"
                  type="text"
                  value={formData.teliphone}
                  onChange={handleChange}
                  className={`w-full px-1 py-0.5 text-sm border rounded-md focus:outline-none focus:ring-1 focus:ring-sky-500 ${
                    errors.teliphone ? "border-red-500" : theme === "light" ? "border-gray-300" : "border-gray-600"
                  } ${theme === "light" ? "bg-white" : "bg-gray-800"} ${
                    isFormDisabled ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                  disabled={isFormDisabled}
                />
                {errors.teliphone && <p className="text-red-500 text-xs">{errors.teliphone}</p>}
              </div>

              <div className="space-y-0.5">
                <label
                  htmlFor="experianceYears"
                  className={`block text-sm font-medium ${theme === "light" ? "text-gray-700" : "text-gray-300"}`}
                >
                  Experience (years) *
                </label>
                <input
                  id="experianceYears"
                  name="experianceYears"
                  type="number"
                  min="0"
                  step="1"
                  value={formData.experianceYears}
                  onChange={handleChange}
                  className={`w-full px-1 py-0.5 text-sm border rounded-md focus:outline-none focus:ring-1 focus:ring-sky-500 ${
                    errors.experianceYears
                      ? "border-red-500"
                      : theme === "light"
                        ? "border-gray-300"
                        : "border-gray-600"
                  } ${theme === "light" ? "bg-white" : "bg-gray-800"} ${
                    isFormDisabled ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                  disabled={isFormDisabled}
                />
                {errors.experianceYears && <p className="text-red-500 text-xs">{errors.experianceYears}</p>}
              </div>

              <div className="space-y-0.5">
                <label
                  htmlFor="numOfPatients"
                  className={`block text-sm font-medium ${theme === "light" ? "text-gray-700" : "text-gray-300"}`}
                >
                  Number of Patients
                </label>
                <input
                  id="numOfPatients"
                  name="numOfPatients"
                  type="number"
                  min="0"
                  step="1"
                  value={formData.numOfPatients}
                  onChange={handleChange}
                  className={`w-full px-1 py-0.5 text-sm border rounded-md focus:outline-none focus:ring-1 focus:ring-sky-500 ${
                    theme === "light" ? "border-gray-300" : "border-gray-600"
                  } ${theme === "light" ? "bg-white" : "bg-gray-800"} ${
                    isFormDisabled ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                  disabled={isFormDisabled}
                />
              </div>
            </div>
          )}

          {activeTab === "location" && (
            <div className="space-y-1.5">
              <div className="grid grid-cols-2 gap-1">
                <div className="space-y-0.5">
                  <label
                    htmlFor="location"
                    className={`block text-sm font-medium ${theme === "light" ? "text-gray-700" : "text-gray-300"}`}
                  >
                    Location *
                  </label>
                  <input
                    id="location"
                    name="location"
                    type="text"
                    value={formData.location}
                    onChange={handleChange}
                    className={`w-full px-1 py-0.5 text-sm border rounded-md focus:outline-none focus:ring-1 focus:ring-sky-500 ${
                      errors.location ? "border-red-500" : theme === "light" ? "border-gray-300" : "border-gray-600"
                    } ${theme === "light" ? "bg-white" : "bg-gray-800"} ${
                      isFormDisabled ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                    disabled={isFormDisabled}
                  />
                  {errors.location && <p className="text-red-500 text-xs">{errors.location}</p>}
                </div>

                <div className="space-y-0.5">
                  <label
                    htmlFor="locationLink"
                    className={`block text-sm font-medium ${theme === "light" ? "text-gray-700" : "text-gray-300"}`}
                  >
                    Location Link
                  </label>
                  <input
                    id="locationLink"
                    name="locationLink"
                    type="text"
                    value={formData.locationLink}
                    onChange={handleChange}
                    className={`w-full px-1 py-0.5 text-sm border rounded-md focus:outline-none focus:ring-1 focus:ring-sky-500 ${
                      theme === "light" ? "border-gray-300" : "border-gray-600"
                    } ${theme === "light" ? "bg-white" : "bg-gray-800"} ${
                      isFormDisabled ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                    disabled={isFormDisabled}
                  />
                </div>
              </div>

              <div className="space-y-0.5">
                <label
                  className={`flex items-center text-sm font-medium ${theme === "light" ? "text-gray-700" : "text-gray-300"}`}
                >
                  <MapPin className={`h-2.5 w-2.5 mr-1 ${theme === "light" ? "text-sky-500" : "text-sky-300"}`} />
                  Select Location on Map
                </label>
                <div
                  className={`h-[120px] md:h-[200px] lg:h-[300px] w-full relative rounded-md border overflow-hidden ${
                    theme === "light" ? "border-gray-300" : "border-gray-600"
                  } ${isFormDisabled ? "opacity-50 pointer-events-none" : ""}`}
                >
                  <RealMapSelector
                    initialLat={formData.latitude}
                    initialLng={formData.longitude}
                    onLocationSelect={handleLocationSelect}
                  />
                </div>
                <div className={`flex gap-1 text-sm ${theme === "light" ? "text-gray-500" : "text-gray-400"}`}>
                  <div>Lat: {formData.latitude.toFixed(6)}</div>
                  <div>Lng: {formData.longitude.toFixed(6)}</div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "additional" && (
            <div className="space-y-1.5">
              <div className="space-y-0.5">
                <label
                  htmlFor="about"
                  className={`block text-sm font-medium ${theme === "light" ? "text-gray-700" : "text-gray-300"}`}
                >
                  About Doctor *
                </label>
                <textarea
                  id="about"
                  name="about"
                  value={formData.about}
                  onChange={handleChange}
                  className={`w-full px-1 py-0.5 text-sm border rounded-md focus:outline-none focus:ring-1 focus:ring-sky-500 min-h-[40px] max-h-[60px] ${
                    errors.about ? "border-red-500" : theme === "light" ? "border-gray-300" : "border-gray-600"
                  } ${theme === "light" ? "bg-white" : "bg-gray-800"} ${
                    isFormDisabled ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                  disabled={isFormDisabled}
                />
                {errors.about && <p className="text-red-500 text-xs">{errors.about}</p>}
              </div>

              <div className="grid grid-cols-2 gap-1">
                <div className="space-y-0.5">
                  <label
                    htmlFor="whatsAppLink"
                    className={`block text-sm font-medium ${theme === "light" ? "text-gray-700" : "text-gray-300"}`}
                  >
                    WhatsApp Link *
                  </label>
                  <input
                    id="whatsAppLink"
                    name="whatsAppLink"
                    type="text"
                    value={formData.whatsAppLink}
                    onChange={handleChange}
                    className={`w-full px-1 py-0.5 text-sm border rounded-md focus:outline-none focus:ring-1 focus:ring-sky-500 ${
                      errors.whatsAppLink ? "border-red-500" : theme === "light" ? "border-gray-300" : "border-gray-600"
                    } ${theme === "light" ? "bg-white" : "bg-gray-800"} ${
                      isFormDisabled ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                    disabled={isFormDisabled}
                  />
                  {errors.whatsAppLink && <p className="text-red-500 text-xs">{errors.whatsAppLink}</p>}
                </div>

                <div className="space-y-0.5">
                  <label
                    htmlFor="imageDoctor"
                    className={`block text-sm font-medium ${theme === "light" ? "text-gray-700" : "text-gray-300"}`}
                  >
                    Doctor Image
                  </label>
                  {imagePreview && (
                    <div className="mt-0.5">
                      <img
                        src={imagePreview || "/placeholder.svg"}
                        alt="Doctor Preview"
                        className="h-8 w-8 object-cover rounded-full border border-sky-500"
                      />
                    </div>
                  )}
                  <div className="relative">
                    <input
                      id="imageDoctor"
                      name="imageDoctor"
                      type="file"
                      accept="image/*"
                      onChange={handleChange}
                      className="hidden"
                      disabled={isFormDisabled}
                    />
                    <label
                      htmlFor="imageDoctor"
                      className={`inline-block px-2 py-1 text-sm font-medium rounded-md cursor-pointer transition-colors ${
                        theme === "light"
                          ? "bg-sky-100 text-sky-700 hover:bg-sky-200 border border-gray-300"
                          : "bg-sky-900 text-sky-300 hover:bg-sky-800 border border-gray-600"
                      } ${isFormDisabled ? "opacity-50 cursor-not-allowed" : ""}`}
                    >
                      {imagePreview ? "Change Image" : "Upload Image"}
                    </label>
                  </div>
                  {errors.imageDoctor && <p className="text-red-500 text-xs">{errors.imageDoctor}</p>}
                </div>
              </div>
            </div>
          )}

          {activeTab === "workinghours" && (
            <div className="space-y-1.5">
              <div
                className={`p-3 rounded-md border ${
                  theme === "light" ? "bg-sky-50 border-sky-100" : "bg-sky-900 border-sky-800"
                }`}
              >
                <div className="flex items-center mb-2">
                  <Clock className={`h-4 w-4 ${theme === "light" ? "text-sky-500" : "text-sky-300"} mr-2`} />
                  <h3 className={`text-sm font-medium ${theme === "light" ? "text-sky-700" : "text-sky-200"}`}>
                    Doctor Working Hours
                  </h3>
                </div>
                <p className={`text-xs ${theme === "light" ? "text-gray-600" : "text-gray-400"} mb-3`}>
                  Set up working days and hours. You can add multiple time slots for each day.
                </p>
                <WorkingHoursSection
                  workingHours={workingHours}
                  setWorkingHours={setWorkingHours}
                  theme={theme}
                  isFormDisabled={isFormDisabled}
                />
              </div>
            </div>
          )}

          <div
            className={`flex justify-end mt-2 pt-1 border-t ${theme === "light" ? "border-gray-200" : "border-gray-600"}`}
          >
            <button
              type="button"
              onClick={onClose}
              className={`${
                theme === "light" ? "bg-gray-400 hover:bg-gray-500" : "bg-gray-600 hover:bg-gray-700"
              } text-white px-2 py-0.5 rounded-md mr-1 transition-colors text-sm cursor-pointer ${
                isFormDisabled ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={isFormDisabled}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`${
                theme === "light" ? "bg-sky-600 hover:bg-sky-700" : "bg-sky-700 hover:bg-sky-800"
              } text-white px-2 py-0.5 rounded-md transition-colors text-sm cursor-pointer flex items-center justify-center relative ${
                isFormDisabled ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={isFormDisabled}
            >
              {isLoading ? (
                <span className="flex items-center">
                  <svg
                    className="animate-spin h-4 w-4 mr-2 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Saving...
                </span>
              ) : (
                "Save"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default DoctorForm
