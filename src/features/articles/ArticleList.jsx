import { useContext, useState } from "react";
import { Edit, Trash, PlusCircle, Eye, Search } from "lucide-react";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import AddArticleForm from "./AddArticleForm";
import toast from "react-hot-toast";
import { ThemeContext } from "../../context/ThemeContext";
export default function ArticleList({
  articles,
  onEdit,
  onDelete,
  onAdd,
  categoryName,
  categoryId,
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState("");
  const [currentArticle, setCurrentArticle] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentDeleteItem, setCurrentDeleteItem] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [currentViewItem, setCurrentViewItem] = useState(null);

  const [showAllArticles, setShowAllArticles] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const visibleCount = 5;
  const { theme } = useContext(ThemeContext);

  const filteredArticles = articles.filter(
    (article) =>
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const displayedArticles = showAllArticles
    ? filteredArticles
    : filteredArticles.slice(0, visibleCount);

  const handleOpenModal = (type, article = null) => {
    setModalType(type);
    setCurrentArticle(article);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentArticle(null);
  };

  const handleOpenDeleteModal = (article) => {
    setCurrentDeleteItem(article);
    setIsDeleteModalOpen(true);
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setCurrentDeleteItem(null);
  };

  const handleOpenViewModal = (article) => {
    setCurrentViewItem(article);
    setIsViewModalOpen(true);
  };

  const handleCloseViewModal = () => {
    setIsViewModalOpen(false);
    setCurrentViewItem(null);
  };

  const handleConfirmDelete = async () => {
    try {
      await onDelete(currentDeleteItem);
      toast.success("Article deleted successfully!", {
        style: {
          background: theme === "light" ? "#28a745" : "#34d399", // Green for success in both themes
          color: "#ffffff",
        },
      });
      handleCloseDeleteModal();
    } catch (error) {
      toast.error("Failed to delete article.", {
        style: {
          background: theme === "light" ? "#dc3545" : "#f87171", // Red for errors in both themes
          color: "#ffffff",
        },
      });
      console.error("Error deleting article:", error);
    }
  };

  const handleSubmit = async (formData, id) => {
    try {
      if (modalType === "addArticle") {
        await onAdd(formData, categoryId);
        toast.success("Article added successfully!", {
          style: {
            background: theme === "light" ? "#0284c7" : "#1d4ed8",
          },
        });
      } else if (modalType === "editArticle") {
        if (!id) {
          toast.error("المقال غير موجود للتعديل", {
            style: {
              background: theme === "light" ? "#f87171" : "#dc2626",
              color: "#ffffff",
            },
          });
          return;
        }
        await onEdit(id, formData);
        toast.success("Article updated successfully!", {
          style: {
            background: theme === "light" ? "#0284c7" : "#1d4ed8",
            color: "#ffffff",
          },
        });
      }
      handleCloseModal();
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("An error occurred. Please try again.", {
        style: {
          background: theme === "light" ? "#dc3545" : "#f87171",
          color: "#ffffff",
        },
      });
    }
  };

  return (
    <>
      <div className="flex flex-wrap gap-4 justify-between mb-4">
        <button
          onClick={() => handleOpenModal("addArticle")}
          className={`${
            theme === "light"
              ? "bg-sky-600 hover:bg-sky-700"
              : "bg-sky-800 hover:bg-sky-900"
          } text-white px-6 py-2 rounded-lg cursor-pointer flex items-center transition-colors duration-300`}
        >
          <PlusCircle size={20} className="mr-2" />
          Add Article
        </button>

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
            placeholder="Search articles..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`pl-10 pr-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-500 transition duration-200 w-full text-sm ${
              theme === "light"
                ? "border-sky-300 focus:border-sky-500"
                : "border-gray-600 focus:border-sky-500"
            }`}
          />
        </div>
      </div>

      <div
        className={`${
          theme === "light" ? "bg-white" : "bg-gray-800"
        } p-4 md:p-6 shadow-lg rounded-lg mb-8`}
      >
        <h3
          className={`${
            theme === "light" ? "text-gray-800" : "text-white"
          } text-xl font-semibold mb-4`}
        >
          Articles in "{categoryName}"
        </h3>

        <ul className="space-y-4">
          {filteredArticles.length === 0 ? (
            <p
              className={`text-center ${
                theme === "light" ? "text-gray-500" : "text-gray-300"
              }`}
            >
              No articles found
            </p>
          ) : (
            displayedArticles.map((article) => (
              <li
                key={article.id}
                className={`${
                  theme === "light" ? "bg-gray-100" : "bg-gray-700"
                } flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-4 border-b pb-4 mb-4 rounded-lg hover:${
                  theme === "light" ? "bg-gray-200" : "bg-gray-600"
                } transition px-3 py-3`}
              >
                {article.coverImage && (
                  <img
                    src={article.coverImage}
                    alt={article.title}
                    className="w-16 h-16 object-cover rounded-md"
                  />
                )}
                <div className="flex flex-col w-full">
                  <h4
                    className={`${
                      theme === "light" ? "text-gray-800" : "text-white"
                    } text-sm font-semibold`}
                  >
                    {article.title}
                  </h4>
                  <p
                    className={`${
                      theme === "light" ? "text-gray-600" : "text-gray-300"
                    } text-xs line-clamp-2`}
                  >
                    {article.description}
                  </p>

                  <div
                    className={`${
                      theme === "light" ? "text-gray-500" : "text-gray-400"
                    } text-xs mt-2`}
                  >
                    <p>Created By: {article.createdBy}</p>
                    <p>
                      Created At:{" "}
                      {new Date(article.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="flex space-x-2 items-center self-end sm:self-center mt-2 sm:mt-0">
                  <button
                    onClick={() => handleOpenModal("editArticle", article)}
                    className={`${
                      theme === "light" ? "text-sky-600" : "text-sky-400"
                    } hover:text-sky-800 transition-colors cursor-pointer duration-300`}
                  >
                    <Edit size={18} />
                  </button>
                  <button
                    onClick={() => handleOpenDeleteModal(article)}
                    className={`${
                      theme === "light" ? "text-red-600" : "text-red-400"
                    } hover:text-red-800 transition-colors cursor-pointer duration-300`}
                  >
                    <Trash size={18} />
                  </button>
                  <button
                    onClick={() => handleOpenViewModal(article)}
                    className={`${
                      theme === "light" ? "text-sky-600" : "text-sky-400"
                    } hover:text-sky-800 transition-colors cursor-pointer duration-300`}
                  >
                    <Eye size={18} /> {/* Icon for viewing the article */}
                  </button>
                </div>
              </li>
            ))
          )}
        </ul>

        {/* زر Show More */}
        {filteredArticles.length > visibleCount && (
          <div className="w-full text-center mt-4">
            <button
              onClick={() => setShowAllArticles(!showAllArticles)}
              className={`${
                theme === "light"
                  ? "text-sky-600 hover:underline"
                  : "text-sky-400 hover:underline"
              } text-sm transition duration-300`}
            >
              {showAllArticles ? "Show Less" : "Show All Articles"}
            </button>
          </div>
        )}
      </div>

      {/* ✅ Add / Edit Article Modal */}
     {isModalOpen && (
        <motion.div
          className="fixed inset-0 flex justify-center items-center z-50 bg-black/30"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <motion.div
            className={`${
              theme === "light" ? "bg-white" : "bg-gray-800"
            } p-4 rounded-lg shadow-lg w-full max-w-[320px] mx-4 max-h-[90vh] overflow-y-auto`}
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <h3
              className={`${
                theme === "light" ? "text-sky-700" : "text-sky-400"
              } text-sm font-semibold mb-2 capitalize border-b pb-1`}
            >
              {modalType === "addArticle" ? "Add Article" : "Edit Article"}
            </h3>
            <AddArticleForm
              initialData={currentArticle}
              onSubmit={handleSubmit}
              onClose={handleCloseModal}
              categoryId={categoryId}
            />
          </motion.div>
        </motion.div>
      )}

     {/* ✅ Confirm Delete Modal */}
      {isDeleteModalOpen && currentDeleteItem && (
        <motion.div
          className="fixed inset-0 flex justify-center items-center z-50 bg-black/30"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <motion.div
            className={`${
              theme === "light" ? "bg-white" : "bg-gray-800"
            } p-4 rounded-lg shadow-lg w-full max-w-[320px] mx-4 max-h-[90vh] overflow-y-auto`}
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <h3
              className={`${
                theme === "light" ? "text-gray-800" : "text-white"
              } text-lg font-semibold mb-2 capitalize border-b pb-1`}
            >
              Confirm Deletion
            </h3>
            <p
              className={`${
                theme === "light" ? "text-gray-600" : "text-gray-300"
              } text-sm mb-3`}
            >
              Are you sure you want to delete the Article "
              {currentDeleteItem?.title}"? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-2">
              <button
                onClick={handleCloseDeleteModal}
                className={`${
                  theme === "light"
                    ? "bg-gray-300 hover:bg-gray-400 text-gray-700"
                    : "bg-gray-700 hover:bg-gray-600 text-gray-300"
                } px-3 py-1 rounded-md transition-colors text-sm`}
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-md transition-colors text-sm"
              >
                Delete
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* View Article Modal */}
      {isViewModalOpen && currentViewItem && (
        <motion.div
          className="fixed inset-0 flex justify-center items-center z-50 bg-black/30"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <motion.div
            className={`${
              theme === "light" ? "bg-white" : "bg-gray-800"
            } p-4 rounded-lg shadow-lg w-full max-w-[320px] mx-4 max-h-[90vh] overflow-y-auto`}
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <h3
              className={`${
                theme === "light" ? "text-gray-800" : "text-white"
              } text-lg font-bold mb-2`}
            >
              {currentViewItem.title}
            </h3>
            <img
              src={
                currentViewItem.coverImage
                  ? currentViewItem.coverImage
                  : "/default-image.jpg"
              }
              alt={currentViewItem.title}
              className="w-full h-32 object-cover rounded-md mb-3"
            />
            <p
              className={`${
                theme === "light" ? "text-gray-800" : "text-white"
              } text-sm mb-3`}
            >
              {currentViewItem.description}
            </p>
            <div className="space-y-2">
              <p
                className={`${
                  theme === "light" ? "text-gray-800" : "text-white"
                } text-sm font-semibold`}
              >
                Content:
              </p>
              <p
                className={`${
                  theme === "light" ? "text-gray-700" : "text-gray-300"
                } text-sm`}
              >
                {currentViewItem.content}
              </p>
            </div>
            <div className="text-xs mt-2">
              <p
                className={`${
                  theme === "light" ? "text-gray-500" : "text-gray-400"
                }`}
              >
                Created By: {currentViewItem.createdBy}
              </p>
              <p
                className={`${
                  theme === "light" ? "text-gray-500" : "text-gray-400"
                }`}
              >
                Created At:{" "}
                {new Date(currentViewItem.createdAt).toLocaleDateString()}
              </p>
            </div>
            <div className="flex justify-end space-x-2 mt-3">
              <button
                onClick={handleCloseViewModal}
                className={`${
                  theme === "light"
                    ? "bg-gray-300 hover:bg-gray-400 text-gray-700"
                    : "bg-gray-700 hover:bg-gray-600 text-gray-300"
                } px-3 py-1 rounded-md transition-colors text-sm`}
              >
                Close
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </>
  );
}
