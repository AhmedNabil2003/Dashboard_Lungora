import { Outlet } from "react-router-dom";
import Sidebar from "../../components/ui/Sidebar";
import Header from "../../components/ui/Header";
import { SidebarProvider } from "../../context/SidebarContext";
import { useContext } from "react";
import { ThemeContext } from "../../context/ThemeContext";

const DashboardLayout = () => {
  // الحصول على قيمة theme من ThemeContext
  const { theme } = useContext(ThemeContext);

  return (
    <SidebarProvider>
      <div
        className={`flex h-screen overflow-hidden ${
          theme === "light" ? "bg-gray-100" : "bg-gray-900"
        }`}
      >
        {/* Sidebar */}
        <Sidebar />

        <div
          className={`flex-1 flex flex-col ${
            theme === "light" ? "bg-gray-100 text-gray-900" : "bg-gray-800 text-gray-100"
          } overflow-hidden`}
        >
          {/* Header */}
          <Header />

          {/* Main content */}
          <main
            className={`flex-1 overflow-auto p-4 ${
              theme === "light" ? "bg-gray-100" : "bg-gray-900"
            }`}
          >
            <div className="max-w-screen-2xl mx-auto pb-4">
              {/* Outlet for child routes */}
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default DashboardLayout;
