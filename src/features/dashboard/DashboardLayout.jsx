import { Outlet } from "react-router-dom";
import Sidebar from "../../components/ui/sidebarNav";
import Header from "../../components/ui/header";
import { SidebarProvider } from "../../context/sidebarContext";
import { ThemeContext } from "../../context/ThemeContext";
import ScrollButton from "../../components/ui/scrollButton";
import Footer from "../../components/ui/footer";
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
            theme === "light" ? "bg-gray-100 text-gray-900" : "bg-gray-800 text-gray-100"
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