import React, { useState, useEffect } from "react";
import { MoreVertical, Search, Filter } from "lucide-react"; // استيراد أيقونات للتصفية والبحث

const UserList = ({
  filteredUsers,
  onEdit,
  onDelete,
  onSearch,
}) => {
  const [menuOpen, setMenuOpen] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 6; // تغيير عدد المستخدمين في الصفحة
  const [statusFilter, setStatusFilter] = useState(""); // حالة الفلتر لتصفية الحالة
  const [filteredData, setFilteredData] = useState(filteredUsers); // بيانات المستخدمين المفلترة

  // دالة لتحديد لون حالة المستخدم
  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "active":
        return "text-green-500"; // اللون الأخضر
        case "not active":
        return "text-red-400"; // اللون الأحمر
        case "not connected":
          return "text-yellow-400"; // اللون الأصفر
      default:
        return "text-black"; // اللون الافتراضي
    }
  };

  // دالة لتبديل القائمة المنبثقة (لتعديل أو حذف المستخدم)
  const toggleMenu = (id) => {
    setMenuOpen(menuOpen === id ? null : id);
  };

  // دالة لتطبيق الفلتر بناءً على الحالة
  const handleFilterChange = (e) => {
    const value = e.target.value;
    setStatusFilter(value);
  };

  // تصفية البيانات بناءً على الفلتر الحالي
  useEffect(() => {
    let filtered = filteredUsers;

    if (statusFilter) {
      filtered = filteredUsers.filter(
        (user) => user.status.toLowerCase() === statusFilter.toLowerCase()
      );
    }

    setFilteredData(filtered); // تحديث البيانات المفلترة
  }, [statusFilter, filteredUsers]);

  // تحديد المستخدمين الحاليين بناءً على الصفحة الحالية
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredData.slice(indexOfFirstUser, indexOfLastUser);

  // الانتقال إلى الصفحة التالية
  const nextPage = () => {
    if (currentPage < Math.ceil(filteredData.length / usersPerPage)) {
      setCurrentPage(currentPage + 1);
    }
  };

  // العودة إلى الصفحة السابقة
  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="flex-3 mr-8">
      <h1 className="text-sky-600 text-4xl font-bold mb-8">Manage Users</h1>

      {/* قسم البحث والتصفية */}
      <div className="flex flex-col md:flex-row items-center justify-between mb-6 space-y-4 md:space-y-0">
        {/* أيقونة البحث */}
        <div className="flex items-center bg-white p-2 rounded-lg shadow-md w-full md:w-1/3">
          <Search size={20} className="text-sky-500 mr-2" />
          <input
            type="text"
            placeholder="Search by ID, Name, or Email"
            onChange={(e) => onSearch(e.target.value)}
            className="w-full p-2 border-none outline-none"
          />
        </div>

        {/* فلترة الحالة */}
        <div className="flex items-center bg-white p-2 rounded-lg shadow-md w-full md:w-1/4">
          <Filter size={20} className="text-sky-500 mr-2" />
          <select
            value={statusFilter}
            onChange={handleFilterChange}
            className="p-2 border-none outline-none w-full appearance-none"
          >
            <option value="">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Not Connected">Not Connected</option>
            <option value="Not Active">Not Active</option>
          </select>
        </div>
      </div>

      {/* جدول المستخدمين */}
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse shadow-lg rounded-lg table-fixed">
          <thead>
            <tr className="bg-gradient-to-r from-sky-600 to-sky-400 text-white">
              <th className="p-4 w-1/6">ID</th>
              <th className="p-4 w-1/6">Name</th>
              <th className="p-4 w-1/4">Email</th>
              <th className="p-4 w-1/6">Status</th>
              <th className="p-4 w-1/6">Date</th>
              <th className="p-4 w-1/6">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentUsers.map((user) => (
              <tr key={user.id} className="border-t hover:bg-sky-50">
                <td className="p-4 text-center font-medium">{user.id}</td>
                <td className="p-4">{user.name}</td>
                <td className="p-4">{user.email}</td>
                <td
                  className={`p-4 font-semibold ${getStatusColor(user.status)}`}
                >
                  {user.status}
                </td>
                <td className="p-4">{user.date}</td>
                <td className="p-4 text-center relative">
                  <button
                    onClick={() => toggleMenu(user.id)}
                    className="text-sky-600 hover:text-sky-800"
                  >
                    <MoreVertical size={24} />
                  </button>
                  {menuOpen === user.id && (
                    <div className="absolute right-0 mt-2 w-36 bg-white border rounded-lg shadow-xl z-50">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => {
                            onEdit(user);
                            setMenuOpen(null);
                          }}
                          className="w-full px-4 py-3 text-left hover:bg-sky-100 flex items-center justify-center text-sm font-medium"
                        >
                          <i className="fa-solid fa-pen-to-square text-sky-600 text-lg"></i>
                        </button>
                        <button
                          onClick={() => {
                            onDelete(user.id);
                            setMenuOpen(null);
                          }}
                          className="w-full px-4 py-3 text-left hover:bg-red-100 flex items-center justify-center text-sm font-medium"
                        >
                          <i className="fa-solid fa-trash text-red-600 text-lg"></i>
                        </button>
                      </div>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* التنقل بين الصفحات */}
      <div className="mt-6 flex justify-between items-center">
        <button
          onClick={prevPage}
          disabled={currentPage === 1}
          className={`px-4 py-2 rounded-lg ${
            currentPage === 1
              ? "bg-gray-300 cursor-not-allowed"
              : "bg-sky-500 text-white hover:bg-sky-600"
          }`}
        >
          Previous
        </button>
        <span className="text-gray-600">
          Page {currentPage} of {Math.ceil(filteredData.length / usersPerPage)}
        </span>
        <button
          onClick={nextPage}
          disabled={currentPage === Math.ceil(filteredData.length / usersPerPage)}
          className={`px-4 py-2 rounded-lg ${
            currentPage === Math.ceil(filteredData.length / usersPerPage)
              ? "bg-gray-300 cursor-not-allowed"
              : "bg-sky-500 text-white hover:bg-sky-600"
          }`}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default UserList;
