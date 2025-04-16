import { useEffect, useState } from "react";
import { Doughnut } from "react-chartjs-2";
import "chart.js/auto";
import { motion } from "framer-motion";

const Dashboard = () => {
  const [modelResults] = useState("Processing...");
  const [articles, setArticles] = useState([]); // State to hold the articles
  const [loading, setLoading] = useState(true); // State to handle loading state
  const [error, setError] = useState(null);

  // جلب المقالات من الـ API عند تحميل الصفحة
  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await fetch(
          "https://lungora.runasp.net/api/Article/GetAllArticles",
          {
            method: "GET",
            headers: {
              accept: "*/*",
            },
          }
        );
        const data = await response.json();
        if (data.statusCode === 200 && data.isSuccess) {
          setArticles(data.result.article); // تخزين المقالات في حالة state
        } else {
          setError("Failed to load articles");
        }
      } catch (err) {
        setError("An error occurred while fetching articles.");
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

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
    <div className="flex min-h-screen bg-gradient-to-br from-white-300 to-white-200 p-4">
      <main className="flex-1 p-4 ml-2 pt-0">
        {/* Analysis Cards */}
        <section className="flex flex-wrap gap-7 mb-4 justify-center ">
          {analysisData.map((stat, index) => (
            <motion.div
              key={index}
              className={`relative bg-gradient-to-r ${stat.color} p-4 rounded-xl shadow-lg hover:scale-105 transition-transform duration-300 ease-in-out flex flex-col items-center justify-center w-48 h-28`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: index * 0.2 }}
            >
              <i className={`fas ${stat.icon} text-2xl text-white`} />
              <div className="text-white text-center mt-2">
                <h3 className="text-xs font-semibold">{stat.label}</h3>
                <p className="text-lg font-bold">{stat.value}</p>
              </div>
              <div className="absolute bottom-0 left-0 w-full h-4 bg-white opacity-20 rounded-b-xl"></div>
            </motion.div>
          ))}
        </section>

        {/* Chart and Doctors & Articles List */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 mb-4 ">
          {/* Chart Section */}
          <motion.div
            className="bg-white p-4 rounded-lg shadow-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <h3 className="text-sm font-semibold text-gray-800 mb-4">
              Patient Analysis Chart
            </h3>
            <div className="relative w-full h-70 ">
              <Doughnut
                data={chartData}
                options={{
                  plugins: {
                    legend: {
                      position: "right",
                      labels: {
                        boxWidth: 12,
                        font: {
                          size: 12,
                        },
                      },
                    },
                  },
                  maintainAspectRatio: false,
                }}
              />
            </div>
          </motion.div>

          {/* Doctors and Articles Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 w-full">
            {/* Doctors Section */}
            <motion.div
              className="bg-white p-4 rounded-lg shadow-md"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <h3 className="text-sm font-semibold text-gray-800 mb-3">
                Doctors List
              </h3>
              <ul className="space-y-3">
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
                    className="flex items-center space-x-3 text-xs"
                  >
                    <img
                      src="https://via.placeholder.com/40"
                      alt={doctor.name}
                      className="rounded-full"
                    />
                    <div>
                      <h4 className="font-semibold">{doctor.name}</h4>
                      <p className="text-gray-600">{doctor.specialty}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Articles Section */}
            <motion.div
              className="bg-white p-4 rounded-lg shadow-md"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <h3 className="text-sm font-semibold text-gray-800 mb-2">
                Disease Articles
              </h3>

              {/* حالة التحميل */}
              {loading ? (
                <p>Loading articles...</p>
              ) : error ? (
                <p className="text-red-600">{error}</p> // عرض رسالة الخطأ في حال فشل الجلب
              ) : (
                <ul className="space-y-4">
                  {articles.length > 0 ? (
                    articles.map((article, index) => (
                      <li
                        key={index}
                        className="flex items-center space-x-4 border-b pb-4 mb-4"
                      >
                        {/* عرض صورة المقال صغيرة */}
                        {article.coverImage && (
                          <img
                            src={article.coverImage}
                            alt={article.title}
                            className="w-16 h-16 object-cover rounded-md"
                          />
                        )}

                        {/* عرض محتوى المقال */}
                        <div className="flex flex-col">
                          {/* عرض عنوان المقال */}
                          <h4 className="text-sm font-semibold text-gray-800">
                            {article.title}
                          </h4>
                          {/* عرض وصف المقال */}
                          <p className="text-xs text-gray-600">
                            {article.description}
                          </p>
                        </div>
                      </li>
                    ))
                  ) : (
                    <li>No articles available</li> // في حالة عدم وجود مقالات
                  )}
                </ul>
              )}
            </motion.div>
          </div>
        </section>

        {/* AI Model Results and User Medical History */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 mb-4 ">
          {/* AI Model Results Section */}
          <motion.div
            className="bg-white p-4 rounded-md shadow-sm flex-grow"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <h3 className="text-sm font-semibold text-gray-800 mb-2">
              AI Model Results
            </h3>
            <p className="text-xs font-semibold text-gray-700 mb-4">
              {modelResults}
            </p>

            {/* Start of Result Animation */}
            <motion.div
              className="flex flex-col space-y-4 justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 1 }}
            >
              {/* Animated Text 1 */}
              <motion.p
                className="text-sm text-gray-700 font-medium"
                initial={{ y: -50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.7, duration: 0.8 }}
              >
                Diagnosis: COVID-19
              </motion.p>

              {/* Animated Text 2 */}
              <motion.p
                className="text-sm text-gray-700 font-medium"
                initial={{ y: -50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.9, duration: 0.8 }}
              >
                Date: 2025-03-23
              </motion.p>

              {/* Animated Text 3 */}
              <motion.p
                className="text-sm text-gray-700 font-medium"
                initial={{ y: -50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 1.1, duration: 0.8 }}
              >
                Doctor: Dr. John Doe
              </motion.p>
            </motion.div>
            {/* End of Result Animation */}
          </motion.div>

          {/* User History Section */}
          <motion.div
            className="bg-white p-4 rounded-md shadow-sm flex-grow"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            <h3 className="text-sm font-semibold text-gray-800 mb-2">
              User Medical History
            </h3>
            <ul className="space-y-1 text-gray-700 text-xs">
              {[
                {
                  date: "2025-03-23",
                  diagnosis: "COVID-19",
                  doctor: "Dr. John Doe",
                },
                {
                  date: "2025-03-21",
                  diagnosis: "Pneumonia",
                  doctor: "Dr. Emily Taylor",
                },
                {
                  date: "2025-03-18",
                  diagnosis: "Normal",
                  doctor: "Dr. Jane Smith",
                },
              ].map((record, index) => (
                <li key={index} className="flex justify-between">
                  <span className="font-semibold">{record.date}</span>
                  <span>{record.diagnosis}</span>
                  <span className="italic">{record.doctor}</span>
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
