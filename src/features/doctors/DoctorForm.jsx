import { useState, useEffect, useContext } from "react";
import { MapPin, Clock } from "lucide-react";
import { ThemeContext } from "../../context/ThemeContext";
import WorkingHoursEditor from "./WorkingHoursEditor";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";

// Custom marker icon setup
const createCustomIcon = () => {
  return L.icon({
    iconUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
    iconRetinaUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
    shadowUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  });
};

// Location picker component within the map
const LocationPicker = ({ onLocationSelect, initialPosition }) => {
  const map = useMapEvents({
    click: (e) => {
      const { lat, lng } = e.latlng;
      onLocationSelect(lat, lng);
    },
  });

  useEffect(() => {
    if (initialPosition) {
      map.flyTo(initialPosition, map.getZoom());
    }
  }, [initialPosition, map]);

  return null;
};

const DoctorForm = ({ isOpen, onClose, onSave, title, doctor, categories }) => {
  const { theme } = useContext(ThemeContext);
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
  });

  const [activeTab, setActiveTab] = useState("basic");
  const [errors, setErrors] = useState({});
  const [imagePreview, setImagePreview] = useState(null);
  const [showWorkingHours, setShowWorkingHours] = useState(false);
  const [mapKey, setMapKey] = useState(Date.now()); // Used to force remount the map

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
  ];

  // Function to find nearest governorate
  const findNearestGovernorate = (lat, lng) => {
    let nearest = null;
    let minDistance = Number.MAX_VALUE;

    egyptGovernorates.forEach((gov) => {
      // Simple Euclidean distance - sufficient for demo purposes
      const distance = Math.sqrt(
        Math.pow(gov.lat - lat, 2) + Math.pow(gov.lng - lng, 2)
      );

      if (distance < minDistance) {
        minDistance = distance;
        nearest = gov;
      }
    });

    return nearest;
  };

  // Update form data when doctor changes
  useEffect(() => {
    if (doctor) {
      setFormData({
        name: doctor.name || "",
        emailDoctor: doctor.emailDoctor || "",
        phone: doctor.phone || "",
        teliphone: doctor.teliphone || "",
        experienceYears: doctor.experianceYears || 0,
        numOfPatients: doctor.numOfPatients || 0,
        location: doctor.location || "",
        about: doctor.about || "",
        whatsAppLink: doctor.whatsAppLink || "",
        locationLink: doctor.locationLink || "",
        imageDoctor: doctor.imageDoctor || "",
        latitude: doctor.latitude || 30.0444,
        longitude: doctor.longitude || 31.2357,
        categoryId: doctor.categoryId || "",
      });

      if (doctor.imageDoctor) {
        setImagePreview(doctor.imageDoctor);
      }

      // Force map to rerender with new location
      setMapKey(Date.now());
    }
  }, [doctor]);

  if (!isOpen) return null;

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
    // Update coordinates
    const updatedFormData = {
      ...formData,
      latitude: lat,
      longitude: lng,
    };

    // Create Google Maps link
    const googleMapsLink = `https://www.google.com/maps?q=${lat},${lng}`;
    updatedFormData.locationLink = googleMapsLink;

    // Find nearest governorate/province
    const nearestGov = findNearestGovernorate(lat, lng);
    if (nearestGov) {
      updatedFormData.location = nearestGov.name;
    }

    setFormData(updatedFormData);
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name?.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.emailDoctor?.trim()) {
      newErrors.emailDoctor = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.emailDoctor)) {
      newErrors.emailDoctor = "Email is invalid";
    }

    if (!formData.phone?.trim()) {
      newErrors.phone = "Phone is required";
    }

    if (!formData.teliphone?.trim()) {
      newErrors.teliphone = "Mobile is required";
    }

    if (!formData.experienceYears) {
      newErrors.experienceYears = "Experience years is required";
    }

    if (!formData.location?.trim()) {
      newErrors.location = "Location is required";
    }

    if (!formData.about?.trim()) {
      newErrors.about = "About is required";
    }

    if (!formData.categoryId || formData.categoryId === "") {
      newErrors.categoryId = "Category is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateForm()) {
      onSave(formData);
    } else {
      // Switch to the tab with errors
      if (
        Object.keys(errors).some((key) =>
          [
            "name",
            "emailDoctor",
            "phone",
            "teliphone",
            "experienceYears",
            "categoryId",
          ].includes(key)
        )
      ) {
        setActiveTab("basic");
      } else if (
        Object.keys(errors).some((key) =>
          ["location", "locationLink", "latitude", "longitude"].includes(key)
        )
      ) {
        setActiveTab("location");
      } else if (
        Object.keys(errors).some((key) =>
          ["about", "whatsAppLink", "imageDoctor"].includes(key)
        )
      ) {
        setActiveTab("additional");
      }
    }
    console.log("Form data being sent:", formData);
  };

  // Real Map Selector component using react-leaflet
  const RealMapSelector = ({ initialLat, initialLng, onLocationSelect }) => {
    const position = [initialLat, initialLng];
    const customIcon = createCustomIcon();

    return (
      <div className="w-full h-full" style={{ minHeight: "150px" }}>
        <MapContainer
          center={position}
          zoom={13}
          style={{ height: "100%", minHeight: "150px", width: "100%" }}
          key={mapKey}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker position={position} icon={customIcon} />
          <LocationPicker
            onLocationSelect={onLocationSelect}
            initialPosition={position}
          />
        </MapContainer>
        <div
          className={`absolute bottom-1 left-1/2 transform -translate-x-1/2 px-1 py-0.5 rounded text-[10px] shadow ${
            theme === "light"
              ? "bg-white text-gray-700"
              : "bg-gray-800 text-gray-300"
          }`}
        >
          Click anywhere on map to set location
        </div>
      </div>
    );
  };

  // Open working hours editor
  const handleOpenWorkingHours = () => {
    setShowWorkingHours(true);
  };

  // Close working hours editor
  const handleCloseWorkingHours = () => {
    setShowWorkingHours(false);
  };

  return (
   <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/30">
      <div
        className={`p-3 rounded-lg shadow-xl w-full max-w-[320px] max-h-[90vh] overflow-y-auto ${
          theme === "light" ? "bg-white" : "bg-gray-800"
        }`}
      >
        <div className="flex justify-between items-center mb-2">
          <h2
            className={`text-sm font-bold ${
              theme === "light" ? "text-sky-600" : "text-sky-300"
            } border-b pb-1`}
          >
            {title}
          </h2>
          <button
            onClick={onClose}
            className={`${
              theme === "light"
                ? "text-gray-400 hover:text-gray-600"
                : "text-gray-500 hover:text-gray-300"
            } cursor-pointer text-sm`}
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Tabs - Compact */}
          <div
            className={`flex border-b mb-2 overflow-x-auto ${
              theme === "light" ? "border-gray-200" : "border-gray-600"
            }`}
          >
            <button
              type="button"
              className={`px-2 py-0.5 text-[9px] ${
                activeTab === "basic"
                  ? theme === "light"
                    ? "border-b-2 border-sky-500 text-sky-600"
                    : "border-b-2 border-sky-300 text-sky-300"
                  : theme === "light"
                    ? "text-gray-500"
                    : "text-gray-400"
              } cursor-pointer`}
              onClick={() => setActiveTab("basic")}
            >
              Basic
            </button>
            <button
              type="button"
              className={`px-2 py-0.5 text-[9px] ${
                activeTab === "location"
                  ? theme === "light"
                    ? "border-b-2 border-sky-500 text-sky-600"
                    : "border-b-2 border-sky-300 text-sky-300"
                  : theme === "light"
                    ? "text-gray-500"
                    : "text-gray-400"
              } cursor-pointer`}
              onClick={() => setActiveTab("location")}
            >
              Location
            </button>
            <button
              type="button"
              className={`px-2 py-0.5 text-[9px] ${
                activeTab === "additional"
                  ? theme === "light"
                    ? "border-b-2 border-sky-500 text-sky-600"
                    : "border-b-2 border-sky-300 text-sky-300"
                  : theme === "light"
                    ? "text-gray-500"
                    : "text-gray-400"
              } cursor-pointer`}
              onClick={() => setActiveTab("additional")}
            >
              Additional
            </button>
            <button
              type="button"
              className={`px-2 py-0.5 text-[9px] ${
                activeTab === "workinghours"
                  ? theme === "light"
                    ? "border-b-2 border-sky-500 text-sky-600"
                    : "border-b-2 border-sky-300 text-sky-300"
                  : theme === "light"
                    ? "text-gray-500"
                    : "text-gray-400"
              } cursor-pointer`}
              onClick={() => setActiveTab("workinghours")}
            >
              Working Hours
            </button>
          </div>

          {/* Basic Tab Content - Compact */}
          {activeTab === "basic" && (
            <div className="grid grid-cols-2 gap-1">
              <div className="space-y-0.5">
                <label
                  htmlFor="name"
                  className={`block text-[9px] font-medium ${
                    theme === "light" ? "text-gray-700" : "text-gray-300"
                  }`}
                >
                  Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  className={`w-full px-1 py-0.5 text-[9px] border rounded-md focus:outline-none focus:ring-1 focus:ring-sky-500 ${
                    errors.name
                      ? "border-red-500"
                      : theme === "light"
                      ? "border-gray-300"
                      : "border-gray-600"
                  } ${theme === "light" ? "bg-white" : "bg-gray-800"}`}
                />
                {errors.name && (
                  <p className="text-red-500 text-[8px]">{errors.name}</p>
                )}
              </div>

              <div className="space-y-0.5">
                <label
                  htmlFor="categoryId"
                  className={`block text-[9px] font-medium ${
                    theme === "light" ? "text-gray-700" : "text-gray-300"
                  }`}
                >
                  Category
                </label>
                <select
                  id="categoryId"
                  name="categoryId"
                  value={formData.categoryId}
                  onChange={handleChange}
                  className={`w-full px-1 py-0.5 text-[9px] border rounded-md focus:outline-none focus:ring-1 focus:ring-sky-500 cursor-pointer transition-colors appearance-none ${
                    errors.categoryId
                      ? "border-red-500"
                      : theme === "light"
                      ? "border-gray-300 bg-white"
                      : "border-gray-600 bg-gray-800 text-gray-200"
                  }`}
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
                          theme === "light"
                            ? "bg-white text-gray-900"
                            : "bg-gray-800 text-gray-200"
                        }`}
                      >
                        {category.categoryName}
                      </option>
                    ))}
                </select>
                {errors.categoryId && (
                  <p className="text-red-500 text-[8px]">{errors.categoryId}</p>
                )}
              </div>

              <div className="space-y-0.5">
                <label
                  htmlFor="emailDoctor"
                  className={`block text-[9px] font-medium ${
                    theme === "light" ? "text-gray-700" : "text-gray-300"
                  }`}
                >
                  Email
                </label>
                <input
                  id="emailDoctor"
                  name="emailDoctor"
                  type="email"
                  value={formData.emailDoctor}
                  onChange={handleChange}
                  className={`w-full px-1 py-0.5 text-[9px] border rounded-md focus:outline-none focus:ring-1 focus:ring-sky-500 ${
                    errors.emailDoctor
                      ? "border-red-500"
                      : theme === "light"
                      ? "border-gray-300"
                      : "border-gray-600"
                  } ${theme === "light" ? "bg-white" : "bg-gray-800"}`}
                />
                {errors.emailDoctor && (
                  <p className="text-red-500 text-[8px]">{errors.emailDoctor}</p>
                )}
              </div>

              <div className="space-y-0.5">
                <label
                  htmlFor="phone"
                  className={`block text-[9px] font-medium ${
                    theme === "light" ? "text-gray-700" : "text-gray-300"
                  }`}
                >
                  Phone
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="text"
                  value={formData.phone}
                  onChange={handleChange}
                  className={`w-full px-1 py-0.5 text-[9px] border rounded-md focus:outline-none focus:ring-1 focus:ring-sky-500 ${
                    errors.phone
                      ? "border-red-500"
                      : theme === "light"
                      ? "border-gray-300"
                      : "border-gray-600"
                  } ${theme === "light" ? "bg-white" : "bg-gray-800"}`}
                />
                {errors.phone && (
                  <p className="text-red-500 text-[8px]">{errors.phone}</p>
                )}
              </div>

              <div className="space-y-0.5">
                <label
                  htmlFor="teliphone"
                  className={`block text-[9px] font-medium ${
                    theme === "light" ? "text-gray-700" : "text-gray-300"
                  }`}
                >
                  Mobile
                </label>
                <input
                  id="teliphone"
                  name="teliphone"
                  type="text"
                  value={formData.teliphone}
                  onChange={handleChange}
                  className={`w-full px-1 py-0.5 text-[9px] border rounded-md focus:outline-none focus:ring-1 focus:ring-sky-500 ${
                    errors.teliphone
                      ? "border-red-500"
                      : theme === "light"
                      ? "border-gray-300"
                      : "border-gray-600"
                  } ${theme === "light" ? "bg-white" : "bg-gray-800"}`}
                />
                {errors.teliphone && (
                  <p className="text-red-500 text-[8px]">{errors.teliphone}</p>
                )}
              </div>

              <div className="space-y-0.5">
                <label
                  htmlFor="experienceYears"
                  className={`block text-[9px] font-medium ${
                    theme === "light" ? "text-gray-700" : "text-gray-300"
                  }`}
                >
                  Experience (years)
                </label>
                <input
                  id="experienceYears"
                  name="experienceYears"
                  type="number"
                  value={formData.experienceYears}
                  onChange={handleChange}
                  className={`w-full px-1 py-0.5 text-[9px] border rounded-md focus:outline-none focus:ring-1 focus:ring-sky-500 ${
                    errors.experienceYears
                      ? "border-red-500"
                      : theme === "light"
                      ? "border-gray-300"
                      : "border-gray-600"
                  } ${theme === "light" ? "bg-white" : "bg-gray-800"}`}
                />
                {errors.experienceYears && (
                  <p className="text-red-500 text-[8px]">
                    {errors.experienceYears}
                  </p>
                )}
              </div>

              <div className="space-y-0.5">
                <label
                  htmlFor="numOfPatients"
                  className={`block text-[9px] font-medium ${
                    theme === "light" ? "text-gray-700" : "text-gray-300"
                  }`}
                >
                  Number of Patients
                </label>
                <input
                  id="numOfPatients"
                  name="numOfPatients"
                  type="number"
                  value={formData.numOfPatients}
                  onChange={handleChange}
                  className={`w-full px-1 py-0.5 text-[9px] border rounded-md focus:outline-none focus:ring-1 focus:ring-sky-500 ${
                    theme === "light" ? "border-gray-300" : "border-gray-600"
                  } ${theme === "light" ? "bg-white" : "bg-gray-800"}`}
                />
              </div>
            </div>
          )}

          {/* Location Tab Content - With Real Map */}
          {activeTab === "location" && (
            <div className="space-y-1.5">
              <div className="grid grid-cols-2 gap-1">
                <div className="space-y-0.5">
                  <label
                    htmlFor="location"
                    className={`block text-[9px] font-medium ${
                      theme === "light" ? "text-gray-700" : "text-gray-300"
                    }`}
                  >
                    Location
                  </label>
                  <input
                    id="location"
                    name="location"
                    type="text"
                    value={formData.location}
                    onChange={handleChange}
                    className={`w-full px-1 py-0.5 text-[9px] border rounded-md focus:outline-none focus:ring-1 focus:ring-sky-500 ${
                      errors.location
                        ? "border-red-500"
                        : theme === "light"
                        ? "border-gray-300"
                        : "border-gray-600"
                    } ${theme === "light" ? "bg-white" : "bg-gray-800"}`}
                  />
                  {errors.location && (
                    <p className="text-red-500 text-[8px]">{errors.location}</p>
                  )}
                </div>

                <div className="space-y-0.5">
                  <label
                    htmlFor="locationLink"
                    className={`block text-[9px] font-medium ${
                      theme === "light" ? "text-gray-700" : "text-gray-300"
                    }`}
                  >
                    Location Link
                  </label>
                  <input
                    id="locationLink"
                    name="locationLink"
                    type="text"
                    value={formData.locationLink}
                    onChange={handleChange}
                    className={`w-full px-1 py-0.5 text-[9px] border rounded-md focus:outline-none focus:ring-1 focus:ring-sky-500 ${
                      theme === "light" ? "border-gray-300" : "border-gray-600"
                    } ${theme === "light" ? "bg-white" : "bg-gray-800"}`}
                  />
                </div>
              </div>

              <div className="space-y-0.5">
                <label
                  className={`flex items-center text-[9px] font-medium ${
                    theme === "light" ? "text-gray-700" : "text-gray-300"
                  }`}
                >
                  <MapPin
                    className={`h-2.5 w-2.5 mr-1 ${
                      theme === "light" ? "text-sky-500" : "text-sky-300"
                    }`}
                  />
                  Select Location on Map
                </label>
                <div
                  className={`h-[120px] w-full relative rounded-md border overflow-hidden ${
                    theme === "light" ? "border-gray-300" : "border-gray-600"
                  }`}
                >
                  <RealMapSelector
                    initialLat={formData.latitude}
                    initialLng={formData.longitude}
                    onLocationSelect={handleLocationSelect}
                  />
                </div>
                <div
                  className={`flex gap-1 text-[9px] ${
                    theme === "light" ? "text-gray-500" : "text-gray-400"
                  }`}
                >
                  <div>Lat: {formData.latitude.toFixed(6)}</div>
                  <div>Lng: {formData.longitude.toFixed(6)}</div>
                </div>
              </div>
            </div>
          )}

          {/* Additional Tab Content - Compact */}
          {activeTab === "additional" && (
            <div className="space-y-1.5">
              <div className="space-y-0.5">
                <label
                  htmlFor="about"
                  className={`block text-[9px] font-medium ${
                    theme === "light" ? "text-gray-700" : "text-gray-300"
                  }`}
                >
                  About Doctor
                </label>
                <textarea
                  id="about"
                  name="about"
                  value={formData.about}
                  onChange={handleChange}
                  className={`w-full px-1 py-0.5 text-[9px] border rounded-md focus:outline-none focus:ring-1 focus:ring-sky-500 min-h-[40px] max-h-[60px] ${
                    errors.about
                      ? "border-red-500"
                      : theme === "light"
                      ? "border-gray-300"
                      : "border-gray-600"
                  } ${theme === "light" ? "bg-white" : "bg-gray-800"}`}
                />
                {errors.about && (
                  <p className="text-red-500 text-[8px]">{errors.about}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-1">
                <div className="space-y-0.5">
                  <label
                    htmlFor="whatsAppLink"
                    className={`block text-[9px] font-medium ${
                      theme === "light" ? "text-gray-700" : "text-gray-300"
                    }`}
                  >
                    WhatsApp Link
                  </label>
                  <input
                    id="whatsAppLink"
                    name="whatsAppLink"
                    type="text"
                    value={formData.whatsAppLink}
                    onChange={handleChange}
                    className={`w-full px-1 py-0.5 text-[9px] border rounded-md focus:outline-none focus:ring-1 focus:ring-sky-500 ${
                      theme === "light" ? "border-gray-300" : "border-gray-600"
                    } ${theme === "light" ? "bg-white" : "bg-gray-800"}`}
                  />
                </div>

                <div className="space-y-0.5">
                  <label
                    htmlFor="imageDoctor"
                    className={`block text-[9px] font-medium ${
                      theme === "light" ? "text-gray-700" : "text-gray-300"
                    }`}
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
                    />
                    <label
                      htmlFor="imageDoctor"
                      className={`inline-block px-2 py-1 text-[9px] font-medium rounded-md cursor-pointer transition-colors ${
                        theme === "light"
                          ? "bg-sky-100 text-sky-700 hover:bg-sky-200 border border-gray-300"
                          : "bg-sky-900 text-sky-300 hover:bg-sky-800 border border-gray-600"
                      }`}
                    >
                      {imagePreview ? "Edit Image" : "Upload Image"}
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Working Hours Tab Content */}
          {activeTab === "workinghours" && (
            <div className="space-y-1.5">
              <div
                className={`p-2 rounded-md border ${
                  theme === "light"
                    ? "bg-sky-50 border-sky-100"
                    : "bg-sky-900 border-sky-800"
                }`}
              >
                <div className="flex items-center mb-1">
                  <Clock
                    className={`h-2.5 w-2.5 ${
                      theme === "light" ? "text-sky-500" : "text-sky-300"
                    } mr-1`}
                  />
                  <h3
                    className={`text-[9px] font-medium ${
                      theme === "light" ? "text-sky-700" : "text-sky-200"
                    }`}
                  >
                    Doctor Working Hours
                  </h3>
                </div>
                <p
                  className={`text-[8px] ${
                    theme === "light" ? "text-gray-600" : "text-gray-400"
                  } mb-1.5`}
                >
                  Set up your working days and hours to let your patients know
                  when you're available.
                </p>

                {/* Note about saving first */}
                {!doctor?.id ? (
                  <div
                    className={`p-1 rounded border text-[8px] ${
                      theme === "light"
                        ? "bg-amber-50 border-amber-200 text-amber-800"
                        : "bg-amber-900 border-amber-800 text-amber-200"
                    } mb-1.5`}
                  >
                    Please save the doctor profile first before adding working
                    hours.
                  </div>
                ) : null}

                <button
                  type="button"
                  onClick={handleOpenWorkingHours}
                  disabled={!doctor?.id}
                  className={`w-full flex items-center justify-center py-1 px-2 rounded-md text-[9px] font-medium ${
                    doctor?.id
                      ? theme === "light"
                        ? "bg-sky-600 text-white hover:bg-sky-700"
                        : "bg-sky-700 text-white hover:bg-sky-800"
                      : theme === "light"
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : "bg-gray-600 text-gray-400 cursor-not-allowed"
                  }`}
                >
                  <Clock
                    className={`h-2.5 w-2.5 mr-1 ${
                      doctor?.id
                        ? "text-white"
                        : theme === "light"
                        ? "text-gray-500"
                        : "text-gray-400"
                    }`}
                  />
                  {doctor?.id ? "Manage Working Hours" : "Save Profile First"}
                </button>
              </div>
            </div>
          )}

          {/* Action Buttons - Compact */}
          <div
            className={`flex justify-end mt-2 pt-1 border-t ${
              theme === "light" ? "border-gray-200" : "border-gray-600"
            }`}
          >
            <button
              type="button"
              onClick={onClose}
              className={`${
                theme === "light"
                  ? "bg-gray-400 hover:bg-gray-500"
                  : "bg-gray-600 hover:bg-gray-700"
              } text-white px-2 py-0.5 rounded-md mr-1 transition-colors text-[9px] cursor-pointer`}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`${
                theme === "light"
                  ? "bg-sky-600 hover:bg-sky-700"
                  : "bg-sky-700 hover:bg-sky-800"
              } text-white px-2 py-0.5 rounded-md transition-colors text-[9px] cursor-pointer`}
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
          theme={theme}
        />
      )}
    </div>
  );
};

export default DoctorForm;


