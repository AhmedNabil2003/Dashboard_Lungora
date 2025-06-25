import axiosInstance from "./axiosInstance";

// ✅ Get all articles
export const getAllArticles = async () => {
  try {
    const res = await axiosInstance.get("/Article/GetAllArticles");
    if (res.data?.isSuccess && res.data.result && Array.isArray(res.data.result?.article)) {
      return res.data.result.article ;
    }
    return [];
  } catch (error) {
    console.error("Error fetching all articles:", error);
    throw new Error("Something went wrong while fetching articles. Please try again later.");
  }
};

// ✅ Get article by ID
export const getArticleById = async (id) => {
  try {
    const res = await axiosInstance.get(`/Article/GetArticleById/${id}`);
    if (res.data?.isSuccess && res.data.result) {
      return res.data.result.article;
      
    }
    console.error(`No article found with ID: ${id}`);
    return null;
  } catch (error) {
    console.error(`Error fetching article ${id}:`, error);
    throw new Error(`Something went wrong while fetching article with ID ${id}. Please try again later.`);
  }
};


//  Get articles by category ID (من Article Controller )
export const getArticlesByCategoryId = async (categoryId) => {
  try {
    const res = await axiosInstance.get(`/Article/GetArticlesByCategoryId/${categoryId}`);
    if (res.data?.isSuccess && res.data.result) {
      return {
        articles: res.data.result.articles || [],
        numberOfArticles: res.data.result.numerOfArticles || res.data.result.numberOfArticles || 0, // Handle typo
      };
    }
    console.error(`No articles found for category ID: ${categoryId}`);
    return { articles: [], numberOfArticles: 0 };
  } catch (error) {
    console.error(`Error fetching articles for category ${categoryId}:`, error);
    throw new Error(`Something went wrong while fetching articles for category ID ${categoryId}. Please try again later.`);
  }
};
// ✅ Create a new article
export const createArticle = async (data) => {
  try {
    const headers = {
      "Content-Type": data instanceof FormData ? "multipart/form-data" : "application/json",
    };

    const res = await axiosInstance.post("/Article/CreateArticle", data, { headers });
    if (res.data?.isSuccess) {
      return res.data;
    }
    else {
      throw new Error(res.data.message || "Failed to create article.");
    }
   } catch (error) {
    console.error("Error creating article:", error);
    throw new Error(error.message || "Something went wrong while creating the article. Please try again later.");
  }
};

// ✅ Update an article
export const updateArticle = async (id, data) => {
  try {
    let headers = {};
    let payload = data;

    if (data instanceof FormData) {
      if (!data.has("id")) data.append("id", id);
      headers["Content-Type"] = "multipart/form-data";
    } else {
      payload = { ...data, id };
      headers["Content-Type"] = "application/json";
    }

    const res = await axiosInstance.put(`/Article/EditArticle/${id}`, payload, { headers });
    if (res.data?.isSuccess) {
      return res.data;
    }
    else {
      throw new Error(res.data.message || "Failed to update article.");
    }
  } catch (error) {
    console.error(`Error updating article ${id}:`, error);
    throw new Error(error.message || `Something went wrong while updating article with ID ${id}. Please try again later.`);
  }
};

// ✅ Delete an article
export const deleteArticle = async (id) => {
  try {
    const res = await axiosInstance.delete(`/Article/RemoveArticle/${id}`);
    if (res.data?.isSuccess) {
      return res.data;
    }
    throw new Error(res.data.message || "Failed to delete article.");
  } catch (error) {
    console.error(`Error deleting article ${id}:`, error);
    throw new Error(error.message || `Something went wrong while deleting article with ID ${id}. Please try again later.`);
  }
};
