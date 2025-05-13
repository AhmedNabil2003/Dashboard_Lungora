import { useState, useEffect } from "react"
import { Search, MapPin, Phone, Smartphone, Mail, Stethoscope, Users, Trash, Edit, Clock, ExternalLink
} from "lucide-react"
import { getDoctorWorkingHours } from "../../services/apiDoctors"

const DoctorList = ({
  doctors,
  onEdit,
  onDelete,
  onAddDoctor,
  onEditWorkingHours,
}) => {
  const [searchText, setSearchText] = useState("")
  const [filters, setFilters] = useState({ location: "", specialization: "" })
  const [filteredData, setFilteredData] = useState(doctors)
  const [selectedDoctor, setSelectedDoctor] = useState(null)
  const [detailsModalOpen, setDetailsModalOpen] = useState(false)
  const [doctorWorkingHours, setDoctorWorkingHours] = useState([])
  const [loadingHours, setLoadingHours] = useState(false)

  // Apply filters
 useEffect(() => {
  let filtered = doctors;

  if (searchText) {
    filtered = filtered.filter(
      (doctor) =>
        doctor.name.toLowerCase().includes(searchText.toLowerCase()) ||
        doctor.emailDoctor?.toLowerCase().includes(searchText.toLowerCase()) ||
        doctor.phone?.includes(searchText) ||
        doctor.teliphone?.includes(searchText),
    );
  }

  if (filters.location) {
    filtered = filtered.filter((doctor) => doctor.location?.toLowerCase().includes(filters.location.toLowerCase()));
  }

  if (filters.specialization) {
    filtered = filtered.filter((doctor) => {
      // Check for specialization directly
      if (
        doctor.specialization &&
        doctor.specialization.toLowerCase().includes(filters.specialization.toLowerCase())
      ) {
        return true;
      }

      // Check for specialization in category
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
    setSelectedDoctor(doctor)
    setDetailsModalOpen(true)

    try {
      setLoadingHours(true)
      const hours = await getDoctorWorkingHours(doctor.id)
      setDoctorWorkingHours(hours || [])
    } catch (error) {
      console.error("Error fetching working hours:", error)
      setDoctorWorkingHours([])
    } finally {
      setLoadingHours(false)
    }
  }

  // Close modal
  const closeDetailsModal = () => {
    setDetailsModalOpen(false)
    setSelectedDoctor(null)
    setDoctorWorkingHours([])
  }

  return (
    <div className="mr-4">
      <h1 className="text-sky-600 text-4xl font-bold mb-8 text-center">Manage Doctors</h1>

      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
        <div className="flex items-center bg-white p-2 rounded-lg shadow-md w-full md:w-1/3">
          <Search size={20} className="text-sky-500 mr-2" />
          <input
            type="text"
            placeholder="Search by name, email, or phone"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="w-full p-2 focus:outline-none"
          />
        </div>

        <div className="flex items-center bg-white p-2 rounded-lg shadow-md w-full md:w-1/4">
          <MapPin size={20} className="text-sky-500 mr-2" />
          <input
            type="text"
            placeholder="Filter by location"
            value={filters.location}
            onChange={(e) => setFilters({ ...filters, location: e.target.value })}
            className="w-full p-2 focus:outline-none"
          />
        </div>

        <div className="flex items-center bg-white p-2 rounded-lg shadow-md w-full md:w-1/4">
          <Stethoscope size={20} className="text-sky-500 mr-2" />
          <input
            type="text"
            placeholder="Filter by specialization"
            value={filters.specialization}
            onChange={(e) => setFilters({ ...filters, specialization: e.target.value })}
            className="w-full p-2 focus:outline-none"
          />
        </div>

        <button
          onClick={onAddDoctor}
          className="bg-sky-600 text-white px-6 py-2 rounded-lg hover:bg-sky-700 w-full md:w-auto transition duration-200 shadow-md"
        >
          Add Doctor
        </button>
      </div>

      {/* Doctor Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredData.length > 0 ? (
          filteredData.map((doctor) => (
            <div
              key={doctor.id}
              className="bg-white rounded-lg shadow-lg p-4 relative hover:shadow-xl transition duration-300"
            >
              {/* Doctor Image and Name */}
              <div className="flex items-center mb-4">
                <img
                  src={doctor.imageDoctor || "/placeholder.svg?height=80&width=80"}
                  alt={doctor.name}
                  className="w-20 h-20 rounded-full border-2 border-sky-200 shadow-sm mr-4 object-cover"
                />
                <div>
                  <h2 className="text-lg font-bold text-sky-800">{doctor.name}</h2>
                  <p className="text-sm text-gray-500">
                    {doctor.category?.categoryName || doctor.specialization}
                  </p>
                </div>
              </div>

              {/* Brief Doctor Info */}
              <div className="text-sm text-gray-700 space-y-2">
                <p className="flex items-center">
                  <MapPin className="w-4 h-4 mr-2 text-sky-500" /> {doctor.location || "Not specified"}
                </p>
                <p className="flex items-center">
                  <Phone className="w-4 h-4 mr-2 text-sky-500" /> {doctor.phone || "Not specified"}
                </p>
                <p className="flex items-center">
                  <Smartphone className="w-4 h-4 mr-2 text-sky-500" /> {doctor.teliphone || "Not specified"}
                </p>
                <p className="flex items-center">
                  <Stethoscope className="w-4 h-4 mr-2 text-sky-500" />
                  Experience: {doctor.experianceYears || "0"} years
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-between items-center mt-4">
                <button
                  onClick={() => openDetailsModal(doctor)}
                  className="bg-sky-600 text-white py-1 px-4 rounded-lg hover:bg-sky-700 text-sm transition duration-200"
                >
                  View Details
                </button>

                <button
                  onClick={() => onEditWorkingHours(doctor)}
                  className="bg-sky-600 text-white py-1 px-3 rounded-lg hover:bg-sky-700 text-sm transition duration-200 flex items-center"
                >
                  <Clock size={14} className="mr-1" /> Working Hours
                </button>
              </div>

              {/* Edit and Delete Buttons */}
              <div className="absolute top-2 right-2 flex space-x-2">
                <button
                  onClick={() => onEdit(doctor)}
                  className="text-yellow-500 hover:text-yellow-600 bg-yellow-50 p-1 rounded-full transition duration-200"
                >
                  <Edit size={18} />
                </button>
                <button
                  onClick={() => onDelete(doctor.id)}
                  className="text-red-500 hover:text-red-600 bg-red-50 p-1 rounded-full transition duration-200"
                >
                  <Trash size={18} />
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-red-500 col-span-full py-8">No doctors found</p>
        )}
      </div>

      {/* Doctor Details Modal */}
      {detailsModalOpen && selectedDoctor && (
        <div className="fixed inset-0 flex justify-center items-center z-50 ">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 m-4">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-xl font-bold text-sky-600">{selectedDoctor.name}</h2>
              <button onClick={closeDetailsModal} className="text-gray-400 hover:text-gray-600">
                ✕
              </button>
            </div>

            {/* Doctor Image and Category */}
            <div className="flex items-center mb-4">
              <img
                src={selectedDoctor.imageDoctor || "/placeholder.svg?height=80&width=80"}
                alt={selectedDoctor.name}
                className="w-16 h-16 rounded-full border-2 border-sky-200 shadow-sm mr-4 object-cover"
              />
              <div>
                <p className="text-sm text-gray-500">{selectedDoctor.category?.categoryName || "Not specified"}</p>
                <p className="text-sm text-gray-500">
                  <span className="flex items-center mt-1">
                    <Users className="w-4 h-4 mr-1 text-sky-500" /> {selectedDoctor.numOfPatients || "0"}+ patients
                  </span>
                </p>
              </div>
            </div>

            {/* Doctor Info in Compact Grid */}
            <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
              <div className="flex items-start">
                <MapPin className="w-4 h-4 mr-2 text-sky-500 mt-0.5" />
                <div>
                  <p className="font-medium text-gray-700">Location</p>
                  <p className="text-gray-600">{selectedDoctor.location || "Not specified"}</p>
                </div>
              </div>

              <div className="flex items-start">
                <Phone className="w-4 h-4 mr-2 text-sky-500 mt-0.5" />
                <div>
                  <p className="font-medium text-gray-700">Phone</p>
                  <p className="text-gray-600">{selectedDoctor.phone || "Not specified"}</p>
                </div>
              </div>

              <div className="flex items-start">
                <Smartphone className="w-4 h-4 mr-2 text-sky-500 mt-0.5" />
                <div>
                  <p className="font-medium text-gray-700">Mobile</p>
                  <p className="text-gray-600">{selectedDoctor.teliphone || "Not specified"}</p>
                </div>
              </div>

              <div className="flex items-start">
                <Mail className="w-4 h-4 mr-2 text-sky-500 mt-0.5" />
                <div>
                  <p className="font-medium text-gray-700">Email</p>
                  <p className="text-gray-600 truncate max-w-[120px]">
                    {selectedDoctor.emailDoctor || "Not specified"}
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <Stethoscope className="w-4 h-4 mr-2 text-sky-500 mt-0.5" />
                <div>
                  <p className="font-medium text-gray-700">Experience</p>
                  <p className="text-gray-600">{selectedDoctor.experianceYears || "0"} years</p>
                </div>
              </div>
            </div>

            {/* Working Hours Section */}
            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-medium text-gray-700 text-sm">Working Hours</h3>
                <button
                  onClick={() => {
                    closeDetailsModal()
                    onEditWorkingHours(selectedDoctor)
                  }}
                  className="text-sky-600 text-xs underline flex items-center"
                >
                  <Edit size={10} className="mr-1" /> Edit
                </button>
              </div>

              {loadingHours ? (
                <div className="flex justify-center py-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-sky-600"></div>
                </div>
              ) : doctorWorkingHours.length > 0 ? (
                <div className="bg-gray-50 rounded-md p-2 max-h-[150px] overflow-y-auto">
                  {doctorWorkingHours.map((workingHour, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center py-1 border-b border-gray-100 last:border-0"
                    >
                      <span className="font-medium text-xs">{workingHour.dayOfWeek}</span>
                      <span className="text-xs text-gray-600">
                        {workingHour.startTime.substring(0, 5)} - {workingHour.endTime.substring(0, 5)}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-gray-500 italic">No working hours specified</p>
              )}
            </div>

            {/* About Doctor - Compact */}
            <div className="mb-4">
              <h3 className="font-medium text-gray-700 text-sm mb-1">About Doctor</h3>
              <p className="text-gray-600 text-sm max-h-20 overflow-y-auto">
                {selectedDoctor.about || "No information available"}
              </p>
            </div>

            {/* Links - Compact Row */}
            <div className="flex flex-wrap gap-2 mb-4">
              {selectedDoctor.locationLink && (
                <a
                  href={selectedDoctor.locationLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-blue-100 text-blue-600 py-1 px-2 rounded-full text-xs flex items-center hover:bg-blue-200 transition duration-200"
                >
                  <MapPin size={12} className="mr-1" /> Map
                </a>
              )}

              {selectedDoctor.whatsAppLink && (
                <a
                  href={selectedDoctor.whatsAppLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-green-100 text-green-600 py-1 px-2 rounded-full text-xs flex items-center hover:bg-green-200 transition duration-200"
                >
                  <ExternalLink size={12} className="mr-1" /> WhatsApp
                </a>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end pt-3 border-t border-gray-200">
              <button
                onClick={() => {
                  closeDetailsModal()
                  onEdit(selectedDoctor)
                }}
                className="bg-yellow-500 text-white px-3 py-1.5 rounded-lg hover:bg-yellow-600 mr-2 transition duration-200 text-sm"
              >
                Edit Doctor
              </button>

              <button
                onClick={() => {
                  closeDetailsModal()
                  onEditWorkingHours(selectedDoctor)
                }}
                className="bg-sky-600 text-white px-3 py-1.5 rounded-lg hover:bg-sky-700 transition duration-200 text-sm flex items-center"
              >
                <Clock size={14} className="mr-1" /> Edit Hours
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default DoctorList