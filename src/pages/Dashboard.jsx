import { useContext, useEffect } from "react";
import { ThemeContext } from "../context/ThemeProviderContext";
import { useDashboard } from "../features/dashboard/useDashboard";
import AnalysisBox from "../features/dashboard/AnalysisBox";
import Stats from "../features/dashboard/Stats";
import DoctorsList from "../features/dashboard/LastDoctorList";
import ArticlesList from "../features/dashboard/LastArticale";
import DoctorsMap from "../features/dashboard/DoctorsMap";
import MedicalHistory from "../features/dashboard/LastMedicalHistory";
const Dashboard = () => {
  const { theme } = useContext(ThemeContext);
  const { data, loading, error, refetch } = useDashboard();

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem("theme", theme);
  }, [theme]);

  // Loading State
  if (loading) {
    return (
      <div
        className={`flex min-h-screen items-center justify-center ${
          theme === "light"
            ? "bg-gradient-to-br from-gray-50 to-gray-100"
            : "bg-gradient-to-br from-gray-800 to-gray-900"
        }`}
      >
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p
            className={`mt-4 text-sm ${
              theme === "light" ? "text-gray-600" : "text-gray-300"
            }`}
          >
            Loading dashboard data...
          </p>
          <div className="mt-2 flex justify-center space-x-1">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
            <div
              className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
              style={{ animationDelay: "0.1s" }}
            ></div>
            <div
              className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
              style={{ animationDelay: "0.2s" }}
            ></div>
          </div>
        </div>
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div
        className={`flex min-h-screen items-center justify-center ${
          theme === "light"
            ? "bg-gradient-to-br from-gray-50 to-gray-100"
            : "bg-gradient-to-br from-gray-800 to-gray-900"
        }`}
      >
        <div className="text-center max-w-md mx-auto p-6">
          <div className="text-red-500 text-6xl mb-4">
            <i className="fas fa-exclamation-triangle"></i>
          </div>
          <h2
            className={`text-2xl font-bold mb-2 ${
              theme === "light" ? "text-gray-800" : "text-gray-100"
            }`}
          >
            Error Loading Dashboard
          </h2>
          <p
            className={`mb-6 ${
              theme === "light" ? "text-gray-600" : "text-gray-300"
            }`}
          >
            {error}
          </p>
          <div className="space-y-3">
            <button
              onClick={refetch}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg transition-colors font-medium"
            >
              <i className="fas fa-redo mr-2"></i>
              Try Again
            </button>
            <button
              onClick={() => window.location.reload()}
              className={`w-full border px-6 py-3 rounded-lg transition-colors font-medium ${
                theme === "light"
                  ? "border-gray-300 text-gray-700 hover:bg-gray-50"
                  : "border-gray-600 text-gray-300 hover:bg-gray-700"
              }`}
            >
              <i className="fas fa-refresh mr-2"></i>
              Reload Page
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Main Dashboard Content
  return (
    <div
      className={`min-h-screen p-2 ${
        theme === "light"
          ? "bg-gradient-to-br from-gray-50 to-gray-100"
          : "bg-gradient-to-br from-gray-800 to-gray-900"
      }`}
    >
      <div className="max-w-full mx-auto">
        {/* Analysis Cards Section */}
        <AnalysisBox data={data} theme={theme} />

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
          {/* Statistics Chart */}
          <Stats data={data} theme={theme} />

          {/* Doctors and Articles Grid */}
          <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Doctors List */}
            <DoctorsList
              doctors={data?.randomDoctors}
              theme={theme}
              loading={loading}
              error={error}
            />

            {/* Articles List */}
            <ArticlesList
              articles={data?.articles}
              theme={theme}
              loading={loading}
              error={error}
            />
          </div>
        </div>

        {/* Bottom Section - Map and Medical History */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Interactive Doctors Map */}
          <DoctorsMap
            allDoctors={data?.allDoctors}
            randomDoctors={data?.randomDoctors}
            theme={theme}
            loading={loading}
            error={error}
          />

          {/* Medical History Panel */}
          <MedicalHistory data={data} theme={theme} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
