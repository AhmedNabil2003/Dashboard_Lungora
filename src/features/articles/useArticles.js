// import { useState } from "react";

// export const useArticles = (initialArticlesData = {}) => {
//   // State to store all articles by category
//   const [articlesData, setArticlesData] = useState(initialArticlesData);
//   // State for currently displayed articles
//   const [articles, setArticles] = useState([]);
//   const [loading, setLoading] = useState(false);

//   const loadArticlesByCategory = (categoryId) => {
//     setLoading(true);
//     // Get articles for the selected category from local data
//     const categoryArticles = articlesData[categoryId] || [];
//     setArticles(categoryArticles);
//     setLoading(false);
//   };

//   const addArticle = (title, categoryId) => {
//     // Generate a new ID based on all existing articles
//     let maxId = 0;
//     Object.values(articlesData).forEach(categoryArticles => {
//       categoryArticles.forEach(article => {
//         if (article.id > maxId) maxId = article.id;
//       });
//     });
    
//     const newArticle = {
//       id: maxId + 1,
//       title: title,
//       categoryId: categoryId
//     };
    
//     // Update the articlesData state
//     const updatedArticlesData = { ...articlesData };
//     if (!updatedArticlesData[categoryId]) {
//       updatedArticlesData[categoryId] = [];
//     }
//     updatedArticlesData[categoryId] = [...updatedArticlesData[categoryId], newArticle];
//     setArticlesData(updatedArticlesData);
    
//     // Update current articles if we're viewing the same category
//     setArticles([...articles, newArticle]);
    
//     return newArticle;
//   };

//   const editArticle = (articleId, title) => {
//     // Create a deep copy of articlesData
//     const updatedArticlesData = { ...articlesData };
    
//     // Find and update the article
//     for (const categoryId in updatedArticlesData) {
//       updatedArticlesData[categoryId] = updatedArticlesData[categoryId].map(article => 
//         article.id === articleId ? { ...article, title } : article
//       );
//     }
    
//     setArticlesData(updatedArticlesData);
    
//     // Update current articles if needed
//     setArticles(articles.map(article => 
//       article.id === articleId ? { ...article, title } : article
//     ));
//   };

//   const deleteArticle = (articleId) => {
//     // Find which category the article belongs to
//     let categoryId = null;
//     for (const catId in articlesData) {
//       if (articlesData[catId].some(article => article.id === articleId)) {
//         categoryId = parseInt(catId);
//         break;
//       }
//     }
    
//     if (categoryId) {
//       // Create a deep copy of articlesData
//       const updatedArticlesData = { ...articlesData };
//       updatedArticlesData[categoryId] = updatedArticlesData[categoryId].filter(
//         article => article.id !== articleId
//       );
      
//       setArticlesData(updatedArticlesData);
      
//       // Update current articles if needed
//       setArticles(articles.filter(article => article.id !== articleId));
      
//       return categoryId; // Return categoryId for article count update
//     }
    
//     return null;
//   };

//   return {
//     articles,
//     loading,
//     loadArticlesByCategory,
//     addArticle,
//     editArticle,
//     deleteArticle
//   };
// };
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

  const fetchAllArticles = async () => {
    setLoading(true);
    setError(null);
    try {
      console.log("Fetching all articles...");
      const data = await getAllArticles();
      console.log("Articles data received:", data);
      setArticles(data);
      return data;
    } catch (err) {
      setError("Failed to fetch articles");
      console.error(err);
      return [];
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

  const loadArticlesByCategory = async (categoryId) => {
    setLoading(true);
    setError(null);
    try {
      const numericCategoryId = Number(categoryId);
      console.log(`Fetching articles for category ID: ${numericCategoryId}`);
      const data = await getArticlesByCategoryId(numericCategoryId);
      console.log("Category articles data received:", data);
      setArticles(data);
      return data;
    } catch (err) {
      setError(`Failed to fetch articles for category ID: ${categoryId}`);
      console.error(err);
      setArticles([]);
      return [];
    } finally {
      setLoading(false);
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
    fetchAllArticles,
    getArticleDetails,
    loadArticlesByCategory,
    addArticle,
    editArticle,
    removeArticle
  };
};