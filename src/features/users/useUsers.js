import { useState, useEffect } from 'react';
import {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
} from '../../services/apiUsers';

export function useUsers() {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const data = await getUsers();
      setUsers(data);
    } catch (err) {
      setError(err.message || 'Failed to fetch users');
    } finally {
      setIsLoading(false);
    }
  };

  const addUser = async (userData) => {
    const newUser = await createUser(userData);
    setUsers((prev) => [...prev, newUser]);
  };

  const editUser = async (id, updatedData) => {
    const updatedUser = await updateUser(id, updatedData);
    setUsers((prev) =>
      prev.map((user) => (user.id === id ? updatedUser : user))
    );
  };

  const removeUser = async (id) => {
    await deleteUser(id);
    setUsers((prev) => prev.filter((user) => user.id !== id));
  };

  return { users, isLoading, error, addUser, editUser, removeUser };
}
