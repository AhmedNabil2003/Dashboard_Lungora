import  { useState, useEffect, useContext } from "react";
import { 
  MoreVertical, 
  Search, 
  Filter, 
  Users, 
  Calendar, 
  Mail, 
  User, 
  RefreshCw, 
  Plus,
  MapPin,
  Phone,
  Smartphone,
  Stethoscope,
  Clock,
  ExternalLink,
  Edit,
  Trash
} from "lucide-react";
import { ThemeContext } from "../../context/ThemeContext";

const DoctorList = ({
  doctors = [],
  onEdit,
  onDelete,
  onAddDoctor,
  onEditWorkingHours,
  isLoading = false
}) => {
  const { theme } = useContext(ThemeContext);
  const [menuOpen, setMenuOpen] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const doctorsPerPage = 8;
  const [specializationFilter, setSpecializationFilter] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);

  useEffect(() => {
    console.log('Doctors:', doctors);
    setFilteredData(Array.isArray(doctors) ? doctors : []);
  }, [doctors]);

  const toggleMenu = (id) => {
    setMenuOpen(menuOpen === id ? null : id);
  };

  const handleSpecializationFilterChange = (e) => {
    const value = e.target.value;
    setSpecializationFilter(value);
  };

  const handleLocationFilterChange = (e) => {
    const value = e.target.value;
    setLocationFilter(value);
  };

  const handleSearchChange = (value) => {
    setSearchTerm(value);
  };

  const openDetailsModal = (doctor) => {
    setSelectedDoctor(doctor);
    setDetailsModalOpen(true);
  };

  const closeDetailsModal = () => {
    setDetailsModalOpen(false);
    setSelectedDoctor(null);
  };

  useEffect(() => {
    try {
      let result = Array.isArray(doctors) ? [...doctors] : [];
      
      if (searchTerm) {
        result = result.filter(doctor =>
          doctor?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          doctor?.emailDoctor?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          doctor?.phone?.includes(searchTerm) ||
          doctor?.teliphone?.includes(searchTerm)
        );
      }

      if (specializationFilter) {
        result = result.filter(doctor => {
          const specialization = doctor?.specialization?.toLowerCase() || '';
          const categoryName = doctor?.category?.categoryName?.toLowerCase() || '';
          return specialization.includes(specializationFilter.toLowerCase()) ||
                 categoryName.includes(specializationFilter.toLowerCase());
        });
      }

      if (locationFilter) {
        result = result.filter(doctor => 
          doctor?.location?.toLowerCase().includes(locationFilter.toLowerCase())
        );
      }

      setFilteredData(result);
      setCurrentPage(1);
    } catch (error) {
      console.error("Error applying filters:", error);
      setFilteredData([]);
    }
  }, [searchTerm, specializationFilter, locationFilter, doctors]);

  useEffect(() => {
    const handleClickOutside = () => {
      if (menuOpen) setMenuOpen(null);
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [menuOpen]);

  // Pagination calculations
  const indexOfLastDoctor = currentPage * doctorsPerPage;
  const indexOfFirstDoctor = indexOfLastDoctor - doctorsPerPage;
  const currentDoctors = filteredData.slice(indexOfFirstDoctor, indexOfLastDoctor);
  const totalPages = Math.ceil(filteredData.length / doctorsPerPage);

  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="w-full space-y-6">
      {/* Header with title, add doctor button and refresh button */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className={`p-3 rounded-lg ${
            theme === "light" ? "bg-gradient-to-r from-sky-700 to-sky-600" : "bg-gradient-to-r from-sky-800 to-sky-700"
          }`}>
            <Stethoscope className="h-8 w-8 text-white" />
          </div>
          <div>
            <h3 className={`text-xl font-bold ${
              theme === "light" ? "text-gray-900" : "text-gray-200"
            }`}>Manage Doctors</h3>
            <p className={`text-sm ${
              theme === "light" ? "text-gray-600" : "text-gray-400"
            }`}>Manage and monitor doctor accounts</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          {/* Add Doctor Button */}
          <button
            onClick={onAddDoctor}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-white transition-colors ${
              theme === "light" ? "bg-sky-600 hover:bg-sky-700" : "bg-sky-700 hover:bg-sky-800"
            }`}
          >
            <Plus className="h-4 w-4" />
            <span>Add Doctor</span>
          </button>
        </div>
      </div>

      {/* Search and Filter Section */}
      <div className={`p-6 rounded-lg shadow-sm border ${
        theme === "light" ? "bg-white border-sky-100" : "bg-gray-800 border-sky-600"
      }`}>
        <div className="flex flex-col lg:flex-row items-center justify-between space-y-4 lg:space-y-0 lg:space-x-4">
          {/* Search Input */}
          <div className={`flex items-center border rounded-md px-4 py-3 w-full lg:w-1/3 ${
            theme === "light" ? "bg-gray-50 border-gray-200" : "bg-gray-700 border-gray-600"
          }`}>
            <Search size={20} className={`mr-3 ${
              theme === "light" ? "text-gray-400" : "text-gray-500"
            }`} />
            <input
              type="text"
              placeholder="Search by name, email, or phone..."
              value={searchTerm}
              onChange={(e) => handleSearchChange(e.target.value)}
              className={`w-full bg-transparent border-none outline-none ${
                theme === "light" ? "text-gray-700 placeholder-gray-400" : "text-gray-200 placeholder-gray-500"
              }`}
            />
          </div>

          <div className="flex items-center space-x-4 w-full lg:w-auto">
            {/* Specialization Filter */}
            <div className={`flex items-center border rounded-md px-4 py-3 min-w-0 lg:min-w-[200px] ${
              theme === "light" ? "bg-gray-50 border-gray-200" : "bg-gray-700 border-gray-600"
            }`}>
              <Stethoscope size={20} className={`mr-3 ${
                theme === "light" ? "text-gray-400" : "text-gray-500"
              }`} />
              <input
                type="text"
                placeholder="Filter by specialization..."
                value={specializationFilter}
                onChange={handleSpecializationFilterChange}
                className={`w-full bg-transparent border-none outline-none ${
                  theme === "light" ? "text-gray-700 placeholder-gray-400" : "text-gray-200 placeholder-gray-500"
                }`}
              />
            </div>

            {/* Location Filter */}
            <div className={`flex items-center border rounded-md px-4 py-3 min-w-0 lg:min-w-[200px] ${
              theme === "light" ? "bg-gray-50 border-gray-200" : "bg-gray-700 border-gray-600"
            }`}>
              <MapPin size={20} className={`mr-3 ${
                theme === "light" ? "text-gray-400" : "text-gray-500"
              }`} />
              <input
                type="text"
                placeholder="Filter by location..."
                value={locationFilter}
                onChange={handleLocationFilterChange}
                className={`w-full bg-transparent border-none outline-none ${
                  theme === "light" ? "text-gray-700 placeholder-gray-400" : "text-gray-200 placeholder-gray-500"
                }`}
              />
            </div>
            
            {/* Results Count */}
            <div className={`text-sm ${
              theme === "light" ? "text-gray-500" : "text-gray-400"
            } whitespace-nowrap`}>
              {filteredData.length} doctor{filteredData.length !== 1 ? 's' : ''} found
            </div>
          </div>
        </div>
      </div>

      {/* Doctors Table */}
      <div className={`rounded-lg shadow-sm border overflow-hidden ${
        theme === "light" ? "bg-white border-sky-100" : "bg-sky-800 border-sky-600"
      }`}>
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className={`flex items-center space-x-3 ${
              theme === "light" ? "text-gray-500" : "text-gray-400"
            }`}>
              <RefreshCw className="h-6 w-6 animate-spin" />
              <span className="text-lg">Loading doctors...</span>
            </div>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
           <table className={`min-w-full divide-y ${theme === "light" ? "divide-sky-200" : "divide-sky-500"}`}>
                <thead className={`${
                  theme === "light" ? "bg-gradient-to-r from-sky-50 to-sky-100" : "bg-gradient-to-r from-sky-800 to-sky-700"
                }`}>
                  <tr>
                    <th className={`px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider ${
                      theme === "light" ? "text-sky-900" : "text-sky-200"
                    }`}>
                      Doctor
                    </th>
                    <th className={`px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider ${
                      theme === "light" ? "text-sky-900" : "text-sky-200"
                    }`}>
                      Contact
                    </th>
                    <th className={`px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider ${
                      theme === "light" ? "text-sky-900" : "text-sky-200"
                    }`}>
                      Specialization
                    </th>
                    <th className={`px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider ${
                      theme === "light" ? "text-sky-900" : "text-sky-200"
                    }`}>
                      Location
                    </th>
                    <th className={`px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider ${
                      theme === "light" ? "text-sky-900" : "text-sky-200"
                    }`}>
                      Experience
                    </th>
                    <th className={`px-6 py-4 text-right text-sm font-semibold uppercase tracking-wider ${
                      theme === "light" ? "text-sky-900" : "text-sky-200"
                    }`}>
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className={`divide-y ${
                  theme === "light" ? "bg-white divide-sky-200" : "bg-gray-800 divide-sky-600"
                }`}>
                  {currentDoctors.length > 0 ? (
                    currentDoctors.map((doctor, index) => (
                      <tr key={doctor?.id || index} className={`${
                        theme === "light" ? "hover:bg-gray-50" : "hover:bg-gray-700"
                      } transition-colors`}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center space-x-4">
                            <div className="flex-shrink-0">
                              {doctor?.imageDoctor ? (
                                <img
                                  src={doctor.imageDoctor instanceof File ? URL.createObjectURL(doctor.imageDoctor) : doctor.imageDoctor}
                                  alt={doctor?.name || 'Doctor'}
                                  className={`h-12 w-12 rounded-full object-cover border-2 ${
                                    theme === "light" ? "border-gray-200" : "border-gray-600"
                                  }`}
                                  onError={(e) => {
                                    e.target.style.display = 'none';
                                    e.target.nextSibling.style.display = 'flex';
                                  }}
                                />
                              ) : null}
                              <div 
                                className={`h-12 w-12 rounded-full bg-gradient-to-r from-sky-400 to-blue-500 flex items-center justify-center text-white font-semibold text-lg ${
                                  doctor?.imageDoctor ? 'hidden' : ''
                                }`}
                              >
                                {doctor?.name?.charAt(0)?.toUpperCase() || 'D'}
                              </div>
                            </div>
                            <div>
                              <div className={`text-sm font-semibold ${
                                theme === "light" ? "text-gray-900" : "text-gray-200"
                              }`}>
                                Dr. {doctor?.name || 'N/A'}
                              </div>
                              <div className={`text-sm flex items-center ${
                                theme === "light" ? "text-gray-500" : "text-gray-400"
                              }`}>
                                <User className="h-3 w-3 mr-1" />
                                ID: {doctor?.id?.toString().slice(0, 8) || 'N/A'}...
                              </div>
                            </div>
                          </div>
                        </td>
                        
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="space-y-1">
                            <div className={`flex items-center text-sm ${
                              theme === "light" ? "text-gray-900" : "text-gray-200"
                            }`}>
                              <Mail className={`h-4 w-4 mr-2 ${
                                theme === "light" ? "text-gray-400" : "text-gray-500"
                              }`} />
                              {doctor?.emailDoctor || 'N/A'}
                            </div>
                            <div className={`flex items-center text-sm ${
                              theme === "light" ? "text-gray-500" : "text-gray-400"
                            }`}>
                              <Phone className={`h-4 w-4 mr-2 ${
                                theme === "light" ? "text-gray-400" : "text-gray-500"
                              }`} />
                              {doctor?.phone || 'N/A'}
                            </div>
                          </div>
                        </td>
                        
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className={`text-sm ${
                            theme === "light" ? "text-gray-900" : "text-gray-200"
                          }`}>
                            {doctor?.category?.categoryName || doctor?.specialization || 'N/A'}
                          </div>
                          <div className={`text-sm flex items-center ${
                            theme === "light" ? "text-gray-500" : "text-gray-400"
                          }`}>
                            <Users className="h-3 w-3 mr-1" />
                            {doctor?.numOfPatients || '0'} patients
                          </div>
                        </td>
                        
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className={`flex items-center text-sm ${
                            theme === "light" ? "text-gray-900" : "text-gray-200"
                          }`}>
                            <MapPin className={`h-4 w-4 mr-2 ${
                              theme === "light" ? "text-gray-400" : "text-gray-500"
                            }`} />
                            {doctor?.location || 'N/A'}
                          </div>
                        </td>
                        
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className={`flex items-center text-sm ${
                            theme === "light" ? "text-gray-900" : "text-gray-200"
                          }`}>
                            <Stethoscope className={`h-4 w-4 mr-2 ${
                              theme === "light" ? "text-gray-400" : "text-gray-500"
                            }`} />
                            {doctor?.experianceYears || '0'} years
                          </div>
                        </td>
                        
                        <td className="px-6 py-4 whitespace-nowrap text-right relative">
                          <div className="flex items-center justify-end space-x-2">
                            <button
                              onClick={() => openDetailsModal(doctor)}
                              className={`transition-colors p-2 rounded-full ${
                                theme === "light" 
                                  ? "text-sky-600 hover:text-sky-800 hover:bg-sky-50" 
                                  : "text-sky-300 hover:text-sky-400 hover:bg-sky-900"
                              }`}
                              title="View Details"
                            >
                              <ExternalLink size={16} />
                            </button>
                            <button
                              onClick={() => onEditWorkingHours(doctor)}
                              className={`transition-colors p-2 rounded-full ${
                                theme === "light" 
                                  ? "text-blue-600 hover:text-blue-800 hover:bg-blue-50" 
                                  : "text-blue-300 hover:text-blue-400 hover:bg-blue-900"
                              }`}
                              title="Working Hours"
                            >
                              <Clock size={16} />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleMenu(doctor?.id);
                              }}
                              className={`transition-colors p-2 rounded-full ${
                                theme === "light" 
                                  ? "text-gray-400 hover:text-gray-600 hover:bg-gray-100" 
                                  : "text-gray-500 hover:text-gray-300 hover:bg-gray-700"
                              }`}
                            >
                              <MoreVertical size={20} />
                            </button>
                          </div>
                          
                          {menuOpen === doctor?.id && (
                            <div className={`absolute right-0 top-12 w-48 border rounded-lg shadow-lg z-50 py-2 ${
                              theme === "light" ? "bg-white border-gray-200" : "bg-gray-800 border-gray-600"
                            }`}>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  if (doctor) {
                                    onEdit(doctor);
                                  }
                                  setMenuOpen(null);
                                }}
                                className={`w-full px-4 py-2 text-left flex items-center space-x-3 text-sm ${
                                  theme === "light" ? "text-gray-700 hover:bg-gray-50" : "text-gray-200 hover:bg-gray-700"
                                }`}
                              >
                                <Edit className={`h-4 w-4 ${
                                  theme === "light" ? "text-blue-500" : "text-blue-300"
                                }`} />
                                <span>Edit Doctor</span>
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  if (doctor?.id) {
                                    onDelete(doctor.id);
                                  }
                                  setMenuOpen(null);
                                }}
                                className={`w-full px-4 py-2 text-left flex items-center space-x-3 text-sm ${
                                  theme === "light" ? "text-red-600 hover:bg-gray-50" : "text-red-300 hover:bg-gray-700"
                                }`}
                              >
                                <Trash className="h-4 w-4" />
                                <span>Delete Doctor</span>
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="px-6 py-12 text-center">
                        <div className="flex flex-col items-center space-y-3">
                          <Stethoscope className={`h-12 w-12 ${
                            theme === "light" ? "text-gray-300" : "text-gray-500"
                          }`} />
                          <div>
                            <h3 className={`text-lg font-medium ${
                              theme === "light" ? "text-gray-900" : "text-gray-200"
                            }`}>No doctors found</h3>
                            <p className={`${
                              theme === "light" ? "text-gray-500" : "text-gray-400"
                            }`}>
                              {searchTerm || specializationFilter || locationFilter ? 
                                'Try adjusting your search or filter criteria' : 
                                'Get started by adding your first doctor'
                              }
                            </p>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {filteredData.length > 0 && totalPages > 1 && (
              <div className={`px-6 py-4 border-t ${
                theme === "light" ? "bg-gray-50 border-gray-200" : "bg-gray-700 border-gray-600"
              }`}>
                <div className="flex items-center justify-between">
                  <div className={`text-sm ${
                    theme === "light" ? "text-gray-700" : "text-gray-300"
                  }`}>
                    Showing <span className="font-medium">{indexOfFirstDoctor + 1}</span> to{' '}
                    <span className="font-medium">
                      {Math.min(indexOfLastDoctor, filteredData.length)}
                    </span>{' '}
                    of <span className="font-medium">{filteredData.length}</span> doctors
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={prevPage}
                      disabled={currentPage === 1}
                      className={`px-4 py-2 rounded-md border text-sm font-medium transition-colors ${
                        currentPage === 1
                          ? theme === "light"
                            ? "bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200"
                            : "bg-gray-600 text-gray-500 cursor-not-allowed border-gray-600"
                          : theme === "light"
                          ? "bg-white text-gray-700 hover:bg-gray-50 border-gray-300"
                          : "bg-gray-800 text-gray-200 hover:bg-gray-700 border-gray-600"
                      }`}
                    >
                      Previous
                    </button>
                    
                    <div className="flex items-center space-x-1">
                      {[...Array(totalPages)].map((_, index) => {
                        const page = index + 1;
                        const isCurrentPage = page === currentPage;
                        const isNearCurrentPage = Math.abs(page - currentPage) <= 2;
                        const isFirstOrLast = page === 1 || page === totalPages;
                        
                        if (isNearCurrentPage || isFirstOrLast) {
                          return (
                            <button
                              key={page}
                              onClick={() => setCurrentPage(page)}
                              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                                isCurrentPage
                                  ? theme === "light"
                                    ? 'bg-sky-500 text-white'
                                    : 'bg-sky-700 text-white'
                                  : theme === "light"
                                  ? 'text-gray-700 hover:bg-gray-100'
                                  : 'text-gray-200 hover:bg-gray-700'
                              }`}
                            >
                              {page}
                            </button>
                          );
                        } else if (page === currentPage - 3 || page === currentPage + 3) {
                          return <span key={page} className={`px-2 ${
                            theme === "light" ? "text-gray-400" : "text-gray-500"
                          }`}>...</span>;
                        }
                        return null;
                      })}
                    </div>
                    
                    <button
                      onClick={nextPage}
                      disabled={currentPage === totalPages}
                      className={`px-4 py-2 rounded-md border text-sm font-medium transition-colors ${
                        currentPage === totalPages
                          ? theme === "light"
                            ? "bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200"
                            : "bg-gray-600 text-gray-500 cursor-not-allowed border-gray-600"
                          : theme === "light"
                          ? "bg-white text-gray-700 hover:bg-gray-50 border-gray-300"
                          : "bg-gray-800 text-gray-200 hover:bg-gray-700 border-gray-600"
                      }`}
                    >
                      Next
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Doctor Details Modal */}
      {detailsModalOpen && selectedDoctor && (
        <div className="fixed inset-0 bg-black/30 flex justify-center items-center z-50">
          <div className={`rounded-lg shadow-xl w-full max-w-2xl p-6 m-4 max-h-[90vh] overflow-y-auto ${
            theme === "light" ? "bg-white" : "bg-gray-800"
          }`}>
            <div className="flex justify-between items-start mb-6">
              <h2 className={`text-2xl font-bold ${
                theme === "light" ? "text-sky-600" : "text-sky-300"
              }`}>
                Dr. {selectedDoctor.name}
              </h2>
              <button
                onClick={closeDetailsModal}
                className={`text-2xl font-bold ${
                  theme === "light" ? "text-gray-400 hover:text-gray-600" : "text-gray-500 hover:text-gray-300"
                }`}
              >
                ×
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Column */}
              <div className="space-y-4">
                {/* Doctor Image and Basic Info */}
                <div className="flex items-center space-x-4">
                  <img
                    src={selectedDoctor.imageDoctor || "/placeholder.svg?height=80&width=80"}
                    alt={selectedDoctor.name}
                    className={`w-20 h-20 rounded-full border-2 object-cover ${
                      theme === "light" ? "border-sky-200" : "border-sky-700"
                    } shadow-sm`}
                  />
                  <div>
                    <h3 className={`text-lg font-semibold ${
                      theme === "light" ? "text-gray-900" : "text-gray-200"
                    }`}>
                      Dr. {selectedDoctor.name}
                    </h3>
                    <p className={`${
                      theme === "light" ? "text-gray-600" : "text-gray-400"
                    }`}>
                      {selectedDoctor.category?.categoryName || selectedDoctor.specialization}
                    </p>
                    <div className={`flex items-center text-sm mt-1 ${
                      theme === "light" ? "text-gray-500" : "text-gray-400"
                    }`}>
                      <Users className="w-4 h-4 mr-1" />
                      {selectedDoctor.numOfPatients || "0"}+ patients
                    </div>
                  </div>
                </div>

                {/* Contact Information */}
                <div className="space-y-3">
                  <h4 className={`font-medium ${
                    theme === "light" ? "text-gray-900" : "text-gray-200"
                  }`}>Contact Information</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center">
                      <Mail className={`w-4 h-4 mr-3 ${
                        theme === "light" ? "text-sky-500" : "text-sky-300"
                      }`} />
                      <span className={theme === "light" ? "text-gray-900" : "text-gray-200"}>
                        {selectedDoctor.emailDoctor || "Not specified"}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <Phone className={`w-4 h-4 mr-3 ${
                        theme === "light" ? "text-sky-500" : "text-sky-300"
                      }`} />
                      <span className={theme === "light" ? "text-gray-900" : "text-gray-200"}>
                        {selectedDoctor.phone || "Not specified"}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <Smartphone className={`w-4 h-4 mr-3 ${
                        theme === "light" ? "text-sky-500" : "text-sky-300"
                      }`} />
                      <span className={theme === "light" ? "text-gray-900" : "text-gray-200"}>
                        {selectedDoctor.teliphone || "Not specified"}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <MapPin className={`w-4 h-4 mr-3 ${
                        theme === "light" ? "text-sky-500" : "text-sky-300"
                      }`} />
                      <span className={theme === "light" ? "text-gray-900" : "text-gray-200"}>
                        {selectedDoctor.location || "Not specified"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-4">
                {/* Professional Information */}
                <div className="space-y-3">
                  <h4 className={`font-medium ${
                    theme === "light" ? "text-gray-900" : "text-gray-200"
                  }`}>Professional Information</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center">
                      <Stethoscope className={`w-4 h-4 mr-3 ${
                        theme === "light" ? "text-sky-500" : "text-sky-300"
                      }`} />
                      <span className={theme === "light" ? "text-gray-900" : "text-gray-200"}>
                        Experience: {selectedDoctor.experianceYears || "0"} years
                      </span>
                    </div>
                  </div>
                </div>

                {/* Links */}
                {(selectedDoctor.locationLink || selectedDoctor.whatsAppLink) && (
                  <div className="space-y-3">
                    <h4 className={`font-medium ${
                      theme === "light" ? "text-gray-900" : "text-gray-200"
                    }`}>Quick Links</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedDoctor.locationLink && (
                        <a
                          href={selectedDoctor.locationLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`inline-flex items-center px-3 py-1 rounded-full text-sm transition-colors ${
                            theme === "light"
                              ? "bg-blue-100 text-blue-600 hover:bg-blue-200"
                              : "bg-blue-900 text-blue-300 hover:bg-blue-800"
                          }`}
                        >
                          <MapPin size={14} className="mr-1" /> View Location
                        </a>
                      )}
                      {selectedDoctor.whatsAppLink && (
                        <a
                          href={selectedDoctor.whatsAppLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`inline-flex items-center px-3 py-1 rounded-full text-sm transition-colors ${
                            theme === "light"
                              ? "bg-green-100 text-green-600 hover:bg-green-200"
                              : "bg-green-900 text-green-300 hover:bg-green-800"
                          }`}
                        >
                          <ExternalLink size={14} className="mr-1" /> WhatsApp
                        </a>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* About Section */}
            {selectedDoctor.about && (
              <div className="mt-6 space-y-3">
                <h4 className={`font-medium ${
                  theme === "light" ? "text-gray-900" : "text-gray-200"
                }`}>About Doctor</h4>
                <p className={`text-sm leading-relaxed ${
                  theme === "light" ? "text-gray-600" : "text-gray-400"
                }`}>
                  {selectedDoctor.about}
                </p>
              </div>
            )}

            {/* Action Buttons */}
            <div className={`flex justify-end space-x-3 mt-6 pt-4 border-t ${
              theme === "light" ? "border-gray-200" : "border-gray-600"
            }`}>
              <button
                onClick={() => {
                  closeDetailsModal();
                  onEditWorkingHours(selectedDoctor);
                }}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-white transition-colors ${
                  theme === "light" ? "bg-sky-600 hover:bg-sky-700" : "bg-sky-700 hover:bg-sky-800"
                }`}
              >
                <Clock size={16} />
                <span>Edit Working Hours</span>
              </button>
              <button
                onClick={() => {
                  closeDetailsModal();
                  onEdit(selectedDoctor);
                }}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-white transition-colors ${
                  theme === "light" ? "bg-sky-600 hover:bg-sky-700" : "bg-sky-700 hover:bg-sky-800"
                }`}
              >
                <Edit size={16} />
                <span>Edit Doctor</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorList;