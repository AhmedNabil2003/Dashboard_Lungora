import { useState } from "react";
import { Edit, Trash, PlusCircle, Eye } from "lucide-react";
import { motion } from "framer-motion";
import AddArticleForm from "./AddArticleForm";

export default function ArticleList({ articles, onEdit, onDelete, onAdd, categoryName, categoryId }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState(""); // "addArticle" | "editArticle"
  const [currentArticle, setCurrentArticle] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentDeleteItem, setCurrentDeleteItem] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false); // للعرض فقط
  const [currentViewItem, setCurrentViewItem] = useState(null);

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

  const handleConfirmDelete = () => {
    onDelete(currentDeleteItem);
    handleCloseDeleteModal();
  };

  const handleSubmit = (formData, id) => {
    if (modalType === "addArticle") {
      onAdd(formData, categoryId); // Pass formData and categoryId
    } else if (modalType === "editArticle") {
      onEdit(id, formData); // Pass ID and formData for editing
    }
    handleCloseModal();
  };

  return (
    <> 
      <div className="mt-4 text-center">
        <button
          onClick={() => handleOpenModal("addArticle")}
          className="bg-sky-600 text-white px-6 py-2 rounded-lg hover:bg-sky-700 flex items-center justify-center"
        >
          <PlusCircle size={20} className="mr-2" />
          Add Article
        </button>
      </div>
      <div className="bg-white p-6 shadow-lg rounded-lg mb-8">
        <h3 className="text-xl font-semibold mb-4">
          Articles in "{categoryName}"
        </h3>

        <ul className="space-y-4">
          {articles.length === 0 ? (
            <p className="text-center text-gray-500">No articles found</p>
          ) : (
            articles.map((article) => (
              <li
                key={article.id}
                className="flex justify-between items-center p-4 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
              >
                <span className="font-semibold">{article.title}</span>
                <div className="space-x-2">
                  <button
                    onClick={() => handleOpenModal("editArticle", article)}
                    className="text-sky-600 hover:text-sky-800 transition-colors duration-300"
                  >
                    <Edit size={20} />
                  </button>
                  <button
                    onClick={() => handleOpenDeleteModal(article)}
                    className="text-red-600 hover:text-red-800 transition-colors duration-300"
                  >
                    <Trash size={20} />
                  </button>
                  <button
                    onClick={() => handleOpenViewModal(article)}
                    className="text-sky-600 hover:text-sky-800 transition-colors duration-300"
                  >
                    <Eye size={20} /> {/* Icon for viewing the article */}
                  </button>
                </div>
              </li>
            ))
          )}
        </ul>
      </div>

      {/* Add / Edit Article Modal */}
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
            <h3 className="text-xl font-bold mb-4 capitalize">
              {modalType === "addArticle" ? "Add Article" : "Edit Article"}
            </h3>
            <AddArticleForm
              initialData={currentArticle}
              onSubmit={handleSubmit}
              onClose={handleCloseModal}
            />
          </motion.div>
        </motion.div>
      )}

      {/* Confirm Delete Modal */}
      {isDeleteModalOpen && currentDeleteItem && (
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
            <h3 className="text-xl font-semibold mb-4">
              Are you sure you want to delete this article?
            </h3>
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

      {/* View Article Modal */}
      {isViewModalOpen && currentViewItem && (
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
            <h3 className="text-xl font-bold mb-4">{currentViewItem.title}</h3>
            <img
              src={currentViewItem.coverImage ? currentViewItem.coverImage : '/default-image.jpg'}
              alt={currentViewItem.title}
              className="w-full h-48 object-cover rounded-md mb-4"
            />
            <p className="mb-4">{currentViewItem.description}</p>
            <div className="space-y-2">
              <p><strong>Content:</strong></p>
              <p>{currentViewItem.content}</p>
            </div>
            <div className="flex justify-end space-x-2 mt-4">
              <button
                onClick={handleCloseViewModal}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md"
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
