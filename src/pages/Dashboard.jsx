import { useContext, useEffect, useState } from "react";
import { Doughnut } from "react-chartjs-2";
import "chart.js/auto";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { useArticles } from "../features/articles/useArticles";
import { useDoctors } from "../features/doctors/useDoctors";
import { ThemeContext } from "../context/ThemeContext";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const [modelResults] = useState("Processing...");
  const {
    articles,
    loading: articlesLoading,
    error: articlesError,
    fetchAllArticles,
  } = useArticles();
  const {
    doctors,
    loading: doctorsLoading,
    error: doctorsError,
  } = useDoctors();
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
      const latestArticles = articles.slice(0, 5);
      setDisplayArticles(latestArticles);
    }
  }, [articles]);

  const analysisData = [
  {
    label: "Active Users",
    value: "10",
    icon: "fa-user-group",
    color: "from-indigo-500 to-blue-600",
    trend: "up",
    change: "12%",
  },
  {
    label: "Doctors",
    value: doctors?.length.toString() || "0",
    icon: "fa-user-doctor",
    color: "from-green-500 to-green-400",
    trend: "up",
    change: "5%",
  },
  {
    label: "COVID Cases",
    value: "126",
    icon: "fa-virus-covid",
    color: "from-red-500 to-red-400",
    trend: "down",
    change: "8%",
  },
  {
    label: "Pneumonia Cases",
    value: "84",
    icon: "fa-lungs",
    color: "from-amber-500 to-yellow-500",
    trend: "stable",
    change: "0%",
  },
  {
    label: "Normal Patients",
    value: "102",
    icon: "fa-heart-pulse",
   color: "from-blue-500 to-blue-400",
    trend: "up",
    change: "15%",
  },
  {
    label: "AI Accuracy",
    value: "96.7%",
    icon: "fa-microchip-ai",
    color: "from-purple-500 to-fuchsia-500",
    trend: "up",
    change: "2%",
  },
];

const chartData = {
  labels: ["Active Users", "Doctors", "COVID", "Pneumonia", "Normal"],
  datasets: [
    {
      label: "Patient Analysis",
      data: [10, doctors?.length || 0, 126, 84, 102],
      backgroundColor: ["#6366F1", "#22C55E", "#F43F5E", "#F59E0B", "#3B82F6"],
      borderWidth: 0,
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
    <main className="flex-1 max-w-full mx-auto">
      {/* Analysis Cards */}
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
              className={`fas ${stat.icon} text-base ${
                theme === "light" ? "text-white" : "text-gray-200"
              }`}
            />
            <div
              className={`${
                theme === "light" ? "text-white" : "text-gray-200"
              } text-center mt-0.5`}
            >
              <h3 className="text-[10px] font-semibold">{stat.label}</h3>
              <p className="text-sm font-bold">{stat.value}</p>
            </div>
            <div
              className={`mt-0.5 flex items-center text-[9px] ${
                theme === "light" ? "text-white opacity-90" : "text-gray-200 opacity-90"
              }`}
            >
              <span
                className={`mr-0.5 ${
                  stat.trend === "up"
                    ? "text-green-300"
                    : stat.trend === "down"
                    ? "text-red-300"
                    : "text-yellow-300"
                }`}
              >
                <i
                  className={`fas ${
                    stat.trend === "up"
                      ? "fa-arrow-up"
                      : stat.trend === "down"
                      ? "fa-arrow-down"
                      : "fa-minus"
                  } text-[10px]`}
                />
              </span>
              <span>{stat.change} from last week</span>
            </div>
            <div className="absolute bottom-0 left-0 w-full h-2 bg-white opacity-20 rounded-b-lg"></div>
          </motion.div>
        ))}
      </section>

        {/* Main Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
          {/* Chart Section */}
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
                        color: theme === "light" ? "#4B5563" : "#D1D5DB",
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
            {/* Doctors Section - Now with real data */}
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
              {doctorsLoading ? (
                <p className="text-center text-gray-500 py-4 text-xs">
                  Loading doctors...
                </p>
              ) : doctorsError ? (
                <p className="text-red-500 text-center py-4 text-xs">
                  {doctorsError}
                </p>
              ) : (
                <ul className="space-y-3 overflow-y-auto max-h-64">
                  {doctors &&doctors?.length > 0 ? (
                    doctors.slice(0, 5).map((doctor) => (
                      <li
                        key={doctor.id}
                        className={`p-3 rounded-lg ${
                          theme === "light"
                            ? "bg-gray-50 hover:bg-gray-100"
                            : "bg-gray-700 hover:bg-gray-600"
                        } transition-colors duration-200`}
                      >
                        <div className="flex items-start space-x-3">
                          <img
                            src={
                              doctor.imageDoctor ||
                              "imageDoctor"
                            }
                            alt={doctor.name}
                            className="rounded-full w-12 h-12 object-cover flex-shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <h4 className="font-semibold text-sm">
                                Dr. {doctor.name}
                              </h4>
                              <span
                                className={`text-xs px-2 py-1 rounded-full ${
                                  theme === "light"
                                    ? "bg-blue-100 text-blue-800"
                                    : "bg-blue-900 text-blue-100"
                                }`}
                              >
                                {doctor.category?.categoryName || "General"}
                              </span>
                            </div>

                            {/* Doctor Info */}
                            <div className="mt-1 text-xs space-y-1">
                              <div className="flex items-start">
                                <i
                                  className={`fas fa-info-circle mt-1 mr-2 w-4 text-center ${
                                    theme === "light"
                                      ? "text-gray-500"
                                      : "text-gray-400"
                                  }`}
                                ></i>
                                <p
                                  className={`${
                                    theme === "light"
                                      ? "text-gray-600"
                                      : "text-gray-300"
                                  } line-clamp-2`}
                                >
                                  {doctor.about || "No description available"}
                                </p>
                              </div>

                              <div className="flex items-center">
                                <i
                                  className={`fas fa-map-marker-alt mr-2 w-4 text-center ${
                                    theme === "light"
                                      ? "text-gray-500"
                                      : "text-gray-400"
                                  }`}
                                ></i>
                                <p
                                  className={`${
                                    theme === "light"
                                      ? "text-gray-600"
                                      : "text-gray-300"
                                  }`}
                                >
                                  {doctor.location || "Location not specified"}
                                </p>
                              </div>

                              <div className="flex items-center">
                                <i
                                  className={`fas fa-user-injured mr-2 w-4 text-center ${
                                    theme === "light"
                                      ? "text-gray-500"
                                      : "text-gray-400"
                                  }`}
                                ></i>
                                <p
                                  className={`${
                                    theme === "light"
                                      ? "text-gray-600"
                                      : "text-gray-300"
                                  }`}
                                >
                                  Patients: {doctor.numOfPatients || 0}
                                </p>
                              </div>

                              <div className="flex items-center">
                                <i
                                  className={`fas fa-briefcase mr-2 w-4 text-center ${
                                    theme === "light"
                                      ? "text-gray-500"
                                      : "text-gray-400"
                                  }`}
                                ></i>
                                <p
                                  className={`${
                                    theme === "light"
                                      ? "text-gray-600"
                                      : "text-gray-300"
                                  }`}
                                >
                                  Experience: {doctor.experianceYears || 0}{" "}
                                  years
                                </p>
                              </div>

                              {/* Contact Icons */}
                              <div className="flex flex-wrap gap-2 pt-2">
                                {doctor.phone && (
                                  <a
                                    href={`tel:${doctor.phone}`}
                                    className={`p-2 rounded-lg flex items-center ${
                                      theme === "light"
                                        ? "bg-green-50 text-green-600 hover:bg-green-100"
                                        : "bg-green-900 text-green-300 hover:bg-green-800"
                                    }`}
                                    title="Mobile"
                                  >
                                    <i className="fas fa-mobile-alt mr-1"></i>
                                    <span className="text-xs ml-1">
                                      {doctor.phone}
                                    </span>
                                  </a>
                                )}

                                {doctor.teliphone && (
                                  <a
                                    href={`tel:${doctor.teliphone}`}
                                    className={`p-2 rounded-lg flex items-center ${
                                      theme === "light"
                                        ? "bg-blue-50 text-blue-600 hover:bg-blue-100"
                                        : "bg-blue-900 text-blue-300 hover:bg-blue-800"
                                    }`}
                                    title="Telephone"
                                  >
                                    <i className="fas fa-phone mr-1"></i>
                                    <span className="text-xs ml-1">
                                      {doctor.teliphone}
                                    </span>
                                  </a>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </li>
                    ))
                  ) : (
                    <li className="text-center text-gray-500 py-4 text-xs">
                      No doctors available
                    </li>
                  )}
                </ul>
              )}
              {doctors.length > 0 && (
                <div className="text-right mt-2">
                  <Link
                    to="/dashboard/doctors"
                    className="text-xs text-blue-500 hover:underline"
                  >
                    View all doctors →
                  </Link>
                </div>
              )}
            </motion.div>
            {/* Articles Section */}
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

              {articlesLoading ? (
                <p className="text-center text-gray-500 py-4 text-xs">
                  Loading articles...
                </p>
              ) : articlesError ? (
                <p className="text-red-500 text-center py-4 text-xs">
                  {articlesError}
                </p>
              ) : (
                <ul className="space-y-2 overflow-y-auto max-h-64">
                  {displayArticles.length > 0 ? (
                    displayArticles.map((article) => (
                      <li
                        key={article.id}
                        className={`flex items-start space-x-2 border-b pb-2 last:border-b-0 hover:bg-gray-50 rounded p-1 ${
                          theme === "light"
                            ? "hover:bg-gray-100"
                            : "hover:bg-gray-700"
                        }`}
                      >
                        {article.coverImage && (
                          <img
                            src={article.coverImage}
                            alt={article.title}
                            className="w-12 h-12 object-cover rounded"
                          />
                        )}
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
                  <Link
                    to="/dashboard/categories"
                    className="text-xs text-blue-500 hover:underline"
                  >
                    View all articles →
                  </Link>
                </div>
              )}
            </motion.div>
          </div>
        </div>

        {/* Bottom Section - AI Model Results and Medical History */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* AI Model Results Section */}
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

            <motion.div
              className="flex flex-col space-y-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.8 }}
            >
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
                  {doctors?.[0]?.name
                    ? `Dr. ${doctors[0].name}`
                    : "Dr. John Doe"}
                </motion.p>
              </div>
            </motion.div>
          </motion.div>

          {/* User History Section */}
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
                  doctor: doctors?.[1]?.name
                    ? `Dr. ${doctors[1].name}`
                    : "Dr. Emily Taylor",
                  color: "bg-red-100 text-red-800",
                },
                {
                  date: "2025-03-21",
                  diagnosis: "Pneumonia",
                  doctor: doctors?.[2]?.name
                    ? `Dr. ${doctors[2].name}`
                    : "Dr. Jane Smith",
                  color: "bg-yellow-100 text-yellow-800",
                },
                {
                  date: "2025-03-18",
                  diagnosis: "Normal",
                  doctor: doctors?.[0]?.name
                    ? `Dr. ${doctors[0].name}`
                    : "Dr. John Doe",
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
