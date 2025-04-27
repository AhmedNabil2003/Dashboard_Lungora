
// import { useState } from "react";

// export const useCategories = (initialCategories = []) => {
//   const [categories, setCategories] = useState(initialCategories);
//   const [loading, setLoading] = useState(false);

//   const fetchCategories = () => {
//     setLoading(true);
//     // Local data handling - no actual API call
//     setLoading(false);
//   };

//   const addCategory = (name) => {
//     const newCategory = {
//       id: categories.length > 0 ? Math.max(...categories.map(c => c.id)) + 1 : 1,
//       name: name,
//       articlesCount: 0
//     };
//     setCategories([...categories, newCategory]);
//     return newCategory;
//   };

//   const editCategory = (id, name) => {
//     setCategories(
//       categories.map(category => 
//         category.id === id ? { ...category, name } : category
//       )
//     );
//   };

//   const removeCategory = (id) => {
//     setCategories(categories.filter(category => category.id !== id));
//   };

//   const incrementArticleCount = (categoryId) => {
//     setCategories(
//       categories.map(category => 
//         category.id === categoryId 
//           ? { ...category, articlesCount: category.articlesCount + 1 } 
//           : category
//       )
//     );
//   };

//   const decrementArticleCount = (categoryId) => {
//     setCategories(
//       categories.map(category => 
//         category.id === categoryId && category.articlesCount > 0
//           ? { ...category, articlesCount: category.articlesCount - 1 } 
//           : category
//       )
//     );
//   };

//   return { 
//     categories, 
//     loading, 
//     fetchCategories, 
//     addCategory, 
//     editCategory, 
//     removeCategory,
//     incrementArticleCount,
//     decrementArticleCount
//   };
// };

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