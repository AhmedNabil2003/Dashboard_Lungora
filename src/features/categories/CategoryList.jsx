import { useState } from "react";
import { Edit, Trash, Eye, PlusCircle } from "lucide-react";
import { motion } from "framer-motion";
import AddCategoryForm from "./AddCategoryForm";

export default function CategoryList({ categories, onEdit, onDelete, onView, onAdd }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState(""); // "add" | "edit"
  const [currentCategory, setCurrentCategory] = useState(null);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentDeleteCategory, setCurrentDeleteCategory] = useState(null);

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

  const handleConfirmDelete = () => {
    if (currentDeleteCategory) {
      onDelete(currentDeleteCategory.id); // We pass only the category id for deletion
      handleCloseDeleteModal(); // Close the delete modal
    }
  };

  const handleSubmit = (name) => {
    if (modalType === "add") {
      onAdd(name); // Call the onAdd function passed as a prop
    } else if (modalType === "edit" && currentCategory) {
      onEdit(currentCategory.id, name); // Call the onEdit function passed as a prop
    }

    handleCloseModal(); // Close the modal after the operation
  };

  return (
    <>
      <div className="flex justify-between mb-8">
        <button
          onClick={() => handleOpenModal("add")}
          className="bg-sky-600 text-white px-6 py-2 rounded-lg hover:bg-sky-700 flex items-center"
        >
          <PlusCircle size={20} className="mr-2" />
          Add Category
        </button>
      </div>

      <div className="flex flex-wrap gap-6 mb-8 justify-center">
        {categories.map((category) => (
          <div
            key={category.id}
            className="bg-white p-4 shadow-lg rounded-lg hover:shadow-xl transition duration-300 ease-in-out w-32 text-center"
          >
            <h3 className="text-lg font-semibold text-sky-600">{category.name}</h3>
            <p className="text-gray-500">Articles: {category.articlesCount}</p>

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
        ))}
      </div>

      {/* Modal for Add/Edit */}
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
              <h3 className="text-xl font-semibold mb-4">
                {modalType === "addCategory"
                  ? "Add Category"
                  : modalType === "editCategory"
                   }
            </h3>
            <AddCategoryForm
              defaultValue={currentCategory?.name}
              onSubmit={handleSubmit}
              onCancel={handleCloseModal}
            />
          </motion.div>
        </motion.div>
      )}

      {/* Confirm Delete Modal */}
      {isDeleteModalOpen && (
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
              Are you sure you want to delete this category?
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
    </>
  );
}
