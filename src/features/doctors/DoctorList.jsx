import React, { useState, useEffect } from "react";
import { Search, MapPin, Phone, Smartphone, Mail, Stethoscope, Users, Trash, Edit } from "lucide-react"; // إضافة أيقونات إضافية
import { motion } from "framer-motion"; // استيراد مكتبة Framer Motion

const DoctorList = ({ filteredDoctors, onEdit, onDelete, onAddDoctor }) => {
  const [searchText, setSearchText] = useState("");
  const [filters, setFilters] = useState({ location: "", specialization: "" });
  const [filteredData, setFilteredData] = useState(filteredDoctors);
  const [selectedDoctor, setSelectedDoctor] = useState(null); // لحفظ الطبيب الذي سيتم عرضه في المودال
  const [modalOpen, setModalOpen] = useState(false); // حالة فتح/إغلاق المودال
  const [isEditing, setIsEditing] = useState(false); // للتحقق مما إذا كنا في وضع التعديل

  // فتح المودال لعرض التفاصيل فقط
  const openModalDetails = (doctor) => {
    setSelectedDoctor(doctor);
    setIsEditing(false); // تأكيد أن الوضع هو "عرض التفاصيل"
    setModalOpen(true);
  };

  // فتح المودال للتعديل على البيانات
  const openModalEdit = (doctor) => {
    setSelectedDoctor(doctor);
    setIsEditing(true); // تأكيد أن الوضع هو "تعديل"
    setModalOpen(true);
  };

  // إغلاق المودال
  const closeModal = () => {
    setModalOpen(false);
    setSelectedDoctor(null);
    setIsEditing(false);
  };

  // تطبيق الفلاتر
  useEffect(() => {
    let filtered = filteredDoctors;

    if (searchText) {
      filtered = filtered.filter((doctor) =>
        doctor.name.toLowerCase().includes(searchText.toLowerCase()) ||
        doctor.emailDoctor.toLowerCase().includes(searchText.toLowerCase()) ||
        doctor.phone.includes(searchText) ||
        doctor.teliphone.includes(searchText) ||
        doctor.whatsAppLink.includes(searchText)
      );
    }

    if (filters.location) {
      filtered = filtered.filter((doctor) =>
        doctor.location.toLowerCase().includes(filters.location.toLowerCase())
      );
    }

    if (filters.specialization) {
      filtered = filtered.filter((doctor) =>
        doctor.specialization?.toLowerCase().includes(filters.specialization.toLowerCase())
      );
    }

    setFilteredData(filtered);
  }, [filteredDoctors, searchText, filters]);

  return (
    <div className="mr-4">
      <h1 className="text-sky-600 text-4xl font-bold mb-8 text-center">Manage Doctors</h1>

      {/* Search & Filters */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
        <div className="flex items-center bg-white p-2 rounded-lg shadow-md w-full md:w-1/3">
          <Search size={20} className="text-sky-500 mr-2" />
          <input
            type="text"
            placeholder="Search by name, email, phone, or WhatsApp"
            onChange={(e) => setSearchText(e.target.value)}
            className="w-full p-2 border rounded-lg"
          />
        </div>

        <input
          type="text"
          placeholder="Filter by location"
          value={filters.location}
          onChange={(e) => setFilters({ ...filters, location: e.target.value })}
          className="p-2 border rounded-lg w-full md:w-1/4"
        />

        <input
          type="text"
          placeholder="Filter by specialization"
          value={filters.specialization}
          onChange={(e) => setFilters({ ...filters, specialization: e.target.value })}
          className="p-2 border rounded-lg w-full md:w-1/4"
        />

        <button
          onClick={onAddDoctor}
          className="bg-sky-600 text-white px-6 py-2 rounded-lg hover:bg-sky-700 w-full md:w-auto"
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
              className="bg-white rounded-lg shadow-md p-4 relative"
            >
              {/* Doctor Image and Name */}
              <div className="flex items-center mb-4">
                <img
                  src={doctor.imageDoctor}
                  alt={doctor.name}
                  className="w-20 h-20 rounded-full border shadow-sm mr-4"
                />
                <div>
                  <h2 className="text-lg font-bold">{doctor.name}</h2>
                  <p className="text-sm text-gray-500">{doctor.specialization || "Not specified"}</p>
                </div>
              </div>

              {/* Doctor Info (Basic Info Only) */}
              <div className="text-sm text-gray-700 space-y-2">
                <p className="flex items-center"><MapPin className="w-4 h-4 mr-2" /> Location: {doctor.location}</p>
                <p className="flex items-center"><Phone className="w-4 h-4 mr-2" /> Phone: {doctor.phone}</p>
                <p className="flex items-center"><Smartphone className="w-4 h-4 mr-2" /> Mobile: {doctor.teliphone}</p>
              </div>

              {/* View Details Button */}
              <div className="flex justify-between items-center mt-4">
                <button
                  onClick={() => openModalDetails(doctor)} // فتح المودال لعرض التفاصيل
                  className="bg-sky-600 text-white py-1 px-4 rounded hover:bg-sky-700 text-sm"
                >
                  View Details
                </button>

                {/* Edit and Delete Buttons */}
                <div className="absolute top-2 right-2 flex space-x-2">
                  <button
                    onClick={() => openModalEdit(doctor)} // فتح المودال للتعديل
                    className="text-yellow-500 hover:text-yellow-600"
                  >
                    <Edit size={20} />
                  </button>
                  <button
                    onClick={() => {
                      onDelete(doctor.id); // استدعاء دالة الحذف
                    }}
                    className="text-red-500 hover:text-red-600"
                  >
                    <Trash size={20} />
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-red-500 col-span-full">No doctors found</p>
        )}
      </div>

      {/* Modal for Doctor Details or Edit */}
      {modalOpen && selectedDoctor && (
        <div className="fixed inset-0 flex justify-center items-center z-50">
          <motion.div
            className="bg-white rounded-lg shadow-xl w-96 p-6"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.3 }}
          >
            <h2 className="text-xl font-bold mb-4">{selectedDoctor.name}</h2>

            <div className="text-sm text-gray-700 space-y-2">
              <p className="flex items-center"><MapPin className="w-4 h-4 mr-2" /> Location: {selectedDoctor.location}</p>
              <p className="flex items-center"><Phone className="w-4 h-4 mr-2" /> Phone: {selectedDoctor.phone}</p>
              <p className="flex items-center"><Smartphone className="w-4 h-4 mr-2" /> Mobile: {selectedDoctor.teliphone}</p>
              <p className="flex items-center"><Mail className="w-4 h-4 mr-2" /> Email: {selectedDoctor.emailDoctor}</p>
              <p className="flex items-center"><Stethoscope className="w-4 h-4 mr-2" /> Experience: {selectedDoctor.experianceYears} years</p>
              <p className="flex items-center"><Users className="w-4 h-4 mr-2" /> Patients: {selectedDoctor.numOfPatients}+</p>
              <p className="flex items-center"><strong>About: </strong>{selectedDoctor.about}</p>
              <p className="flex items-center"><strong>Location Link: </strong>
                <a
                  href={selectedDoctor.locationLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sky-600 underline ml-1"
                >
                  Open
                </a>
              </p>
              <p className="flex items-center"><strong>WhatsApp: </strong>
                <a
                  href={selectedDoctor.whatsAppLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sky-600 underline ml-1"
                >
                  Chat
                </a>
              </p>
            </div>

            <div className="flex justify-end mt-4">
              <button
                onClick={closeModal}
                className="bg-sky-600 text-white px-4 py-2 rounded-lg hover:bg-sky-700"
              >
                Close
              </button>
              {isEditing && (
                <button
                  onClick={() => onEdit(selectedDoctor)} // فتح المودال للتعديل
                  className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 ml-2"
                >
                  Edit Doctor
                </button>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default DoctorList;
