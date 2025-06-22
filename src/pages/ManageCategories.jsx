import { useContext, useState } from "react";
import { useCategories } from "../features/categories/useCategories";
import { useArticles } from "../features/articles/useArticles";
import CategoryList from "../features/categories/CategoryList";
import ArticleList from "../features/articles/ArticleList";
import AddArticleForm from "../features/articles/AddArticleForm";
import { ThemeContext } from "../context/ThemeContext";
import { PlusCircle } from "lucide-react";
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
  const [isArticleModalOpen, setIsArticleModalOpen] = useState(false);
  const { theme } = useContext(ThemeContext);

  const handleViewArticles = (categoryId) => {
    console.log("ManageCategories: handleViewArticles called with categoryId:", categoryId);
    const category = categories.find(c => c.id === categoryId);
    if (category) {
      setSelectedCategoryName(category.categoryName);
      console.log("Selected category name:", category.categoryName);
    }
    
    if (selectedCategoryId === categoryId) {
      setSelectedCategoryId(null);
      setSelectedCategoryName("");
      console.log("Cleared selected category and articles");
    } else {
      setSelectedCategoryId(categoryId);
      if (categoryId) {
        loadArticlesByCategory(categoryId);
        console.log("Loading articles for category:", categoryId);
      }
    }
  };

  const handleAddArticle = async (formData, categoryId) => {
    const targetCategoryId = categoryId || selectedCategoryId;
    console.log("Adding article to category:", targetCategoryId);
    try {
      await addArticle(formData, targetCategoryId);
      toast.success("Article added successfully!", {
        style: {
          backgroundColor: theme === "light" ? "#d1fae5" : "#16a34a",
          color: theme === "light" ? "#15803d" : "#d1fae5",
        },
      });
      setIsArticleModalOpen(false);
    } catch (error) {
      console.error("Error adding article:", error);
      toast.error("An error occurred. Please try again.", {
        style: {
          backgroundColor: theme === "light" ? "#fee2e2" : "#b91c1c",
          color: theme === "light" ? "#991b1b" : "#fee2e2",
        },
      });
    }
  };

  const handleOpenArticleModal = () => {
    setIsArticleModalOpen(true);
  };

  const handleCloseArticleModal = () => {
    setIsArticleModalOpen(false);
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

        {/* Categories Error */}
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

        {/* Categories Loading */}
        {categoriesLoading ? (
          <div className="flex justify-center items-center min-h-[200px]">
            <div
              className={`animate-spin rounded-full h-12 w-12 border-b-2 ${
                theme === "light" ? "border-sky-600" : "border-sky-300"
              }`}
            ></div>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row lg:space-x-6">
            {/* Categories Section */}
            <div className="w-full lg:w-1/2">
              <CategoryList
                categories={categories}
                onView={handleViewArticles}
                onAdd={addCategory}
                onEdit={editCategory}
                onDelete={removeCategory}
              />
            </div>

            {/* Articles Section */}
            {selectedCategoryId && (
              <div className="w-full lg:w-1/2 mt-6 lg:mt-0">
                <div className="flex items-center justify-between mb-4">
                  <h3
                    className={`text-xl font-semibold ${
                      theme === "light" ? "text-gray-900" : "text-gray-200"
                    }`}
                  >
                    Articles in {selectedCategoryName}
                  </h3>
                  <button
                    onClick={handleOpenArticleModal}
                    className={`px-4 py-2 rounded-md text-sm font-medium flex items-center space-x-2 ${
                      theme === "light"
                        ? "bg-sky-600 text-white hover:bg-sky-700"
                        : "bg-sky-700 text-white hover:bg-sky-800"
                    }`}
                  >
                    <PlusCircle size={16} />
                    <span>Add Article</span>
                  </button>
                </div>
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
                    onEdit={editArticle}
                    onDelete={removeArticle}
                    onAdd={handleAddArticle}
                  />
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Add Article Modal */}
      {isArticleModalOpen && (
        <div
          className="fixed inset-0 flex justify-center items-center z-50 bg-black/30"
        >
          <div
            className={`${
              theme === "light" ? "bg-white" : "bg-gray-800"
            } p-6 rounded-lg shadow-lg w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto`}
          >
            <h3
              className={`${
                theme === "light" ? "text-sky-700" : "text-sky-400"
              } text-lg font-semibold mb-4 capitalize border-b pb-2`}
            >
              Add New Article
            </h3>
            <AddArticleForm
              defaultValue={{ title: "", content: "" }}
              onSubmit={handleAddArticle}
              onClose={handleCloseArticleModal}
              categoryId={selectedCategoryId}
            />
          </div>
        </div>
      )}
    </div>
  );
}