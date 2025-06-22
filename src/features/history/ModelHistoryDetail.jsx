// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { format } from "date-fns";
import { CheckCircle2, XCircle, Calendar, User } from "lucide-react";

const ModelHistoryDetail = ({ 
  onClose, 
  record, 
  theme 
}) => {
  if (!record) return null;

  return (
    <div className="fixed inset-0 bg-black/30 flex justify-center items-center z-50 p-4">
      <div className={`rounded-lg shadow-xl w-full max-w-2xl ${
        theme === "light" ? "bg-white" : "bg-gray-800"
      }`}>
        <div className="flex justify-between items-start p-6 pb-0">
          <h2 className={`text-2xl font-bold ${
            theme === "light" ? "text-sky-600" : "text-sky-300"
          }`}>
            Prediction Details
          </h2>
          <button
            onClick={onClose}
            className={`text-2xl font-bold ${
              theme === "light" ? "text-gray-400 hover:text-gray-600" : "text-gray-500 hover:text-gray-300"
            }`}
          >
            ×
          </button>
        </div>

        <div className="p-6">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Left Column - Image and User Info */}
            <div className="flex flex-col items-center space-y-4 md:w-1/2">
              <img
                src={record.imagePath}
                alt="Model Result"
                className={`w-full max-w-xs rounded-xl border-2 ${
                  theme === "light" ? "border-sky-200" : "border-sky-700"
                } shadow-sm`}
              />
              
              <div className="flex items-center space-x-4 w-full">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                  theme === "light" ? "bg-sky-100" : "bg-sky-900"
                }`}>
                  <User className={`w-5 h-5 ${
                    theme === "light" ? "text-sky-600" : "text-sky-300"
                  }`} />
                </div>
                <div>
                  <h3 className={`text-lg font-semibold ${
                    theme === "light" ? "text-gray-900" : "text-gray-200"
                  }`}>
                    User ID: {record.userId}
                  </h3>
                  <div className={`flex items-center text-sm ${
                    theme === "light" ? "text-gray-500" : "text-gray-400"
                  }`}>
                    <Calendar className="w-4 h-4 mr-1" />
                    {format(new Date(record.createdAt), 'yyyy-MM-dd HH:mm')}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Details */}
            <div className="space-y-4 md:w-1/2">
              <div className="space-y-3">
                <h4 className={`font-medium ${
                  theme === "light" ? "text-gray-900" : "text-gray-200"
                }`}>Prediction Information</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center">
                    <span className={theme === "light" ? "text-gray-900" : "text-gray-200"}>
                      Result: {record.prediction}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className={`font-medium ${
                  theme === "light" ? "text-gray-900" : "text-gray-200"
                }`}>Status</h4>
                <div className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full text-sm font-medium ${
                  record.status === 'High'
                    ? (theme === "light" 
                        ? "bg-red-100 text-red-800" 
                        : "bg-red-900 text-red-200")
                    : (theme === "light" 
                        ? "bg-green-100 text-green-800" 
                        : "bg-green-900 text-green-200")
                }`}>
                  {record.status === 'High' ? (
                    <XCircle className="w-4 h-4" />
                  ) : (
                    <CheckCircle2 className="w-4 h-4" />
                  )}
                  <span>{record.status} Risk</span>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className={`font-medium ${
                  theme === "light" ? "text-gray-900" : "text-gray-200"
                }`}>Save Status</h4>
                <p className={`text-sm ${
                  record.isSave 
                    ? (theme === "light" ? "text-green-600" : "text-green-400")
                    : (theme === "light" ? "text-gray-600" : "text-gray-400")
                }`}>
                  {record.isSave ? 'Saved to records' : 'Not saved'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModelHistoryDetail;