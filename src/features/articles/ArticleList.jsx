import { useContext, useState } from "react";
import { Edit, Trash, PlusCircle, Eye, Search } from "lucide-react";
import AddArticleForm from "./ArticleAddForm";
import toast from "react-hot-toast";
import { ThemeContext } from "../../context/ThemeProviderContext";

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
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const articlesPerPage = 6;
  const { theme } = useContext(ThemeContext);

  const filteredArticles = articles.filter(
    (article) =>
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const indexOfLastArticle = currentPage * articlesPerPage;
  const indexOfFirstArticle = indexOfLastArticle - articlesPerPage;
  const currentArticles = filteredArticles.slice(indexOfFirstArticle, indexOfLastArticle);
  const totalPages = Math.ceil(filteredArticles.length / articlesPerPage);

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
          backgroundColor: theme === "light" ? "#d1fae5" : "#16a34a",
          color: theme === "light" ? "#15803d" : "#d1fae5",
        },
      });
      handleCloseDeleteModal();
    } catch (error) {
      toast.error("Failed to delete article.", {
        style: {
          backgroundColor: theme === "light" ? "#fee2e2" : "#b91c1c",
          color: theme === "light" ? "#991b1b" : "#fee2e2",
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
            backgroundColor: theme === "light" ? "#d1fae5" : "#16a34a",
            color: theme === "light" ? "#15803d" : "#d1fae5",
          },
        });
      } else if (modalType === "editArticle") {
        if (!id) {
          toast.error("Article not found for editing", {
            style: {
              backgroundColor: theme === "light" ? "#fee2e2" : "#b91c1c",
              color: theme === "light" ? "#991b1b" : "#fee2e2",
            },
          });
          return;
        }
        await onEdit(id, formData);
        toast.success("Article updated successfully!", {
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

  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="w-full space-y-6">
      {/* Header Section */}
      <div
        className={`p-6 rounded-lg shadow-sm border ${
          theme === "light" ? "bg-white border-sky-100" : "bg-gray-800 border-sky-600"
        }`}
      >
        <div className="flex flex-col lg:flex-row items-center justify-between space-y-4 lg:space-y-0 lg:space-x-4">
          <div className="flex items-center space-x-3">
            <div
              className={`p-3 rounded-lg ${
                theme === "light"
                  ? "bg-gradient-to-r from-sky-700 to-sky-600"
                  : "bg-gradient-to-r from-sky-800 to-sky-700"
              }`}
            >
              <PlusCircle className="h-5 w-8 text-white" />
            </div>
            <div>
              <h3
                className={`text-xl font-bold ${
                  theme === "light" ? "text-gray-900" : "text-gray-200"
                }`}
              >
                Articles in "{categoryName}"
              </h3>
              <p
                className={`text-sm ${
                  theme === "light" ? "text-gray-600" : "text-gray-400"
                }`}
              >
                Manage articles for this category
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div
              className={`flex items-center border rounded-md px-4 py-3 w-full lg:w-64 ${
                theme === "light" ? "bg-gray-50 border-gray-200" : "bg-gray-700 border-gray-600"
              }`}
            >
              <Search
                size={20}
                className={`mr-3 ${theme === "light" ? "text-gray-400" : "text-gray-500"}`}
              />
              <input
                type="text"
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full bg-transparent border-none outline-none ${
                  theme === "light" ? "text-gray-700 placeholder-gray-400" : "text-gray-200 placeholder-gray-500"
                }`}
              />
            </div>

            <div
              className={`text-sm ${theme === "light" ? "text-gray-500" : "text-gray-400"} whitespace-nowrap`}
            >
              {filteredArticles.length} article{filteredArticles.length !== 1 ? "s" : ""} found
            </div>

            <button
              onClick={() => handleOpenModal("addArticle")}
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
        </div>
      </div>

      {/* Articles Grid */}
      <div
        className={`rounded-lg shadow-sm border overflow-hidden ${
          theme === "light" ? "bg-white border-sky-100" : "bg-gray-800 border-sky-600"
        }`}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
          {currentArticles.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <PlusCircle
                className={`h-12 w-12 mx-auto ${
                  theme === "light" ? "text-gray-300" : "text-gray-500"
                }`}
              />
              <h3
                className={`text-lg font-medium mt-3 ${
                  theme === "light" ? "text-gray-900" : "text-gray-200"
                }`}
              >
                No articles found
              </h3>
              <p
                className={`${
                  theme === "light" ? "text-gray-500" : "text-gray-400"
                }`}
              >
                {searchQuery ? "Try adjusting your search criteria" : "Get started by adding your first article"}
              </p>
              <button
                onClick={() => handleOpenModal("addArticle")}
                className={`mt-4 px-4 py-2 rounded-md text-sm font-medium ${
                  theme === "light"
                    ? "bg-sky-600 text-white hover:bg-sky-700"
                    : "bg-sky-700 text-white hover:bg-sky-800"
                }`}
              >
                <PlusCircle size={16} className="inline mr-2" />
                Add Article
              </button>
            </div>
          ) : (
            currentArticles.map((article) => (
              <div
                key={article.id}
                className={`p-4 rounded-lg shadow-md ${
                  theme === "light" ? "bg-gray-50" : "bg-gray-700"
                } hover:${theme === "light" ? "bg-gray-100" : "bg-gray-600"} transition-colors`}
              >
                <div className="flex flex-col space-y-3">
                  {article.coverImage && (
                    <img
                      src={article.coverImage}
                      alt={article.title}
                      className="w-full h-32 object-cover rounded-md"
                    />
                  )}
                  <div>
                    <h4
                      className={`text-sm font-semibold ${
                        theme === "light" ? "text-gray-900" : "text-gray-200"
                      }`}
                    >
                      {article.title}
                    </h4>
                    <p
                      className={`text-xs line-clamp-2 ${
                        theme === "light" ? "text-gray-600" : "text-gray-400"
                      }`}
                    >
                      {article.description}
                    </p>
                    <div
                      className={`text-xs mt-2 ${
                        theme === "light" ? "text-gray-500" : "text-gray-400"
                      }`}
                    >
                      <p>Created By: {article.createdBy}</p>
                      <p>Created At: {new Date(article.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="flex justify-end space-x-2">
                    <button
                      onClick={() => handleOpenViewModal(article)}
                      className={`p-2 rounded-full ${
                        theme === "light" ? "text-sky-600 hover:bg-gray-200" : "text-sky-400 hover:bg-gray-600"
                      }`}
                    >
                      <Eye size={18} />
                    </button>
                    <button
                      onClick={() => handleOpenModal("editArticle", article)}
                      className={`p-2 rounded-full ${
                        theme === "light" ? "text-sky-600 hover:bg-gray-200" : "text-sky-400 hover:bg-gray-600"
                      }`}
                    >
                      <Edit size={18} />
                    </button>
                    <button
                      onClick={() => handleOpenDeleteModal(article)}
                      className={`p-2 rounded-full ${
                        theme === "light" ? "text-red-600 hover:bg-gray-200" : "text-red-400 hover:bg-gray-600"
                      }`}
                    >
                      <Trash size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Pagination */}
        {filteredArticles.length > 0 && totalPages > 1 && (
          <div
            className={`px-6 py-4 border-t ${
              theme === "light" ? "bg-gray-50 border-gray-200" : "bg-gray-700 border-sky-600"
            }`}
          >
            <div className="flex items-center justify-between">
              <div
                className={`text-sm ${
                  theme === "light" ? "text-gray-700" : "text-gray-300"
                }`}
              >
                Showing <span className="font-medium">{indexOfFirstArticle + 1}</span> to{" "}
                <span className="font-medium">{Math.min(indexOfLastArticle, filteredArticles.length)}</span> of{" "}
                <span className="font-medium">{filteredArticles.length}</span> articles
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={prevPage}
                  disabled={currentPage === 1}
                  className={`px-4 py-2 rounded-md border text-sm font-medium transition-colors ${
                    currentPage === 1
                      ? theme === "light"
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200"
                        : "bg-gray-600 text-gray-500 cursor-not-allowed border-gray-600"
                      : theme === "light"
                      ? "bg-white text-gray-700 hover:bg-gray-50 border-gray-300"
                      : "bg-gray-800 text-gray-200 hover:bg-gray-700 border-gray-600"
                  }`}
                >
                  Previous
                </button>
                <div className="flex items-center space-x-1">
                  {[...Array(totalPages)].map((_, index) => {
                    const page = index + 1;
                    const isCurrentPage = page === currentPage;
                    const isNearCurrentPage = Math.abs(page - currentPage) <= 2;
                    const isFirstOrLast = page === 1 || page === totalPages;

                    if (isNearCurrentPage || isFirstOrLast) {
                      return (
                        <button
                          key={page}
                          onClick={() => setCurrentPage(page)}
                          className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                            isCurrentPage
                              ? theme === "light"
                                ? "bg-sky-500 text-white"
                                : "bg-sky-700 text-white"
                              : theme === "light"
                              ? "text-gray-700 hover:bg-gray-100"
                              : "text-gray-200 hover:bg-gray-700"
                          }`}
                        >
                          {page}
                        </button>
                      );
                    } else if (page === currentPage - 3 || page === currentPage + 3) {
                      return (
                        <span
                          key={page}
                          className={`px-2 ${theme === "light" ? "text-gray-400" : "text-gray-500"}`}
                        >
                          ...
                        </span>
                      );
                    }
                    return null;
                  })}
                </div>
                <button
                  onClick={nextPage}
                  disabled={currentPage === totalPages}
                  className={`px-4 py-2 rounded-md border text-sm font-medium transition-colors ${
                    currentPage === totalPages
                      ? theme === "light"
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200"
                        : "bg-gray-600 text-gray-500 cursor-not-allowed border-gray-600"
                      : theme === "light"
                      ? "bg-white text-gray-700 hover:bg-gray-50 border-gray-300"
                      : "bg-gray-800 text-gray-200 hover:bg-gray-700 border-gray-600"
                  }`}
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Add/Edit Article Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex justify-center items-center z-50 bg-black/30">
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
              {modalType === "addArticle" ? "Add Article" : "Edit Article"}
            </h3>
            <AddArticleForm
              initialData={currentArticle}
              onSubmit={handleSubmit}
              onClose={handleCloseModal}
              categoryId={categoryId}
            />
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && currentDeleteItem && (
        <div className="fixed inset-0 flex justify-center items-center z-50 bg-black/30">
          <div
            className={`${
              theme === "light" ? "bg-white" : "bg-gray-800"
            } p-6 rounded-lg shadow-lg w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto`}
          >
            <h3
              className={`${
                theme === "light" ? "text-gray-800" : "text-white"
              } text-lg font-semibold mb-4 capitalize border-b pb-2`}
            >
              Confirm Deletion
            </h3>
            <p
              className={`${
                theme === "light" ? "text-gray-600" : "text-gray-400"
              } text-sm mb-6`}
            >
              Are you sure you want to delete the article "
              {currentDeleteItem?.title}"? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={handleCloseDeleteModal}
                className={`${
                  theme === "light"
                    ? "bg-gray-300 hover:bg-gray-400 text-gray-700"
                    : "bg-gray-700 hover:bg-gray-600 text-gray-300"
                } px-4 py-2 rounded-md text-sm font-medium transition-colors`}
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className={`${
                  theme === "light"
                    ? "bg-red-600 hover:bg-red-700 text-white"
                    : "bg-red-600 hover:bg-red-700 text-white"
                } px-4 py-2 rounded-md text-sm font-medium transition-colors`}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Article Modal */}
      {isViewModalOpen && currentViewItem && (
        <div className="fixed inset-0 flex justify-center items-center z-50 bg-black/30">
          <div
            className={`${
              theme === "light" ? "bg-white" : "bg-gray-800"
            } p-6 rounded-lg shadow-lg w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto`}
          >
            <h3
              className={`${
                theme === "light" ? "text-gray-800" : "text-white"
              } text-lg font-bold mb-4 border-b pb-2`}
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
              className="w-full h-32 object-cover rounded-md mb-4"
            />
            <p
              className={`${
                theme === "light" ? "text-gray-800" : "text-white"
              } text-sm mb-4`}
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
            <div className="text-xs mt-4">
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
                Created At: {new Date(currentViewItem.createdAt).toLocaleDateString()}
              </p>
            </div>
            <div className="flex justify-end space-x-2 mt-4">
              <button
                onClick={handleCloseViewModal}
                className={`${
                  theme === "light"
                    ? "bg-gray-300 hover:bg-gray-400 text-gray-700"
                    : "bg-gray-700 hover:bg-gray-600 text-gray-300"
                } px-4 py-2 rounded-md text-sm font-medium transition-colors`}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}