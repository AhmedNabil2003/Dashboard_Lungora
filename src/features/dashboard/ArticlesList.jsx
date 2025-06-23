// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const ArticlesList = ({ articles, theme, loading, error }) => {
  return (
    <motion.div
      className={`p-4 rounded-xl shadow-lg h-full ${
        theme === "light"
          ? "bg-white text-gray-800 border border-gray-100"
          : "bg-gray-800 text-gray-100 border border-gray-700"
      }`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.4 }}
    >
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center">
          <i
            className={`fas fa-book-medical mr-2 ${
              theme === "light" ? "text-sky-600" : "text-sky-400"
            }`}
          ></i>
          <h3
            className={`text-sm font-semibold ${
              theme === "light" ? "text-sky-800" : "text-gray-100"
            }`}
          >
            Latest Medical Articles
          </h3>
        </div>
        {articles && articles.length > 0 && (
          <Link
            to="/dashboard/categories"
            className={`text-xs px-2 py-1 rounded ${
              theme === "light"
                ? "text-sky-600 hover:bg-sky-50"
                : "text-sky-400 hover:bg-gray-700"
            } transition-colors`}
          >
            View All →
          </Link>
        )}
      </div>

      {loading ? (
        <div className="space-y-2">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className={`p-2 rounded ${
                theme === "light" ? "bg-gray-100" : "bg-gray-700"
              } animate-pulse`}
            >
              <div className="flex space-x-2">
                <div
                  className={`w-10 h-10 rounded ${
                    theme === "light" ? "bg-gray-200" : "bg-gray-600"
                  }`}
                ></div>
                <div className="flex-1 space-y-1">
                  <div
                    className={`h-3 rounded ${
                      theme === "light" ? "bg-gray-200" : "bg-gray-600"
                    } w-3/4`}
                  ></div>
                  <div
                    className={`h-2 rounded ${
                      theme === "light" ? "bg-gray-200" : "bg-gray-600"
                    } w-full`}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : error ? (
        <div
          className={`p-2 rounded text-center text-xs ${
            theme === "light"
              ? "bg-red-50 text-red-600"
              : "bg-red-900/20 text-red-400"
          }`}
        >
          {error}
        </div>
      ) : (
        <div className="space-y-2 overflow-y-auto max-h-72">
          {articles && articles.length > 0 ? (
            articles.slice(0, 5).map((article, index) => (
              <motion.div
                key={article.id || index}
                whileHover={{
                  backgroundColor: theme === "light" ? "#f8fafc" : "#1e293b",
                }}
                className={`rounded ${
                  theme === "light"
                    ? "hover:bg-gray-50"
                    : "hover:bg-gray-700/50"
                } transition-colors`}
              >
                <Link
                  to={`/dashboard/articles/${article.id}`}
                  className="flex items-start p-2"
                >
                  <div className="w-10 h-10 flex-shrink-0 mr-2">
                    <img
                      src={article.coverImage || "/placeholder.svg"}
                      alt={article.title}
                      className="w-full h-full object-cover rounded"
                      onError={(e) => {
                        e.target.src = "/placeholder.svg";
                      }}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4
                      className={`text-xs font-medium mb-0.5 truncate ${
                        theme === "light" ? "text-gray-800" : "text-gray-100"
                      }`}
                    >
                      {article.title}
                    </h4>
                    <p
                      className={`text-xs ${
                        theme === "light" ? "text-gray-500" : "text-gray-400"
                      } line-clamp-1`}
                    >
                      {article.description}
                    </p>
                    <div className="flex justify-between items-center mt-1">
                      <span
                        className={`text-sm ${
                          theme === "light" ? "text-gray-400" : "text-gray-500"
                        }`}
                      >
                        {article.categoryName ||
                          article.category?.name ||
                          "General"}
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))
          ) : (
            <div
              className={`p-2 rounded text-center text-xs ${
                theme === "light"
                  ? "bg-gray-100 text-gray-500"
                  : "bg-gray-700 text-gray-400"
              }`}
            >
              No articles available
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
};

export default ArticlesList;
