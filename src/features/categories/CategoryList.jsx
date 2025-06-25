import { useState, useEffect, useContext } from "react";
import {
  PlusCircle,
  Search,
  Eye,
  Edit,
  Trash,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import AddCategoryForm from "./categoryAddForm";
import { getArticlesByCategoryId } from "../../services/apiArticles";
import toast from "react-hot-toast";
import { ThemeContext } from "../../context/themeContext";

export default function CategoryList({
  categories,
  onEdit,
  onDelete,
  onView,
  onAdd,
}) {
  const { theme } = useContext(ThemeContext);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState(""); 
  const [currentCategory, setCurrentCategory] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentDeleteCategory, setCurrentDeleteCategory] = useState(null);
  const [articlesCount, setArticlesCount] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [menuOpen, setMenuOpen] = useState(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const categoriesPerPage = 12; 
  // Filter categories based on search term
  const filteredCategories = categories.filter((category) =>
    category.categoryName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination calculations
  const indexOfLastCategory = currentPage * categoriesPerPage;
  const indexOfFirstCategory = indexOfLastCategory - categoriesPerPage;
  const currentCategories = filteredCategories.slice(
    indexOfFirstCategory,
    indexOfLastCategory
  );
  const totalPages = Math.ceil(filteredCategories.length / categoriesPerPage);

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
        if (selectedCategoryId === currentDeleteCategory.id) {
          setSelectedCategoryId(null);
          onView(null);
        }
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
    const response = await getArticlesByCategoryId(categoryId);
    setArticlesCount((prevState) => ({
      ...prevState,
      [categoryId]: response.numberOfArticles || 0,
    }));
  } catch (error) {
    console.error("Failed to load articles count:", error);
    setArticlesCount((prevState) => ({
      ...prevState,
      [categoryId]: 0,
    }));
  }
};

  useEffect(() => {
    categories.forEach((category) => {
      loadArticlesCount(category.id);
    });
  }, [categories]);

  const toggleMenu = (id) => {
    console.log(
      "Toggling menu for category:",
      id,
      "Current menuOpen:",
      menuOpen
    );
    setMenuOpen(menuOpen === id ? null : id);
  };

  useEffect(() => {
    const handleClickOutside = () => {
      if (menuOpen) {
        console.log("Closing menu due to click outside");
        setMenuOpen(null);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [menuOpen]);

  const handleViewArticles = (categoryId) => {
    console.log(
      "handleViewArticles called with categoryId:",
      categoryId,
      "Current selectedCategoryId:",
      selectedCategoryId
    );
    if (selectedCategoryId === categoryId) {
      setSelectedCategoryId(null);
      onView(null);
      console.log("Deselected category, notifying parent to clear articles");
    } else {
      setSelectedCategoryId(categoryId);
      onView(categoryId);
      console.log(
        "Selected category:",
        categoryId,
        "Notifying parent to load articles"
      );
    }
    setMenuOpen(null);
  };

  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
      setSelectedCategoryId(null);
      onView(null);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      setSelectedCategoryId(null);
      onView(null);
    }
  };

  return (
    <div className="w-full space-y-6">
      {/* Header Section */}
      <div
        className={`p-6 rounded-lg shadow-sm border ${
          theme === "light"
            ? "bg-white border-sky-100"
            : "bg-gray-800 border-sky-600"
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
                Manage Categories
              </h3>
              <p
                className={`text-sm ${
                  theme === "light" ? "text-gray-600" : "text-gray-400"
                }`}
              >
                Organize and manage your content categories
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-3 w-full lg:w-auto">
        <div
          className={`flex items-center border rounded-md px-4 py-3 w-full lg:w-1/2 ${
            theme === "light"
              ? "bg-gray-50 border-gray-200"
              : "bg-gray-700 border-gray-600"
          }`}
        >
          <Search
            size={20}
            className={`mr-3 ${
              theme === "light" ? "text-gray-400" : "text-gray-500"
            }`}
          />
          <input
            type="text"
            placeholder="Search by category name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`w-full bg-transparent border-none outline-none ${
              theme === "light"
                ? "text-gray-700 placeholder-gray-400"
                : "text-gray-200 placeholder-gray-500"
            }`}
          />
        </div>
            <button
              onClick={() => handleOpenModal("add")}
              className={`px-4 py-2 rounded-md text-sm font-medium flex items-center space-x-2 ${
                theme === "light"
                  ? "bg-sky-600 text-white hover:bg-sky-700"
                  : "bg-sky-700 text-white hover:bg-sky-800"
              }`}
            >
              <PlusCircle size={16} />
              <span>Add Category</span>
            </button>
          </div>
          <div
            className={`text-sm ${
              theme === "light" ? "text-gray-500" : "text-gray-400"
            } whitespace-nowrap`}
          >
            {filteredCategories.length} categor
            {filteredCategories.length !== 1 ? "ies" : "y"} found
          </div>
        </div>
      </div>

      <div
        className={`rounded-lg shadow-sm border overflow-hidden ${
          theme === "light"
            ? "bg-white border-sky-100"
            : "bg-gray-800 border-sky-600"
        }`}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 p-6">
          {currentCategories.length > 0 ? (
            currentCategories.map((category) => (
              <div
                key={category.id}
                className={`relative p-4 rounded-lg shadow-md ${
                  theme === "light" ? "bg-gray-50" : "bg-gray-700"
                } hover:${
                  theme === "light" ? "bg-gray-100" : "bg-gray-600"
                } transition-colors ${
                  selectedCategoryId === category.id
                    ? theme === "light"
                      ? "border-2 border-sky-500"
                      : "border-2 border-sky-700"
                    : ""
                }`}
              >
                <div className="flex flex-col space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <h4
                        className={`text-sm font-semibold truncate ${
                          theme === "light" ? "text-gray-900" : "text-gray-200"
                        }`}
                        title={category.categoryName}
                      >
                        {category.categoryName}
                      </h4>
                      <p
                        className={`text-xs ${
                          theme === "light" ? "text-gray-500" : "text-gray-400"
                        }`}
                      >
            {articlesCount[category.id] !== undefined ? articlesCount[category.id] : 'Loading...'} articles                      </p>
                    </div>
                    <div className="flex items-center space-x-1 relative">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleMenu(category.id);
                        }}
                        className={`p-1 rounded-full ${
                          theme === "light"
                            ? "text-gray-600 hover:bg-gray-200"
                            : "text-gray-300 hover:bg-gray-600"
                        }`}
                      >
                        <i className="fa-solid fa-ellipsis-vertical text-sm"></i>
                      </button>
                      {menuOpen === category.id && (
                        <div
                          className={`absolute right-0 top-8 w-36 border rounded-lg shadow-lg z-50 py-1 ${
                            theme === "light"
                              ? "bg-white border-gray-200"
                              : "bg-gray-800 border-gray-600"
                          }`}
                        >
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleViewArticles(category.id);
                            }}
                            className={`w-full px-3 py-1.5 text-left flex items-center space-x-2 text-xs ${
                              theme === "light"
                                ? "text-gray-700 hover:bg-gray-50"
                                : "text-gray-200 hover:bg-gray-700"
                            }`}
                          >
                            <Eye size={14} />
                            <span>View Articles</span>
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleOpenModal("edit", category);
                              setMenuOpen(null);
                            }}
                            className={`w-full px-3 py-1.5 text-left flex items-center space-x-2 text-xs ${
                              theme === "light"
                                ? "text-gray-700 hover:bg-gray-50"
                                : "text-gray-200 hover:bg-gray-700"
                            }`}
                          >
                            <Edit size={14} />
                            <span>Edit Category</span>
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleOpenDeleteModal(category);
                              setMenuOpen(null);
                            }}
                            className={`w-full px-3 py-1.5 text-left flex items-center space-x-2 text-xs ${
                              theme === "light"
                                ? "text-red-600 hover:bg-gray-50"
                                : "text-red-300 hover:bg-gray-700"
                            }`}
                          >
                            <Trash size={14} />
                            <span>Delete Category</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleViewArticles(category.id);
                    }}
                    className={`w-full p-2 rounded-md text-xs font-medium flex items-center justify-center space-x-1 ${
                      selectedCategoryId === category.id
                        ? theme === "light"
                          ? "bg-sky-100 text-sky-700 border border-sky-300"
                          : "bg-sky-900 text-sky-300 border border-sky-700"
                        : theme === "light"
                        ? "bg-sky-50 text-sky-600 hover:bg-sky-100 border border-sky-200"
                        : "bg-sky-900/50 text-sky-400 hover:bg-sky-900 border border-sky-800"
                    }`}
                  >
                    {selectedCategoryId === category.id ? (
                      <>
                        <ChevronUp size={14} />
                        <span>Hide Articles</span>
                      </>
                    ) : (
                      <>
                        <ChevronDown size={14} />
                        <span>View Articles</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            ))
          ) : (
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
                No categories found
              </h3>
              <p
                className={`${
                  theme === "light" ? "text-gray-500" : "text-gray-400"
                }`}
              >
                {searchTerm
                  ? "Try adjusting your search criteria"
                  : "Get started by adding your first category"}
              </p>
            </div>
          )}
        </div>

        {/* Pagination */}
        {filteredCategories.length > 0 && totalPages > 1 && (
          <div
            className={`px-6 py-4 border-t ${
              theme === "light"
                ? "bg-gray-50 border-gray-200"
                : "bg-gray-700 border-gray-600"
            }`}
          >
            <div className="flex items-center justify-between">
              <div
                className={`text-sm ${
                  theme === "light" ? "text-gray-700" : "text-gray-300"
                }`}
              >
                Showing{" "}
                <span className="font-medium">{indexOfFirstCategory + 1}</span>{" "}
                to{" "}
                <span className="font-medium">
                  {Math.min(indexOfLastCategory, filteredCategories.length)}
                </span>{" "}
                of{" "}
                <span className="font-medium">{filteredCategories.length}</span>{" "}
                categories
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
                    } else if (
                      page === currentPage - 3 ||
                      page === currentPage + 3
                    ) {
                      return (
                        <span
                          key={page}
                          className={`px-2 ${
                            theme === "light"
                              ? "text-gray-400"
                              : "text-gray-500"
                          }`}
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

      {/* Add/Edit Modal */}
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
              {modalType === "add" ? "Add Category" : "Edit Category"}
            </h3>
            <AddCategoryForm
              defaultValue={currentCategory?.categoryName || ""}
              onSubmit={handleSubmit}
              onCancel={handleCloseModal}
            />
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && currentDeleteCategory && (
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
              Are you sure you want to delete the category "
              {currentDeleteCategory?.categoryName}"? This action cannot be
              undone.
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
    </div>
  );
}