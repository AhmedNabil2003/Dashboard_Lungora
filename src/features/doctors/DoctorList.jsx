import { useState, useEffect, useContext } from "react";
import {
  Search,
  MapPin,
  Phone,
  Smartphone,
  Mail,
  Stethoscope,
  Users,
  Trash,
  Edit,
  Clock,
  ExternalLink,
} from "lucide-react";
import { ThemeContext } from "../../context/ThemeContext";
import { getDoctorWorkingHours } from "../../services/apiDoctors";

const DoctorList = ({
  doctors,
  onEdit,
  onDelete,
  onAddDoctor,
  onEditWorkingHours,
}) => {
  const { theme } = useContext(ThemeContext);
  const [searchText, setSearchText] = useState("");
  const [filters, setFilters] = useState({ location: "", specialization: "" });
  const [filteredData, setFilteredData] = useState(doctors);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [doctorWorkingHours, setDoctorWorkingHours] = useState([]);
  const [loadingHours, setLoadingHours] = useState(false);
  const [visibleDoctors, setVisibleDoctors] = useState(6);

  // Apply filters
  useEffect(() => {
    let filtered = doctors;

    if (searchText) {
      filtered = filtered.filter(
        (doctor) =>
          doctor.name.toLowerCase().includes(searchText.toLowerCase()) ||
          doctor.emailDoctor?.toLowerCase().includes(searchText.toLowerCase()) ||
          doctor.phone?.includes(searchText) ||
          doctor.teliphone?.includes(searchText)
      );
    }

    if (filters.location) {
      filtered = filtered.filter((doctor) =>
        doctor.location?.toLowerCase().includes(filters.location.toLowerCase())
      );
    }

    if (filters.specialization) {
      filtered = filtered.filter((doctor) => {
        if (
          doctor.specialization &&
          doctor.specialization.toLowerCase().includes(filters.specialization.toLowerCase())
        ) {
          return true;
        }
        if (
          doctor.category?.categoryName &&
          doctor.category.categoryName.toLowerCase().includes(filters.specialization.toLowerCase())
        ) {
          return true;
        }
        return false;
      });
    }

    setFilteredData(filtered);
  }, [doctors, searchText, filters]);

  // Open doctor details and fetch working hours
  const openDetailsModal = async (doctor) => {
    setSelectedDoctor(doctor);
    setDetailsModalOpen(true);

    try {
      setLoadingHours(true);
      const hours = await getDoctorWorkingHours(doctor.id);
      setDoctorWorkingHours(hours || []);
    } catch (error) {
      console.error("Error fetching working hours:", error);
      setDoctorWorkingHours([]);
    } finally {
      setLoadingHours(false);
    }
  };

  // Close modal
  const closeDetailsModal = () => {
    setDetailsModalOpen(false);
    setSelectedDoctor(null);
    setDoctorWorkingHours([]);
  };

  return (
    <div className="mr-4">
      <h1 className={`text-3xl font-bold mb-8 text-center ${
        theme === "light" ? "text-sky-600" : "text-sky-300"
      }`}>
        Manage Doctors
      </h1>

      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
        <div className={`flex items-center ${
          theme === "light" ? "bg-white" : "bg-gray-800"
        } p-2 rounded-lg shadow-md w-full md:w-1/3`}>
          <Search
            size={16}
            className={`${
              theme === "light" ? "text-sky-500" : "text-sky-300"
            } mr-2`}
          />
          <input
            type="text"
            placeholder="Search by name, email, or phone"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className={`w-full p-1 focus:outline-none ${
              theme === "light" ? "text-gray-800 bg-transparent" : "text-gray-100 bg-transparent"
            } text-sm`}
          />
        </div>

        <div className={`flex items-center ${
          theme === "light" ? "bg-white" : "bg-gray-800"
        } p-2 rounded-lg shadow-md w-full md:w-1/4`}>
          <MapPin
            size={16}
            className={`${
              theme === "light" ? "text-sky-500" : "text-sky-300"
            } mr-2`}
          />
          <input
            type="text"
            placeholder="Filter by location"
            value={filters.location}
            onChange={(e) => setFilters({ ...filters, location: e.target.value })}
            className={`w-full p-1 focus:outline-none ${
              theme === "light" ? "text-gray-800 bg-transparent" : "text-gray-100 bg-transparent"
            } text-sm`}
          />
        </div>

        <div className={`flex items-center ${
          theme === "light" ? "bg-white" : "bg-gray-800"
        } p-2 rounded-lg shadow-md w-full md:w-1/4`}>
          <Stethoscope
            size={16}
            className={`${
              theme === "light" ? "text-sky-500" : "text-sky-300"
            } mr-2`}
          />
          <input
            type="text"
            placeholder="Filter by specialization"
            value={filters.specialization}
            onChange={(e) => setFilters({ ...filters, specialization: e.target.value })}
            className={`w-full p-1 focus:outline-none ${
              theme === "light" ? "text-gray-800 bg-transparent" : "text-gray-100 bg-transparent"
            } text-sm`}
          />
        </div>

        <button
          onClick={onAddDoctor}
          className={`${
            theme === "light"
              ? "bg-sky-600 hover:bg-sky-700"
              : "bg-sky-700 hover:bg-sky-800"
          } text-white px-4 py-1.5 rounded-lg w-full md:w-auto transition duration-200 shadow-md text-sm cursor-pointer`}
        >
          Add Doctor
        </button>
      </div>

      {/* Doctor Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredData.length > 0 ? (
          filteredData.slice(0, visibleDoctors).map((doctor) => (
            <div
              key={doctor.id}
              className={`${
                theme === "light" ? "bg-white" : "bg-gray-800"
              } rounded-lg shadow-lg p-4 relative hover:shadow-xl transition duration-300`}
            >
              {/* Doctor Image and Name */}
              <div className="flex items-center mb-3">
                <img
                  src={doctor.imageDoctor || "/placeholder.svg?height=80&width=80"}
                  alt={doctor.name}
                  className="w-16 h-16 rounded-full border-2 border-sky-200 shadow-sm mr-3 object-cover"
                />
                <div>
                  <h2
                    className={`text-base font-bold ${
                      theme === "light" ? "text-sky-800" : "text-sky-100"
                    }`}
                  >
                    Dr. {doctor.name}
                  </h2>
                  <p
                    className={`text-sm ${
                      theme === "light" ? "text-gray-500" : "text-gray-400"
                    }`}
                  >
                    {doctor.category?.categoryName || doctor.specialization}
                  </p>
                </div>
              </div>

              {/* Brief Doctor Info */}
              <div
                className={`text-sm ${
                  theme === "light" ? "text-gray-700" : "text-gray-300"
                } space-y-1.5`}
              >
                <p className="flex items-center">
                  <MapPin
                    className={`w-3 h-3 mr-1.5 ${
                      theme === "light" ? "text-sky-500" : "text-sky-300"
                    }`}
                  />
                  {doctor.location || "Not specified"}
                </p>
                <p className="flex items-center">
                  <Phone
                    className={`w-3 h-3 mr-1.5 ${
                      theme === "light" ? "text-sky-500" : "text-sky-300"
                    }`}
                  />
                  {doctor.phone || "Not specified"}
                </p>
                <p className="flex items-center">
                  <Smartphone
                    className={`w-3 h-3 mr-1.5 ${
                      theme === "light" ? "text-sky-500" : "text-sky-300"
                    }`}
                  />
                  {doctor.teliphone || "Not specified"}
                </p>
                <p className="flex items-center">
                  <Stethoscope
                    className={`w-3 h-3 mr-1.5 ${
                      theme === "light" ? "text-sky-500" : "text-sky-300"
                    }`}
                  />
                  Experience: {doctor.experianceYears || "0"} years
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-between items-center mt-3">
                <button
                  onClick={() => openDetailsModal(doctor)}
                  className={`${
                    theme === "light"
                      ? "bg-sky-600 hover:bg-sky-700"
                      : "bg-sky-700 hover:bg-sky-800"
                  } text-white py-1 px-3 rounded-lg text-sm transition duration-200 cursor-pointer`}
                >
                  View Details
                </button>

                <button
                  onClick={() => onEditWorkingHours(doctor)}
                  className={`${
                    theme === "light"
                      ? "bg-sky-600 hover:bg-sky-700"
                      : "bg-sky-700 hover:bg-sky-800"
                  } text-white py-1 px-2 rounded-lg text-sm transition duration-200 flex items-center cursor-pointer`}
                >
                  <Clock size={12} className="mr-1" /> Working Hours
                </button>
              </div>

              {/* Edit and Delete Buttons */}
              <div className="absolute top-2 right-2 flex space-x-1.5">
                <button
                  onClick={() => onEdit(doctor)}
                  className={`${
                    theme === "light"
                      ? "text-sky-500 hover:text-sky-600 bg-sky-50"
                      : "text-sky-300 hover:text-sky-400 bg-sky-900"
                  } p-1 rounded-full transition duration-200 cursor-pointer`}
                >
                  <Edit size={14} />
                </button>
                <button
                  onClick={() => onDelete(doctor.id)}
                  className={`${
                    theme === "light"
                      ? "text-red-500 hover:text-red-600 bg-red-50"
                      : "text-red-300 hover:text-red-400 bg-red-900"
                  } p-1 rounded-full transition duration-200 cursor-pointer`}
                >
                  <Trash size={14} />
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className={`text-center ${
            theme === "light" ? "text-red-500" : "text-red-300"
          } col-span-full py-8 text-sm`}>
            No doctors found
          </p>
        )}
      </div>

      {/* Load More Button */}
      {filteredData.length > visibleDoctors && (
        <div className="flex justify-center mt-8">
          <button
            onClick={() => setVisibleDoctors(prev => prev + 6)}
            className={`${
              theme === "light"
                ? "bg-sky-600 hover:bg-sky-700"
                : "bg-sky-700 hover:bg-sky-800"
            } text-white px-6 py-2 rounded-lg transition duration-200 shadow-md text-sm cursor-pointer flex items-center gap-2`}
          >
            <span>Load More Doctors</span>
            <span className="text-xs opacity-80">({filteredData.length - visibleDoctors} remaining)</span>
          </button>
        </div>
      )}

      {/* Doctor Details Modal */}
      {detailsModalOpen && selectedDoctor && (
        <div className="fixed inset-0 flex justify-center items-center z-50 bg-black bg-opacity-50">
          <div
            className={`${
              theme === "light" ? "bg-white" : "bg-gray-800"
            } rounded-lg shadow-xl w-full max-w-md p-5 m-4 max-h-[90vh] overflow-y-auto`}
          >
            <div className="flex justify-between items-start mb-3">
              <h2
                className={`text-lg font-bold ${
                  theme === "light" ? "text-sky-600" : "text-sky-300"
                }`}
              >
                Dr. {selectedDoctor.name}
              </h2>
              <button
                onClick={closeDetailsModal}
                className={`${
                  theme === "light" ? "text-gray-400 hover:text-gray-600" : "text-gray-500 hover:text-gray-300"
                } cursor-pointer text-xl`}
              >
                ✕
              </button>
            </div>

            {/* Doctor Image and Category */}
            <div className="flex items-center mb-3">
              <img
                src={selectedDoctor.imageDoctor || "/placeholder.svg?height=80&width=80"}
                alt={selectedDoctor.name}
                className="w-14 h-14 rounded-full border-2 border-sky-200 shadow-sm mr-3 object-cover"
              />
              <div>
                <p
                  className={`text-sm ${
                    theme === "light" ? "text-gray-500" : "text-gray-400"
                  }`}
                >
                  {selectedDoctor.category?.categoryName || "Not specified"}
                </p>
                <p
                  className={`text-sm ${
                    theme === "light" ? "text-gray-500" : "text-gray-400"
                  }`}
                >
                  <span className="flex items-center mt-0.5">
                    <Users
                      className={`w-3 h-3 mr-1 ${
                        theme === "light" ? "text-sky-500" : "text-sky-300"
                      }`}
                    />
                    {selectedDoctor.numOfPatients || "0"}+ patients
                  </span>
                </p>
              </div>
            </div>

            {/* Doctor Info in Compact Grid */}
            <div
              className={`grid grid-cols-2 gap-2 mb-3 text-sm ${
                theme === "light" ? "text-gray-700" : "text-gray-300"
              }`}
            >
              <div className="flex items-start">
                <MapPin
                  className={`w-3 h-3 mr-1.5 ${
                    theme === "light" ? "text-sky-500" : "text-sky-300"
                  } mt-0.5`}
                />
                <div>
                  <p
                    className={`font-medium ${
                      theme === "light" ? "text-gray-700" : "text-gray-300"
                    }`}
                  >
                    Location
                  </p>
                  <p>{selectedDoctor.location || "Not specified"}</p>
                </div>
              </div>

              <div className="flex items-start">
                <Phone
                  className={`w-3 h-3 mr-1.5 ${
                    theme === "light" ? "text-sky-500" : "text-sky-300"
                  } mt-0.5`}
                />
                <div>
                  <p
                    className={`font-medium ${
                      theme === "light" ? "text-gray-700" : "text-gray-300"
                    }`}
                  >
                    Phone
                  </p>
                  <p>{selectedDoctor.phone || "Not specified"}</p>
                </div>
              </div>

              <div className="flex items-start">
                <Smartphone
                  className={`w-3 h-3 mr-1.5 ${
                    theme === "light" ? "text-sky-500" : "text-sky-300"
                  } mt-0.5`}
                />
                <div>
                  <p
                    className={`font-medium ${
                      theme === "light" ? "text-gray-700" : "text-gray-300"
                    }`}
                  >
                    Mobile
                  </p>
                  <p>{selectedDoctor.teliphone || "Not specified"}</p>
                </div>
              </div>

              <div className="flex items-start">
                <Mail
                  className={`w-3 h-3 mr-1.5 ${
                    theme === "light" ? "text-sky-500" : "text-sky-300"
                  } mt-0.5`}
                />
                <div>
                  <p
                    className={`font-medium ${
                      theme === "light" ? "text-gray-700" : "text-gray-300"
                    }`}
                  >
                    Email
                  </p>
                  <p className="truncate max-w-[120px]">
                    {selectedDoctor.emailDoctor || "Not specified"}
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <Stethoscope
                  className={`w-3 h-3 mr-1.5 ${
                    theme === "light" ? "text-sky-500" : "text-sky-300"
                  } mt-0.5`}
                />
                <div>
                  <p
                    className={`font-medium ${
                      theme === "light" ? "text-gray-700" : "text-gray-300"
                    }`}
                  >
                    Experience
                  </p>
                  <p>{selectedDoctor.experianceYears || "0"} years</p>
                </div>
              </div>
            </div>

            {/* Working Hours Section */}
            <div className="mb-3">
              <div className="flex justify-between items-center mb-1.5">
                <h3
                  className={`font-medium text-sm ${
                    theme === "light" ? "text-gray-700" : "text-gray-300"
                  }`}
                >
                  Working Hours
                </h3>
                <button
                  onClick={() => {
                    closeDetailsModal();
                    onEditWorkingHours(selectedDoctor);
                  }}
                  className={`${
                    theme === "light" ? "text-sky-600" : "text-sky-300"
                  } text-xs underline flex items-center cursor-pointer`}
                >
                  <Edit size={10} className="mr-1" /> Edit
                </button>
              </div>

              {loadingHours ? (
                <div className="flex justify-center py-1.5">
                  <div
                    className={`animate-spin rounded-full h-4 w-4 border-b-2 ${
                      theme === "light" ? "border-sky-600" : "border-sky-300"
                    }`}
                  ></div>
                </div>
              ) : doctorWorkingHours.length > 0 ? (
                <div
                  className={`${
                    theme === "light" ? "bg-gray-50" : "bg-gray-700"
                  } rounded-md p-1.5 max-h-[150px] overflow-y-auto`}
                >
                  {doctorWorkingHours.map((workingHour, index) => (
                    <div
                      key={index}
                      className={`flex justify-between items-center py-0.5 border-b ${
                        theme === "light" ? "border-gray-100" : "border-gray-600"
                      } last:border-0`}
                    >
                      <span
                        className={`font-medium text-xs ${
                          theme === "light" ? "text-gray-700" : "text-gray-300"
                        }`}
                      >
                        {workingHour.dayOfWeek}
                      </span>
                      <span
                        className={`text-xs ${
                          theme === "light" ? "text-gray-600" : "text-gray-400"
                        }`}
                      >
                        {workingHour.startTime.substring(0, 5)} -{" "}
                        {workingHour.endTime.substring(0, 5)}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p
                  className={`text-xs italic ${
                    theme === "light" ? "text-gray-500" : "text-gray-400"
                  }`}
                >
                  No working hours specified
                </p>
              )}
            </div>

            {/* About Doctor - Compact */}
            <div className="mb-3">
              <h3
                className={`font-medium text-sm ${
                  theme === "light" ? "text-gray-700" : "text-gray-300"
                } mb-0.5`}
              >
                About Doctor
              </h3>
              <p
                className={`text-sm ${
                  theme === "light" ? "text-gray-600" : "text-gray-400"
                } max-h-20 overflow-y-auto`}
              >
                {selectedDoctor.about || "No information available"}
              </p>
            </div>

            {/* Links - Compact Row */}
            <div className="flex flex-wrap gap-1.5 mb-3">
              {selectedDoctor.locationLink && (
                <a
                  href={selectedDoctor.locationLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${
                    theme === "light"
                      ? "bg-blue-100 text-blue-600 hover:bg-blue-200"
                      : "bg-blue-900 text-blue-300 hover:bg-blue-800"
                  } py-0.5 px-1.5 rounded-full text-xs flex items-center transition duration-200`}
                >
                  <MapPin size={10} className="mr-1" /> Map
                </a>
              )}

              {selectedDoctor.whatsAppLink && (
                <a
                  href={selectedDoctor.whatsAppLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${
                    theme === "light"
                      ? "bg-green-100 text-green-600 hover:bg-green-200"
                      : "bg-green-900 text-green-300 hover:bg-green-800"
                  } py-0.5 px-1.5 rounded-full text-xs flex items-center transition duration-200`}
                >
                  <ExternalLink size={10} className="mr-1" /> WhatsApp
                </a>
              )}
            </div>

            {/* Action Buttons */}
            <div
              className={`flex justify-end pt-2 border-t ${
                theme === "light" ? "border-gray-200" : "border-gray-600"
              }`}
            >
              <button
                onClick={() => {
                  closeDetailsModal();
                  onEdit(selectedDoctor);
                }}
                className={`${
                  theme === "light"
                    ? "bg-sky-500 hover:bg-sky-600"
                    : "bg-sky-600 hover:bg-sky-700"
                } text-white px-2.5 py-1 rounded-lg mr-1.5 transition duration-200 text-sm cursor-pointer`}
              >
                Edit Doctor
              </button>

              <button
                onClick={() => {
                  closeDetailsModal();
                  onEditWorkingHours(selectedDoctor);
                }}
                className={`${
                  theme === "light"
                    ? "bg-sky-500 hover:bg-sky-600"
                    : "bg-sky-600 hover:bg-sky-700"
                } text-white px-2.5 py-1 rounded-lg transition duration-200 text-sm flex items-center cursor-pointer`}
              >
                <Clock size={12} className="mr-1" /> Edit Hours
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorList;