import { useState, useEffect } from "react";
import {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../../services/apiCategories";

export const useCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchCategories = async () => {
    setLoading(true);
    const data = await getAllCategories();
    setCategories(data);
    setLoading(false);
  };

  const addCategory = async (category) => {
    await createCategory(category);
    fetchCategories();
  };

  const editCategory = async (id, category) => {
    await updateCategory(id, category);
    fetchCategories();
  };

  const removeCategory = async (id) => {
    await deleteCategory(id);
    fetchCategories();
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return { categories, loading, fetchCategories, addCategory, editCategory, removeCategory };
};
