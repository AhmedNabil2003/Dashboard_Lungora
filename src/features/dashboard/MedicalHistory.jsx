// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";

const getDiagnosisColor = (result) => {
  switch (result.toLowerCase()) {
    case "covid":
      return "bg-red-100 text-red-800 border-red-200";
    case "pneumonia":
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    case "normal":
      return "bg-green-100 text-green-800 border-green-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
};

const getSeverityColor = (severity) => {
  switch (severity.toLowerCase()) {
    case "high":
      return "bg-green-100 text-green-700 border-green-200";
      case "medium":
        return "bg-blue-100 text-blue-700  border-blue-200";
        case "low":
      return "bg-red-100 text-red-700 border-red-200";
    default:
      return "bg-gray-100 text-gray-700 border-gray-200";
  }
};

const MedicalHistory = ({ data, theme }) => {
  const medicalRecords =
    data?.aiResult?.map((record) => {
      const doctor = data.randomDoctors?.find(
        (d) => d.emailDoctor === record.user
      );
      return {
        date: new Date(record.createdAt).toLocaleDateString(),
        diagnosis: record.result,
        doctor: doctor?.name || record.user || "Unknown Doctor",
        severity: record.status,
        diagnosisColor: getDiagnosisColor(record.result),
        severityColor: getSeverityColor(record.status),
      };
    }) || [];

  return (
    <motion.div
      className={`p-4 rounded-lg shadow-lg lg:col-span-1 ${
        theme === "light" ? "bg-white" : "bg-gray-800"
      }`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.6 }}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <i
            className={`fas fa-file-medical mr-2 ${
              theme === "light" ? "text-sky-600" : "text-sky-400"
            }`}
          ></i>
          <h3
            className={`text-sm font-semibold ${
              theme === "light" ? "text-sky-800" : "text-gray-100"
            }`}
          >
            Medical History
          </h3>
        </div>
        <span
          className={`px-3 py-1 rounded-full text-xs ${
            theme === "light"
              ? "bg-gray-100 text-gray-600"
              : "bg-gray-700 text-gray-300"
          }`}
        >
          {medicalRecords.length} records
        </span>
      </div>

      <div
        className={`rounded-lg ${
          theme === "light" ? "bg-gray-50" : "bg-gray-700"
        }`}
      >
        {medicalRecords.length === 0 ? (
          <div className="p-4 text-center">
            <p
              className={`text-sm ${
                theme === "light" ? "text-gray-500" : "text-gray-400"
              }`}
            >
              No medical records available
            </p>
          </div>
        ) : (
          <div className="space-y-3 p-2 max-h-80 overflow-y-auto custom-scrollbar">
            {medicalRecords.map((record, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.01 }}
                className={`p-3 rounded-lg border ${
                  theme === "light"
                    ? "bg-white border-gray-200"
                    : "bg-gray-800 border-gray-600"
                } shadow-sm`}
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center space-x-2">
                    <div
                      className={`w-2 h-2 rounded-full ${
                        record.severity.toLowerCase() === "high"
                          ? "bg-red-500"
                          : record.severity.toLowerCase() === "medium"
                          ? "bg-yellow-500"
                          : "bg-green-500"
                      }`}
                    ></div>
                    <span
                      className={`text-sm font-medium ${
                        theme === "light" ? "text-gray-700" : "text-gray-300"
                      }`}
                    >
                      {record.date}
                    </span>
                  </div>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${record.diagnosisColor} border`}
                  >
                    {record.diagnosis}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <div>
                    <p
                      className={`text-xs ${
                        theme === "light" ? "text-gray-600" : "text-gray-400"
                      }`}
                    >
                      Diagnosed by
                    </p>
                    <p
                      className={`text-sm font-medium ${
                        theme === "light" ? "text-gray-800" : "text-gray-200"
                      }`}
                    >
                      {record.doctor}
                    </p>
                  </div>

                  <div className="text-right">
                    <p
                      className={`text-xs ${
                        theme === "light" ? "text-gray-600" : "text-gray-400"
                      }`}
                    >
                      Severity
                    </p>
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${record.severityColor} border`}
                    >
                      {record.severity}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default MedicalHistory;
