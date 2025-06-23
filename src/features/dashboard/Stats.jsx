// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { Doughnut } from "react-chartjs-2";
import "chart.js/auto";

const Stats = ({ data, theme }) => {
  if (!data) return null;

  const chartData = {
    labels: ["Active Users", "Medical Staff", "COVID", "Pneumonia", "Normal"],
    datasets: [
      {
        label: "Health Analysis",
        data: [
          data.userStats?.activeCount || 0,
          data.userStats?.doctorCount || 0,
          data.predictionStats?.find((stat) => stat.result === "Covid")
            ?.count || 0,
          data.predictionStats?.find((stat) => stat.result === "Pneumonia")
            ?.count || 0,
          data.predictionStats?.find((stat) => stat.result === "Normal")
            ?.count || 0,
        ],
        backgroundColor: [
          "#6366F1",
          "#10B981",
          "#EF4444",
          "#F59E0B",
          "#3B82F6",
        ],
        borderWidth: 0,
      },
    ],
  };

  const totalRecords = chartData.datasets[0].data.reduce((a, b) => a + b, 0);

  return (
    <motion.div
      className={`p-4 rounded-xl shadow-lg flex flex-col h-full ${
        theme === "light"
          ? "bg-white border border-gray-100"
          : "bg-gray-800 border border-gray-700"
      }`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Header Section */}
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center">
          <i
            className={`fas fa-chart-line mr-2 ${
              theme === "light" ? "text-sky-600" : "text-sky-400"
            }`}
          ></i>
          <h3
            className={`text-sm font-semibold ${
              theme === "light" ? "text-sky-800" : "text-gray-100"
            }`}
          >
            Health Analytics
          </h3>
        </div>
        <span
          className={`px-3 py-1 rounded-full text-xs font-medium ${
            theme === "light"
              ? "bg-sky-100 text-sky-800"
              : "bg-sky-900/30 text-sky-400"
          }`}
        >
          Live Data
        </span>
      </div>

      {/* Main Chart Area - Now larger */}
      <div className="flex-1 min-h-0 flex flex-col">
        <div className="relative flex-grow">
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
                      size: 11,
                      family: "Inter, sans-serif",
                    },
                    color: theme === "light" ? "#4B5563" : "#D1D5DB",
                    usePointStyle: true,
                  },
                },
                tooltip: {
                  backgroundColor: theme === "light" ? "#FFFFFF" : "#1F2937",
                  titleColor: theme === "light" ? "#111827" : "#F9FAFB",
                  bodyColor: theme === "light" ? "#374151" : "#E5E7EB",
                  borderColor: theme === "light" ? "#E5E7EB" : "#4B5563",
                  borderWidth: 1,
                  padding: 10,
                  callbacks: {
                    label: function (context) {
                      const percentage = Math.round(
                        (context.raw / totalRecords) * 100
                      );
                      return ` ${context.label}: ${context.raw} (${percentage}%)`;
                    },
                  },
                },
              },
              maintainAspectRatio: false,
              cutout: "65%",
              animation: {
                animateScale: true,
                animateRotate: true,
              },
            }}
          />
        </div>
      </div>

      {/* Bottom Footer - Update and Total */}
      <div
        className={`mt-3 pt-3 flex justify-between items-center text-xs ${
          theme === "light" ? "text-gray-500" : "text-gray-400"
        }`}
      >
        <div className="flex items-center">
          <i
            className={`fas fa-clock mr-1 ${
              theme === "light" ? "text-gray-400" : "text-gray-500"
            }`}
          ></i>
          <span>
            Updated:{" "}
            {new Date().toLocaleTimeString("en-US", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
        </div>
        <div className="flex items-center">
          <i
            className={`fas fa-chart-pie mr-1 ${
              theme === "light" ? "text-gray-400" : "text-gray-500"
            }`}
          ></i>
          <span>Total Records: {totalRecords}</span>
        </div>
      </div>
    </motion.div>
  );
};

export default Stats;
