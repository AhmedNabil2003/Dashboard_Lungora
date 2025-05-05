import { useState, useEffect, useContext } from "react";
import { Edit, Trash, Eye, PlusCircle, Search } from "lucide-react";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import AddCategoryForm from "./AddCategoryForm";
import { getArticlesByCategoryId } from "../../services/apiArticles";
import toast from "react-hot-toast";
import { ThemeContext } from "../../context/ThemeContext";

export default function CategoryList({
  categories,
  onEdit,
  onDelete,
  onView,
  onAdd,
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState(""); // "add" | "edit"
  const [currentCategory, setCurrentCategory] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentDeleteCategory, setCurrentDeleteCategory] = useState(null);

  const [articlesCount, setArticlesCount] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [showAllCategories, setShowAllCategories] = useState(false);
  const { theme } = useContext(ThemeContext);

  const visibleCount = 6;

  const filteredCategories = categories.filter((category) =>
    category.categoryName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const displayedCategories = showAllCategories
    ? filteredCategories
    : filteredCategories.slice(0, visibleCount);

  const handleOpenModal = (type, category = null) => {
    setModalType(type);
    setCurrentCategory(category);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentCategory(null);
  };

  const handleOpenDeleteModal = (category) => {
    setCurrentDeleteCategory(category);
    setIsDeleteModalOpen(true);
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setCurrentDeleteCategory(null);
  };

  const handleConfirmDelete = async () => {
    if (currentDeleteCategory) {
      try {
        await onDelete(currentDeleteCategory.id);
        toast.success("Category deleted successfully!", {
          style: {
            backgroundColor: theme === "light" ? "#d1fae5" : "#16a34a",
            color: theme === "light" ? "#15803d" : "#d1fae5",
          },
        });
        // eslint-disable-next-line no-unused-vars
      } catch (err) {
        toast.error("Failed to delete category.", {
          style: {
            backgroundColor: theme === "light" ? "#fee2e2" : "#b91c1c",
            color: theme === "light" ? "#991b1b" : "#fee2e2",
          },
        });
      } finally {
        handleCloseDeleteModal();
      }
    }
  };

  const handleSubmit = async (name) => {
    try {
      if (modalType === "add") {
        await onAdd(name);
        toast.success("Category added successfully!", {
          style: {
            backgroundColor: theme === "light" ? "#d1fae5" : "#16a34a",
            color: theme === "light" ? "#15803d" : "#d1fae5",
          },
        });
      } else if (modalType === "edit" && currentCategory) {
        await onEdit(currentCategory.id, name);
        toast.success("Category updated successfully!", {
          style: {
            backgroundColor: theme === "light" ? "#d1fae5" : "#16a34a",
            color: theme === "light" ? "#15803d" : "#d1fae5",
          },
        });
      }
      handleCloseModal();
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("An error occurred. Please try again.", {
        style: {
          backgroundColor: theme === "light" ? "#fee2e2" : "#b91c1c",
          color: theme === "light" ? "#991b1b" : "#fee2e2",
        },
      });
    }
  };

  const loadArticlesCount = async (categoryId) => {
    try {
      const articles = await getArticlesByCategoryId(categoryId);
      setArticlesCount((prevState) => ({
        ...prevState,
        [categoryId]: articles.length,
      }));
    } catch (error) {
      console.error("Failed to load articles:", error);
    }
  };

  useEffect(() => {
    categories.forEach((category) => {
      loadArticlesCount(category.id);
    });
  }, [categories]);

  return (
    <>
      <div className="flex flex-wrap gap-4 justify-between mb-4">
        {/* Add Category Button */}
        <button
          onClick={() => handleOpenModal("add")}
          className={`${
            theme === "light"
              ? "bg-sky-600 hover:bg-sky-700"
              : "bg-sky-800 hover:bg-sky-900"
          } text-white px-6 py-2 cursor-pointer rounded-lg flex items-center transition duration-200`}
        >
          <PlusCircle size={20} className="mr-2" />
          Add Category
        </button>

        {/* Search Input */}
        <div className="relative w-full max-w-sm">
          <span
            className={`absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none ${
              theme === "light" ? "text-sky-600" : "text-sky-300"
            }`}
          >
            <Search size={18} />
          </span>
          <input
            type="text"
            placeholder="Search categories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`pl-10 pr-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 transition duration-200 w-full text-sm ${
              theme === "light"
                ? "border-sky-300 focus:ring-sky-500 text-gray-800"
                : "border-gray-600 focus:ring-gray-500 bg-gray-800 text-white"
            }`}
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-6 mb-8 justify-center">
        {filteredCategories.length > 0 ? (
          displayedCategories.map((category) => (
            <div
              key={category.id}
              className={`${
                theme === "light" ? "bg-white" : "bg-gray-800"
              } p-4 shadow-lg rounded-lg hover:shadow-xl transition duration-300 ease-in-out w-32 text-center`}
            >
              <h3
                className={`text-lg font-semibold ${
                  theme === "light" ? "text-sky-600" : "text-white"
                }`}
              >
                {category.categoryName}
              </h3>
              <p
                className={`text-sm ${
                  theme === "light" ? "text-gray-500" : "text-gray-400"
                }`}
              >
                Articles: {articlesCount[category.id] || 0}
              </p>

              <div className="mt-4 space-x-4 flex justify-center">
                <button
                  onClick={() => onView(category.id)}
                  className={`${
                    theme === "light"
                      ? "text-sky-600 hover:text-sky-800"
                      : "text-sky-400 hover:text-sky-200"
                  } cursor-pointer`}
                >
                  <Eye size={20} />
                </button>
                <button
                  onClick={() => handleOpenModal("edit", category)}
                  className={`${
                    theme === "light"
                      ? "text-sky-600 hover:text-sky-800"
                      : "text-sky-400 hover:text-sky-200"
                  } cursor-pointer`}
                >
                  <Edit size={20} />
                </button>
                <button
                  onClick={() => handleOpenDeleteModal(category)}
                  className={`${
                    theme === "light"
                      ? "text-red-600 hover:text-red-800"
                      : "text-red-400 hover:text-red-300"
                  } cursor-pointer`}
                >
                  <Trash size={20} />
                </button>
              </div>
            </div>
          ))
        ) : (
          <p
            className={`text-center ${
              theme === "light" ? "text-gray-500" : "text-gray-400"
            }`}
          >
            No categories found
          </p>
        )}
      </div>

      {filteredCategories.length > visibleCount && (
        <div className="w-full text-center my-4">
          <button
            onClick={() => setShowAllCategories(!showAllCategories)}
            className={`${
              theme === "light"
                ? "text-sky-600 hover:underline"
                : "text-sky-400 hover:underline"
            } text-sm cursor-pointer`}
          >
            {showAllCategories ? "Show Less" : "Show All Categories"}
          </button>
        </div>
      )}

      {isModalOpen && (
        <motion.div
          className="fixed inset-0 flex justify-center items-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <motion.div
            className={`${
              theme === "light" ? "bg-white" : "bg-gray-800"
            } p-6 rounded-lg shadow-lg w-96`}
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <h3
              className={`${
                theme === "light" ? "text-sky-700" : "text-sky-400"
              } text-xl font-semibold mb-4 border-b pb-2`}
            >
              {modalType === "add" ? "Add Category" : "Edit Category"}
            </h3>
            <AddCategoryForm
              defaultValue={currentCategory?.categoryName || ""}
              onSubmit={handleSubmit}
              onCancel={handleCloseModal}
            />
          </motion.div>
        </motion.div>
      )}

      {/* نافذة تأكيد الحذف */}
      {isDeleteModalOpen && (
        <motion.div
          className="fixed inset-0 flex justify-center items-center z-50 bg-black/30"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <motion.div
            className={`${
              theme === "light" ? "bg-white" : "bg-gray-800"
            } p-6 rounded-lg shadow-lg w-96`}
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <h3
              className={`${
                theme === "light" ? "text-gray-800" : "text-white"
              } text-xl font-semibold mb-2`}
            >
              Confirm Deletion
            </h3>
            <p
              className={`${
                theme === "light" ? "text-gray-600" : "text-gray-400"
              } mb-4`}
            >
              Are you sure you want to delete the category "
              {currentDeleteCategory?.categoryName}"? This action cannot be
              undone.
            </p>
            <div className="flex justify-end space-x-2">
              <button
                onClick={handleCloseDeleteModal}
                className={`${
                  theme === "light"
                    ? "bg-gray-300 text-gray-800"
                    : "bg-gray-700 text-gray-200"
                } px-4 py-2 cursor-pointer rounded-md`}
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className={`${
                  theme === "light"
                    ? "bg-red-600 text-white"
                    : "bg-red-600 text-white"
                } px-4 py-2 cursor-pointer rounded-md`}
              >
                Delete
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </>
  );
}
