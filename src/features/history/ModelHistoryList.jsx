// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import {
  Search,
  Eye,
  Trash2,
  ArrowUp,
  ArrowDown,
  User,
  CheckCircle2,
  XCircle,
  Database,
  Filter,
  Calendar,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { format } from "date-fns";

const ModelHistoryList = ({
  paginatedData,
  sortConfig,
  searchQuery,
  currentPage,
  statusFilter,
  menuOpen,
  totalPages,
  itemsPerPage,
  loading,
  error,
  setSearchQuery,
  setCurrentPage,
  setStatusFilter,
  setMenuOpen,
  handleSort,
  fetchRecordDetails,
  setDeleteRecordId,
  setIsDeleteModalOpen,
  theme,
}) => {
  const getStatusStyle = (status) => {
    if (!status) return "bg-gray-100 text-gray-600";

    const statusStr = String(status).toLowerCase().trim();
    switch (statusStr) {
      case "high":
        return "bg-green-100 text-green-700 border border-green-200";
        case "medium":
          return "bg-blue-100 text-blue-700 border border-blue-200";
        default:
          return "bg-red-100 text-red-700 border border-red-200";
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div
          className={`animate-spin rounded-full h-12 w-12 border-b-2 ${
            theme === "light" ? "border-sky-600" : "border-sky-300"
          }`}
        ></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div
          className={`${
            theme === "light"
              ? "bg-red-50 text-red-600"
              : "bg-red-900 text-red-200"
          } p-4 rounded-lg`}
        >
          Error loading history: {error}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6 p-6">
      {/* Search and Filter Section */}
      <div
        className={`p-6 rounded-xl shadow-sm border ${
          theme === "light"
            ? "bg-white border-sky-100"
            : "bg-gray-800 border-sky-700"
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
              <Database className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3
                className={`text-xl font-bold ${
                  theme === "light" ? "text-gray-900" : "text-white"
                }`}
              >
                Manage History
              </h3>
              <p
                className={`text-sm ${
                  theme === "light" ? "text-gray-600" : "text-gray-300"
                }`}
              >
                Monitor and manage prediction history
              </p>
            </div>
          </div>

          {/* Search Input */}
          <div
            className={`flex items-center border rounded-lg px-4 py-3 w-full lg:w-1/2 ${
              theme === "light"
                ? "bg-gray-50 border-gray-200"
                : "bg-gray-700 border-gray-600"
            }`}
          >
            <Search
              size={20}
              className={`mr-3 ${
                theme === "light" ? "text-gray-400" : "text-gray-300"
              }`}
            />
            <input
              type="text"
              placeholder="Search by user, prediction or status"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full bg-transparent border-none outline-none ${
                theme === "light"
                  ? "text-gray-700 placeholder-gray-400"
                  : "text-white placeholder-gray-300"
              }`}
            />
          </div>

          <div className="flex items-center space-x-4 w-full lg:w-auto">
            {/* Status Filter */}
            <div
              className={`flex items-center border rounded-lg px-4 py-3 min-w-0 lg:min-w-[200px] ${
                theme === "light"
                  ? "bg-gray-50 border-gray-200"
                  : "bg-gray-700 border-gray-600"
              }`}
            >
              <Filter
                size={20}
                className={`mr-3 ${
                  theme === "light" ? "text-gray-400" : "text-gray-300"
                }`}
              />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className={`w-full p-2 rounded-md border ${
                  theme === "light"
                    ? "text-gray-700 bg-white border-gray-300 hover:border-sky-500 focus:border-sky-500"
                    : "text-white bg-gray-700 border-gray-600 hover:border-sky-400 focus:border-sky-400"
                } outline-none cursor-pointer transition-colors duration-200`}
              >
                <option value="">All Status</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>

            {/* Results Count */}
            <div
              className={`text-sm whitespace-nowrap ${
                theme === "light" ? "text-gray-500" : "text-gray-300"
              }`}
            >
              {paginatedData.length} records
            </div>
          </div>
        </div>
      </div>

      {/* History Table */}
      <div
        className={`rounded-xl shadow-sm border overflow-hidden ${
          theme === "light"
            ? "bg-white border-sky-100"
            : "bg-sky-800 border-sky-700"
        }`}
      >
        <div className="overflow-x-auto">
         <table
                className={`min-w-full divide-y ${
                  theme === "light" ? "divide-sky-200" : "divide-sky-500"
                }`}
              >
            <thead
              className={`bg-gradient-to-r ${
                theme === "light"
                  ? "from-sky-50 to-sky-100"
                  : "from-sky-700 to-sky-800"
              }`}
            >
              <tr>
                {[
                  { key: "imagePath", label: "Image", sortable: false },
                  { key: "userId", label: "User", sortable: true },
                  { key: "prediction", label: "Prediction", sortable: true },
                  { key: "status", label: "Status", sortable: true },
                  { key: "isSave", label: "Saved", sortable: true },
                  { key: "createdAt", label: "Time", sortable: true },
                  { key: "actions", label: "Actions", sortable: false },
                ].map(({ key, label, sortable }) => (
                  <th
                    key={key}
                    className={`px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider ${
                      theme === "light" ? "text-sky-900" : "text-sky-300"
                    } ${sortable ? "cursor-pointer hover:bg-sky-200/50" : ""}`}
                    onClick={() => sortable && handleSort(key)}
                  >
                    <div className="flex items-center space-x-2">
                      <span>{label}</span>
                      {sortable &&
                        sortConfig.key === key &&
                        (sortConfig.direction === "asc" ? (
                          <ArrowUp
                            className={`w-4 h-4 ${
                              theme === "light"
                                ? "text-blue-600"
                                : "text-blue-400"
                            }`}
                          />
                        ) : (
                          <ArrowDown
                            className={`w-4 h-4 ${
                              theme === "light"
                                ? "text-sky-600"
                                : "text-sky-400"
                            }`}
                          />
                        ))}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody
              className={`divide-y ${
                theme === "light"
                  ? "divide-sky-200 bg-white"
                  : "divide-sky-700 bg-gray-800"
              }`}
            >
              {paginatedData.length > 0 ? (
                paginatedData.map((item) => (
                  <tr
                    key={item.id}
                    className={`transition-colors ${
                      theme === "light"
                        ? "hover:bg-gray-50"
                        : "hover:bg-gray-700"
                    }`}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="relative group">
                        <img
                          src={item.imagePath}
                          alt="Model Result"
                          className="w-16 h-16 object-cover rounded-xl cursor-pointer transition-transform duration-200 group-hover:scale-105"
                          onClick={() => fetchRecordDetails(item.id)}
                        />
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-3">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            theme === "light"
                              ? "bg-gradient-to-r from-sky-600 to-sky-500"
                              : "bg-gradient-to-r from-sky-700 to-sky-600"
                          }`}
                        >
                          <User className="w-4 h-4 text-white" />
                        </div>
                        <span
                          className={`font-medium ${
                            theme === "light" ? "text-gray-800" : "text-white"
                          }`}
                        >
                          {item.userId}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`font-medium ${
                          theme === "light" ? "text-gray-700" : "text-gray-300"
                        }`}
                      >
                        {item.prediction}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusStyle(
                          item.status
                        )}`}
                      >
                        {item.status === "High" ? (
                          <CheckCircle2 className="w-4 h-4 mr-1" />
                        ) : (
                          <XCircle className="w-4 h-4 mr-1" />
                        )}
                        <span>{item.status}</span>
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`font-medium ${
                          item.isSave
                            ? theme === "light"
                              ? "text-green-600"
                              : "text-green-400"
                            : theme === "light"
                            ? "text-gray-600"
                            : "text-gray-400"
                        }`}
                      >
                        {item.isSave ? "Saved" : "Not Saved"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div
                        className={`flex items-center text-sm ${
                          theme === "light" ? "text-gray-500" : "text-gray-400"
                        }`}
                      >
                        <Calendar className="h-4 w-4 mr-2" />
                        {format(new Date(item.createdAt), "dd/MM/yyyy HH:mm")}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right relative">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setMenuOpen(menuOpen === item.id ? null : item.id);
                        }}
                        className={`p-2 rounded-full transition-colors ${
                          theme === "light"
                            ? "text-gray-400 hover:text-gray-600 hover:bg-gray-100"
                            : "text-gray-400 hover:text-gray-200 hover:bg-gray-700"
                        }`}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <circle cx="12" cy="12" r="1"></circle>
                          <circle cx="12" cy="5" r="1"></circle>
                          <circle cx="12" cy="19" r="1"></circle>
                        </svg>
                      </button>

                      {menuOpen === item.id && (
                        <div
                          className={`absolute right-0 top-12 w-48 rounded-lg shadow-lg z-50 py-2 ${
                            theme === "light"
                              ? "bg-white border border-gray-200"
                              : "bg-gray-800 border border-gray-700"
                          }`}
                        >
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              fetchRecordDetails(item.id);
                              setMenuOpen(null);
                            }}
                            className={`w-full px-4 py-2 text-left flex items-center space-x-3 text-sm ${
                              theme === "light"
                                ? "text-gray-700 hover:bg-gray-50"
                                : "text-gray-200 hover:bg-gray-700"
                            }`}
                          >
                            <Eye className="w-4 h-4 text-blue-500" />
                            <span>View</span>
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setDeleteRecordId(item.id);
                              setIsDeleteModalOpen(true);
                              setMenuOpen(null);
                            }}
                            className={`w-full px-4 py-2 text-left flex items-center space-x-3 text-sm ${
                              theme === "light"
                                ? "text-red-600 hover:bg-gray-50"
                                : "text-red-400 hover:bg-gray-700"
                            }`}
                          >
                            <Trash2 className="w-4 h-4" />
                            <span>Delete</span>
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center space-y-3">
                      <Database
                        className={`h-12 w-12 ${
                          theme === "light" ? "text-gray-300" : "text-gray-600"
                        }`}
                      />
                      <div>
                        <h3
                          className={`text-lg font-medium ${
                            theme === "light" ? "text-gray-900" : "text-white"
                          }`}
                        >
                          No records found
                        </h3>
                        <p
                          className={`${
                            theme === "light"
                              ? "text-gray-500"
                              : "text-gray-400"
                          }`}
                        >
                          {searchQuery || statusFilter
                            ? "Try adjusting your search or filter"
                            : "No history records available"}
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
        {paginatedData.length > 0 && totalPages > 1 && (
          <div
            className={`px-6 py-4 border-t ${
              theme === "light"
                ? "bg-gray-50 border-gray-200"
                : "bg-gray-800 border-gray-700"
            }`}
          >
            <div className="flex items-center justify-between">
              <div
                className={`text-sm ${
                  theme === "light" ? "text-gray-700" : "text-gray-300"
                }`}
              >
                Showing{" "}
                <span className="font-medium">
                  {(currentPage - 1) * itemsPerPage + 1}
                </span>{" "}
                to{" "}
                <span className="font-medium">
                  {Math.min(currentPage * itemsPerPage, paginatedData.length)}
                </span>{" "}
                of <span className="font-medium">{paginatedData.length}</span>{" "}
                records
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentPage === 1}
                  className={`px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${
                    currentPage === 1
                      ? theme === "light"
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200"
                        : "bg-gray-700 text-gray-500 cursor-not-allowed border-gray-600"
                      : theme === "light"
                      ? "bg-white text-gray-700 hover:bg-gray-50 border-gray-300"
                      : "bg-gray-800 text-gray-200 hover:bg-gray-700 border-gray-600"
                  }`}
                >
                  <ChevronLeft className="w-5 h-5" />
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
                          className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                            isCurrentPage
                              ? theme === "light"
                                ? "bg-sky-500 text-white"
                                : "bg-sky-600 text-white"
                              : theme === "light"
                              ? "text-gray-700 hover:bg-gray-100"
                              : "text-gray-300 hover:bg-gray-700"
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
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                  className={`px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${
                    currentPage === totalPages
                      ? theme === "light"
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200"
                        : "bg-gray-700 text-gray-500 cursor-not-allowed border-gray-600"
                      : theme === "light"
                      ? "bg-white text-gray-700 hover:bg-gray-50 border-gray-300"
                      : "bg-gray-800 text-gray-200 hover:bg-gray-700 border-gray-600"
                  }`}
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ModelHistoryList;
