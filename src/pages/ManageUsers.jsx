/* eslint-disable no-unused-vars */
import React, { useState, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import UserForm from '../features/users/UserForm';
import UserList from '../features/users/UserList';
import { useUsers } from '../features/users/useUsers';
import { ThemeContext } from '../context/ThemeContext';

const ManageUsers = () => {
  const { theme } = useContext(ThemeContext);
  const { users, isLoading, error, editUser, removeUser, fetchUsers, searchUsers } = useUsers();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [currentUser, setCurrentUser] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteUserId, setDeleteUserId] = useState(null);
  const [deleteUserName, setDeleteUserName] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  const handleFilterChange = (e) => {
    setStatusFilter(e.target.value);
  };

  const filteredUsers = searchUsers(search, statusFilter);

  const handleSaveEdit = async (formData) => {
    if (!currentUser?.id) {
      toast.error('No user selected for editing');
      return;
    }

    setIsUpdating(true);
    try {
      const result = await editUser(currentUser.id, formData);
      setIsEditModalOpen(false);
      setCurrentUser(null);
      toast.success(
        <div className="flex items-center space-x-2">
          <CheckCircle className="h-5 w-5 text-green-500" />
          <span>{result.message || 'User updated successfully!'}</span>
        </div>,
        {
          duration: 4000,
          style: {
            background: theme === "light" ? '#f0fdf4' : '#1a4731',
            border: theme === "light" ? '1px solid #bbf7d0' : '1px solid #4d7c0f',
            color: theme === "light" ? '#166534' : '#86efac'
          }
        }
      );
    } catch (error) {
      toast.error(
        <div className="flex items-center space-x-2">
          <XCircle className="h-5 w-5 text-red-500" />
          <span>{error.message || 'Failed to update user'}</span>
        </div>,
        {
          duration: 4000,
          style: {
            background: theme === "light" ? '#fef2f2' : '#450a0a',
            border: theme === "light" ? '1px solid #fecaca' : '1px solid #dc2626',
            color: theme === "light" ? '#dc2626' : '#f87171'
          }
        }
      );
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = (id) => {
    const user = users.find(u => u.id === id);
    setDeleteUserId(id);
    setDeleteUserName(user?.name || 'Unknown User');
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    try {
      setIsUpdating(true);
      const result = await removeUser(deleteUserId);
      setIsDeleteModalOpen(false);
      setDeleteUserId(null);
      setDeleteUserName('');
      toast.success(
        <div className="flex items-center space-x-2">
          <CheckCircle className="h-5 w-5 text-green-500" />
          <span>{result.message || 'User deleted successfully!'}</span>
        </div>,
        {
          duration: 4000,
          style: {
            background: theme === "light" ? '#f0fdf4' : '#1a4731',
            border: theme === "light" ? '1px solid #bbf7d0' : '1px solid #4d7c0f',
            color: theme === "light" ? '#166534' : '#86efac'
          }
        }
      );
    } catch (error) {
      toast.error(
        <div className="flex items-center space-x-2">
          <XCircle className="h-5 w-5 text-red-500" />
          <span>{error.message || 'Failed to delete user'}</span>
        </div>,
        {
          duration: 4000,
          style: {
            background: theme === "light" ? '#fef2f2' : '#450a0a',
            border: theme === "light" ? '1px solid #fecaca' : '1px solid #dc2626',
            color: theme === "light" ? '#dc2626' : '#f87171'
          }
        }
      );
    } finally {
      setIsUpdating(false);
    }
  };

  const cancelDelete = () => {
    setIsDeleteModalOpen(false);
    setDeleteUserId(null);
    setDeleteUserName('');
  };

  const handleRefresh = async () => {
    try {
      await fetchUsers();
      setSearch('');
      setStatusFilter('');
      toast.success('Users refreshed successfully!');
    } catch (error) {
      toast.error('Failed to refresh users');
    }
  };

  if (error) {
    return (
      <div className={`flex items-center justify-center min-h-screen ${
        theme === "light" ? "bg-gray-50" : "bg-gray-900"
      }`}>
        <motion.div 
          className={`text-center p-8 rounded-2xl shadow-lg max-w-md w-full mx-4 ${
            theme === "light" ? "bg-white" : "bg-gray-800"
          }`}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <XCircle className={`h-16 w-16 mx-auto mb-4 ${
            theme === "light" ? "text-red-500" : "text-red-400"
          }`} />
          <h2 className={`text-2xl font-bold mb-2 ${
            theme === "light" ? "text-gray-900" : "text-gray-200"
          }`}>Error</h2>
          <p className={`mb-6 ${
            theme === "light" ? "text-gray-600" : "text-gray-400"
          }`}>{error}</p>
          <button
            onClick={handleRefresh}
            className={`px-6 py-3 text-white rounded-lg font-medium ${
              theme === "light"
                ? "bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700"
                : "bg-gradient-to-r from-sky-700 to-blue-800 hover:from-sky-800 hover:to-blue-900"
            } transition-all duration-200`}
          >
            Try Again
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <motion.div 
      className={`min-h-screen p-4 ${
        theme === "light" ? "bg-gradient-to-br from-gray-50 to-gray-100" : "bg-gradient-to-br from-gray-900 to-gray-800"
      }`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className="w-full max-w-7xl mx-auto"
        initial={{ y: -20 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.4 }}
      >
        {isLoading ? (
          <div className="flex justify-center items-center min-h-[70vh]">
            <div
              className={`animate-spin rounded-full h-12 w-12 border-b-2 ${
                theme === "light" ? "border-sky-600" : "border-sky-300"
              }`}
            ></div>
          </div>
        ) : (
          <UserList
            filteredUsers={filteredUsers}
            onEdit={(user) => {
              setCurrentUser(user);
              setIsEditModalOpen(true);
            }}
            onDelete={handleDelete}
            onSearch={(value) => setSearch(value)}
            onFilter={handleFilterChange}
            onRefresh={handleRefresh}
            isLoading={isLoading}
          />
        )}
      </motion.div>

      {/* Edit User Modal */}
      <AnimatePresence>
        {isEditModalOpen && (
          <UserForm
            isOpen={isEditModalOpen}
            onClose={() => {
              setIsEditModalOpen(false);
              setCurrentUser(null);
            }}
            onSave={handleSaveEdit}
            title="Edit User"
            user={currentUser}
            isSubmitting={isUpdating}
          />
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {isDeleteModalOpen && (
          <motion.div 
            className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div 
              className={`rounded-2xl shadow-2xl w-full max-w-md overflow-hidden ${
                theme === "light" ? "bg-white" : "bg-gray-800"
              }`}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <div className={`p-6 text-white ${
                theme === "light" ? "bg-gradient-to-r from-red-500 to-red-600" : "bg-gradient-to-r from-red-600 to-red-700"
              }`}>
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg ${
                    theme === "light" ? "bg-white/20" : "bg-white/10"
                  }`}>
                    <AlertTriangle className="h-6 w-6" />
                  </div>
                  <h2 className="text-xl font-bold">Confirm Deletion</h2>
                </div>
              </div>
              <div className="p-6">
                <div className="text-center mb-6">
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${
                    theme === "light" ? "bg-red-100" : "bg-red-900"
                  }`}>
                    <AlertTriangle className={`h-8 w-8 ${
                      theme === "light" ? "text-red-500" : "text-red-300"
                    }`} />
                  </div>
                  <h3 className={`text-lg font-semibold mb-2 ${
                    theme === "light" ? "text-gray-900" : "text-gray-200"
                  }`}>
                    Delete User Account
                  </h3>
                  <p className={`${
                    theme === "light" ? "text-gray-600" : "text-gray-400"
                  }`}>
                    Are you sure you want to delete <span className={`font-semibold ${
                      theme === "light" ? "text-gray-900" : "text-gray-200"
                    }`}>"{deleteUserName}"</span>?
                  </p>
                  <p className={`text-sm mt-2 p-3 rounded-lg ${
                    theme === "light" ? "text-red-600 bg-red-50" : "text-red-300 bg-red-900"
                  }`}>
                    ⚠️ This action cannot be undone. All user data will be permanently removed.
                  </p>
                </div>
                <div className="flex space-x-3">
                  <button
                    onClick={cancelDelete}
                    disabled={isUpdating}
                    className={`flex-1 px-4 py-3 rounded-lg font-medium transition-colors ${
                      theme === "light"
                        ? "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        : "bg-gray-700 text-gray-200 hover:bg-gray-600"
                    } disabled:opacity-50`}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmDelete}
                    disabled={isUpdating}
                    className={`flex-1 px-4 py-3 text-white rounded-lg font-medium transition-all duration-200 ${
                      theme === "light"
                        ? "bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700"
                        : "bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800"
                    } disabled:opacity-50 disabled:cursor-not-allowed ${
                      isUpdating ? 'animate-pulse' : ''
                    }`}
                  >
                    {isUpdating ? (
                      <div className="flex items-center justify-center space-x-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                        <span>Deleting...</span>
                      </div>
                    ) : (
                      'Delete User'
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default ManageUsers;