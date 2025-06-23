import React, { useState, useEffect, useContext } from "react";
import {
  MoreVertical,
  Search,
  Filter,
  Users,
  Calendar,
  Mail,
  User,
} from "lucide-react";
import { ThemeContext } from "../../context/ThemeContext";

const UserList = ({
  filteredUsers = [],
  onEdit,
  onDelete,
  onSearch,
  onFilter,
  isLoading = false,
}) => {
  const { theme } = useContext(ThemeContext);
  const [menuOpen, setMenuOpen] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 8;
  const [statusFilter, setStatusFilter] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    console.log("Filtered Users:", filteredUsers);
    setFilteredData(Array.isArray(filteredUsers) ? filteredUsers : []);
  }, [filteredUsers]);

  // Safe status color and badge mapping
  const getStatusStyle = (status) => {
    if (!status)
      return theme === "light"
        ? "bg-gray-100 text-gray-600 border border-gray-200"
        : "bg-gray-700 text-gray-300 border border-gray-600";

    try {
      const statusStr = String(status).toLowerCase().trim();
      switch (statusStr) {
        case "active":
          return theme === "light"
            ? "bg-green-100 text-green-700 border border-green-200"
            : "bg-green-900 text-green-300 border border-green-800";
        case "not active":
          return theme === "light"
            ? "bg-red-100 text-red-700 border border-red-200"
            : "bg-red-900 text-red-300 border border-red-800";
        case "not connected":
          return theme === "light"
            ? "bg-yellow-100 text-yellow-700 border border-yellow-200"
            : "bg-yellow-900 text-yellow-300 border border-yellow-800";
        default:
          return theme === "light"
            ? "bg-gray-100 text-gray-600 border border-gray-200"
            : "bg-gray-700 text-gray-300 border border-gray-600";
      }
    } catch (error) {
      console.error("Error determining status style:", error);
      return theme === "light"
        ? "bg-gray-100 text-gray-600 border border-gray-200"
        : "bg-gray-700 text-gray-300 border border-gray-600";
    }
  };

  const toggleMenu = (id) => {
    setMenuOpen(menuOpen === id ? null : id);
  };

  const handleFilterChange = (e) => {
    const value = e.target.value;
    setStatusFilter(value);
    if (onFilter) onFilter(e);
  };

  const handleSearchChange = (value) => {
    setSearchTerm(value);
    if (onSearch) onSearch(value);
  };

  useEffect(() => {
    try {
      let result = Array.isArray(filteredUsers) ? [...filteredUsers] : [];
      if (statusFilter) {
        result = result.filter(
          (user) => user?.status?.toLowerCase() === statusFilter.toLowerCase()
        );
        if (result.length === 0) {
          console.log("No users found with status:", statusFilter);
        }
      }
      setFilteredData(result);
      setCurrentPage(1);
    } catch (error) {
      console.error("Error applying filters:", error);
      setFilteredData([]);
    }
  }, [statusFilter, filteredUsers]);

  useEffect(() => {
    const handleClickOutside = () => {
      if (menuOpen) setMenuOpen(null);
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [menuOpen]);

  // Pagination calculations
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredData.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredData.length / usersPerPage);

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
      {/* Search and Filter Section */}
      <div
        className={`p-6 rounded-lg shadow-sm border ${
          theme === "light"
            ? "bg-white border-sky-100"
            : "bg-gray-800 border-sky-600"
        }`}
      >
        <div className="flex flex-col lg:flex-row items-center justify-between space-y-4 lg:space-y-0 lg:space-x-4">
          <div className="flex items-center space-x-3">
            <div
              className={`p-3 rounded-lg ${
                theme === "light"
                  ? "bg-gradient-to-r from-sky-700 to-sky-600"
                  : "bg-gradient-to-r from-sky-800 to-sky-700"
              }`}
            >
              <Users className="h-5 w-8 text-white" />
            </div>
            <div>
              <h3
                className={`text-xl font-bold ${
                  theme === "light" ? "text-gray-900" : "text-gray-200"
                }`}
              >
                Manage Users
              </h3>
              <p
                className={`text-sm ${
                  theme === "light" ? "text-gray-600" : "text-gray-400"
                }`}
              >
                Manage and monitor user accounts
              </p>
            </div>
          </div>
          {/* Search Input */}
          <div
            className={`flex items-center border rounded-md px-4 py-3 w-full lg:w-1/2 ${
              theme === "light"
                ? "bg-gray-50 border-gray-200"
                : "bg-gray-700 border-gray-600"
            }`}
          >
            <Search
              size={20}
              className={`mr-3 ${
                theme === "light" ? "text-gray-400" : "text-gray-500"
              }`}
            />
            <input
              type="text"
              placeholder="Search by name, email, or ID..."
              value={searchTerm}
              onChange={(e) => handleSearchChange(e.target.value)}
              className={`w-full bg-transparent border-none outline-none ${
                theme === "light"
                  ? "text-gray-700 placeholder-gray-400"
                  : "text-gray-200 placeholder-gray-500"
              }`}
            />
          </div>

          <div className="flex items-center space-x-4 w-full lg:w-auto">
            {/* Status Filter */}
            <div
              className={`flex items-center border rounded-md px-4 py-3 min-w-0 lg:min-w-[200px] ${
                theme === "light"
                  ? "bg-gray-50 border-gray-200"
                  : "bg-gray-700 border-gray-600"
              }`}
            >
              <Filter
                size={20}
                className={`mr-3 ${
                  theme === "light" ? "text-gray-400" : "text-gray-500"
                }`}
              />
              <select
                value={statusFilter}
                onChange={handleFilterChange}
                className={`
    w-full border rounded-md py-2 pl-3 pr-8 outline-none appearance-none 
    cursor-pointer transition-colors duration-200
    bg-no-repeat bg-[length:1.2em] bg-[right_0.5rem_center]
    ${
      theme === "light"
        ? 'bg-white text-gray-700 hover:bg-gray-50 border-gray-300 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 bg-[url(\'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="%234b5563" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"/></svg>\')]'
        : 'bg-gray-800 text-gray-200 hover:bg-gray-700 border-gray-600 focus:border-sky-400 focus:ring-1 focus:ring-sky-400 bg-[url(\'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="%239ca3af" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"/></svg>\')]'
    }
  `}
              >
                <option value="">All Statuses</option>
                <option value="Active">Active</option>
                <option value="Not Active">Not Active</option>
              </select>
            </div>

            {/* Results Count */}
            <div
              className={`text-sm ${
                theme === "light" ? "text-gray-500" : "text-gray-400"
              } whitespace-nowrap`}
            >
              {filteredData.length} user{filteredData.length !== 1 ? "s" : ""}{" "}
              found
            </div>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div
        className={`rounded-lg shadow-sm border overflow-hidden ${
          theme === "light"
            ? "bg-white border-sky-100"
            : "bg-sky-800 border-sky-600"
        }`}
      >
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div
              className={`flex items-center space-x-3 ${
                theme === "light" ? "text-sky-500" : "text-sky-400"
              }`}
            ></div>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table
                className={`min-w-full divide-y ${
                  theme === "light" ? "divide-sky-200" : "divide-sky-500"
                }`}
              >
                <thead
                  className={`${
                    theme === "light"
                      ? "bg-gradient-to-r from-sky-50 to-sky-100"
                      : "bg-gradient-to-r from-sky-700 to-sky-600"
                  }`}
                >
                  <tr>
                    <th
                      className={`px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider ${
                        theme === "light" ? "text-sky-900" : "text-sky-200"
                      }`}
                    >
                      User
                    </th>
                    <th
                      className={`px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider ${
                        theme === "light" ? "text-sky-900" : "text-sky-200"
                      }`}
                    >
                      Contact
                    </th>
                    <th
                      className={`px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider ${
                        theme === "light" ? "text-sky-900" : "text-sky-200"
                      }`}
                    >
                      Status
                    </th>
                    <th
                      className={`px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider ${
                        theme === "light" ? "text-sky-900" : "text-sky-200"
                      }`}
                    >
                      Roles
                    </th>
                    <th
                      className={`px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider ${
                        theme === "light" ? "text-sky-900" : "text-sky-200"
                      }`}
                    >
                      Joined
                    </th>
                    <th
                      className={`px-6 py-4 text-right text-sm font-semibold uppercase tracking-wider ${
                        theme === "light" ? "text-sky-900" : "text-sky-200"
                      }`}
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody
                  className={`divide-y ${
                    theme === "light"
                      ? "bg-white divide-sky-200"
                      : "bg-gray-800 divide-sky-600"
                  }`}
                >
                  {currentUsers.length > 0 ? (
                    currentUsers.map((user, index) => (
                      <tr
                        key={user?.id || index}
                        className={`${
                          theme === "light"
                            ? "hover:bg-gray-50"
                            : "hover:bg-gray-700"
                        } transition-colors`}
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center space-x-4">
                            <div className="flex-shrink-0">
                              {user?.imageUser ? (
                                <img
                                  src={
                                    user.imageUser instanceof File
                                      ? URL.createObjectURL(user.imageUser)
                                      : user.imageUser
                                  }
                                  alt={user?.name || "User"}
                                  className={`h-12 w-12 rounded-full object-cover border-2 ${
                                    theme === "light"
                                      ? "border-gray-200"
                                      : "border-gray-600"
                                  }`}
                                  onError={(e) => {
                                    e.target.style.display = "none";
                                    e.target.nextSibling.style.display = "flex";
                                  }}
                                />
                              ) : null}
                              <div
                                className={`h-12 w-12 rounded-full bg-gradient-to-r from-sky-400 to-sky-500 flex items-center justify-center text-white font-semibold text-lg ${
                                  user?.imageUser ? "hidden" : ""
                                }`}
                              >
                                {user?.name?.charAt(0)?.toUpperCase() || "U"}
                              </div>
                            </div>
                            <div>
                              <div
                                className={`text-sm font-semibold ${
                                  theme === "light"
                                    ? "text-gray-900"
                                    : "text-gray-200"
                                }`}
                              >
                                {user?.name || "N/A"}
                              </div>
                              <div
                                className={`text-sm flex items-center ${
                                  theme === "light"
                                    ? "text-gray-500"
                                    : "text-gray-400"
                                }`}
                              >
                                <User className="h-3 w-3 mr-1" />
                                ID: {user?.id?.toString().slice(0, 8) || "N/A"}
                                ...
                              </div>
                            </div>
                          </div>
                        </td>

                        <td className="px-6 py-4 whitespace-nowrap">
                          <div
                            className={`flex items-center text-sm ${
                              theme === "light"
                                ? "text-gray-900"
                                : "text-gray-200"
                            }`}
                          >
                            <Mail
                              className={`h-4 w-4 mr-2 ${
                                theme === "light"
                                  ? "text-gray-400"
                                  : "text-gray-500"
                              }`}
                            />
                            {user?.email || "N/A"}
                          </div>
                        </td>

                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusStyle(
                              user?.status
                            )}`}
                          >
                            {user?.status || "N/A"}
                          </span>
                        </td>

                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex flex-wrap gap-1">
                            {user?.roles && Array.isArray(user.roles) ? (
                              user.roles.map((role, idx) => (
                                <span
                                  key={idx}
                                  className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium ${
                                    theme === "light"
                                      ? "bg-sky-100 text-sky-800"
                                      : "bg-sky-900 text-sky-300"
                                  }`}
                                >
                                  {role}
                                </span>
                              ))
                            ) : (
                              <span
                                className={`text-sm ${
                                  theme === "light"
                                    ? "text-gray-500"
                                    : "text-gray-400"
                                }`}
                              >
                                No roles
                              </span>
                            )}
                          </div>
                        </td>

                        <td className="px-6 py-4 whitespace-nowrap">
                          <div
                            className={`flex items-center text-sm ${
                              theme === "light"
                                ? "text-gray-500"
                                : "text-gray-400"
                            }`}
                          >
                            <Calendar className="h-4 w-4 mr-2" />
                            {user?.date || "N/A"}
                          </div>
                        </td>

                        <td className="px-6 py-4 whitespace-nowrap text-right relative">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleMenu(user?.id);
                            }}
                            className={`${
                              theme === "light"
                                ? "text-gray-400 hover:text-gray-600 hover:bg-gray-100"
                                : "text-gray-500 hover:text-gray-300 hover:bg-gray-700"
                            } transition-colors p-2 rounded-full`}
                          >
                            <MoreVertical size={20} />
                          </button>

                          {menuOpen === user?.id && (
                            <div
                              className={`absolute right-0 top-12 w-48 border rounded-lg shadow-lg z-50 py-2 ${
                                theme === "light"
                                  ? "bg-white border-gray-200"
                                  : "bg-gray-800 border-gray-600"
                              }`}
                            >
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  if (user) {
                                    onEdit(user);
                                  }
                                  setMenuOpen(null);
                                }}
                                className={`w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center space-x-3 text-sm ${
                                  theme === "light"
                                    ? "text-gray-700 hover:bg-gray-50"
                                    : "text-gray-200 hover:bg-gray-700"
                                }`}
                              >
                                <i
                                  className={`fa-solid fa-pen-to-square ${
                                    theme === "light"
                                      ? "text-sky-500"
                                      : "text-sky-300"
                                  }`}
                                ></i>
                                <span>Edit User</span>
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  if (user?.id) {
                                    onDelete(user.id);
                                  }
                                  setMenuOpen(null);
                                }}
                                className={`w-full px-4 py-2 text-left flex items-center space-x-3 text-sm ${
                                  theme === "light"
                                    ? "text-red-600 hover:bg-gray-50"
                                    : "text-red-300 hover:bg-gray-700"
                                }`}
                              >
                                <i className="fa-solid fa-trash"></i>
                                <span>Delete User</span>
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
                          <Users
                            className={`h-12 w-12 ${
                              theme === "light"
                                ? "text-gray-300"
                                : "text-gray-500"
                            }`}
                          />
                          <div>
                            <h3
                              className={`text-lg font-medium ${
                                theme === "light"
                                  ? "text-gray-900"
                                  : "text-gray-200"
                              }`}
                            >
                              No users found
                            </h3>
                            <p
                              className={`${
                                theme === "light"
                                  ? "text-gray-500"
                                  : "text-gray-400"
                              }`}
                            >
                              {searchTerm || statusFilter
                                ? "Try adjusting your search or filter criteria"
                                : "Get started by adding your first user"}
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
              <div
                className={`px-6 py-4 border-t ${
                  theme === "light"
                    ? "bg-gray-50 border-gray-200"
                    : "bg-gray-700 border-gray-600"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div
                    className={`text-sm ${
                      theme === "light" ? "text-gray-700" : "text-gray-300"
                    }`}
                  >
                    Showing{" "}
                    <span className="font-medium">{indexOfFirstUser + 1}</span>{" "}
                    to{" "}
                    <span className="font-medium">
                      {Math.min(indexOfLastUser, filteredData.length)}
                    </span>{" "}
                    of{" "}
                    <span className="font-medium">{filteredData.length}</span>{" "}
                    users
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
                        const isNearCurrentPage =
                          Math.abs(page - currentPage) <= 2;
                        const isFirstOrLast = page === 1 || page === totalPages;

                        if (isNearCurrentPage || isFirstOrLast) {
                          return (
                            <button
                              key={page}
                              onClick={() => setCurrentPage(page)}
                              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                                isCurrentPage
                                  ? theme === "light"
                                    ? "bg-sky-500 text-white"
                                    : "bg-sky-700 text-white"
                                  : theme === "light"
                                  ? "text-gray-700 hover:bg-gray-100"
                                  : "text-gray-200 hover:bg-gray-700"
                              }`}
                            >
                              {page}
                            </button>
                          );
                        } else if (
                          page === currentPage - 3 ||
                          page === currentPage + 3
                        ) {
                          return (
                            <span
                              key={page}
                              className={`px-2 ${
                                theme === "light"
                                  ? "text-gray-400"
                                  : "text-gray-500"
                              }`}
                            >
                              ...
                            </span>
                          );
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
    </div>
  );
};

export default UserList;
