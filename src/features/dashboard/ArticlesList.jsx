// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion"
import { Link } from "react-router-dom"

const ArticlesList = ({ articles, theme, loading, error }) => {
  return (
    <motion.div
      className={`p-3 rounded-lg shadow h-full ${
        theme === "light" ? "bg-white text-gray-800" : "bg-gray-800 text-gray-100"
      }`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.4 }}
    >
      <h3
        className={`${theme === "light" ? "text-gray-800" : "text-gray-100"} text-sm font-semibold mb-2 pb-1 border-b`}
      >
        Latest Disease Articles
      </h3>

      {loading ? (
        <p className="text-center text-gray-500 py-4 text-xs">Loading articles...</p>
      ) : error ? (
        <p className="text-red-500 text-center py-4 text-xs">{error}</p>
      ) : (
        <ul className="space-y-2 overflow-y-auto max-h-64">
          {articles && articles.length > 0 ? (
            articles.slice(0, 5).map((article, index) => (
              <li
                key={article.id || index}
                className={`flex items-start space-x-2 border-b pb-2 last:border-b-0 hover:bg-gray-50 rounded p-1 ${
                  theme === "light" ? "hover:bg-gray-100" : "hover:bg-gray-700"
                }`}
              >
                {article.coverImage && (
                  <img
                    src={article.coverImage || "/placeholder.svg"}
                    alt={article.title}
                    className="w-12 h-12 object-cover rounded"
                    onError={(e) => {
                      e.target.src = "/placeholder.svg"
                    }}
                  />
                )}
                <div className="flex flex-col flex-1">
                  <h4 className={`${theme === "light" ? "text-gray-800" : "text-gray-100"} text-xs font-semibold`}>
                    {article.title}
                  </h4>
                  <p className={`${theme === "light" ? "text-gray-600" : "text-gray-300"} text-xs line-clamp-2`}>
                    {article.description}
                  </p>
                </div>
              </li>
            ))
          ) : (
            <li className="text-center text-gray-500 py-4 text-xs">No articles available</li>
          )}
        </ul>
      )}
      {articles && articles.length > 0 && (
        <div className="text-right mt-2">
          <Link to="/dashboard/categories" className="text-xs text-blue-500 hover:underline">
            View all articles →
          </Link>
        </div>
      )}
    </motion.div>
  )
}

export default ArticlesList
