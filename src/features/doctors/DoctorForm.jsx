import { useState, useEffect } from "react"
import { MapPin, Clock } from "lucide-react"
import WorkingHoursEditor from "./WorkingHoursEditor" 


const DoctorForm = ({ isOpen, onClose, onSave, title, doctor, categories }) => {
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
    imageDoctor: "",
    latitude: 30.0444,
    longitude: 31.2357,
    categoryId: "",
  })

  const [activeTab, setActiveTab] = useState("basic")
  const [errors, setErrors] = useState({})
  const [imagePreview, setImagePreview] = useState(null)
  const [showWorkingHours, setShowWorkingHours] = useState(false)

  // Update form data when doctor changes
  useEffect(() => {
    if (doctor) {
      setFormData({
        name: doctor.name || "",
        emailDoctor: doctor.emailDoctor || "",
        phone: doctor.phone || "",
        teliphone: doctor.teliphone || "",
        experianceYears: doctor.experianceYears || 0,
        numOfPatients: doctor.numOfPatients || 0,
        location: doctor.location || "",
        about: doctor.about || "",
        whatsAppLink: doctor.whatsAppLink || "",
        locationLink: doctor.locationLink || "",
        imageDoctor: doctor.imageDoctor || "",
        latitude: doctor.latitude || 30.0444,
        longitude: doctor.longitude || 31.2357,
        categoryId: doctor.categoryId || "",
      })

      if (doctor.imageDoctor) {
        setImagePreview(doctor.imageDoctor)
      }
    }
  }, [doctor])

  if (!isOpen) return null

  const handleChange = (e) => {
    const { name, value, type } = e.target;

    if (type === "file") {
      const file = e.target.files[0];
      if (file) {
        setFormData({ ...formData, [name]: file });
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreview(reader.result);
        };
        reader.readAsDataURL(file);
      }
    } else if (type === "number") {
      setFormData({ ...formData, [name]: Number.parseFloat(value) || 0 });
    } else {
      setFormData({ ...formData, [name]: value });
    }

    // Clear error when field is edited
    if (errors[name]) {
      const newErrors = { ...errors };
      delete newErrors[name];
      setErrors(newErrors);
    }
  };

  const handleLocationSelect = (lat, lng) => {
    setFormData({
      ...formData,
      latitude: lat,
      longitude: lng,
    })
  }

  const validateForm = () => {
    const newErrors = {}

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
      newErrors.teliphone = "Mobile is required"
    }

    if (!formData.experianceYears) {
      newErrors.experianceYears = "Experience years is required"
    }

    if (!formData.location?.trim()) {
      newErrors.location = "Location is required"
    }

    if (!formData.about?.trim()) {
      newErrors.about = "About is required"
    }

    if (!formData.categoryId || formData.categoryId === "") {
      newErrors.categoryId = "Category is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (validateForm()) {
      onSave(formData)
    } else {
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
    console.log("Form data being sent:", formData);
  }

  // Map selector simulation - compact version
  const CompactMapSelector = ({ initialLat, initialLng, onLocationSelect }) => {
    // eslint-disable-next-line no-unused-vars
    const handleMapClick = (e) => {
      // Simulate selecting a random location near the initial location
      const randomOffset = () => (Math.random() - 0.5) * 0.01
      const lat = initialLat + randomOffset()
      const lng = initialLng + randomOffset()
      onLocationSelect(lat, lng)
    }

    return (
      <div
        className="w-full h-full relative bg-gray-200 cursor-crosshair"
        onClick={handleMapClick}
        style={{ minHeight: "150px" }}
      >
        <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
          <p className="text-gray-400 text-xs">Click anywhere to set location.</p>
        </div>
        <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 text-red-500">
          <MapPin className="h-6 w-6" />
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full whitespace-nowrap bg-white px-1 py-0.5 rounded text-xs shadow-sm">
            {formData.latitude.toFixed(6)}, {formData.longitude.toFixed(6)}
          </div>
        </div>
      </div>
    )
  }

  // Open working hours editor
  const handleOpenWorkingHours = () => {
    setShowWorkingHours(true)
  }

  // Close working hours editor
  const handleCloseWorkingHours = () => {
    setShowWorkingHours(false)
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 ">
      <div className="bg-white p-4 rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-lg font-bold text-sky-700">{title}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Tabs - Compact */}
          <div className="flex border-b mb-3 overflow-x-auto">
            <button
              type="button"
              className={`px-3 py-1 text-xs ${activeTab === "basic" ? "border-b-2 border-sky-500 text-sky-600" : "text-gray-500"}`}
              onClick={() => setActiveTab("basic")}
            >
              Basic
            </button>
            <button
              type="button"
              className={`px-3 py-1 text-xs ${activeTab === "location" ? "border-b-2 border-sky-500 text-sky-600" : "text-gray-500"}`}
              onClick={() => setActiveTab("location")}
            >
              Location
            </button>
            <button
              type="button"
              className={`px-3 py-1 text-xs ${activeTab === "additional" ? "border-b-2 border-sky-500 text-sky-600" : "text-gray-500"}`}
              onClick={() => setActiveTab("additional")}
            >
              Additional
            </button>
            <button
              type="button"
              className={`px-3 py-1 text-xs ${activeTab === "workinghours" ? "border-b-2 border-sky-500 text-sky-600" : "text-gray-500"}`}
              onClick={() => setActiveTab("workinghours")}
            >
              Working Hours
            </button>
          </div>

          {/* Basic Tab Content - Compact */}
          {activeTab === "basic" && (
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <label htmlFor="name" className="block text-xs font-medium text-gray-700">
                  Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  className={`w-full px-2 py-1 text-sm border rounded-md focus:outline-none focus:ring-1 focus:ring-sky-500 ${errors.name ? "border-red-500" : "border-gray-300"}`}
                />
                {errors.name && <p className="text-red-500 text-xs">{errors.name}</p>}
              </div>

              <div className="space-y-1">
                <label htmlFor="categoryId" className="block text-xs font-medium text-gray-700">
                  Category
                </label>
                <select
                  id="categoryId"
                  name="categoryId"
                  value={formData.categoryId}
                  onChange={(e)=>{
                    handleChange(e);
                  }}
                  className={`w-full px-2 py-1 text-sm border rounded-md focus:outline-none focus:ring-1 focus:ring-sky-500 ${errors.categoryId ? "border-red-500" : "border-gray-300"}`}
                >
                  <option value="">Select Category</option>
                  {categories &&
                    categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.categoryName}
                      </option>
                    ))}
                </select>
                {errors.categoryId && <p className="text-red-500 text-xs">{errors.categoryId}</p>}
              </div>

              <div className="space-y-1">
                <label htmlFor="emailDoctor" className="block text-xs font-medium text-gray-700">
                  Email
                </label>
                <input
                  id="emailDoctor"
                  name="emailDoctor"
                  type="email"
                  value={formData.emailDoctor}
                  onChange={handleChange}
                  className={`w-full px-2 py-1 text-sm border rounded-md focus:outline-none focus:ring-1 focus:ring-sky-500 ${errors.emailDoctor ? "border-red-500" : "border-gray-300"}`}
                />
                {errors.emailDoctor && <p className="text-red-500 text-xs">{errors.emailDoctor}</p>}
              </div>

              <div className="space-y-1">
                <label htmlFor="phone" className="block text-xs font-medium text-gray-700">
                  Phone
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="text"
                  value={formData.phone}
                  onChange={handleChange}
                  className={`w-full px-2 py-1 text-sm border rounded-md focus:outline-none focus:ring-1 focus:ring-sky-500 ${errors.phone ? "border-red-500" : "border-gray-300"}`}
                />
                {errors.phone && <p className="text-red-500 text-xs">{errors.phone}</p>}
              </div>

              <div className="space-y-1">
                <label htmlFor="teliphone" className="block text-xs font-medium text-gray-700">
                  Mobile
                </label>
                <input
                  id="teliphone"
                  name="teliphone"
                  type="text"
                  value={formData.teliphone}
                  onChange={handleChange}
                  className={`w-full px-2 py-1 text-sm border rounded-md focus:outline-none focus:ring-1 focus:ring-sky-500 ${errors.teliphone ? "border-red-500" : "border-gray-300"}`}
                />
                {errors.teliphone && <p className="text-red-500 text-xs">{errors.teliphone}</p>}
              </div>

              <div className="space-y-1">
                <label htmlFor="experianceYears" className="block text-xs font-medium text-gray-700">
                  Experience (years)
                </label>
                <input
                  id="experianceYears"
                  name="experianceYears"
                  type="number"
                  value={formData.experianceYears}
                  onChange={handleChange}
                  className={`w-full px-2 py-1 text-sm border rounded-md focus:outline-none focus:ring-1 focus:ring-sky-500 ${errors.experianceYears ? "border-red-500" : "border-gray-300"}`}
                />
                {errors.experianceYears && <p className="text-red-500 text-xs">{errors.experianceYears}</p>}
              </div>

              <div className="space-y-1">
                <label htmlFor="numOfPatients" className="block text-xs font-medium text-gray-700">
                  Number of Patients
                </label>
                <input
                  id="numOfPatients"
                  name="numOfPatients"
                  type="number"
                  value={formData.numOfPatients}
                  onChange={handleChange}
                  className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-sky-500"
                />
              </div>
            </div>
          )}

          {/* Location Tab Content - Compact */}
          {activeTab === "location" && (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label htmlFor="location" className="block text-xs font-medium text-gray-700">
                    Location
                  </label>
                  <input
                    id="location"
                    name="location"
                    type="text"
                    value={formData.location}
                    onChange={handleChange}
                    className={`w-full px-2 py-1 text-sm border rounded-md focus:outline-none focus:ring-1 focus:ring-sky-500 ${errors.location ? "border-red-500" : "border-gray-300"}`}
                  />
                  {errors.location && <p className="text-red-500 text-xs">{errors.location}</p>}
                </div>

                <div className="space-y-1">
                  <label htmlFor="locationLink" className="block text-xs font-medium text-gray-700">
                    Location Link
                  </label>
                  <input
                    id="locationLink"
                    name="locationLink"
                    type="text"
                    value={formData.locationLink}
                    onChange={handleChange}
                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-sky-500"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="flex items-center text-xs font-medium text-gray-700">
                  <MapPin className="h-3 w-3 mr-1" />
                  Select Location on Map
                </label>
                <div className="h-[150px] w-full rounded-md border border-gray-300 overflow-hidden">
                  <CompactMapSelector
                    initialLat={formData.latitude}
                    initialLng={formData.longitude}
                    onLocationSelect={handleLocationSelect}
                  />
                </div>
                <div className="flex gap-2 text-xs text-gray-500">
                  <div>Lat: {formData.latitude.toFixed(6)}</div>
                  <div>Lng: {formData.longitude.toFixed(6)}</div>
                </div>
              </div>
            </div>
          )}

          {/* Additional Tab Content - Compact */}
          {activeTab === "additional" && (
            <div className="space-y-3">
              <div className="space-y-1">
                <label htmlFor="about" className="block text-xs font-medium text-gray-700">
                  About Doctor
                </label>
                <textarea
                  id="about"
                  name="about"
                  value={formData.about}
                  onChange={handleChange}
                  className={`w-full px-2 py-1 text-sm border rounded-md focus:outline-none focus:ring-1 focus:ring-sky-500 min-h-[60px] max-h-[100px] ${errors.about ? "border-red-500" : "border-gray-300"}`}
                />
                {errors.about && <p className="text-red-500 text-xs">{errors.about}</p>}
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label htmlFor="whatsAppLink" className="block text-xs font-medium text-gray-700">
                    WhatsApp Link
                  </label>
                  <input
                    id="whatsAppLink"
                    name="whatsAppLink"
                    type="text"
                    value={formData.whatsAppLink}
                    onChange={handleChange}
                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-sky-500"
                  />
                </div>

                <div className="space-y-1">
                  <label htmlFor="imageDoctor" className="block text-xs font-medium text-gray-700">
                    Doctor Image
                  </label>
                  <input
                    id="imageDoctor"
                    name="imageDoctor"
                    type="file"
                    accept="image/*"
                    onChange={handleChange}
                    className="w-full px-2 py-1 text-xs border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-sky-500"
                  />
                  {imagePreview && (
                    <div className="mt-1">
                      <img
                        src={imagePreview || "/placeholder.svg"}
                        alt="Preview"
                        className="h-12 w-12 object-cover rounded-md"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Working Hours Tab Content */}
          {activeTab === "workinghours" && (
            <div className="space-y-3">
              <div className="bg-sky-50 p-3 rounded-md border border-sky-100">
                <div className="flex items-center mb-2">
                  <Clock className="h-4 w-4 text-sky-500 mr-2" />
                  <h3 className="text-sm font-medium text-sky-700">Doctor Working Hours</h3>
                </div>
                <p className="text-xs text-gray-600 mb-3">
                  Set up your working days and hours to let your patients know when you're available.
                </p>
                
                {/* Note about saving first */}
                {!doctor?.id ? (
                  <div className="bg-amber-50 p-2 rounded border border-amber-200 text-xs text-amber-800 mb-3">
                    Please save the doctor profile first before adding working hours.
                  </div>
                ) : null}
                
                <button
                  type="button"
                  onClick={handleOpenWorkingHours}
                  disabled={!doctor?.id}
                  className={`w-full flex items-center justify-center py-2 px-3 rounded-md text-sm font-medium ${
                    doctor?.id
                      ? "bg-sky-600 text-white hover:bg-sky-700"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }`}
                >
                  <Clock className="h-4 w-4 mr-2" />
                  {doctor?.id ? "Manage Working Hours" : "Save Profile First"}
                </button>
              </div>
            </div>
          )}

          {/* Action Buttons - Compact */}
          <div className="flex justify-end mt-3 pt-2 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-400 text-white px-3 py-1 rounded-md hover:bg-gray-500 mr-2 transition duration-200 text-xs"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-sky-600 text-white px-3 py-1 rounded-md hover:bg-sky-700 transition duration-200 text-xs"
            >
              Save
            </button>
          </div>
        </form>
      </div>

      {/* Working Hours Modal */}
      {showWorkingHours && doctor?.id && (
        <WorkingHoursEditor 
          isOpen={showWorkingHours} 
          onClose={handleCloseWorkingHours} 
          doctor={doctor} 
        />
      )}
    </div>
  )
}

export default DoctorForm