// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion"

const AnalysisBox = ({ data, theme }) => {
  if (!data) return null

  const analysisData = [
    {
      label: "Active Users",
      value: data.userStats?.activeCount?.toString() || "0",
      icon: "fa-user-group",
      color: "from-indigo-500 to-blue-600",
      trend: "up",
      change: `${data.userStats?.activePercentage?.toFixed(1) || 0}%`,
    },
    {
      label: "Doctors",
      value: data.allDoctors?.length?.toString() || "0",
      icon: "fa-user-doctor",
      color: "from-green-500 to-green-400",
      trend: "up",
      change: "5%",
    },
    {
      label: "COVID Cases",
      value: data.predictionStats?.find((stat) => stat.result === "Covid")?.count?.toString() || "0",
      icon: "fa-virus-covid",
      color: "from-red-500 to-red-400",
      trend: data.predictionStats?.find((stat) => stat.result === "Covid")?.weeklyPercentage > 0 ? "up" : "down",
      change: `${data.predictionStats?.find((stat) => stat.result === "Covid")?.weeklyPercentage || 0}%`,
    },
    {
      label: "Pneumonia Cases",
      value: data.predictionStats?.find((stat) => stat.result === "Pneumonia")?.count?.toString() || "0",
      icon: "fa-lungs",
      color: "from-amber-500 to-yellow-500",
      trend: data.predictionStats?.find((stat) => stat.result === "Pneumonia")?.weeklyPercentage > 0 ? "up" : "stable",
      change: `${data.predictionStats?.find((stat) => stat.result === "Pneumonia")?.weeklyPercentage || 0}%`,
    },
    {
      label: "Normal Patients",
      value: data.predictionStats?.find((stat) => stat.result === "Normal")?.count?.toString() || "0",
      icon: "fa-heart-pulse",
      color: "from-blue-500 to-blue-400",
      trend: data.predictionStats?.find((stat) => stat.result === "Normal")?.weeklyPercentage > 0 ? "up" : "down",
      change: `${data.predictionStats?.find((stat) => stat.result === "Normal")?.weeklyPercentage || 0}%`,
    },
    {
      label: "AI Accuracy",
      value: "96.7%",
      icon: "fa-microchip-ai",
      color: "from-purple-500 to-fuchsia-500",
      trend: "up",
      change: "2%",
    },
  ]

  return (
    <section className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 mb-4">
      {analysisData.map((stat, index) => (
        <motion.div
          key={index}
          className={`relative bg-gradient-to-r ${stat.color} p-3 rounded-lg shadow hover:shadow-md transition-all duration-300 flex flex-col items-center justify-center h-24`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: index * 0.1 }}
        >
          <i className={`fas ${stat.icon} text-base ${theme === "light" ? "text-white" : "text-gray-200"}`} />
          <div className={`${theme === "light" ? "text-white" : "text-gray-200"} text-center mt-0.5`}>
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
                stat.trend === "up" ? "text-green-300" : stat.trend === "down" ? "text-red-300" : "text-yellow-300"
              }`}
            >
              <i
                className={`fas ${
                  stat.trend === "up" ? "fa-arrow-up" : stat.trend === "down" ? "fa-arrow-down" : "fa-minus"
                } text-[10px]`}
              />
            </span>
            <span>{stat.change} from last week</span>
          </div>
          <div className="absolute bottom-0 left-0 w-full h-2 bg-white opacity-20 rounded-b-lg"></div>
        </motion.div>
      ))}
    </section>
  )
}

export default AnalysisBox
