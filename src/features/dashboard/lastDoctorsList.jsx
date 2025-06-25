// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const DoctorsList = ({ doctors, theme, loading, error }) => {
  return (
    <motion.div
      className={`p-4 rounded-xl shadow-lg ${
        theme === "light"
          ? "bg-white border border-gray-100"
          : "bg-gray-800 border border-gray-700"
      }`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.3 }}
    >
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center">
          <i
            className={`fas fa-user-md mr-2 ${
              theme === "light" ? "text-sky-600" : "text-sky-400"
            }`}
          ></i>
          <h3
            className={`text-sm font-semibold ${
              theme === "light" ? "text-sky-800" : "text-gray-100"
            }`}
          >
            Our Doctors
          </h3>
        </div>
        {doctors && doctors.length > 0 && (
          <Link
            to="/dashboard/doctors"
            className={`text-xs px-2 py-1 rounded ${
              theme === "light"
                ? "text-sky-600 hover:bg-sky-50"
                : "text-sky-400 hover:bg-gray-700"
            } transition-colors`}
          >
            View All →
          </Link>
        )}
      </div>

      {loading ? (
        <div className="space-y-2">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className={`p-2 rounded-lg ${
                theme === "light" ? "bg-gray-50" : "bg-gray-700"
              } animate-pulse`}
            >
              <div className="flex space-x-2">
                <div
                  className={`w-10 h-10 rounded-full ${
                    theme === "light" ? "bg-gray-200" : "bg-gray-600"
                  }`}
                ></div>
                <div className="flex-1 space-y-1.5">
                  <div
                    className={`h-3 rounded ${
                      theme === "light" ? "bg-gray-200" : "bg-gray-600"
                    } w-3/4`}
                  ></div>
                  <div className="grid grid-cols-2 gap-1">
                    <div
                      className={`h-2.5 rounded ${
                        theme === "light" ? "bg-gray-200" : "bg-gray-600"
                      }`}
                    ></div>
                    <div
                      className={`h-2.5 rounded ${
                        theme === "light" ? "bg-gray-200" : "bg-gray-600"
                      }`}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : error ? (
        <div
          className={`p-2 rounded-lg text-center ${
            theme === "light"
              ? "bg-red-50 text-red-600"
              : "bg-red-900/20 text-red-400"
          }`}
        >
          <p className="text-xs">{error}</p>
        </div>
      ) : (
        <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
          {doctors && doctors.length > 0 ? (
            doctors.map((doctor, index) => (
              <motion.div
                key={doctor.id || index}
                whileHover={{ scale: 1.01 }}
                className={`p-2 rounded-lg border ${
                  theme === "light"
                    ? "bg-white border-gray-200 hover:border-sky-200"
                    : "bg-gray-800 border-gray-700 hover:border-sky-700"
                } transition-all`}
              >
                <div className="flex items-start space-x-2">
                  <img
                    src={
                      doctor.imageDoctor ||
                      "/placeholder.svg?height=40&width=40"
                    }
                    alt={doctor.name}
                    className="rounded-full w-9 h-9 object-cover flex-shrink-0 border border-white shadow"
                    onError={(e) => {
                      e.target.src = "/placeholder.svg?height=40&width=40";
                    }}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center justify-between gap-1">
                      <h4
                        className={`text-sm font-medium ${
                          theme === "light" ? "text-gray-800" : "text-gray-100"
                        }`}
                      >
                        Dr. {doctor.name}
                      </h4>
                      <span
                        className={`text-xs px-1.5 py-0.5 rounded-full ${
                          theme === "light"
                            ? "bg-sky-100 text-sky-800 border border-sky-200"
                            : "bg-sky-900/30 text-sky-400 border border-sky-800"
                        }`}
                      >
                        {doctor.category?.categoryName || "General"}
                      </span>
                    </div>

                    <div className="mt-1 space-y-1">
                      <div className="flex items-start">
                        <i
                          className={`fas fa-info-circle mt-0.5 mr-1.5 w-3.5 text-center text-xs ${
                            theme === "light"
                              ? "text-gray-400"
                              : "text-gray-500"
                          }`}
                        ></i>
                        <p
                          className={`text-xs ${
                            theme === "light"
                              ? "text-gray-600"
                              : "text-gray-300"
                          } line-clamp-1`}
                        >
                          {doctor.about || "No description available"}
                        </p>
                      </div>

                      <div className="grid grid-cols-2 gap-1">
                        <div className="flex items-center">
                          <i
                            className={`fas fa-map-marker-alt mr-1.5 w-3.5 text-center text-xs ${
                              theme === "light"
                                ? "text-gray-400"
                                : "text-gray-500"
                            }`}
                          ></i>
                          <span
                            className={`text-xs ${
                              theme === "light"
                                ? "text-gray-600"
                                : "text-gray-300"
                            } truncate`}
                          >
                            {doctor.location || "N/A"}
                          </span>
                        </div>

                        <div className="flex items-center">
                          <i
                            className={`fas fa-user-injured mr-1.5 w-3.5 text-center text-xs ${
                              theme === "light"
                                ? "text-gray-400"
                                : "text-gray-500"
                            }`}
                          ></i>
                          <span
                            className={`text-xs ${
                              theme === "light"
                                ? "text-gray-600"
                                : "text-gray-300"
                            }`}
                          >
                            {doctor.numOfPatients || 0} patients
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-1">
                        <div className="flex items-center">
                          <i
                            className={`fas fa-briefcase mr-1.5 w-3.5 text-center text-xs ${
                              theme === "light"
                                ? "text-gray-400"
                                : "text-gray-500"
                            }`}
                          ></i>
                          <span
                            className={`text-xs ${
                              theme === "light"
                                ? "text-gray-600"
                                : "text-gray-300"
                            }`}
                          >
                            {doctor.experianceYears || 0}+ yrs
                          </span>
                        </div>

                        <div className="flex items-center">
                          <i
                            className={`fas fa-envelope mr-1.5 w-3.5 text-center text-xs ${
                              theme === "light"
                                ? "text-gray-400"
                                : "text-gray-500"
                            }`}
                          ></i>
                          <span
                            className={`text-xs ${
                              theme === "light"
                                ? "text-gray-600"
                                : "text-gray-300"
                            } truncate`}
                          >
                            {doctor.emailDoctor || "No email"}
                          </span>
                        </div>
                      </div>

                      {(doctor.phone || doctor.teliphone) && (
                        <div className="flex flex-wrap gap-1 pt-1">
                          {doctor.phone && (
                            <a
                              href={`tel:${doctor.phone}`}
                              className={`px-1.5 py-0.5 rounded-md flex items-center text-xs ${
                                theme === "light"
                                  ? "bg-green-50 text-green-600 hover:bg-green-100 border border-green-100"
                                  : "bg-green-900/20 text-green-400 hover:bg-green-900/30 border border-green-800"
                              } transition-colors`}
                              title="Mobile"
                            >
                              <i className="fas fa-mobile-alt mr-1 text-xs"></i>
                              {doctor.phone}
                            </a>
                          )}

                          {doctor.teliphone && (
                            <a
                              href={`tel:${doctor.teliphone}`}
                              className={`px-1.5 py-0.5 rounded-md flex items-center text-xs ${
                                theme === "light"
                                  ? "bg-sky-50 text-sky-600 hover:bg-sky-100 border border-sky-100"
                                  : "bg-sky-900/20 text-sky-400 hover:bg-sky-900/30 border border-sky-800"
                              } transition-colors`}
                              title="Telephone"
                            >
                              <i className="fas fa-phone mr-1 text-xs"></i>
                              {doctor.teliphone}
                            </a>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <div
              className={`p-3 rounded-lg text-center ${
                theme === "light"
                  ? "bg-gray-50 text-gray-500"
                  : "bg-gray-700 text-gray-400"
              }`}
            >
              <p className="text-xs">No doctors available</p>
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
};

export default DoctorsList;
