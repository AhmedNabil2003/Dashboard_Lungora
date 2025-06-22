import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import {
  getAllHistory,
  getHistoryById,
  deleteHistory,
} from "../../services/apiHistory";

export const useModelHistory = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true); // تغيير القيمة الابتدائية لـ true
  const [error, setError] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [deleteRecordId, setDeleteRecordId] = useState(null);
  const [sortConfig, setSortConfig] = useState({
    key: "createdAt",
    direction: "desc",
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("");
  const [menuOpen, setMenuOpen] = useState(null);

  const itemsPerPage = 8;

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const response = await getAllHistory();
      if (response.isSuccess && response.result?.history) {
        setHistory(response.result.history);
      } else {
        setError("Failed to fetch history data");
        toast.error("Failed to load history data");
      }
    } catch (err) {
      setError(err.message);
      toast.error("Error loading history data");
      console.error("Error fetching history:", err);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchHistory();
  }, []);
  const fetchRecordDetails = async (id) => {
    try {
      const response = await getHistoryById(id);
      if (response.isSuccess) {
        setSelectedRecord(response.result);
        setIsDetailModalOpen(true);
      }
    } catch (err) {
      toast.error("Failed to fetch record details");
      console.error(err);
    }
  };

  const removeHistory = async (id) => {
    try {
      await deleteHistory(id);
      toast.success("Record deleted successfully");
      fetchHistory();
    } catch (err) {
      toast.error("Failed to delete record");
      console.error(err);
    }
  };

  const handleSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

 const filteredData = history.filter(item => {
    const matchesSearch = searchQuery ? 
      Object.values(item).some(
        val => val?.toString().toLowerCase().includes(searchQuery.toLowerCase())
      ) : true;
    
    const matchesStatus = statusFilter ? 
      item.status?.toLowerCase() === statusFilter.toLowerCase() : true;
    
    return matchesSearch && matchesStatus;
  });

  const sortedData = [...filteredData].sort((a, b) => {
    if (sortConfig.key === "createdAt") {
      return sortConfig.direction === "asc"
        ? new Date(a.createdAt) - new Date(b.createdAt)
        : new Date(b.createdAt) - new Date(a.createdAt);
    }
    return sortConfig.direction === "asc"
      ? (a[sortConfig.key] || "").localeCompare(b[sortConfig.key] || "")
      : (b[sortConfig.key] || "").localeCompare(a[sortConfig.key] || "");
  });

  const paginatedData = sortedData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(sortedData.length / itemsPerPage);

  return {
    history,
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
    itemsPerPage,
    isDetailModalOpen,
    isDeleteModalOpen,
    setSearchQuery,
    setCurrentPage,
    setStatusFilter,
    setMenuOpen,
    setIsDetailModalOpen,
    setIsDeleteModalOpen,
    fetchHistory,
    fetchRecordDetails,
    removeHistory,
    handleSort,
    setDeleteRecordId,
    setSelectedRecord,
  };
};
