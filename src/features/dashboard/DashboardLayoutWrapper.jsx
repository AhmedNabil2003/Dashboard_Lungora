import { Outlet } from "react-router-dom";
import Sidebar from "../../components/ui/SidebarNav";
import Header from "../../components/ui/Header";
import { SidebarProvider } from "../../context/SidebarContext";
import { ThemeContext } from "../../context/ThemeProviderContext";
import ScrollButton from "../../components/ui/ScrollButton";
import Footer from "../../components/ui/Footer";
import { useContext } from "react";

const DashboardLayout = () => {
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
            theme === "light"
              ? "bg-gray-100 text-gray-900"
              : "bg-gray-800 text-gray-100"
          } overflow-hidden`}
        >
          {/* Header */}
          <Header />

          {/* Main content */}
          <main
            className={`flex-1 overflow-auto p-2 ${
              theme === "light" ? "bg-gray-100" : "bg-gray-900"
            }`}
          >
            <div className="max-w-screen-2xl mx-auto">
              {/* Outlet for child routes */}
              <Outlet />
              <Footer />
            </div>
          </main>
        </div>
        <ScrollButton />
      </div>
    </SidebarProvider>
  );
};

export default DashboardLayout;
