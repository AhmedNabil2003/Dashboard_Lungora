// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion"
import { Doughnut } from "react-chartjs-2"
import "chart.js/auto"

const Stats = ({ data, theme }) => {
  if (!data) return null

  const chartData = {
    labels: ["Active Users", "Doctors", "COVID", "Pneumonia", "Normal"],
    datasets: [
      {
        label: "Patient Analysis",
        data: [
          data.userStats?.activeCount || 0,
          data.allDoctors?.length || 0,
          data.predictionStats?.find((stat) => stat.result === "Covid")?.count || 0,
          data.predictionStats?.find((stat) => stat.result === "Pneumonia")?.count || 0,
          data.predictionStats?.find((stat) => stat.result === "Normal")?.count || 0,
        ],
        backgroundColor: ["#6366F1", "#22C55E", "#F43F5E", "#F59E0B", "#3B82F6"],
        borderWidth: 0,
      },
    ],
  }

  return (
    <motion.div
      className={`p-3 rounded-lg shadow lg:col-span-1 ${
        theme === "light" ? "bg-white text-gray-800" : "bg-gray-800 text-gray-100"
      }`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.2 }}
    >
      <h3 className={`${theme === "light" ? "text-gray-800" : "text-gray-100"} text-sm font-semibold mb-2`}>
        Analysis
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
  )
}

export default Stats
