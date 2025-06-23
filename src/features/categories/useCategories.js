
import { useState, useEffect } from "react";
import {
  getAllCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../../services/apiCategories";

export const useCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchCategories = async () => {
    setLoading(true);
    setError(null);
    try {
      console.log("Fetching categories...");
      const data = await getAllCategories();
      console.log("Categories data received:", data);
      setCategories(data);
    } catch (err) {
      console.error("Failed to fetch categories:", err);
      setError("Failed to fetch categories");
    } finally {
      setLoading(false);
    }
  };


  const addCategory = async (name) => {
    setLoading(true);
    setError(null);
    try {
      const data = {
        name: name
      };
      await createCategory(data);
      fetchCategories(); // Refresh the list after adding
      return true;
    } catch (err) {
      setError("Failed to add category");
      console.error(err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const editCategory = async (id, name) => {
    setLoading(true);
    setError(null);
    try {
      await updateCategory(id, name);
      fetchCategories(); // Refresh the list after editing
      return true;
    } catch (err) {
      setError(`Failed to edit category ID: ${id}`);
      console.error(err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const removeCategory = async (id) => {
    setLoading(true);
    setError(null);
    try {
      await deleteCategory(id);
      fetchCategories(); // Refresh the list after deletion
      return true;
    } catch (err) {
      setError(`Failed to delete category ID: ${id}`);
      console.error(err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Load categories when component mounts
  useEffect(() => {
    fetchCategories();
  }, []);

  return {
    categories,
    loading,
    error,
    fetchCategories,
    addCategory,
    editCategory,
    removeCategory
  };
};