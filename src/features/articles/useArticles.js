import { useState } from "react";
import {
  getAllArticles,
  getArticleById,
  getArticlesByCategoryId, 
  createArticle,
  updateArticle,
  deleteArticle,
} from "../../services/apiArticles";

export const useArticles = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [numberOfArticles, setNumberOfArticles] = useState(0);

  const fetchAllArticles = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAllArticles();
      if (Array.isArray(data)) {
        setArticles(data);
        setNumberOfArticles(data.length);
      } else {
        console.error("Expected array but got:", data);
        setArticles([]);
        setNumberOfArticles(0);
      }
      return data;
    } catch (err) {
      setError("Failed to fetch articles");
      console.error(err);
      return [];
    } finally {
      setLoading(false);
    }
  };

  const loadArticlesByCategory = async (categoryId) => {
  setLoading(true);
  setError(null);
  try {
    const numericCategoryId = Number(categoryId);
    const response = await getArticlesByCategoryId(numericCategoryId);
    
    // التحقق من هيكل البيانات المستلمة
    const receivedArticles = Array.isArray(response?.articles) 
      ? response.articles 
      : [];
    
    const receivedCount = typeof response?.numerOfArticles === 'number'
      ? response.numerOfArticles
      : typeof response?.numberOfArticles === 'number'
      ? response.numberOfArticles
      : receivedArticles.length;

    setArticles(receivedArticles);
    setNumberOfArticles(receivedCount);
    
    return {
      articles: receivedArticles,
      numberOfArticles: receivedCount
    };
  } catch (err) {
    setError(`Failed to fetch articles for category ID: ${categoryId}`);
    console.error(err);
    setArticles([]);
    setNumberOfArticles(0);
    return {
      articles: [],
      numberOfArticles: 0
    };
  } finally {
    setLoading(false);
  }
};

  const getArticleDetails = async (id) => {
    try {
      return await getArticleById(id);
    } catch (err) {
      setError(`Failed to get article details for ID: ${id}`);
      console.error(err);
      return null;
    }
  };

 

  const addArticle = async (formData, categoryId) => {
    setLoading(true);
    setError(null);
    try {
      let payload = formData;
      
      // If not FormData, convert to FormData
      if (!(formData instanceof FormData)) {
        payload = new FormData();
        for (const key in formData) {
          payload.append(key, formData[key]);
        }
      }
      
      // Ensure categoryId is included and is a number
      if (categoryId && !payload.has("categoryId")) {
        payload.append("categoryId", Number(categoryId));
      } else if (payload.has("categoryId")) {
        // If categoryId exists, make sure it's a number
        const existingCategoryId = payload.get("categoryId");
        payload.set("categoryId", Number(existingCategoryId));
      }
      
      // Log what we're sending
      console.log("Adding article with categoryId:", payload.get("categoryId"));
      
      // Create the article
      const result = await createArticle(payload);
      console.log("Article creation result:", result);

      // Refresh the articles list
      if (categoryId) {
        await loadArticlesByCategory(categoryId);
      } else {
        await fetchAllArticles();
      }

      return true;
    } catch (err) {
      setError("Failed to add article");
      console.error("Error in addArticle:", err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const editArticle = async (id, formData) => {
    setLoading(true);
    setError(null);
    try {
      let payload = formData;
      let categoryId = null;
      
      // If not FormData, convert to FormData
      if (!(formData instanceof FormData)) {
        payload = new FormData();
        for (const key in formData) {
          payload.append(key, formData[key]);
        }
        if (formData.categoryId) {
          categoryId = formData.categoryId;
        }
      } else {
        // If it's already FormData, get categoryId if present
        categoryId = payload.get("categoryId");
      }
      
      // Ensure ID is included and is a number
      payload.set("id", Number(id));
      
      // If categoryId exists, make sure it's a number
      if (categoryId) {
        payload.set("categoryId", Number(categoryId));
      }
      
      // Update the article
      const result = await updateArticle(id, payload);
      console.log("Article update result:", result);

      // Get the updated article details to get the categoryId
      const articleDetails = await getArticleById(id);
      console.log("Updated article details:", articleDetails);
      
      // Refresh the articles list
      if (articleDetails && articleDetails.categoryId) {
        await loadArticlesByCategory(articleDetails.categoryId);
      } else if (categoryId) {
        await loadArticlesByCategory(categoryId);
      } else {
        await fetchAllArticles();
      }

      return true;
    } catch (err) {
      setError(`Failed to edit article ID: ${id}`);
      console.error("Error in editArticle:", err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const removeArticle = async (article) => {
    const id = typeof article === 'object' ? article.id : article;
    const categoryId = typeof article === 'object' ? article.categoryId : null;
    
    setLoading(true);
    setError(null);
    try {
      // Make sure id is a number
      const numericId = Number(id);
      
      // Delete the article
      const result = await deleteArticle(numericId);
      console.log("Article deletion result:", result);

      // Refresh the articles list
      if (categoryId) {
        await loadArticlesByCategory(categoryId);
      } else {
        await fetchAllArticles();
      }

      return true;
    } catch (err) {
      setError(`Failed to delete article ID: ${id}`);
      console.error("Error in removeArticle:", err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    articles,
    loading,
    error,
    numberOfArticles,
    fetchAllArticles,
    getArticleDetails,
    loadArticlesByCategory,
    addArticle,
    editArticle,
    removeArticle
  };
};