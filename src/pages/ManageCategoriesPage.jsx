import { useContext, useState } from "react";
import { useCategories } from "../features/categories/useCategories";
import { useArticles } from "../features/articles/useArticles";
import CategoryList from "../features/categories/categoryList";
import ArticleList from "../features/articles/articleList";
import { ThemeContext } from "../context/ThemeProviderContext";
import toast from "react-hot-toast";

export default function ManageCategories() {
  const {
    categories,
    loading: categoriesLoading,
    error: categoriesError,
    addCategory,
    editCategory,
    removeCategory
  } = useCategories();

  const {
    articles,
    loading: articlesLoading,
    error: articlesError,
    loadArticlesByCategory,
    addArticle,
    editArticle,
    removeArticle
  } = useArticles();

  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [selectedCategoryName, setSelectedCategoryName] = useState("");
  const { theme } = useContext(ThemeContext);

  const handleViewArticles = (categoryId) => {
    const category = categories.find(c => c.id === categoryId);
    if (category) {
      setSelectedCategoryName(category.categoryName);
    }
    
    if (selectedCategoryId === categoryId) {
      setSelectedCategoryId(null);
      setSelectedCategoryName("");
    } else {
      setSelectedCategoryId(categoryId);
      if (categoryId) {
        loadArticlesByCategory(categoryId);
      }
    }
  };

  const handleAddArticle = async (formData, categoryId) => {
    const targetCategoryId = categoryId || selectedCategoryId;
    try {
      await addArticle(formData, targetCategoryId);} 
      catch (error) {
      console.error("Error adding article:", error);
      toast.error("An error occurred. Please try again.", {
        style: {
          backgroundColor: theme === "light" ? "#fee2e2" : "#b91c1c",
          color: theme === "light" ? "#991b1b" : "#fee2e2",
        },
      });
    }
  };

  const handleEditArticle = async (id, formData) => {
    try {
      await editArticle(id, formData);} 
      catch (error) {
      console.error("Error updating article:", error);
      toast.error("Failed to update article.", {
        style: {
          backgroundColor: theme === "light" ? "#fee2e2" : "#b91c1c",
          color: theme === "light" ? "#991b1b" : "#fee2e2",
        },
      });
    }
  };

  const handleDeleteArticle = async (article) => {
    try {
      await removeArticle(article);
    } catch (error) {
      console.error("Error deleting article:", error);
      toast.error("Failed to delete article.", {
        style: {
          backgroundColor: theme === "light" ? "#fee2e2" : "#b91c1c",
          color: theme === "light" ? "#991b1b" : "#fee2e2",
        },
      });
    }
  };

  return (
    <div
      className={`min-h-screen p-4 sm:p-6 ${
        theme === "light" 
          ? "bg-gradient-to-br from-gray-50 to-gray-100" 
          : "bg-gradient-to-br from-gray-900 to-gray-800"
      }`}
    >
      <div
        className={`w-full max-w-7xl mx-auto p-6 rounded-2xl shadow-2xl ${
          theme === "light" ? "bg-white" : "bg-gray-800"
        }`}
      >
        <h2
          className={`text-3xl font-bold text-center mb-6 ${
            theme === "light" ? "text-sky-600" : "text-sky-300"
          }`}
        >
          Manage Categories and Articles
        </h2>

        {categoriesError && (
          <div
            className={`p-4 rounded-lg mb-6 ${
              theme === "light" 
                ? "bg-red-50 text-red-600 border border-red-200" 
                : "bg-red-900 text-red-200 border border-red-700"
            }`}
          >
            Error loading categories: {categoriesError}
          </div>
        )}

        {categoriesLoading ? (
          <div className="flex justify-center items-center min-h-[200px]">
            <div
              className={`animate-spin rounded-full h-12 w-12 border-b-2 ${
                theme === "light" ? "border-sky-600" : "border-sky-300"
              }`}
            ></div>
          </div>
        ) : (
          <div className="space-y-8">
            <div className="w-full">
              <CategoryList
                categories={categories}
                onView={handleViewArticles}
                onAdd={addCategory}
                onEdit={editCategory}
                onDelete={removeCategory}
              />
            </div>

            {selectedCategoryId && (
              <div className="w-full">
                {articlesError && (
                  <div
                    className={`p-4 rounded-lg mb-6 ${
                      theme === "light" 
                        ? "bg-red-50 text-red-600 border border-red-200" 
                        : "bg-red-900 text-red-200 border border-red-700"
                    }`}
                  >
                    Error loading articles: {articlesError}
                  </div>
                )}

                {articlesLoading ? (
                  <div className="flex justify-center items-center min-h-[200px]">
                    <div
                      className={`animate-spin rounded-full h-12 w-12 border-b-2 ${
                        theme === "light" ? "border-sky-600" : "border-sky-300"
                      }`}
                    ></div>
                  </div>
                ) : (
                  <ArticleList
                    articles={articles}
                    categoryId={selectedCategoryId}
                    categoryName={selectedCategoryName}
                    onEdit={handleEditArticle}
                    onDelete={handleDeleteArticle}
                    onAdd={handleAddArticle}
                  />
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}