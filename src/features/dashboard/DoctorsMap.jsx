
import { useState, useEffect } from "react"
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion"
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet"
import L from "leaflet"
import "leaflet/dist/leaflet.css"
import { useDoctors } from "../doctors/useDoctors"

// Fix for default markers in react-leaflet
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
})

// Map control component for auto-fitting bounds
const MapController = ({ doctors, doctorCoordinates }) => {
  const map = useMap()

  useEffect(() => {
    if (doctors && doctors.length > 0 && Object.keys(doctorCoordinates).length > 0) {
      const coordinates = Object.values(doctorCoordinates)
      if (coordinates.length > 0) {
        const group = new L.featureGroup(coordinates.map((coord) => L.marker(coord)))
        map.fitBounds(group.getBounds().pad(0.1))
      }
    }
  }, [map, doctors, doctorCoordinates])

  return null
}

const DoctorsMap = ({ theme }) => {
  const { doctors, loading, error } = useDoctors()
  const [doctorCoordinates, setDoctorCoordinates] = useState({})
  const [geocodingProgress, setGeocodingProgress] = useState(0)

  useEffect(() => {
    const mapStyles = `
      .leaflet-container {
        z-index: 1 !important;
      }
      
      .leaflet-control-container {
        z-index: 2 !important;
      }
      
      .leaflet-popup {
        z-index: 3 !important;
      }
      
      .leaflet-popup-pane {
        z-index: 3 !important;
      }
      
      .leaflet-marker-pane {
        z-index: 2 !important;
      }
      
      .leaflet-tile-pane {
        z-index: 1 !important;
      }
      
      .custom-doctor-marker {
        z-index: 2 !important;
      }
      
      aside {
        z-index: 50 !important;
      }
      
      .fixed {
        z-index: 60 !important;
      }
    `

    const styleElement = document.createElement("style")
    styleElement.id = "doctors-map-styles"
    styleElement.textContent = mapStyles

    const existingStyle = document.getElementById("doctors-map-styles")
    if (existingStyle) {
      existingStyle.remove()
    }

    document.head.appendChild(styleElement)

    return () => {
      const styleToRemove = document.getElementById("doctors-map-styles")
      if (styleToRemove) {
        styleToRemove.remove()
      }
    }
  }, [])

  // Create simple doctor marker icon
  const createDoctorIcon = (doctor) => {
    const iconHtml = `
      <div style="
        width: 50px; 
        height: 50px; 
        border-radius: 50%; 
        border: 3px solid #3B82F6; 
        overflow: hidden;
        background: white;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        cursor: pointer;
        transition: transform 0.2s ease;
        z-index: 1;
        position: relative;
      " onmouseover="this.style.transform='scale(1.1)'" onmouseout="this.style.transform='scale(1)'">
        <img 
          src="${doctor.imageDoctor || "/placeholder.svg?height=50&width=50"}" 
          alt="${doctor.name}" 
          style="width: 100%; height: 100%; object-fit: cover;" 
          onerror="this.src='/placeholder.svg?height=50&width=50'" 
        />
      </div>
    `

    return L.divIcon({
      html: iconHtml,
      className: "custom-doctor-marker",
      iconSize: [50, 50],
      iconAnchor: [25, 25],
      popupAnchor: [0, -25],
    })
  }

  // Geocoding effect
  useEffect(() => {
    const geocodeDoctors = async () => {
      if (!doctors || doctors.length === 0) return

      const coordinates = {}
      const totalDoctors = doctors.length
      let geocodedCount = 0

      try {
        for (const doctor of doctors) {
          if (doctor.latitude && doctor.longitude) {
            const lat = Number.parseFloat(doctor.latitude)
            const lng = Number.parseFloat(doctor.longitude)
            if (!isNaN(lat) && !isNaN(lng) && lat !== 0 && lng !== 0) {
              coordinates[doctor.id] = [lat, lng]
            }
          } else if (doctor.location) {
            try {
              const response = await fetch(
                `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(doctor.location + ", Egypt")}&limit=1`,
              )
              const data = await response.json()

              if (data && data.length > 0) {
                coordinates[doctor.id] = [Number.parseFloat(data[0].lat), Number.parseFloat(data[0].lon)]
              }
            } catch (error) {
              console.error(`Error geocoding address for doctor ${doctor.id}:`, error)
            }
          }

          geocodedCount++
          setGeocodingProgress((geocodedCount / totalDoctors) * 100)
          await new Promise((resolve) => setTimeout(resolve, 50))
        }

        setDoctorCoordinates(coordinates)
        setGeocodingProgress(100)
      } catch (error) {
        console.error("Error in geocoding:", error)
        setGeocodingProgress(100)
      }
    }

    geocodeDoctors()
  }, [doctors])

  return (
    <motion.div
      className={`rounded-lg shadow-lg overflow-hidden lg:col-span-2 relative ${
        theme === "light" ? "bg-white" : "bg-gray-800"
      }`}
      style={{ zIndex: 1 }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.5 }}
    >
      {/* Simple Header */}
      <div className={`p-2 border-b ${theme === "light" ? "border-gray-200" : "border-gray-600"}`}>
        <h3 className={`text-sm font-semibold ${theme === "light" ? "text-gray-800" : "text-gray-100"}`}>
          <i className="fas fa-map-marked-alt mr-2 text-blue-500"></i>
          Doctors Locations Map
        </h3>
        <p className={`text-sm ${theme === "light" ? "text-gray-600" : "text-gray-400"}`}>
          {doctors.length} doctors across Egypt
        </p>
      </div>

      {/* Progress Bar */}
      {geocodingProgress > 0 && geocodingProgress < 100 && (
        <div className="px-4 py-3">
          <div className="flex items-center justify-between text-sm mb-2">
            <span className={theme === "light" ? "text-gray-600" : "text-gray-400"}>Loading doctor locations...</span>
            <span className="font-medium text-blue-600">{Math.round(geocodingProgress)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${geocodingProgress}%` }}
            ></div>
          </div>
        </div>
      )}

      {/* Map Container */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className={`flex items-center space-x-3 ${theme === "light" ? "text-gray-500" : "text-gray-400"}`}>
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
            <span className="text-lg">Loading doctors...</span>
          </div>
        </div>
      ) : error ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <i className="fas fa-exclamation-triangle text-red-500 text-4xl mb-4"></i>
            <p className="text-red-500 text-sm">Error loading doctors: {error}</p>
          </div>
        </div>
      ) : (
        <div className="h-96 relative" style={{ zIndex: 1 }}>
          <MapContainer
            center={[26.8206, 30.8025]} // مركز مصر
            zoom={6}
            style={{
              height: "100%",
              width: "100%",
              zIndex: 1,
            }}
            className="rounded-b-lg"
            zoomControl={true}
            scrollWheelZoom={true}
            doubleClickZoom={true}
            touchZoom={true}
            boxZoom={true}
            keyboard={true}
            dragging={true}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              zIndex={1}
            />

            <MapController doctors={doctors} doctorCoordinates={doctorCoordinates} />

            {doctors.map((doctor) => {
              const coordinates = doctorCoordinates[doctor.id]
              if (!coordinates) return null

              return (
                <Marker key={doctor.id} position={coordinates} icon={createDoctorIcon(doctor)} zIndexOffset={100}>
                  <Popup
                    maxWidth={280}
                    closeButton={true}
                    autoClose={false}
                    closeOnEscapeKey={true}
                    className="custom-popup"
                  >
                    <div className="p-2">
                      {/* Doctor Header */}
                      <div className="flex items-center space-x-2 mb-2">
                        <img
                          src={doctor.imageDoctor || "/placeholder.svg?height=40&width=40"}
                          alt={doctor.name}
                          className="w-10 h-10 rounded-full object-cover border-2 border-blue-500"
                          onError={(e) => {
                            e.target.src = "/placeholder.svg?height=40&width=40"
                          }}
                        />
                        <div>
                          <h4 className="font-bold text-sm text-gray-800">Dr. {doctor.name}</h4>
                          <p className="text-blue-600 font-medium text-xs">
                            {doctor.category?.categoryName || "General Medicine"}
                          </p>
                        </div>
                      </div>

                      {/* Doctor Details */}
                      <div className="space-y-1 text-xs">
                        {doctor.about && <p className="text-gray-700 line-clamp-2">{doctor.about}</p>}

                        <div className="flex items-center justify-between">
                          {doctor.experianceYears > 0 && (
                            <span className="text-gray-600">
                              <i className="fas fa-user-md text-green-500 mr-1"></i>
                              {doctor.experianceYears} years
                            </span>
                          )}
                          {doctor.numOfPatients > 0 && (
                            <span className="text-gray-600">
                              <i className="fas fa-users text-purple-500 mr-1"></i>
                              {doctor.numOfPatients} patients
                            </span>
                          )}
                        </div>

                        <div className="flex items-center">
                          <i className="fas fa-map-marker-alt text-red-500 mr-1"></i>
                          <span className="text-gray-600 text-xs">{doctor.location || "Location not specified"}</span>
                        </div>

                        {/* Contact Buttons */}
                        {(doctor.phone || doctor.teliphone) && (
                          <div className="flex gap-1 mt-2">
                            {doctor.phone && (
                              <a
                                href={`tel:${doctor.phone}`}
                                className="flex items-center bg-green-500 text-white px-2 py-1 rounded text-xs hover:bg-green-600 transition-colors"
                              >
                                <i className="fas fa-phone mr-1"></i>
                                Call
                              </a>
                            )}
                            {doctor.teliphone && (
                              <a
                                href={`tel:${doctor.teliphone}`}
                                className="flex items-center bg-blue-500 text-white px-2 py-1 rounded text-xs hover:bg-blue-600 transition-colors"
                              >
                                <i className="fas fa-phone-alt mr-1"></i>
                                Office
                              </a>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </Popup>
                </Marker>
              )
            })}
          </MapContainer>
        </div>
      )}

      {/* Simple Footer */}
      {doctors && Object.keys(doctorCoordinates).length > 0 && (
        <div className={`p-2 text-center border-t ${theme === "light" ? "border-gray-200" : "border-gray-600"}`}>
          <p className={`text-sm ${theme === "light" ? "text-gray-600" : "text-gray-400"}`}>
            Showing {Object.keys(doctorCoordinates).length} of {doctors.length} doctors on the map
          </p>
        </div>
      )}
    </motion.div>
  )
}

export default DoctorsMap
