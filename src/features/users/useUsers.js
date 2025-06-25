import { useState, useEffect } from "react";
import { getUsers, updateUser, deleteUser } from "../../services/apiUsers";

export function useUsers() {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getUsers();
      setUsers(data);
    } catch (err) {
      setError(err.message || "Failed to fetch users");
      console.error("Error in fetchUsers:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const editUser = async (id, updatedData) => {
    try {
      setIsLoading(true);
      setError(null);
      const result = await updateUser(id, updatedData);

      // ✅ تحديث القائمة المحلية بشكل صحيح
      setUsers((prevUsers) =>
        prevUsers.map((user) => {
          if (user.id === id) {
            // دمج البيانات الجديدة مع البيانات الموجودة (الاحتفاظ بالتاريخ الأصلي)
            return {
              ...user,
              ...result,
              date: user.date, // الاحتفاظ بالتاريخ الأصلي
              id: user.id, // التأكد من عدم تغيير الـ ID
            };
          }
          return user;
        })
      );
      return result;
    } catch (err) {
      setError(err.message || "Failed to update user");
      console.error("Error in editUser:", err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const removeUser = async (id) => {
    try {
      setIsLoading(true);
      setError(null);
      const result = await deleteUser(id);

      // إزالة المستخدم من القائمة المحلية
      setUsers((prev) => prev.filter((user) => user.id !== id));
      return result;
    } catch (err) {
      setError(err.message || "Failed to delete user");
      console.error("Error in removeUser:", err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const refreshUsers = async () => {
    await fetchUsers();
  };

  // ✅ تحسين دالة البحث
  const searchUsers = (searchTerm, statusFilter = "", customUsers = null) => {
    const usersToSearch = customUsers || users;

    if (!searchTerm && !statusFilter) return usersToSearch;

    return usersToSearch.filter((user) => {
      const searchMatch =
        !searchTerm ||
        user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.id?.toString().includes(searchTerm);

      const statusMatch = !statusFilter || user.status === statusFilter;

      return searchMatch && statusMatch;
    });
  };

  return {
    users,
    isLoading,
    error,
    editUser,
    removeUser,
    fetchUsers,
    refreshUsers,
    searchUsers,
  };
}
