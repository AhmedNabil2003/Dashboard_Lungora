import { useState, useEffect } from "react";
import {
  getAllArticles,
  getArticleById,
  getArticlesByCategory,
  createArticle,
  updateArticle,
  deleteArticle,
} from "../../services/apiArticles";

export function useArticles() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchAllArticles = async () => {
    try {
      setLoading(true);
      const data = await getAllArticles();
      setArticles(data);
      setError(null);
      return data;
    } catch (err) {
      setError("فشل في تحميل المقالات");
      console.error(err);
      return [];
    } finally {
      setLoading(false);
    }
  };

  const fetchArticleById = async (id) => {
    try {
      setLoading(true);
      const data = await getArticleById(id);
      return data;
    } catch (err) {
      setError(`فشل في تحميل المقال رقم ${id}`);
      console.error(err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const loadArticlesByCategory = async (categoryId) => {
    try {
      setLoading(true);
      const data = await getArticlesByCategory(categoryId);
      setArticles(data);
      setError(null);
      return data;
    } catch (err) {
      setError(`فشل في تحميل مقالات الفئة رقم ${categoryId}`);
      console.error(err);
      return [];
    } finally {
      setLoading(false);
    }
  };

  const addArticle = async (formData, categoryId) => {
    try {
      setLoading(true);
      // تكييف البيانات حسب متطلبات API
      const articleData = {
        ...formData,
        categoryId,
      };
      await createArticle(articleData);
      if (categoryId) {
        await loadArticlesByCategory(categoryId); // إعادة تحميل المقالات لهذه الفئة
      }
      return true;
    } catch (err) {
      setError("فشل في إضافة المقال");
      console.error(err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const editArticle = async (id, formData) => {
    try {
      setLoading(true);
      await updateArticle(id, formData);
      // تحميل المقالات من نفس الفئة إذا كان categoryId متوفراً
      if (formData.categoryId) {
        await loadArticlesByCategory(formData.categoryId); 
      }
      return true;
    } catch (err) {
      setError(`فشل في تعديل المقال رقم ${id}`);
      console.error(err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const removeArticle = async (id, categoryId) => {
    try {
      setLoading(true);
      await deleteArticle(id);
      if (categoryId) {
        await loadArticlesByCategory(categoryId); // إعادة تحميل المقالات لهذه الفئة
      }
      return true;
    } catch (err) {
      setError(`فشل في حذف المقال رقم ${id}`);
      console.error(err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    articles,
    loading,
    error,
    fetchAllArticles,
    fetchArticleById,
    loadArticlesByCategory,
    addArticle,
    editArticle,
    removeArticle,
  };
}