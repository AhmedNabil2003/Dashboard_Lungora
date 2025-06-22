// import  { useState, useEffect, useMemo } from 'react';
// import { format } from 'date-fns';
// // eslint-disable-next-line no-unused-vars
// import { motion, AnimatePresence } from 'framer-motion';
// import { 
//   Search, Eye, Trash2, ArrowUp, ArrowDown, User, 
//   CheckCircle2, XCircle, Database, Filter, Calendar, ChevronLeft, ChevronRight
// } from 'lucide-react';
// import { getAllHistory, getHistoryById, deleteHistory } from '../services/apiHistory';

// const ModelHistoryPage = () => {
//   const [historyData, setHistoryData] = useState([]);
//   const [sortConfig, setSortConfig] = useState({ key: 'createdAt', direction: 'desc' });
//   const [searchQuery, setSearchQuery] = useState('');
//   const [currentPage, setCurrentPage] = useState(1);
//   const [selectedRecord, setSelectedRecord] = useState(null);
//   const [confirmDeleteId, setConfirmDeleteId] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [statusFilter, setStatusFilter] = useState('');
//   const [menuOpen, setMenuOpen] = useState(null);
//   const itemsPerPage = 8;

//   // Fetch data from API
//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const response = await getAllHistory();
//         if (response.isSuccess) {
//           setHistoryData(response.result.history);
//         }
//       } catch (error) {
//         console.error('Error fetching data:', error);
//       } finally {
//         setLoading(false);
//       }
//     };
    
//     fetchData();
//   }, []);

//   // Filtering and search logic
//   const filteredData = useMemo(() => {
//     return historyData.filter(item => {
//       const searchLower = searchQuery.toLowerCase();
      
//       // Check if any of these fields include the search query
//       const matchesUser = item.userId.toLowerCase().includes(searchLower);
//       const matchesPrediction = item.prediction.toLowerCase().includes(searchLower);
//       const matchesStatus = item.status.toLowerCase().includes(searchLower);
      
//       // Combine with status filter
//       const matchesStatusFilter = statusFilter ? 
//         item.status.toLowerCase() === statusFilter.toLowerCase() : 
//         true;
      
//       // Return true if either user, prediction, or status matches AND status filter matches
//       return (matchesUser || matchesPrediction || matchesStatus) && matchesStatusFilter;
//     });
//   }, [historyData, searchQuery, statusFilter]);

//   // Sorting logic
//   const sortedData = useMemo(() => {
//     const sorted = [...filteredData].sort((a, b) => {
//       if (sortConfig.key === 'createdAt') {
//         return sortConfig.direction === 'asc'
//           ? new Date(a.createdAt) - new Date(b.createdAt)
//           : new Date(b.createdAt) - new Date(a.createdAt);
//       }
//       return sortConfig.direction === 'asc'
//         ? a[sortConfig.key].localeCompare(b[sortConfig.key])
//         : b[sortConfig.key].localeCompare(a[sortConfig.key]);
//     });
//     return sorted;
//   }, [filteredData, sortConfig]);

//   // Pagination logic
//   const paginatedData = useMemo(() => {
//     const startIndex = (currentPage - 1) * itemsPerPage;
//     return sortedData.slice(startIndex, startIndex + itemsPerPage);
//   }, [sortedData, currentPage]);

//   const totalPages = Math.ceil(sortedData.length / itemsPerPage);
//   const indexOfFirstRecord = (currentPage - 1) * itemsPerPage + 1;
//   const indexOfLastRecord = Math.min(currentPage * itemsPerPage, sortedData.length);

//   // Handlers
//   const handleSort = (key) => {
//     setSortConfig((prev) => ({
//       key,
//       direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc',
//     }));
//   };

//   const handleDelete = async () => {
//     try {
//       await deleteHistory(confirmDeleteId);
//       setHistoryData(historyData.filter(item => item.id !== confirmDeleteId));
//       setConfirmDeleteId(null);
//     } catch (error) {
//       console.error('Error deleting record:', error);
//     }
//   };

//   const handleViewDetails = async (id) => {
//     try {
//       const response = await getHistoryById(id);
//       if (response.isSuccess) {
//         setSelectedRecord(response.result);
//       }
//     } catch (error) {
//       console.error('Error fetching record details:', error);
//     }
//   };

//   const toggleMenu = (id) => {
//     setMenuOpen(menuOpen === id ? null : id);
//   };

//   const getStatusStyle = (status) => {
//     if (!status) return "bg-gray-100 text-gray-600";
    
//     const statusStr = String(status).toLowerCase().trim();
//     switch (statusStr) {
//       case "high":
//         return "bg-red-100 text-red-700 border border-red-200";
//       default:
//         return "bg-green-100 text-green-700 border border-green-200";
//     }
//   };

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center min-h-screen">
//         <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
//       </div>
//     );
//   }

//   return (
//     <div className="w-full space-y-6 p-6">
//       {/* Search and Filter Section */}
//       <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
//         <div className="flex flex-col lg:flex-row items-center justify-between space-y-4 lg:space-y-0 lg:space-x-4">
//           <div className="flex items-center space-x-3">
//             <div className="p-3 bg-gradient-to-r from-sky-700 to-sky-600 rounded-lg">
//               <Database className="h-5 w-5 text-white" />
//             </div>
//             <div>
//               <h3 className="text-xl font-bold text-gray-900">Manage History</h3>
//               <p className="text-sm text-gray-600">Monitor and manage prediction history</p>
//             </div>
//           </div>
          
//           {/* Search Input */}
//           <div className="flex items-center bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 w-full lg:w-1/2">
//             <Search size={20} className="text-gray-400 mr-3" />
//             <input
//               type="text"
//               placeholder="Search by user, prediction or status"
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//               className="w-full bg-transparent border-none outline-none text-gray-700 placeholder-gray-400"
//             />
//           </div>

//           <div className="flex items-center space-x-4 w-full lg:w-auto">
//             {/* Status Filter */}
//             <div className="flex items-center bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 min-w-0 lg:min-w-[200px]">
//               <Filter size={20} className="text-gray-400 mr-3" />
//               <select
//                 value={statusFilter}
//                 onChange={(e) => setStatusFilter(e.target.value)}
//                 className="w-full bg-transparent border-none outline-none text-gray-700 appearance-none cursor-pointer"
//               >
//                 <option value="">All Status</option>
//                 <option value="High">High</option>
//                 <option value="Medium">Medium</option>
//                 <option value="Low">Low</option>
//               </select>
//             </div>
            
//             {/* Results Count */}
//             <div className="text-sm text-gray-500 whitespace-nowrap">
//               {filteredData.length} records
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* History Table */}
//       <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
//         <div className="overflow-x-auto">
//           <table className="min-w-full divide-y divide-gray-200">
//             <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
//               <tr>
//                 {[
//                   { key: 'imagePath', label: 'Image', sortable: false },
//                   { key: 'userId', label: 'User', sortable: true },
//                   { key: 'prediction', label: 'Prediction', sortable: true },
//                   { key: 'status', label: 'Status', sortable: true },
//                   { key: 'isSave', label: 'Saved', sortable: true },
//                   { key: 'createdAt', label: 'Time', sortable: true },
//                   { key: 'actions', label: 'Actions', sortable: false }
//                 ].map(({ key, label, sortable }) => (
//                   <th
//                     key={key}
//                     className={`px-6 py-4 text-left text-sm font-semibold text-gray-900 uppercase tracking-wider ${
//                       sortable ? 'cursor-pointer hover:bg-gray-200/50' : ''
//                     }`}
//                     onClick={() => sortable && handleSort(key)}
//                   >
//                     <div className="flex items-center space-x-2">
//                       <span>{label}</span>
//                       {sortable && sortConfig.key === key && (
//                         sortConfig.direction === 'asc' ? (
//                           <ArrowUp className="w-4 h-4 text-blue-600" />
//                         ) : (
//                           <ArrowDown className="w-4 h-4 text-blue-600" />
//                         )
//                       )}
//                     </div>
//                   </th>
//                 ))}
//               </tr>
//             </thead>
//             <tbody className="bg-white divide-y divide-gray-200">
//               {paginatedData.length > 0 ? (
//                 paginatedData.map((item) => (
//                   <tr key={item.id} className="hover:bg-gray-50 transition-colors">
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <div className="relative group">
//                         <img
//                           src={item.imagePath}
//                           alt="Model Result"
//                           className="w-16 h-16 object-cover rounded-xl cursor-pointer transition-transform duration-200 group-hover:scale-105"
//                           onClick={() => handleViewDetails(item.id)}
//                         />
//                         <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 rounded-xl transition-all duration-200 flex items-center justify-center">
//                           <Eye className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
//                         </div>
//                       </div>
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <div className="flex items-center space-x-3">
//                         <div className="w-8 h-8 bg-gradient-to-r from-sky-600 to-sky-500 rounded-full flex items-center justify-center">
//                           <User className="w-4 h-4 text-white" />
//                         </div>
//                         <span className="font-medium text-gray-800">{item.userId}</span>
//                       </div>
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <span className="font-medium text-gray-700">{item.prediction}</span>
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusStyle(item.status)}`}>
//                         {item.status === 'High' ? (
//                           <XCircle className="w-4 h-4 mr-1" />
//                         ) : (
//                           <CheckCircle2 className="w-4 h-4 mr-1" />
//                         )}
//                         <span>{item.status}</span>
//                       </span>
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <span className={`font-medium ${
//                         item.isSave ? 'text-green-600' : 'text-gray-600'
//                       }`}>
//                         {item.isSave ? 'Saved' : 'Not Saved'}
//                       </span>
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <div className="flex items-center text-sm text-gray-500">
//                         <Calendar className="h-4 w-4 mr-2" />
//                         {format(new Date(item.createdAt), 'dd/MM/yyyy HH:mm')}
//                       </div>
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-right relative">
//                       <button
//                         onClick={(e) => {
//                           e.stopPropagation();
//                           toggleMenu(item.id);
//                         }}
//                         className="text-gray-400 hover:text-gray-600 transition-colors p-2 rounded-full hover:bg-gray-100"
//                       >
//                         <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//                           <circle cx="12" cy="12" r="1"></circle>
//                           <circle cx="12" cy="5" r="1"></circle>
//                           <circle cx="12" cy="19" r="1"></circle>
//                         </svg>
//                       </button>
                      
//                       {menuOpen === item.id && (
//                         <div className="absolute right-0 top-12 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50 py-2">
//                           <button
//                             onClick={(e) => {
//                               e.stopPropagation();
//                               handleViewDetails(item.id);
//                               setMenuOpen(null);
//                             }}
//                             className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center space-x-3 text-sm text-gray-700"
//                           >
//                             <Eye className="w-4 h-4 text-blue-500" />
//                             <span>View</span>
//                           </button>
//                           <button
//                             onClick={(e) => {
//                               e.stopPropagation();
//                               setConfirmDeleteId(item.id);
//                               setMenuOpen(null);
//                             }}
//                             className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center space-x-3 text-sm text-red-600"
//                           >
//                             <Trash2 className="w-4 h-4" />
//                             <span>Delete</span>
//                           </button>
//                         </div>
//                       )}
//                     </td>
//                   </tr>
//                 ))
//               ) : (
//                 <tr>
//                   <td colSpan="7" className="px-6 py-12 text-center">
//                     <div className="flex flex-col items-center space-y-3">
//                       <Database className="h-12 w-12 text-gray-300" />
//                       <div>
//                         <h3 className="text-lg font-medium text-gray-900">No records found</h3>
//                         <p className="text-gray-500">
//                           {searchQuery || statusFilter ? 
//                             'Try adjusting your search or filter' : 
//                             'No history records available'
//                           }
//                         </p>
//                       </div>
//                     </div>
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         </div>

//         {/* Pagination */}
//         {filteredData.length > 0 && totalPages > 1 && (
//           <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
//             <div className="flex items-center justify-between">
//               <div className="text-sm text-gray-700">
//                 Showing <span className="font-medium">{indexOfFirstRecord}</span> to{' '}
//                 <span className="font-medium">{indexOfLastRecord}</span>{' '}
//                 of <span className="font-medium">{filteredData.length}</span> records
//               </div>
              
//               <div className="flex items-center space-x-2">
//                 <button
//                   onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
//                   disabled={currentPage === 1}
//                   className={`px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${
//                     currentPage === 1
//                       ? "bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200"
//                       : "bg-white text-gray-700 hover:bg-gray-50 border-gray-300"
//                   }`}
//                 >
//                   <ChevronLeft className="w-5 h-5" />
//                 </button>
                
//                 <div className="flex items-center space-x-1">
//                   {[...Array(totalPages)].map((_, index) => {
//                     const page = index + 1;
//                     const isCurrentPage = page === currentPage;
//                     const isNearCurrentPage = Math.abs(page - currentPage) <= 2;
//                     const isFirstOrLast = page === 1 || page === totalPages;
                    
//                     if (isNearCurrentPage || isFirstOrLast) {
//                       return (
//                         <button
//                           key={page}
//                           onClick={() => setCurrentPage(page)}
//                           className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
//                             isCurrentPage
//                               ? 'bg-sky-500 text-white'
//                               : 'text-gray-700 hover:bg-gray-100'
//                           }`}
//                         >
//                           {page}
//                         </button>
//                       );
//                     } else if (page === currentPage - 3 || page === currentPage + 3) {
//                       return <span key={page} className="px-2 text-gray-400">...</span>;
//                     }
//                     return null;
//                   })}
//                 </div>
                
//                 <button
//                   onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
//                   disabled={currentPage === totalPages}
//                   className={`px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${
//                     currentPage === totalPages
//                       ? "bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200"
//                       : "bg-white text-gray-700 hover:bg-gray-50 border-gray-300"
//                   }`}
//                 >
//                   <ChevronRight className="w-5 h-5" />
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>

//       {/* Modals */}
//       <AnimatePresence>
//         {/* Record Detail Modal */}
//         {selectedRecord && (
//           <motion.div
//             className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//           >
//             <motion.div
//               className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
//               initial={{ scale: 0.95, y: 20 }}
//               animate={{ scale: 1, y: 0 }}
//               exit={{ scale: 0.95, y: 20 }}
//             >
//               <div className="p-6 border-b border-gray-200">
//                 <h2 className="text-2xl font-bold text-gray-800">Details</h2>
//               </div>
              
//               <div className="p-6">
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                   <div>
//                     <img
//                       src={selectedRecord.imagePath}
//                       alt="Model Result"
//                       className="w-full h-auto rounded-xl object-cover"
//                     />
//                   </div>
                  
//                   <div className="space-y-4">
//                     <div>
//                       <h3 className="text-sm font-medium text-gray-500">User</h3>
//                       <p className="text-lg font-medium text-gray-800">{selectedRecord.userId}</p>
//                     </div>
                    
//                     <div>
//                       <h3 className="text-sm font-medium text-gray-500">Prediction</h3>
//                       <p className="text-lg font-medium text-gray-800">{selectedRecord.prediction}</p>
//                     </div>
                    
//                     <div>
//                       <h3 className="text-sm font-medium text-gray-500">Status</h3>
//                       <div className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full text-sm font-medium ${
//                         selectedRecord.status === 'High'
//                           ? 'bg-red-100 text-red-800'
//                           : 'bg-green-100 text-green-800'
//                       }`}>
//                         {selectedRecord.status === 'High' ? (
//                           <XCircle className="w-4 h-4" />
//                         ) : (
//                           <CheckCircle2 className="w-4 h-4" />
//                         )}
//                         <span>{selectedRecord.status}</span>
//                       </div>
//                     </div>
                    
//                     <div>
//                       <h3 className="text-sm font-medium text-gray-500">Saved</h3>
//                       <p className="text-lg font-medium text-gray-800">
//                         {selectedRecord.isSave ? 'Saved' : 'Not Saved'}
//                       </p>
//                     </div>
                    
//                     <div>
//                       <h3 className="text-sm font-medium text-gray-500">Time</h3>
//                       <p className="text-lg font-medium text-gray-800">
//                         {format(new Date(selectedRecord.createdAt), 'yyyy-MM-dd HH:mm')}
//                       </p>
//                     </div>
//                   </div>
//                 </div>
//               </div>
              
//               <div className="p-6 border-t border-gray-200 flex justify-end">
//                 <button
//                   onClick={() => setSelectedRecord(null)}
//                   className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors duration-200"
//                 >
//                   Close
//                 </button>
//               </div>
//             </motion.div>
//           </motion.div>
//         )}

//         {/* Confirm Delete Modal */}
//         {confirmDeleteId && (
//           <motion.div
//             className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//           >
//             <motion.div
//               className="bg-white rounded-2xl shadow-xl max-w-md w-full"
//               initial={{ scale: 0.95, y: 20 }}
//               animate={{ scale: 1, y: 0 }}
//               exit={{ scale: 0.95, y: 20 }}
//             >
//               <div className="p-6 border-b border-gray-200">
//                 <h2 className="text-2xl font-bold text-gray-800">Confirm Delete</h2>
//               </div>
              
//               <div className="p-6">
//                 <p className="text-gray-700">Are you sure you want to delete this record? This action cannot be undone.</p>
//               </div>
              
//               <div className="p-6 border-t border-gray-200 flex justify-end space-x-3">
//                 <button
//                   onClick={() => setConfirmDeleteId(null)}
//                   className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors duration-200"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   onClick={handleDelete}
//                   className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200"
//                 >
//                   Delete
//                 </button>
//               </div>
//             </motion.div>
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </div>
//   );
// };

// export default ModelHistoryPage;



// ****************
import { useContext } from "react";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { ThemeContext } from "../context/ThemeContext";
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