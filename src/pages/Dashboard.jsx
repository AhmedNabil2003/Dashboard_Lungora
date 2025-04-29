import { useContext, useEffect, useState } from "react";
import { Doughnut } from "react-chartjs-2";
import "chart.js/auto";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { useArticles } from "../features/articles/useArticles";
import { ThemeContext } from "../context/ThemeContext";

const Dashboard = () => {
  const [modelResults] = useState("Processing...");
  const { articles, loading, error, fetchAllArticles } = useArticles();
  const [displayArticles, setDisplayArticles] = useState([]);
  const { theme } = useContext(ThemeContext);
  // Fetch articles when component mounts
  useEffect(() => {
    fetchAllArticles();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem("theme", theme);
  }, [theme]);
  // Process articles to display only a subset (latest 5)
  useEffect(() => {
    if (articles && articles.length > 0) {
      // Take only the first 5 articles
      const latestArticles = articles.slice(0, 5);
      setDisplayArticles(latestArticles);
    }
  }, [articles]);

  const analysisData = [
    {
      label: "Users",
      value: "1500",
      icon: "fa-users",
      color: "from-indigo-500 to-blue-600",
    },
    {
      label: "Doctors",
      value: "120",
      icon: "fa-user-md",
      color: "from-green-500 to-green-400",
    },
    {
      label: "COVID Patients",
      value: "450",
      icon: "fa-virus",
      color: "from-red-500 to-red-400",
    },
    {
      label: "Pneumonia Patients",
      value: "300",
      icon: "fa-lungs-virus",
      color: "from-yellow-500 to-yellow-400",
    },
    {
      label: "Normal Patients",
      value: "650",
      icon: "fa-heartbeat",
      color: "from-blue-500 to-blue-400",
    },
    {
      label: "AI Model",
      value: "Active",
      icon: "fa-robot",
      color: "from-gray-500 to-gray-400",
    },
  ];

  const chartData = {
    labels: ["Users", "Doctors", "COVID", "Pneumonia", "Normal"],
    datasets: [
      {
        label: "Patient Analysis",
        data: [1500, 120, 450, 300, 650],
        backgroundColor: [
          "#4F46E5",
          "#22C55E",
          "#EF4444",
          "#FACC15",
          "#3B82F6",
        ],
      },
    ],
  };

  return (
    <div
      className={`flex min-h-screen p-2 ${
        theme === "light"
          ? "bg-gradient-to-br from-gray-50 to-gray-100"
          : "bg-gradient-to-br from-gray-800 to-gray-900"
      }`}
    >
      <main className="flex-1 p-3 max-w-full mx-auto">
        {/* Analysis Cards - More compact with responsive layout */}
        <section className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 mb-4">
          {analysisData.map((stat, index) => (
            <motion.div
              key={index}
              className={`relative bg-gradient-to-r ${stat.color} p-3 rounded-lg shadow hover:shadow-md transition-all duration-300 flex flex-col items-center justify-center h-24`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: index * 0.1 }}
            >
              <i
                className={`fas ${stat.icon} text-xl ${
                  theme === "light" ? "text-white" : "text-gray-200"
                }`}
              />
              <div
                className={`${
                  theme === "light" ? "text-white" : "text-gray-200"
                } text-center mt-1`}
              >
                <h3 className="text-xs font-semibold">{stat.label}</h3>
                <p className="text-lg font-bold">{stat.value}</p>
              </div>
              <div className="absolute bottom-0 left-0 w-full h-2 bg-white opacity-20 rounded-b-lg"></div>
            </motion.div>
          ))}
        </section>

        {/* Main Content Area - Better layout for charts and lists */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
          {/* Chart Section - Smaller but still prominent */}
          <motion.div
            className={`p-3 rounded-lg shadow lg:col-span-1 ${
              theme === "light"
                ? "bg-white text-gray-800"
                : "bg-gray-800 text-gray-100"
            }`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <h3
              className={`${
                theme === "light" ? "text-gray-800" : "text-gray-100"
              } text-sm font-semibold mb-2`}
            >
              Patient Analysis
            </h3>
            <div className="relative w-full h-56">
              <Doughnut
                data={chartData}
                options={{
                  plugins: {
                    legend: {
                      position: "bottom",
                      labels: {
                        boxWidth: 10,
                        padding: 10,
                        font: {
                          size: 10,
                          family: "Arial, sans-serif",
                        },
                        color: theme === "light" ? "#4B5563" : "#D1D5DB", // Set legend text color
                      },
                    },
                  },
                  maintainAspectRatio: false,
                  cutout: "65%",
                }}
              />
            </div>
          </motion.div>

          {/* Right side content - Doctors and Articles */}
          <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Doctors Section - Cleaner layout */}
            <motion.div
              className={`p-3 rounded-lg shadow h-full ${
                theme === "light"
                  ? "bg-white text-gray-800"
                  : "bg-gray-800 text-gray-100"
              }`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <h3
                className={`${
                  theme === "light" ? "text-gray-800" : "text-gray-100"
                } text-sm font-semibold mb-2 pb-1 border-b`}
              >
                Doctors List
              </h3>
              <ul className="space-y-2 overflow-y-auto max-h-64">
                {[
                  {
                    name: "Dr. Ahmed Mostafa",
                    specialty: "Pulmonary Specialist",
                  },
                  { name: "Dr. Fatima Abdelrahman", specialty: "Cardiologist" },
                  {
                    name: "Dr. Mohamed Ali",
                    specialty: "General Practitioner",
                  },
                  { name: "Dr. Youssef Hassan", specialty: "Neurologist" },
                  { name: "Dr. Sarah Ibrahim", specialty: "Pediatrician" },
                  { name: "Dr. Amr Tarek", specialty: "Orthopedic Surgeon" },
                  { name: "Dr. Maha El-Sharif", specialty: "Dermatologist" },
                ].map((doctor, index) => (
                  <li
                    key={index}
                    className={`flex items-center space-x-2 text-xs hover:bg-gray-50 p-1 rounded ${
                      theme === "light"
                        ? "hover:bg-gray-100"
                        : "hover:bg-gray-700"
                    }`}
                  >
                    <img
                      src="https://via.placeholder.com/36"
                      alt={doctor.name}
                      className="rounded-full w-9 h-9"
                    />
                    <div>
                      <h4 className="font-semibold">{doctor.name}</h4>
                      <p className="text-gray-600 text-xs">
                        {doctor.specialty}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Articles Section - Improved readability */}
            <motion.div
              className={`p-3 rounded-lg shadow h-full ${
                theme === "light"
                  ? "bg-white text-gray-800"
                  : "bg-gray-800 text-gray-100"
              }`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <h3
                className={`${
                  theme === "light" ? "text-gray-800" : "text-gray-100"
                } text-sm font-semibold mb-2 pb-1 border-b`}
              >
                Latest Disease Articles
              </h3>

              {/* Loading state */}
              {loading ? (
                <p className="text-center text-gray-500 py-4 text-xs">
                  Loading articles...
                </p>
              ) : error ? (
                <p className="text-red-500 text-center py-4 text-xs">{error}</p>
              ) : (
                <ul className="space-y-2 overflow-y-auto max-h-64">
                  {displayArticles.length > 0 ? (
                    displayArticles.map((article, index) => (
                      <li
                        key={index}
                        className={`flex items-start space-x-2 border-b pb-2 last:border-b-0 hover:bg-gray-50 rounded p-1 ${
                          theme === "light"
                            ? "hover:bg-gray-100"
                            : "hover:bg-gray-700"
                        }`}
                      >
                        {/* Article image */}
                        {article.coverImage && (
                          <img
                            src={article.coverImage}
                            alt={article.title}
                            className="w-12 h-12 object-cover rounded"
                          />
                        )}

                        {/* Article content */}
                        <div className="flex flex-col flex-1">
                          <h4
                            className={`${
                              theme === "light"
                                ? "text-gray-800"
                                : "text-gray-100"
                            } text-xs font-semibold`}
                          >
                            {article.title}
                          </h4>
                          <p
                            className={`${
                              theme === "light"
                                ? "text-gray-600"
                                : "text-gray-300"
                            } text-xs line-clamp-2`}
                          >
                            {article.description}
                          </p>
                        </div>
                      </li>
                    ))
                  ) : (
                    <li className="text-center text-gray-500 py-4 text-xs">
                      No articles available
                    </li>
                  )}
                </ul>
              )}
              {displayArticles.length > 0 && (
                <div className="text-right mt-2">
                  <a
                    href="/dashboard/categories"
                    className="text-xs text-blue-500 hover:underline"
                  >
                    View all articles →
                  </a>
                </div>
              )}
            </motion.div>
          </div>
        </div>

        {/* Bottom Section - AI Model Results and Medical History */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* AI Model Results Section - Better animations */}
          <motion.div
            className={`p-3 rounded-lg shadow ${
              theme === "light"
                ? "bg-white text-gray-800"
                : "bg-gray-800 text-gray-100"
            }`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <h3
              className={`${
                theme === "light" ? "text-gray-800" : "text-gray-100"
              } text-sm font-semibold mb-2 pb-1 border-b`}
            >
              AI Model Results
            </h3>
            <p
              className={`${
                theme === "light" ? "text-gray-700" : "text-gray-300"
              } text-xs font-medium mb-3`}
            >
              {modelResults}
            </p>

            {/* Start of Result Animation - More subtle animations */}
            <motion.div
              className="flex flex-col space-y-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.8 }}
            >
              {/* Results with better visual hierarchy */}
              <div
                className={`p-2 rounded border-l-4 ${
                  theme === "light"
                    ? "bg-blue-50 border-blue-400"
                    : "bg-blue-700 border-blue-500"
                }`}
              >
                <motion.p
                  className={`${
                    theme === "light" ? "text-gray-800" : "text-gray-100"
                  } text-sm font-medium`}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                >
                  <span
                    className={`${
                      theme === "light" ? "text-blue-700" : "text-blue-300"
                    } font-semibold`}
                  >
                    Diagnosis:
                  </span>{" "}
                  COVID-19
                </motion.p>
              </div>

              <div
                className={`p-2 rounded border-l-4 ${
                  theme === "light"
                    ? "bg-gray-50 border-gray-300"
                    : "bg-gray-700 border-gray-600"
                }`}
              >
                <motion.p
                  className={`${
                    theme === "light" ? "text-gray-800" : "text-gray-100"
                  } text-sm font-medium`}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.4, duration: 0.5 }}
                >
                  <span
                    className={`${
                      theme === "light" ? "text-gray-700" : "text-gray-300"
                    } font-semibold`}
                  >
                    Date:
                  </span>{" "}
                  2025-03-23
                </motion.p>
              </div>

              <div
                className={`p-2 rounded border-l-4 ${
                  theme === "light"
                    ? "bg-green-50 border-green-400"
                    : "bg-green-700 border-green-500"
                }`}
              >
                <motion.p
                  className={`${
                    theme === "light" ? "text-gray-800" : "text-gray-100"
                  } text-sm font-medium`}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.5, duration: 0.5 }}
                >
                  <span
                    className={`${
                      theme === "light" ? "text-green-700" : "text-green-300"
                    } font-semibold`}
                  >
                    Doctor:
                  </span>{" "}
                  Dr. John Doe
                </motion.p>
              </div>
            </motion.div>
          </motion.div>

          {/* User History Section - Better formatting */}
          <motion.div
            className={`p-3 rounded-lg shadow ${
              theme === "light"
                ? "bg-white text-gray-800"
                : "bg-gray-800 text-gray-100"
            }`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <h3
              className={`${
                theme === "light" ? "text-gray-800" : "text-gray-100"
              } text-sm font-semibold mb-2 pb-1 border-b`}
            >
              User Medical History
            </h3>
            <ul className="divide-y divide-gray-100">
              {[
                {
                  date: "2025-03-23",
                  diagnosis: "COVID-19",
                  doctor: "Dr. John Doe",
                  color: "bg-red-100 text-red-800",
                },
                {
                  date: "2025-03-21",
                  diagnosis: "Pneumonia",
                  doctor: "Dr. Emily Taylor",
                  color: "bg-yellow-100 text-yellow-800",
                },
                {
                  date: "2025-03-18",
                  diagnosis: "Normal",
                  doctor: "Dr. Jane Smith",
                  color: "bg-green-100 text-green-800",
                },
              ].map((record, index) => (
                <li
                  key={index}
                  className={`py-2 text-xs hover:bg-gray-50 ${
                    theme === "light"
                      ? "hover:bg-gray-100"
                      : "hover:bg-gray-700"
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <span
                      className={`${
                        theme === "light" ? "text-gray-700" : "text-gray-300"
                      } font-medium`}
                    >
                      {record.date}
                    </span>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${record.color}`}
                    >
                      {record.diagnosis}
                    </span>
                    <span
                      className={`${
                        theme === "light" ? "text-gray-600" : "text-gray-400"
                      }`}
                    >
                      {record.doctor}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          </motion.div>
        </section>
      </main>
    </div>
  );
};

export default Dashboard;
