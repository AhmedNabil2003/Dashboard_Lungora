import { useContext, useState } from "react";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { useCategories } from "../features/categories/useCategories";
import { useArticles } from "../features/articles/useArticles";
import CategoryList from "../features/categories/CategoryList";
import ArticleList from "../features/articles/ArticleList";
import { Loader2 } from "lucide-react";
import{ThemeContext} from "../context/ThemeContext";
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
  const {theme} = useContext(ThemeContext);
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
      loadArticlesByCategory(categoryId);
    }
  };

  const handleAddArticle = async (formData, categoryId) => {
    // إذا تم تمرير categoryId، استخدمه، وإلا استخدم selectedCategoryId
    const targetCategoryId = categoryId || selectedCategoryId;
    await addArticle(formData, targetCategoryId);
  };

  return (
    <motion.div className={`flex justify-center items-start min-h-screen p-4 ${
      theme === "light" ? "bg-gradient-to-br from-white-300 to-white-200" : "bg-gradient-to-br from-gray-900 to-gray-800"
    }`}
  >
    <motion.div
      className={`w-full max-w-7xl p-6 sm:p-4 rounded-2xl shadow-2xl flex flex-col space-y-4 ${
        theme === "light" ? "bg-white" : "bg-gray-800"
      }`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <h2 className={`text-3xl font-bold text-center mb-6 ${
        theme === "light" ? "text-sky-600" : "text-white"
      }`}>
        Manage Categories and Articles
      </h2>

      {/* Categories Error */}
      {categoriesError && (
        <div className={`bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 ${
          theme === "dark" ? "bg-red-800 text-red-300 border-red-600" : ""
        }`}>
          {categoriesError}
        </div>
      )}

      {/* Categories Loading Spinner */}
      {categoriesLoading ? (
        <div className="flex justify-center items-center h-32">
          <Loader2 className="animate-spin w-8 h-8 text-sky-600" />
        </div>
      ) : (
        <CategoryList
          categories={categories}
          onView={handleViewArticles}
          onAdd={addCategory}
          onEdit={editCategory}
          onDelete={removeCategory}
        />
      )}

      {/* Articles Section */}
      {selectedCategoryId && (
        <>
          {/* Articles Error */}
          {articlesError && (
            <div className={`bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 ${
              theme === "dark" ? "bg-red-800 text-red-300 border-red-600" : ""
            }`}>
              {articlesError}
            </div>
          )}

          {/* Articles Loading Spinner */}
          {articlesLoading ? (
            <div className="flex justify-center items-center h-32">
              <Loader2 className="animate-spin w-8 h-8 text-sky-600" />
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
        </>
      )}
    </motion.div>
  </motion.div>
  );
}