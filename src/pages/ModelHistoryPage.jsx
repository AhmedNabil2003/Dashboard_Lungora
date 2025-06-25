import { useContext } from "react";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { ThemeContext } from "../context/themeContext";
import { useModelHistory } from "../features/history/useModelHistory";
import ModelHistoryList from "../features/history/ModelHistoryList";
import ModelHistoryDetail from "../features/history/ModelHistoryDetail";
import { Facebook } from 'react-content-loader';

const ModelHistoryPage = () => {
  const { theme } = useContext(ThemeContext);
  const {
    loading,
    error,
    paginatedData,
    sortConfig,
    searchQuery,
    currentPage,
    selectedRecord,
    deleteRecordId,
    statusFilter,
    menuOpen,
    totalPages,
    isDetailModalOpen,
    isDeleteModalOpen,
    setSearchQuery,
    setCurrentPage,
    setStatusFilter,
    setMenuOpen,
    setIsDetailModalOpen,
    setIsDeleteModalOpen,
    fetchRecordDetails,
    removeHistory,
    handleSort,
    setDeleteRecordId,
  } = useModelHistory();

  const confirmDelete = async () => {
    await removeHistory(deleteRecordId);
    setIsDeleteModalOpen(false);
    setDeleteRecordId(null);
  };

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className={`p-4 rounded-lg ${
          theme === "light" ? "bg-red-50 text-red-600" : "bg-red-900 text-red-200"
        }`}>
          Error: {error}
        </div>
      </div>
    );
  }

  return (
    <motion.div
      className={`flex justify-center items-start min-h-screen ${
        theme === "light"
          ? "bg-gradient-to-br from-gray-50 to-gray-100"
          : "bg-gradient-to-br from-gray-800 to-gray-900"
      } p-4`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
        {loading ? (
          <div className="space-y-6">
            {/* Header Skeleton */}
            <div className="flex flex-col lg:flex-row items-center justify-between space-y-4 lg:space-y-0 lg:space-x-4">
              <div className="flex items-center space-x-3">
                <Facebook 
                  speed={1.5}
                  backgroundColor={theme === "light" ? "#f3f3f3" : "#333"}
                  foregroundColor={theme === "light" ? "#ecebeb" : "#444"}
                  width={48}
                  height={48}
                />
                <div>
                  <Facebook 
                    speed={1.5}
                    backgroundColor={theme === "light" ? "#f3f3f3" : "#333"}
                    foregroundColor={theme === "light" ? "#ecebeb" : "#444"}
                    width={150}
                    height={24}
                  />
                  <Facebook 
                    speed={1.5}
                    backgroundColor={theme === "light" ? "#f3f3f3" : "#333"}
                    foregroundColor={theme === "light" ? "#ecebeb" : "#444"}
                    width={200}
                    height={16}
                    style={{ marginTop: '8px' }}
                  />
                </div>
              </div>
              
              {/* Search Skeleton */}
              <Facebook 
                speed={1.5}
                backgroundColor={theme === "light" ? "#f3f3f3" : "#333"}
                foregroundColor={theme === "light" ? "#ecebeb" : "#444"}
                width={300}
                height={40}
              />
            </div>

            {/* Table Skeleton */}
            <div className="space-y-4">
              {[...Array(8)].map((_, i) => (
                <Facebook 
                  key={i}
                  speed={1.5}
                  backgroundColor={theme === "light" ? "#f3f3f3" : "#333"}
                  foregroundColor={theme === "light" ? "#ecebeb" : "#444"}
                  width="100%"
                  height={60}
                />
              ))}
            </div>
          </div>
        ) : (
          <ModelHistoryList
            paginatedData={paginatedData}
            sortConfig={sortConfig}
            searchQuery={searchQuery}
            currentPage={currentPage}
            statusFilter={statusFilter}
            menuOpen={menuOpen}
            totalPages={totalPages}
            setSearchQuery={setSearchQuery}
            setCurrentPage={setCurrentPage}
            setStatusFilter={setStatusFilter}
            setMenuOpen={setMenuOpen}
            handleSort={handleSort}
            fetchRecordDetails={fetchRecordDetails}
            setDeleteRecordId={setDeleteRecordId}
            setIsDeleteModalOpen={setIsDeleteModalOpen}
            theme={theme}
          />
        )}
        
      {/* Modals */}
      {isDetailModalOpen && (
        <ModelHistoryDetail
          isOpen={isDetailModalOpen}
          onClose={() => setIsDetailModalOpen(false)}
          record={selectedRecord}
          theme={theme}
        />
      )}

      {isDeleteModalOpen && (
        <motion.div
          className="fixed inset-0 flex items-center justify-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className={`w-72 overflow-hidden rounded-xl shadow-2xl ${
              theme === "light" ? "bg-white text-gray-800" : "bg-gray-800 text-gray-200"
            }`}
            initial={{ scale: 0.8, y: 30, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.8, y: 30, opacity: 0 }}
            transition={{ type: "spring", stiffness: 350 }}
          >
            <div
              className={`p-4 ${
                theme === "light" ? "bg-sky-600 text-white" : "bg-gray-700 text-white"
              }`}
            >
              <h2 className="text-lg font-semibold flex items-center">
                Confirm Deletion
              </h2>
            </div>

            <div className="p-5">
              <p
                className={`${
                  theme === "dark" ? "text-gray-300" : "text-gray-600"
                }`}
              >
                Are you sure you want to delete this record?
              </p>

              <div className="mt-6 flex justify-end space-x-3">
                <motion.button
                  onClick={() => setIsDeleteModalOpen(false)}
                  className={`px-4 py-2 rounded-lg cursor-pointer transition-colors ${
                    theme === "light" 
                      ? "bg-gray-200 text-gray-800 hover:bg-gray-300" 
                      : "bg-gray-700 text-gray-200 hover:bg-gray-600"
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Cancel
                </motion.button>
                <motion.button
                  onClick={confirmDelete}
                  className={`px-4 py-2 rounded-lg cursor-pointer hover:bg-red-700 transition-colors ${
                    theme === "light" ? "bg-red-500 text-white" : "bg-red-700 text-gray-100"
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Delete
                </motion.button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default ModelHistoryPage;