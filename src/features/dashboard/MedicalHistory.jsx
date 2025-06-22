// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";

const getDiagnosisColor = (result) => {
  switch (result.toLowerCase()) {
    case "covid":
      return "bg-red-100 text-red-800";
    case "pneumonia":
      return "bg-yellow-100 text-yellow-800";
    case "normal":
      return "bg-green-100 text-green-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

// دالة لتحديد لون الشدة
const getSeverityColor = (severity) => {
  switch (severity.toLowerCase()) {
    case "high":
      return "bg-red-200 text-red-700";
    case "medium":
      return "bg-yellow-200 text-yellow-700";
    case "low":
      return "bg-green-200 text-green-700";
    default:
      return "bg-gray-200 text-gray-700";
  }
};

const MedicalHistory = ({ data, theme }) => {
  // تحويل aiResult إلى صيغة السجلات الطبية
  const medicalRecords = data?.aiResult?.map((record) => {
    // البحث عن طبيب مطابق في randomDoctors
    const doctor = data.randomDoctors?.find((d) => d.emailDoctor === record.user);
    return {
      date: new Date(record.createdAt).toLocaleDateString(),
      diagnosis: record.result,
      doctor: doctor?.name || record.user || "Unknown Doctor",
      severity: record.status,
      color: getDiagnosisColor(record.result),
    };
  }) || [];

  return (
    <motion.div
      className={`p-4 rounded-lg shadow lg:col-span-1 ${
        theme === "light" ? "bg-white text-gray-800" : "bg-gray-800 text-gray-100"
      }`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.6 }}
    >
      <h3
        className={`${theme === "light" ? "text-gray-800" : "text-gray-100"} text-sm font-semibold mb-4 pb-2 border-b`}
      >
        Medical History
      </h3>

      <div
        className={`p-3 rounded-lg border ${
          theme === "light" ? "bg-gray-50 border-gray-200" : "bg-gray-700 border-gray-600"
        }`}
      >
        <h3
          className={`${theme === "light" ? "text-gray-800" : "text-gray-100"} text-xs font-semibold mb-3`}
        >
          Patient Medical Records
        </h3>
        {medicalRecords.length === 0 ? (
          <p className={`${theme === "light" ? "text-gray-600" : "text-gray-400"} text-xs`}>
            No medical records available.
          </p>
        ) : (
          <ul className="divide-y divide-gray-100 max-h-82 m-2 overflow-y-auto">
            {medicalRecords.map((record, index) => (
              <li
                key={index}
                className={`py-3 text-xs hover:bg-gray-50 ${
                  theme === "light" ? "hover:bg-gray-100" : "hover:bg-gray-600"
                }`}
              >
                <div className="flex flex-col space-y-2">
                  <div className="flex justify-between items-center">
                    <span className={`${theme === "light" ? "text-gray-700" : "text-gray-300"} font-medium`}>
                      {record.date}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${record.color}`}>
                      {record.diagnosis}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className={`${theme === "light" ? "text-gray-600" : "text-gray-400"}`}>
                      {record.doctor}
                    </span>
                    <span className={`text-xs px-2 py-1 rounded ${getSeverityColor(record.severity)}`}>
                      {record.severity}
                    </span>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </motion.div>
  );
};

export default MedicalHistory;