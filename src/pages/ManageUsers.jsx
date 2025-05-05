import React, { useState } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import UserForm from '../features/users/UserForm';
import UserList from '../features/users/UserList';

const ManageUsers = () => {
  const [users, setUsers] = useState([
    { id: 1, name: 'Ahmed Mostafa', email: 'Ahmed Mostafa@gmail.com', status: 'Active', date: '2023-08-01' },
    { id: 2, name: 'Ahmed_Nabil', email: 'a7med@gmail.com', status: 'Not Connected', date: '2023-07-15' },
    { id: 4, name: 'Ahmed_N', email: 'ahmedNn@gmail.com', status: 'Active', date: '2023-08-10' },
    { id: 5, name: 'Adel', email: 'adelmm@gmail.com', status: 'Not Connected', date: '2023-08-10' },
    { id: 6, name: 'Ahmed hamdy', email: 'ahmedhamdy@gmail.com', status: 'Not Active', date: '2023-08-10' },
    { id: 7, name: 'omar', email: 'omar7@gmail.com', status: 'Not Active', date: '2023-08-10' },
  ]);

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [editUser, setEditUser] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newUser, setNewUser] = useState({ name: '', email: '', status: 'Active' });
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteUserId, setDeleteUserId] = useState(null);

  // دالة تغيير الفلتر
  const handleFilterChange = (e) => {
    setStatusFilter(e.target.value);
  };

  // تطبيق الفلترة بشكل ديناميكي
  const filteredUsers = users.filter((user) => {
    const searchMatch =
      user.name.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase()) ||
      user.id.toString().includes(search);

    const statusMatch = statusFilter ? user.status === statusFilter : true;

    return searchMatch && statusMatch;
  });

  // إضافة مستخدم جديد
  const handleAddUser = (newUser) => {
    const newId = users.length + 1;
    setUsers([...users, { id: newId, ...newUser, date: new Date().toISOString().split('T')[0] }]);
    setIsAddModalOpen(false);
    setNewUser({ name: '', email: '', status: 'Active' });
    toast.success('User added successfully!');
  };

  // حفظ التعديلات
  const handleSaveEdit = () => {
    setUsers(users.map((user) => (user.id === editUser.id ? editUser : user)));
    setIsEditModalOpen(false);
    toast.success('User updated successfully!');
  };

  // بدء عملية الحذف
  const handleDelete = (id) => {
    setDeleteUserId(id);
    setIsDeleteModalOpen(true);
  };

  // تأكيد الحذف
  const confirmDelete = () => {
    setUsers(users.filter((user) => user.id !== deleteUserId));
    setIsDeleteModalOpen(false);
    setDeleteUserId(null);
    toast.success('User deleted successfully!');
  };

  // إلغاء الحذف
  const cancelDelete = () => {
    setIsDeleteModalOpen(false);
    setDeleteUserId(null);
  };

  return (
    <motion.div className="flex justify-center items-start min-h-screen bg-gradient-to-br from-white-300 to-white-200 p-4">
      <motion.div
        className="w-full max-w-7xl bg-white p-6 sm:p-4 rounded-2xl shadow-2xl flex flex-col space-y-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        {/* وضع الجدول في الأعلى */}
        <div className="overflow-x-auto">
          <UserList
            filteredUsers={filteredUsers}  // تم استخدام الفلترة هنا
            onEdit={(user) => {
              setEditUser(user);
              setIsEditModalOpen(true);
            }}
            onDelete={handleDelete}
            onSearch={(value) => setSearch(value)}  // تمرير قيمة البحث
            onFilter={handleFilterChange}  // تمرير فلتر الحالة
            onAddUser={() => setIsAddModalOpen(true)}
          />
        </div>
      </motion.div>

      {/* Add/Edit User Modal */}
      <UserForm
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={handleAddUser}
        title="Add User"
        user={newUser}
      />
      <UserForm
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSave={handleSaveEdit}
        title="Edit User"
        user={editUser}
      />

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white p-6 sm:p-4 rounded-lg shadow-lg w-full max-w-md sm:max-w-lg">
            <h2 className="text-xl sm:text-2xl mb-4 text-center">Are you sure you want to delete this user?</h2>
            <div className="flex justify-between">
              <button
                onClick={confirmDelete}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
              >
                Delete
              </button>
              <button
                onClick={cancelDelete}
                className="bg-gray-400 text-white px-4 py-2 rounded-lg hover:bg-gray-500 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default ManageUsers;
