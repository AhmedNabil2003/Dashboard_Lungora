// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion"
import { Link } from "react-router-dom"

const DoctorsList = ({ doctors, theme, loading, error }) => {
  return (
    <motion.div
      className={`p-3 rounded-lg shadow h-full ${
        theme === "light" ? "bg-white text-gray-800" : "bg-gray-800 text-gray-100"
      }`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.3 }}
    >
      <h3
        className={`${theme === "light" ? "text-gray-800" : "text-gray-100"} text-sm font-semibold mb-2 pb-1 border-b`}
      >
        Doctors List
      </h3>
      {loading ? (
        <p className="text-center text-gray-500 py-4 text-xs">Loading doctors...</p>
      ) : error ? (
        <p className="text-red-500 text-center py-4 text-xs">{error}</p>
      ) : (
        <ul className="space-y-3 overflow-y-auto max-h-64">
          {doctors && doctors?.length > 0 ? (
            doctors.slice(0, 5).map((doctor, index) => (
              <li
                key={doctor.id || index}
                className={`p-3 rounded-lg ${
                  theme === "light" ? "bg-gray-50 hover:bg-gray-100" : "bg-gray-700 hover:bg-gray-600"
                } transition-colors duration-200`}
              >
                <div className="flex items-start space-x-3">
                  <img
                    src={doctor.imageDoctor || "/placeholder.svg?height=48&width=48"}
                    alt={doctor.name}
                    className="rounded-full w-12 h-12 object-cover flex-shrink-0"
                    onError={(e) => {
                      e.target.src = "/placeholder.svg?height=48&width=48"
                    }}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold text-sm">Dr. {doctor.name}</h4>
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${
                          theme === "light" ? "bg-blue-100 text-blue-800" : "bg-blue-900 text-blue-100"
                        }`}
                      >
                        {doctor.category?.categoryName || "General"}
                      </span>
                    </div>

                    <div className="mt-1 text-xs space-y-1">
                      <div className="flex items-start">
                        <i
                          className={`fas fa-info-circle mt-1 mr-2 w-4 text-center ${
                            theme === "light" ? "text-gray-500" : "text-gray-400"
                          }`}
                        ></i>
                        <p className={`${theme === "light" ? "text-gray-600" : "text-gray-300"} line-clamp-2`}>
                          {doctor.about || "No description available"}
                        </p>
                      </div>

                      <div className="flex items-center">
                        <i
                          className={`fas fa-map-marker-alt mr-2 w-4 text-center ${
                            theme === "light" ? "text-gray-500" : "text-gray-400"
                          }`}
                        ></i>
                        <p className={`${theme === "light" ? "text-gray-600" : "text-gray-300"}`}>
                          {doctor.location || "Location not specified"}
                        </p>
                      </div>

                      <div className="flex items-center">
                        <i
                          className={`fas fa-user-injured mr-2 w-4 text-center ${
                            theme === "light" ? "text-gray-500" : "text-gray-400"
                          }`}
                        ></i>
                        <p className={`${theme === "light" ? "text-gray-600" : "text-gray-300"}`}>
                          Patients: {doctor.numOfPatients || 0}
                        </p>
                      </div>

                      <div className="flex items-center">
                        <i
                          className={`fas fa-briefcase mr-2 w-4 text-center ${
                            theme === "light" ? "text-gray-500" : "text-gray-400"
                          }`}
                        ></i>
                        <p className={`${theme === "light" ? "text-gray-600" : "text-gray-300"}`}>
                          Experience: {doctor.experianceYears || 0} years
                        </p>
                      </div>

                      {(doctor.phone || doctor.teliphone) && (
                        <div className="flex flex-wrap gap-2 pt-2">
                          {doctor.phone && (
                            <a
                              href={`tel:${doctor.phone}`}
                              className={`p-2 rounded-lg flex items-center ${
                                theme === "light"
                                  ? "bg-green-50 text-green-600 hover:bg-green-100"
                                  : "bg-green-900 text-green-300 hover:bg-green-800"
                              }`}
                              title="Mobile"
                            >
                              <i className="fas fa-mobile-alt mr-1"></i>
                              <span className="text-xs ml-1">{doctor.phone}</span>
                            </a>
                          )}

                          {doctor.teliphone && (
                            <a
                              href={`tel:${doctor.teliphone}`}
                              className={`p-2 rounded-lg flex items-center ${
                                theme === "light"
                                  ? "bg-blue-50 text-blue-600 hover:bg-blue-100"
                                  : "bg-blue-900 text-blue-300 hover:bg-blue-800"
                              }`}
                              title="Telephone"
                            >
                              <i className="fas fa-phone mr-1"></i>
                              <span className="text-xs ml-1">{doctor.teliphone}</span>
                            </a>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </li>
            ))
          ) : (
            <li className="text-center text-gray-500 py-4 text-xs">No doctors available</li>
          )}
        </ul>
      )}
      {doctors && doctors.length > 0 && (
        <div className="text-right mt-2">
          <Link to="/dashboard/doctors" className="text-xs text-blue-500 hover:underline">
            View all doctors →
          </Link>
        </div>
      )}
    </motion.div>
  )
}

export default DoctorsList
