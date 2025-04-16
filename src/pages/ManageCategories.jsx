// import { useState } from "react";
// import { motion } from "framer-motion";
// import { Edit, Trash, Eye, PlusCircle } from "lucide-react"; // أيقونات للتعديل والحذف والإضافة

// export default function Categories() {
//   // البيانات الثابتة للتصنيفات والمقالات
//   const categoriesData = [
//     { id: 1, name: "Technology", articlesCount: 3 },
//     { id: 2, name: "Health", articlesCount: 5 },
//     { id: 3, name: "Science", articlesCount: 2 },
//   ];

//   const articlesData = {
//     1: [
//       { id: 1, title: "Latest Tech Trends", categoryId: 1 },
//       { id: 2, title: "AI and the Future", categoryId: 1 },
//       { id: 3, title: "Cybersecurity", categoryId: 1 },
//     ],
//     2: [
//       { id: 4, title: "Health Tips", categoryId: 2 },
//       { id: 5, title: "Mental Health Awareness", categoryId: 2 },
//       { id: 6, title: "Fitness for Everyone", categoryId: 2 },
//       { id: 7, title: "The Benefits of Yoga", categoryId: 2 },
//       { id: 8, title: "Healthy Eating", categoryId: 2 },
//     ],
//     3: [
//       { id: 9, title: "Quantum Mechanics", categoryId: 3 },
//       { id: 10, title: "Space Exploration", categoryId: 3 },
//     ],
//   };

//   const [categories, setCategories] = useState(categoriesData);
//   const [articles, setArticles] = useState([]);
//   const [showArticles, setShowArticles] = useState(null);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [modalType, setModalType] = useState(""); // نوع المودال: 'addCategory', 'editCategory', 'addArticle', 'editArticle'
//   const [currentCategory, setCurrentCategory] = useState(null);
//   const [currentArticle, setCurrentArticle] = useState(null);
//   const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false); // حالة المودال لتأكيد الحذف
//   const [currentDeleteItem, setCurrentDeleteItem] = useState(null); // العنصر الذي سيتم حذفه

//   const handleDeleteCategory = () => {
//     if (currentDeleteItem?.type === "category") {
//       setCategories(
//         categories.filter(
//           (category) => category.id !== currentDeleteItem.item.id
//         )
//       );
//     } else if (currentDeleteItem?.type === "article") {
//       setArticles(
//         articles.filter((article) => article.id !== currentDeleteItem.item.id)
//       );
//     }
//     setIsDeleteModalOpen(false); // إغلاق المودال بعد الحذف
//   };

//   const handleViewArticles = (categoryId) => {
//     setShowArticles(showArticles === categoryId ? null : categoryId);
//     if (showArticles !== categoryId) {
//       setArticles(articlesData[categoryId] || []);
//     }
//   };

//   const handleEditCategory = (category) => {
//     setModalType("editCategory");
//     setCurrentCategory(category);
//     setIsModalOpen(true);
//   };

//   const handleEditArticle = (article) => {
//     setModalType("editArticle");
//     setCurrentArticle(article);
//     setIsModalOpen(true);
//   };

//   const handleAddCategory = () => {
//     setModalType("addCategory");
//     setIsModalOpen(true);
//   };

//   const handleAddArticle = (categoryId) => {
//     setModalType("addArticle");
//     setCurrentCategory({ id: categoryId }); // تعيين التصنيف الحالي للإضافة
//     setIsModalOpen(true);
//   };

//   const handleCloseModal = () => {
//     setIsModalOpen(false);
//     setCurrentCategory(null);
//     setCurrentArticle(null);
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     // هنا سنقوم بمعالجة التقديم بناءً على نوع المودال
//     if (modalType === "addCategory") {
//       const newCategory = {
//         id: categories.length + 1,
//         name: e.target.name.value,
//         articlesCount: 0,
//       };
//       setCategories([...categories, newCategory]);
//     }

//     if (modalType === "editCategory") {
//       setCategories(
//         categories.map((category) =>
//           category.id === currentCategory.id
//             ? { ...category, name: e.target.name.value }
//             : category
//         )
//       );
//     }

//     if (modalType === "addArticle") {
//       const newArticle = {
//         id: articles.length + 1,
//         title: e.target.title.value,
//         categoryId: currentCategory.id,
//       };
//       setArticles([...articles, newArticle]);

//       // تحديث عدد المقالات في التصنيف
//       setCategories(
//         categories.map((category) =>
//           category.id === currentCategory.id
//             ? { ...category, articlesCount: category.articlesCount + 1 }
//             : category
//         )
//       );
//     }

//     if (modalType === "editArticle") {
//       setArticles(
//         articles.map((article) =>
//           article.id === currentArticle.id
//             ? { ...article, title: e.target.title.value }
//             : article
//         )
//       );
//     }

//     handleCloseModal();
//   };

//   const handleOpenDeleteModal = (item, type) => {
//     setCurrentDeleteItem({ item, type });
//     setIsDeleteModalOpen(true);
//   };

//   const handleCloseDeleteModal = () => {
//     setIsDeleteModalOpen(false);
//     setCurrentDeleteItem(null);
//   };

//   return (
//     <motion.div className="flex justify-center items-start min-h-screen bg-gradient-to-br from-white-300 to-white-200 p-4">
//       <motion.div
//         className="w-full max-w-7xl bg-white p-6 sm:p-4 rounded-2xl shadow-2xl flex flex-col space-y-4"
//         initial={{ opacity: 0 }}
//         animate={{ opacity: 1 }}
//         transition={{ duration: 0.8 }}
//       >
//         <h2 className="text-3xl font-bold text-center text-sky-600 mb-6">
//           Manage Categories and Articles
//         </h2>

//         {/* Buttons to add category */}
//         <div className="flex justify-between mb-8">
//           <button
//             onClick={handleAddCategory}
//             className="bg-sky-600 text-white px-6 py-2 rounded-lg hover:bg-sky-700 flex items-center"
//           >
//             <PlusCircle size={20} className="mr-2" />
//             Add Category
//           </button>
//         </div>

//         {/* Categories Section - Grid of categories */}
//         <div className="flex flex-wrap gap-6 mb-8 justify-center">
//           {categories.map((category) => (
//             <div
//               key={category.id}
//               className="bg-white p-4 shadow-lg rounded-lg hover:shadow-xl transition duration-300 ease-in-out w-32 text-center"
//             >
//               <h3 className="text-lg font-semibold text-sky-600">
//                 {category.name}
//               </h3>
//               <p className="text-gray-500">
//                 Articles: {category.articlesCount}
//               </p>

//               <div className="mt-4 space-x-4 flex justify-center">
//                 <button
//                   onClick={() => handleViewArticles(category.id)}
//                   className="text-sky-600 hover:text-sky-800"
//                 >
//                   <Eye size={20} />
//                 </button>
//                 <button
//                   onClick={() => handleEditCategory(category)}
//                   className="text-sky-600 hover:text-sky-800"
//                 >
//                   <Edit size={20} />
//                 </button>
//                 <button
//                   onClick={() => handleOpenDeleteModal(category, "category")}
//                   className="text-red-600 hover:text-red-800"
//                 >
//                   <Trash size={20} />
//                 </button>
//               </div>
//             </div>
//           ))}
//         </div>
//         {/* Add Article Button - Placed below the articles */}
//         <div className="mt-4 text-center">
//           {showArticles && (
//             <button
//               onClick={() => handleAddArticle(showArticles)}
//               className="bg-sky-600 text-white px-6 py-2 rounded-lg hover:bg-sky-700 flex items-center justify-center"
//             >
//               <PlusCircle size={20} className="mr-2" />
//               Add Article
//             </button>
//           )}
//         </div>
//         {/* Articles Section */}
//         {showArticles && (
//           <div className="bg-white p-6 shadow-lg rounded-lg mb-8">
//             <h3 className="text-xl font-semibold mb-4">
//               Articles in "
//               {categories.find((cat) => cat.id === showArticles)?.name}"
//             </h3>
//             <ul className="space-y-4">
//               {articles.length === 0 ? (
//                 <p className="text-center text-gray-500">No articles found</p>
//               ) : (
//                 articles.map((article) => (
//                   <li
//                     key={article.id}
//                     className="flex justify-between items-center p-4 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
//                   >
//                     <span className="font-semibold">{article.title}</span>
//                     <div className="space-x-2">
//                       <button
//                         onClick={() => handleEditArticle(article)}
//                         className="text-sky-600 hover:text-sky-800"
//                       >
//                         <Edit size={20} />
//                       </button>
//                       <button
//                         onClick={() =>
//                           handleOpenDeleteModal(article, "article")
//                         }
//                         className="text-red-600 hover:text-red-800"
//                       >
//                         <Trash size={20} />
//                       </button>
//                     </div>
//                   </li>
//                 ))
//               )}
//             </ul>
//           </div>
//         )}

//         {/* Modal for Confirm Delete */}
//         {isDeleteModalOpen && currentDeleteItem && (
//           <motion.div
//             className="fixed inset-0 flex justify-center items-center z-50"
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             transition={{ duration: 0.3 }}
//           >
//             <motion.div
//               className="bg-white p-6 rounded-lg shadow-lg w-96"
//               initial={{ scale: 0.8 }}
//               animate={{ scale: 1 }}
//               transition={{ duration: 0.3 }}
//             >
//               <h3 className="text-xl font-semibold mb-4">
//                 Are you sure you want to delete this{" "}
//                 {currentDeleteItem.type === "category" ? "category" : "article"}
//                 ?
//               </h3>
//               <div className="flex justify-between space-x-4">
//                 <button
//                   onClick={handleCloseDeleteModal}
//                   className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   onClick={handleDeleteCategory} // يمكن استخدام نفس الدالة هنا للحذف من أي نوع (تصنيف أو مقال)
//                   className="bg-red-600 text-white px-4 py-2 rounded-md"
//                 >
//                   Delete
//                 </button>
//               </div>
//             </motion.div>
//           </motion.div>
//         )}

//         {/* Modal for Add or Edit Category/Article */}
//         {isModalOpen && (
//           <motion.div
//             className="fixed inset-0 flex justify-center items-center z-50"
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             transition={{ duration: 0.3 }}
//           >
//             <motion.div
//               className="bg-white p-6 rounded-lg shadow-lg w-96"
//               initial={{ scale: 0.8 }}
//               animate={{ scale: 1 }}
//               transition={{ duration: 0.3 }}
//             >
//               <h3 className="text-xl font-semibold mb-4">
//                 {modalType === "addCategory"
//                   ? "Add Category"
//                   : modalType === "editCategory"
//                   ? "Edit Category"
//                   : modalType === "addArticle"
//                   ? "Add Article"
//                   : "Edit Article"}
//               </h3>
//               <form onSubmit={handleSubmit}>
//                 <div className="mb-4">
//                   <input
//                     type="text"
//                     name={
//                       modalType === "addCategory" ||
//                       modalType === "editCategory"
//                         ? "name"
//                         : "title"
//                     }
//                     defaultValue={
//                       modalType === "editCategory"
//                         ? currentCategory?.name
//                         : modalType === "editArticle"
//                         ? currentArticle?.title
//                         : ""
//                     }
//                     className="w-full p-2 border rounded-md"
//                     required
//                   />
//                 </div>
//                 <div className="flex justify-between space-x-4">
//                   <button
//                     type="button"
//                     onClick={handleCloseModal}
//                     className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md"
//                   >
//                     Cancel
//                   </button>
//                   <button
//                     type="submit"
//                     className="bg-sky-600 text-white px-4 py-2 rounded-md"
//                   >
//                     Save
//                   </button>
//                 </div>
//               </form>
//             </motion.div>
//           </motion.div>
//         )}
//       </motion.div>
//     </motion.div>
//   );
// }

import { useState } from "react";
import { motion } from "framer-motion";
import { useCategories } from "../features/categories/useCategories";
import { useArticles } from "../features/articles/useArticles";
import CategoryList from "../features/categories/CategoryList";
import ArticleList from "../features/articles/ArticleList";

export default function ManageCategories() {
  const initialCategories = [
    { id: 1, name: "Technology", articlesCount: 3 },
    { id: 2, name: "Health", articlesCount: 5 },
    { id: 3, name: "Science", articlesCount: 2 },
  ];

  const articlesData = {
    1: [
      { id: 1, title: "Latest Tech Trends", categoryId: 1 },
      { id: 2, title: "AI and the Future", categoryId: 1 },
      { id: 3, title: "Cybersecurity", categoryId: 1 },
    ],
    2: [
      { id: 4, title: "Health Tips", categoryId: 2 },
      { id: 5, title: "Mental Health Awareness", categoryId: 2 },
      { id: 6, title: "Fitness for Everyone", categoryId: 2 },
      { id: 7, title: "The Benefits of Yoga", categoryId: 2 },
      { id: 8, title: "Healthy Eating", categoryId: 2 },
    ],
    3: [
      { id: 9, title: "Quantum Mechanics", categoryId: 3 },
      { id: 10, title: "Space Exploration", categoryId: 3 },
    ],
  };

  const {
    categories,
    addCategory,
    editCategory,
    deleteCategory,
    incrementArticleCount,
  } = useCategories(initialCategories);

  const {
    articles,
    loadArticlesByCategory,
    addArticle,
    editArticle,
    deleteArticle,
  } = useArticles(articlesData);

  const [showArticles, setShowArticles] = useState(null);

  const handleViewArticles = (categoryId) => {
    if (showArticles === categoryId) {
      setShowArticles(null); 
    } else {
      setShowArticles(categoryId);
      loadArticlesByCategory(categoryId);
    }
  };
  

  return (
    <motion.div className="flex justify-center items-start min-h-screen bg-gradient-to-br from-white-300 to-white-200 p-4">
      <motion.div
        className="w-full max-w-7xl bg-white p-6 sm:p-4 rounded-2xl shadow-2xl flex flex-col space-y-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
      <h2 className="text-3xl font-bold text-center text-sky-600 mb-6">
        Manage Categories and Articles
      </h2>

      {/* Category List - handles its own modals */}
      <CategoryList
        categories={categories}
        onView={handleViewArticles}
        onAdd={addCategory}
        onEdit={editCategory}
        onDelete={deleteCategory}
      />

      {/* Articles List with its own modal handling */}
      {showArticles && (
        <ArticleList
          articles={articles}
          categoryId={showArticles}
          categoryName={categories.find((c) => c.id === showArticles)?.name}
          onEdit={editArticle}
          onDelete={(article) => deleteArticle(article.id)}
          onAdd={(title, catId) => {
            addArticle(title, catId);
            incrementArticleCount(catId);
          }}
        />
      )}
    </motion.div>
</motion.div>
  );
}
