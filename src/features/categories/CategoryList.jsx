import { useState, useEffect } from "react";
import { Edit, Trash, Eye, PlusCircle, Search } from "lucide-react";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import AddCategoryForm from "./AddCategoryForm";
import { getArticlesByCategoryId } from "../../services/apiArticles";
import toast from "react-hot-toast";

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
        toast.success("Category deleted successfully!");
      // eslint-disable-next-line no-unused-vars
      } catch (err) {
        toast.error("Failed to delete category.");
      } finally {
        handleCloseDeleteModal();
      }
    }
  };

  const handleSubmit = async (name) => {
    try {
    if (modalType === "add") {
      await onAdd(name);
      toast.success("Category added successfully!");
    } else if (modalType === "edit" && currentCategory) {
      await onEdit(currentCategory.id, name);
      toast.success("Category updated successfully!");
    }
    handleCloseModal();
    } catch (error) {
          console.error("Error submitting form:", error);
          toast.error("An error occurred. Please try again."); 
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
        <button
          onClick={() => handleOpenModal("add")}
          className="bg-sky-600 text-white px-6 py-2 rounded-lg hover:bg-sky-700 flex items-center"
        >
          <PlusCircle size={20} className="mr-2" />
          Add Category
        </button>

        <div className="relative w-full max-w-sm">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="text-sky-600" size={18} />
          </span>
          <input
            type="text"
            placeholder="Search categories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 border border-sky-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-500 transition duration-200 w-full text-sm"
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-6 mb-8 justify-center">
        {filteredCategories.length > 0 ? (
          displayedCategories.map((category) => (
            <div
              key={category.id}
              className="bg-white p-4 shadow-lg rounded-lg hover:shadow-xl transition duration-300 ease-in-out w-32 text-center"
            >
              <h3 className="text-lg font-semibold text-sky-600">
                {category.categoryName}
              </h3>
              <p className="text-gray-500">
                Articles: {articlesCount[category.id] || 0}
              </p>

              <div className="mt-4 space-x-4 flex justify-center">
                <button
                  onClick={() => onView(category.id)}
                  className="text-sky-600 hover:text-sky-800"
                >
                  <Eye size={20} />
                </button>
                <button
                  onClick={() => handleOpenModal("edit", category)}
                  className="text-sky-600 hover:text-sky-800"
                >
                  <Edit size={20} />
                </button>
                <button
                  onClick={() => handleOpenDeleteModal(category)}
                  className="text-red-600 hover:text-red-800"
                >
                  <Trash size={20} />
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500">No categories found</p>
        )}
      </div>

      {filteredCategories.length > visibleCount && (
        <div className="w-full text-center my-4">
          <button
            onClick={() => setShowAllCategories(!showAllCategories)}
            className="text-sky-600 hover:underline text-sm"
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
            className="bg-white p-6 rounded-lg shadow-lg w-96"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <h3 className="text-xl font-semibold mb-4 text-sky-700 border-b pb-2">
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
            className="bg-white p-6 rounded-lg shadow-lg w-96"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <h3 className="text-xl font-semibold mb-2 text-gray-800">
              Confirm Deletion
            </h3>
            <p className="text-gray-600 mb-4">
              Are you sure you want to delete the category "{currentDeleteCategory?.categoryName}"? 
              This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-2">
              <button
                onClick={handleCloseDeleteModal}
                className="bg-gray-300 px-4 py-2 rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="bg-red-600 text-white px-4 py-2 rounded-md"
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
